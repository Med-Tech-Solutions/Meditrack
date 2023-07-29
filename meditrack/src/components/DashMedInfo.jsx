import React, {useEffect, useState} from "react";

const DashMedInfo = props => {

  const {meds} = props

  if (!Array.isArray(meds) || meds.length === 0) {
    return null;
  }

  return (
    <div>
      <h3>Medication Info</h3>
      <ul style={{
        display:'flex',
        justifyContent: 'center',
        // alignItems: 'center',
        // border: '1px solid black',
        borderRadius:5,
        marginTop: '0px',
        marginLeft: '20px',
        background: '#AE2B39',
        color: 'white',
        textAlign: 'center',
        }}>
      { meds.map((item) => (
            <li key={item._id} style={{listStyleType: 'none'}}>
              <div>
                <p>Name: {item.name}</p>
                <p>Dosage: {item.dosage}</p>
                <p>frequency {item.frequency}</p>
                <p>directions: {item.directions}</p>
              </div>
            </li>
          ))}
      </ul>
    </div>
  )
}

export default DashMedInfo;