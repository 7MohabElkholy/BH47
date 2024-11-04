import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD6W9pBU48Ywh-S59jOfG4PENpDImh2PNk",
  authDomain: "bh47-f1e97.firebaseapp.com",
  projectId: "bh47-f1e97",
  storageBucket: "bh47-f1e97.appspot.com",
  messagingSenderId: "959574238910",
  appId: "1:959574238910:web:af41d0d87867fae3a5a0ef",
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export const db = getFirestore(app);
export const storage = getStorage(app);
