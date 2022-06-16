import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Input } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import { connect } from "react-redux";
import configUrl from "../config/url.json";
import configStyle from "../config/style";

function SignInScreen(props) {
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
          body: `mailFromFront=${email}&isNew=false`,
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
    <View style={configStyle.signInScreenContainer}>
      <Text style={configStyle.titleH1}>Renseignez votre adresse mail</Text>
      <View style={configStyle.containerForm}>
        <Input
          style={configStyle.input}
          inputContainerStyle={{ borderBottomWidth: 0 }}
          placeholder="laura@gmail.com"
          autoCapitalize="none"
          leftIcon={<Ionicons name="mail-outline" size={24} color="#49A078" />}
          onChangeText={(val) => setEmail(val)}
        />
        <Text style={configStyle.error}>{error}</Text>
      </View>
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

export default connect(null, mapDispatchToProps)(SignInScreen);
