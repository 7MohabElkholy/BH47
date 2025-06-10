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
import EconmyScreen from "./src/app/screens/lectures/EconmyScreen";
import LawScreen from "./src/app/screens/lectures/LawScreen";
import AccountingScreen from "./src/app/screens/lectures/AccountingScreen";
import EnglishScreen from "./src/app/screens/lectures/EnglishScreen";
import MangmentScreen from "./src/app/screens/lectures/MangmentScreen";
import InfoScreen from "./src/app/screens/InfoScreen";
import SupportScreen from "./src/app/screens/SupportScreen";
import EconmyTestScreen from "./src/app/screens/lecturesTests/EconmyTestScreen";
import MangmentTestScreen from "./src/app/screens/lecturesTests/MangmentTestScreen";
import EconomyReportsScreen from "./src/app/screens/reports/EconomyReportsScreen";
import MangmentReportsScreen from "./src/app/screens/reports/MangmentReportsScreen";

SplashScreen.preventAutoHideAsync();

const Tab = createBottomTabNavigator();
const SettingsStack = createStackNavigator();
const ReadStack = createStackNavigator();
const HomeStack = createStackNavigator();

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
              remainingDays: userData.remainingDays,
              isLocked: userData.remainingDays <= 0 ? true : false,
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
            title: "إعدادات الحساب",
            headerTitleStyle: {
              fontFamily: "Tajawal-Bold", // Apply the custom font
              fontSize: 20, // Optional: adjust font size
              color: "#000", // Optional: adjust text color
            },
          }}
        />
        <SettingsStack.Screen
          name="info"
          component={InfoScreen} // Another screen inside settings
          options={{
            title: "معلومات التطبيق",
            headerTitleStyle: {
              fontFamily: "Tajawal-Bold", // Apply the custom font
              fontSize: 20, // Optional: adjust font size
              color: "#000", // Optional: adjust text color
            },
          }}
        />
        <SettingsStack.Screen
          name="support"
          component={SupportScreen} // Another screen inside settings
          options={{
            title: "تواصل معنا",
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

  function HomeStackScreen() {
    return (
      <HomeStack.Navigator initialRouteName="HomeStack">
        <HomeStack.Screen
          name="HomeStack"
          component={HomeScreen}
          options={{ headerShown: false }} // No header for the main settings screen
        />
        <HomeStack.Screen
          name="EconomyReports"
          component={EconomyReportsScreen} // Another screen inside settings
          options={{
            title: "تقارير الاقتصاد",
            headerTitleStyle: {
              fontFamily: "Tajawal-Bold", // Apply the custom font
              fontSize: 20, // Optional: adjust font size
              color: "#000", // Optional: adjust text color
            },
          }}
        />
        <HomeStack.Screen
          name="MangmentReports"
          component={MangmentReportsScreen} // Another screen inside settings
          options={{
            title: "تقارير إدارة الأعمال",
            headerTitleStyle: {
              fontFamily: "Tajawal-Bold", // Apply the custom font
              fontSize: 20, // Optional: adjust font size
              color: "#000", // Optional: adjust text color
            },
          }}
        />
      </HomeStack.Navigator>
    );
  }

  function ReadStackScreen() {
    return (
      <ReadStack.Navigator initialRouteName="ReadMain">
        <ReadStack.Screen
          name="ReadMain"
          component={ReadScreen}
          options={{ headerShown: false }} // No header for the main read screen
        />
        <ReadStack.Screen
          name="EconmyScreen"
          component={EconmyScreen} // A screen that displays the details
          options={{
            title: "ملخصات مبادئ الاقتصاد",
            headerTitleStyle: {
              fontFamily: "Tajawal-Bold",
              fontSize: 20,
              color: "#000",
            },
          }}
        />
        <ReadStack.Screen
          name="LawScreen"
          component={LawScreen} // A screen that displays the details
          options={{
            title: "ملخصات القانون",
            headerTitleStyle: {
              fontFamily: "Tajawal-Bold",
              fontSize: 20,
              color: "#000",
            },
          }}
        />
        <ReadStack.Screen
          name="AccountingScreen"
          component={AccountingScreen} // A screen that displays the details
          options={{
            title: "ملخصات مبادئ المحاسبة",
            headerTitleStyle: {
              fontFamily: "Tajawal-Bold",
              fontSize: 20,
              color: "#000",
            },
          }}
        />
        <ReadStack.Screen
          name="EnglishScreen"
          component={EnglishScreen} // A screen that displays the details
          options={{
            title: "ملخصات اللغة الاجنبية",
            headerTitleStyle: {
              fontFamily: "Tajawal-Bold",
              fontSize: 20,
              color: "#000",
            },
          }}
        />
        <ReadStack.Screen
          name="MangmentScreen"
          component={MangmentScreen} // A screen that displays the details
          options={{
            title: "ملخصات إدارة الاعمال",
            headerTitleStyle: {
              fontFamily: "Tajawal-Bold",
              fontSize: 20,
              color: "#000",
            },
          }}
        />
        <ReadStack.Screen
          name="EconmyTestScreen"
          component={EconmyTestScreen} // A screen that displays the details
          options={{
            title: "أسئلة مبادئ الاقتصاد",
            headerTitleStyle: {
              fontFamily: "Tajawal-Bold",
              fontSize: 20,
              color: "#000",
            },
          }}
        />
        <ReadStack.Screen
          name="MangmentTestScreen"
          component={MangmentTestScreen} // A screen that displays the details
          options={{
            title: "أسئلة مبادئ إدارة الأعمال",
            headerTitleStyle: {
              fontFamily: "Tajawal-Bold",
              fontSize: 20,
              color: "#000",
            },
          }}
        />
      </ReadStack.Navigator>
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
        tabBarActiveTintColor: "#990101",
        tabBarInactiveTintColor: "#000000",
      })}
    >
      <Tab.Screen name="Settings" component={SettingsStackScreen} />
      <Tab.Screen name="Read" component={ReadStackScreen} />
      {/* Updated here */}
      <Tab.Screen name="Home" component={HomeStackScreen} />
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
