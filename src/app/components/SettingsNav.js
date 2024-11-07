import { Text, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const SettingsNav = (props) => {
  const navigation = useNavigation(); // Moved this inside the component function

  return (
    <TouchableOpacity
      style={{
        width: "100%",
        flexDirection: "row", // Align items horizontally
        alignItems: "center", // Center items vertically
        justifyContent: "space-between", // Space between icon and text
        paddingHorizontal: 24, // Horizontal padding for the button
        paddingVertical: 8, // Vertical padding for the button
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
        marginBottom: 24,
      }}
      onPress={() => navigation.navigate(props.nav)} // Navigate to the provided route
    >
      <Ionicons name={props.icon} size={48} color="#327FE9" />
      <Text
        style={{
          fontSize: 18, // Text size
          color: "#000", // Text color
          marginLeft: 16, // Space between the icon and text
          fontFamily: "Tajawal-Bold",
        }}
      >
        {props.text}
      </Text>
    </TouchableOpacity>
  );
};

export default SettingsNav;
