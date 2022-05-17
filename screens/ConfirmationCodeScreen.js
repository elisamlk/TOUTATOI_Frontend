import React from "react";
import { StyleSheet, Text, View, Button } from "react-native";

export default function ConfirmationCodeScreen(props) {
  return (
    <View style={styles.container}>
      <Text>Code de confirmation</Text>
      <Text>
        Un code de confirmation vous a été envoyé à l'adresse mail:
        XXX@gamil.com
      </Text>
      <Text>Code de confirmation à renseigner</Text>
      <Button
        title="Valider"
        onPress={() => props.navigation.navigate("BottomNavigator")}
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
