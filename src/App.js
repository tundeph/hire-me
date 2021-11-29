import React, { useState, useEffect } from "react";
import axios from "axios";
import Child from "./components/Child";
import Pagination from "./components/Pagination";
import SortBar from "./components/Sort";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [childrenList, setChildrenList] = useState([]);
  const [backUpList, setBackUpList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [checkedIn, setCheckedIn] = useState("");
  const [checkedOut, setCheckedOut] = useState("");
  const [sortText, setSortText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    //FUNCTION: To get the list of all Children from database.
    //On Page load, this function is called with useState
    const getChildren = async () => {
      try {
        setLoading(true);
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
        setChildrenList(response.data.children);
        setBackUpList(response.data.children);

        classifyList(response.data.children);
        setLoading(false);
      } catch (error) {
        console.error(error);
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

    setCheckedIn(isCheckedIn);
    setCheckedOut(isCheckedOut);
  };

  //FUNCTION: To sort children based on values entered into the sorting input form on Page
  const handleSort = (e) => {
    setSortText(e.target.value);
    const initialChildrenList = childrenList;

    //condition to start sorting only after 3 characters are entered into the input
    if (e.target.value.length > 2) {
      const sortedChildrenList = initialChildrenList.filter((data) =>
        data.name.fullName.toLowerCase().match(new RegExp(e.target.value, "gi"))
      );
      setChildrenList(sortedChildrenList);
    }
    if (e.keyCode === 8 && e.target.value.length <= 3) {
      // setSortText("");
      setChildrenList(backUpList);
      classifyList(backUpList);
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
    if (checkedOut.includes(id)) {
      const pickupTime = pickUp();
      console.log("checkin");
      try {
        const checkin = await axios.post(
          `https://app.famly.co/api/v2/children/${id}/checkins`,
          {
            accessToken: "9ee38c45-a7ce-4b61-94ad-188bcd66de8b",
            pickupTime: pickupTime,
          }
        );

        console.log("checkin id: ", checkin.data.childId);

        //if there is a result and the childId is returned
        if (checkin.data.childId.length > 0) {
          //add to CheckedIn
          const addToCheckedIn = [...checkedIn, checkin.data.childId];
          setCheckedIn(addToCheckedIn);
          //remove from CheckedOut
          const removeFromCheckedOut = checkedOut.filter(
            (val) => val !== checkin.data.childId
          );
          setCheckedOut(removeFromCheckedOut);
        }
      } catch (error) {
        console.error(error);
      }
      //if childId is NOT found in checkedOut state variable, then Checkout child
    } else {
      console.log("checkout");
      try {
        const checkout = await axios.post(
          `https://app.famly.co/api/v2/children/${id}/checkout`,
          {
            accessToken: "9ee38c45-a7ce-4b61-94ad-188bcd66de8b",
          }
        );

        console.log("checkout: ", checkout.data[0].childId);

        // add to CheckedOut
        const addToCheckedOut = [...checkedOut, checkout.data[0].childId];
        setCheckedOut(addToCheckedOut);
        //remove from checkedIn
        const removeFromCheckedIn = checkedIn.filter(
          (val) => val !== checkout.data[0].childId
        );
        setCheckedIn(removeFromCheckedIn);
      } catch (error) {
        console.error(error);
      }
    }
    //once user clicks the Checkin or Checkout button, remove the text in the sort input form
    setSortText("");
  };

  //declare variables to allow for pagination
  const lastIndex = itemsPerPage * currentPage;
  const firstIndex = lastIndex - itemsPerPage;
  const currentChildrenList = childrenList.slice(firstIndex, lastIndex);
  const changePage = (number) => setCurrentPage(number);

  return (
    <div className="App container">
      <h1> Famly Check-in App </h1>
      <SortBar
        sortText={sortText}
        handleSort={handleSort}
        itemsPerPage={itemsPerPage}
        childrenList={childrenList}
        changePage={changePage}
        setItemsPerPage={(e) => setItemsPerPage(e.target.value)}
        onPress={(e) => {
          if (e.keyCode === 8) {
            handleSort(e);
          }
        }}
      />

      <Child
        list={currentChildrenList}
        loading={loading}
        checkChildOutorIn={checkChildOutorIn}
        checkedIn={checkedIn}
        checkedOut={checkedOut}
      />
      <Pagination
        postsPerPage={itemsPerPage}
        totalItems={childrenList.length}
        changePage={changePage}
      />
    </div>
  );
}

export default App;
