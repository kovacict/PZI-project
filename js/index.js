//Get container of the signed out display
const signedOutDisplay = document.getElementById("signed-out-display");

//Get the sign out button container
const signOutButtonContainer = document.getElementById(
  "sign-out-button-container"
);

//Get container of the signed in display
const signedInDisplay = document.getElementById("signed-in-display");

//Get the sign in button container
const signInButtonContainer = document.getElementById(
  "sign-in-button-container"
);

//Get the sign out button
const signOutButton = document.getElementById("sign-out-button");
const employeeSelector = document.getElementById("employee-select");
const employeeDetailsContainer = document.getElementById(
  "employee-details-conatiner"
);

//Get the form element
const createPTOForm = document.getElementById("create-pto-form");

//Apsolute links for the summer and winter image
const summerImage =
  "https://media.cnn.com/api/v1/images/stellar/prod/210316134738-02-wisdom-project-summer.jpg?q=w_3568,h_2006,x_0,y_0,c_fill";
const winterImage =
  "https://cdn.britannica.com/17/217417-138-6200BA99/Just-the-facts-winter-solstice.jpg?w=400&h=225&c=crop";

//Relative links for the fall and spring image
const fallImage = "./images/fall.jpg";
const springImage = "./images/spring.jpg";
//Apsolute links for the fall and spring image
//Fall : https://www.almanac.com/sites/default/files/styles/or/public/image_nodes/fall-leaves-forest-Shairaa-SS.jpeg?itok=Qz0nVbxV
//Spring : https://upload.wikimedia.org/wikipedia/commons/f/fb/XN_Fruehjahrswiese_00.jpg

//Get the cookie
const loggedIn = document.cookie;
const loggedInValue = loggedIn.split("=");

//If the value of the cookie is "" show the user the signed out display
if (!loggedInValue[1]) {
  signInButtonContainer.style.display = "block";
  signedInDisplay.style.display = "none";
}

//If the cookie has a value show the user the signed in display
else {
  signedOutDisplay.style.display = "none";
  signedInDisplay.style.display = "block";
  signOutButtonContainer.style.display = "block";
  signInButtonContainer.style.display = "none";

  //Get the employees
  const result = fetchEmployees();
  result.then((value) => {
    //Add change event listener to the select element
    employeeSelector.addEventListener("change", displayEmployeeData);

    //Function used for displaying the data of the current employee
    function displayEmployeeData(event) {
      //If the container in which the employee details are stored has someone's details remove them
      if (employeeDetailsContainer.children.length > 1) {
        employeeDetailsContainer.removeChild(
          employeeDetailsContainer.lastChild
        );
      }
      //Remove every PTO of the previous person if there were any
      removePTOs();

      //Get the employee in the select element
      const selectedEmployee = event.currentTarget.value;

      //Get all details of the selected details
      const employee = value.find(
        (employee) => employee.name == selectedEmployee
      );

      //Check if there are any PTOs in the local storage
      checkLocalStorage(employee.name);

      //Create new element with the employee's details and append it to the container
      const employeeDetails = document.createElement("div");
      employeeDetails.innerHTML = `<p>ID: ${employee.id}</p>
                <p>Name: ${employee.name}</p>
                <p>Username: ${employee.username}</p>
                <p>email: ${employee.email}</p>
                <table>
                  <caption>Address:</caption>
                  <thead>
                  <th>Street</th>
                  <th>Suite</th>
                  <th>City</th>
                  <th>Zipcode</th>
                  </thead>
                  <tbody>
                    <tr>
                      <td>${employee.address.street}</td>
                      <td>${employee.address.suite}</td>
                      <td>${employee.address.city}</td>
                      <td>${employee.address.zipcode}</td>
                    </tr>
                  </tbody>
                </table>
                <p>Phone number: ${employee.phone}</p>
                <p>Website: ${employee.website}</p>`;
      employeeDetailsContainer.appendChild(employeeDetails);
    }
  });
}

//Function used for searching if the employee has any PTOs in local storage
function checkLocalStorage(name) {
  //Get local storage PTO list
  const localStoragePTOData = localStorage.getItem("PTODataList");

  //If there is something in the local storage continue
  if (localStoragePTOData) {
    //Create array from the JSON string
    const PTOList = JSON.parse(localStoragePTOData);

    //Check if there are any PTOs belonging to the employee
    PTOList.forEach((element) => {
      if (element.employee === name) {
        //If there are display them
        const startDate = new Date(element.startDate);
        const endDate = new Date(element.endDate);
        createPTO(startDate, endDate);
        //Remove PTO containers with no PTOs
        removeUnusedPTOContainers();
      }
    });
  }
}

