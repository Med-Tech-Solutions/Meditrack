import React, { useEffect, useState } from 'react';
import Patient from './Patient';

const MedList = ({onMedClick, medications, firstName, lastName }) => {
    const refresh = () => window.location.reload(true)

    const [user, setUser] = useState(null);
    // const [renderMed, setRenderMed] = useState(false);
      // Function to fetch the user data and update the state
    const fetchUserData = () => {
    const email = localStorage.getItem('email');
    fetch(`/api/dashboard/${email}`)
      .then((response) => response.json())
      .then((data) => {
        setUser(data); // Update the state with the user data
      })
      .catch((error) => console.log('Error fetching user data:', error));
    };

    useEffect(() => {
    fetchUserData(); // Fetch the user data when the component mounts
  }, []);

    // const toggleShow = () => {
    //      setRenderMed(!renderMed);
    // };

    const handleDeleteClick = (val) => {
    //     //how do i handle state when deleting? should this delete button be moved somehow to a component that makes more sense? but then how would i know which medicine it's associated with? How can i pass in props???

    const email = localStorage.getItem('email');
    const medName = val;

        fetch(`/api/patientspage/delete/${email}`, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ firstName, lastName, medName, email})
        })
        .then((response) => response.json()) 
        .then((data) => {
            // console.log(data);
            console.log(`${medName} has been deleted!`)
            setUser(data);
            refresh();
        })
        // .then(data => console.log("log" ,data))
        .catch(() => console.log("Could not delete medication."))
    }
    //     //locate the specific patient within the patients array who needs to have their medication removed. 
    //     //remove the medication from the 'medications' array (splice?)
    //     //save the updated user document back to the database
    //     //create a filter method that accurately grabs the data. 
    //     //where email = localStorage.getItem('email')
    //     console.log(localStorage.email);
    //     console.log(val)
    // };

    // const handleDeleteClick = () = {
    //     //delete medication from the database according to the user; 

    // }
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

    return (
        <div>
          {!medications.length && <span className="no-meds">No Medications to Show</span>}
          {medications.length > 0 && (
            <div className="medication-grid">
              {medications.map((medication) => (
                <div key={medication.name} className="medication-item">
                  <div className="med-name" onClick={() => onMedClick(medication)}>{medication.name}</div>
                  <button className="delete-med" onClick={() => handleDeleteClick(medication.name)}>
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    };
    
export default MedList;
//     return(
//         <div className="med-list">
//             {!medications.length && <span className="no-meds">No Medications to Show</span>}
//             {(medications.length > 0) && (<div key={medication.name} className="medication-item">) medications.map((medication) => (
//                 <div key={medication.name}>
//                      <div id="med-name-card">{medication.name}</div>
//                      <button id="delete-card" onClick={() => handleDeleteClick(medication.name)}>Delete Medication</button>
//                 </div>
//                     // {/* <p>Days to Take: {medication.week}</p>
//                     // <p>Dosage: {medication.dosage}</p>
//                     // <p>Frequency: {medication.frequency}</p>
//                     // <p>Directions: {medication.directions}</p> */}
//             )
//             )}
//         </div>
//     );
// }

// export default MedList;

// // onClick={handleDeleteClick}