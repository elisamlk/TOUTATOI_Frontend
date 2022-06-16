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
      setError("Merci de renseigner un code");
    } else if (confCodeFromFront.length > 0) {
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
        if ((verifyCodeResult.error.code = 3)) {
          setError(verifyCodeResult.error[0].label);
        } else if ((verifyCodeResult.error.code = 4)) {
          setError(verifyCodeResult.error[0].label);
        }
      } else if (props.firstKid.name) {
        let createKidResponse = await fetch(`${configUrl.url}/kids/addKid`, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: `userIdFromFront=${props.activeUser}&firstNameFromFront=${props.firstKid.name}&gradeFromFront=${props.firstKid.grade}`,
        });
        let createKidResult = await createKidResponse.json();
        if (createKidResult.result) {
          AsyncStorage.setItem("code", confCodeFromFront);
          props.navigation.navigate("BottomNavigator");
        } else {
          console.log("48, la création du kid n'a pas fonctionné");
        }
      } else {
        AsyncStorage.setItem("code", confCodeFromFront);
        props.navigation.navigate("BottomNavigator");
      }
    }
  };

  return (
    <View style={configStyle.signInScreenContainer}>
      <Text style={configStyle.titleH1}>
        Un code de confirmation vous a été envoyé par email
      </Text>
      <View style={configStyle.containerForm}>
        <Input
          inputContainerStyle={{ borderBottomWidth: 0 }}
          style={configStyle.input}
          placeholder="Code de confirmation"
          onChangeText={(val) => setConfCodeFromFront(val)}
        />
        <Text style={configStyle.error}>{error}</Text>
      </View>

      <Text style={configStyle.kidProfilScreenText}>
        Vous n'avez pas reçu l'email ? Cliquez ici pour le renvoyer
      </Text>

      <TouchableOpacity
        style={configStyle.button1}
        onPress={() => submitCode()}
      >
        <Text style={configStyle.signUpScreenFonts}>Valider</Text>
      </TouchableOpacity>
    </View>
  );
}

function mapStateToProps(state) {
  return { firstKid: state.firstKid, activeUser: state.activeUser };
}

export default connect(mapStateToProps, null)(ConfirmationCodeScreen);
