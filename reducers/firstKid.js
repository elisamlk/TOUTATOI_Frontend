export default function (firstKid = {}, action) {
  if (action.type == "addFirstKid") {
    return { name: action.name, grade: action.grade };
  } else if (action.type == "clearFirstKid") {
    return {};
  } else {
    return firstKid;
  }
}
