import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import logo from "../../imgs/logo.png";

const InfoScreen = () => {
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
      <View style={{ paddingHorizontal: 16 }}>
        <Text style={styles.bodyText}>إصدار البرنامج: 0.3.0</Text>
        <Text style={styles.bodyText}>القائمين على البرنامج:</Text>
        <Text style={styles.bodyText}>
          مبرمج / مراجع تجربة المستخدم: مهاب الخولي
        </Text>
        <Text style={styles.bodyText}>
          قائد البرنامج / مصمم أول: أسماء الزناتي
        </Text>
        <Text style={styles.bodyText}>تسويق : فتحي نصار</Text>
      </View>
    </View>
  );
};

export default InfoScreen;

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
