import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Input } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";

import configUrl from "../config/url.json";
import configStyle from "../config/style";

function SignUpScreen(props) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  let submitMail = async () => {
    if (email.length == 0) {
      setError("Merci de renseigner un email");
    } else if (email.length > 0) {
      let regex = /^\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/;
      if (email.match(regex)) {
        let response = await fetch(`${configUrl.url}/users/submitMail`, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: `mailFromFront=${email}&isNew=true`,
        });
        let result = await response.json();
        props.activeUser(result.userId);
        props.navigation.navigate("ConfirmationCode");
      } else {
        setError("L'email renseigné n'est pas au bon format");
      }
    }
  };

  return (
    <View style={configStyle.signUpScreenContainer}>
      <Text style={configStyle.titleH1}>
        Inscrivez-vous pour jouer sur tous vos appareils
      </Text>
      <View style={configStyle.containerForm}>
        <Input
          inputContainerStyle={{ borderBottomWidth: 0 }}
          style={configStyle.input}
          autoCapitalize="none"
          placeholder="Mail du parent"
          leftIcon={<Ionicons name="mail-outline" size={24} color="#49A078" />}
          onChangeText={(val) => setEmail(val)}
        />
        <Text style={configStyle.error}>{error}</Text>
      </View>

      <Text style={configStyle.signUpScreenText}>
        En continuant, j'accepte les conditions générales d'utilisation.
      </Text>

      <TouchableOpacity
        style={configStyle.button1}
        onPress={() => submitMail()}
      >
        <Text style={configStyle.signUpScreenFonts}>Continuer</Text>
      </TouchableOpacity>
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

export default connect(null, mapDispatchToProps)(SignUpScreen);
