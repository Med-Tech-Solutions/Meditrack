
import React, {useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';

import Cookies from "js-cookie";

import DashCalendar from './DashCalendar';
import DashPatient from './DashPatient';

const Dashboard = props => {
  const events = [

  
  ];

  const [selectedPatient, setSelectedPatient] = useState([]);
  const [allEvents, setAllEvents] = useState(events);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [patientsArray, setPatientsArray] = useState([]);


  const navigate = useNavigate();

  // name is for "Welcome, user message on Dashboard" -AG
  const name = Cookies.get("name");
  const email = Cookies.get("email");

  // Obtain the User's data from the database
  useEffect(() => {
    console.log("==== email", email);


    if (!email) {
      navigate("/login");
    }

    fetch(`/api/dashboard/${email}`)
    .then((data) => data.json()) 
    .then((data) => {
      console.log(data);
      // Update the state patientsArray variable with the User's patientsArray property
      if (data === false) {
        navigate("/login"); 
      }
        setPatientsArray(data.patients);
        // Store an events array full of the medication logs of each patient
        const events = data.patients.reduce((acc, patient) => {
          // Adds the array returned from map to the accumulator array parameter
          return acc.concat(
            // Iterates over the medicationLog for each patient and stores relevant information in an object
            patient.medicationLog.map((log) => ({
              title: log.medication,
              start: new Date(log.date),
              patientFirstName: patient.firstName,
            }))
          );
        }, []);
        // Update the state variable with the newly initialized events array
        setAllEvents(events);
    })
    .catch(() => console.log("got nothing"))


}, []);

  const locales = {
    "en-US": require("date-fns/locale/en-US")
  };

  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales
  });


  const handlePatientSelection = (patient) => {
    // Update the state selectedPatient variable with the patient value selected by the User
    setSelectedPatient(patient);

    // Return an array of events from the allEvents state variable relevant to the selected patient
    const filteredEvents = allEvents.filter((event) => event.patientFirstName === patient.firstName);

    // Update the selectedEvents state variable with the newly initialized array
    setSelectedEvents(filteredEvents);
  };
  
