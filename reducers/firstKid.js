export default function (firstKid = { name: "", grade: "" }, action) {
  if (action.type == "addFirstKid") {
    return { name: action.name, grade: action.grade };
  } else {
    return firstKid;
  }
}
