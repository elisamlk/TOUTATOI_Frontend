import React, { useState } from "react";
import AccueilScreen from "./screens/AccueilScreen";
import KidProfilScreen from "./screens/KidProfilScreen";
import SignUpScreen from "./screens/SignUpScreen";
import ConfirmationCodeScreen from "./screens/ConfirmationCodeScreen";
import SignInScreen from "./screens/SignInScreen";
import HomeScreen from "./screens/HomeScreen";
import DashboardScreen from "./screens/DashboardScreen";
import ChallengeScreen from "./screens/ChallengeScreen";
import LoadFonts from "./screens/LoadFonts";
import { Ionicons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import activeUser from "./reducers/activeUser";
import activeKid from "./reducers/activeKid";
import kidList from "./reducers/kidList";
import answerList from "./reducers/answerList";
import firstKid from "./reducers/firstKid";
import { Provider } from "react-redux";
import { createStore, combineReducers } from "redux";
import { LogBox } from "react-native";
LogBox.ignoreAllLogs();

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const store = createStore(
  combineReducers({
    activeUser,
    activeKid,
    kidList,
    firstKid,
    answerList,
  })
);

const BottomNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => {
          let iconName;

          if (route.name == "Dashboard") {
            return <Ionicons name="settings" size={24} color={color} />;
          } else if (route.name == "Challenge") {
            return <FontAwesome5 name="rocket" size={24} color={color} />;
          } else if (route.name == "Home") {
            return <Entypo name="home" size={24} color={color} />;
          }

          return <Ionicons name={iconName} size={25} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: "#216869",
        inactiveTintColor: "#FFC9B9",
        style: {
          backgroundColor: "#9CC5A1",
        },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Challenge" component={ChallengeScreen} />
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <LoadFonts>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Accueil" component={AccueilScreen} />
            <Stack.Screen name="KidProfil" component={KidProfilScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen
              name="ConfirmationCode"
              component={ConfirmationCodeScreen}
            />
            <Stack.Screen name="BottomNavigator" component={BottomNavigator} />
          </Stack.Navigator>
        </NavigationContainer>
      </LoadFonts>
    </Provider>
  );
}
