export default function (activeKid = {}, action) {
  let activeKidCopy = { ...activeKid };
  switch (action.type) {
    case "selectKid":
      return action.kid;
    case "activateNotion":
      activeKidCopy.activatedNotions.push(action.notion);
      return activeKidCopy;
    case "deactivateNotion":
      activeKidCopy.activatedNotions = activeKidCopy.activatedNotions.filter(
        (e) => e.notionId !== action.notion
      );
      return activeKidCopy;
    case "addNewWord":
      console.log(
        "jajoute un mot hohohoho  ",
        action.newWord,
        "dans ",
        activeKidCopy.customWords
      );

      activeKidCopy.customWords.push({ label: action.newWord });
      activeKidCopy.customWords.sort((a, b) => b.label - b.label);
      return activeKidCopy;
    case "deleteWord":
      activeKidCopy.customWords = activeKidCopy.customWords.filter(
        (e) => e.label !== action.wordToDelete
      );
      return activeKidCopy;
    case "addRelated":
      console.log("j'ajoute un related");
      activeKidCopy.relatedUsers.push(action.mail);
      return activeKidCopy;
    case "suppRelated":
      console.log("je supprime un related", action.mail);
      activeKidCopy.relatedUsers = activeKidCopy.relatedUsers.filter(
        (e) => e !== action.mail
      );
      return activeKidCopy;
    default:
      return activeKid;
  }
}
