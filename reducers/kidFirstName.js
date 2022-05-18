export default function (kidFirstName = "Laura", action) {
  if (action.type == "saveKidFirstName") {
    return action.kidFirstName;
  } else {
    return kidFirstName;
  }
}