//Function used for removing PTOs from the containers
function removePTOs() {
  //Get all the pto containers
  const PTOContainer = document.querySelectorAll(".pto-container");
  //Remove every PTO
  PTOContainer.forEach((element) => {
    while (element.children.length > 1) {
      element.removeChild(element.lastChild);
    }
  });
  //Hides the PTO containers with no PTOs
  removeUnusedPTOContainers();
}

//Add event listener to the sign out button
signOutButton.addEventListener("click", signOutUser);

//Function used for signing out the user
function signOutUser() {
  //Get a new date and reduce it
  const expiredDate = new Date();
  expiredDate.setDate(expiredDate.getDate() - 30);

  //Set the value of cookie to empty string and give it an expired date
  document.cookie = `userIsLoggedIn=; expires:${expiredDate}`;
  location.reload();
}
//Function usedd for fetching employees
async function fetchEmployees() {
  try {
    const employees = await fetch("https://jsonplaceholder.typicode.com/users");
    const result = await employees.json();
    if (result) {
      //Add every employee to the select element
      for (let index = 0; index < result.length; index++) {
        const employee = result[index];
        const newOption = document.createElement("option");
        newOption.value = `${employee.name}`;
        newOption.innerText = `${employee.name}`;
        employeeSelector.appendChild(newOption);
      }
    }
    //Return the result of the fetch
    return result;
  } catch (error) {
    //Log the error if it occurs
    console.log(error);
  }
}

//Add submit event listener to form
createPTOForm.addEventListener("submit", handleCreatePTOButtonPress);

//Function used to handle submit event
function handleCreatePTOButtonPress(event) {
  //Prevent the page from refreshing
  event.preventDefault();

  //Get value of form
  const formData = new FormData(event.target);

  //Get employee from select element
  const employee = formData.get("employee");

  //If there is no employee warn the user
  if (!employee) {
    const noEmployeeWarning = document.getElementById(
      "missing-employee-warning"
    );
    noEmployeeWarning.style.display = "block";
    setTimeout(function () {
      noEmployeeWarning.style.display = "none";
    }, 5000);
    return;
  }

  //Get the values of start date and end date calendars
  const startDateInput = document.getElementById("start-date").value;
  const endDateInput = document.getElementById("end-date").value;

  //Reset all calendars
  resetCalendars();

  //If one of the dates are invalid warn user
  if (!endDateInput || !startDateInput) {
    const missingDateWarningContainer = document.getElementById(
      "missing-date-warning"
    );
    missingDateWarningContainer.style.display = "block";
    setTimeout(function () {
      missingDateWarningContainer.style.display = "none";
    }, 5000);
    return;
  }

  //Create date objects from input calendars
  const startDate = new Date(startDateInput);
  const endDate = new Date(endDateInput);

  //If start date is after end date warn user
  if (startDate > endDate) {
    const startDateGreaterThanEndDateWarning = document.getElementById(
      "start-date-greater-than-end-date-warning"
    );
    startDateGreaterThanEndDateWarning.style.display = "block";
    setTimeout(function () {
      startDateGreaterThanEndDateWarning.style.display = "none";
    }, 5000);
    return;
  }

  //Create new PTO object
  const PTOData = {
    employee: employee,
    startDate: startDate.toDateString(),
    endDate: endDate.toDateString(),
  };

  //Get local storage data
  const localStorageData = localStorage.getItem("PTODataList");

  //If there is data in local storage parse it, if there isn't set value to empty array
  const PTOList = localStorageData ? JSON.parse(localStorageData) : [];

  //Add new pto to array
  PTOList.push(PTOData);

  //Put new array into local storage
  localStorage.setItem("PTODataList", JSON.stringify(PTOList));

  //Create PTO with start and end dates
  createPTO(startDate, endDate);

  //Remove empty PTO containers if there are any
  removeUnusedPTOContainers();
}

//Function used for creating PTOs and displaying them
function createPTO(startDate, endDate) {
  let ptoDuration = "";
  let ptoClass = "";
  let dataContainer = "";
  let imageLink = "";

  //If the start date and the end date are the same make it display only one date
  //Depending on if the start and end date are the same add the appropriate class
  startDate.toString() === endDate.toString()
    ? (ptoDuration = `${
        months[startDate.getMonth()]
      } ${startDate.getDate()} ${startDate.getFullYear()}`) &&
      (ptoClass = "employee-pto-date-single")
    : (ptoDuration = `${
        months[startDate.getMonth()]
      } ${startDate.getDate()} ${startDate.getFullYear()} - ${
        months[endDate.getMonth()]
      } ${endDate.getDate()} ${endDate.getFullYear()}`) &&
      (ptoClass = "employee-pto-date");

  //Check to which container the PTO belongs in
  dataContainer = decidePTOContainer(startDate, endDate);

  //Check which images should be used for background
  imageLink = decideBackgroundImage(startDate.getMonth());

  //Create new container for PTO data
  const newPtoDataContainer = document.createElement("div");
  newPtoDataContainer.classList.add("employee-pto");
  newPtoDataContainer.innerHTML = `<img src="${imageLink}"/>
<i class="fa-solid fa-x x-icon"></i>
<p class="${ptoClass}">${ptoDuration}</p>`;

  //Get the appropriate PTO container
  const ptoDataContainer = document.getElementById(`${dataContainer}`);

  //Add event listener to every x button
  const xButton = newPtoDataContainer.querySelector(".x-icon");
  xButton.addEventListener("click", deletePTO);

  //Add created PTO to container
  ptoDataContainer.appendChild(newPtoDataContainer);
}

