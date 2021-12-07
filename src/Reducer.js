const reducer = (state, action) => {
  switch (action.type) {
    case "SETLOADING":
      return { ...state, loading: !state.loading };

    case "SETLIST":
      return {
        ...state,
        childrenList: action.payload.childrenList,
        backUpList: action.payload.backUpList,
      };

    case "SETCHILDRENLIST":
      return {
        ...state,
        childrenList: action.payload,
      };

    case "SETBACKUPLIST":
      return {
        ...state,
        backUpList: action.payload,
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
