import React from "react";
import { StyleSheet, Text, View, Button } from "react-native";

export default function SignInScreen(props) {
  return (
    <View style={styles.container}>
      <Text>Renseignez votre adresse mail</Text>
      <Text>Mail</Text>
      <Button
        title="Continuer"
        onPress={() => props.navigation.navigate("ConfirmationCode")}
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
