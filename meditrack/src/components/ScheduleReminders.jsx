import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';

const ScheduleReminders = () => {
  const [patientsArray, setPatientsArray] = useState([]);
  const [medList, setMedList] = useState([]);
  const [medicationName, setMedicationName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [numDoses, setNumDoses] = useState('');
  const [frequency, setFrequency] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedMedication, setSelectedMedication] = useState(null);



  useEffect(() => {
    // Obtain all of the patients assigned to a user
    const email = localStorage.getItem('email');
    fetch(`/api/dashboard/${email}`)
      .then((data) => data.json())
      .then((data) => {
        setPatientsArray(data.patients);
      })
      .catch(() => console.log('Error fetching patients'));
  }, []);


  const handleEnrollPatient = (e) => {
    e.preventDefault();

    // TODO: Handle patient or medication not selected

    // Generate the dates array
    const email = localStorage.getItem('email');
    const dates = generateDateArray(startDate, numDoses, frequency);
    console.log(dates);


    // Cycle through patients to find the one the user selected
      // Push the selected medication and intake schedule to the patient's futureIntake array
    for (let i = 0; i < patientsArray.length; i++) {
      if (patientsArray[i].firstName === selectedPatient) {
        patientsArray[i].futureIntake.push({ medicationName: selectedMedication, dates });
      }
    }

    // Package the patient's array into an update to send to the backend
    const update = [...patientsArray];

    // Post the update to the user's patients array
      // Body should contain the user's email (on localStorage object) and the update
    fetch(`/api/dashboard/patient`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ email, update }),
    }).catch(() => console.log('Error enrolling patient'));
  };

  function generateDateArray(startDate, numDoses, frequency) {
    /*
      Input: 
        - The selected start date when the medication will begin
        - The number of doses the patient will need to take
        - How often the patient will need to take the medication (in hours)
      Output:
        - An array of Date objects representing when the medication should be taken
    */
    const datesArr = [];

    for (let i = 0; i < numDoses; i++) {
      // If the array of Date objects contains nothing, initialize a new Date object with the startDate and push it to the array
      if (!datesArr.length) datesArr.push(new Date(startDate));
      else {
        // Store the previous indexed Date object in a temporary variable
        let date = new Date(datesArr[i - 1]);
        // Obtain the hours of the temp variable and add the frequency to them
        let hours = date.getHours() + Number(frequency);
        // Update the temp variable's hours and push it to the array
        date.setHours(hours);
        datesArr.push(date);
      }
    }

    return datesArr;
}

const handleSetPatient = (patient) => {
  // Update the state patient variable with the patient selected from the dropdown menu
    setSelectedPatient(patient);
  
    // Store the selected patient in an object
    const patientObj = patientsArray.find((p) => p.firstName === patient);
    if (patientObj) {
      // Update the state medications list variable with the array that is a property on the selected patient object
      setMedList(patientObj.medications);
    }
  };

  // Comments in the following return statement are DRY in that they are not repeated despite similar logic throughout statement
  return (
    // Inline styling attempting to force footer to bottom of the browser page
    <div className="reminder-container" style={{height: "89vh", overflow: "hidden"}}>
      <h1>Schedule Reminders</h1>
      <div className="form-container">
        <form className="form-input" onSubmit={handleEnrollPatient}>
          <label>
            {/* Characters below are blank spaces */}
            Patient Name:&nbsp;&nbsp;
            {/* Dropdown menu of available patients */}
            <select value={selectedPatient} onChange={(e) => handleSetPatient(e.target.value)}>
              <option value="">Select Patient</option>
              {patientsArray.map((patient) => (
                <option key={patient.firstName} value={patient.firstName}>
                    {patient.firstName}
                </option>
              ))}
            </select>
          </label>
          
        
          <label>
            Medication Name:&nbsp;&nbsp;
            <select value={selectedMedication} onChange={(e) => setSelectedMedication(e.target.value)}>
                <option value="">Select Medication</option>    
                {medList.map((medication) => (
                    <option key={medication.name} value={medication.name}>
                        {medication.name}
                    </option> 
                ))}
            </select> 
        </label>
          
        <label>
            Start Date and Time:&nbsp;&nbsp;
            {/* DatePicker obj to send proper startDate to generateDatesArray function */}
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="Pp"
              showTimeSelect
              timeIntervals={15}
              timeCaption="Time"
              placeholderText="Start Date & Time"
            />
          </label>

          {/* TODO: Explain why Dosages are important */}
          <label>
            Number of Doses:&nbsp;&nbsp;
            <input type="text" value={numDoses} onChange={(e) => setNumDoses(e.target.value)} />
          </label>
          {/* TODO: Write logic that allows user to choose between hours and days */}
          <label>
            Frequency (in hours):&nbsp;&nbsp;
            <input type="text" value={frequency} onChange={(e) => setFrequency(e.target.value)} />
          </label>
          <label>
            Phone Number:&nbsp;&nbsp;
            <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
          </label>
          <input type="submit" />
        </form>
      </div>
    </div>
  );
};

export default ScheduleReminders;
