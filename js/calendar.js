//Get the container in which the days will be displayed
const daysContainer = document.querySelectorAll(".days");

//Get the buttons which are used to change the month
const previousMonthButtons = document.querySelectorAll(".previous");
const nextMonthButtons = document.querySelectorAll(".next");

//Get the current year and month
const date = new Date();
let currentYear = date.getFullYear();
let currentMonth = date.getMonth();

//Get the containers of the calendars
const calendars = document.querySelectorAll(".wrapper");

//Create an array of months
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

//Initialize every calendar in the HTML page
for (let index = 0; index < calendars.length; index++) {
  displayCurrentDate(calendars[index], currentYear, currentMonth);
}

//Function for initializing a calendar
function displayCurrentDate(calendar, currentYear, currentMonth) {
  //Get the container where the current year and month will be displayed
  const currentDate = calendar.querySelector(".current-date");

  //Get the container where the days will be added
  const daysContainer = calendar.querySelector(".days");

  //Get the first day of a month
  let firstDayInAMonth = new Date(currentYear, currentMonth, 1).getDay();

  //Get the last dat in a month
  const lastDateInAMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  //Get the last date of last month
  const lastDateofLastMonth = new Date(currentYear, currentMonth, 0).getDate();

  //Get the current date
  const today = new Date();

  //Instead of Sunday being the first day of the week, the first day was changed to be Monday
  firstDayInAMonth == 0
    ? (firstDayInAMonth = 6)
    : (firstDayInAMonth = firstDayInAMonth - 1);

  //Add the last couple of dates of last month
  for (let index = firstDayInAMonth; index > 0; index--) {
    const newDay = document.createElement("li");
    newDay.innerText = `${lastDateofLastMonth - index + 1}`;
    newDay.classList.add("inactive");
    daysContainer.appendChild(newDay);
  }

  //Add all the days of this month
  for (let index = 1; index < lastDateInAMonth + 1; index++) {
    const newDay = document.createElement("li");
    newDay.innerText = index;
    newDay.addEventListener("click", selectDay);

    //If the current day is today add class today
    if (
      today.getFullYear() == currentYear &&
      today.getMonth() == Number(currentMonth) &&
      index == today.getDate()
    ) {
      newDay.classList.add("today");
    }
    daysContainer.appendChild(newDay);
  }

  //Keep adding days until there are six full rows of days
  for (let index = 1; daysContainer.children.length < 42; index++) {
    const newDay = document.createElement("li");
    newDay.innerText = `${index}`;
    newDay.classList.add("inactive");
    daysContainer.appendChild(newDay);
  }

  //Display the current month and year
  currentDate.innerText = `${months[currentMonth]} ${currentYear}`;
}

//Add event listener to each left arrow
for (let index = 0; index < previousMonthButtons.length; index++) {
  previousMonthButtons[index].addEventListener("click", reduceMonth);
}

//Function for reducing the month
function reduceMonth(event) {
  //Get the container where the days are displayed
  const daysContainer =
    event.currentTarget.parentElement.parentElement.querySelector(".days");

  //Get the current month and year
  const currentDate =
    event.currentTarget.parentElement.querySelector(".current-date").innerText;
  const currentDateArray = currentDate.split(" ");
  let currentMonth = months.findIndex((month) => month == currentDateArray[0]);
  let currentYear = currentDateArray[1];

  //Decrease month by 1
  currentMonth = currentMonth - 1;

  //If the current month is a negative number set it to 11 (December)
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear = Number(currentYear - 1);
  }

  //Delete all days in the days container
  daysContainer.innerHTML = "";

  //Initialize the calendar with new information
  displayCurrentDate(
    event.currentTarget.parentElement.parentElement,
    currentYear,
    currentMonth
  );
}

//Add event listener to each right arrow
for (let index = 0; index < previousMonthButtons.length; index++) {
  nextMonthButtons[index].addEventListener("click", increaseMonth);
}

//Function used for increasing the month
function increaseMonth(event) {
  //Get the container where the days are displayed
  const daysContainer =
    event.currentTarget.parentElement.parentElement.querySelector(".days");

  //Get the current month and year
  const currentDate =
    event.currentTarget.parentElement.querySelector(".current-date").innerText;
  const currentDateArray = currentDate.split(" ");
  let currentMonth = months.findIndex((month) => month == currentDateArray[0]);
  let currentYear = currentDateArray[1];

  //Increase the current month by 1
  currentMonth = currentMonth + 1;

  //If the current month is a number greater than 11 set it to 0 (January)
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear = Number(currentYear) + 1;
  }

  //Delete all days in the days container
  daysContainer.innerHTML = "";

  //Initialize the calendar with new information
  displayCurrentDate(
    event.currentTarget.parentElement.parentElement,
    currentYear,
    currentMonth
  );
}

//Function used for selecting a day
function selectDay(event) {
  //Get the container in which the calendar is displayed
  const wrapper = event.target.parentElement.parentElement.parentElement;

  //Get the current selected month and year
  const currentDate =
    event.currentTarget.parentElement.parentElement.parentElement.querySelector(
      ".current-date"
    ).innerText;
  const currentDateArray = currentDate.split(" ");
  let currentMonth = months.findIndex((month) => month == currentDateArray[0]);
  let currentYear = currentDateArray[1];

  //Get every active date
  const allActiveDays =
    event.target.parentElement.querySelectorAll("li:not(.inactive)");

  //If a date was previously selected unselect it
  allActiveDays.forEach((element) => {
    element.classList.remove("active");
  });

  //Select the event target
  event.target.classList.add("active");

  //Get the value of selected element
  let currentDay = Number(
    event.currentTarget.parentElement.querySelector(".active").innerText
  );

  //Create a date object with selected date, month and year
  const calendarDate = new Date(currentYear, currentMonth, currentDay + 1);

  //Get the hidden input calendar
  const inputCalendar = wrapper.querySelector("input");

  //Set the date to the created date
  inputCalendar.valueAsDate = calendarDate;
}
