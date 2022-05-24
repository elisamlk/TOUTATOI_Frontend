import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Input } from "react-native-elements";
import { connect } from "react-redux";
import monjson from "../jsonModels/url.json";

function KidProfilScreen(props) {
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Créez l'espace dédié à l'enfant</Text>
      <Text style={styles.h2}>Vous pourrez rajouter des profils plus tard</Text>
      <View style={styles.containerForm}>
        <Input
          style={styles.input}
          placeholder="Prénom"
          onChangeText={(val) => setName(val)}
        />

        <Input
          style={styles.input}
          placeholder="Classe"
          onChangeText={(val) => setGrade(val)}
        />
      </View>

      <Text style={styles.text}>
        En continuant, j'accepte les conditions générales d'utilisation.
      </Text>
      <View>
        <TouchableOpacity
          style={styles.button1}
          onPress={() => {
            props.addFirstKid(name, grade), props.navigation.navigate("SignUp");
          }}
        >
          <Text style={styles.fonts} flex-start>
            Continuer
          </Text>
        </TouchableOpacity>
      </View>
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
  },
  h2: {
    fontFamily: "Lato_400Regular",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
  },
  containerForm: {
    backgroundColor: "#9CC5A1",
    alignItems: "center",
    justifyContent: "center",
    width: 290,
    height: 250,
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
    addFirstKid: function (name, grade) {
      dispatch({ type: "addFirstKid", name: name, grade: grade });
    },
  };
}

export default connect(null, mapDispatchToProps)(KidProfilScreen);
