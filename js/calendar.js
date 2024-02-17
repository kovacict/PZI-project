const daysContainer = document.querySelectorAll(".days");
const previousMonthButtons = document.querySelectorAll(".previous");
const nextMonthButtons = document.querySelectorAll(".next");
const date = new Date();
let currentYear = date.getFullYear();
let currentMonth = date.getMonth();
const calendars = document.querySelectorAll(".wrapper");

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

for (let index = 0; index < calendars.length; index++) {
  displayCurrentDate(calendars[index], currentYear, currentMonth);
}

function displayCurrentDate(calendar, currentYear, currentMonth) {
  const currentDate = calendar.querySelector(".current-date");
  const daysContainer = calendar.querySelector(".days");
  let firstDayInAMonth = new Date(currentYear, currentMonth, 1).getDay();
  const lastDateInAMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const lastDateofLastMonth = new Date(currentYear, currentMonth, 0).getDate();
  firstDayInAMonth==0?firstDayInAMonth=6:[firstDayInAMonth=firstDayInAMonth-1]
  for (let index = firstDayInAMonth; index > 0; index--) {
    const newDay = document.createElement("li");
    newDay.innerText = `${lastDateofLastMonth - index + 1}`;
    newDay.classList.add("inactive");
    daysContainer.appendChild(newDay);
  }
  for (let index = 1; index < lastDateInAMonth + 1; index++) {
    const newDay = document.createElement("li");
    newDay.innerText = `${index}`;
    newDay.addEventListener("click", selectDay);
    daysContainer.appendChild(newDay);
  }
  for (let index = 1; daysContainer.children.length < 42; index++) {
    const newDay = document.createElement("li");
    newDay.innerText = `${index}`;
    newDay.classList.add("inactive");
    daysContainer.appendChild(newDay);
  }
  currentDate.innerText = `${months[currentMonth]} ${currentYear}`;
}

for (let index = 0; index < previousMonthButtons.length; index++) {
  previousMonthButtons[index].addEventListener("click", reduceMonth);
}

function reduceMonth(event) {
  const daysContainer =
    event.currentTarget.parentElement.parentElement.querySelector(".days");
  const currentDate =
    event.currentTarget.parentElement.querySelector(".current-date").innerText;
  const currentDateArray = currentDate.split(" ");
  let currentMonth = months.findIndex((month) => month == currentDateArray[0]);
  let currentYear = currentDateArray[1];
  currentMonth = currentMonth - 1;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear = Number(currentYear - 1);
  }
  daysContainer.innerHTML = "";
  displayCurrentDate(
    event.currentTarget.parentElement.parentElement,
    currentYear,
    currentMonth
  );
}

for (let index = 0; index < previousMonthButtons.length; index++) {
  nextMonthButtons[index].addEventListener("click", increaseMonth);
}

function increaseMonth(event) {
  const daysContainer =
    event.currentTarget.parentElement.parentElement.querySelector(".days");
  const currentDate =
    event.currentTarget.parentElement.querySelector(".current-date").innerText;
  const currentDateArray = currentDate.split(" ");
  let currentMonth = months.findIndex((month) => month == currentDateArray[0]);
  let currentYear = currentDateArray[1];
  currentMonth = currentMonth + 1;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear = Number(currentYear) + 1;
  }
  daysContainer.innerHTML = "";
  displayCurrentDate(
    event.currentTarget.parentElement.parentElement,
    currentYear,
    currentMonth
  );
}

function selectDay(event) {
  const wrapper = event.target.parentElement.parentElement.parentElement;
  const currentDate =
    event.currentTarget.parentElement.parentElement.parentElement.querySelector(
      ".current-date"
    ).innerText;
  const currentDateArray = currentDate.split(" ");
  let currentMonth = months.findIndex((month) => month == currentDateArray[0]);
  const allActiveDays =
    event.target.parentElement.querySelectorAll("li:not(.inactive)");
  let currentYear = currentDateArray[1];
  allActiveDays.forEach((element) => {
    element.classList.remove("active");
  });
  event.target.classList.add("active");
  let currentDay = Number(
    event.currentTarget.parentElement.querySelector(".active").innerText
  );
  const calendarDate = new Date(currentYear, currentMonth, currentDay + 1);
  const inputCalendar = wrapper.querySelector("input");
  inputCalendar.valueAsDate = calendarDate;
}
