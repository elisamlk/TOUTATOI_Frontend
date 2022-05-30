import React, { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { Header, Card, Button, Overlay, Input } from "react-native-elements";
import { Text } from "@rneui/themed";
import { FontAwesome5 } from "@expo/vector-icons";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { connect } from "react-redux";
import { createPortal } from "react-dom";
import configUrl from "../config/url.json";
import { CardDivider } from "@rneui/base/dist/Card/Card.Divider";
import configStyle from "../config/style";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "react-native-vector-icons/AntDesign";
import { styles } from "react-native-element-dropdown/src/components/TextInput/styles";

function HomeScreen(props) {
  const [email, setEmail] = useState([]); //INPUT LISTE EMAIL
  const [isListVisible, setIsListVisible] = useState(false); //AFFICHAGE DE LA LISTE
  const [kidName, setKidName] = useState(""); //INPUT OVERLAY PRENOM DE L'ENFANT
  const [kidGrade, setKidGrade] = useState(""); //INPUT OVERLAY CLASSE DE L'ENFANT
  const [isSelected, setIsSelected] = useState(0); //GERE LE DISABLING DES ITEMS 'ENFANT'
  const [getKidResponse, setGetKidResponse] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [bddToUpdate, setBddToUpdate] = useState(false);
  const [value, setValue] = useState(null);

  //AJOUTER UN ENFANT A LA BASE DE DONNEES PUIS AU REDUCER-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
  var handleAddKid = async () => {
    let data = await fetch(`${configUrl.url}/kids/addKid`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `userIdFromFront=${props.user}&firstNameFromFront=${kidName}&gradeFromFront=${kidGrade}`,
    });
    let response = await data.json();
    let sendKid = {
      id: response.kidId,
      firstName: kidName,
      isActive: false,
      isRelated: false,
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

      if (response.result) {
        let kidList = response.kidListToReturn;
        if (kidList.length > 0) {
          kidList[0].isActive = true;
          for (i = 1; i < kidList.length; i++) {
            kidList[i].isActive = false;
          }
          props.submitKidList(kidList);
          props.selectKid(kidList[0]);
        }
        setGetKidResponse(true);
      }
    };
    getKid();
  }, []);

  //LES SUPPRIMER DE LA BDD_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_ ROUTE QUASIMENT PRETE SAUF QU'ELLE NE SEMBLE PAS SUPPRIMER LE BON ENFANT...
  /*   var deleteKid = async (kid) => {
    await fetch(
      `${configUrl.url}/kids/deleteKid/${kid.kidId}`, 
      {
        method: "DELETE",
      }
    );
  }; */

  if (!getKidResponse) {
    return (
      <View>
        <Text>Chargememnt...</Text>
      </View>
    );
  }

  //SELECTIONNER UN ENFANT DANS LA LIST -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
  let isActiveToggle = (i) => {
    setIsSelected(i);
    props.activeAKid(i);
    console.log("kid activé ", props.kidList[i]);
    props.selectKid(props.kidList[i]);
  };

  if (props.activeKid.relatedUsers) {
    var relatedList = props.activeKid.relatedUsers.map((mail, i) => {
      return (
        <View
          key={i}
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 20,
            justifyContent: "space-between",
          }}
        >
          <Text>{mail}</Text>
          <Button
            buttonStyle={configStyle.trashbutton}
            icon={<FontAwesome5 name="trash" size={10} color="white" />}
            onPress={() => {
              if (!bddToUpdate) {
                setBddToUpdate(true);
              }
              props.suppRelated(mail);
            }}
          />
        </View>
      );
    });
  }

  //AFFICHER LES ENFANTS DE L'ADMIN SUR L'ECRAN VIA UN MAP
  const kidsItem = props.kidList.map((kidItem, i) => {
    if (kidItem.isRelated === false) {
      var shareButton = (
        <Button
          key={i}
          buttonStyle={{
            height: 30,
            width: 30,
            borderRadius: 50,
            backgroundColor: "#FABE6D",
          }}
          icon={<FontAwesome5 name="share-alt" size={12} color="white" />}
          disabled={isSelected !== i ? true : false}
          disabledStyle={{ backgroundColor: "grey" }}
          onPress={() => {
            setIsListVisible(true);
          }}
        />
      );
    }

    return (
      <TouchableOpacity
        key={i}
        style={configStyle.card}
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

        <Text style={{ fontFamily: "Lato_700Bold", fontSize: 16 }}>
          {kidItem.firstName}
        </Text>

        <View style={{ flexDirection: "row" }}>
          <Button
            buttonStyle={{
              marginRight: 5,
              height: 30,
              width: 30,
              borderRadius: 50,
              backgroundColor: "#FABE6D",
            }}
            icon={<FontAwesome5 name="trash" size={12} color="white" />}
            disabled={isSelected !== i ? true : false}
            disabledStyle={{ backgroundColor: "grey" }}
            onPress={() => {
              /* deleteKid(kidItem); */
              // props.deleteAKid(kidItem.kidId);
            }}
          />
          {shareButton}
        </View>
        <Overlay
          overlayStyle={{ width: "85%", borderRadius: 15 }}
          isVisible={isListVisible}
          onBackdropPress={() => {
            handleBackdropPress();
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontFamily: "Lato_700Bold",
              marginBottom: 10,
            }}
          >
            Qui peut jouer avec {props.activeKid.firstName}?
          </Text>
          <Text style={{ textAlign: "center", fontFamily: "Lato_700Bold" }}>
            Ajouter des membres
          </Text>

          <Input
            style={configStyle.inputShare}
            // containerStyle={{ marginBottom: 25 }}
            placeholder="ami@famille.fr"
            onChangeText={(val) => setEmail(val)}
            value={email}
            autoCapitalize="none"
            rightIcon={
              <AntDesign
                name="pluscircle"
                size={24}
                color="#FABE6D"
                onPress={() => {
                  props.addRelated(email);
                  setEmail("");
                  if (!bddToUpdate) {
                    setBddToUpdate(true);
                  }
                }}
              />
            }
          />

          {relatedList}
        </Overlay>
      </TouchableOpacity>
    );
  });

  let handleBackdropPress = () => {
    if (bddToUpdate) {
      async function updateKid() {
        var rawResponse = await fetch(
          `${configUrl.url}/kids/KidRelatedUsers/${props.activeKid.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `newKidRelatedFromFront=${JSON.stringify(
              props.activeKid.relatedUsers
            )}`,
          }
        );
        var response = await rawResponse.json();
        console.log("retour push kidRelatedUsers ", response);
        setBddToUpdate(false);
      }
      updateKid();
    }

    setIsListVisible(false);
  };

  const data = [
    { label: "CP", value: "1" },
    { label: "CE1", value: "2" },
    { label: "CE2", value: "3" },
    { label: "CM1", value: "4" },
    { label: "CM2", value: "5" },
  ];

  const renderItem = (item) => {
    return (
      <View style={configStyle.item}>
        <Text style={configStyle.textItem}>{item.label}</Text>
        {item.value === value && (
          <AntDesign
            style={configStyle.icon}
            color="black"
            name="Safety"
            size={20}
          />
        )}
      </View>
    );
  };

  return (
    <View style={configStyle.container}>
      <ScrollView style={{ width: "100%", paddingHorizontal: 20 }}>
        <Text style={configStyle.titleH1}>Sélectionnez un profil</Text>
        {kidsItem}
        <View style={configStyle.container}>
          <TouchableOpacity
            style={{
              borderRadius: 15,
              width: 220,
              color: "white",

              backgroundColor: "#FFC9B9",
              marginTop: 30,
            }}
            onPress={() => {
              setIsVisible(true);
            }}
          >
            <Text
              style={{
                margin: 10,
                fontWeight: "bold",
                justifyContent: "center",
                textAlign: "center",
                color: "white",
              }}
            >
              Ajouter un nouveau profil enfant
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              borderRadius: 15,
              width: 150,
              color: "white",

              backgroundColor: "#FFC9B9",
              marginTop: 30,

              backgroundColor: "#216869",
            }}
            onPress={() => {
              AsyncStorage.clear();
              props.clearFirstKid();
              props.navigation.navigate("Accueil");
            }}
          >
            <Text
              style={{
                margin: 10,
                color: "white",
                justifyContent: "center",
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              Déconnexion
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Overlay
        overlayStyle={{ width: "85%", borderRadius: 15 }}
        isVisible={isVisible}
        onBackdropPress={() => {
          setIsVisible(false);
        }}
      >
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text
            style={{
              textAlign: "center",
              fontFamily: "Lato_700Bold",
              marginBottom: 10,
            }}
          >
            Comment s'appelle l'enfant ?
          </Text>
          <Input
            style={configStyle.inputShare}
            containerStyle={{ marginBottom: 25 }}
            placeholder="Laura"
            onChangeText={(val) => setKidName(val)}
          />

          <Text
            style={{
              textAlign: "center",
              fontFamily: "Lato_700Bold",
              marginBottom: 10,
            }}
          >
            Classe de l'enfant{" "}
          </Text>
          <Dropdown
            style={configStyle.dropdown}
            placeholderStyle={configStyle.placeholderStyle}
            selectedTextStyle={configStyle.selectedTextStyle}
            inputSearchStyle={configStyle.inputSearchStyle}
            iconStyle={configStyle.iconStyle}
            data={data}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Sélectionnez"
            searchPlaceholder="Search..."
            value={value}
            onChange={(item) => {
              setKidGrade(item.label);
              setValue(item.value);
            }}
            renderLeftIcon={() => (
              <AntDesign
                style={configStyle.icon}
                color="black"
                name="Safety"
                size={20}
              />
            )}
            renderItem={renderItem}
          />

          <TouchableOpacity
            style={{
              borderRadius: 15,
              width: 220,
              color: "white",
              justifyContent: "center",
              backgroundColor: "#FFC9B9",
              marginTop: 30,
            }}
            onPress={() => handleAddKid()}
          >
            <Text
              style={{
                margin: 10,
                fontWeight: "bold",
                justifyContent: "center",
                textAlign: "center",
                color: "white",
              }}
            >
              Ajouter le profil enfant
            </Text>
          </TouchableOpacity>

          {/* <Button
            title="Ajoutez le profil enfant"
            buttonStyle={{ backgroundColor: "#FFC9B9" }}
            
            type="solid"
          /> */}
        </View>
      </Overlay>
    </View>
  );
}

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
    selectKid: function (kid) {
      dispatch({ type: "selectKid", kid });
    },
    addRelated: function (mail) {
      dispatch({ type: "addRelated", mail });
    },
    suppRelated: function (mail) {
      dispatch({ type: "suppRelated", mail });
    },
  };
}

function mapStateToProps(state) {
  return {
    user: state.activeUser,
    kidList: state.kidList,
    activeKid: state.activeKid,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
