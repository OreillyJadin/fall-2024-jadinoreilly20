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
  const [newTask, setNewTask] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null); // New state for tracking the task being edited
  const [editingText, setEditingText] = useState("");

  const fetchUserTasks = async () => {
    const user = auth.currentUser; // Get the current user
    if (user) {
      const tasksRef = collection(db, "Users", user.uid, "tasks"); // Users.uid.tasks subcollection reference
      const q = query(tasksRef);

      // Real-time listener for changes in the user's tasks
      onSnapshot(q, (querySnapshot) => {
        const fetchedTasks = [];
        querySnapshot.forEach((doc) => {
          fetchedTasks.push({ id: doc.id, ...doc.data() });
        });
        setTasks(fetchedTasks);
      });
    } else {
      console.log("User is not logged in - Goal Screen.");
    }
  };

  useEffect(() => {
    fetchUserTasks();
  }, []);

  // Function to toggle the completed status of a task
  const toggleComplete = async (taskId, currentStatus) => {
    const user = auth.currentUser;
    const taskRef = doc(db, "Users", user.uid, "tasks", taskId); // Reference to the specific task
    await updateDoc(taskRef, {
      completed: !currentStatus,
    });
  };

  // Function to delete a task
  const deleteTask = async (taskId) => {
    const user = auth.currentUser;
    const taskRef = doc(db, "Users", user.uid, "tasks", taskId); // Reference to the specific task
    await deleteDoc(taskRef);
  };

  // Function to add a new task
  const addTask = async () => {
    const user = auth.currentUser;
    const tasksRef = collection(db, "Users", user.uid, "tasks"); // Reference to the user's tasks subcollection

    if (newTask.trim().length > 0) {
      await addDoc(tasksRef, {
        text: newTask,
        completed: false,
      });
      setNewTask(""); // Reset the input field after adding
    } else {
      console.log("Task cannot be empty!");
    }
  };

  // Function to save the edited task
  const saveEditedTask = async (taskId) => {
    const user = auth.currentUser;
    const taskRef = doc(db, "Users", user.uid, "tasks", taskId); // Reference to the specific task
    await updateDoc(taskRef, {
      text: editingText,
    });
    setEditingTaskId(null); // Exit edit mode
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 10 }}>Tasks</Text>
      {/* List of tasks if user has one */}
      {tasks.length > 0 ? (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.taskItem}>
              <CheckBox
                checked={item.completed}
                onPress={() => toggleComplete(item.id, item.completed)}
              />
              {editingTaskId === item.id ? (
                <TextInput
                  value={editingText}
                  onChangeText={setEditingText}
                  style={styles.input}
                />
              ) : (
                <Text
                  style={{
                    flex: 1,
                    textDecorationLine: item.completed
                      ? "line-through"
                      : "none",
                  }}
                >
                  {item.text}
                </Text>
              )}

              {editingTaskId === item.id ? (
                <Button title="Save" onPress={() => saveEditedTask(item.id)} />
              ) : (
                <Button
                  title="Edit"
                  onPress={() => {
                    setEditingTaskId(item.id);
                    setEditingText(item.text); // Set the current task text in the input field
                  }}
                />
              )}

              <Button title="Delete" onPress={() => deleteTask(item.id)} />
            </View>
          )}
        />
      ) : (
        <Text>No tasks found.</Text>
      )}

      {/* Input for adding a new task */}
      <View style={styles.addTaskContainer}>
        <TextInput
          value={newTask}
          onChangeText={setNewTask}
          placeholder="Enter new task"
          style={styles.input}
        />
        <Button title="Add Task" onPress={addTask} />
      </View>
    </View>
  );
};

export default MiddleScreen;

const styles = StyleSheet.create({
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  addTaskContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
  },
});
