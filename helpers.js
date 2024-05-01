import { ObjectId } from "mongodb";

export const generateRandomString = () => {
  const letters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < 16; i++) {
    const randomIndex = Math.floor(Math.random() * letters.length);
    result = result + letters.charAt(randomIndex);
  }

  return result;
};

export const checkID = (id, typeId = undefined) => {
  // If no id is provided
  if (!id) throw `${typeId || "id"} not provided`;
  // If the id provided is not a string, or is an  empty string
  if (typeof id !== "string" || id.trim().length === 0)
    throw `${typeId || "id"} must be a non-empty string`;
  // If the id provided is not a valid ObjectId
  if (!ObjectId.isValid(id.trim()))
    throw `the provided ${typeId || "id"} is not a valid ObjectId`;
  return id.trim();
};

export const checkComment = (str, strName = undefined) => {
  if (typeof str !== "string" || str.trim().length === 0) {
    throw `${strName || str} must be a non-empty string`;
  }
  // set a character limit of 280 (the default for Twitter)
  if (str.trim().length > 280) {
    throw `${strName || str} must be less than 280 characters`;
  }
  return str.trim();
};

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

