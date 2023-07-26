const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const doctorSchema = new mongoose.Schema({
    name: {type: String, require: true},
    hoursAvailable: {type: Array, require: true} 
})

const Doctor = mongoose.model('doctor', doctorSchema)

const futureIntakeSchema = new mongoose.Schema({
    medication: {type : String, require : false},
    dates : { type: [Date], required : true },
    // startDate: {type: Date, required: true},
   })

const FutureIntake = mongoose.model('futureIntake', futureIntakeSchema)

const medicationLogSchema = new mongoose.Schema({
    medication: {type : String, require : false},
    date: { type: Date, required : true },
    notes: {type: String, required : false}
   })

const MedicationLog = mongoose.model('medicationLog', medicationLogSchema)

const medicationSchema = new Schema({
    name: {type: String, required: true},
    week: {type: String, required: true},
    dosage: {type: String, required: true},
    frequency: {type: String, required: true},
    directions: {type: String, required: true},
    sideEffects: {type: String, required: false}, // stretch feature: fetch side effects from api

})

const Medication = mongoose.model('medication', medicationSchema)


const patientSchema = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    age: {type: Number, required: true},
    weight: {type: Number, required: true},
    medications: {type: [medicationSchema], required: false},
    medicationLog : {type: [medicationLogSchema], required : false},
    futureIntake : {type: futureIntakeSchema, required: false},
})

const Patient = mongoose.model('patient', patientSchema)

const userSchema = new Schema({
    // array of patients
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    // age: {type: Number, required: true},
    // weight: {type: Number, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    patients: {type: [patientSchema], required: false},
    role: { type: String, required: true},
    session: {type: String},
    expiration: {type: String}
})

const User = mongoose.model('user', userSchema)


module.exports = {
    Medication,
    Patient,
    User,
    MedicationLog,
    FutureIntake,
    Doctor,
    Event,
}
