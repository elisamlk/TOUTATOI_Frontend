export default function (activeUser = "", action) {
  if (action.type == "activeUser") {
    return action.id;
  } else {
    return activeUser;
  }
}
