export default function (user = "62839ac9050d94255ebdcec0", action) {
  if (action.type == "saveUser") {
    return action.user;
  } else {
    return user;
  }
}
