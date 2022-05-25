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

function HomeScreen(props) {
  const [isOverlayVisible, setIsOverlayVisible] = useState(false); //AFFICHAGE DE L'OVERLAY
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
      kidId: response.kidId,
      kidFirstName: kidName,
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
        kidList[0].isActive = true;
        for (i = 1; i < kidList.length; i++) {
          kidList[i].isActive = false;
        }

        props.submitKidList(kidList);
        props.selectKid(kidList[0]);
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

  var relatedList = props.activeKid.relatedUsers.map((mail, i) => {
    return (
      <TouchableOpacity style={configStyle.button}>
        <Text>{mail}</Text>
        <Button
          buttonStyle={configStyle.trashbutton}
          containerStyle={{ paddingTop: 12 }}
          icon={<FontAwesome5 name="trash" size={12} color="white" />}
          onPress={() => {
            if (!bddToUpdate) {
              setBddToUpdate(true);
            }
            props.suppRelated(mail);
          }}
        />
      </TouchableOpacity>
    );
  });

  //AFFICHER LES ENFANTS DE L'ADMIN SUR L'ECRAN VIA UN MAP
  const kidsItem = props.kidList.map((kidItem, i) => {
    if (kidItem.isRelated === false) {
      var shareButton = (
        <Button
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
          {kidItem.kidFirstName}
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
              props.deleteAKid(kidItem.kidId);
            }}
          />
          {shareButton}
        </View>
        <Overlay
          overlayStyle={{ width: "70%", borderRadius: 15 }}
          isVisible={isListVisible}
          onBackdropPress={() => {
            handleBackdropPress();
          }}
        >
          <Text>Qui peut jouer avec {props.activeKid.kidFirstName}?</Text>
          <Text>Ajouter des membres</Text>
          <View style={{ flexDirection: "row", width: "70%" }}>
            <Input
              // containerStyle={{ marginBottom: 25 }}
              placeholder="ami@famille.fr"
              onChangeText={(val) => setEmail(val)}
            />
            <Button
              title="ajouter"
              buttonStyle={{ backgroundColor: "#FFC9B9" }}
              onPress={() => {
                props.addRelated(email);
                if (!bddToUpdate) {
                  setBddToUpdate(true);
                }
              }}
              type="solid"
            />
          </View>
          {relatedList}
        </Overlay>
      </TouchableOpacity>
    );
  });

  let handleBackdropPress = () => {
    if (bddToUpdate) {
      async function updateKid() {
        var rawResponse = await fetch(
          `${configUrl.url}/kids/KidRelatedUsers/${props.activeKid.kidId}`,
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
      <Header
        placement="center"
        centerComponent={{
          text: "HOMEPAGE",
          style: {
            color: "#fff",
            marginBottom: 5,
          },
        }}
        containerStyle={{
          backgroundColor: "#216869",
        }}
      />
      <ScrollView style={{ width: "100%", paddingHorizontal: 20 }}>
        {kidsItem}
        <View style={configStyle.container}>
          <TouchableOpacity
            style={{
              borderRadius: 15,
              shadowOffset: { width: 5, height: 5 },
              shadowOpacity: 1,
              shadowRadius: 8,
              elevation: 8,
              backgroundColor: "#FFC9B9",
              marginTop: 30,
            }}
          >
            <Text
              onPress={() => {
                setIsVisible(true);
              }}
              style={{
                margin: 10,
                color: "grey",
                justifyContent: "center",
              }}
            >
              Ajouter un nouveau profil enfant
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              borderRadius: 15,
              shadowOffset: { width: 5, height: 5 },
              shadowOpacity: 1,
              shadowRadius: 8,
              elevation: 8,
              backgroundColor: "#216869",
              marginTop: 50,
              marginBottom: 100,
            }}
          >
            <Text
              onPress={() => {
                AsyncStorage.clear();
                props.clearFirstKid();
                props.navigation.navigate("Accueil");
              }}
              style={{ margin: 10, color: "white", justifyContent: "center" }}
            >
              Déconnexion
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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

          <Text>Classe de l'enfant </Text>
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
            placeholder="sélectionnez"
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

          <Button
            title="Ajoutez le profil enfant"
            buttonStyle={{ backgroundColor: "#FFC9B9" }}
            onPress={() => handleAddKid()}
            type="solid"
          />
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
