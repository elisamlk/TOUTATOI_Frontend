export default function (kidId = "628351ad7fb1c5050a07b576", action) {
  if (action.type == "saveKidId") {
    return action.kidId;
  } else {
    return kidId;
  }
}
