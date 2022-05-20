export default function (
  kidList = [
    {
      kidId: "62875e64984ccb187d32afc1",
      kidFirstName: "Carlotta",
      isActive: true,
    },
  ],
  action
) {
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
