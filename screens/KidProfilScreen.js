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
  const [error, setError] = useState("");

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

  function submitChild() {
    if (name.length > 0 && grade.length > 0) {
      props.addFirstKid(name, grade);
      props.navigation.navigate("SignUp");
    } else if (name.length == 0 && grade.length == 0) {
      setError("Merci de renseigner un nom et une classe");
    } else if (name.length == 0) {
      setError("Merci de renseigner un nom");
    } else if (grade.length == 0) {
      setError("Merci de renseigner une classe");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={configStyle.titleH1}>Créez l'espace dédié à l'enfant</Text>
      <Text style={configStyle.fonts} h4>
        Vous pourrez rajouter des profils plus tard
      </Text>
      <View style={styles.containerForm}>
        <Input
          style={styles.input}
          placeholder="Prénom"
          onChangeText={(val) => setName(val)}
          inputContainerStyle={{ borderBottomWidth: 0 }}
        />
        <Text style={{marginBottom:10}}>Classe de l'enfant</Text>
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
        <Text style={styles.error}>{error}</Text>
      </View>

      <Text style={styles.text}>
        En continuant, j'accepte les conditions générales d'utilisation.
      </Text>
      <View>
        <TouchableOpacity
          style={styles.button1}
          onPress={() => {
            submitChild();
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
    backgroundColor: "white",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingBottom: 30,
  },
  h1: {
    fontFamily: "Lato_400Regular",
    fontSize: 20,
  },
  h2: {
    fontFamily: "Lato_400Regular",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
  },
  containerForm: {
    backgroundColor: "#9CC5A1",
    alignItems: "center",
    justifyContent: "center",
    width: 290,
    height: 250,
    borderRadius: 20,
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
  fonts: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  text: {
    textAlign: "center",
    fontFamily: "Lato_400Regular",
    marginBottom: 20,
    padding: 20,
    fontSize: 15,
  },
  input: {
    width: 300,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 10,
  },
  error: {
    color: "red",
    textAlign: "center",
    fontFamily: "Lato_400Regular",
    fontSize: 15,
    marginTop: 10,
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
