import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

const ReadScreen = ({ navigation }) => {
  // Accept navigation prop
  return (
    <View style={styles.main}>
      <View style={styles.heading}>
        <Text style={styles.h1}>الملخصات</Text>
        <View style={styles.hr} />
      </View>

      <View style={styles.btnGroub}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate("LawScreen")} // Navigate to ReadDetails
        >
          <Text style={styles.btnText}>قانون</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate("EconmyScreen")} // Navigate to ReadDetails
        >
          <Text style={styles.btnText}>اقتصاد</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.btnGroub}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate("EnglishScreen")} // Navigate to ReadDetails
        >
          <Text style={styles.btnText}>إنجليزي</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate("AccountingScreen")} // Navigate to ReadDetails
        >
          <Text style={styles.btnText}>محاسبة</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.btnGroub}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate("MangmentScreen")} // Navigate to ReadDetails
        >
          <Text style={styles.btnText}>إدارة اعمال</Text>
        </TouchableOpacity>
      </View>

      {/* tests */}

      <View style={styles.heading}>
        <Text style={[styles.h1, { marginTop: 32 }]}>أسئلة المحاضرات</Text>
        <View style={styles.hr} />
      </View>

      <View style={styles.btnGroub}>
        {/* <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate("LawScreen")} // Navigate to ReadDetails
        >
          <Text style={styles.btnText}>قانون</Text>
        </TouchableOpacity> */}

        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate("EconmyTestScreen")}
        >
          <Text style={styles.btnText}>اقتصاد</Text>
        </TouchableOpacity>
      </View>

      {/* <View style={styles.btnGroub}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate("EnglishScreen")} // Navigate to ReadDetails
        >
          <Text style={styles.btnText}>إنجليزي</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate("AccountingScreen")} // Navigate to ReadDetails
        >
          <Text style={styles.btnText}>محاسبة</Text>
        </TouchableOpacity>
      </View> */}
      <View style={styles.btnGroub}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate("MangmentTestScreen")} // Navigate to ReadDetails
        >
          <Text style={styles.btnText}>إدارة اعمال</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ReadScreen;

// Styles remain unchanged

const styles = StyleSheet.create({
  main: {
    marginTop: 48,
    padding: 24,
  },

  heading: { gap: 8 },

  hr: {
    width: "100%",
    height: 3,
    backgroundColor: "#000",
    borderRadius: 16,
  },

  h1: {
    fontFamily: "Tajawal-Bold",
    fontSize: 24,
  },

  btnGroub: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    gap: 16,

    paddingTop: 24,
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
