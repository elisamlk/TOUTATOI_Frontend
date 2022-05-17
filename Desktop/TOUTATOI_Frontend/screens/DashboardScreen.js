import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Text, Card } from "@rneui/themed";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";

// Onglet personnalisation des notions
const FirstRoute = () => (
  <View style={[styles.scene, { backgroundColor: "white" }]}>
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.fonts} h4>
          Cockpit de Gabrielle
        </Text>
        <Text style={styles.fonts} h5>
          Aidez nous à personnaliser le programme de votre enfant !
        </Text>
        <View style={styles.card}>
          <Card.Title style={styles.title}>Français</Card.Title>
          <View style={styles.buttonDisplay}>
            <TouchableOpacity>
              <Text style={styles.button}>Orthographe</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.button}>Grammaire</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.button}>Dictée</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.button}>Conjugaison</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.button}>Vocabulaire</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.card}>
          <Card.Title style={styles.title}>Maths</Card.Title>
          <View style={styles.buttonDisplay}>
            <TouchableOpacity>
              <Text style={styles.button}>Géométrie</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.button}>Calcul</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  </View>
);

// Onglet Statistique
const SecondRoute = () => (
  <View style={[styles.scene, { backgroundColor: "white" }]}>
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.fonts} h4>
          Cockpit de Gabrielle
        </Text>
        <Text style={styles.fonts} h5>
          Suivez les progrès de votre enfant
        </Text>
      </View>
    </ScrollView>
  </View>
);

const initialLayout = { width: Dimensions.get("window").width };

const renderScene = SceneMap({
  first: FirstRoute,
  second: SecondRoute,
});

export default function DashboardScreen(props) {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: "Personnalisation" },
    { key: "second", title: "Stat" },
  ]);

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      activeColor={"white"}
      inactiveColor={"#FFC9B9"}
      style={{ backgroundColor: "#216869" }}
    />
  );

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      renderTabBar={renderTabBar}
      onIndexChange={setIndex}
      initialLayout={initialLayout}
      style={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: StatusBar.currentHeight,
  },
  card: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 15,
    shadowOffset: { width: 5, height: 5},
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8,
    paddingLeft: 16,
    paddingRight: 14,
    marginTop: 15,
    marginBottom: 20,
    marginLeft: 16,
    marginRight: 16,
  },
  buttonDisplay: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  button: {
    color: "white",
    backgroundColor: "#FABE6D",
    padding: 8,
    marginRight: 10,
    marginBottom: 10,
  },
  scene: {
    flex: 1,
  },
  fonts: {
    marginTop: 10,
    marginBottom: 8,
    textAlign: "center",
  },
  title: {
    marginTop: 10,
  },
});
