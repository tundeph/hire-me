import React, { useEffect, useReducer } from "react";
import axios from "axios";
import Child from "./components/Child";
import Pagination from "./components/Pagination";
import SortBar from "./components/Sort";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

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

function App() {
  const [state, dispatch] = useReducer(reducer, {
    childrenList: [],
    backUpList: [],
    currentPage: 1,
    itemsPerPage: 15,
    checkedIn: "",
    checkedOut: "",
    sortText: "",
    loading: false,
  });

  useEffect(() => {
    //FUNCTION: To get the list of all Children from database.
    //On Page load, this function is called with useState
    const getChildren = async () => {
      try {
        // setLoading(true);
        dispatch({ type: "SETLOADING" });
        const response = await axios.get(
          "https://app.famly.co/api/daycare/tablet/group",
          {
            params: {
              accessToken: "9ee38c45-a7ce-4b61-94ad-188bcd66de8b",
              groupId: "86413ecf-01a1-44da-ba73-1aeda212a196",
              institutionId: "dc4bd858-9e9c-4df7-9386-0d91e42280eb",
            },
          }
        );

        classifyList(response.data.children);
        dispatch({ type: "GETCHILDREN", payload: response.data.children });
        dispatch({ type: "SETBACKUPLIST", payload: response.data.children });
        dispatch({ type: "SETLOADING" });
      } catch (error) {
        dispatch({ type: "SETLOADING" });
      }
    };

    getChildren();
  }, []);

  //FUNCTION to classify the List of Children if they are checkin or checked out
  const classifyList = (array) => {
    const isCheckedIn = [];
    const isCheckedOut = [];
    array.forEach((val) => {
      val.checkedIn
        ? isCheckedIn.push(val.childId)
        : isCheckedOut.push(val.childId);
    });

    dispatch({
      type: "CLASSIFY",
      payload: { isCheckedIn: isCheckedIn, isCheckedOut: isCheckedOut },
    });
    // setCheckedIn(isCheckedIn);
    // setCheckedOut(isCheckedOut);
  };

  //FUNCTION: To sort children based on values entered into the sorting input form on Page
  const handleSort = (e) => {
    dispatch({ type: "PAGE", payload: 1 });
    dispatch({ type: "SETSORT", payload: e.target.value });
    const initialChildrenList = state.childrenList;

    //condition to start sorting only after 3 characters are entered into the input
    if (e.target.value.length > 2) {
      const sortedChildrenList = initialChildrenList.filter((data) =>
        data.name.fullName.toLowerCase().match(new RegExp(e.target.value, "gi"))
      );

      dispatch({ type: "SETCHILDRENLIST", payload: sortedChildrenList });
    }
    if (e.keyCode === 8 && e.target.value.length <= 3) {
      dispatch({ type: "SETCHILDRENLIST", payload: state.backUpList });
      classifyList(state.backUpList);
    }
  };

  //FUCNTION: To set the Pickup time to 16:00, and if it is past 16:00, it sets it to 16:00 tomorrow
  //This was manipulated for the purpose of the test, since the API wont allow checkin after 16:00
  const pickUp = () => {
    const currTime = new Date();
    if (currTime.getUTCHours() >= 16) {
      //set the date to tomorrow at 16:00
      return new Date(
        new Date(currTime.setUTCHours(16, 0, 0)).setDate(currTime.getDate() + 1)
      ).toISOString();
    } else {
      //get the ISOString format
      return new Date(currTime.setUTCHours(16, 0, 0)).toISOString();
    }
  };

  //FUNCTION: To either check a child in or out.
  const checkChildOutorIn = async (e) => {
    const id = e.target.value;

    //if childId is found in checkedOut state variable, then Checkin child
    if (state.checkedOut.includes(id)) {
      const pickupTime = pickUp();

      try {
        const checkin = await axios.post(
          `https://app.famly.co/api/v2/children/${id}/checkins`,
          {
            accessToken: "9ee38c45-a7ce-4b61-94ad-188bcd66de8b",
            pickupTime: pickupTime,
          }
        );

        //if there is a result and the childId is returned
        if (checkin.data.childId.length > 0) {
          //add to CheckedIn
          const addToCheckedIn = [...state.checkedIn, checkin.data.childId];
          dispatch({ type: "CHECKIN", payload: addToCheckedIn });

          //remove from CheckedOut
          const removeFromCheckedOut = state.checkedOut.filter(
            (val) => val !== checkin.data.childId
          );
          //setCheckedOut(removeFromCheckedOut);
          dispatch({ type: "CHECKOUT", payload: removeFromCheckedOut });
        }
      } catch (error) {
        //console.error(error);
      }
      //if childId is NOT found in checkedOut state variable, then Checkout child
    } else {
      try {
        const checkout = await axios.post(
          `https://app.famly.co/api/v2/children/${id}/checkout`,
          {
            accessToken: "9ee38c45-a7ce-4b61-94ad-188bcd66de8b",
          }
        );

        // add to CheckedOut
        const addToCheckedOut = [...state.checkedOut, checkout.data[0].childId];
        //setCheckedOut(addToCheckedOut);
        dispatch({ type: "CHECKOUT", payload: addToCheckedOut });
        //remove from checkedIn
        const removeFromCheckedIn = state.checkedIn.filter(
          (val) => val !== checkout.data[0].childId
        );

        dispatch({ type: "CHECKIN", payload: removeFromCheckedIn });
      } catch (error) {
        //console.error(error);
      }
    }
  };

  //declare variables to allow for pagination
  const lastIndex = state.itemsPerPage * state.currentPage;
  const firstIndex = lastIndex - state.itemsPerPage;
  const currentChildrenList = state.childrenList.slice(firstIndex, lastIndex);
  const changePage = (number) => dispatch({ type: "PAGE", payload: number });

  return (
    <div className="App container">
      <h1> Famly Check-in / Check-out App </h1>
      <SortBar
        sortText={state.sortText}
        handleSort={handleSort}
        itemsPerPage={state.itemsPerPage}
        childrenList={state.childrenList}
        changePage={changePage}
        currentPage={state.currentPage}
        setItemsPerPage={(e) =>
          dispatch({ type: "ITEMS", payload: e.target.value })
        }
        onPress={(e) => {
          if (e.keyCode === 8) {
            handleSort(e);
          }
        }}
      />

      <Child
        list={currentChildrenList}
        loading={state.loading}
        checkChildOutorIn={checkChildOutorIn}
        checkedIn={state.checkedIn}
        checkedOut={state.checkedOut}
      />

      <Pagination
        postsPerPage={state.itemsPerPage}
        totalItems={state.childrenList.length}
        changePage={changePage}
        currentPage={state.currentPage}
      />
    </div>
  );
}

export default App;
