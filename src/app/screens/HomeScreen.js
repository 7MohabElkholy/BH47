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
  const [newsText, setNewsText] = useState([]);
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
    const checkForUpdate = async () => {
      const lastSeenVersion = await AsyncStorage.getItem("lastVersion");
      if (lastSeenVersion !== currentVersion) {
        setShowChangelog(true);
      }
    };

    checkForUpdate();

    const fetchNews = async () => {
      const docRef = doc(db, "news", "new");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const objData = docSnap.data();
        const newsArray = Object.values(objData); // Gather all values in one array
        setNewsText(newsArray); // Update state once
      } else {
        console.log("No such document!");
      }
    };

    fetchNews();
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

      <View style={styles.news}>
        <Text style={styles.newsHeading}>ما الجديد؟</Text>
        <View style={styles.newsBody}>
          {newsText.map((e, index) => (
            <Text key={index} style={styles.newsBody}>
              {e}
            </Text>
          ))}
        </View>
      </View>

      <View style={styles.news}>
        <Text style={styles.newsHeading}>تقارير أسئلة الاقتصاد</Text>

        <TouchableOpacity
          style={styles.showMoreBtn}
          onPress={() => navigation.navigate("EconomyReports")}
        >
          <Text style={styles.showMoreTxt}>عرض التقارير</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.news, { marginBottom: 48 }]}>
        <Text style={styles.newsHeading}>تقارير أسئلة إدارة الأعمال</Text>
        <TouchableOpacity
          style={styles.showMoreBtn}
          onPress={() => navigation.navigate("MangmentReports")}
        >
          <Text style={styles.showMoreTxt}>عرض التقارير</Text>
        </TouchableOpacity>
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

  showMoreTxt: {
    fontFamily: "Tajawal-Bold",
    fontSize: 16,
    color: "#990101",
  },
});
