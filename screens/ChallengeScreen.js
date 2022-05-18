import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { connect } from "react-redux";

function ChallengeScreen(props) {
  const [funFact, setFunFact] = useState("");
  useEffect(() => {
    async function getChallenge() {
      var rawResponse = await fetch(
        `https://sheltered-tor-38149.herokuapp.com/getChallengeOfTheDay?kidIdFromFront=628351ad7fb1c5050a07b576`
      );
      var response = await rawResponse.json();
      setFunFact(response.challenge.funFact);
    }
    getChallenge();
    console.log(funFact);
  }, []);
  return (
    <View style={styles.container}>
      <Text>Défi de {props.kidFirstName}</Text>
      <Text>{funFact}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

function mapStateToProps(state) {
  return { kidId: state.kidId, kidFirstName: state.kidFirstName };
}

export default connect(mapStateToProps, null)(ChallengeScreen);
