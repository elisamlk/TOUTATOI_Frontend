const configStyle = {
  container: {
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  card: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 75,
    backgroundColor: "white",
    borderRadius: 15,
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8,
    paddingLeft: 16,
    paddingRight: 14,
    marginTop: 15,
    marginBottom: 20,
    marginLeft: 16,
    marginRight: 16,
  },
  trashbutton: {
    height: 30,
    width: 30,
    borderRadius: 50,
    backgroundColor: "grey",
  },
  dropdowncontainer: {
    paddingLeft: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  dropdown: {
    height: 50,
    width: "70%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 17,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textItem: {
    flex: 1,
    fontSize: 16,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    display: "none",
  },
  buttonList: {
    width: 110,
    color: "white",
    backgroundColor: "#FFC9B9",
    padding: 10,
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 20,
  },
  buttonFonts: {
    color: "white",
    textAlign: "center",
    fontSize: 15,
    fontWeight: "bold",
  },
  inputList: {
    width: 300,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 10,
  },
  words: {
    flexDirection: "row",

    alignItems: "center",
  },
  text: {
    fontSize: 15,
    paddingTop: 10,
    paddingRight: 5,
    paddingLeft: 10,
  },
  wordsListItem: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
};

export default configStyle;
