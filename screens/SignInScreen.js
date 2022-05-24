import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Input } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import { connect } from "react-redux";
import monjson from "../jsonModels/url.json";

function SignInScreen(props) {
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [error, setError] = useState("");

  let submitMail = async () => {
    console.log("SIGN IN email", email);

    // let regex =
    //   /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // if (email.match(regex)) {
    //   setIsEmailValid(true);
    // }
    // console.log("SIGN isEmailValid =>", isEmailValid);

    if (isEmailValid) {
      var response = await fetch(`${monjson.url}/users/submitMail`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `mailFromFront=${email}&isNew=false`,
      });
      let result = await response.json();

      console.log("SIGN IN userId récupérée du backend =>", result.userId);

      props.activeUser(result.userId);
      props.navigation.navigate("ConfirmationCode");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Renseignez votre adresse mail</Text>
      <View style={styles.containerForm}>
        <Input
          style={styles.input}
          placeholder="laura@gmail.com"
          leftIcon={<Ionicons name="mail-outline" size={24} color="#49A078" />}
          onChangeText={(val) => setEmail(val)}
        />
      </View>

      <TouchableOpacity style={styles.button1}>
        <Text style={styles.fonts} onPress={() => submitMail()}>
          Continuer
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingBottom: 30,
  },
  h1: {
    fontFamily: "Lato_400Regular",
    fontSize: 20,
    textAlign: "center",
  },
  containerForm: {
    backgroundColor: "#9CC5A1",
    alignItems: "center",
    justifyContent: "center",
    width: 290,
    height: 200,
    borderRadius: 20,
  },
  input: {
    width: 300,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 10,
  },
  button1: {
    width: 190,
    color: "white",
    backgroundColor: "#49A078",
    padding: 15,
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 20,
  },
  fonts: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
});

function mapDispatchToProps(dispatch) {
  return {
    activeUser: function (id) {
      dispatch({ type: "activeUser", id: id });
    },
  };
}

export default connect(null, mapDispatchToProps)(SignInScreen);
