import React, { useEffect, useState, useCallback } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { Provider, useDispatch, useSelector } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import store from "./src/app/store";
import HomeScreen from "./src/app/screens/HomeScreen";
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

SplashScreen.preventAutoHideAsync(); // Prevent the splash screen from auto-hiding

const Tab = createBottomTabNavigator();

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
