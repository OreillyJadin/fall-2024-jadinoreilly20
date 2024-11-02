import { StyleSheet, Text, View, Alert } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Button, Input } from "react-native-elements";
import { StatusBar } from "expo-status-bar";
import { KeyboardAvoidingView } from "react-native";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import Toast from "react-native-toast-message";
import { handleAuthError } from "../error";

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitle: "Login",
    });
  }, [navigation]);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      auth.currentUser.displayName = name;
      const user = auth.currentUser;
      if (user) {
        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          displayName: name,
        });
      }
      console.log("User Registered: ", user.displayName);
      //toast.success("User Register: ") This will alert the user
      Toast.show({
        type: "success",
        text1: "Register Successfull",
        text2: `Welcome, ${user.displayName}!`,
      });
    } catch (error) {
      const errorMessage = handleAuthError(error);
      console.log(error.message);
      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2: errorMessage,
      });
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
