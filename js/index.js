
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
        console.log("jere");
        employeeDetailsContainer.removeChild(
          employeeDetailsContainer.lastChild
        );
      }
      const selectedEmployee = event.currentTarget.value;
      console.log(selectedEmployee);
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
