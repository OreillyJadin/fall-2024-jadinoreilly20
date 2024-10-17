import {
  StyleSheet,
  Text,
  View,
  FlatList,
  SafeAreaView,
  TextInput,
  Button,
} from "react-native";
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  collection,
  query,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  addDoc,
} from "firebase/firestore";
import { CheckBox } from "react-native-elements";
//import Task from "../components/task";

const MiddleScreen = () => {
  const [tasks, setTasks] = useState([]);

  // Function to fetch the user's tasks
  const fetchUserTasks = async () => {
    const user = auth.currentUser; // Get the current user
    if (user) {
      const todosRef = collection(db, "Users", user.uid, "tasks"); // Reference to the user's tasks subcollection
      const q = query(todosRef);

      // Real-time listener for changes in the user's tasks
      onSnapshot(q, (querySnapshot) => {
        const fetchedTasks = [];
        querySnapshot.forEach((doc) => {
          fetchedTasks.push({ id: doc.id, ...doc.data() });
        });
        setTasks(fetchedTasks); // Set the fetched tasks in state
      });
    } else {
      console.log("User is not logged in - Goal Screen.");
    }
  };

  useEffect(() => {
    fetchUserTasks(); // Fetch the tasks when the component mounts
  }, []);

  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <Text>Tasks</Text>
      {tasks.length > 0 ? (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.taskItem}>
              <Text>{item.text}</Text>
              <Text>{item.isChecked ? "Completed" : "Incomplete"}</Text>
            </View>
          )}
        />
      ) : (
        <Text>No tasks found.</Text>
      )}
    </SafeAreaView>
  );
};

export default MiddleScreen;

const styles = StyleSheet.create({
  taskItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
});
