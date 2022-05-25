import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Header, Card, Button, Overlay, Input } from "react-native-elements";
import { Text } from "@rneui/themed";
import { FontAwesome5 } from "@expo/vector-icons";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { connect } from "react-redux";
import { createPortal } from "react-dom";
import configUrl from "../config/url.json";

function HomeScreen(props) {
  const [isVisible, setIsVisible] = useState(false); //AFFICHAGE DE L'OVERLAY
  const [kidName, setKidName] = useState(""); //INPUT OVERLAY PRENOM DE L'ENFANT
  const [kidGrade, setKidGrade] = useState(""); //INPUT OVERLAY CLASSE DE L'ENFANT
  const [isSelected, setIsSelected] = useState(0); //GERE LE DISABLING DES ITEMS 'ENFANT'

  //AJOUTER UN ENFANT A LA BASE DE DONNEES PUIS AU REDUCER-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
  var handleAddKid = async () => {
    let data = await fetch(`${configUrl.url}/kids/addKid`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `userIdFromFront=${props.user}&firstNameFromFront=${kidName}&gradeFromFront=${kidGrade}`,
    });
    let response = await data.json();
    let sendKid = {
      kidId: response.kidId,
      kidFirstName: kidName,
      isActive: false,
    };
    props.addAKid(sendKid);
    setIsVisible(false);
    setKidGrade();
    setKidName();
  };

  //RECUPERER LES ENFANTS DE L'USERID DEPUIS LA BDD -_-_-_LES ENVOYER AU REDUCER
  useEffect(() => {
    const getKid = async () => {
      let data = await fetch(
        `${configUrl.url}/kids/getKidsByUserId?userIdFromFront=${props.user}`
      );
      let response = await data.json();
      let firstIsActive = false;
      var kidListFromDB = response.adminKidList.map((e, i) => {
        if (i === 0) {
          firstIsActive = true;
        } else {
          firstIsActive = false;
        }
        return {
          kidId: e._id,
          kidFirstName: e.firstName,
          isActive: firstIsActive,
        };
      });
      props.submitKidList(kidListFromDB);
    };
    getKid();
  }, []);

  //LES SUPPRIMER _-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_ ROUTE QUASIMENT PRETE SAUF QU'ELLE NE SEMBLE PAS SUPPRIMER LE BON ENFANT...
  /*   var deleteKid = async (kid) => {
    await fetch(
      `${configUrl.url}/kids/deleteKid/${kid.kidId}`, 
      {
        method: "DELETE",
      }
    );
  }; */

  //SELECTIONNER -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
  let isActiveToggle = (i) => {
    setIsSelected(i);
    props.activeAKid(i);
  };

  //LES AFFICHER SUR L'ECRAN VIA UN MAP
  const kidsItem = props.kidList.map((kidItem, i) => {
    return (
      <TouchableOpacity
        key={i}
        style={styles.card}
        onPress={() => {
          isActiveToggle(i);
        }}
      >
        <Button
          buttonStyle={{
            height: 50,
            width: 50,
            borderRadius: 50,
            backgroundColor: "#FABE6D",
          }}
          icon={<FontAwesome5 name="user-astronaut" size={24} color="white" />}
          disabled={isSelected !== i ? true : false}
          disabledStyle={{ backgroundColor: "grey" }}
        />
        <Card.Title
          style={{
            alignItems: "center",
            justifyContent: "center",
            paddingTop: 15,
            paddingHorizontal: 10,
          }}
        >
          {kidItem.kidFirstName}
        </Card.Title>
        <Button
          buttonStyle={{
            height: 30,
            width: 30,
            borderRadius: 50,
            backgroundColor: "#FABE6D",
          }}
          containerStyle={{ paddingTop: 12 }}
          icon={<FontAwesome5 name="trash" size={12} color="white" />}
          disabled={isSelected !== i ? true : false}
          disabledStyle={{ backgroundColor: "grey" }}
          onPress={() => {
            /* deleteKid(kidItem); */
            props.deleteAKid(kidItem.kidId);
          }}
        />
        <Button
          buttonStyle={{
            height: 30,
            width: 30,
            borderRadius: 50,
            backgroundColor: "#FABE6D",
          }}
          containerStyle={{ paddingTop: 12, paddingLeft: 1 }}
          icon={<FontAwesome5 name="plus-square" size={16} color="white" />}
          disabled={isSelected !== i ? true : false}
          disabledStyle={{ backgroundColor: "grey" }}
          // onPress={() =>} pas de route+pas compris dernier truc a faire de ma route
        />
      </TouchableOpacity>
    );
  });

  return (
    <View>
      <Overlay
        overlayStyle={{ width: 280, borderRadius: 15 }}
        isVisible={isVisible}
        onBackdropPress={() => {
          setIsVisible(false);
        }}
      >
        <View>
          <Input
            containerStyle={{ marginBottom: 25 }}
            placeholder="Comment s'appelle l'enfant ?"
            onChangeText={(val) => setKidName(val)}
          />
          <Input
            containerStyle={{ marginBottom: 25 }}
            placeholder="En quelle classe est-il ?"
            onChangeText={(val) => setKidGrade(val)}
          />
          <TouchableOpacity style={styles.button2}>
            <Text style={styles.fonts} onPress={() => handleAddKid()}>
              Ajouter l'enfant
            </Text>
          </TouchableOpacity>

          {/* <Button
          style={styles.button2}
            title="Ajoutez l'enfant"
            onPress={() => handleAddKid()}
            type="solid"
          /> */}
        </View>
      </Overlay>
      <ScrollView
        style={{ width: "100%", paddingHorizontal: 20, marginTop: 50 }}
      >
        <View>{kidsItem}</View>

        <View style={styles.buttonDisplay}>
          <TouchableOpacity style={styles.button2}>
            <Text
              style={styles.fonts}
              onPress={() => {
                setIsVisible(true);
              }}
            >
              Ajouter un nouvel enfant
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button1}>
            <Text
              onPress={() => {
                AsyncStorage.clear();
                props.clearFirstKid();
                props.navigation.navigate("Accueil");
              }}
              style={styles.fonts}
            >
              Déconnexion
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   alignItems: "center",
  //   paddingTop: 50,
  //   justifyContent: "space-between",
  // },

  card: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 75,
    backgroundColor: "white",
    borderRadius: 15,
    shadowOffset: { width: 5, height: 5 },
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
  button1: {
    width: 190,
    color: "white",
    backgroundColor: "#49A078",
    padding: 15,
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 20,
  },
  button2: {
    width: 250,
    color: "white",
    backgroundColor: "#FFC9B9",
    padding: 15,
    marginRight: 10,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 20,
  },
  fonts: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonDisplay: {
    flex: 1,
    alignItems: "center",
    marginBottom: 30,
  },
});

function mapDispatchToProps(dispatch) {
  return {
    addAKid: function (kid) {
      dispatch({ type: "addKid", kid });
    },
    submitKidList: function (kidList) {
      dispatch({ type: "submitKidList", kidList });
    },
    deleteAKid: function (kidId) {
      dispatch({ type: "deleteKid", kidId });
    },
    activeAKid: function (item) {
      dispatch({ type: "activeKid", item });
    },
    clearFirstKid: function () {
      dispatch({ type: "clearFirstKid" });
    },
  };
}

function mapStateToProps(state) {
  return { user: state.activeUser, kidList: state.kidList };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
