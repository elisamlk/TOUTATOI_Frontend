import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { connect } from "react-redux";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
import monjson from "../jsonModels/url.json";

function AccueilScreen(props) {
  useEffect(() => {
    AsyncStorage.getItem("code", function (error, userData) {
      if (userData) {
        const getUser = async () => {
          let data = await fetch(
            `${monjson.url}/users/getUserByCode?codeFromFront=${userData}` //attention a bien remettre heroku
          );
          let response = await data.json();
          props.activeUser(response.userId);
          props.navigation.navigate("BottomNavigator");
        };
        getUser();
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text h1>Bienvenue sur TOUTATOI</Text>

      <Image
        style={styles.image}
        source={require("../assets/ImageAccueilTest.png")}
      />

      <View>
        <TouchableOpacity
          style={styles.button1}
          onPress={() => props.navigation.navigate("KidProfil")}
        >
          <Text style={styles.fonts} flex-start>
            C'est parti !
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button2}
          onPress={() => props.navigation.navigate("SignIn")}
        >
          <Text style={styles.fonts}>J'ai un compte</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button2}
          onPress={() => props.navigation.navigate("SignIn")}
        >
          <Text style={styles.fonts}>Je suis invité</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
  },
  buttonDisplay: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  button1: {
    color: "white",
    backgroundColor: "#49A078",
    width: 200,
    padding: 4,
    marginRight: 10,
    marginBottom: 10,
  },
  button2: {
    color: "white",
    backgroundColor: "#FFC9B9",
    width: 200,
    padding: 4,
    marginRight: 10,
    marginBottom: 10,
  },
  fonts: {
    color: "white",
    marginTop: 10,
    marginBottom: 8,
    textAlign: "center",
  },
  image: {
    width: windowWidth - windowWidth / 2,
    height: windowHeight - windowHeight / 2,
  },
});

function mapDispatchToProps(dispatch) {
  return {
    activeUser: function (id) {
      dispatch({ type: "activeUser", id: id });
    },
  };
}

export default connect(null, mapDispatchToProps)(AccueilScreen);
