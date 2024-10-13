import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import topImg from "../../../imgs/top.png"; // Adjust the path as needed
import midImg from "../../../imgs/middle.png"; // Adjust the path as needed
import botImg from "../../../imgs/bot.png"; // Adjust the path as needed
import logo from "../../../imgs/logo.png";

const Intro = () => {
  return (
    <View style={styles.container}>
      <View style={styles.bg}>
        <Image source={topImg} style={styles.topImage} resizeMode="contain" />
        <Image source={midImg} style={styles.midImage} resizeMode="contain" />
        <Image source={botImg} style={styles.botImage} resizeMode="contain" />
      </View>

      <View style={styles.middle}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />
        <Text style={styles.text}>المعهد العالي للعلوم الإدارية بالبحيرة</Text>
        <Text style={styles.undertext}>أ. د/ علي عبد الوهاب</Text>
      </View>
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
    // padding: 130, // Make space for the topImage to fit
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
    justifyContent: "flext-start",
    alignItems: "flex-end",
  },

  logo: {
    width: 100,
    height: 64,
  },
});
