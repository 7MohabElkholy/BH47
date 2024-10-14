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
import topImg from "../../../imgs/top.png"; // Adjust the path as needed
import midImg from "../../../imgs/middle.png"; // Adjust the path as needed
import botImg from "../../../imgs/bot.png"; // Adjust the path as needed
import logo from "../../../imgs/logo.png";
import { useDispatch } from "react-redux";
import { skipIntro } from "./introSlice";

const Intro = () => {
  const dispatch = useDispatch();
  // Animation values for images
  const topSlideAnim = useRef(new Animated.Value(-400)).current; // Start position off-screen (top)
  const midSlideAnim = useRef(new Animated.Value(-400)).current; // Start position off-screen (top)
  const botSlideAnim = useRef(new Animated.Value(400)).current; // Start position off-screen (bottom)

  // Animation values for logo and text
  const fadeAnim = useRef(new Animated.Value(0)).current; // Start opacity at 0

  function startHandler() {
    dispatch(skipIntro());
  }

  useEffect(() => {
    // Animated sequence for sliding in images
    Animated.sequence([
      Animated.timing(topSlideAnim, {
        toValue: 0, // Move to the original position
        duration: 800,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(midSlideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.ease,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.timing(botSlideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.ease,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Fade-in effect for logo and text
    Animated.timing(fadeAnim, {
      toValue: 1, // Change opacity to 1
      duration: 1000,
      delay: 2800, // Delay to make sure it starts after the images have slid in
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.bg}>
        <Animated.Image
          source={topImg}
          style={[
            styles.topImage,
            { transform: [{ translateY: topSlideAnim }] },
          ]}
          resizeMode="contain"
        />
        <Animated.Image
          source={midImg}
          style={[
            styles.midImage,
            { transform: [{ translateY: midSlideAnim }] },
          ]}
          resizeMode="contain"
        />
        <Animated.Image
          source={botImg}
          style={[
            styles.botImage,
            { transform: [{ translateY: botSlideAnim }] },
          ]}
          resizeMode="contain"
        />
      </View>

      <View style={styles.middle}>
        <Animated.Image
          source={logo}
          style={[styles.logo, { opacity: fadeAnim }]} // Apply fade animation
          resizeMode="contain"
        />
        <Animated.Text style={[styles.text, { opacity: fadeAnim }]}>
          {/* Apply fade animation */}
          المعهد العالي للعلوم الإدارية بالبحيرة
        </Animated.Text>
        <Animated.Text style={[styles.undertext, { opacity: fadeAnim }]}>
          {/* Apply fade animation */}
          أ. د/ علي عبد الوهاب
        </Animated.Text>
      </View>

      <TouchableOpacity onPress={startHandler} style={styles.btn}>
        <Text style={styles.btnTxt}>البدأ</Text>
      </TouchableOpacity>
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

  bg: {
    width: "100%", // Ensure container is full width
    position: "relative", // Needed for absolute positioning of images
  },

  topImage: {
    width: "100%",
    height: 400, // Define a proper height
    position: "absolute",
    top: -30, // Place it at the top of the container
  },

  midImage: {
    width: "110%",
    height: 400, // Adjust height to match your design
    position: "absolute",
    bottom: -105,
  },

  botImage: {
    width: "100%",
    height: 400, // Define an explicit height
    bottom: -420,
  },

  text: {
    paddingHorizontal: 16,
    fontSize: 32,
    textAlign: "right",
    marginTop: 8,
    fontWeight: "500",
    color: "#244FAE",
    fontFamily: "Tajawal-Bold",
  },
  undertext: {
    paddingHorizontal: 16,
    fontSize: 24,
    textAlign: "right",
    marginTop: 8,
    fontWeight: "400",
    color: "#244FAE",
    opacity: 0.7,
    fontFamily: "Tajawal-Regular",
  },

  middle: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-end",
  },

  logo: {
    width: 100,
    height: 64,
  },

  btn: {
    zIndex: 10,
    position: "absolute",
    width: 120,
    height: 44,
    // backgroundColor: "red",
    borderColor: "#FFFFFF",
    borderWidth: 1,
    borderRadius: 8,

    bottom: 40,
    right: 32,

    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  btnTxt: {
    color: "#fff",
    fontFamily: "Tajawal-Bold",
    fontSize: 16,
  },
});
