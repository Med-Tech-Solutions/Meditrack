import React, { useState } from 'react';
import MedList from './MedList';
import { startTransition, useContext } from 'react';
import {PatientContext} from './PatientContext'

const MedCard = ({selectedMedication, hideMedCard}) => {
    
    const hideMedCardHandler = () => {
        // Call the onHidePatient function passed as a prop to reset the selectedPatient state to null
        hideMedCard();
      };

    if(!selectedMedication){
        console.log("test")
        return <div className="med-text">Click a medicine to learn more.</div>;
      }

      const { name, dosage, week, frequency, directions } = selectedMedication;

    return (
        <div className="med-card-info">
            <h2>{name}</h2>
            <p>Dosage: {dosage}</p>
            <p>Week: {week}</p>
            <p>Frequency: {frequency}</p>
            <p>Directions: {directions}</p>
            <button className="hide-med-button" onClick={() => hideMedCardHandler()}>Hide</button>
        </div>
    )
}

export default MedCard;