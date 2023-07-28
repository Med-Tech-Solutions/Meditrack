import React, {useEffect, useState, useContext} from 'react';
import {PatientContext} from './PatientContext'
import Cookies from "js-cookie";

//onPatientClick is a prop that is passed down from PatientsPage
  const PatientRoster = ({ onPatientClick }) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [age, setAge] = useState("");
    const [weight, setWeight] = useState("");
    const { patientsArray, setPatientsArray} = useContext(PatientContext);
    const [show, setShow] = useState(false);
    
    const name = Cookies.get("name");
    const email = Cookies.get("email");

    //add patient button visibility
    const addPatientButton = show ? "Minimize Window" : "Add Patient";
    
    const createRoster = () => {
        return patientsArray.map((patient) => {
            return <li key={patient._id} className="roster" onClick={() => onPatientClick(patient)}>{patient.firstName} {patient.lastName}</li>
        })
    }
    //when the names are clicked, change the state of the component patientCard so that it renders the data based on the onClick.

    const toggleShow = () => {
        setShow(!show);
    };

    const handleAddPatient = () => {
        console.log(patientsArray);
        // Initialize an array 'update' to be equal to what is stored in the state patientsArray variable
        let update = [...patientsArray];

        // Push relevant state variables to the update array
        update.push({
            firstName,
            lastName,
            age,
            weight
        });

        // Send the updated data to the backend to be added to the patched to the 
        fetch(`/api/dashboard/patient`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ email, update })
        }).then((data => {
            reloadPatients();
        }))
    }

    const reloadPatients = () => {
        // const email = localStorage.getItem('email');
        fetch(`/api/dashboard/${email}`)
        .then((data) => data.json()) 
        .then((data) => {
            // console.log(data);
            setPatientsArray(data.patients);
        })
        // .then(data => console.log("log" ,data))
        .catch(() => console.log("got nothing"))
    }

    return (
    <div className="patient-roster-container">
        
        {/* conditionally render the form based on the show state */}
        {show && (
            <form className="form-input" id="add-patient-form" onSubmit={(event) => {
                event.preventDefault();
                handleAddPatient();
                }}>

                <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e)=>setFirstName(e.target.value)}
                >
                </input>
                <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e)=>setLastName(e.target.value)}
                >
                </input>
                <input
                type="text"
                placeholder="Age"
                value={age}
                onChange={(e)=>setAge(e.target.value)}
                >
                </input>
                <input
                type="text"
                placeholder="Weight"
                value={weight}
                onChange={(e)=>setWeight(e.target.value)}
                >
                </input><br></br>
                <input type="submit"></input>
            </form>
        )}
        <ul className="patient-roster">
            <button className="toggle-add-patient" onClick={toggleShow}>{addPatientButton}</button>
            <br></br>
            {createRoster()}
        </ul>
      </div>
    );
  };
  
  export default PatientRoster;