export function checkString(str, strName){
    if(!str || typeof str !== 'string'|| str.trim().length === 0) throw `${strName} must be non-empty string.`;
    return str.trim();
}

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

    if(username.trim().length < 5 || username.trim().length > 20) throw `Username has to be between 5 to 20 characters.`;

    return username.trim();
}

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
}

