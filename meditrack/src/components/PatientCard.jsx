import React, { useState } from 'react';
import MedList from './MedList';
import { startTransition, useContext } from 'react';
import {PatientContext} from './PatientContext';
import MedCard from './MedCard'

const PatientCard = ({ selectedPatient, onHidePatient, onMedClick }) => {
  const [addMeds, setAddMeds] = useState(false);
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [week, setWeek] = useState('');
  const [frequency, setFrequency] = useState('');
  const [directions, setDirections] = useState('');
  const [showMeds, setShowMeds] = useState(false);
  const [medListKey, setMedListKey] = useState(0);
  //for photos?
  const [file, setFile] = useState(null);
//   this state variable holds the selected medicine information
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const [checkedState, setCheckedState] = useState(
    new Array(days.length).fill(false)
  );
  const {patientsArray, setPatientsArray} = useContext(PatientContext);

  const refresh = () => window.location.reload(true)

  const handleShowMeds = (e) => {
    e.preventDefault();
    setShowMeds((prevShowMeds) => !prevShowMeds);
  };

  const handleHidePatient = () => {
    // Call the onHidePatient function passed as a prop to reset the selectedPatient state to null
    onHidePatient();
  };

  const handleAddClick = () => {
      // Toggle the value of addMeds
      setAddMeds((prevAddMeds) => !prevAddMeds);
  };

  const handleMedClick = (medication) => {
    onMedClick(medication);
  };

  //specifically for images
  function handleChange(e) {
    console.log(e.target.files);
    setFile(URL.createObjectURL(e.target.files[0]));
}

const fileUploadHandler = () => {
    //axios request -> post request. 
    //post the request to a certain URL -> 
    //create endpoint to put it into the database
}

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

  //deleting patient
  const handleDeletePatient = (fName, lName) => {
    //we passed in the first and last name of the patient 
    //we have access to the patientArray that holds all of the patients. 
    //send a fetch request to deletePatient
    //'/api/dashboard/delete/:firstName'
    //     //how do i handle state when deleting? should this delete button be moved somehow to a component that makes more sense? but then how would i know which medicine it's associated with? How can i pass in props???
    const email = localStorage.getItem('email');
    const firstName = fName;
    const lastName = lName; 
  
    fetch(`/api/dashboard/delete/${firstName}`, {
              method: 'DELETE',
              headers: {
                  'Content-type': 'application/json'
              },
              body: JSON.stringify({ firstName, lastName, email})
          })
          .then((response) => response.json()) 
          .then((data) => {
              console.log(data);
              console.log(`Patient ${firstName} ${lastName} has been deleted!`)
              setPatientsArray(data);
              refresh();
          })
          // .then(data => console.log("log" ,data))
          .catch(() => console.log("Could not delete patient."))
    }

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
            console.log(medication);
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
    setCheckedState(new Array(days.length).fill(false))
    setWeek('');
    setDosage('');
    setFrequency('');
    setDirections('');
  };
  
  if(!selectedPatient){
    return <div className="patient-text">Click a patient to access their information.</div>;
  }

  const { firstName, lastName, age, weight, medications } = selectedPatient; 
  
  return (
    <div className="patient">
      <h2 id="patient-card-name">
        {firstName} {lastName}
      </h2>
      <h3 id="patient-card-age">
        Age: {age}
        <br></br>
        Weight: {weight}
    </h3>
      <button className="show-meds" onClick={handleShowMeds}>
        {/* Conditionally renders the following string in the button */}
        {showMeds ? 'Hide Medications' : 'Show Medications'}
      </button>
      {/* If showMeds is true, then render a MedList component */}
      <div className="med-card-container">
        {showMeds && <MedList key={medListKey} medications={medications} firstName={firstName} lastName={lastName} onMedClick={handleMedClick}/>}</div>

      <br />
      <button className="add-med" onClick={handleAddClick}>
        {addMeds ? 'Hide Add Medications' : 'Add Medications'}  
      </button>
      <br/>
      <button className="hide-patient" onClick={() => handleHidePatient(firstName, lastName)}> Hide Patient
        </button>
      <button className="del-patient" onClick={() => handleDeletePatient(firstName, lastName)}> Delete Patient
        </button>

            <input type="file" className="image-button" onChange={handleChange} />
            <button onClick={this.fileUploadHandler}>Upload</button>
            <img className = "patient-image" alt="personphoto" src={file} />

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

export default PatientCard;
