export default function (kidActivatedNotionList = [], action) {
  if (action.type == "submitActivatedNotionList") {
    return action.list;
  } else if (action.type == "activateNotion") {
    return [...kidActivatedNotionList, action.notion];
  } else if (action.type == "deactivateNotion") {
    return kidActivatedNotionList.filter((e) => e.notionId !== action.notion);
  } else return kidActivatedNotionList;
}
