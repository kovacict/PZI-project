//Get the sign in form
const signInForm = document.getElementById("sign-in-form");

//Add event listener fo form
signInForm.addEventListener("submit", logIn);

/*
The \w metacharacter matches any character, if we want to match words instead of single characters we add a "+" character
Some people use the following signs in the email "-" "." "_" to seperate their name e.g. john.doe
The [-._] searches for any character specified between the brackets after which comes a word
In the string ([-._]\w)* the "*" means that we are searching for a string that contains zero or more occurances e.g. tino, kovacic.t , t.k.1 would all satisfy this 
A "@"" character must also be preset in the email
In the (\.\w) string the \. means that we want to use the "." character literally (actually search for a "." character)
After that comes a word and at minimum one domain name under the top level domain e.g. tkovac01@fesb.hr or example@test-11.com
*/
const regexEmail = /\w+([-._]\w+)*@\w+([-._]\w+)*(\.\w)/;

/*
The password must contain at least one lower-case letter, one upper-case letter, one number and one special character
Similar rules apply as for the email regular expression
The ?=.* string is the lookahead operator, the operator tries to match to the condition inside of the [] brackets, if returns if there was or wasn't a match
In this regular expression they search for any lower-case letter, upper-case letter, number and special character
If there is at least one of each the password is valid
The {8,} means that the input password must at lease have 8 characters
*/

const regexPassword =
  /((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!"#$%&/\(\)=\?*~ˇ^˘°˛`˙´˝¨\\<>\[\]@\{\},;\.:-_])){8,}/;

//Function used for loggign in
function logIn(event) {
  //Prevent the site from refreshing
  event.preventDefault();

  //Get the values of the email and password inputs
  const emailFormInput = document.getElementById("email");
  const passwordFormInput = document.getElementById("password");

  //If the email and password are valid create a new cookie and redirect to the index page
  if (
    regexEmail.test(emailFormInput.value) &&
    regexPassword.test(passwordFormInput.value)
  ) {
    const cookieExpirationDate = new Date();
    cookieExpirationDate.setDate(cookieExpirationDate.getDate() + 30);
    document.cookie = `userIsLoggedIn=True; expires=${cookieExpirationDate}; SameSite=Lax`;
    window.location.href = "./index.html";
  }
  //Displays the warning if there is a missing field or an invalid email or password
  else {
    //A simple alert could have been used, however i don't want to stop the script from executing
    const warningField = document.getElementById("missing-field-warning");
    warningField.style.display = "block";
    setTimeout(function () {
      warningField.style.display = "none";
    }, 5000);
  }
}
