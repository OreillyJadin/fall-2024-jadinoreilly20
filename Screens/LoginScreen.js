import {
  StyleSheet,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Button, Input } from "react-native-elements";
import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message";
import { handleAuthError } from "../error";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const unSub = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        navigation.replace("Home");
      }
    });
    return unSub;
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      /*
      console.log(
        "LoginScreen - handleLogin() User Logged In: ",
        user.displayName
      );*/
      Toast.show({
        type: "success",
        text1: "Login Successfull",
        text2: `Welcome back!`,
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
      <View style={styles.inputContainer}>
        <Input
          placeholder="Email"
          autoFocus
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
        containerStyle={styles.button}
        onPress={handleLogin}
        title="Login"
        buttonStyle={{ backgroundColor: "black" }}
        titleStyle={{ color: "white" }}
      />
      <Button
        onPress={() => navigation.navigate("Register")}
        containerStyle={styles.button}
        type="outline"
        title="Register"
        buttonStyle={{ borderColor: "black" }}
        titleStyle={{ color: "black" }}
      />
      <View style={{ height: 100 }} />
    </KeyboardAvoidingView>
  );
};

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
    pading: 10,
    width: "50%",
    marginTop: "3%",
  },
});

export default LoginScreen;
