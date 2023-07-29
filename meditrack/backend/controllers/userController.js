/* eslint-disable no-unused-vars */
const { Medication, Patient, User, Doctor } = require('../models/models');

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
      return next({err : "Error ccreating a new user, missing first name, last name, email, or password"}) //JB

      // const userExists = await User.findOne({ email })



      User.findOne({ email: email })
      .then((user)=>{
        if (user) {
          // res.status(400)
          // throw new Error('User already exists')
          return next({err: 'User already exists'});
        } else {
          const newUser = new User({
            firstName,
            lastName,
            email,
            password,
          });
      
          newUser.save()
            .then(() => {
              res.locals.newUser = newUser;
              next();
              // res.status(200).json(newUser);
            })
            .catch((err) => {
              return {err: `failed to create new user, ${err}`};
            });
        }
          // console.log("Result :", user);
      })
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
    if (!email || !password) return next({err: 'incorrect credentials'});
    User.findOne({ email: email, password: password })
    .then((user) => {
      if (!user) return next({ err: 'Error in userModel.getuser: Could not find user'});
      else {
        console.log("Successfully logged in!")
      res.locals.user = user;
      return next();
      }
    })
    .catch((err) => {
      return next({err: 'err occurred while logging in'});
    })
  
  },

  async getPatients(req, res, next) {
    const { email } = req.params;
    User.findOne({ email: email })
    .then((user) => {
      if  (!user)
        return next({ err: 'Error in userModel.getuser: Could not find user'});
      console.log("Get patients fired!")
      res.locals.user = user;
      // console.log(res.locals.userPatients);
      return next();
    })
  },

  //update user

  async updateUser(req, res, next) {
    console.log(req.body);
    const { firstName, lastName, email, password } = req.body;
    console.log('entered update user')  
   
    const update = {
      firstName,
      lastName,
      email,
      password
    }

    try{
      await User.findOneAndUpdate(
          {email: email },
           update,
          { new: true })
        return next();
    }
    catch(err){
      return next({err : `Error creating a new patient, ${err}`});
    }
       
      
  },

  async deleteUser(req, res, next) {
    const { email } = req.params;
    const data = await User.deleteOne({ email: email}); // returns {deletedCount: 1}
    console.log(data)
    if (data.deletedCount === 0) return next({err : "Error deleting user"});
    if (data) return next();
  },

  async createDoctor(req, res, next) {
    const { name, hoursAvailable } = req.body;
    
    const newDoctor = new Doctor({
      name,
      hoursAvailable,
    });

    newDoctor.save()
            .then(() => {
              res.locals.newDoctor = newDoctor;
              next();
            })
            .catch((err) => {
              return {err: `failed to create new Doctor`};
            });
  },

  async getDoctors(req, res, next) {
    console.log('fetched doctors');

    await Doctor.find()
    .then(data => res.locals.doctors = data);
    next();
  }

};

module.exports = { userController };
