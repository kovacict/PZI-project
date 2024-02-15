
const signInForm=document.getElementById('sign-in-form')

signInForm.addEventListener('submit',logIn)

const regexEmail=/\w+([-._]\w+)*@\w+([-._]\w+)*(\.\w)/

const regexPassword=/((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!"#$%&/\(\)=\?*~ˇ^˘°˛`˙´˝¨\\<>\[\]@\{\},;\.:-_])){8,}/

function logIn(event){
    event.preventDefault();

    const emailFormInput=document.getElementById('email');
    const passwordFormInput=document.getElementById('password');

   if(regexEmail.test(emailFormInput.value)&&regexPassword.test(passwordFormInput.value))
    {
        const cookieExpirationDate=new Date();
        cookieExpirationDate.setDate(cookieExpirationDate.getDate()+30)
        document.cookie=`userIsLoggedIn=True; expires=${cookieExpirationDate}; SameSite=Lax`
   
        window.location.href="./index.html"
    }
    else{
        const warningField=document.getElementById('missing-field-warning');
        warningField.style.display='block';
        setTimeout(function(){
            warningField.style.display='none';
        }, 5000);
    }
}