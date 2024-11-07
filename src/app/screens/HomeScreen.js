// src/screens/HomeScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import logo from "../../imgs/logo.png";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomModal from "../features/modal/CustomModal";
import * as SecureStore from "expo-secure-store";

export default function HomeScreen({ navigation }) {
  const [showChangelog, setShowChangelog] = useState(false);
  const [econmyTestReports, setEconmyTestReports] = useState([]);
  const [mangmentTestReports, setMangmentTestReports] = useState([]);
  const currentVersion = "0.3.0";

  useEffect(() => {
    // Fetch test results every time the screen is focused
    const focusListener = navigation.addListener("focus", async () => {
      const storedReports = await SecureStore.getItemAsync("economy_reports");
      if (storedReports) {
        setEconmyTestReports(JSON.parse(storedReports));
      }
    });

    // Clean up the listener when the component is unmounted
    return () => {
      focusListener(); // Removes the focus listener when HomeScreen unmounts
    };
  }, [navigation]);

  useEffect(() => {
    // Fetch test results every time the screen is focused
    const focusListener = navigation.addListener("focus", async () => {
      const storedReports = await SecureStore.getItemAsync("mangment_reports");
      if (storedReports) {
        setMangmentTestReports(JSON.parse(storedReports));
      }
    });

    // Clean up the listener when the component is unmounted
    return () => {
      focusListener(); // Removes the focus listener when HomeScreen unmounts
    };
  }, [navigation]);

  useEffect(() => {
    const checkForUpdate = async () => {
      const lastSeenVersion = await AsyncStorage.getItem("lastVersion");
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
    <ScrollView style={styles.container}>
      <CustomModal
        visible={showChangelog}
        message={
          "تم تحديث البرنامج! \n\n+ اسئلة على المحاضرات\n+ تقارير الاسئلة"
        }
        onClose={handleCloseModal}
      />

      <View style={styles.news}>
        <Text style={styles.newsHeading}>ما الجديد؟</Text>
        <Text style={styles.newsBody}>مراجعة اللغة الأجنبية</Text>
        <Text style={styles.newsBody}>اسئلة على المحاضرات</Text>
      </View>

      <View style={styles.news}>
        <Text style={styles.newsHeading}>تقارير أسئلة الاقتصاد</Text>
        {econmyTestReports.length > 0 ? (
          econmyTestReports.map((report, index) => (
            <View key={index} style={styles.reportItem}>
              <Text style={styles.newsBody}>{report.testName}</Text>
              <Text style={styles.dateBody}>
                {new Date(report.timestamp).toLocaleString()}
              </Text>
              <Text style={styles.newsBody}>
                الدرجة: {report.grade} / {report.totalQuestions}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.newsBody}>لا توجد نتائج مسجلة.</Text>
        )}
      </View>

      <View style={[styles.news, { marginBottom: 48 }]}>
        <Text style={styles.newsHeading}>تقارير أسئلة إدارة الأعمال</Text>
        {mangmentTestReports.length > 0 ? (
          mangmentTestReports.map((report, index) => (
            <View key={index} style={styles.reportItem}>
              <Text style={styles.newsBody}>{report.testName}</Text>
              <Text style={styles.dateBody}>
                {new Date(report.timestamp).toLocaleString()}
              </Text>
              <Text style={styles.newsBody}>
                الدرجة: {report.grade} / {report.totalQuestions}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.newsBody}>لا توجد نتائج مسجلة.</Text>
        )}
      </View>
    </ScrollView>
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
  container: {
    flex: 1,
    gap: 8,
    padding: 24,
  },
  news: {
    width: "100%",
    flexDirection: "column",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: 24,
  },
  newsHeading: {
    fontSize: 24,
    color: "#000",
    fontFamily: "Tajawal-Bold",
  },
  newsBody: {
    fontSize: 18,
    color: "#000",
    fontFamily: "Tajawal-Medium",
  },
  reportItem: {
    marginTop: 8,
  },

  dateBody: {
    textAlign: "right",
    opacity: 0.5,
  },
});
