import { StyleSheet, Text, View } from "react-native";
import React from "react";
import SettingsNav from "../components/SettingsNav";

const SettingsScreen = () => {
  return (
    <View style={{ paddingHorizontal: 24, paddingVertical: 64 }}>
      <SettingsNav text="الحساب" icon="person-circle-outline" nav="account" />
      <SettingsNav text="تواصل معنا" icon="chatbubbles" nav="support" />
      <SettingsNav
        text="معلومات التطبيق"
        icon="information-circle"
        nav="info"
      />

      {/* <Button
        title="Go to Sub Settings 1"
        onPress={() => navigation.navigate("SubSettingsScreen1")}
      /> */}
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({});
