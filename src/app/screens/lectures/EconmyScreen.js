import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import ImageReader from "../../components/ImageReader";

const EconmyScreen = () => {
  const [isReading, setIsReading] = useState(false);
  const [lectureIndex, setLectureIndex] = useState(undefined);
  const [subject, setSubject] = useState(undefined);

  handelClick = (lectureIndex) => {
    setLectureIndex(lectureIndex);
    setSubject("Economy");

    setIsReading(true);
  };

  return isReading ? (
    <ImageReader lecture={lectureIndex} subject={subject} />
  ) : (
    <View style={styles.main}>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => handelClick("FirstLecture")}
      >
        <Text style={styles.btnText}>المحاضرة الاولى</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => handelClick("SecoundLecture")}
      >
        <Text style={styles.btnText}>المحاضرة الثانية</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => handelClick("ThirdLecture")}
      >
        <Text style={styles.btnText}>المحاضرة الثالثة</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => handelClick("FourthLecture")}
      >
        <Text style={styles.btnText}>المحاضرة الرابعة</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => handelClick("FifthLecture")}
      >
        <Text style={styles.btnText}>المحاضرة الخامسة</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EconmyScreen;

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
