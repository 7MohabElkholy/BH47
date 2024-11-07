import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import TestReader from "../../components/TestReader";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../../firebase"; // Assuming firebase is set up in firebase.js
import * as FileSystem from "expo-file-system";

const EconmyTestScreen = () => {
  const [isTakingTest, setIsTakingTest] = useState(false);
  const [testData, setTestData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFetchTest = async (testIndex) => {
    setLoading(true);
    try {
      const fileRef = ref(storage, `tests/Economy/${testIndex}.json`); // Path in Firebase Storage
      const url = await getDownloadURL(fileRef);

      // Fetch JSON data from the URL
      const response = await fetch(url);
      const data = await response.json();
      setTestData(data);
      setIsTakingTest(true);
    } catch (error) {
      Alert.alert("Error", "Could not load test data.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return isTakingTest ? (
    <TestReader testData={testData} subjectKey="economy_reports" />
  ) : (
    <View style={styles.main}>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      <TouchableOpacity
        style={styles.btn}
        onPress={() => handleFetchTest("test1")}
      >
        <Text style={styles.btnText}>المحاضرة الاولى</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => handleFetchTest("test2")}
      >
        <Text style={styles.btnText}>المحاضرة الثانية</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => handleFetchTest("economyTest3")}
      >
        <Text style={styles.btnText}>المحاضرة الثالثة</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => handleFetchTest("economyTest4")}
      >
        <Text style={styles.btnText}>المحاضرة الرابعة</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => handleFetchTest("economyTest5")}
      >
        <Text style={styles.btnText}>المحاضرة الخامسة</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EconmyTestScreen;

const styles = StyleSheet.create({
  main: {
    padding: 24,
    gap: 16,
  },
  btn: {
    padding: 16,
    backgroundColor: "#fff",
    flexGrow: 1,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  btnText: {
    fontFamily: "Tajawal-Medium",
    fontSize: 18,
  },
});
