import { initializeApp } from "firebase/app"; //GG
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
/*/ Error message told me to do this 
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
*/

const firebaseConfig = {
  apiKey: "AIzaSyAHQEnhUuzdzk3uhNq9-J0XReXpJg-mxjA",
  authDomain: "reactapp-cb1d1.firebaseapp.com",
  projectId: "reactapp-cb1d1",
  storageBucket: "reactapp-cb1d1.appspot.com",
  messagingSenderId: "369733486152",
  appId: "1:369733486152:web:93bff227c081c4295aba7d",
  measurementId: "G-B94FHR3SE9",
};

const app = initializeApp(firebaseConfig); //GG
/*/Error message told me to do this
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
*/
const auth = getAuth(app);
const db = getFirestore(app); //GG

export { db, auth };
//export { auth };
