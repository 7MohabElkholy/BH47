import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { Provider, useSelector } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import store from "./src/app/store";
import { Counter } from "./src/app/features/counter/Counter";
import HomeScreen from "./src/app/screens/HomeScreen";
import SettingsScreen from "./src/app/screens/SettingsScreen";
import LoginScreen from "./src/app/screens/LoginScreen"; // Import LoginScreen
import { selectUser } from "./src/app/userSlice"; // Import user selector
import { Ionicons } from "@expo/vector-icons"; // Import icons
import * as Font from "expo-font"; // Import Font loading utility from Expo
import AppLoading from "expo-app-loading"; // Optional: App loading while font is fetched

const Tab = createBottomTabNavigator();

function MainApp() {
  const user = useSelector(selectUser); // Get the global user state

  // If the user state is empty, show the LoginScreen
  if (!user) {
    return <LoginScreen />;
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Counter") {
            iconName = focused ? "calculator" : "calculator-outline";
          } else if (route.name === "Settings") {
            iconName = focused ? "settings" : "settings-outline";
          }

          // Return the appropriate icon from Ionicons
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Counter" component={Counter} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const loadFonts = async () => {
    await Font.loadAsync({
      "Tajawal-Regular": require("./assets/fonts/Tajawal-Regular.ttf"),
      "Tajawal-Bold": require("./assets/fonts/Tajawal-Bold.ttf"),
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
