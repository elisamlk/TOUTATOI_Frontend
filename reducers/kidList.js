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
  if (action.type == "saveKidList") {
    return action.kidList;
  } else {
    return kidList;
  }
}
