/*
import { StyleSheet, Text, View, TouchableOpacity, Switch } from "react-native";
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { Button } from "react-native-elements";

const ProfileScreen = ({ navigation }) => {
  /*
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
  const handleLogout() => {
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
  /*
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Profile Screen</Text>
      {userDetails ? (
        <View style={{ marginTop: 20 }}>
          <Text>Name: {userDetails.displayName}</Text>
          <Text>Email: {userDetails.email}</Text>
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
});*/

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Switch,
} from "react-native";
//import DateTimePicker from "@react-native-community/datetimepicker";
import Svg, { Circle } from "react-native-svg";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { Button } from "react-native-elements";
import useStreak from "../components/useStreak";

export default function ProfileScreen({ navigation }) {
  const streak = useStreak();
  const [modalVisible, setModalVisible] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const [profileData, setProfileData] = useState(null);

  const [editData, setEditData] = useState(null);

  const userId = auth.currentUser.uid;
  const [age, setAge] = useState(null);
  //---------------------------TESTING-------------------------------

  const [editingField, setEditingField] = useState(null);
  const [fieldValue, setFieldValue] = useState("");

  const startEditing = (field, currentValue) => {
    setEditingField(field);
    setFieldValue(currentValue);
  };

  const saveChanges = () => {
    if (editingField) {
      saveEditedUserData(editingField, fieldValue);
      setEditingField(null);
      //setFieldValue("");
      setModalVisible(false);
    }
  };

  const discardChanges = () => {
    setEditingField(null); // Exit edit mode
    //setFieldValue(""); // Clear temporary input
    setModalVisible(false);
  };
  //---------------------------TESTING-------------------------------
  /*
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const docRef = doc(db, "Users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setProfileData(data); // Update profile data with Firestore data
            setEditData(data); // Sync edit data with fetched profile
          } else {
            console.error("No such user document!");
          }
        } else {
          console.log("User is not logged in - Profile Screen.");
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchUserData(); // Call the function
  }, []); // Empty dependency array ensures this runs once on mount
*/
  useEffect(() => {
    // Listener setup
    const unsubscribe = () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const docRef = doc(db, "Users", user.uid);

          // Set up a Firestore listener
          const unsubscribeListener = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data();
              calculateAge(data.birthday);
              setProfileData(data); // Update profile data with Firestore data
              setEditData(data); // Sync edit data with fetched profile
              calculateAge(data.birthday);
            } else {
              console.error("No such user document!");
            }
          });

          // Return the unsubscribe function
          return unsubscribeListener;
        } else {
          console.log("User is not logged in - Profile Screen.");
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    // Call the listener setup
    const unsubscribeListener = unsubscribe();

    // Cleanup listener on unmount
    return () => {
      if (unsubscribeListener) unsubscribeListener();
    };
  }, []); // Empty dependency array ensures this runs once on mount
  /*
  useEffect(() => {
    if (profileData.birthday) {
      calculateAge(profileData.birthday)
        .then((calculatedAge) => {
          setAge(calculatedAge); // Update age in state
        })
        .catch((error) => console.error(error));
    }
  }, [profileData.birthday]);
*/
  //---------------------------TESTING-------------------------------
  const saveEditedUserData = async (field, value) => {
    try {
      if (field === "birthday") {
        // Validate birthday format (MM/DD/YYYY)
        const birthdayRegex =
          /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
        if (!birthdayRegex.test(value)) {
          Alert.alert(
            "Invalid Birthday",
            "Please enter a valid date in MM/DD/YYYY format."
          );
          return;
        }
      }
      const user = auth.currentUser;
      const userRef = doc(db, "Users", user.uid); // Reference to the user's document
      await updateDoc(userRef, {
        [field]: value, // Dynamic field update
      });
      console.log(`${field} updated successfully.`);
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
    }
  };

  //---------------------------TESTING-------------------------------

  const handleSave = async () => {
    try {
      await updateDoc(doc(db, "users", userId), editData);
      setProfileData(editData);
      setModalVisible(false);
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile.");
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "users", userId));
              await auth.currentUser.delete();
              navigation.reset({
                index: 0,
                routes: [{ name: "Signup" }],
              });
            } catch (error) {
              console.error("Error deleting account:", error.message);
              Alert.alert("Error", "Failed to delete account.");
            }
          },
        },
      ]
    );
  };
  //          <Text>Email: {userDetails.email}</Text>
  if (!profileData) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  function calculateAge(birthday) {
    return new Promise((resolve, reject) => {
      try {
        const [month, day, year] = birthday.split("/");
        const birthDate = new Date(`${year}-${month}-${day}`);
        const currentDate = new Date();

        if (isNaN(birthDate)) throw new Error("Invalid date format");

        // Calculate age in milliseconds
        const ageInMilliseconds = currentDate - birthDate;

        // Convert milliseconds to years
        const ageInYears = ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);

        // Return the age with 8 decimal points
        resolve(ageInYears.toFixed(8));

        setAge(ageInYears.toFixed(8));
      } catch (error) {
        reject("Invalid date format");
      }
    });
  }
  return (
    <View style={styles.container}>
      <View style={{ marginTop: 20 }}>
        <Text>{age}</Text>
      </View>
      {/* Profile Picture */}
      <Svg height="100" width="100" style={styles.profilePic}>
        <Circle
          cx="50"
          cy="50"
          r="45"
          stroke="blue"
          strokeWidth="2.5"
          fill="lightgray"
        />
      </Svg>

      <Text style={styles.name}>{profileData.displayName}</Text>
      <Text>Email: {profileData.email}</Text>

      {/* Streak and Completed Tasks */}
      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>🔥 Streak: {streak} days</Text>
        <Text style={styles.statsText}> ✅ Completed Tasks: 50</Text>
      </View>

      {/* Profile Fields */}
      <Text style={styles.label}>Bio</Text>
      <Text style={styles.value}>{profileData.bio}</Text>

      <Text style={styles.label}>Location</Text>
      <Text style={styles.value}>{profileData.location}</Text>

      <Text style={styles.label}>Main Goal</Text>
      <Text style={styles.value}>{profileData.mainGoal}</Text>

      {/* Settings */}
      <View style={styles.settingsContainer}>
        <Text style={styles.settingsLabel}>Dark Mode</Text>
        <Switch value={darkMode} onValueChange={setDarkMode} />
      </View>
      <View style={styles.settingsContainer}>
        <Text style={styles.settingsLabel}>Enable Notifications</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
        />
      </View>

      {/* Edit Button */}
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>
      <Button
        onPress={handleLogout}
        containerStyle={styles.logoutButtonContainer}
        title="Logout"
        type="clear"
      />

      {/* ------------------Edit Profile Modal-------------------*/}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            {/* Email----- Later on will use firebase/auth */}
            <View style={styles.editableField}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder={profileData.email}
                //value={profileData.mainGoal || "Add Main Goal"}
                onChangeText={setFieldValue}
                onPress={() => startEditing("email", profileData.email)}
              />
            </View>
            {/* password----- Later on will use firebase/auth */}
            {/* Phone Number----- Later on will use firebase/auth */}
            {/* Name */}
            <View style={styles.editableField}>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                style={styles.input}
                placeholder={profileData.displayName}
                //value={profileData.mainGoal || "Add Main Goal"}
                onChangeText={setFieldValue}
                onPress={() =>
                  startEditing("displayName", profileData.displayName)
                }
              />
            </View>
            {/* Bio */}
            <View style={styles.editableField}>
              <Text style={styles.inputLabel}>Bio</Text>
              <TextInput
                style={styles.input}
                placeholder={profileData.bio}
                //value={profileData.mainGoal || "Add Main Goal"}
                onChangeText={setFieldValue}
                onPress={() => startEditing("bio", profileData.bio)}
              />
            </View>
            {/* Location */}
            <View style={styles.editableField}>
              <Text style={styles.inputLabel}>Location</Text>
              <TextInput
                style={styles.input}
                placeholder={profileData.location}
                //value={profileData.mainGoal || "Add Main Goal"}
                onChangeText={setFieldValue}
                onPress={() => startEditing("location", profileData.location)}
              />
            </View>
            {/* Main Goal */}
            <View style={styles.editableField}>
              <Text style={styles.inputLabel}>Main Goal</Text>
              <TextInput
                style={styles.input}
                placeholder={profileData.mainGoal}
                //value={profileData.mainGoal || "Add Main Goal"}
                onChangeText={setFieldValue}
                onPress={() => startEditing("mainGoal", profileData.mainGoal)}
              />
            </View>
            {/* Birthday */}
            <View style={styles.editableField}>
              <Text style={styles.inputLabel}>Birthday</Text>
              <TextInput
                style={styles.input}
                placeholder={profileData.birthday}
                //value={profileData.birthday}
                onChangeText={setFieldValue}
                onPress={() => startEditing("birthday", profileData.birthday)}
                //keyboardType="numeric"
              />
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.saveButton} onPress={saveChanges}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDeleteAccount}
              >
                <Text style={styles.deleteButtonText}>Delete Account</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.discardButton}
                onPress={discardChanges}
              >
                <Text style={styles.discardButtonText}>Discard</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  profilePic: {
    marginBottom: 20,
    //borderWidth: 1, //----------For Testing
    //borderColor: "red", //----------For Testing
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "95%",
    marginVertical: 10,
    //borderWidth: 1, //----------For Testing
    //borderColor: "blue", //----------For Testing
  },
  statsText: {
    fontSize: 16,
    fontWeight: "600",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
  },
  value: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
  settingsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    alignItems: "center",
    marginTop: 10,
  },
  settingsLabel: {
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },

  editableField: {
    width: "100%",
    marginBottom: 15,
    alignItems: "flex-start",
  },
  input: {
    width: "99%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "bold",
    alignSelf: "flex-start",
    //marginBottom: 5, // Adds slight spacing between the label and input
  },
  saveButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  discardButton: {
    backgroundColor: "#d3d3d3",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  discardButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "110%",
    marginVertical: 20,
  },
  editButton: {
    marginTop: 30,
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  logoutButtonContainer: {
    position: "absolute",
    bottom: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
