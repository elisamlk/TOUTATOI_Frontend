import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Input } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import { connect } from "react-redux";
import configUrl from "../config/url.json";

function SignUpScreen(props) {
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [error, setError] = useState("");

  let submitMail = async () => {
    console.log("SIGN UP email =>", email);
    // let regex =
    //   /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // if (email.match(regex)) {
    //   setIsEmailValid(true);
    // }
    // console.log("SIGN UP isEmailValid =>", isEmailValid);

    if (isEmailValid) {
      let response = await fetch(`${configUrl.url}/users/submitMail`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `mailFromFront=${email}&isNew=true`,
      });
      let result = await response.json();

      console.log("userId récupérée du backend =>", result.userId);

      props.activeUser(result.userId);
      props.navigation.navigate("ConfirmationCode");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>
        Inscrivez-vous pour jouer sur tous vos appareils
      </Text>
      <View style={styles.containerForm}>
        <Input
          style={styles.input}
          placeholder="Mail du parent"
          leftIcon={<Ionicons name="mail-outline" size={24} color="#49A078" />}
          onChangeText={(val) => setEmail(val)}
        />
      </View>

      <Text style={styles.text}>
        En continuant, j'accepte les conditions générales d'utilisation.
      </Text>

      <TouchableOpacity style={styles.button1} onPress={() => submitMail()}>
        <Text style={styles.fonts}>Continuer</Text>
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
  text: {
    textAlign: "center",
    fontFamily: "Lato_400Regular",
    marginBottom: 20,
    padding: 20,
    fontSize: 15,
  },
  input: {
    width: 300,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 10,
  },
});

function mapDispatchToProps(dispatch) {
  return {
    activeUser: function (id) {
      dispatch({ type: "activeUser", id: id });
    },
  };
}

export default connect(null, mapDispatchToProps)(SignUpScreen);
