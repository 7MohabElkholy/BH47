// src/screens/HomeScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import logo from "../../imgs/logo.png";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomModal from "../features/modal/CustomModal";

export default function HomeScreen() {
  const [showChangelog, setShowChangelog] = useState(false);
  const currentVersion = "0.2.0";

  useEffect(() => {
    const checkForUpdate = async () => {
      const lastSeenVersion = await AsyncStorage.getItem("lastVersion");

      // If the last seen version differs from the current version, show the modal
      if (lastSeenVersion !== currentVersion) {
        setShowChangelog(true);
      }
    };

    checkForUpdate();
  }, []);

  const handleCloseModal = async () => {
    // Set the current version in AsyncStorage so the modal doesn't appear again
    await AsyncStorage.setItem("lastVersion", currentVersion);
    setShowChangelog(false);
  };

  return (
    <View style={styles.container}>
      <CustomModal
        visible={showChangelog}
        message={
          "تم تحديث البرنامج! \n\n+ رسالة التحديث\n+ رقم الصفحة في وضع القرائة\n+ شاشة معلومات التطبيق"
        }
        onClose={handleCloseModal}
      />

      <View style={styles.news}>
        <Text style={styles.newsHeading}>ما الجديد؟</Text>
        <Text style={styles.newsBody}>مراجعة اللغة الأجنبية</Text>
        <Text style={styles.newsBody}>محاضرات القانون</Text>
      </View>

      <View style={styles.news}>
        <Text style={styles.newsHeading}>تقرير أسئلة الاقتصاد</Text>
      </View>
      <View style={styles.news}>
        <Text style={styles.newsHeading}>تقرير أسئلة إدارة الاعمال</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 8,
    padding: 24,
  },

  news: {
    width: "100%",
    flexDirection: "column", // Align items horizontally
    paddingHorizontal: 24, // Horizontal padding for the button
    paddingVertical: 16,
    borderRadius: 16, // Rounded corners
    backgroundColor: "#fff", // Added a background color for better visibility

    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    // Elevation for Android
    elevation: 5,
    marginTop: 24,
  },

  newsHeading: {
    fontSize: 24, // Text size
    color: "#000", // Text color
    fontFamily: "Tajawal-Bold",
  },

  newsBody: {
    fontSize: 18, // Text size
    color: "#000", // Text color
    fontFamily: "Tajawal-Medium",
  },
});
