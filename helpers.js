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
