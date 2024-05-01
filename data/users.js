import bcrypt from 'bcrypt';
import {users} from '../config/mongoCollections.js';
import * as helper from '../validation.js';


export const createUser = async(firstName, lastName, email, username, password) => {
    if(!firstName, !lastName, !email, !username, !password) throw `Please complete al fields.`;
    firstName = helper.checkString(firstName, "First name");
    lastName = helper.checkString(lastName, "Last name");
    email = helper.checkEmail(email);
    username = helper.checkUsername(username);
    password = helper.checkPassword(password);

    let hashedPassword = bcrypt.hash(password, 16);

    const userCollection = await users();

    const usernameExists = await userCollection.findOne({username: username.toLowerCase()});
    if(usernameExists) throw `The username already exists.`;

    const emailExists = await userCollection.findOne({username: email.toLowerCase()});
    if(emailExists) throw `The email already exists.`;

    let newUser = {
        firstName : firstName,
        lastName : lastName, 
        email : email.toLowerCase(), 
        username : username.toLowerCase(), 
        password : hashedPassword
    }

    const newUserInfo = await userCollection.insertOne(newUser);
    if(!newUserInfo.insertedId || !newUserInfo.acknowledged) throw `Account cannot be created.`;

    return newUserInfo;
};

export const loginUser = async(username, password) => {
    if(!username) throw `Please provide a username`;
    if(!password) throw `Please provide a password`;
;
    username = helper.checkUsername(username);
    password = helper.checkPassword(password);

    let userCollection = await users();

    const usernameExists = await userCollection.findOne({username: username.toLowerCase()});
    if(!usernameExists) throw `Either the username or password is invalid.`;

    let passwordMatches = await bcrypt.compare(password, usernameExists.password);
    if(!passwordMatches) throw `Either the username or password is invalid`;

    let userInf = await userCollection.find({username: username.toLowerCase()}).project({password: 0}).toArray()

    if(!userInf) throw `Account cannot be located.`;

    return userInf[0];
};
