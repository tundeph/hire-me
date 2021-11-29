# My Famly Check-in App

This is my version of an application designed to List, Checkin and Checkout children.

## My PACT Analysis

I start every design by thinking of People, Activities & Context then Technology which ultimately determine the type of solution to be deployed.

(https://github.com/tundeph/hire-me/blob/branch/public/Famly-sketch.jpg)

### PEOPLE - I imagine this is a school, so;

- There are a defined and limited number of pupils, most likely never more than few hundreds per school
- The app will be used by someone that is not very computer savvy (either a receptionist at a school or a self-serve system for parents)

### ACTIVITIES - I imagined that;

- The user will need to be able to Checkin or Checkout a child within few seconds so as not to cause queues
- There needs to be adequate and instant child identification/verification method to avoid mistakes

In consideration of the above:

- I made the application a single-page interface where a user can search for pupils by typing their names
- I deployed the pagination system since there should be a defined number of students
- I made the interface for each child to be bold and the button to be clicked to check in, also bold, so it reduces mistakes

## My CODE Analysis:

- I used States generously to store results and to be abe to sort
- On page load, `useEffect` is used to fire a `getChildren()` function which is used to get the list of children and updates the `childrenList` variable and backUpList variable.
- The `backUpList` variable is declared on page load to ensure we have a complete copy of the list of children because we are going to be manipulating the childrenList variable when sorting.
- The `checkedIn` status of each chld is checked from the payload returned from the GET API call and this status is used to determine what button is displayed under a user (Checkin or Checkout).
- When the Checkin button is clicked, the Checkin API endpoint is called and when a childId is returned (which signifies success), the Checkin button changes to a Checkout button
- The main `App.js` has three components stored inside the components folder namely `Child.js, Pagination.js` and `Sort.js`
