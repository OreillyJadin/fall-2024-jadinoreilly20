import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import GoalScreen from "./GoalScreen";
import ProfileScreen from "./ProfileScreen";
import MiddleScreen from "./MiddleScreen";

const Tab = createBottomTabNavigator();

const HomeScreen = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Goals" component={GoalScreen} />
      <Tab.Screen name="Middle" component={MiddleScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
