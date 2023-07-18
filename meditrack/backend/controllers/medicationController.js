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
    }
};

module.exports = { medicationController }
