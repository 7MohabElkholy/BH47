// src/screens/HomeScreen.js
import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import logo from "../../imgs/logo.png";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View>
        <Image style={styles.logo} source={logo} resizeMode="contain" />
      </View>
      <Text style={styles.header}>
        مرحبًا بك في <Text style={styles.bold}>إسكتش</Text>
      </Text>

      <View
        style={{
          width: "100%",
          height: 4,
          paddingHorizontal: 68,
        }}
      >
        <View
          style={{
            width: "100%",
            height: 4,
            backgroundColor: "#327FE9",
            borderRadius: 8,
          }}
        />
      </View>

      <View style={{ paddingHorizontal: 16 }}>
        <Text style={styles.bodyText}>
          التطبيق الوحيد الشامل لجميع ما يقدمة المعهد من خدمات تعليمية
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },

  logo: {
    width: 325,
    height: 128,
    // backgroundColor: "red",
  },

  header: {
    fontSize: 24,
    fontFamily: "Tajawal-Medium",
  },

  bold: {
    fontFamily: "Tajawal-Bold",
    color: "#327FE9",
  },

  bodyText: {
    fontFamily: "Tajawal-Medium",
    fontSize: 18,
  },
});
