import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { connect } from "react-redux";
import { Header, Card, Button, Overlay, Input } from "react-native-elements";
import monjson from "../jsonModels/url.json";

function ChallengeScreen(props) {
  const [challenge, setChallenge] = useState({});
  const [activeKid, setActiveKid] = useState(
    props.kidList.find((e) => e.isActive == true)
  );
  const [questionList, setQuestionList] = useState([]);
  const [idQuestionToShow, setIdQuestionToShow] = useState(0);
  const [answerVisible, setAnswerVisible] = useState(false);
  const [challengeResponse, setChallengeResponse] = useState(false);
  const [pushResultsResponse, setPushResultsResponse] = useState(false);

  useEffect(() => {
    setActiveKid(props.kidList.find((e) => e.isActive == true));
    async function getChallenge() {
      var rawResponse = await fetch(
        `${monjson.url}/getChallengeOfTheDay?kidIdFromFront=${activeKid.kidId}`
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
        text: "DEFI DE " + activeKid.kidFirstName,
        style: styles.text,
      }}
      containerStyle={{
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#216869",
      }}
    />
  );

  if (!challengeResponse) {
    return (
      <View style={styles.container}>
        {header}
        <Text style={styles.container}>Loading</Text>
      </View>
    );
  }

  if (pushResultsResponse) {
    props.navigation.navigate("Dashboard");
  }
  console.log("questiontoshow ", questionList[0]);
  let answer;
  if (!answerVisible) {
    answer = (
      <Button
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
        }}>
        {questionList[idQuestionToShow].answerLabel}
      </Text>
    );
  }

  function handleAnswer(questionId, result) {
    props.addAnswer({ questionId: questionId, result: result });
    if (idQuestionToShow < questionList.length - 1) {
      setIdQuestionToShow(idQuestionToShow + 1);
      setAnswerVisible(false);
    }
  }

  let validateButton;

  if (idQuestionToShow == questionList.length - 1) {
    validateButton = (
      <Button
        title="Terminer"
        onPress={() => {
          async function pushResults() {
            console.log("liste results ", props.answerList);
            var rawResponse = await fetch(`${monjson.url}/resultsOfTheDay`, {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
              body: `challengeIdFromFront=${challenge._id}&kidIdFromFront=${
                activeKid.kidId
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
    <View style={styles.container}>
      {header}
      <Text>{challenge.funFact}</Text>
      <View>
        <Text>{"Question " + (idQuestionToShow + 1)}</Text>
        <Text>{questionList[idQuestionToShow].questionLabel}</Text>
        {answer}
        <View
          style={{
            justifyContent: "center",
            flexDirection: "row",
            height: 200,
          }}>
          <Button
            title="Bonne réponse"
            onPress={() => {
              handleAnswer(questionList[idQuestionToShow]._id, 1);
            }}
          />
          <Button
            title="Mauvaise réponse"
            onPress={() => {
              handleAnswer(questionList[idQuestionToShow]._id, 0);
            }}
          />
        </View>
        {validateButton}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    textAlign: "center",
  },
  text: {
    fontFamily: "Lato_400Regular",
    color: "ffff",
  },
});

function mapStateToProps(state) {
  return { kidList: state.kidList, answerList: state.answerList };
}

function mapDispatchToProps(dispatch) {
  return {
    addAnswer: function (answer) {
      dispatch({ type: "addanswer", answer });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ChallengeScreen);
