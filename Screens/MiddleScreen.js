import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { ScrollView } from "react-native";
//import { doc, getDoc } from "firebase/firestore";
//import { Button } from "react-native-elements";
//import Task from "../components/Task";

const GoalScreen = () => {
  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <View>
        <Text>Calendar</Text>
      </View>
      <ScrollView>
        <Text>Task 1</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default GoalScreen;

const styles = StyleSheet.create({
  /*
  tasksWrapper: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },*/
});