// Function to handle event deletion
const handleDeleteEvent = (eventToDelete) => {
  const email = localStorage.getItem('email');
  let patients = JSON.parse(JSON.stringify(patientsArray)); //this is update
  let patient;
  for (let i = 0; i < patients.length; i++) {
    if (patients[i].firstName === eventToDelete.patientFirstName) {
      patient = patients[i];
      const updatedMedicationLog = patient.medicationLog.filter(
        (event) => event._id !== eventToDelete._id
        //WHAT UNIQUE IDENTIFIERS ARE THERE BETWEEN THE EVENT AND MEDICATION LOGS???
      );
      patient.medicationLog = updatedMedicationLog;
      break;
      }
    patients[i] = patient;
  }
  fetch(`/api/dashboard/${email}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      patients
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to delete event from the database.");
      }
      // Update the allEvents state after the successful DELETE request.
      const updatedEvents = allEvents.filter((event) => event !== eventToDelete);
      setAllEvents(updatedEvents);

    })
    .catch((error) => {
      console.error(error);
    });
}; 

    const dashCalendarProps = {
      events,
      allEvents,
      selectedEvents,
      patientsArray,
      selectedPatient,
      localizer,
      handlePatientSelection,
      handleDeleteEvent

  };

    return (
      <div className = 'dashboard-container' >
        <h1>hi</h1>
        <section className='dashboard-calendar' style={{
          marginLeft:'20%',
          marginRight:'20%',
          height:400
          }}>
          <div className='patient-select' style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop:'3%',
            marginBottom:'0',
            // marginLeft:'47%'
            }}>
            <select className="select-patient"
              value={selectedPatient?.firstName || ''}
              onChange={(e) => handlePatientSelection(patientsArray.find(p => p.firstName === e.target.value))}
            >
              <option value="">Select Patient</option>
              {patientsArray.map((patient) => (
              <option key={patient.firstName} value={patient.firstName}>{patient.firstName}</option>
              ))}
            </select>
          </div>
          <DashCalendar 
              localizer={localizer}
              events={selectedEvents} // Pass the allEvents array to populate the calendar with events
              {...dashCalendarProps}
              
          />
          </section>
        <section className="dash-lists" style={{
          display:'flex',
          marginLeft:'20%',
          marginRight:'20%'
        }}>
          <DashPatient />
        </section>
        
      </div>
    );
  }

export default Dashboard;


        // const [patientsArray, setPatientsArray] = useState([]);
    // const [firstName, setFirstName] = useState("");
    // const [lastName, setLastName] = useState("");
    // const [age, setAge] = useState("");
    // const [weight, setWeight] = useState("");
    // const email = localStorage.getItem('email');
    // const name = localStorage.getItem('firstName');

    // // Obtain the User's data from the database
    // useEffect( () => {
    //     const email = localStorage.getItem('email');
    //     fetch(`/api/dashboard/${email}`)
    //     .then((data) => data.json()) 
    //     .then((data) => {
    //         setPatientsArray(data.patients);
    //     })
    //     .catch(() => console.log("got nothing"))

    // }, []);
    
    // const handleAddPatient = () => {
    
    //     // Initialize an array 'update' to be equal to what is stored in the state patientsArray variable
    //     let update = [...patientsArray];

    //     // Push relevant state variables to the update array
    //     update.push({
    //         firstName,
    //         lastName,
    //         age,
    //         weight
    //     });

    //     // Send the updated data to the backend to be added to the patched to the 
    //     fetch(`/api/dashboard/patient`, {
    //         method: 'POST',
    //         headers: {
    //             'Content-type': 'application/json'
    //         },
    //         body: JSON.stringify({ email, update })
    //     }).then((data => {
    //         reloadPatients();
    //     }))
    // }

    // const reloadPatients = () => {
    //     const email = localStorage.getItem('email');
    //     fetch(`/api/dashboard/${email}`)
    //     .then((data) => data.json()) 
    //     .then((data) => {
    //         // console.log(data);
    //         setPatientsArray(data.patients);
    //     })
    //     // .then(data => console.log("log" ,data))
    //     .catch(() => console.log("got nothing"))
    // }


    // return (
    //     <div className = 'patient-add' >
    //         <DashCalendar />
    //         <h2>Welcome, {name}!</h2>
    //         <h3 className="patients-header">Patients</h3>
    //         <div className="patients-container">
    //         {patientsArray && <PatientList className="patients-list" patients = { patientsArray } handleAddPatient={handleAddPatient}></PatientList>}
    //         </div>
    //         <form className="form-input" id="add-patient-form" onSubmit={(event) => {
    //             event.preventDefault();
    //             handleAddPatient();
    //             }}>
    //             <span className="add-patient">Add Patient</span>
    //             <input
    //             type="text"
    //             placeholder="First Name"
    //             value={firstName}
    //             onChange={(e)=>setFirstName(e.target.value)}
    //             >
    //             </input>
    //             <input
    //             type="text"
    //             placeholder="Last Name"
    //             value={lastName}
    //             onChange={(e)=>setLastName(e.target.value)}
    //             >
    //             </input>
    //             <input
    //             type="text"
    //             placeholder="Age"
    //             value={age}
    //             onChange={(e)=>setAge(e.target.value)}
    //             >
    //             </input>
    //             <input
    //             type="text"
    //             placeholder="Weight"
    //             value={weight}
    //             onChange={(e)=>setWeight(e.target.value)}
    //             >
    //             </input><br></br>
    //             <input type="submit"></input>
    //         </form>
    //     </div>
    // );





// // Send the updated data to the backend to be added to the patched to the
// fetch(`/api/dashboard/patient`, {
//   method: "POST",
//   credentials: "include",
//   headers: {
//     "Content-type": "application/json",
//   },
//   body: JSON.stringify({ email, update }),
// })
//   .then((data) => {
//     return data.json();
//     // reloadPatients();
//   })
//   .then((data) => {
//     console.log("======= handlePatient: ", data);
//     // if data is undefined, then reload patients and don't do update
//     if (data === false) {
//       navigate("/login");
//     } else {
//       // Push relevant state variables to the update array
//       update.push({
//         firstName,
//         lastName,
//         age,
//         weight,
//       });
//       reloadPatients();
//     }
//   })
//   .catch((error) => {
//     console.error("Error: in dashboard post request", error);
//   });
// };

