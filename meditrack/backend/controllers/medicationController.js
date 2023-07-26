/* eslint-disable no-unused-vars */
const { Medication, Patient, User } = require('../models/models');

const medicationController = {
    // Create a new medication in the database
    async createMedication(req, res, next) {
        const { name, dosage, frequency, directions, sideEffects } = req.body;
        if (!name || !dosage || !frequency || !directions)
            return res.status(400).json({ error: 'Did not receive all the information'});

        Medication.findOne({ name: name })
        .then((Medication)=>{
            if (Medication) {
            res.status(400)
            // throw new Error('Medication already exists')
            return next('Medication already exists');
            } else {
                const newMedication = new Medication({
                    name,
                    dosage,
                    frequency,
                    directions,
                    });

                newMedication.save()
                .then(() => {
                    res.status(200).json(newMedication);
                })
                .catch((err) => {
                    return res.status(400).json({error: 'failed to create new Medication   ' + err});
                });
            }
        })
    },

    //delete a medication from the database 
    async deleteMedication(req, res, next) {
        const { firstName, lastName, medName, email } = req.body;
      
        try {
          const user = await User.findOne({ email });
      
          if (!user) {
            throw new Error('Patient not found');
          }
      
          // Find the patient in the user's patients array
          const patientIndex = user.patients.findIndex(
            (patient) => patient.firstName === firstName && patient.lastName === lastName
          );

          if (patientIndex === -1) {
            console.log('Patient could not be found.');
            return next();
          }
      
          // Use $pull to remove the medication with the given name from the patient's medications array
          await User.updateOne(
            { _id: user._id, 'patients._id': user.patients[patientIndex]._id },
            { $pull: { 'patients.$.medications': { name: medName } } }
          );
      
          // Fetch the updated user after the update operation
          const updatedUser = await User.findById(user._id);

          return res.json(updatedUser);
        } catch (error) {
          console.error('Error deleting medication:', error.message);
          return res.status(500).json({ error: 'Something went wrong.' });
        }
      
    // async deleteMedication(req, res, next) {
    //     const { firstName, lastName, medName, email } = req.body; 
    //     try {
    //         const user = await User.findOne({email}); 
    //         if(!user) {
    //             throw new Error ('Patient not found');
    //             } else {
    //             for (let i=0; i<user.patients.length; i++){
    //                 if (user.patients[i]["firstName"] === firstName && user.patients[i]["lastName"] === lastName) {
    //                     //iterate through the medications array of that patient. 
    //                     user.patients[i].medications = user.patients[i].medications.filter(
    //                         (medication) => medication.name !== medName
    //                         );
    //                  }   
    //                 }
    //             await user.save();
    //             return res.json(user); 

    //             }
    //         } 
    //     catch(error){
    //         console.error('Error deleting medication:', error.message);
    //         return res.status(500).json({ error: 'Something went wrong.' });
    //     }
    // patient's first and last name are entered in the patientPage JSX -> 
    // delete button is attached to each medication; we can pass in email and name of medication currently. 
    //we use email to find the document; and access the patients array; each index of the array is holding an object that contains each patient; need to find the element where the first and last name match; 
    //once we found the correct object; then we look into the medications array; each element of this array is also an object; look for the name of the medication and delete that element of the array
    }
};

module.exports = { medicationController }

// User[patients[i][firstName]] = "davis"