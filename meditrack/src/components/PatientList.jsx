import React from 'react';
import Patient from './Patient';

const PatientList = (props) => {
  const { patients } = props;
  return (
    <div className="patients-list">
      {patients.map((patient) => (
        <Patient
          className="patient"
          key={patient._id}
          firstName={patient.firstName}
          lastName={patient.lastName}
          age={patient.age}
          weight={patient.weight}
          medications={patient.medications}
        />
      ))}
    </div>
  );
};

export default PatientList;