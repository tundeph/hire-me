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

    case "HANDLESORT":
      return {
        ...state,
        currentPage: action.payload.page,
        sortText: action.payload.sort,
        childrenList: action.payload.childrenList,
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

export default reducer;
