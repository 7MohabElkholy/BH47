import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Switch,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import { Ionicons } from "@expo/vector-icons";

const UploadScreen = () => {
  const [title, setTitle] = useState(""); // State to manage title input
  const [open, setOpen] = useState(false); // State to manage dropdown open/close
  const [category, setCategory] = useState(null); // State to manage selected tag/category
  const [description, setDescription] = useState(""); // State for description input
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false); // State for notification toggle
  const [items, setItems] = useState([
    { label: "محاضرة", value: "محاضرة" },
    { label: "ملخص", value: "ملخص" },
    { label: "خبر", value: "خبر" },
  ]);

  const toggleSwitch = () =>
    setIsNotificationEnabled((prevState) => !prevState);

  return (
    <ScrollView style={styles.main}>
      {/* title section */}
      <View style={styles.profileInfo}>
        <View
          style={[
            styles.profileInfoEntry,
            { flexDirection: "column-reverse", gap: 8 },
          ]}
        >
          <TextInput
            style={styles.input}
            placeholder="اضف عنوان"
            value={title}
            onChangeText={setTitle}
          />
          <Text style={styles.boldText}>العنوان</Text>
        </View>
      </View>

      {/* tag section */}
      <View style={styles.profileInfo}>
        <View
          style={[styles.profileInfoEntry, { flexDirection: "column", gap: 8 }]}
        >
          <Text style={styles.boldText}>التصنيف</Text>
          <DropDownPicker
            open={open}
            value={category}
            items={items}
            setOpen={setOpen}
            setValue={setCategory}
            setItems={setItems}
            placeholder="اختر التصنيف"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
            textStyle={styles.dropdownText}
          />
        </View>
      </View>

      {/* description section */}
      <View style={styles.profileInfo}>
        <View
          style={[styles.profileInfoEntry, { flexDirection: "column", gap: 8 }]}
        >
          <Text style={styles.boldText}>الوصف</Text>
          <TextInput
            style={styles.textArea}
            placeholder="اضف وصف للمنشور"
            value={description}
            onChangeText={setDescription}
            multiline={true} // This makes it a text area
            numberOfLines={5} // Adjust this to control the initial height of the text area
          />
        </View>
      </View>

      {/* notification section */}
      <View style={styles.profileInfo}>
        <View
          style={[
            styles.profileInfoEntry,
            {
              flexDirection: "row",
              gap: 8,
              alignItems: "center",
              paddingVertical: 0,
            },
          ]}
        >
          <Switch
            trackColor={{ false: "#767577", true: "#97C0F6" }}
            thumbColor={isNotificationEnabled ? "#2F80EC" : "#f4f3f4"}
            onValueChange={toggleSwitch}
            value={isNotificationEnabled}
          />
          <Text style={styles.boldText}>صنع إشعار</Text>
        </View>
      </View>

      {/* upload section */}
      <View style={styles.profileInfo}>
        <View
          style={[
            styles.profileInfoEntry,
            {
              flexDirection: "column",
              gap: 8,
              alignItems: "center",
            },
          ]}
        >
          <Ionicons name="cloud-upload" size={48} color="#327FE9" />
          <Text style={styles.boldText}>رفع ملف</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default UploadScreen;

const styles = StyleSheet.create({
  main: {
    marginTop: 48,
    padding: 24,
  },

  profileInfo: {
    backgroundColor: "#fff",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 8,
    borderRadius: 16,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 24,
  },

  profileInfoEntry: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 8,
  },

  input: {
    fontFamily: "Tajawal-Medium",
    fontSize: 16,
    opacity: 0.7,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    padding: 4,
    width: "100%", // Adjust to your needs
    textAlign: "right", // To keep the Arabic alignment
  },

  boldText: {
    fontFamily: "Tajawal-Bold",
    fontSize: 16,
  },

  // Custom styles for the dropdown
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    width: "100%",
  },

  dropdownContainer: {
    borderColor: "#ccc",
  },

  dropdownText: {
    fontFamily: "Tajawal-Medium",
    textAlign: "right", // RTL alignment for Arabic
  },

  // Custom styles for the text area
  textArea: {
    fontFamily: "Tajawal-Medium",
    fontSize: 16,
    opacity: 0.7,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 8,
    textAlignVertical: "top", // To align the text at the top of the text area
    width: "100%",
    textAlign: "right", // To keep the Arabic alignment
  },
});
