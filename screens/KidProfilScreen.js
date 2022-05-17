import React from "react";
import { StyleSheet, Text, View, Button } from "react-native";

export default function KidProfilScreen(props) {
  return (
    <View style={styles.container}>
      <Text>Créons l'espace dédié à l'enfant</Text>
      <Button
        title="Continuer"
        onPress={() => props.navigation.navigate("SignUp")}
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
