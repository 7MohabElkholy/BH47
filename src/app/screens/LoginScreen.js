import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Animated,
  Alert,
  ActivityIndicator, // Importing ActivityIndicator for the loading spinner
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Intro from "../features/intro/Intro";
import bg from "../../imgs/bg.jpg";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { setUser } from "../userSlice";

const LoginScreen = () => {
  const isIntroSkipped = useSelector((state) => state.intro.skiped);
  const dispatch = useDispatch();
  const { height } = Dimensions.get("window");
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registrationCode, setRegistrationCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [isSignUp, setIsSignUp] = useState(true); // State to toggle between sign-up and login

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      delay: 500,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  if (!isIntroSkipped) {
    return <Intro />;
  }

  const handleAuth = async () => {
    setErrorMessage(""); // Clear previous error messages
    setIsLoading(true); // Start loading

    if (isSignUp) {
      // Sign-up logic
      if (!registrationCode) {
        // Validate registration code
        setErrorMessage("يرجى إدخال الرمز التعريفي");
        setIsLoading(false); // Stop loading
        return;
      }

      const codeRef = doc(db, "roles", registrationCode);
      const codeDoc = await getDoc(codeRef);

      if (!codeDoc.exists()) {
        setErrorMessage("الرمز التعريفي خطأ");
        setIsLoading(false); // Stop loading
        return;
      }

      const roleData = codeDoc.data();

      if (roleData.isUsed) {
        setErrorMessage("هذا الرمز التعريفي مستخدم من قبل");
        setIsLoading(false); // Stop loading
        return;
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
          email: email,
          role: roleData.role,
          registrationCode: registrationCode,
        });

        await updateDoc(codeRef, {
          isUsed: true,
        });
        dispatch(
          setUser({ uid: user.uid, email: user.email, role: roleData.role })
        ); // Dispatching only serializable values
      } catch (error) {
        setErrorMessage(error.message);
      }
    } else {
      // Login logic
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        dispatch(setUser({ uid: user.uid, email: user.email })); // Dispatching only serializable values
      } catch (error) {
        setErrorMessage(error.message);
      }
    }

    setIsLoading(false); // Stop loading after the operation
  };

  return (
    <View style={styles.container}>
      <Image
        source={bg}
        style={[styles.bg, { height: height + 50 }]}
        resizeMode="stretch"
      />

      <Animated.View style={[styles.animatedContent, { opacity: fadeAnim }]}>
        <Text style={styles.header}>
          {isSignUp ? "إنشاء حساب" : "تسجيل الدخول"}
        </Text>

        <View style={styles.main}>
          <TextInput
            keyboardType="email-address"
            style={styles.input}
            placeholder="البريد الإلكتروني"
            placeholderTextColor="#ffffffaa"
            onChangeText={setEmail}
            value={email}
          />
          <TextInput
            keyboardType="visible-password"
            style={styles.input}
            placeholder="كلمة المرور"
            placeholderTextColor="#ffffffaa"
            onChangeText={setPassword}
            value={password}
          />
          {isSignUp && ( // Only show the registration code input on sign up
            <TextInput
              style={styles.input}
              placeholder="الرمز التعريفي"
              placeholderTextColor="#ffffffaa"
              onChangeText={setRegistrationCode}
              value={registrationCode}
            />
          )}
        </View>

        <View style={styles.btnCountainer}>
          <TouchableOpacity
            onPress={handleAuth}
            style={styles.btn}
            disabled={isLoading}
          >
            {isLoading ? ( // Show spinner when loading
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.text}>
                {isSignUp ? "تسجيل" : "تسجيل الدخول"}
              </Text>
            )}
          </TouchableOpacity>
          <Text style={styles.underText}>
            {isSignUp ? "لديك حساب بالفعل؟ " : "ليس لديك حساب؟ "}
            <Text
              style={styles.highlight}
              onPress={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? "سجل الدخول" : "إنشاء حساب"}
            </Text>
          </Text>
          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}
        </View>
      </Animated.View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#327FE9",
  },
  bg: {
    width: "100%",
    position: "absolute",
  },
  animatedContent: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    gap: 32,
  },
  main: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 24,
    paddingHorizontal: 24,
  },
  header: {
    fontFamily: "Tajawal-Bold",
    fontSize: 32,
    color: "#FFFFFF",
    textAlign: "center",
  },
  input: {
    fontFamily: "Tajawal-Regular",
    textAlign: "right",
    fontSize: 18,
    color: "#fff",
    width: "100%",
    borderColor: "#fff",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  btnCountainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 8,
    paddingHorizontal: 24,
  },
  text: {
    fontFamily: "Tajawal-Medium",
    fontSize: 24,
    color: "#FFFFFF",
    textAlign: "center",
  },
  btn: {
    backgroundColor: "#327FE9",
    paddingVertical: 8,
    borderRadius: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  underText: {
    fontFamily: "Tajawal-Regular",
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
  },
  highlight: {
    fontFamily: "Tajawal-Bold",
  },
  errorText: {
    fontFamily: "Tajawal-Regular",
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
});
