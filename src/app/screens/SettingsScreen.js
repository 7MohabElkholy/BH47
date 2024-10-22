import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Button } from "react-native";
import SettingsNav from "../components/SettingsNav";

const SettingsScreen = () => {
  return (
    <View style={{ paddingHorizontal: 24, paddingVertical: 64 }}>
      <SettingsNav text="الحساب" icon="person-circle-outline" nav="account" />

      {/* <Button
        title="Go to Sub Settings 1"
        onPress={() => navigation.navigate("SubSettingsScreen1")}
      /> */}
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({});
