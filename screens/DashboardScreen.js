import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Switch,
} from "react-native";
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from "react-native-chart-kit";
import { Text, Card } from "@rneui/themed";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { Overlay, Badge } from "react-native-elements";
import { connect } from "react-redux";
import monjson from "../jsonModels/url.json";

// Onglet personnalisation des notions

const Personnalisation = (props) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  const [allNotionsList, setAllNotionsList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [kidActivatedNotions, setKidActivatedNotions] = useState([]);
  const [allNotionsResponse, setAllNotionsResponse] = useState(false);
  const [kidNotionsResponse, setKidNotionsResponse] = useState(false);
  const [activeKid, setActiveKid] = useState(
    props.kidList.find((e) => e.isActive == true)
  );
  //console.log("récupération depuis le store", props.kidList[0].kidId);

  // Récupérer toutes les notions en BDD
  useEffect(() => {
    async function getAllNotions() {
      var rawResponse = await fetch(`${monjson.url}/kids/getAllNotionsFromBdd`);
      var response = await rawResponse.json();

      console.log("9", response.allNotions);
      let array = [];
      for (let element of response.allNotions) {
        let item = array.find((e) => e.category === element.category);
        console.log("item=>", item);
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

      console.log("array =>", array);
      setCategoryList(array);
      setAllNotionsList(response.allNotions);
      setAllNotionsResponse(true);
    }
    getAllNotions();
  }, []);
  //console.log("2", allNotionsList);

  // Récupérer les notions actives du kid actif à partir de l'Id du reducer
  useEffect(() => {
    async function getKidActivatedNotions() {
      var rawResponse = await fetch(
        `${monjson.url}/kids/getKidActivatedNotions?kidIdFromFront=${activeKid.kidId}`
      );
      var response = await rawResponse.json();
      //console.log("kidActivatedNotions", response);
      setKidActivatedNotions(response);
      setKidNotionsResponse(true);
    }

    getKidActivatedNotions();
  }, []);

  if (!allNotionsResponse || !kidNotionsResponse) {
    return (
      <View>
        <Text>Chargememnt...</Text>
      </View>
    );
  }

  var categoryCardList = categoryList.map((data, i) => {
    var subCategory = data.subCategoryList.map((item, j) => {
      return (
        <TouchableOpacity key={j} onPress={() => setIsVisible(true)}>
          <Text style={styles.button}>{item}</Text>
        </TouchableOpacity>
      );
    });
    return (
      <View key={i} style={styles.card}>
        <Card.Title style={styles.title}>{data.category}</Card.Title>
        <View style={styles.buttonDisplay}>
          {subCategory}
          {/* <Overlay
            style={styles.overlay}
            isVisible={isVisible}
            onBackdropPress={() => {
              setIsVisible(false);
            }}
          >
            <View style={styles.notionNameDisplay}>
              <View style={styles.notionName}>
                <Text style={styles.notionText}>Pluriel en X</Text>
                <Switch
                  trackColor={{ false: "#767577", true: "#9CC5A1" }}
                  thumbColor={isEnabled ? "#FFC9B9" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleSwitch}
                  value={isEnabled}
                />
              </View>
              <View style={styles.notionName}>
                <Text style={styles.notionText}>a/à</Text>
                <Switch
                  trackColor={{ false: "#767577", true: "#9CC5A1" }}
                  thumbColor={isEnabled ? "#FFC9B9" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleSwitch}
                  value={isEnabled}
                />
              </View>
              <View style={styles.notionButtonDisplay}>
                <TouchableOpacity style={styles.notionButtonContainer}>
                  <Text style={styles.notionButton}>Valider</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.notionButtonContainer}>
                  <Text style={styles.notionButton}>Annuler</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Overlay> */}
        </View>
      </View>
    );
  });

  return (
    <View style={[styles.scene, { backgroundColor: "white" }]}>
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.fonts} h4>
            Cockpit de {activeKid.kidFirstName}
          </Text>
          <Text style={styles.fonts} h5>
            Aidez nous à personnaliser le programme de votre enfant !
          </Text>
          {categoryCardList}
        </View>
      </ScrollView>
    </View>
  );
};

// Onglet Statistiques

const Stats = (props) => {
  const screenWidth = Dimensions.get("window").width;
  const [activeKid, setActiveKid] = useState(
    props.kidList.find((e) => e.isActive == true)
  );
  const [kidXp, setKidXp] = useState([]);
  const [kidConsecutiveDaysNb, setKidConsecutiveDaysNb] = useState(Number);
  const [kidStatsResponse, setKidStatsResponse] = useState(false);

  useEffect(() => {
    async function getKidStats() {
      var rawResponse = await fetch(
        `${monjson.url}/kids/byID/628b4f275680bb4b9b682618`
      );
      var response = await rawResponse.json();
      console.log("kid =>", response.kid);
      console.log("kid.xp =>", response.kid.xp);
      console.log("kid.consecutiveDaysNb", response.kid.consecutiveDaysNb);
      setKidXp(response.kid.xp);
      setKidConsecutiveDaysNb(response.kid.consecutiveDaysNb);
      setKidStatsResponse(true);
    }
    getKidStats();
  }, []);

  let graphLabels = [];
  let graphValues = [];
  for (let element of kidXp) {
    graphLabels.push(element.date);
    graphValues.push(element.xpNb);
  }
  console.log("labels =>", graphLabels);
  console.log("values =>", graphValues);

  const data = {
    datasets: [
      {
        data: graphValues,
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
        strokeWidth: 2, // optional
      },
    ],
    legend: ["Rainy Days"], // optional
  };

  if (!kidStatsResponse) {
    return (
      <View>
        <Text>Chargement...</Text>
      </View>
    );
  } else
    return (
      <View style={[styles.scene, { backgroundColor: "white" }]}>
        <ScrollView>
          <View style={styles.container}>
            <Text style={styles.fonts} h4>
              Cockpit de {activeKid.kidFirstName}
            </Text>
            <Text style={styles.fonts} h5>
              Suivez les progrès de votre enfant
            </Text>
            <Text style={styles.fonts} h5>
              Niveau d'xp:
            </Text>
            <BarChart
              data={data}
              width={screenWidth}
              height={220}
              chartConfig={styles.chartConfig}
            />
            <Text style={styles.fonts} h5>
              Nombre de jours consécutifs:
            </Text>
            <Badge value={kidConsecutiveDaysNb} />
          </View>
        </ScrollView>
      </View>
    );
};

const initialLayout = { width: Dimensions.get("window").width };

// Connection de personnalisation et stats au store
export const ConnectedPersonnalisation =
  connect(mapStateToProps)(Personnalisation);

export const ConnectedStats = connect(mapStateToProps)(Stats);
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
  notionName: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  notionNameDisplay: {
    padding: 10,
    width: 270,
  },
  notionText: {
    fontSize: 20,
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
    backgroundColor: "#e26a00",
    backgroundGradientFrom: "#fb8c00",
    backgroundGradientTo: "#ffa726",
    decimalPlaces: 2, // optional, defaults to 2dp
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#ffa726",
    },
  },
});

function mapStateToProps(state) {
  return { kidList: state.kidList };
}

export default connect(mapStateToProps, null)(DashboardScreen);
