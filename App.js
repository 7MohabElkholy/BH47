import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Provider, useDispatch, useSelector } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import store from "./src/app/store";
import { Counter } from "./src/app/features/counter/Counter";
import HomeScreen from "./src/app/screens/HomeScreen";
import SettingsScreen from "./src/app/screens/SettingsScreen";
import LoginScreen from "./src/app/screens/LoginScreen"; // Import LoginScreen
import { selectUser, setUser } from "./src/app/userSlice"; // Import user selector
import { Ionicons } from "@expo/vector-icons"; // Import icons
import * as Font from "expo-font"; // Import Font loading utility from Expo
import AppLoading from "expo-app-loading"; // Optional: App loading while font is fetched
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./src/app/firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./src/app/firebase";

const Tab = createBottomTabNavigator();

function MainApp() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(
          setUser({
            uid: user.uid,
            email: user.email,
            emailVerified: user.emailVerified,
            dispalyName: user.displayName,
          })
        );
      } else {
        dispatch(setUser(null)); // Reset user state on sign-out
      }
    });
    return () => unsubscribe(); // Clean up subscription
  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, [user]); // Run fetchData whenever user changes

  async function fetchData() {
    if (user) {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();

        // Only update if registrationCode or role are different
        if (
          user.registrationCode !== userData.registrationCode ||
          user.role !== userData.role
        ) {
          dispatch(
            setUser({
              ...user,
              registrationCode: userData.registrationCode,
              role: userData.role,
            })
          );
        }
      } else {
        console.log("No such document!");
      }
    }
  }

  // Ensure all hooks are called before returning the conditional JSX
  if (!user) {
    return <LoginScreen />;
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Counter") {
            iconName = focused ? "add-circle" : "add-circle-outline";
          } else if (route.name === "Settings") {
            iconName = focused ? "person-circle" : "person-circle-outline";
          }

          return <Ionicons name={iconName} size={30} color={color} />;
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#327FE9",
        tabBarInactiveTintColor: "#000000",
      })}
    >
      <Tab.Screen name="Settings" component={SettingsScreen} />
      <Tab.Screen name="Counter" component={Counter} />
      <Tab.Screen name="Home" component={HomeScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const loadFonts = async () => {
    await Font.loadAsync({
      "Tajawal-Regular": require("./assets/fonts/Tajawal-Regular.ttf"),
      "Tajawal-Bold": require("./assets/fonts/Tajawal-Bold.ttf"),
      "Tajawal-Medium": require("./assets/fonts/Tajawal-Medium.ttf"),
    });
    setFontsLoaded(true);
  };

  useEffect(() => {
    loadFonts();
  }, []);

  // Show loading screen until fonts are loaded
  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        <MainApp />
        <StatusBar style="auto" />
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
