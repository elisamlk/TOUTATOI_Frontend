import React from "react";
import { StyleSheet, Text, View, Button } from "react-native";

export default function HomeScreen(props) {
  return (
    <View style={styles.container}>
      <Text>Liste des enfants</Text>
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
