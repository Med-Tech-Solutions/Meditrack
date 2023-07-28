/* eslint-disable no-unused-vars */
const { Medication, Patient, User, Doctor } = require("../models/models");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const userController = {
  // Create a new user in the Database
  // Their information will be sent in the request body
  // This should send the created user
  async createUser(req, res, next) {
    const { firstName, lastName, email, password } = req.body;
    console.log(req.body);
    // console.log('createUser fired');
    if (!firstName || !lastName || !email || !password)
      // return res.status(400).json({ error: 'Did not receive first name and/or last name'});
      return next({
        err: "Error creating a new user, missing first name, last name, email, or password",
      }); //JB

    // const userExists = await User.findOne({ email })
    const hashedPassword = await bcrypt.hash(password, 10);
    User.findOne({ email: email }).then((user) => {
      if (user) {
        // res.status(400)
        // throw new Error('User already exists')
        return next({ err: "User already exists" });
      } else {
        const newUser = new User({
          firstName,
          lastName,
          email,
          password: hashedPassword,
          role: "user",
        });

        newUser
          .save()
          .then(() => {
            res.locals.newUser = newUser;
            next();
            // res.status(200).json(newUser);
          })
          .catch((err) => {
            return { err: `failed to create new user, ${err}` };
          });
      }
      // console.log("Result :", user);
    });
    // .catch((err)=>{
    //     console.log(err);
    // });
  },

  // Get a user from the database and send it in the response
  // Their first name will be in the request parameter 'name'
  // This should send the found user

  async getUser(req, res, next) {
    console.log(req.body);
    const { email, password } = req.body;
    if (!email || !password) return next({ err: "incorrect credentials" });
    User.findOne({ email: email })
      .then(async (user) => {
        if (!user)
          return next({
            err: "Error in userModel.getuser: Could not find user",
          });
        else {
          console.log("Successfully logged in!");

          // check input password and  hased jwt password
          if (await bcrypt.compare(password, user.password)) {
            // add logic to check password
            res.locals.user = user;
            res.locals.loggedin = true;
            next();
          } else {
            next({
              log: "Caught an error comparing passwords using bcrypt",
              status: 400,
              message: { err: "An error occurred in getUser" },
            });
          }

          // we need somewhere to store token and time

          // xcreate a session model in database
          // we need expiration time of session
          // res.locals.user = user;
          // return next();
        }
      })
      .catch((err) => {
        return next({ err: "err occurred while logging in" });
      });
  },

  // creating a session
  async createSession(req, res, next) {
    // get user from res.locals set in checkSession
    try {
      if (res.locals.loggedin === false) {
        return next();
      }

      const userEmail = res.locals.user.email;
      const hashedStr = crypto.randomBytes(15).toString("hex");

      // make token
      const token = await jwt.sign(hashedStr, process.env.ACCESS_TOKEN);

      // set token on cookie
      // when cookie is set it is on res obj
      // this essentialy refreshed the tokens
      res.cookie("token", token, {
        withCredentials: true,
        httpOnly: false,
        // maxAge is in milliseconds
        maxAge: 1000 * 60 * 30,
      });

      res.cookie("email", userEmail, {
        withCredentials: true,
        httpOnly: false,
        // maxAge is in milliseconds
        maxAge: 1000 * 60 * 30,
      });

      const firstName = res.locals.user.firstName;
      res.cookie("name", firstName, {
        withCredentials: true,
        httpOnly: false,
        // maxAge is in milliseconds
        maxAge: 1000 * 60 * 30,
      });

      // logic to create session from when the user was authenticated

      // const expDate = Date.now();

      function timeCheck(date, sec) {
        return date.setSeconds(date.getSeconds() + sec);
      }
      // adding 30 minutes
      const date = new Date();
      const exp = timeCheck(date, 60 * 30);

      // update database
      await User.findOneAndUpdate(
        { email: userEmail },
        {
          session: token,
          expiration: exp,
          // this will return updated document
          // { new: true}
        }
      );
      next();
    } catch (err) {
      return next({
        log: "Express error handler caught unknown middleware error",
        status: 400,
        message: { err: `An error occurred in createSession, error: ${err}` },
      });
    }
    // add token to session in users database
    // set exp date in database
  },

  // check session
  async checkSession(req, res, next) {
    try {
      console.log("====== Hitting checkSession");
      // try {
      const email = req.cookies.email;
      const token = req.cookies.token;

      if (!token || !email || (!token && !email)) {
        console.log("======= no token check");
        // return next({
        //   log: "Express error handler caught unknown middleware error",
        //   status: 400,
        //   message: { err: "No token. User is not logged in" },
        // });
        res.locals.loggedin = false;
        console.log(res.locals.loggedin);
        return next();
      }

      const dateNow = new Date();

      // get user session from database and check if it is expired
      const userSession = await User.findOne({ email: email });
      const expireDate = userSession.expiration;
      // were going to use cookie.token to see if user is authenticated
      await jwt.verify(token, process.env.ACCESS_TOKEN, (err, token) => {
        if (err) {
          // return next(err);
          res.locals.loggedin = false;
          return next();
        }
        // saving entire user object
        res.locals.user = userSession;
      });

      // compare our expiration dates current time vs created time
      // session has expired
      if (dateNow.getTime() > expireDate) {
        res.locals.loggedin = false;
        return next();
      }
      // passing to next middleware essentially refreshes session
      res.locals.loggedin = true;
      next();
    } catch (err) {
      return next({
        log: "Express error handler caught middleware error in checkSession",
        status: 400,
        message: { err: `An error occurred in checkSession, error: ${err}` },
      });
    }
  },

  // async logout(req, res, next) {
  //   const email = req.cookie.email;
  //   const token = req.cookies.token;
  //   const name = req.cookie.name;
  // },

  async getPatients(req, res, next) {
    const { email } = req.params;
    if (res.locals.loggedin === false) {
      res.locals.user = false
      return next();
    }
    User.findOne({ email: email }).then((user) => {
      if (!user)
        return next({ err: "Error in userModel.getuser: Could not find user" });
      console.log("Get patients fired!");
      res.locals.user = user;
      // console.log(res.locals.userPatients);
      return next();
    });
  },

  //update user

  async updateUser(req, res, next) {
    console.log(req.body);
    const { firstName, lastName, email, password } = req.body;
    console.log("entered update user");

    const update = {
      firstName,
      lastName,
      email,
      password,
    };

    try {
      await User.findOneAndUpdate({ email: email }, update, { new: true });
      return next();
    } catch (err) {
      return next({ err: `Error creating a new patient, ${err}` });
    }
  },

  async deleteUser(req, res, next) {
    const { email } = req.params;
    const data = await User.deleteOne({ email: email }); // returns {deletedCount: 1}
    console.log(data);
    if (data.deletedCount === 0) return next({ err: "Error deleting user" });
    if (data) return next();
  },

  async createDoctor(req, res, next) {
    const { name, hoursAvailable } = req.body;

    const newDoctor = new Doctor({
      name,
      hoursAvailable,
    });

    newDoctor
      .save()
      .then(() => {
        res.locals.newDoctor = newDoctor;
        next();
      })
      .catch((err) => {
        return { err: `failed to create new Doctor` };
      });
  },

  async getDoctors(req, res, next) {
    console.log("fetched doctors");

    await Doctor.find().then((data) => (res.locals.doctors = data));
    next();
  },

};

module.exports = { userController };
