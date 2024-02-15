const currentDate = document.querySelector(".current-date");
const daysContainer = document.querySelector(".days");
const previousMonthButton = document.querySelector(".previous");
const nextMonthButton = document.querySelector(".next");


const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const date = new Date();
let currentYear = date.getFullYear();
let currentMonth = date.getMonth();

function displayCurrentDate() {
  const firstDayInAMonth = new Date(currentYear, currentMonth, 1).getDay();
  const lastDateInAMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const lastDateofLastMonth = new Date(currentYear, currentMonth, 0).getDate();
  const lastDayOfMonth = new Date(
    currentYear,
    currentMonth,
    lastDateInAMonth
  ).getDay();
  console.log(lastDayOfMonth, lastDateInAMonth);

  for (let index = firstDayInAMonth; index > 1; index--) {
    const newDay = document.createElement("li");
    newDay.innerText = `${lastDateofLastMonth - index + 2}`;
    newDay.classList.add("inactive");
    daysContainer.appendChild(newDay);
  }
  for (let index = 1; index < lastDateInAMonth + 1; index++) {
    const newDay = document.createElement("li");
    newDay.innerText = `${index}`;
    daysContainer.appendChild(newDay);
  }
  for (let index = lastDayOfMonth; index <= 6; index++) {
    const newDay = document.createElement("li");
    console.log(index);
    newDay.innerText = `${index - lastDayOfMonth + 1}`;
    newDay.classList.add("inactive");
    daysContainer.appendChild(newDay);
  }
  currentDate.innerText = `${months[currentMonth]} ${currentYear}`;
}

displayCurrentDate();

previousMonthButton.addEventListener("click", () => {
  currentMonth = currentMonth - 1;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear = currentYear - 1;
  }
  daysContainer.innerHTML = "";
  displayCurrentDate();
});

nextMonthButton.addEventListener("click", () => {
  currentMonth = currentMonth + 1;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear = currentYear + 1;
  }
  daysContainer.innerHTML = "";
  displayCurrentDate();
});

const dayButtons=document.querySelectorAll("li:not(.inactive)")
console.log(dayButtons)

for (let index = 0; index < dayButtons.length; index++) {
    const element = dayButtons[index];
    element.addEventListener("click", selectDay)
}

function selectDay(event){
    event.target.style.backgroundColor="blue"
}