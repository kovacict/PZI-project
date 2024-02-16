const signedOutDisplay = document.getElementById("signed-out-display");
const signOutButtonContainer = document.getElementById(
  "sign-out-button-container"
);
const signedInDisplay = document.getElementById("signed-in-display");
const signInButtonContainer = document.getElementById(
  "sign-in-button-container"
);
const signOutButton = document.getElementById("sign-out-button");
const employeeSelector = document.getElementById("employee-select");
const employeeDetailsContainer = document.getElementById(
  "employee-details-conatiner"
);
const createPTOForm = document.getElementById("create-pto-form");
const summerImage =
  "https://media.cnn.com/api/v1/images/stellar/prod/210316134738-02-wisdom-project-summer.jpg?q=w_3568,h_2006,x_0,y_0,c_fill";
const winterImage =
  "https://cdn.britannica.com/17/217417-138-6200BA99/Just-the-facts-winter-solstice.jpg?w=400&h=225&c=crop";
const fallImage = "./images/fall.jpg";
const springImage = "./images/spring.jpg";
signOutButton.addEventListener("click", signOutUser);

const loggedIn = document.cookie;
const loggedInValue = loggedIn.split("=");

if (!loggedInValue[1]) {
  signInButton.style.display = "block";
  signedInDisplay.style.display = "none";
} else {
  signedOutDisplay.style.display = "none";
  signedInDisplay.style.display = "block";
  signOutButtonContainer.style.display = "block";
  signInButtonContainer.style.display = "none";
  const result = fetchEmployees();
  result.then((value) => {
    employeeSelector.addEventListener("change", displayEmployeeData);
    function displayEmployeeData(event) {
      if (employeeDetailsContainer.children.length > 1) {
        employeeDetailsContainer.removeChild(
          employeeDetailsContainer.lastChild
        );
      }
      const selectedEmployee = event.currentTarget.value;
      for (let index = 0; index < value.length; index++) {
        const employee = value[index];
        if (employee.name === selectedEmployee) {
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
      }
    }
  });
}

function signOutUser() {
  const expiredDate = new Date();
  expiredDate.setDate(expiredDate.getDate() - 30);
  document.cookie = `userIsLoggedIn=; expires:${expiredDate}`;
  location.reload();
}

async function fetchEmployees() {
  try {
    const employees = await fetch("https://jsonplaceholder.typicode.com/users");
    const result = await employees.json();
    if (result) {
      for (let index = 0; index < result.length; index++) {
        const employee = result[index];
        const newOption = document.createElement("option");
        newOption.value = `${employee.name}`;
        newOption.innerText = `${employee.name}`;
        employeeSelector.appendChild(newOption);
      }
    }
    return result;
  } catch (error) {
    console.log(error);
  }
}

createPTOForm.addEventListener("submit", handleCreatePTOButtonPress);

function handleCreatePTOButtonPress(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const employee = formData.get("employee");
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
  const startDateInput = document.getElementById("start-date").value;
  const endDateInput = document.getElementById("end-date").value;
  resetCalendars();
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
  const startDate = new Date(startDateInput);
  const endDate = new Date(endDateInput);
  let ptoDuration = "";
  let ptoClass = "";
  let dataContainer = "";
  let imageLink = "";
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
  const newPtoData = {
    employee: employee,
    startDate: startDate.toDateString(),
    endDate: endDate.toDateString(),
  };
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

  dataContainer = decidePTOContainer(startDate, endDate);
  imageLink = decideBackgroundImage(startDate.getMonth());
  console.log(dataContainer, imageLink);
  const newPtoDataContainer = document.createElement("div");
  newPtoDataContainer.classList.add("employee-pto");
  newPtoDataContainer.innerHTML = `<img src="${imageLink}"/>
<i class="fa-solid fa-x x-icon"></i>
<p class="${ptoClass}">${ptoDuration}</p>`;
  const ptoDataContainer = document.getElementById(`${dataContainer}`);
  ptoDataContainer.appendChild(newPtoDataContainer);
  removeUnusedPTOContainers();
}

function resetCalendars() {
  const startDateInput = document.getElementById("start-date");
  const endDateInput = document.getElementById("end-date");
  const highlightedDays = document.querySelectorAll(".active");
  highlightedDays.forEach((element) => {
    element.classList.remove("active");
  });
  startDateInput.value = "";
  endDateInput.value = "";
}

function decidePTOContainer(startDate, endDate) {
  const currentDate = new Date();

  if (
    (currentDate > startDate && currentDate < endDate) ||
    (currentDate.toDateString() === startDate.toDateString() &&
      currentDate.toDateString() === endDate.toDateString())
  ) {
    return "current-employee-pto";
  } else if (currentDate > endDate) {
    return "past-employee-pto";
  } else {
    return "upcoming-employee-pto";
  }
}

function decideBackgroundImage(startMonth) {
  switch (startMonth) {
    case 0:
    case 1:
    case 2:
      return winterImage;
    case 3:
    case 4:
    case 5:
      return springImage;
    case 6:
    case 7:
    case 8:
      return summerImage;
    case 9:
    case 10:
    case 11:
      return fallImage;

    default:
      console.error("Wrong input month!");
      break;
  }
}

function removeUnusedPTOContainers() {
  const PTOContainer = document.querySelectorAll(".pto-container");
  PTOContainer.forEach((element) => {
    if (element.children.length < 2) {
      element.style.display = "none";
    } else {
      element.style.display = "block";
    }
  });
}
