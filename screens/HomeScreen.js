import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Header, Card, Button, Overlay, Input } from "react-native-elements";
import { FontAwesome5 } from "@expo/vector-icons";

export default function HomeScreen(props) {
  //OVERLAY ADDKID-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
  const [isVisible, setIsVisible] = useState(false);
  const [kidName, setKidName] = useState("");
  const [kidGrade, setKidGrade] = useState("");

  var handleAddKid = async () => {
    await fetch("http://172.20.10.6:3000/kids/addKid", {
      //=> BIEN MODIFIER L'ADRESSE IP
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `userIdFromFront=${props.userId}&firstNameFromFront=${kidName}&gradeFromFront=${kidGrade}`, // A MODIFIER AVEC L'INFO USERID VIA REDUX. INFOS ADDITIONNELLES??
    });
    //push le nouveau Kid dans le reducer
    setIsVisible(false);
    setKidGrade();
    setKidName();
  };

  //RECUPERER LES ENFANTS DE L'USERID -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
  const [kidList, setKidList] = useState([]); //remplacer cela par un envoi dans le reducer
  /*   useEffect(() => {
    const getKid = async () => {
      const data = await fetch(
        `http://172.20.10.6:3000/getKidsByUserId/${userId}` =>ATTENTION A BIEN MODIFIER L'ADRESSE HTTP(+USERID REDUX?)
      );
      const body = await data.json();
      console.log(body.adminKidList);
      setKidList(body.adminKidList);
    };
    getKid();
  }, []); */

  //LES SUPPRIMER
  var deleteKid = async (kidIdFromFront) => {
    await fetch(`/deleteKid/${kidIdFromFront}`, {
      method: "DELETE",
    });
  };

  //LES AJOUTER -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
  const kids = ["JOSEPHINE", "BAPTISTE"]; //variable à remplacer par information venue du backend (hook kidList)
  const kidsItem = kids.map((kidName, i) => {
    let isKidDisabled;
    if (i > 0) {
      isKidDisabled = true;
    } else if (i === 0) {
      isKidDisabled = false;
    }
    return (
      <Card key={i}>
        <View style={styles.card}>
          <Button
            buttonStyle={{
              height: 50,
              width: 50,
              borderRadius: 50,
              backgroundColor: "#FABE6D",
            }}
            icon={
              <FontAwesome5 name="user-astronaut" size={24} color="white" />
            }
            disabled={isKidDisabled} //onpress : toggleDisabled (3 infos dans ma kidlist redux : id, name, disabled)
            disabledStyle={{ backgroundColor: "grey" }}
          />
          <Card.Title
            style={{
              alignItems: "center",
              justifyContent: "center",
              paddingTop: 15,
              paddingHorizontal: 10,
            }}>
            {kidName} {/* kidName.firstName (???? à verif)*/}
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
            disabled={isKidDisabled}
            disabledStyle={{ backgroundColor: "grey" }}
            onPress={() => deleteKid(kidName.Id)} //kidNameId???? à vérif
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
            disabled={isKidDisabled}
            disabledStyle={{ backgroundColor: "grey" }}
            // onPress={() =>} pas de route
          />
        </View>
      </Card>
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
        overlayStyle={{ width: 300 }}
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
            buttonStyle={{ backgroundColor: "#eb4d4b" }}
            onPress={() => handleAddKid()}
            type="solid"
          />
        </View>
      </Overlay>
      <View style={styles.container}>{kidsItem}</View>
      <View>
        <Button
          containerStyle={{ marginTop: 60 }}
          title="Ajouter un nouvel enfant"
          buttonStyle={{
            borderRadius: 25,
            backgroundColor: "#FFC9B9",
          }}
          containerViewStyle={{ width: "100%", marginLeft: 0 }}
          onPress={() => {
            setIsVisible(true);
          }}
        />
      </View>
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
    width: 225,
  },
});
