import React, { useState, useEffect } from 'react';


const DashPatient = props => {
  const { patient, meds } = props;


  if (!Array.isArray(meds) || meds.length === 0) {
    return null;
  }

  return (
    <div className='dash-patient-contain' style={{
      display:'flex',
      flexDirection: 'column',
      justifyContent:'space-evenly',  
      marginTop: '0px',   
    }}>
      <h3>Patient Info</h3>
      <table className="patient-info" style={{
        // display:'flex',
        // justifyContent: 'center',
        // alignItems: 'center',
        // border: '1px solid black',
        borderRadius:5,
        marginTop: '0px',
        marginLeft: '45%',
        // marginRight: '45%',
        background: '#AE2B39',
        color: 'white',
        textAlign: 'center',
        }}>
        <ul className='info' style={{ display: 'flex',  listStyleType: 'none', padding: 0 }}>
          <li style={{listStyleType: 'none', display: 'flex'}}>Name: {patient.firstName}</li>
          <li style={{listStyleType: 'none'}}>Age: {patient.age}</li>
          <li style={{listStyleType: 'none'}}>Weigth: {patient.weight}</li>
        </ul>
        {/* <ul className="meds" style={{ listStyleType: 'none', padding: 0 }}>
          { meds.map((item) => (
            <li key={item._id} style={{listStyleType: 'none'}}>{item.name}</li>
          ))}
        </ul> */}
      </table>
    </div>
  )
}

export default DashPatient;