export function checkString(str, strName){
    if(!str || typeof str !== 'string'|| str.trim().length === 0) throw `${strName} must be non-empty string.`;
    return str.trim();
};
  
export function checkEmail(email){
    if(!checkString(email, "Email"));
  
    let emailChar = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  
    if(emailChar.test(email) === false) throw `Email is not valid.`;
  
    return email.trim();
};
  
export function checkUsername(username){
    if(!checkString(username, "Username"));
  
    let space = /\s/; // no spaces allowed
    if(space.test(username)) throw "Username cannot have spaces.";
  
    if(username.trim().length < 5 || username.trim().length > 20) throw `Username must be be between 5 to 20 characters.`;
  
    return username.trim();
};
  
export function checkPassword(password){
    if(typeof password !== 'string') throw 'Password must be a string.';
    if(password.trim().length === 0) throw  `Password cannot be empty spaces`;
    
    let space = /\s/;
    let atLeastOneNum = /[0-9]/; // at least one number
    let atLeastOneUpperCase = /[A-Z]/; // at least one uppercase character
    let atLeastOneSpecChar = /[^A-Za-z0-9]/; // at least one special character
  
    if(space.test(password)) throw 'Password cannot contain whitespace.'
    if(!atLeastOneNum.test(password)) throw `Password must contain at least one number.`
    if(!atLeastOneUpperCase.test(password)) throw `Password must contain at least one uppercase letter.`
    if(!atLeastOneSpecChar.test(password)) throw `Password must contain at least one special character.`
  
    if(password.trim().length < 8) throw `Password must be at least 8 characters.`
  
    return password.trim();
};

// Handling register

let regForm = document.getElementById("signup-form");

if(regForm) {

    regForm.addEventListener("submit", (event) =>{
        let firstN = document.getElementById("firstName");
        let firstNerr = document.getElementById("fNameError")
        let lastN = document.getElementById("lastName");
        let lastNerr = document.getElementById("lNameError");
        let email = document.getElementById("email");
        let emailErr = document.getElementById("emailErr");
        let username = document.getElementById("username");
        let usernameErr = document.getElementById("unameError");
        let password = document.getElementById("password");
        let passwordErr = document.getElementById("pswdError");
        let confirmPassword = document.getElementById("confirmPassword");
        let conPassErr = document.getElementById("pswdNotConfirmed");

        event.preventDefault();
        let submitAllowed = true;

        try{
            firstN.value = checkString(firstN.value, "First name");
            firstNerr.hidden = true;
        } catch(e){
            firstN.value = "";
            firstNerr.innerHTML = e;
            firstNerr.hidden = false;
            submitAllowed = false;
        }

        try{
            lastN.value = checkString(lastN.value, "Last name");
            lastNerr.hidden = true;
        } catch(e){
            lastN.value = "";
            lastNerr.innerHTML = e;
            lastNerr.hidden = false;
            submitAllowed = false;
        }

        try{
            email.value = checkEmail(email.value);
            emailErr.hidden = true;
        } catch(e){
            email.value = "";
            emailErr.innerHTML = e;
            emailErr.hidden = false;
            submitAllowed = false;
        }

        try{
            username.value = checkUsername(username.value);
            usernameErr.hidden = true;
        } catch(e){
            username.value = "";
            usernameErr.innerHTML = e;
            usernameErr.hidden = false;
            submitAllowed = false;
        }

        try{
            passwd.value = checkPassword(passwd.value);
            pwdErr.hidden = true;
        } catch(e){
            password.value = "";
            passwordErr.innerHTML = e;
            passwordErr.hidden = false;
            submitAllowed = false;
        }

        try{
            confirmPassword.value = checkPassword(confirmPassword.value);
            if(confirmPassword.value !== password.value) throw `Passwords do not match.`;
            conPassErr.hidden = true;
        } catch(e){
            confirmPassword.value = "";
            conPassErr.innerHTML = e;
            conPassErr.hidden = false;
            submitAllowed = false;
        }

        if(submitAllowed){
            regForm.submit();
        }
    })};

let loginForm = document.getElementById("login-form");

if(loginForm){
    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();
        let submitAllowed = true;
        
        let username = document.getElementById("username");
        let usernameErr = document.getElementById("unameError");
        let password = document.getElementById("password");
        let passwordErr = document.getElementById("pswdError");

        try{
            username.value = checkUsername(username.value);
            usernameErr.hidden = true;
        } catch(e){
            username.value = "";
            usernameErr.innerHTML = e;
            usernameErr.hidden = false;
            submitAllowed = false;
        }

        try{
            password.value = checkPassword(password.value);
            passwordErr.hidden = true;
        } catch(e){
            password.value = "";
            passwordErr.innerHTML = e;
            passwordErr.hidden = false;
            submitAllowed = false;
        }

        if(submitAllowed){
            loginForm.submit();
        }
    })

};
