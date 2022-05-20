import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Header, Card, Button, Overlay, Input } from "react-native-elements";
import { Text } from "@rneui/themed";
import { FontAwesome5 } from "@expo/vector-icons";
import { connect } from "react-redux";
import { createPortal } from "react-dom";

function HomeScreen(props) {
  //OVERLAY ADDKID-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
  const [isVisible, setIsVisible] = useState(false);
  const [kidName, setKidName] = useState("");
  const [kidGrade, setKidGrade] = useState("");

  var handleAddKid = async () => {
    let data = await fetch(
      "http://192.168.10.142:3000/kids/addKid", //attention a bien remettre heroku
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `userIdFromFront=${props.user}&firstNameFromFront=${kidName}&gradeFromFront=${kidGrade}`,
      }
    );
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

  //RECUPERER LES ENFANTS DE L'USERID -_-_-_LES ENVOYER AU REDUCER
  useEffect(() => {
    const getKid = async () => {
      let data = await fetch(
        `http://192.168.10.142:3000/kids/getKidsByUserId?userIdFromFront=${props.user}` //attention a bien remettre heroku
      );
      let response = await data.json();
      var kidListFromDB = response.adminKidList.map((e, i) => {
        return {
          kidId: e._id,
          kidFirstName: e.firstName,
          isActive: false,
        };
      });
      props.submitKidList(kidListFromDB);
    };
    getKid();
  }, []);

  //RECUPERER LES ENFANTS DE L'USERID -_-_-_LES RECUPERER DU REDUCER
  const [kidList, setKidList] = useState([]);
  useEffect(() => {
    setKidList(props.kidListFromReducer);
  }, [props.kidListFromReducer]);

  //LES SUPPRIMER _-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_ ROUTE QUASIMENT PRETE SAUF QU'ELLE NE SEMBLE PAS SUPPRIMER LE BON ENFANT...
  /*   var deleteKid = async (kid) => {
    await fetch(
      `https://sheltered-tor-38149.herokuapp.com/kids/deleteKid/${kid.kidId}`, 
      {
        method: "DELETE",
      }
    );
  }; */

  //LES AJOUTER/SELECTIONNER -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
  const [isSelected, setIsSelected] = useState(0);

  const kidsItem = kidList.map((kidItem, i) => {
    let isActiveToggle = () => {
      setIsSelected(i);
      if (isSelected == i) {
        kidItem.isActive = true;
      } else if (isSelected != i) {
        kidItem.isActive = false;
      }
      props.updateAKid(kidItem);
    };
    return (
      <TouchableOpacity
        key={i}
        style={styles.card}
        onPress={() => {
          isActiveToggle();
          /* setIsSelected(i); */
        }}>
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
          }}>
          {kidItem.kidFirstName + " " + kidItem.isActive}
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
    <View style={styles.container}>
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
      <Overlay
        overlayStyle={{ width: 280, borderRadius: 15 }}
        isVisible={isVisible}
        onBackdropPress={() => {
          setIsVisible(false);
        }}>
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
          <Button
            title="Ajoutez l'enfant"
            buttonStyle={{ backgroundColor: "#FFC9B9" }}
            onPress={() => handleAddKid()}
            type="solid"
          />
        </View>
      </Overlay>
      <ScrollView style={{ width: "100%", paddingHorizontal: 20 }}>
        {kidsItem}
        <View style={styles.container}>
          <TouchableOpacity
            style={{
              borderRadius: 15,
              shadowOffset: { width: 5, height: 5 },
              shadowOpacity: 1,
              shadowRadius: 8,
              elevation: 8,
              backgroundColor: "#FFC9B9",
              marginTop: 60,
              marginBottom: 100,
            }}>
            <Text
              onPress={() => {
                setIsVisible(true);
              }}
              style={{ margin: 10, color: "grey", justifyContent: "center" }}>
              Ajouter un nouvel enfant
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
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
    updateAKid: function (kid) {
      dispatch({ type: "updateKid", kid });
    },
  };
}

function mapStateToProps(state) {
  return { user: state.user, kidListFromReducer: state.kidList };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
