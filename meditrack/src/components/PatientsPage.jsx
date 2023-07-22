import React, {useEffect, useState} from 'react';
import PatientList from './PatientList';

const PatientsPage = props => {
    const [patientsArray, setPatientsArray] = useState([]);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [age, setAge] = useState("");
    const [weight, setWeight] = useState("");
    const email = localStorage.getItem('email');
    const name = localStorage.getItem('firstName');

    // Obtain the User's data from the database
    useEffect( () => {
        const email = localStorage.getItem('email');
        fetch(`/api/dashboard/${email}`)
        .then((data) => data.json()) 
        .then((data) => {
            setPatientsArray(data.patients);
        })
        .catch(() => console.log("got nothing"))

    }, []);
    
    const handleAddPatient = () => {
    
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
        const email = localStorage.getItem('email');
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
        <div className = 'dashboard-container' >
            <div className="patients-container">
            {patientsArray && <PatientList className="patients-list" patients = { patientsArray } handleAddPatient={handleAddPatient}></PatientList>}
            </div>
            <form className="form-input" id="add-patient-form" onSubmit={(event) => {
                event.preventDefault();
                handleAddPatient();
                }}>
                <span className="add-patient">Add Patient</span>
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
        </div>
    );
};

export default PatientsPage;