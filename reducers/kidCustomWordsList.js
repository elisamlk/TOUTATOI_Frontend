export default function (kidCustomWordsList = [], action) {
  if (action.type == "initiateCustomWordsList") {
    console.log("test reducer", action.list);
    return action.list;
  } else if (action.type == "addNewWord") {
    return [...kidCustomWordsList, { label: action.newWord }];
  } else if (action.type == "deleteWord") {
    return kidCustomWordsList.filter((e) => e.label !== action.wordToDelete);
  } else return kidCustomWordsList;
}
