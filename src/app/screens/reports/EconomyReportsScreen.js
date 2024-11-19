import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { ScrollView } from "react-native-gesture-handler";

const EconomyReportsScreen = () => {
  const [econmyTestReports, setEconmyTestReports] = useState([]);

  const navigation = useNavigation(); // Moved this inside the component function

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

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {econmyTestReports.length > 0 ? (
        econmyTestReports.map((report, index) => (
          <View key={index} style={styles.test}>
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
    </ScrollView>
  );
};

export default EconomyReportsScreen;

const styles = StyleSheet.create({
  //   news: {
  //     width: "100%",
  //     flexDirection: "column", // Align items horizontally
  //     paddingHorizontal: 24, // Horizontal padding for the button
  //     paddingVertical: 16,
  //     borderRadius: 16, // Rounded corners
  //     backgroundColor: "#fff", // Added a background color for better visibility

  //     // Shadow for iOS
  //     shadowColor: "#000",
  //     shadowOffset: {
  //       width: 0,
  //       height: 2,
  //     },
  //     shadowOpacity: 0.25,
  //     shadowRadius: 3.84,

  //     // Elevation for Android
  //     elevation: 5,
  //     marginTop: 24,
  //   },

  test: {
    // paddingHorizontal: 16,
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderColor: "#0000002f",
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
