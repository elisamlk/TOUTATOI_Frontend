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
  if (action.type == "initKidList") {
    return action.kidList;
  } else {
    if (action.type == "addKid") {
      return [...kidList, action.kid];
    } else {
      if (action.type == "suppkid") {
        return kidList.filter((e) => e.kidId !== action.kidId);
      } else return kidList;
    }
  }
}
