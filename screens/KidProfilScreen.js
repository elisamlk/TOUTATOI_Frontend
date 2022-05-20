import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Input } from "react-native-elements";
import { connect } from "react-redux";

function KidProfilScreen(props) {
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");

  return (
    <View style={styles.container}>
      <Text>Créons l'espace dédié à l'enfant</Text>
      <View style={styles.containerForm}>
        <Input
          containerStyle={{ marginBottom: 25, width: "70%" }}
          inputStyle={{ marginLeft: 10 }}
          placeholder="Prénom"
          onChangeText={(val) => setName(val)}
        />
        <Input
          containerStyle={{ marginBottom: 25, width: "70%" }}
          inputStyle={{ marginLeft: 10 }}
          placeholder="Classe"
          onChangeText={(val) => setGrade(val)}
        />
      </View>

      <Text>
        En continuant, j'accepte les conditions générales d'utilisation
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
    justifyContent: "space-around",
  },
  containerForm: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: 300,
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
});

function mapDispatchToProps(dispatch) {
  return {
    addFirstKid: function (name, grade) {
      dispatch({ type: "addFirstKid", name: name, grade: grade });
    },
  };
}

export default connect(null, mapDispatchToProps)(KidProfilScreen);
