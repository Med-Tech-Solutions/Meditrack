import React, {useState, createContext} from 'react';

//this code creates a new context that will hold state related to patients
const PatientContext = createContext();

//this components will wrap its children with the PatientContext.Provider, which will be responsible for managing state related to the user and provigin it to its descendants
//this component renders the PatientContext.Provider and passes an object as the value prop containing the patientsArray state and the setPatientsArray function. 
//this makes the state/function available toa ll child components that use the PatientContext

const PatientProvider = ({children}) => {
    
    const [patientsArray, setPatientsArray] = useState([]);

    return (
        <PatientContext.Provider value={{patientsArray, setPatientsArray}}>
            {children}
        </PatientContext.Provider>
    );
};

export {PatientContext, PatientProvider}; 