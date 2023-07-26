const express = require('express');
// const dotenv = require('dotenv').config();
const { userController } = require('./controllers/userController')
const { dashboardController } = require('./controllers/dashboardController')
const { medicationController } = require('./controllers/medicationController')
const port = 3000;
const mongoose = require('mongoose');
// const client = require('twilio')('AC08ded748a1d1c45ddbc34311218ad235', '35646b7d7c1f32510417fefe5e00412b');

mongoose.connect('mongodb+srv://meditracker:NTSWSvmP7w04CT72@meditracker.y5vjxra.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.once('open', () => {
  console.log('Connected to Database');
});

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/api/dashboard/:email', userController.getPatients, (req, res) => {
    res.status(200).json(res.locals.user);
})

app.post('/api/signup', userController.createUser, (req, res) => {
  console.log('attempted to create user');
    res.status(200).json(res.locals.newUser);
})

app.post('/api/login', userController.getUser, (req, res) => {
  res.status(200).json(res.locals.user);
})

//update user
app.put('/api/dashboard/:email', userController.updateUser, (req, res) => {
    res.status(200).json({message: 'User updated!'})
})

app.delete('/api/delete/:email', userController.deleteUser, (req, res) => {
    res.status(200).json({message: 'User deleted!'})
})

//Routes for patient

app.post('/api/dashboard/patient', dashboardController.createPatient, (req, res) => {
  res.status(200).json({message: 'Patient created!'})
})

app.get('/api/dashboard/:firstName', dashboardController.getPatient, (req, res) => {
  res.status(200).json({message: 'Patient created!'})
})

app.delete('/api/dashboard/delete/:firstName', dashboardController.deletePatient, (req, res) => {
  res.status(200).json({message: 'Patient deleted!'})
})

app.get('/api/doctor', userController.getDoctors, (req, res) => {
  res.status(200).json(res.locals.doctors);
});

app.post('/api/doctor', userController.createDoctor, (req, res) => {
  res.status(200).json({message: 'Doctor created!'});
});


// function sendTextMessage() {
//   client.message.create({
//     body: 'Hello from Node',
//     to: '',
//     from: '+18337581251'
//   }).then(message => console.log(message));
// }


//Routes for medication
// app.post('/api/dashboard/medication', medicationController.createPatient, (req, res) => {
//   res.status(200).json({message: 'Medication created!'})
// })

// app.get('/api/dashboard/:firstName', medicationController.getPatient, (req, res) => {
//   res.status(200).json({message: 'Medication Retrieved!'})
// })

// app.delete('/api/dashboard/delete/:firstName', medicationController.deletePatient, (req, res) => {
//   res.status(200).json({message: 'Medication deleted!'})
// })


app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 400,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

app.listen(port, () => console.log(`Server running on ${port}`));