//Function used for deleteing a PTO
function deletePTO(event) {
  //If the user agrees proceed
  if (confirm("Do you want to delete the selected PTO?")) {
    //Get employee in select element
    const employee = document.getElementById("employee-select").value;

    //Get PTO element
    const PTO = event.target.parentElement;

    //Get container in which it is displayed
    const PTOContainer = PTO.parentElement;

    //Get start and end date of PTO
    const PTODuration = PTOContainer.querySelector("p").innerText;
    const durationList = PTODuration.split(" - ");
    let startDate = "";
    let endDate = "";

    //If start and end dates are different
    if (durationList.length > 1) {
      startDate = new Date(durationList[0]);
      endDate = new Date(durationList[1]);
    }

    //If start and end dates are the same
    else {
      startDate = new Date(durationList[0]);
      endDate = new Date(durationList[0]);
    }

    //Get PTO data list from local storage
    const localStoragePTOData = localStorage.getItem("PTODataList");

    //Turn it to an array
    const PTOList = JSON.parse(localStoragePTOData);

    //Remove PTO from the container
    PTOContainer.removeChild(PTO);

    //Find PTO in local storage
    const index = PTOList.findIndex(
      (element) =>
        element.employee === employee &&
        startDate.toDateString() === element.startDate &&
        endDate.toDateString() === element.endDate
    );

    //Remove PTO from local storage
    PTOList.splice(index, 1);

    //Send reduced array to local storage
    localStorage.setItem("PTODataList", JSON.stringify(PTOList));

    //If there are any PTO containers with no PTOs remove them
    removeUnusedPTOContainers();
  }
}

//Function used for reseting calendars
function resetCalendars() {
  //Get all input calendars
  const startDateInput = document.getElementById("start-date");
  const endDateInput = document.getElementById("end-date");

  //Get all selected days of custom calendars
  const highlightedDays = document.querySelectorAll(".active");
  //Remove active class which was highlighting them
  highlightedDays.forEach((element) => {
    element.classList.remove("active");
  });

  //Reset value of input
  startDateInput.value = "";
  endDateInput.value = "";
}

//Function used for assigning the PTO container
function decidePTOContainer(startDate, endDate) {
  //Get the current Date
  const currentDate = new Date();

  //If both current date is between start and end date return current date pto container
  //If all three dates are the same do the same
  if (
    (currentDate > startDate && currentDate < endDate) ||
    (currentDate.toDateString() === startDate.toDateString() &&
      currentDate.toDateString() === endDate.toDateString())
  ) {
    return "current-employee-pto";
  }
  //If current date is greater than end date return past employee pto container
  else if (currentDate > endDate) {
    return "past-employee-pto";
  }
  //Otherwise return upcoming employee pto container
  else {
    return "upcoming-employee-pto";
  }
}

//Function used for choosing which image is placed in the background
//According to the meterological season Winter starts on December 1., Spring starts on March 1.,
//Summer starts on June 1., Fall starts on September 1.
function decideBackgroundImage(startMonth) {
  switch (startMonth) {
    //If start month is December, January or February return winter image
    case 11:
    case 0:
    case 1:
      return winterImage;

    //If start month is March, April or May return spring image
    case 2:
    case 3:
    case 4:
      return springImage;

    //If start month is June, July or August return summer image
    case 5:
    case 6:
    case 7:
      return summerImage;

    //If start month is September, October or November return fall image
    case 8:
    case 9:
    case 10:
      return fallImage;

    default:
      console.error("Wrong input month!");
      break;
  }
}

//Function used for removing empty PTO containers
function removeUnusedPTOContainers() {
  //Get every PTO container
  const PTOContainer = document.querySelectorAll(".pto-container");

  //Check every PTO container
  PTOContainer.forEach((element) => {
    //If it has no PTOs hide it
    if (element.children.length < 2) {
      element.style.display = "none";
    } //Otherwise show it
    else {
      element.style.display = "block";
    }
  });
}

//Function used for clearing local storage, only for testing
/*function emptyLocalStorage(){
  localStorage.clear()
}*/
