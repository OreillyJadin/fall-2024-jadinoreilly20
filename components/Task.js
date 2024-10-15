import { View, Text, StyleSheet } from "react-native";
import React from "react";

function Task() {
  const [task, setTask] = useState("");
  const ref = firestore().collection("Tasks");
  return (
    <View style={styles.tasksWrapper}>
      <TextInput label={"New Task"} value={task} onChangeText={setTask} />
      <Button onPress={() => {}}>Add TODO</Button>
    </View>
  );
}

const styles = StyleSheet.create({});

export default Task;
