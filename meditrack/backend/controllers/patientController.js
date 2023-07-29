/* eslint-disable no-unused-vars */
const { Medication, Patient, User } = require("../models/models");
//needed to upload and save image to database 
const fs = require ('fs');
const uuidv4 = require('uuid/v4');
const multer = require('multer');
const DIR = './public/';
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, DIR);
  },
  filename: (req, file, cb) => {
      const fileName = file.originalname.toLowerCase().split(' ').join('-');
      cb(null, uuidv4() + '-' + fileName)
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
      if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
          cb(null, true);
      } else {
          cb(null, false);
          return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
      }
  }
});

// create post method to create a patient
// create put method to update  a patient in a user
const dashboardController = {
  async createPatient(req, res, next) {

    console.log(req.body);
    const { update, email } = req.body;
    console.log("entered create patient");
    //add try -catch for error handling JB
    try {

      await User.findOneAndUpdate(
        { email: email },
        { patients: update },
        { new: true }
      );
      return next();
    } catch (err) {
      return next({ err: `Error creating a new patient, ${err}` });
    }
  },

  // async getPatient(req, res, next) {
  //     const { firstName } = req.params;
  //     Patient.findOne({ firstName: firstName }) //include lastName here also?
  //     .then((Patient) => {
  //       if  (!Patient)
  //         return res.status(400).json({ error: 'Error in PatientModel.getPatient: Could not find Patient'});
  //       console.log("Couldn't find patient!")
  //       res.locals.Patient = Patient
  //       next()
  //     })
  //     .catch((err) => {
  //       return next({err : `Error getting patient, ${err}`})
  //     })
  // },

  // async deletePatient(req, res, next) {
  //   const { firstName } = req.params;
  //   const data = await Patient.deleteOne({ firstName: firstName}); // returns {deletedCount: 1}
  //   console.log(data)
  //   if (data.deletedCount === 0) return next(400);
  //   if (data) return next();
  // },
};

module.exports = { dashboardController };
