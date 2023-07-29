import React, { useState } from 'react';
import MedList from './MedList';

const Patient = ({ firstName, lastName, age, weight, medications }) => {
  const [addMeds, setAddMeds] = useState(false);
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [directions, setDirections] = useState('');
  const [showMeds, setShowMeds] = useState(false);
  const [medListKey, setMedListKey] = useState(0);

  const handleShowMeds = (e) => {
    e.preventDefault();
    setShowMeds((prevShowMeds) => !prevShowMeds);
  };

  const handleAddClick = () => {
    setAddMeds(true);
  };

  const handleAddMed = () => {

    // Update 
    const email = localStorage.getItem('email');

    // Package state variables into a medication object that will be sent to backend
    const medication = {
      name,
      dosage,
      frequency,
      directions,
    };

    // Request User data from database
    fetch(`/api/dashboard/${email}`)
      .then((data) => data.json())
      .then((data) => {
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
        Add Medication
      </button>
      {addMeds && (
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
