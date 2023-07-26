/* eslint-disable no-unused-vars */
const { Medication, Patient, User } = require('../models/models');

// create post method to create a patient
// create put method to update  a patient in a user
const dashboardController = {

    async createPatient(req, res, next) {
        console.log(req.body);
        const { update, email } = req.body;
        console.log('entered create patient')  
        
           await User.findOneAndUpdate(
              {email: email },
               {patients: update} ,
              { new: true })
            
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
      const { firstName, lastName, email } = req.body;

      try {
        const user = await User.findOne({email});

        if (!user) {
          throw new Error ('Patient not found');
        }
      
      // Find the patient in the user's patients array
      const patientIndex = user.patients.findIndex(
        (patient) => patient.firstName === firstName && patient.lastName === lastName
      );

      if (patientIndex === -1) {
        console.log('Patient could not be found.');
        return next();
      }

      // Remove the patient from the patients array using splice
      await User.updateOne(
        { _id: user._id },
        { $pull: { patients: { firstName: firstName, lastName: lastName } } }
      );
      
      const updatedUser = await user.save();
      
      const newPatientsArray = updatedUser.patients; 
      // console.log(newPatientsArray);
      res.json(newPatientsArray);
      } 

      catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Server error' });
      }
    },
};

module.exports = { dashboardController }
