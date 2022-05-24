import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Input } from "react-native-elements";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "react-native-vector-icons/AntDesign";
import { connect } from "react-redux";
import configUrl from "../config/url.json";
import configStyle from "../config/style.js";

function KidProfilScreen(props) {
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");
  const [value, setValue] = useState(null); /* classe de l'enfant (CP, CE1) */

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
    <View style={styles.container}>
      <Text>Créons l'espace dédié à l'enfant</Text>
      <View style={styles.containerForm}>
        <Input
          containerStyle={{ marginBottom: 25, width: "70%" }}
          inputStyle={{ marginLeft: 10 }}
          placeholder="Prénom"
          onChangeText={(val) => setName(val)}
        />
        {/* <Input
          containerStyle={{ marginBottom: 25, width: "70%" }}
          inputStyle={{ marginLeft: 10 }}
          placeholder="Classe"
          onChangeText={(val) => setGrade(val)}
        /> */}
        <Text>Classe de l'enfant</Text>
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
          placeholder="du CP au CM2"
          searchPlaceholder="Search..."
          value={value}
          dropdownPosition="bottom"
          onChange={(item) => {
            setValue(item.value);
            setGrade(item.label);
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
      </View>

      <Text>
        En continuant, j'accepte les conditions générales d'utilisation
      </Text>
      <View>
        <TouchableOpacity
          style={styles.button1}
          onPress={() => {
            props.addFirstKid(name, grade), props.navigation.navigate("SignUp");
          }}
        >
          <Text style={styles.fonts} flex-start>
            Continuer
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
  },
  containerForm: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: 300,
  },
  button1: {
    color: "white",
    backgroundColor: "#49A078",
    width: 200,
    padding: 4,
    marginRight: 10,
    marginBottom: 10,
  },
  button2: {
    color: "white",
    backgroundColor: "#FFC9B9",
    width: 200,
    padding: 4,
    marginRight: 10,
    marginBottom: 10,
  },
  fonts: {
    color: "white",
    marginTop: 10,
    marginBottom: 8,
    textAlign: "center",
  },
});

function mapDispatchToProps(dispatch) {
  return {
    addFirstKid: function (name, grade) {
      dispatch({ type: "addFirstKid", name: name, grade: grade });
    },
  };
}

export default connect(null, mapDispatchToProps)(KidProfilScreen);
