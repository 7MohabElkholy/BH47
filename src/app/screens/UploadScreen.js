import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Switch,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert, // Import ActivityIndicator
} from "react-native";
import React, { useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker"; // File Picker
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Firebase Storage
import { getFirestore, collection, addDoc } from "firebase/firestore"; // Firestore
import { storage, db } from "../firebase";

const UploadScreen = () => {
  const [title, setTitle] = useState("");
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState(null);
  const [description, setDescription] = useState("");
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);
  const [items, setItems] = useState([
    { label: "محاضرة", value: "محاضرة" },
    { label: "ملخص", value: "ملخص" },
    { label: "خبر", value: "خبر" },
  ]);
  const [file, setFile] = useState(null); // State for selected file
  const [isUploading, setIsUploading] = useState(false); // State for upload status

  const toggleSwitch = () =>
    setIsNotificationEnabled((prevState) => !prevState);

  const handleFilePick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "video/*"], // Restrict to PDF or Video
        copyToCacheDirectory: true,
      });
      if (result.type === "success") {
        setFile(result); // Save file info
        Alert(result);
        console.log("WTF ?! ");
      }
    } catch (err) {
      console.log("Error picking file:", err);
    }
  };

  const handleUpload = async () => {
    if (!file || !title || !category || !description) {
      alert("Please fill out all fields and select a file");
      return;
    }
    setIsUploading(true);
    try {
      // Initialize Firebase Storage
      const storageRef = ref(storage, `uploads/${file.name}`); // Create storage reference

      // Upload file to Firebase Storage
      const response = await fetch(file.uri);
      const blob = await response.blob();
      await uploadBytes(storageRef, blob);

      // Get file URL
      const fileURL = await getDownloadURL(storageRef);

      // Save metadata to Firestore
      await addDoc(collection(db, "posts"), {
        title,
        category,
        description,
        fileURL, // Store file URL
        createdAt: new Date(),
        notificationEnabled: isNotificationEnabled,
      });

      alert("File uploaded successfully!");
      setFile(null); // Clear file after upload
      setTitle(""); // Clear fields
      setDescription("");
    } catch (err) {
      console.error("Error uploading file:", err);
      alert("Upload failed");
    }
    setIsUploading(false);
  };

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

      {/* category section */}
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
            multiline={true}
            numberOfLines={5}
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
        <TouchableOpacity onPress={handleFilePick}>
          <View
            style={[
              styles.profileInfoEntry,
              { flexDirection: "column", gap: 8, alignItems: "center" },
            ]}
          >
            <Ionicons name="cloud-upload" size={48} color="#327FE9" />
            <Text style={styles.boldText}>
              {file ? `Selected: ${file.name}` : "رفع ملف"}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        onPress={handleUpload}
        style={{ marginBottom: 64 }}
        disabled={isUploading} // Disable button while uploading
      >
        <Text style={styles.boldText}>
          {isUploading ? "Uploading..." : "Submit"}
        </Text>
      </TouchableOpacity>

      {/* Loading Spinner */}
      {isUploading && (
        <ActivityIndicator
          size="large"
          color="#327FE9"
          style={{ marginTop: 16 }}
        />
      )}
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
    width: "100%",
    textAlign: "right",
  },

  boldText: {
    fontFamily: "Tajawal-Bold",
    fontSize: 16,
  },

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
    textAlign: "right",
  },

  textArea: {
    fontFamily: "Tajawal-Medium",
    fontSize: 16,
    opacity: 0.7,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 8,
    textAlignVertical: "top",
    width: "100%",
    textAlign: "right",
  },
});
