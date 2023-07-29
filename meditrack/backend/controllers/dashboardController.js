/* eslint-disable no-unused-vars */
const { Medication, Patient, User } = require('../models/models');

// create post method to create a patient
// create put method to update  a patient in a user
const dashboardController = {

    async createPatient(req, res, next) {
        if (res.locals.loggedin === false) {
          return next();
        }

        console.log("====== dashboardController.createPatient: ", req.body);
        const { update, email } = req.body;
        console.log('entered create patient')  
        
      
          await User.findOneAndUpdate(
            { email: email },
            { patients: update },
            { new: true }
          );
            
            return next();
          
      },

    async getPatient(req, res, next) {
        const { firstName } = req.params;
        Patient.findOne({ firstName: firstName }) //include lastName here also?
        .then((Patient) => {
          if  (!Patient)
            return res.status(400).json({ error: 'Error in PatientModel.getPatient: Could not find Patient'});
          console.log("Couldn't find patient!")
          res.locals.Patient = Patient
          next()    
        })
        .catch((err) => {
          return next(err)
        })
    },

    async deletePatient(req, res, next) {
      const { firstName } = req.params;
      const data = await Patient.deleteOne({ firstName: firstName}); // returns {deletedCount: 1}
      console.log(data)
      if (data.deletedCount === 0) return next(400);
      if (data) return next();
    },
};

module.exports = { dashboardController }
