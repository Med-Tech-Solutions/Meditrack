import React, { useState } from 'react';

const MedList = ({ medications, firstName }) => {

    const [patientsArray, setPatientsArray] = useState([]);

    // TODO: Finish Delete Medication button functionality
    // const deleteMedication = (medName) => {
    //     const email = localStorage.getItem('email')
        
    //     fetch(`/api/dashboard/${email}`)
    //       .then((data) => data.json())
    //       .then((data) => {
    //         setPatientsArray(data.patients);
    //       });
    
    //     //   let update = [...patientsArray];
    //     const updatedMeds = [];
    //     let update = [...patientsArray];
    //     //iterate through patients
    //       for(let i = 0; i < update.length; i++){
    //         //if - this is the patient that we are updating
    //         if(update[i].firstName !== firstName){
    //             //iterate through
    //             for(let y = 0; y < update[i].medications.length; y++){
    //                 if(update[i].medications[y] !== medName){
    //                 updatedMeds.push(update[i].medications[y])
    //             }
    //         }
    //         //replace current medications with updateMeds array
    //         update[i].medications = [...updatedMeds];//can this be done? not sure if patiendsArray can be reassigned;
    //             }
    //       }

    //       console.log(update);

    //     //   make post request to update patientsArray

          
    //       fetch(`/api/dashboard/patient`, {
    //         method: 'POST',
    //         headers: {
    //           'Content-type': 'application/json',
    //         },
    //         body: JSON.stringify({ email, update }),
    //       })
    //         .then((data) => {
    //           console.log(data);
    //         })
    //         .catch((error) => console.log(error));

    // }

    return(
        <div>
            {!medications.length && <span className="no-meds">No Medications to Show</span>}
            {(medications.length > 0) && medications.map((medication) => (
                <div>
                    <p>Name: {medication.name}</p>
                    <p>Dosage: {medication.dosage}</p>
                    <p>Frequency: {medication.frequency}</p>
                    <p>Directions: {medication.directions}</p>
                    <button>Delete Medication</button>
                </div>
            )
            )}
        </div>
    );
}

export default MedList;