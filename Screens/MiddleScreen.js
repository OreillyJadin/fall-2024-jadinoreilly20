import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { ScrollView } from "react-native";

const GoalScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Middle Screen!</Text>
      <ScrollView>
        
      </ScrollView>
    </SafeAreaView>
  );
};

export default GoalScreen;

const styles = StyleSheet.create({});
