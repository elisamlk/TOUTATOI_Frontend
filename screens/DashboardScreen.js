import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  StyleSheet,
  View,
  Dimensions,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Switch,
} from "react-native";
//import { BarChart } from "react-native-chart-kit";
import { Text, Card } from "@rneui/themed";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { Overlay, Badge, Input, Button } from "react-native-elements";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "react-native-vector-icons/AntDesign";
import { FontAwesome5 } from "@expo/vector-icons";

import configUrl from "../config/url.json";
import configStyle from "../config/style";

// import { AntDesign } from '@expo/vector-icons';
import { BarChart, XAxis } from "react-native-svg-charts";
import * as scale from "d3-scale";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

// Onglet personnalisation des notions
const data = [
  { label: "CP", value: "1" },
  { label: "CE1", value: "2" },
  { label: "CE2", value: "3" },
  { label: "CM1", value: "4" },
  { label: "CM2", value: "5" },
];

// ONGLET PERSONNALISATION DES NOTIONS & DE LA LISTE DE MOTS

const Personnalisation = (props) => {
  const [isVisible, setIsVisible] = useState(false);
  const [allNotionsList, setAllNotionsList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [allNotionsResponse, setAllNotionsResponse] = useState(false);
  const [openSubCategory, setOpenSubCategory] = useState("");
  const [openNotionList, setOpenNotionList] = useState([]);
  const [bddToUpdate, setBddToUpdate] = useState(false);
  const [value, setValue] = useState(props.activeKid.grade);
  const [newWord, setNewWord] = useState("");

  // Récupérer toutes les notions en BDD
  useEffect(() => {
    async function getAllNotions() {
      var rawResponse = await fetch(`${configUrl.url}/getAllNotionsFromBdd`);
      var response = await rawResponse.json();

      let array = [];
      for (let element of response.allNotions) {
        let item = array.find((e) => e.category === element.category);

        if (!item) {
          array.push({
            category: element.category,
            subCategoryList: [element.subCategory],
          });
        } else if (
          !item.subCategoryList.some((a) => a === element.subCategory)
        ) {
          item.subCategoryList.push(element.subCategory);
        }
      }

      setCategoryList(array);
      setAllNotionsList(response.allNotions);
      setAllNotionsResponse(true);
    }
    getAllNotions();
  }, []);

  // Condition pour afficher "chargement" tant qu'on n'a pas récupéré les informations depuis la BDD
  if (!allNotionsResponse) {
    return (
      <View>
        <Text>Chargement...</Text>
      </View>
    );
  }

  // AFFICHAGE DES NOTIONS PERSONNALISEES

  const OpenSubcategory = (item) => {
    setIsVisible(true);
    setOpenSubCategory(item);
    setOpenNotionList(allNotionsList.filter((e) => e.subCategory == item));
  };

  const toggleSwitch = (notionid) => {
    if (!bddToUpdate) {
      setBddToUpdate(true);
    }
    if (props.activeKid.activatedNotions.some((e) => notionid == e.notionId)) {
      console.log("je désactive !!");
      props.deactivateNotion(notionid);
    } else props.activateNotion({ notionId: notionid });
  };

  const handleBackdropPress = () => {
    setIsVisible(false);
    if (bddToUpdate == true) {
      async function updateKid() {
        var rawResponse = await fetch(
          `${configUrl.url}/kids/KidActivatedNotions/${props.activeKid.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `newActivatedNotionsFromFront=${JSON.stringify(
              props.activeKid.activatedNotions
            )}`,
          }
        );
        var response = await rawResponse.json();
        console.log("retour push kidActivatedNotions ", response);
        setBddToUpdate(false);
      }
      updateKid();
    }
  };

  var notionsToDisplay = openNotionList.map((notion, f) => {
    return (
      <View key={f} style={configStyle.notionName}>
        <Text style={configStyle.notionText}>{notion.notionName}</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#9CC5A1" }}
          thumbColor={props.activeKid.activatedNotions.some((e) =>
            notion._id == e.notionId ? "#FFC9B9" : "#f4f3f4"
          )}
          ios_backgroundColor="#3e3e3e"
          onChange={() => toggleSwitch(notion._id)}
          value={props.activeKid.activatedNotions.some(
            (e) => notion._id == e.notionId
          )}
        />
      </View>
    );
  });

  var categoryCardList = categoryList.map((data, i) => {
    var subCategory = data.subCategoryList.map((item, j) => {
      return (
        <TouchableOpacity
          key={j}
          onPress={() => {
            OpenSubcategory(item);
          }}
        >
          <Text style={configStyle.notionButton}>{item}</Text>
        </TouchableOpacity>
      );
    });
    return (
      <View key={i} style={configStyle.dashboardScreenCard}>
        <Card.Title style={configStyle.title}>{data.category}</Card.Title>
        <View style={configStyle.buttonDisplay}>{subCategory}</View>
        <Overlay
          style={styles.overlay}
          isVisible={isVisible}
          onBackdropPress={() => {
            handleBackdropPress();
          }}
        >
          <View>
            <Text style={configStyle.title}>{openSubCategory}</Text>
          </View>
          <View style={configStyle.notionNameDisplay}>{notionsToDisplay}</View>
        </Overlay>
      </View>
    );
  });

  // AFFICHAGE DE LA LISTE DE MOTS (mise à jour dans la BDD et dans le reducer dédié)

  const clickAdd = (word) => {
    if (!props.activeKid.customWords.some((e) => e.label == word)) {
      props.addNewWord(word);
      async function updateKid() {
        var response = await fetch(
          `${configUrl.url}/kids/addKidCustomWord/${props.activeKid.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `newCustomWordFromFront=${word}`,
          }
        );
        let result = await response.json();
      }
      updateKid();
      setNewWord("");
    }
  };

  const clicktrash = (word) => {
    props.deleteWord(word);
    async function updateKid() {
      var response = await fetch(
        `${configUrl.url}/kids/deleteKidCustomWord/${props.activeKid.id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: `customWordToDeleteFromFront=${word}`,
        }
      );
      let result = await response.json();
    }
    updateKid();
  };

  var wordsList = props.activeKid.customWords.map((word, k) => {
    return (
      <View
        style={[
          configStyle.words,
          {
            backgroundColor: "white",
            borderColor: "#FABE6D",
            borderWidth: 0.3,
            alignItems: "center",
            justifyContent: "center",
            margin: windowWidth - windowWidth / 1.02,
            paddingLeft: 10,
            paddingRight: 10,
            marginBottom: 15,
          },
        ]}
        key={k}
      >
        <Text style={{ color: "black" }}>{word.label}</Text>
        <Button
          buttonStyle={{
            height: 30,
            width: 30,
            backgroundColor: "transparent",
          }}
          icon={<FontAwesome5 name="trash" size={15} color="#FABE6D" />}
          // disabled={isSelected !== i ? true : false}
          // disabledStyle={{ backgroundColor: "grey" }}
          onPress={() => clicktrash(word.label)}
        />
      </View>
    );
  });

  const renderItem = (item) => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.label}</Text>
        {item.value === value && (
          <AntDesign
            style={styles.icon}
            color="black"
            name="Safety"
            size={20}
          />
        )}
      </View>
    );
  };

  const handleGradeChange = (item) => {
    setValue(item.value);
    async function updateKid() {
      var rawResponse = await fetch(
        `${configUrl.url}/kids/kidGrade/${props.activeKid.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `newKidGradeFromFront=${item.label}`,
        }
      );
      var response = await rawResponse.json();
      console.log("retour push kidGrade ", response);
    }
    updateKid();
  };

  return (
    <View style={[styles.scene, {}]}>
      <ScrollView>
        <View style={styles.container}>
          <Text style={configStyle.titleH1}>
            Cockpit de {props.activeKid.firstName}
          </Text>
          <Text style={configStyle.fonts} h4>
            Aidez nous à personnaliser le programme de votre enfant !
          </Text>
          <View style={styles.dropdowncontainer}>
            <Text style={configStyle.textH6}>Classe de l'enfant </Text>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={data}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={value}
              searchPlaceholder="Search..."
              value={value}
              onChange={(item) => {
                handleGradeChange(item);
              }}
              renderLeftIcon={() => (
                <AntDesign
                  style={styles.icon}
                  color="black"
                  name="Safety"
                  size={20}
                />
              )}
              renderItem={renderItem}
            />
          </View>
          <View style={configStyle.dashboardScreenCard}>
            <Card.Title style={configStyle.title}>Liste de mots</Card.Title>

            <Input
              style={configStyle.inputList}
              // inputContainerStyle={{ borderBottomWidth: 0 }}
              placeholder="Ajoutez un mot à votre liste"
              autoCapitalize="none"
              rightIcon={
                <AntDesign
                  name="pluscircle"
                  size={24}
                  color="#FABE6D"
                  onPress={() => clickAdd(newWord)}
                />
              }
              onChangeText={(val) => setNewWord(val)}
              value={newWord}
            />

            <View style={configStyle.wordsListItem}>{wordsList}</View>
          </View>

          {categoryCardList}
        </View>
      </ScrollView>
    </View>
  );
};

// ONGLET STATISTIQUES

const Stats = (props) => {
  const screenWidth = Dimensions.get("window").width;
  // const [activeKid, setActiveKid] = useState(
  //   props.kidList.find((e) => e.isActive == true)
  // );
  // const [kidXp, setKidXp] = useState(props.activeKid.xp);
  const [kidStatsResponse, setKidStatsResponse] = useState(false);
  const [graphValues, setGraphValues] = useState([]);
  const [graphLabels, setGraphLabels] = useState([]);

  useEffect(() => {
    (() => {
      for (let element of props.activeKid.xp) {
        setGraphValues([...graphValues, element.xpNb]);
        setGraphLabels([...graphLabels, element.date]);
      }
    })();
  }, [props.activeKid.xp]);

  // const data = {
  //   //labels: graphLabels,
  //   datasets: [
  //     {
  //       data: graphValues,
  //       color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
  //       strokeWidth: 2, // optional
  //     },
  //   ],
  //   legend: ["Rainy Days"], // optional
  // };

  const fake = [2, 5, 10, 25, 30, 45, 50, 51, 60, 70];

  return (
    <View style={[styles.scene, {}]}>
      <ScrollView style={styles.container}>
        <Text style={configStyle.titleH1}>
          Cockpit de {props.activeKid.firstName}
        </Text>
        <Text style={configStyle.fonts} h4>
          Suivez les progrès de votre enfant
        </Text>

        <View style={styles.barChart}>
          <BarChart
            style={{ flex: 1, height: 190 }}
            data={fake}
            gridMin={0}
            svg={{ fill: "#FFDBD0" }}
          />
        </View>
        <View style={{ height: "50%" }}>
          <Text style={styles.fonts} h4>
            Nombre de jours consécutifs:
          </Text>
          <Badge
            badgeStyle={{
              marginTop: 15,
              width: 40,
              height: 40,
              borderRadius: 100,
              alignItems: "center",
            }}
            textStyle={{ fontSize: 30 }}
            status="warning"
            value={props.activeKid.consecutiveDaysNb}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const initialLayout = { width: Dimensions.get("window").width };

// Connection de personnalisation et stats au store
export const ConnectedPersonnalisation = connect(
  mapStateToProps,
  mapDispatchToProps
)(Personnalisation);

export const ConnectedStats = connect(
  mapStateToProps,
  mapDispatchToProps
)(Stats);

const renderScene = SceneMap({
  first: ConnectedPersonnalisation,
  second: ConnectedStats,
});

function DashboardScreen(props) {
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
      style={{
        backgroundColor: "#216869",
        paddingTop: windowHeight - windowHeight / 1.04,
      }}
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
    width: windowWidth,
  },
  scene: {
    flex: 1,
  },

  notionText: {
    fontSize: 15,
  },
  notionButtonDisplay: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  notionButton: {
    backgroundColor: "#49A078",
    color: "white",
    padding: 8,
    marginLeft: 10,
    marginTop: 30,
  },
  chartConfig: {
    backgroundColor: "#216869",
    backgroundGradientFrom: "#216869",
    backgroundGradientTo: "#216869",
    decimalPlaces: 2, // optional, defaults to 2dp
    color: () => `#9CC5A1`,
    labelColor: () => "#9CC5A1",

    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#ffa726",
    },
  },
  barChart: {
    padding: 10,
  },
  overlay: {
    width: 200,
    height: 500,
  },
  dropdowncontainer: {
    paddingLeft: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  dropdown: {
    height: 50,
    width: 150,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 17,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textItem: {
    flex: 1,
    fontSize: 16,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    display: "none",
  },
});

function mapDispatchToProps(dispatch) {
  return {
    activateNotion: function (notion) {
      dispatch({ type: "activateNotion", notion });
    },
    deactivateNotion: function (notion) {
      dispatch({ type: "deactivateNotion", notion });
    },
    initiateNotionList: function (list) {
      dispatch({ type: "submitActivatedNotionList", list });
    },
    initiateCustomWordsList: function (list) {
      dispatch({ type: "initiateCustomWordsList", list });
    },
    addNewWord: function (newWord) {
      dispatch({ type: "addNewWord", newWord });
    },
    deleteWord: function (wordToDelete) {
      dispatch({ type: "deleteWord", wordToDelete });
    },
  };
}

function mapStateToProps(state) {
  return {
    activeKid: state.activeKid,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardScreen);
