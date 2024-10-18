import {
  StyleSheet,
  Text,
  View,
  Image,
  Animated,
  Easing,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useRef } from "react";

import logo from "../../../imgs/logo.png";
import bh47Logo from "../../../imgs/BH47.png";
import bg from "../../../imgs/bg-about.jpg";
import { useDispatch } from "react-redux";
import { skipIntro } from "./introSlice";

const Intro = () => {
  const fadeIn = useRef(new Animated.Value(0)).current;
  const showRight = useRef(new Animated.Value(400)).current;
  const blockUP = useRef(new Animated.Value(1000)).current;
  const headerFadeIn = useRef(new Animated.Value(0)).current;
  const bodyFadeIn = useRef(new Animated.Value(0)).current;
  const showBH47 = useRef(new Animated.Value(0)).current;
  const dispatch = useDispatch();

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeIn, {
      toValue: 0.7,
      delay: 3500,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeIn]);

  useEffect(() => {
    // Show right animation
    Animated.timing(showRight, {
      toValue: 0,
      delay: 5000,
      duration: 1200,
      useNativeDriver: true,
    }).start();
  }, [showRight]);

  useEffect(() => {
    // Show block up animation
    Animated.timing(blockUP, {
      toValue: 0,
      delay: 1000,
      duration: 1400,
      useNativeDriver: true,
    }).start();
  }, [blockUP]);

  useEffect(() => {
    // Header Fade in animation
    Animated.timing(headerFadeIn, {
      toValue: 1,
      delay: 6000,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [headerFadeIn]);

  useEffect(() => {
    // Body Fade in animation
    Animated.timing(bodyFadeIn, {
      toValue: 1,
      delay: 7000,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [bodyFadeIn]);

  useEffect(() => {
    // BH47 Fade in animation
    Animated.timing(showBH47, {
      toValue: 1,
      delay: 2250,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [showBH47]);

  function startHandler() {
    dispatch(skipIntro());
  }

  return (
    <View style={styles.container}>
      <Image
        source={bg}
        resizeMode="cover"
        style={{ width: "100%", height: "100%", position: "absolute" }}
      />

      {/* White block */}
      <Animated.View
        style={{
          position: "absolute",
          // top: 100,
          width: "100%",
          height: "100%",
          backgroundColor: "#FFF",
          // transform: [{ translateY: blockUP }],
        }}
      />

      {/* BH47 logo */}
      <Animated.View
        style={{
          alignSelf: "center",
          opacity: showBH47,
          justifyContent: "center",
          height: "100%",
        }}
      >
        <Image
          source={bh47Logo}
          resizeMode="contain"
          style={{ width: 400, height: 300 }}
        />
      </Animated.View>

      {/* overlay */}
      <Animated.View
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#327FE9",
          position: "absolute",
          opacity: fadeIn,
        }}
      />
      {/* App logo */}
      <Animated.View
        style={{
          position: "absolute",
          top: 100,
          transform: [{ translateX: showRight }], // Use translateY for vertical movement
        }}
      >
        <Image
          source={logo}
          resizeMode="contain"
          style={{ width: 150, height: 90 }}
        />
      </Animated.View>

      {/* Header */}
      <Animated.View
        style={{ position: "absolute", top: 190, opacity: headerFadeIn }}
      >
        <Text
          style={{ fontFamily: "Tajawal-Bold", color: "#FFFFFF", fontSize: 36 }}
        >
          إسكتش
        </Text>
      </Animated.View>
      {/* BR */}
      <Animated.View
        style={{
          position: "absolute",
          top: 250,
          opacity: headerFadeIn,
          width: 300,
          borderRadius: 16,
          // opacity: 0.7,
          height: 2,
          backgroundColor: "#FFF",
        }}
      />
      {/* Body Text */}
      <Animated.View
        style={{
          position: "absolute",
          top: 250,
          opacity: bodyFadeIn,
          alignItems: "flex-end",
          width: "100%",
          padding: 24,
        }}
      >
        <Text
          style={{
            fontFamily: "Tajawal-Regular",
            color: "#FFFFFF",
            fontSize: 24,
            textAlign: "right",
            lineHeight: 30,
          }}
        >
          <Text style={{ fontFamily: "Tajawal-Bold" }}>من نحن؟</Text> المعهد
          العالي للعلوم الإدارية المتقدمة والحاسبات يمثل صرحاً تعليمياً مميزاً
          يمتد على مساحة 37 كم². يمنح المعهد درجة البكالوريوس المعتمدة من
          الجامعات المصرية، مع تأكيد إجراءات التجنيد. صُمم هذا التطبيق لتسهيل
          العملية الدراسية على طلاب المعاهد العليا بالبحيرة. نتمنى أن ينال
          إعجابكم ويحقق الفائدة المرجوة.
        </Text>
      </Animated.View>
      <Animated.View
        style={{
          position: "absolute",
          bottom: 60,
          // width: "100%",
          opacity: bodyFadeIn,
        }}
      >
        <TouchableOpacity onPress={startHandler} style={styles.btn}>
          <Text style={styles.btnTxt}>البدأ</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default Intro;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start", // Align items at the top
    alignItems: "center",
    backgroundColor: "#FFF",
  },

  btn: {
    width: 300,
    height: 44,
    backgroundColor: "#FFF",
    borderRadius: 8,

    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  btnTxt: {
    color: "#327FE9",
    fontFamily: "Tajawal-Bold",
    fontSize: 24,
  },
});
