import React, { useEffect, useReducer } from "react";
import axios from "axios";
import Child from "./components/Child";
import Pagination from "./components/Pagination";
import SortBar from "./components/Sort";
import reducer from "./Reducer";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

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

        dispatch({
          type: "SETLIST",
          payload: {
            backUpList: response.data.children,
            childrenList: response.data.children,
          },
        });

        dispatch({ type: "SETLOADING" });
      } catch (error) {
        dispatch({ type: "SETLOADING" });
      }
    };

    getChildren();
  }, []);

  //FUNCTION: To sort children based on values entered into the sorting input form on Page
  const handleSort = (e) => {
    dispatch({ type: "PAGE", payload: 1 });
    dispatch({ type: "SETSORT", payload: e.target.value });
    dispatch({ type: "SETCHILDRENLIST", payload: state.backUpList });
    const initialChildrenList = state.childrenList;

    //condition to start sorting only after 3 characters are entered into the input
    if (e.target.value.length > 2) {
      const sortedChildrenList = initialChildrenList.filter((data) =>
        data.name.fullName.toLowerCase().match(new RegExp(e.target.value, "gi"))
      );
      dispatch({ type: "SETCHILDRENLIST", payload: sortedChildrenList });
      console.log(1);
    }
    // else {
    //   dispatch({ type: "SETCHILDRENLIST", payload: state.backUpList });
    // }
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
    const cI = e.target.getAttribute("data-checkedin");

    //if checkedIn is false, then Checkin child
    if (cI === "false") {
      const pickupTime = pickUp();

      try {
        const checkin = await axios.post(
          `https://app.famly.co/api/v2/children/${id}/checkins`,
          {
            accessToken: "9ee38c45-a7ce-4b61-94ad-188bcd66de8b",
            pickupTime: pickupTime,
          }
        );

        //if checin successsful, setList
        if (checkin.data.childId.length > 0) {
          state.backUpList.forEach((val) => {
            if (val.childId === checkin.data.childId) {
              val.checkedIn = true;
            }
          });
          dispatch({
            type: "SETLIST",
            payload: {
              backUpList: state.backUpList,
              childrenList: state.childrenList,
            },
          });
        }
      } catch (error) {
        //console.error(error);
      }
      //if cehckedin is true, then Checkout child
    } else {
      try {
        const checkout = await axios.post(
          `https://app.famly.co/api/v2/children/${id}/checkout`,
          {
            accessToken: "9ee38c45-a7ce-4b61-94ad-188bcd66de8b",
          }
        );
        //if checkout successsful, setList
        if (checkout.data[0].childId.length > 0) {
          state.backUpList.forEach((val) => {
            if (val.childId === checkout.data[0].childId) {
              val.checkedIn = false;
            }
          });

          dispatch({
            type: "SETLIST",
            payload: {
              backUpList: state.backUpList,
              childrenList: state.childrenList,
            },
          });
        }
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
        // onPress={(e) => {
        //   if (e.keyCode === 8) {
        //     handleSort(e);
        //   }
        // }}
      />

      <Child
        list={currentChildrenList}
        loading={state.loading}
        checkChildOutorIn={checkChildOutorIn}
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
