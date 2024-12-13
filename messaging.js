import messaging from "@react-native-firebase/messaging";
import { Alert, AppRegistry } from "react-native";

// Request user permissions for notifications
async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log("Authorization status:", authStatus);
  }
}

// Listen for notifications
messaging().onMessage(async (remoteMessage) => {
  Alert.alert("New Notification!", JSON.stringify(remoteMessage.notification));
});

requestUserPermission();
