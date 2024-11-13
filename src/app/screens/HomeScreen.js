// src/screens/HomeScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import logo from "../../imgs/logo.png";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomModal from "../features/modal/CustomModal";
import * as SecureStore from "expo-secure-store";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../userSlice";
import { signOut as firebaseSignOut } from "firebase/auth";

export default function HomeScreen({ navigation }) {
  const [showChangelog, setShowChangelog] = useState(false);
  const [lockAcc, setLockAcc] = useState(false);
  const [econmyTestReports, setEconmyTestReports] = useState([]);
  const [mangmentTestReports, setMangmentTestReports] = useState([]);
  const [studentCode, setStudentCode] = useState(""); // Store user input
  const [locationMessage, setLocationMessage] = useState(""); // Store location message
  const currentVersion = "0.3.0";

  const currentUser = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(currentUser.isLocked);

    if (currentUser.isLocked) {
      setLockAcc(true);
    }
  }, [currentUser]);

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

  function handleSignOut() {
    firebaseSignOut(auth)
      .then(() => {
        dispatch(setUser(null));
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const handleStudentLocation = () => {
    // Convert the student code to a number and determine the correct message
    const code = parseInt(studentCode, 10);
    let message = "";

    if (code >= 250001 && code <= 250040) {
      message = "مدرج (1) يمين";
    } else if (code >= 250041 && code <= 250075) {
      message = "مدرج (1) يسار";
    } else if (code >= 250076 && code <= 250110) {
      message = "مدرج (2) يمين";
    } else if (code >= 250111 && code <= 250150) {
      message = "مدرج (2) يسار";
    } else if (code >= 250151 && code <= 250190) {
      message = "مدرج (3) يمين";
    } else if (code >= 250191 && code <= 250225) {
      message = "مدرج (3) يسار";
    } else if (code >= 250226 && code <= 250260) {
      message = "مدرج (4) يمين";
    } else if (code >= 250261 && code <= 250300) {
      message = "مدرج (4) يسار";
    } else if (code >= 250301 && code <= 250340) {
      message = "مدرج (5) يمين";
    } else if (code >= 250341 && code <= 250375) {
      message = "مدرج (5) يسار";
    } else if (code >= 250376 && code <= 250410) {
      message = "مدرج (6) يمين";
    } else if (code >= 250411 && code <= 250450) {
      message = "مدرج (6) يسار";
    } else if (code >= 250451 && code <= 250487) {
      message = "مدرج (7) يمين";
    } else if (code >= 250488 && code <= 250525) {
      message = "مدرج (7) يسار";
    } else if (code >= 250526 && code <= 250562) {
      message = "مدرج (8) يمين";
    } else if (code >= 250563 && code <= 250600) {
      message = "مدرج (8) يسار";
    } else if (code >= 250601 && code <= 250633) {
      message = "قاعة (401) يمين";
    } else if (code >= 250634 && code <= 250665) {
      message = "قاعة (401) يسار";
    } else if (code >= 250666 && code <= 250685) {
      message = "قاعة الإطلاع (يمين)";
    } else if (code >= 250686 && code <= 250705) {
      message = "قاعة الإطلاع (يسار)";
    } else if (code >= 250706 && code <= 250750) {
      message = "قاعة المكتبة (يمين)";
    } else if (code >= 250751 && code <= 250795) {
      message = "قاعة المكتبة (يسار)";
    } else if (code >= 250796 && code <= 250870) {
      message = "قاعة (501) يمين";
    } else if (code >= 250871 && code <= 250945) {
      message = "قاعة (501) يسار";
    } else if (code >= 250946 && code <= 251020) {
      message = "قاعة (502) يمين";
    } else if (code >= 251021 && code <= 251095) {
      message = "قاعة (502) يسار";
    } else if (code >= 251096 && code <= 251155) {
      message = "قاعة (503) يمين";
    } else if (code >= 251156 && code <= 251215) {
      message = "قاعة (503) يسار";
    } else if (code >= 251216 && code <= 251240) {
      message = "ساحة الخامس (يمين)";
    } else if (code >= 251241 && code <= 251265) {
      message = "ساحة الخامس (يسار)";
    } else if (code >= 251266 && code <= 251290) {
      message = "قاعة (3) يمين";
    } else if (code >= 251291 && code <= 251315) {
      message = "قاعة (3) يسار";
    } else if (code >= 251316 && code <= 251340) {
      message = "قاعة (6) يمين";
    } else if (code >= 251341 && code <= 251365) {
      message = "قاعة (6) يسار";
    } else if (code >= 251366 && code <= 251380) {
      message = "قاعة (2) يمين";
    } else if (code >= 251381 && code <= 251395) {
      message = "قاعة (2) يسار";
    } else if (code >= 251396 && code <= 251410) {
      message = "قاعة (7) يمين";
    } else if (code >= 251411 && code <= 251425) {
      message = "قاعة (7) يسار";
    } else if (code >= 251426 && code <= 251550) {
      message = "القاعة الكبرى (يمين)";
    } else if (code >= 251551 && code <= 251715) {
      message = "القاعة الكبرى (وسط)";
    } else if (code >= 251716 && code <= 251840) {
      message = "القاعة الكبرى (يسار)";
    } else {
      message = "كود غير صحيح او طلاب التحويلات";
    }

    setLocationMessage(message);
  };

  useEffect(() => {
    const updateRemainingDays = async () => {
      if (!currentUser) return;

      const userDocRef = doc(db, "users", currentUser.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const remainingDays = userData.remainingDays;
        const lastUpdated = userData.lastLoginDate;

        const currentDate = new Date().toISOString().split("T")[0]; // Format as YYYY-MM-DD
        const lastUpdatedDate = new Date(lastUpdated || currentDate);
        const currentDateObj = new Date(currentDate);

        const daysPassed = Math.floor(
          (currentDateObj - lastUpdatedDate) / (1000 * 60 * 60 * 24)
        );

        if (daysPassed > 0) {
          const newRemainingDays = Math.max(0, remainingDays - daysPassed);

          await updateDoc(userDocRef, {
            remainingDays: newRemainingDays,
            lastLoginDate: currentDate,
          });
        }
      }
    };

    updateRemainingDays();
  }, [currentUser]);

  return (
    <ScrollView style={styles.container}>
      <CustomModal
        visible={showChangelog}
        message={
          "تم تحديث البرنامج! \n\n+ اسئلة على المحاضرات\n+ تقارير الاسئلة"
        }
        onClose={handleCloseModal}
      />
      <CustomModal
        visible={lockAcc}
        message={`تم تعليق حسابك ! \n\nبرجاء التواصل مع الفريق لإزالة التعليق وتجديد الاشتراك\n\n الرمز التعريفي: ${
          currentUser.registrationCode
        } \n\n معرف الحساب: ${currentUser.uid.slice(0, 6)}`}
        onClose={handleSignOut}
        accLock={true}
      />

      {/* <View style={styles.news}>
        <Text style={styles.newsHeading}>ما الجديد؟</Text>
        <Text style={styles.newsBody}>شامل محاسبة مالية</Text>
      </View> */}

      {/* student test place */}
      <View style={[styles.news, { gap: 8 }]}>
        <Text style={styles.newsHeading}>اعرف مكان امتحانك</Text>
        <Text style={styles.newsBody}>كود الطالب</Text>
        <TextInput
          style={styles.input}
          placeholder="250029"
          value={studentCode}
          onChangeText={setStudentCode} // Update studentCode on input
        />
        <TouchableOpacity style={styles.logout} onPress={handleStudentLocation}>
          <Text style={styles.btnText}>مكان الطالب</Text>
        </TouchableOpacity>
        {/* Display the location message */}
        {locationMessage ? (
          <Text style={styles.newsBody}>{locationMessage}</Text>
        ) : null}
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

  input: {
    fontFamily: "Tajawal-Medium",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 8,
    width: "100%",
    textAlign: "right",
  },

  btnText: {
    fontFamily: "Tajawal-Bold",
    fontSize: 16,
    color: "#FFF",
    textAlign: "center",
  },

  logout: {
    width: "100%",
    backgroundColor: "#327FE9",
    padding: 8,
    borderRadius: 16,
    elevation: 5,
  },
});
