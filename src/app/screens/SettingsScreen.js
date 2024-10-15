import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, setUser } from "../userSlice";
import { auth } from "../firebase";
import { signOut as firebaseSignOut } from "firebase/auth"; // Renaming the Firebase signOut function

export default function SettingsScreen() {
  const currentUser = useSelector(selectUser);
  const dispatch = useDispatch();

  function handleSignOut() {
    firebaseSignOut(auth)
      .then(() => {
        dispatch(setUser(null));
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <View style={styles.container}>
      <Text>{currentUser.email}</Text>
      <TouchableOpacity onPress={handleSignOut}>
        <Text>LOG OUT</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
