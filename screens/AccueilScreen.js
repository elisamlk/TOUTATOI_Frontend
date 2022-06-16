import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

import configUrl from "../config/url.json";
import configStyle from "../config/style";

function AccueilScreen(props) {
  useEffect(() => {
    AsyncStorage.getItem("code", function (error, userData) {
      if (userData) {
        const getUser = async () => {
          let data = await fetch(
            `${configUrl.url}/users/getUserByCode?codeFromFront=${userData}`
          );
          let response = await data.json();
          if (response.result) {
            props.activeUser(response.userId);
            props.navigation.navigate("BottomNavigator");
          }
        };
        getUser();
      }
    });
  }, []);

  return (
    <View style={configStyle.accueilScreenContainer}>
      <Image
        style={configStyle.image}
        source={require("../assets/logoTest.png")}
      ></Image>

      <Text style={configStyle.h1}>
        L'application pédagogique qui renforce les liens !
      </Text>

      <View>
        <TouchableOpacity
          style={configStyle.button1}
          onPress={() => props.navigation.navigate("KidProfil")}
        >
          <Text style={configStyle.accueilScreenFonts} flex-start>
            C'est parti !
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={configStyle.button2}
          onPress={() => props.navigation.navigate("SignIn")}
        >
          <Text style={configStyle.accueilScreenFonts}>J'ai un compte</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={configStyle.button2}
          onPress={() => props.navigation.navigate("SignIn")}
        >
          <Text style={configStyle.accueilScreenFonts}>Je suis invité</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function mapDispatchToProps(dispatch) {
  return {
    activeUser: function (id) {
      dispatch({ type: "activeUser", id: id });
    },
  };
}

export default connect(null, mapDispatchToProps)(AccueilScreen);
