import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Input } from "react-native-elements";
import { connect } from "react-redux";
import configUrl from "../config/url.json";
import AsyncStorage from "@react-native-async-storage/async-storage";
import configStyle from "../config/style";

function ConfirmationCodeScreen(props) {
  const [confCodeFromFront, setConfCodeFromFront] = useState("");
  const [error, setError] = useState("");

  let submitCode = async () => {
    if (confCodeFromFront.length == 0) {
      console.log("14, il n'y pas de code renseigné");
      setError("Merci de renseigner un code");
    } else if (confCodeFromFront.length > 0) {
      console.log("17, un code est renseigné, on commence les tests");
      let verifyCodeResponse = await fetch(
        `${configUrl.url}/users/submitConfirmationCode`,
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: `userIdFromFront=${props.activeUser}&confCodeFromFront=${confCodeFromFront}`,
        }
      );
      let verifyCodeResult = await verifyCodeResponse.json();
      if (verifyCodeResult.error.length > 0) {
        console.log("28, le backend renvoie une erreur");
        if ((verifyCodeResult.error.code = 3)) {
          setError(verifyCodeResult.error[0].label);
        } else if ((verifyCodeResult.error.code = 4)) {
          setError(verifyCodeResult.error[0].label);
        }
      } else if (props.firstKid.name) {
        console.log("35, le code est bon + il y a un kid dans le reducer");
        let createKidResponse = await fetch(`${configUrl.url}/kids/addKid`, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: `userIdFromFront=${props.activeUser}&firstNameFromFront=${props.firstKid.name}&gradeFromFront=${props.firstKid.grade}`,
        });
        let createKidResult = await createKidResponse.json();
        if (createKidResult.result) {
          console.log("43, la création du kid a fonctionné");
          AsyncStorage.setItem("code", confCodeFromFront);
          props.navigation.navigate("BottomNavigator");
        } else {
          console.log("48, la création du kid n'a pas fonctionné");
        }
      } else {
        console.log("le codes est bon + il n'y a pas de kid dans le reducer");
        AsyncStorage.setItem("code", confCodeFromFront);
        props.navigation.navigate("BottomNavigator");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={configStyle.titleH1}>
        Un code de confirmation vous a été envoyé par email
      </Text>
      <View style={styles.containerForm}>
        <Input
          inputContainerStyle={{ borderBottomWidth: 0 }}
          style={styles.input}
          placeholder="Code de confirmation"
          onChangeText={(val) => setConfCodeFromFront(val)}
        />
        <Text style={styles.error}>{error}</Text>
      </View>

      <Text style={styles.text}>
        Vous n'avez pas reçu l'email ? Cliquez ici pour le renvoyer
      </Text>

      <TouchableOpacity style={styles.button1} onPress={() => submitCode()}>
        <Text style={styles.fonts}>Valider</Text>
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
  button1: {
    width: 190,
    color: "white",
    backgroundColor: "#49A078",
    padding: 15,
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 20,
  },
  containerForm: {
    backgroundColor: "#9CC5A1",
    alignItems: "center",
    justifyContent: "center",
    width: 290,
    height: 200,
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
  error: {
    color: "red",
    textAlign: "center",
    fontFamily: "Lato_400Regular",
    fontSize: 15,
    marginTop: 10,
  },
});

function mapStateToProps(state) {
  return { firstKid: state.firstKid, activeUser: state.activeUser };
}

export default connect(mapStateToProps, null)(ConfirmationCodeScreen);
