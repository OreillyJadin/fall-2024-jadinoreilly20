import { StyleSheet, Text, View } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Button, Input } from "react-native-elements";
import { StatusBar } from "expo-status-bar";
import { KeyboardAvoidingView } from "react-native";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitle: "Login",
    });
  }, [navigation]);
  /*
  // Create user
  const signUp = (email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log("User created:", user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(`Error [${errorCode}]: ${errorMessage}`);
      });
  };*/
  /* 9-25-24 1pm trying this handleRegister instead
  //should i have const register = async () => {??
  const register = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        console.log("User created!");
      })
      .catch((error) => alert(error.message));
    console.log("Inside register!");
  };*/

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      auth.currentUser.displayName = name;
      const user = auth.currentUser;
      console.log("User Registered: ", user.displayName);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <StatusBar style="light" />
      <Text h3 style={{ marginBottom: 50 }}>
        Create an account
      </Text>
      <View style={styles.inputContainer}>
        <Input
          placeholder="Full Name"
          autoFocus
          type="text"
          value={name}
          onChangeText={(text) => setName(text)}
        />
        <Input
          placeholder="Email"
          type="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />

        <Input
          placeholder="Password"
          secureTextEntry
          type="password"
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
      </View>
      <Button
        onPress={handleRegister}
        containerStyle={styles.button}
        title="Register"
        buttonStyle={{ backgroundColor: "black" }}
        titleStyle={{ color: "white" }}
      />
      <View style={{ height: 100 }} />
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  inputContainer: {
    width: "85%",
    padding: 10,
  },
  button: {
    width: "50%",
    padding: 10,
    marginTop: "3%",
  },
});
