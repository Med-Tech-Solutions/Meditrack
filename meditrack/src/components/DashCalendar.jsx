import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfDay, endOfDay, startOfWeek, getDay } from 'date-fns';
import DatePicker from 'react-datepicker';

import CustomToolbar from './CustomToolbar';

const DashCalendar = props => {

  const {
    email,
    events,
    newEvent,
    allEvents,
    selectedEvents,
    patientsArray,
    selectedPatient,
    selectedDate,
    localizer,
    handlePatientSelection,
    handleAddEvent,
    // handleDeleteEvent
  } = props;

  
    
  return (
      <Calendar
        view='day'
        localizer={localizer}
        events={selectedEvents}
        activeStartDate={selectedDate}
        startAccessor="start"
        endAccessor="start"
        showNeighboringMonth={false}
        toolbar={<CustomToolbar />}
        style={{
          display:'flex',
          justifyContent:'center',

          height: 325,
          // width: 900,
          marginTop:'0',
          // marginLeft: '20%',
          // marginRight: '20%',
          '.rbc-btn-group': {
            display: 'none',
            whiteSpace: 'nowrap',
          }          
          /* Hide the view buttons except for the first button (Day) */
        }}
        components={{
          // Customize the rendering of each event in the calendar
          event: ({ event }) => (
            <div>
              <span>{event.title}</span>
              {/* <button onClick={() => handleDeleteEvent(event)}>Delete</button> */}
            </div>
          ),
        }}
      />
   
  );
  
  
};






//   const events = [
    
//   ];


//   const [newEvent, setNewEvent] = useState({ title: "", start: null });
//   const [allEvents, setAllEvents] = useState(events);
//   const [selectedEvents, setSelectedEvents] = useState([]);
//   const [patientsArray, setPatientsArray] = useState([]);
//   const [selectedPatient, setSelectedPatient] = useState([]);
//   const [selectedDate, setSelectedDate] = useState(new Date());

//   // Request User's data from the database
//   useEffect( () => {
//     setSelectedDate(new Date());
//     const email = localStorage.getItem('email');
//     fetch(`/api/dashboard/${email}`)
//     .then((data) => data.json()) 
//     .then((data) => {
//       // Update the state patientsArray variable with the User's patientsArray property
//         setPatientsArray(data.patients);
//         // Store an events array full of the medication logs of each patient
//         const events = data.patients.reduce((acc, patient) => {
//           // Adds the array returned from map to the accumulator array parameter
//           return acc.concat(
//             // Iterates over the medicationLog for each patient and stores relevant information in an object
//             patient.medicationLog.map((log) => ({
//               title: log.medication,
//               start: new Date(log.date),
//               patientFirstName: patient.firstName,
//             }))
//           );
//         }, []);
//         // Update the state variable with the newly initialized events array
//         setAllEvents(events);
//     })
//     .catch(() => console.log("got nothing"))

// }, []);

//   const locales = {
//     "en-US": require("date-fns/locale/en-US")
//   };

//   const localizer = dateFnsLocalizer({
//     format,
//     parse,
//     startOfWeek,
//     getDay,
//     locales
//   });


//   const handlePatientSelection = (patient) => {
//     // Update the state selectedPatient variable with the patient value selected by the User
//     setSelectedPatient(patient);

//     // Return an array of events from the allEvents state variable relevant to the selected patient
//     const filteredEvents = allEvents.filter((event) => event.patientFirstName === patient.firstName);

//     // Update the selectedEvents state variable with the newly initialized array
//     setSelectedEvents(filteredEvents);
//   };

//   function handleAddEvent() {
//     if (!newEvent.title || !newEvent.start) {
//       return;
//     }
  
//     // Package data that will be sent to the backend in an update
//     const eventPayload = {
//       medication: newEvent.title,
//       date: newEvent.start,
//     };
  
//     // Update allEvents
//     setAllEvents([...allEvents, newEvent]);
  
//     // Update selectedEvents
//     setSelectedEvents([...selectedEvents, {
//       title: newEvent.title,
//       start: newEvent.start,
//       patientFirstName: selectedPatient.firstName,
//     }]);
  
//     const email = localStorage.getItem('email');
    
//     // Update the patientsArray state variable
//     // setPatientsArray(...update);
    
//     // Initialize temp variable to send to backend to update the User's document
//     let update = [...patientsArray];
//     fetch(`/api/dashboard/${email}`)
//       .then((data) => data.json())
//       .then((data) => {
//         update = [...data.patients];
//         for (let i = 0; i < update.length; i++) {
//           if (update[i].firstName === selectedPatient.firstName) {
//             update[i].medicationLog.push(eventPayload);
//           }
//         }
//       });
//         console.log('update', update);

//     // Send the update to the backend
//     fetch('/api/dashboard/patient', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({ email, update })
//     })
//       .then(response => response.json())
//       .then(data => {
//         setNewEvent({ title: '', start: null });
//       })
//       .catch(error => {
//         console.error("Could not process POST request");
//       });
//   };
  

export default DashCalendar;