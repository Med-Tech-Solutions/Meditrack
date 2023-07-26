import React, { useState, useEffect } from 'react';

const DashPatient = props => {
  return (
    <div className='dash-patient-contain' style={{
      display:'flex',
      justifyContent:'space-evenly',     
    }}>
      <table className="patient-info" style={{
        display:'flex',
        border: '1px solid black',
        borderRadius:5
        }}>
        <ul className='info'>
          <li>Name: Will</li>
          <li>Age: 234</li>
          <li>Weigth: 49999 lbs</li>
          <li>Height: 234234 feet</li>
        </ul>
        <ul className="meds">
          <li>drug</li>
          <li>drug</li>
          <li>drug</li>
          <li>drug</li>
        </ul>
        <ul className="conditions">
          <li>diabetes</li>
          <li>asthma</li>
          <li>cancer</li>
        </ul>
      </table>
    </div>
  )
}

export default DashPatient;