import React from "react";
import { StyleSheet, Text, View, Button } from "react-native";

export default function AccueilScreen(props) {
  return (
    <View style={styles.container}>
      <Text>Bienvenue sur TOUTATOI</Text>
      <Button
        title="C'est parti"
        onPress={() => props.navigation.navigate("KidProfil")}
      />
      <Button
        title="J'ai un compte"
        onPress={() => props.navigation.navigate("SignIn")}
      />
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
