/*
//import "react-native-gesture-handler"; */
//This might be out of date but just putting here so i can
//install later and figure it out
//Checkout 11:40:45 in video
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import GoalScreen from "./Screens/GoalScreen";
import ProfileScreen from "./Screens/ProfileScreen";
import HomeScreen from "./Screens/HomeScreen";
import AppNavigation from "./navigation/appNavigation";
import LoginScreen from "./Screens/LoginScreen";
import RegisterScreen from "./Screens/RegisterScreen";

//const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const globalScreenOptions = {
  headerStyle: { backgroundColor: "#000000" },
  headerTitleStyle: { color: "white" },
  headerTintColor: "white",
};
//
export default function App() {
  /*
  {isLoggedIn ? (
  // Screens for logged in users
  <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
  ) : (
  //Auth Screens
          <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
)}
        */
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={globalScreenOptions}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    alignItems: "center",
    justifyContent: "center",
  },
});

/* // Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAHQEnhUuzdzk3uhNq9-J0XReXpJg-mxjA",
  authDomain: "reactapp-cb1d1.firebaseapp.com",
  projectId: "reactapp-cb1d1",
  storageBucket: "reactapp-cb1d1.appspot.com",
  messagingSenderId: "369733486152",
  appId: "1:369733486152:web:93bff227c081c4295aba7d",
  measurementId: "G-B94FHR3SE9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);*/

//npm install -g firebase-tools
