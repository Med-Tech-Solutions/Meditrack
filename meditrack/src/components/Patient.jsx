import React, { useState } from 'react';
import MedList from './MedList';
import { startTransition } from 'react';

const Patient = ({ firstName, lastName, age, weight, medications }) => {
  const [addMeds, setAddMeds] = useState(false);
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [week, setWeek] = useState('');
  const [frequency, setFrequency] = useState('');
  const [directions, setDirections] = useState('');
  const [showMeds, setShowMeds] = useState(false);
  const [medListKey, setMedListKey] = useState(0);
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const [checkedState, setCheckedState] = useState(
    new Array(days.length).fill(true)
  );

  const handleShowMeds = (e) => {
    e.preventDefault();
    setShowMeds((prevShowMeds) => !prevShowMeds);
  };

  const handleAddClick = () => {
      // Toggle the value of addMeds
      setAddMeds((prevAddMeds) => !prevAddMeds);
  };

  //loop over checkedState array using map method; if the value of the passed position parameter matches with the current index, then we reverse its value. 
  const handleOnChange = (position) => {
    const updatedCheckState = checkedState.map((item, index) => 
      index === position ? !item : item
      );

  setCheckedState(updatedCheckState);

  const daysArray = [];

  const daysMedicine = (arr) => {
    for (let i=0; i<arr.length; i++){
      if (arr[i] === true ) {
        daysArray.push(days[i]);
      }
    }
    return daysArray; 
  }
  
  const daysString = (array) => {
    return array.join(', '); 
  }

  const daysArrays = daysMedicine(updatedCheckState); 
  const selectedDays = daysString(daysArrays);
  setWeek(selectedDays);
};

  const handleAddMed = () => {
    
    // Update 
    const email = localStorage.getItem('email');

    // Package state variables into a medication object that will be sent to backend
    //7/19 -> DK updating medication object to be more specific about timing. 
    const medication = {
      name,
      dosage,
      week,
      frequency,
      directions,
    };

    // Request User data from database
    fetch(`/api/dashboard/${email}`)
      .then((data) => data.json())
      .then((data) => {
        console.log(data);
        // Locate patient in User obj by iterating over the patientsArray property
        const update = data.patients.map((patient) => {
          // While iterating over obj, if the patient first name is the same as the passed-in prop 'firstName', then return this patient with an updated medications array
            // Medications array should contain all previous information as well as the recently intialized medication object
          if (patient.firstName === firstName) {
            return {
              ...patient,
              medications: [...patient.medications, medication],
            };
          }
          return patient;
        });

        // Send the update to the backend to update the User's collection
        fetch(`/api/dashboard/patient`, {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify({ email, update }),
        })
          .then((data) => {
            console.log(data);
          })
          .catch((error) => console.log(error));
      })
      .catch(() => console.log('got nothing'));

    // setMedListKey((prevKey) => prevKey + 1);

    // Reset state variables
    setName('');
    setCheckedState(new Array(days.length).fill(true))
    setWeek('');
    setDosage('');
    setFrequency('');
    setDirections('');
  };

  return (
    <div className="patient">
      <h4>
        {firstName} {lastName}
      </h4>
      <p>Age: {age}</p>
      <p>Weight: {weight}</p>
      <button className="show-meds" onClick={handleShowMeds}>
        {/* Conditionally renders the following string in the button */}
        {showMeds ? 'Hide Medications' : 'Show Medications'}
      </button>
      {/* If showMeds is true, then render a MedList component */}
      {showMeds && <MedList key={medListKey} medications={medications} firstName={firstName}/>}
      <br />
      <button className="add-med" onClick={handleAddClick}>
        {addMeds ? 'Hide Add Medications' : 'Add Medications'}  
      </button>
      {addMeds && (
        // Updating this form-container to include start date, dosage - add units?, days of the week taking it, frequency per day (turn into dropdown?), specific times to take the medication 
        <div className="form-container">
          <form
            className="form-input"
            onSubmit={(event) => {
              event.preventDefault();
              handleAddMed();
            }}
          >
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {/* change font color of weekly overview? */}
            {/* added the checkboxes for the patient form; instead of hard-coding, could probably use map to iterate over the days array */}
            <div className = "weekCheck">
              Weekly Overview
              <br></br>
              <input
              type="checkbox"
              value="Sunday"
              checked={checkedState[0]}
              onChange={() => handleOnChange(0)}
            /> Sun
              <input
              type="checkbox"
              value="Monday"
              checked={checkedState[1]}
              onChange={() => handleOnChange(1)}
            /> Mon
             <input
              type="checkbox"
              value="Tuesday"
              checked={checkedState[2]}
              onChange={() => handleOnChange(2)}
            /> Tue
             <input
              type="checkbox"
              value="Wednesday"
              checked={checkedState[3]}
              onChange={() => handleOnChange(3)}
            /> Wed
             <input
              type="checkbox"
              value="Thursday"
              checked={checkedState[4]}
              onChange={() => handleOnChange(4)}
            /> Thu
             <input
              type="checkbox"
              value="Friday"
              checked={checkedState[5]}
              onChange={() => handleOnChange(5)}
            /> Fri
             <input
              type="checkbox"
              value="Saturday"
              checked={checkedState[6]}
              onChange={() => handleOnChange(6)}
            /> Sat
              </div>
            <input
              type="text"
              placeholder="Dosage"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
            />
            <input
              type="text"
              placeholder="Frequency"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
            />
            {/* <input
              type="text"
              placeholder="specific times - click as many as you need per day? "
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
            /> */}
            <input
              type="text"
              placeholder="Directions"
              value={directions}
              onChange={(e) => setDirections(e.target.value)}
            />
            <br />
            <input type="submit" />
          </form>
        </div>
      )}
    </div>
  );
};

export default Patient;
