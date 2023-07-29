import React, {useEffect, useState, useContext} from 'react';
import PatientList from './PatientList';
import {PatientContext} from './PatientContext'
import PatientRoster from './PatientRoster';
import PatientCard from './PatientCard';
import MedCard from './MedCard';
import MedList from './MedList';

const PatientsPage = props => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [age, setAge] = useState("");
    const [weight, setWeight] = useState("");
    const email = localStorage.getItem('email');
    const name = localStorage.getItem('firstName');
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [selectedMed, setSelectedMed] = useState(null);
    const [showMedCard, setShowMedCard] = useState(true);
    const {patientsArray, setPatientsArray} = useContext(PatientContext);
    
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

    const handlePatientClick = (patient) => {
        console.log(patient);
        setSelectedPatient(patient);
    }

    const handleHidePatient = () => {
        setSelectedPatient(null);
      };
    
    //   this is for the med component inside the patient card.
    const handleHideMed = () => {
        setSelectedMed(null);
    } 
    const handleMedClick = (medication) => {
        setSelectedMed(medication);
    }
    //this is the med card component outside patient card
    const handleHideMedCard = () => {
        setSelectedMed(null);
        // setShowMedCard((prevShowMedCard) => !prevShowMedCard);
    }

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
        //declared CreateContext at the top of this component because this component is the parent of patientList, patient, and medlist, so we want to pass down the patientsarray to all of those components; 
        //PatientContext.provider allows us to supply the state value that we want passed down. 
        <div className = 'dashboard-container'>
            <div id = 'patient-roster-container'><PatientRoster onPatientClick={handlePatientClick}></PatientRoster></div>
            <div className="patients-container"><PatientCard selectedPatient={selectedPatient} onHidePatient={handleHidePatient} onMedClick={handleMedClick}></PatientCard></div>
            {selectedMed && showMedCard && (
        <div className="med-card">
          <MedCard selectedMedication={selectedMed} hideMedCard={handleHideMedCard} onHideMed={handleHideMed} />
        </div>
      )}
    </div>
    )
};
        

export default PatientsPage;