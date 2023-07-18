import React, { useState, useEffect } from 'react';
import ReactCalendar from 'react-calendar';
import { add, format } from 'date-fns';

const DoctorCalendar = () => {
  const [date, setDate] = useState({ justDate: null, dateTime: null });
  const [patientsArray, setPatientsArray] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [timesAvailable, setTimesAvailable] = useState([]);
  const [timeSelected, setTimeSelected] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem('email');
    fetch(`/api/dashboard/${email}`)
      .then((data) => data.json())
      .then((data) => {
        setPatientsArray(data.patients);
      })
      .catch(() => console.log("got nothing"));

    fetch('/api/doctor')
      .then((data) => data.json())
      .then((data) => setDoctors(data))
      .catch(() => console.log("got nothing"));
  }, []);

  const getTimes = () => {
    if (!date.justDate || !selectedDoctor) return [];

    const { justDate } = date;

    const selectedDoctorData = doctors.find((doctor) => doctor.name === selectedDoctor.name);

    if (!selectedDoctorData || !selectedDoctorData.hoursAvailable) return [];

    const beginning = add(justDate, { hours: selectedDoctorData.hoursAvailable[0] });
    const end = add(justDate, {
      hours: selectedDoctorData.hoursAvailable[selectedDoctorData.hoursAvailable.length - 1]
    });
    const interval = 30;

    const times = [];

    for (let i = beginning; i <= end; i = add(i, { minutes: interval })) {
      times.push(i);
    }

    return times;
  };

  const handlePatientSelection = (patient) => {
    setSelectedPatient(patient);
    setDate({ justDate: null, dateTime: null });
    setSelectedDoctor(null);
    setTimeSelected(false);
  };

  const handleDoctorSelection = (doctorName) => {
    const selectedDoctorData = doctors.find((doctor) => doctor.name === doctorName);
    setSelectedDoctor(selectedDoctorData);

    if (selectedDoctorData && date.justDate) {
      const formattedDate = format(date.justDate, 'yyyy-MM-dd');
      const availableTimes = getTimes()
        .filter((time) => format(time, 'yyyy-MM-dd') === formattedDate)
        .map((time) => add(date.justDate, { hours: time.getHours(), minutes: time.getMinutes() }));
      setTimesAvailable(availableTimes);
    } else {
      setTimesAvailable([]);
    }
  };

  const handleScheduleAppointment = () => {
    if (!selectedPatient || !date.dateTime || !selectedDoctor) return;

    // const updatedHoursAvailable = selectedDoctor.hoursAvailable.filter(
    //   (time) => !format(time, 'hh:mm').includes(format(date.dateTime, 'hh:mm'))
    // );

    // fetch(`/api/doctors/${selectedDoctor._id}`, {
    //   method: 'PUT',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ hoursAvailable: updatedHoursAvailable }),
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     // Handle success response
    //     console.log('Appointment scheduled successfully');
    //     setTimeSelected(true);
    //   })
    //   .catch((error) => {
    //     // Handle error
    //     console.error('Error scheduling appointment:', error);
    //   });

    setTimeSelected(true);

  };

  return (
    <div className="scheduler-calendar" style={{minHeight: "100vh"}} >
      <h1>Doctor Calendar</h1>

      <div>
        <h2>Select Patient</h2>
        <select className="select-patient"
          value={selectedPatient?.firstName || ''}
          onChange={(e) => handlePatientSelection(patientsArray.find((p) => p.firstName === e.target.value))}
        >
          <option value="">Select Patient</option>
          {patientsArray.map((patient) => (
            <option key={patient.firstName} value={patient.firstName}>
              {patient.firstName}
            </option>
          ))}
        </select>
      </div>

      {selectedPatient && !timeSelected && (
        <>
          <h2>Select Doctor</h2>
          <select className="select-patient"
            value={selectedDoctor?.name || ''}
            onChange={(e) => handleDoctorSelection(e.target.value)}
          >
            <option value="">Select Doctor</option>
            {doctors.map((doctor) => (
              <option key={doctor.name} value={doctor.name}>
                {doctor.name}
              </option>
            ))}
          </select>

          {selectedDoctor && (
            <>
              <h2>Schedule Appointment</h2>
              <div>
                <p>Selected Patient: {selectedPatient.firstName}</p>
                {date.justDate && (
                  <>
                    <p>Selected Date: {format(date.justDate, 'MM/dd/yyyy')}</p>
                    <p>Select Time:</p>
                    <div style={{display: "flex", justifyContent: "center"}}>
                      {timesAvailable.map((time, i) => (
                        <div key={`time-${i}`}>
                          <button
                            style={{borderColor: "pink"}}
                            className="time-btn"
                            onClick={() => {
                              setDate((prev) => ({
                                ...prev,
                                dateTime: time,
                              }));
                            }}
                          >
                            {format(time, 'hh:mm')}
                          </button>
                        </div>
                      ))}
                    </div>
                    <button className="schedule-btn" style={{ marginTop: '10px' }} onClick={handleScheduleAppointment}>
                      Schedule Appointment
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </>
      )}

      {timeSelected && (
        <div>
          <h2>Appointment Scheduled!</h2>
        </div>
      )}

      {!selectedPatient && !timeSelected && (
        <div>
          <p>Please select a patient.</p>
        </div>
      )}

      {!selectedDoctor && !timeSelected && (
        <div>
          <p>Please select a doctor.</p>
        </div>
      )}

      {!timeSelected && (
        <ReactCalendar
          minDate={new Date()}
          className="react-calendar"
          view="month"
          onClickDay={(selectedDate) => {
            setDate((prev) => ({
              ...prev,
              justDate: selectedDate,
              dateTime: null,
            }));
            handleDoctorSelection(selectedDoctor?.name);
          }}
        />
      )}
    </div>
  );
};

export default DoctorCalendar;
