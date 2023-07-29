import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { useNavigate } from 'react-router-dom';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import DatePicker from 'react-datepicker';
import Cookies from 'js-cookie';

const PatientCalendar = props => {


  const events = [
    
  ];


  const [newEvent, setNewEvent] = useState({ title: "", start: null });
  const [allEvents, setAllEvents] = useState(events);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [patientsArray, setPatientsArray] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState([]);

  const navigate = useNavigate();
 // name is for "Welcome, user message on Dashboard" -AG
  const name = Cookies.get("name");
  const email = Cookies.get("email");

  // Request User's data from the database
  useEffect( () => {

    if (!email) {
      navigate("/login");
    }

    fetch(`/api/dashboard/${email}`)
    .then((data) => data.json()) 
    .then((data) => {
      // Update the state patientsArray variable with the User's patientsArray property
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
              _id: log._id,
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
  

  function handleAddEvent() {

    if (!newEvent.title || !newEvent.start) {
      return;
    }
  
    // Package data that will be sent to the backend in an update
    const eventPayload = {
      medication: newEvent.title,
      date: newEvent.start,
    };
    console.log(eventPayload);
    // Update allEvents
    setAllEvents([...allEvents, newEvent]);
  
    // Update selectedEvents
    setSelectedEvents([...selectedEvents, {
      title: newEvent.title,
      start: newEvent.start,
      patientFirstName: selectedPatient.firstName,
    }]);
    
    
    // Initialize temp variable to send to backend to update the User's document
    let update = [...patientsArray];
    console.log('update before fetch', update)
    for (let i = 0; i < update.length; i++) {
      if (update[i].firstName === selectedPatient.firstName) {
        update[i].medicationLog.push(eventPayload);
      }
    }
    
    // Send the update to the backend
    fetch('/api/dashboard/patient', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, update })
    })
      .then(response => response.json())
      .then(data => {
        if (data === false) {
          navigate('/login');
        }
        setNewEvent({ title: '', start: null });
      })
      .catch(error => {
        console.error("Could not process POST request");
      });
  };
  
// Function to handle event deletion
const handleDeleteEvent = (eventToDelete) => {
  let update = [...patientsArray]; //this is update
  let patient;
  for (let i = 0; i < update.length; i++) {
    if (update[i].firstName === eventToDelete.patientFirstName) {
      patient = update[i];
      console.log(patient);
      // console.log('medicationlog id', patient.medicationLog[1]._id, eventToDelete);
      const updatedMedicationLog = patient.medicationLog.filter(
        (event) => event._id !== eventToDelete._id
        //WHAT UNIQUE IDENTIFIERS ARE THERE BETWEEN THE EVENT AND MEDICATION LOGS???
      );
      // const updatedMedicationLog = [];
      patient.medicationLog = updatedMedicationLog;
      update[i] = patient;
      console.log('update before fetch', update);
      break;
      }
  }
  fetch(`/api/dashboard/patient`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      update,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to delete event from the database.");
      }
      return response;
    })
    .then((result) => {
      return result.json()
    })
    .then((result) => {
      if (result === false) {
        navigate('/login');
      }
      // Update the allEvents state after the successful DELETE request.
      console.log('update after fetch', update)
      const updatedAllEvents = allEvents.filter((event) => event !== eventToDelete);
      const updatedSelectedEvents = selectedEvents.filter((event) => event !== eventToDelete);
      setAllEvents(updatedAllEvents);
      setSelectedEvents(updatedSelectedEvents);
    })
    .catch((error) => {
      console.error(error);
    });
};  
  return (
    <div className="med-calendar-container" style={{minHeight: "87vh"}}>
      <h1>Medicine Dosage Log</h1>
  
      <div>
        <h2 className="select-patient-header">Select Patient</h2>
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
  
      {selectedPatient && selectedPatient.medications && (
        <>
          <h2 className="log-meds">Log Medication</h2>
          <div>
            <select className="select-medication"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            >
              <option value="">Select Medication</option>
              {selectedPatient.medications.map((medication) => (
                <option key={medication.name} value={medication.name}>{medication.name}</option>
              ))}
            </select>
            <div className="date-picker" style={{ position: 'relative', zIndex: 9999 }}>
              <DatePicker
                placeholderText='Date and Time'
                showTimeSelect
                dateFormat="Pp"
                style={{ marginRight: "10px", marginBottom: "10px" }}
                selected={newEvent.start}
                onChange={(start) => 
                  setNewEvent({ ...newEvent, start })
                //   .fetch(`/api/adduserevents/${email}`, {
                //     method: "POST",                    // declares HTTP request method
                //     headers: {
                //       "Content-Type": "application/json"    // declares format of data
                //     },
                //     body: JSON.stringify(newEvent)
                // })
                    }
                />
            </div>
            <button className="med-cal-btn" style={{ marginTop: "10px" }} onClick={handleAddEvent}>Add Event</button>
          </div>
        </>
      )}
  
      <Calendar
        localizer={localizer}
        events={selectedEvents}
        startAccessor="start"
        endAccessor="start"
        style={{ 
          height: 500, 
          margin: "50px",
        }}
        components={{
          // Customize the rendering of each event in the calendar
          event: ({ event }) => (
            <div>
              <span>{event.title}</span>
              <button onClick={() => handleDeleteEvent(event)}>Delete</button>
            </div>
          ),
        }}
      />
    </div>
  );
  
  
};

export default PatientCalendar;
