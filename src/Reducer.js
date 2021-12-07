const reducer = (state, action) => {
  switch (action.type) {
    case "GETCHILDREN":
      return {
        ...state,
        childrenList: action.payload,
        setBackUpList: action.payload,
      };

    case "SETLOADING":
      return { ...state, loading: !state.loading };

    case "SETCHILDRENLIST":
      return {
        ...state,
        childrenList: action.payload,
      };

    case "SETLIST":
      return {
        ...state,
        childrenList: action.payload.childrenList,
        backUpList: action.payload.backUpList,
      };

    case "SETBACKUPLIST":
      return {
        ...state,
        backUpList: action.payload,
      };

    case "CHECKIN":
      return {
        ...state,
        checkedIn: action.payload,
      };

    case "CHECKOUT":
      return {
        ...state,
        checkedOut: action.payload,
      };

    case "CLASSIFY":
      return {
        ...state,
        checkedIn: action.payload.isCheckedIn,
        checkedOut: action.payload.isCheckedOut,
      };

    case "SETSORT":
      return {
        ...state,
        sortText: action.payload,
      };

    case "PAGE":
      return {
        ...state,
        currentPage: action.payload,
      };

    case "ITEMS":
      return {
        ...state,
        itemsPerPage: action.payload,
      };

    default:
      return state;
  }
};

module.exports = reducer;
