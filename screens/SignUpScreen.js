import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Input } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import { connect } from "react-redux";

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
      let response = await fetch(
        "http://192.168.10.162:3000/users/submitMail",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: `mailFromFront=${email}&isNew=true`,
        }
      );
      let result = await response.json();

      console.log("userId récupérée du backend =>", result.userId);

      props.activeUser(result.userId);
      props.navigation.navigate("ConfirmationCode");
    }
  };

  return (
    <View style={styles.container}>
      <Text>Inscrivez-vous pour jouer sur tous vos appareils</Text>

      <Input
        containerStyle={{ marginBottom: 25, width: "70%" }}
        inputStyle={{ marginLeft: 10 }}
        placeholder="laura@gmail.com"
        leftIcon={<Ionicons name="mail-outline" size={24} color="#49A078" />}
        onChangeText={(val) => setEmail(val)}
      />

      <Text>En continuant, j'accepte les conditions d'utilisation</Text>

      <TouchableOpacity style={styles.button} onPress={() => submitMail()}>
        <Text style={styles.fonts} flex-start>
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
    justifyContent: "space-around",
  },
  button: {
    color: "white",
    backgroundColor: "#49A078",
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
});

function mapDispatchToProps(dispatch) {
  return {
    activeUser: function (id) {
      dispatch({ type: "activeUser", id: id });
    },
  };
}

export default connect(null, mapDispatchToProps)(SignUpScreen);
