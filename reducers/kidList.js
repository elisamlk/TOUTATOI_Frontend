export default function (kidList = [], action) {
  if (action.type == "submitKidList") {
    return action.kidList;
  } else if (action.type == "addKid") {
    return [...kidList, action.kid];
  } else if (action.type == "deleteKid") {
    return kidList.filter((e) => e.kidId !== action.kidId);
  } else if (action.type == "activeKid") {
    let kidListCopy = [...kidList];
    for (let i = 0; i < kidListCopy.length; i++) {
      kidListCopy[i].isActive = false;
    }
    kidListCopy[action.item].isActive = true;
    return kidListCopy;
  } else return kidList;
}
