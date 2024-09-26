import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { Button } from "react-native-elements";
import LoginScreen from "./LoginScreen";
const ProfileScreen = ({ navigation }) => {
  const [userDetails, setUserDetails] = useState(null);

  const fetchUserData = async () => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        console.log("fetchUserData(): ", user.email);
        const docRef = doc(db, "Users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserDetails(docSnap.data());
          console.log("docSnap.(): ", docSnap.data());
        } else {
          console.log("docSnap does not exist! - Profile Screen.");
        }
      } else {
        console.log("User is not logged in - Profile Screen.");
      }
    });
  };
  useEffect(() => {
    fetchUserData();
  }, []);
  //should this be async function or just const?
  //const handleLogout() => {
  async function handleLogout() {
    try {
      await auth.signOut();
      console.log("User logged out successfully!");
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Profile Screen</Text>
      {userDetails ? (
        <View style={{ marginTop: 20 }}>
          <Text>Name: {userDetails.displayName}</Text>
          <Text>Email: {userDetails.email}</Text>
          {/* Add other user details as needed */}
        </View>
      ) : (
        <Text>Loading...</Text>
      )}
      <View>
        <Button
          onPress={handleLogout}
          containerStyle={styles.logoutButtonContainer}
          title="Logout"
          buttonStyle={{ backgroundColor: "black" }}
          titleStyle={{ color: "white" }}
        />
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  logoutButtonContainer: {
    position: "absolute",
    bottom: 0, // Adjust this value if you need more/less spacing from the bottom
    width: "65%",
    justifyContent: "center",
    alignItems: "center",
  },
});
