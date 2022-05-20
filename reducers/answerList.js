export default function (answerList = [], action) {
  if (action.type == "addanswer") {
    return [...answerList, action.answer];
  } else return answerList;
}
