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
  // A QUOI SERT ERROR ? C'était avant quand input pour le grade (et non une liste déroulante ?)
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
    <View style={configStyle.signInScreenContainer}>
      <Text style={configStyle.titleH1}>Créez l'espace dédié à l'enfant</Text>
      <Text style={configStyle.fonts} h4>
        Vous pourrez rajouter des profils plus tard
      </Text>
      <View style={configStyle.kidProfilScreenContainerForm}>
        <Input
          style={configStyle.input}
          placeholder="Prénom"
          onChangeText={(val) => setName(val)}
          inputContainerStyle={{ borderBottomWidth: 0 }}
        />
        <Text style={{ marginBottom: 10 }}>Classe de l'enfant</Text>
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
        <Text style={configStyle.error}>{error}</Text>
      </View>

      <Text style={configStyle.kidProfilScreenText}>
        En continuant, j'accepte les conditions générales d'utilisation.
      </Text>
      <View>
        <TouchableOpacity
          style={configStyle.button1}
          onPress={() => {
            submitChild();
          }}
        >
          <Text style={configStyle.signUpScreenFonts} flex-start>
            Continuer
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function mapDispatchToProps(dispatch) {
  return {
    addFirstKid: function (name, grade) {
      dispatch({ type: "addFirstKid", name: name, grade: grade });
    },
  };
}

export default connect(null, mapDispatchToProps)(KidProfilScreen);
