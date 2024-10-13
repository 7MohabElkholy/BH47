import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Intro from "../features/intro/Intro";

const LoginScreen = () => {
  const isIntroSkipped = useSelector((state) => state.intro.skiped);
  const dispatch = useDispatch();

  if (!isIntroSkipped) {
    return <Intro />;
  }

  return (
    <View>
      <Text>LoginScreenheloooooooooooo</Text>
      <Text>LoginScreenheloooooooooooowewe</Text>
      <Text>LoginScreenheloooooooooooowewe</Text>
      <Text>LoginScreenheloooooooooooowewe</Text>
      <Text>LoginScreenheloooooooooooowewe</Text>
      <Text>LoginScreenheloooooooooooowewe</Text>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});
