import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Input } from "react-native-elements";
import { connect } from "react-redux";
import monjson from "../jsonModels/url.json";
import AsyncStorage from "@react-native-async-storage/async-storage";

function ConfirmationCodeScreen(props) {
  const [confCodeFromFront, setConfCodeFromFront] = useState("");

  let submitCode = async () => {
    console.log("confCodeFromFront", confCodeFromFront);
    console.log("props.activeUser =>", props.activeUser);
    console.log("props.firstKid =>", props.firstKid);

    if (confCodeFromFront) {
      let verifyCodeResponse = await fetch(
        `${monjson.url}/users/submitConfirmationCode`,
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: `userIdFromFront=${props.activeUser}&confCodeFromFront=${confCodeFromFront}`,
        }
      );
      let verifyCodeResult = await verifyCodeResponse.json();

      console.log("verifyCodeResult =>", verifyCodeResult);
      console.log("Est-ce que le code est bon? =>", verifyCodeResult.result);
      console.log("newCveriFyCodeResult.code =>", verifyCodeResult.code);
      console.log("props.firstkid.name.length =>", props.firstKid.name.length);

      if (props.firstKid.name) {
        console.log("il y a un enfant dans le reducer");
        if (verifyCodeResult.result) {
          let createKidResponse = await fetch(`${monjson.url}/kids/addKid`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `userIdFromFront=${props.activeUser}&firstNameFromFront=${props.firstKid.name}&gradeFromFront=${props.firstKid.grade}`,
          });

          let createKidResult = await createKidResponse.json();
          console.log(
            "Est-ce que le kid est créé ? =>",
            createKidResult.result
          );

          if (createKidResult.result) {
            AsyncStorage.setItem("code", confCodeFromFront);
            props.navigation.navigate("BottomNavigator");
          } else {
            console.log(
              "la création du kid n'a pas fonctionné. Erreur:",
              createKidResult.error
            );
          }
        }
      } else {
        if (verifyCodeResult.result) {
          console.log("il n'y a pas d'enfant dans le reducer");
          AsyncStorage.setItem("code", confCodeFromFront);
          props.navigation.navigate("BottomNavigator");
        } else {
          console.log("le code n'est pas bon, pas de redirection");
        }
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text>Un code de confirmation vous a été envoyé par email</Text>

      <Input
        containerStyle={{ marginBottom: 25, width: "70%" }}
        inputStyle={{ marginLeft: 10 }}
        placeholder="Code de confirmation"
        onChangeText={(val) => setConfCodeFromFront(val)}
      />

      <Text sty>
        Vous n'avez pas reçu l'email ? Cliquez ici pour le renvoyer
      </Text>

      <TouchableOpacity style={styles.button} onPress={() => submitCode()}>
        <Text style={styles.fonts} flex-start>
          Valider
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

function mapStateToProps(state) {
  return { firstKid: state.firstKid, activeUser: state.activeUser };
}

export default connect(mapStateToProps, null)(ConfirmationCodeScreen);
