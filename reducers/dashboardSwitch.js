export default function (
  dashboardSwitch = { perso: "first", stat: "second" },
  action
) {
  if (action.type == "postChallenge") {
    console.log("je switche");
    return { perso: "second", stat: "first" };
  } else {
    return dashboardSwitch;
  }
}
