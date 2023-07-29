const express = require("express");
// const dotenv = require('dotenv').config();
const { userController } = require("./controllers/userController");
const { dashboardController } = require("./controllers/dashboardController");
const { medicationController } = require("./controllers/medicationController");
const port = 3000;
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { User } = require("./models/models");
const path = require('path'); 

//needed to upload and save image to database 
const uuidv4 = require('uuid/v4');
const multer = require('multer');
const DIR = './public/userphotos';
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

// const client = require('twilio')('AC08ded748a1d1c45ddbc34311218ad235', '35646b7d7c1f32510417fefe5e00412b');

mongoose.connect(
  "mongodb+srv://meditracker:NTSWSvmP7w04CT72@meditracker.y5vjxra.mongodb.net/",
  { useNewUrlParser: true, useUnifiedTopology: true }
);
mongoose.connection.once("open", () => {
  console.log("Connected to Database");
});

const app = express();
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:8080"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.set("view engine", "ejs");
// app.use('/public/userphotos', express.static(path.resolve(__dirname, '../public/userphotos')));
app.use("/public", express.static(path.join(__dirname, "public")));

// app.get(
//   "/dashboard/:email",
//   // userController.checkSession,
//   // userController.createSession,
//   userController.getPatients,
//   (req, res) => {
//     res.status(200).json(res.locals.user);
//   }
// );

app.get(
  "/api/dashboard/:email",
  userController.checkSession,
  userController.createSession,
  userController.getPatients,
  (req, res) => {
    res.status(200).json(res.locals.user);
  }
);



app.post("/api/signup", userController.createUser, (req, res) => {
  console.log("attempted to create user");
  res.status(200).json(res.locals.newUser);
});

app.post(
  "/api/login",
  userController.getUser,
  userController.createSession,
  (req, res) => {
    res.status(200).json(res.locals.user);
  }
);

//update user
app.put("/api/dashboard/:email", userController.updateUser, (req, res) => {
  res.status(200).json({ message: "User updated!" });
});

app.delete("/api/delete/:email", userController.deleteUser, (req, res) => {
  res.status(200).json({ message: "User deleted!" });
});

// logout
// app.use("api/logout", userController.logout, (req, res) => {
//   return res.status(200).json({ message: "User is logged out" });
// });

//Routes for patient

app.post(
  "/api/dashboard/patient",
  userController.checkSession,
  userController.createSession,
  dashboardController.createPatient,
  (req, res) => {
    return res.status(200).json(res.locals.loggedin);
  }
);

app.get(
  "/api/dashboard/:firstName",
  dashboardController.getPatient,
  (req, res) => {
    res.status(200).json({ message: "Patient created!" });
  }
);

app.delete(
  "/api/dashboard/delete/:firstName",
  dashboardController.deletePatient,
  (req, res) => {
    res.status(200).json({ message: "Patient deleted!" });
  }
);

app.get("/api/doctor", userController.getDoctors, (req, res) => {
  res.status(200).json(res.locals.doctors);
});

app.post("/api/doctor", userController.createDoctor, (req, res) => {
  res.status(200).json({ message: "Doctor created!" });
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

app.post('/api/patientspage/upload/', upload.single('profileImg'), async (req, res) => {
  const { email, firstName, lastName, age, weight } = req.body;

  if (!email || !firstName || !lastName || !age || !weight) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Create an object with the fields that need to be updated
  const updateFields = {};

  if (req.file) {
    // Construct the image URL using the static middleware
    updateFields['patients.$.profileImg'] = '/public/userphotos/' + req.file.filename;
    console.log(updateFields);
  }

  try {
    // Find the user by email and update the fields
    const updatedUser = await User.findOneAndUpdate( { email, 'patients.firstName': firstName, 'patients.lastName': lastName },
    updateFields,
    { omitUndefined: true, new: true });

    if (!updatedUser) {
      throw new Error('User not found');
    }

    // Find the patient in the user's patients array
    const patientIndex = updatedUser.patients.findIndex(
      (patient) => patient.firstName === firstName && patient.lastName === lastName
    );

    if (patientIndex === -1) {
      console.log('Patient could not be found.');
      return res.status(404).json({ error: 'Patient not found' });
    }
    console.log(updatedUser.patients[patientIndex].profileImg)
    // Save the updated user to the database
    // await updatedUser.save();

    console.log(updatedUser);
    res.status(200).json({
      message: 'Image uploaded successfully!',
      profileImg: updatedUser.patients[patientIndex].profileImg,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/patientspage/delete/:email', medicationController.deleteMedication, (req, res) => {
  res.status(200).json({message: 'Medication deleted!'})
})

app.use((err, req, res, next) => {
  const defaultErr = {
    log: "Express error handler caught unknown middleware error",
    status: 400,
    message: { err: "An error occurred" },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

app.listen(port, () => console.log(`Server running on ${port}`));
