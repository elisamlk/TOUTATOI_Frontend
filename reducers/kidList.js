export default function (
  kidList = [
    {
      kidId: "628351ad7fb1c5050a07b576",
      kidFirstName: "Laura",
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
  } else if (action.type == "updateKid") {
    let kidToUpdate = kidList.find((e) => e.kidId === action.kid.kidId);
    kidToUpdate.isActive = action.kid.isActive;
    kidList.filter((e) => e.kidId !== action.kid.kidId);
    return [...kidList, action.kid];
  } else {
    return kidList;
  }
}
