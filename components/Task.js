import { View, Text, StyleSheet, TextInput, Button } from "react-native";
import React, { useEffect, useState } from "react";
import { CheckBox } from "react-native-elements";
import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

const Task = () => {
  //const tasksRef = collection(db, 'tasks');
  const [tasks, setTasks] = useState("");

  const addTask = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      if (user) {
        const tasksRef = collection(db, "tasks");
        await addDoc(tasksRef, {
          text: e,
          isChecked: false,
          createdAt: new Date(),
        });
      }
      console.log("User ", user.displayName, " created a task: ", user.task);
    } catch (error) {
      console.error("Error adding task: ", error.message);
    }
  };
//Going to bathroom. Need to fix thid
  return (
    //list of tasks
    <View style={styles.tasksList}>
      <View style={styles.task}>
        <View style={styles.taskLeft}>
          <CheckBox checked={false} />
          <TextInput
            label={"New Task"}
            value={task}
            onChangeText={setCreateTask}
          />
        </View>
        <View style={styles.taskMiddle}></View>
        <View style={styles.taskRight}>
          <Button onPress={() => {}}>Edit</Button>
          <Button onPress={() => {}}>Delete</Button>
        </View>
      </View>
      <Button onPress={() => {}}>Add Task</Button>
    </View>
  );
};

export default Task;

const styles = StyleSheet.create({});
