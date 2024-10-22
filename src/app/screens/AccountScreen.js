import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, setUser } from "../userSlice";
import { auth } from "../firebase";
import {
  signOut as firebaseSignOut,
  updateProfile,
  updatePassword,
  updateEmail,
  sendEmailVerification,
} from "firebase/auth";
import placeHolder from "../../imgs/profile-img.png";
import CustomModal from "../features/modal/CustomModal"; // Importing CustomModal

export default function AccountScreen() {
  const currentUser = useSelector(selectUser);
  const dispatch = useDispatch();

  const [displayName, setDisplayName] = useState(
    currentUser.displayName || "اسم المستخدم"
  );
  const [email, setEmail] = useState(currentUser.email || "");
  const [role, setRole] = useState(currentUser.role || "مستخدم");

  const [isPasswordEditVisible, setPasswordEditVisible] = useState(false);
  const [isNameEditVisible, setNameEditVisible] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const [isEmailEditVisible, setEmailEditVisible] = useState(false);
  const [newEmail, setNewEmail] = useState(email);

  const [isEditVisible, setEditVisible] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  // Modal state
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  function handleSignOut() {
    firebaseSignOut(auth)
      .then(() => {
        dispatch(setUser(null));
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const handleUpdateProfile = async () => {
    const user = auth.currentUser;
    let profileUpdated = false;

    try {
      if (displayName !== currentUser.displayName) {
        await updateProfile(user, { displayName });
        profileUpdated = true;
      }

      if (newPassword) {
        await updatePassword(user, newPassword);
        profileUpdated = true;
      }

      if (newEmail !== currentUser.email) {
        await updateEmail(user, newEmail);
        setEmail(newEmail);
        profileUpdated = true;
      }

      if (profileUpdated) {
        dispatch(setUser({ ...currentUser, displayName, email: newEmail }));
        setModalMessage("تم تحديث الملف الشخصي بنجاح !");
        setModalVisible(true);
      }

      setPasswordEditVisible(false);
      setEmailEditVisible(false);
    } catch (error) {
      console.error("Error updating profile:", error);

      if (error.code === "auth/requires-recent-login") {
        setModalMessage(
          "الرجاء تسجيل الخروج وإعادة الدخول مرة اخرى لإتمام العملية"
        );
      } else if (error.code === "auth/weak-password") {
        setModalMessage(
          "كلمة المرور ضعيفة يجب ان تكون على الأقل مكونة من 6 أحرف"
        );
      } else {
        setModalMessage(error.message);
      }
      setModalVisible(true);
    }
  };

  const handleVerifyEmail = async () => {
    try {
      await sendEmailVerification(auth.currentUser);
      setVerificationSent(true);
      setModalMessage("تم إرسال البريد الإلكتروني للتوثيق");
      setModalVisible(true);
    } catch (error) {
      console.error("Error sending verification email:", error);
      setModalMessage("خطأ في إرسال البريد الإلكتروني للتوثيق");
      setModalVisible(true);
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      <View style={styles.profileInfo}>
        <Image
          style={styles.profileImg}
          source={placeHolder}
          resizeMode="contain"
        />
        <Text style={styles.displayName}>{displayName}</Text>
        <Text style={styles.roleName}>{currentUser.role || "مستخدم"}</Text>
      </View>

      <View style={styles.profileInfo}>
        <View style={styles.profileInfoEntry}>
          <Text style={styles.unactiveText}>
            {currentUser.registrationCode || "غير معرف"}
          </Text>
          <Text style={styles.boldText}>الرمز التعريفي</Text>
        </View>
        <View style={styles.profileInfoEntry}>
          <Text style={styles.unactiveText}>
            {"غير محدد"} {/* Replace this with actual expiration logic */}
          </Text>
          <Text style={styles.boldText}>صالح حتى</Text>
        </View>
      </View>

      {/* Name Section */}
      <TouchableOpacity
        style={styles.profileInfo}
        onPress={() => setNameEditVisible(!isNameEditVisible)} // Toggle name edit only
      >
        <View
          style={[
            styles.profileInfoEntry,
            {
              flexDirection: isNameEditVisible ? "column-reverse" : "row",
              gap: isNameEditVisible ? 8 : 0,
            },
          ]}
        >
          {isNameEditVisible ? (
            <TextInput
              style={styles.input}
              placeholder="اسم المستخدم الجديد"
              value={displayName}
              onChangeText={setDisplayName}
            />
          ) : (
            <Text style={styles.unactiveText}>{displayName}</Text>
          )}
          <Text style={styles.boldText}>اسم المستخدم</Text>
        </View>

        {isNameEditVisible && (
          <View style={styles.btnGroup}>
            <TouchableOpacity
              style={styles.editBtn}
              onPress={handleUpdateProfile}
            >
              <Text style={styles.btnText}>حفظ</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => {
                setDisplayName(currentUser.displayName); // Fix typo here: currentUser.displayName, not dispalyName
                setNameEditVisible(false);
              }}
            >
              <Text style={styles.btnText}>إلغاء</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>

      {/* Password Section */}
      <TouchableOpacity
        style={styles.profileInfo}
        onPress={() => setPasswordEditVisible(!isPasswordEditVisible)} // Toggle password edit only
      >
        <View
          style={[
            styles.profileInfoEntry,
            {
              flexDirection: isPasswordEditVisible ? "column-reverse" : "row",
              gap: isPasswordEditVisible ? 8 : 0,
            },
          ]}
        >
          {isPasswordEditVisible ? (
            <TextInput
              style={styles.input}
              placeholder="كلمة المرور الجديدة"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
            />
          ) : (
            <Text style={styles.unactiveText}>********</Text>
          )}
          <Text style={styles.boldText}>كلمة المرور</Text>
        </View>

        {isPasswordEditVisible && (
          <View style={styles.btnGroup}>
            <TouchableOpacity
              style={styles.editBtn}
              onPress={handleUpdateProfile}
            >
              <Text style={styles.btnText}>حفظ</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => {
                setNewPassword("");
                setPasswordEditVisible(false);
              }}
            >
              <Text style={styles.btnText}>إلغاء</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>

      {/* Email section */}
      <TouchableOpacity
        style={styles.profileInfo}
        onPress={() => setEmailEditVisible(!isEmailEditVisible)}
      >
        <View
          style={[styles.profileInfoEntry, { flexDirection: "column-reverse" }]}
        >
          {isEmailEditVisible ? (
            <TextInput
              style={styles.input}
              placeholder="البريد الإلكتروني الجديد"
              value={newEmail}
              onChangeText={setNewEmail}
            />
          ) : (
            <Text style={styles.unactiveText}>{currentUser.email}</Text>
          )}
          <Text style={styles.boldText}>البريد الإلكتروني</Text>
        </View>

        {isEmailEditVisible && (
          <View style={styles.btnGroup}>
            <TouchableOpacity
              style={styles.editBtn}
              onPress={handleUpdateProfile}
            >
              <Text style={styles.btnText}>حفظ</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => {
                setNewEmail(currentUser.email);
                setEmailEditVisible(false);
              }}
            >
              <Text style={styles.btnText}>إلغاء</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>

      {/* Verification Section */}
      <View style={styles.profileInfo}>
        <View style={styles.profileInfoEntry}>
          <Text style={styles.unactiveText}>
            {currentUser.emailVerified ? "موثق" : "غير موثق"}
          </Text>
          <Text style={styles.boldText}>التوثيق</Text>
        </View>

        {!currentUser.emailVerified && (
          <TouchableOpacity
            style={styles.verifyBtn}
            onPress={handleVerifyEmail}
            disabled={verificationSent}
          >
            <Text style={styles.btnText}>
              {verificationSent
                ? "تم إرسال البريد الإلكتروني"
                : "توثيق البريد الإلكتروني"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <CustomModal
        visible={isModalVisible}
        message={modalMessage}
        onClose={() => setModalVisible(false)}
      />

      <TouchableOpacity style={styles.logout} onPress={handleSignOut}>
        <Text style={styles.btnText}>تسجيل الخروج</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  verifyBtn: {
    padding: 8,
    backgroundColor: "#32CD32", // Green color to indicate verification
    borderRadius: 10,
    marginTop: 10,
  },

  container: {
    flex: 1,
    paddingVertical: 32,
    paddingHorizontal: 24,
    gap: 24,
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

  profileImg: {
    width: "100%",
  },

  displayName: {
    fontFamily: "Tajawal-Bold",
    fontSize: 20,
  },

  roleName: {
    fontFamily: "Tajawal-Medium",
    fontSize: 20,
    opacity: 0.7,
  },

  profileInfoEntry: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 8,
  },

  unactiveText: {
    fontFamily: "Tajawal-Medium",
    fontSize: 16,
    opacity: 0.7,
  },

  boldText: {
    fontFamily: "Tajawal-Bold",
    fontSize: 16,
  },

  input: {
    fontFamily: "Tajawal-Medium",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 8,
    width: "100%",
    textAlign: "right",
  },

  btnGroup: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 8,
  },

  editBtn: {
    padding: 8,
    backgroundColor: "#327FE9",
    borderRadius: 10,
  },

  cancelBtn: {
    padding: 8,
    backgroundColor: "#FF6347",
    borderRadius: 10,
  },

  btnText: {
    fontFamily: "Tajawal-Bold",
    fontSize: 16,
    color: "#FFF",
    textAlign: "center",
  },

  logout: {
    width: "100%",
    backgroundColor: "#327FE9",
    padding: 8,
    borderRadius: 16,
    elevation: 5,
    marginBottom: 100,
  },
});
