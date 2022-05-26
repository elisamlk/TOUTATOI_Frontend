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
        backgroundColor: "#216869",
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
          buttonStyle={{
            backgroundColor: "#216869",
            borderRadius: 15,
          }}
          titleStyle={{
            fontFamily: "Lato_400Regular",
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
          onPress={() => {
            setAnswerVisible(!answerVisible);
          }}
        >
          {questionList[idQuestionToShow].answerLabel}
        </Text>
      );
    }
  }

  function handleAnswer(questionId, result) {
    props.addAnswer({ questionId: questionId, result: result });
    if (idQuestionToShow < questionList.length - 1) {
      setIdQuestionToShow(idQuestionToShow + 1);
      setAnswerVisible(false);
    }
  }

  let opacityCondition;
  if (idQuestionToShow == questionList.length - 1) {
    opacityCondition = 100;
  } else {
    opacityCondition = 0;
  }
  let validateButton = (
    <Button
      buttonStyle={{
        backgroundColor: "#FABE6D",
        borderRadius: 15,
        opacity: opacityCondition,
        marginBottom: 75,
      }}
      titleStyle={{
        fontFamily: "Lato_400Regular",
        fontSize: 12,
      }}
      title="Terminer"
      onPress={() => {
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

  return (
    <View>
      {header}
      <ScrollView style={{ width: "100%", paddingHorizontal: 20 }}>
        <View style={styles.upperView}>
          <Text style={styles.funfact}>{challenge.funFact}</Text>
        </View>
        <View style={styles.questionCarte}>
          <Card
            containerStyle={{
              borderRadius: 25,
              padding: 0,
            }}
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
            <Card.Divider />
            <Text style={styles.funfact}>
              {questionList[idQuestionToShow].questionLabel}
            </Text>
            <View style={styles.downButtonsView}>
              {validateButton}
              <View
                style={{
                  justifyContent: "center",
                  flexDirection: "row",
                }}
              >
                <Button
                  buttonStyle={{
                    backgroundColor: "#49A078",
                    borderRadius: 15,
                    width: "100%",
                    marginVertical: 10,
                    height: 40,
                  }}
                  titleStyle={{
                    fontFamily: "Lato_400Regular",
                    fontSize: 12,
                  }}
                  title="   Bonne réponse   "
                  onPress={() => {
                    if (questionList[idQuestionToShow]._id) {
                      handleAnswer(questionList[idQuestionToShow]._id, 1);
                    } else {
                      handleAnswer(
                        `_${questionList[idQuestionToShow].wordId}`,
                        1
                      );
                    }
                  }}
                />
                <Button
                  buttonStyle={{
                    backgroundColor: "#FFC9B9",
                    borderRadius: 15,
                    width: "100%",
                    marginVertical: 10,
                    height: 40,
                  }}
                  titleStyle={{
                    fontFamily: "Lato_400Regular",
                    fontSize: 12,
                  }}
                  title="Mauvaise réponse"
                  onPress={() => {
                    if (questionList[idQuestionToShow]._id) {
                      handleAnswer(questionList[idQuestionToShow]._id, 0);
                    } else {
                      handleAnswer(
                        `_${questionList[idQuestionToShow].wordId}`,
                        0
                      );
                    }
                  }}
                />
              </View>
              {answer}
            </View>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    textAlign: "center",
  },
  défi: {
    fontFamily: "Lato_400Regular",
    color: "white",
  },
  funfact: {
    fontFamily: "Lato_400Regular",

    marginHorizontal: 20,
    marginVertical: 10,
  },
  upperView: {
    backgroundColor: "#FABE6D",
    borderRadius: 25,
    marginBottom: 10,
    shadowOffset: { width: 5, height: 5 },
    shadowRadius: 8,
    elevation: 8,
    shadowOpacity: 1,
  },
  questionCarte: {
    shadowOffset: { width: 5, height: 5 },
    shadowRadius: 8,
    elevation: 8,
  },
  questionNuméro: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#216869",
    width: "100%",
    alignItems: "center",
    height: "15%",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  downButtonsView: {
    display: "flex",
    flexDirection: "column-reverse",
    marginTop: "20%",
    marginHorizontal: "25%",
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
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ChallengeScreen);
