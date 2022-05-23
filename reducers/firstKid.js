export default function (firstKid = { name: "Nicolas", grade: "CP" }, action) {
  if (action.type == "addFirstKid") {
    return { name: action.name, grade: action.grade };
  } else {
    return firstKid;
  }
}
