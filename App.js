import React, { useEffect, useState, useCallback } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { Provider, useDispatch, useSelector } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";

import store from "./src/app/store";
import HomeScreen from "./src/app/screens/HomeScreen";
import AccountScreen from "./src/app/screens/AccountScreen";
import SettingsScreen from "./src/app/screens/SettingsScreen";
import LoginScreen from "./src/app/screens/LoginScreen";
import { selectUser, setUser } from "./src/app/userSlice";
import { Ionicons } from "@expo/vector-icons";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./src/app/firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./src/app/firebase";
import ReadScreen from "./src/app/screens/ReadScreen";
import UploadScreen from "./src/app/screens/UploadScreen";

SplashScreen.preventAutoHideAsync(); // Prevent the splash screen from auto-hiding

const Tab = createBottomTabNavigator();
const SettingsStack = createStackNavigator();

function MainApp({ setIsLoading }) {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await user.reload(); // Force refresh user data
        dispatch(
          setUser({
            uid: user.uid,
            email: user.email,
            emailVerified: user.emailVerified,
            displayName: user.displayName,
          })
        );
      } else {
        dispatch(setUser(null)); // Reset user state on sign-out
      }
      setIsLoading(false); // Stop loading once the auth state is handled
    });

    return () => unsubscribe();
  }, [dispatch, setIsLoading]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  async function fetchData() {
    setIsLoading(true); // Start loading when fetching data
    if (user) {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        if (
          user.registrationCode !== userData.registrationCode ||
          user.role !== userData.role
        ) {
          dispatch(
            setUser({
              ...user,
              registrationCode: userData.registrationCode,
              role: userData.role,
              roleIndex: userData.roleIndex,
            })
          );
        }
      }
    }
    setIsLoading(false); // Stop loading after fetching data
  }

  if (!user) {
    return <LoginScreen />;
  }

  function SettingsStackScreen() {
    return (
      <SettingsStack.Navigator initialRouteName="SettingsMain">
        <SettingsStack.Screen
          name="SettingsMain"
          component={SettingsScreen}
          options={{ headerShown: false }} // No header for the main settings screen
        />
        <SettingsStack.Screen
          name="account"
          component={AccountScreen} // Another screen inside settings
          options={{
            title: "إعدادت الحساب",
            headerTitleStyle: {
              fontFamily: "Tajawal-Bold", // Apply the custom font
              fontSize: 20, // Optional: adjust font size
              color: "#000", // Optional: adjust text color
            },
          }}
        />
      </SettingsStack.Navigator>
    );
  }

  return (
    <Tab.Navigator
      initialRouteName="Home"
      backBehavior="initialRoute"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Settings") {
            iconName = focused ? "settings" : "settings-outline";
          } else if (route.name === "Read") {
            iconName = focused ? "book" : "book-outline";
          } else if (route.name === "Upload") {
            iconName = focused ? "add-circle" : "add-circle-outline";
          }

          return <Ionicons name={iconName} size={30} color={color} />;
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#327FE9",
        tabBarInactiveTintColor: "#000000",
      })}
    >
      <Tab.Screen name="Settings" component={SettingsStackScreen} />

      {user.roleIndex === 1 ? (
        <Tab.Screen name="Upload" component={UploadScreen} />
      ) : (
        <Tab.Screen name="Read" component={ReadScreen} />
      )}

      <Tab.Screen name="Home" component={HomeScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [isAppReady, setIsAppReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add isLoading state here

  const loadFonts = async () => {
    await Font.loadAsync({
      "Tajawal-Regular": require("./assets/fonts/Tajawal-Regular.ttf"),
      "Tajawal-Bold": require("./assets/fonts/Tajawal-Bold.ttf"),
      "Tajawal-Medium": require("./assets/fonts/Tajawal-Medium.ttf"),
    });
    setFontsLoaded(true);
  };

  const hideSplashScreen = useCallback(async () => {
    if (fontsLoaded && isAppReady && !isLoading) {
      await SplashScreen.hideAsync(); // Hide the splash screen when the app is ready
    }
  }, [fontsLoaded, isAppReady, isLoading]);

  useEffect(() => {
    loadFonts();
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      setTimeout(() => setIsAppReady(true), 250); // Simulate loading delay
    }
  }, [fontsLoaded]);

  useEffect(() => {
    hideSplashScreen();
  }, [hideSplashScreen]);

  if (!isAppReady || !fontsLoaded) {
    // App stays on splash screen, no additional spinner needed
    return null;
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        <MainApp setIsLoading={setIsLoading} />
        <StatusBar style="auto" />
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  spinnerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
