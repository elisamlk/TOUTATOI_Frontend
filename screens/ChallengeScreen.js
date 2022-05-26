import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { connect } from "react-redux";
import { Header, Card, Button } from "react-native-elements";
import configUrl from "../config/url.json";
import { FontAwesome } from "@expo/vector-icons";
import { ButtonGroup } from "@rneui/themed";

function ChallengeScreen(props) {
  const [challenge, setChallenge] = useState({});
  const [questionList, setQuestionList] = useState([]);
  const [idQuestionToShow, setIdQuestionToShow] = useState(0);
  const [answerVisible, setAnswerVisible] = useState(false);
  const [challengeResponse, setChallengeResponse] = useState(false);
  const [pushResultsResponse, setPushResultsResponse] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);

  useEffect(() => {
    async function getChallenge() {
      var rawResponse = await fetch(
        `${configUrl.url}/getChallengeOfTheDay?kidIdFromFront=${props.activeKid.kidId}`
      );
      var response = await rawResponse.json();
      console.log("responsedufetch ", response);

      setChallenge(response.challenge);
      setQuestionList(response.questions);
      setChallengeResponse(true);
    }
    getChallenge();
  }, []);

  console.log("challenge ", challenge);
  console.log("challengeResponse", challengeResponse);

  let header = (
    <Header
      placement="center"
      centerComponent={{
        text: "Défi de " + props.activeKid.kidFirstName + " !",
        style: styles.défi,
      }}
      containerStyle={{
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "transparent",
        marginBottom: 10,
      }}
    />
  );

  if (!challengeResponse) {
    return (
      <View style={styles.container}>
        {header}
        <Text style={styles.container}>Chargement...</Text>
      </View>
    );
  }

  if (pushResultsResponse) {
    props.navigation.navigate("Dashboard");
  }
  console.log("questiontoshow ", questionList[0]);
  let answer;
  if (questionList[idQuestionToShow].answerLabel) {
    if (!answerVisible) {
      answer = (
        <Button
          containerStyle={{
            width: 150,
          }}
          buttonStyle={{
            backgroundColor: "#FFDBD0",
          }}
          titleStyle={{
            fontFamily: "Lato_400Regular",
            color: "black",
            fontSize: 12,
          }}
          title="Voir la réponse"
          onPress={() => {
            setAnswerVisible(!answerVisible);
          }}
        />
      );
    } else {
      answer = (
        <Text
          style={{ color: "#216869" }}
          onPress={() => {
            setAnswerVisible(!answerVisible);
          }}
        >
          {questionList[idQuestionToShow].answerLabel}
        </Text>
      );
    }
  }

  function clickAnswer(value) {
    setSelectedIndex(value);
    if (questionList[idQuestionToShow]._id) {
      handleAnswer(questionList[idQuestionToShow]._id, value);
    } else {
      handleAnswer(`_${questionList[idQuestionToShow].wordId}`, value);
    }
  }

  function handleAnswer(questionId, result) {
    props.addAnswer({ questionId: questionId, result: result });
    if (idQuestionToShow < questionList.length - 1) {
      setIdQuestionToShow(idQuestionToShow + 1);
      setSelectedIndex(null);
      setAnswerVisible(false);
    }
  }

  let validateButton;
  if (idQuestionToShow == questionList.length - 1) {
    validateButton = (
      <Button
        buttonStyle={{
          width: 150,
          backgroundColor: "#FFDBD0",
          // marginTop: 10,
          alignSelf: "center",
        }}
        titleStyle={{
          fontFamily: "Lato_400Regular",
          fontSize: 12,
          color: "black",
        }}
        title="TERMINER"
        onPress={() => {
          props.postChallenge();
          async function pushResults() {
            console.log("liste results ", props.answerList);
            var rawResponse = await fetch(`${configUrl.url}/resultsOfTheDay`, {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
              body: `challengeIdFromFront=${challenge._id}&kidIdFromFront=${
                props.activeKid.kidId
              }&resultListFromFront=${JSON.stringify(props.answerList)}`,
            });
            var response = await rawResponse.json();
            console.log("retour push answer ", response);
            setPushResultsResponse(true);
          }
          pushResults();
        }}
      />
    );
  }

  return (
    <View
      style={{
        flex: 1,
        padding: 25,
        flexDirection: "column",
        justifyContent: "space-evenly",
      }}
    >
      <Text style={styles.titleDash}>
        Défi de {props.activeKid.kidFirstName}
      </Text>
      <View style={styles.upperView}>
        <Text style={styles.funfact}>{challenge.funFact}</Text>
      </View>
      <Card
        containerStyle={{
          borderRadius: 25,
          borderWidth: 0,
          padding: 0,
          flexDirection: "column",
        }}
        wrapperStyle={{ padding: 0, margin: 0, justifyContent: "flex-end" }}
      >
        <View style={styles.questionNuméro}>
          <Button
            buttonStyle={{
              backgroundColor: "#216869",
              marginRight: 5,
              marginLeft: 10,
            }}
            icon={
              <FontAwesome name="question-circle" size={30} color="white" />
            }
          />
          <Text style={{ fontFamily: "Lato_700Bold", color: "white" }}>
            {"QUESTION " + (idQuestionToShow + 1)}
          </Text>
        </View>
        {/* <Card.Divider /> */}
        <View
          style={{
            height: 150,
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <Text
            style={{
              fontFamily: "Lato_400Regular",
              textAlign: "center",
            }}
          >
            {questionList[idQuestionToShow].questionLabel}
          </Text>
          {answer}
        </View>
        <ButtonGroup
          buttons={["Mauvaise réponse", "Bonne réponse"]}
          selectedIndex={selectedIndex}
          textStyle={{ color: "black", fontSize: 12 }}
          selectedButtonStyle={{ backgroundColor: "#216869" }}
          containerStyle={{
            borderBottomLeftRadius: 25,
            borderBottomRightRadius: 25,
            backgroundColor: "#FFDBD0",
            width: "100%",
            alignSelf: "center",
            alignItems: "flex-end",
            marginBottom: 0,
            padding: 0,
            borderWidth: 0,
          }}
          buttonContainerStyle={{
            padding: 0,
            margin: 0,
            justifyContent: "flex-end",
          }}
          buttonStyle={{ padding: 0, margin: 0, color: "white" }}
          onPress={(value) => {
            clickAnswer(value);
          }}
        />
      </Card>
      {validateButton}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    textAlign: "center",
    alignItems: "center",
    padding: 25,
  },
  défi: {
    color: "black",
    fontFamily: "Lato_400Regular",
    fontSize: 25,
  },
  funfact: {
    fontFamily: "Lato_400Regular",
    color: "black",
    marginHorizontal: 20,
    marginVertical: 20,
  },
  upperView: {
    backgroundColor: "#A6CFAB",
    borderRadius: 25,
    marginBottom: 10,
    shadowOffset: { width: 5, height: 5 },
    shadowRadius: 8,
    elevation: 8,
    shadowOpacity: 1,
  },
  // questionCarte: {
  //   // shadowOffset: { width: 5, height: 5 },
  //   shadowRadius: 8,
  //   elevation: 8,
  // },
  questionNuméro: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#216869",
    width: "100%",
    alignItems: "center",
    height: 50,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  downButtonsView: {
    flexDirection: "row",
    marginTop: "20%",
    marginHorizontal: "25%",
  },
  titleDash: {
    textAlign: "center",
    marginTop: 10,
    marginBottom: 8,
    fontFamily: "Lato_400Regular",
    fontSize: 25,
  },
});

function mapStateToProps(state) {
  return {
    answerList: state.answerList,
    activeKid: state.activeKid,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    addAnswer: function (answer) {
      dispatch({ type: "addanswer", answer });
    },
    postChallenge: function () {
      dispatch({ type: "postChallenge" });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ChallengeScreen);
