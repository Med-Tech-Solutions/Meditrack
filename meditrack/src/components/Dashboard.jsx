import React, { useEffect, useState } from "react";
import PatientList from "./PatientList";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Dashboard = (props) => {
  const [patientsArray, setPatientsArray] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");

  const navigate = useNavigate();

  // name is for "Welcome, user message on Dashboard" -AG
  const name = Cookies.get("name");
  const email = Cookies.get("email");

  // Obtain the User's data from the database
  useEffect(() => {
    console.log("==== email", email);

    if (email === "") {
      navigate("/login");
    }

    fetch(`/api/dashboard/${email}`)
      .then((data) => {
        return data.json();
        // if data is not an array navigate back to the login component
        // navigate("/login")
      })
      .then((data) => {
        console.log("===== data.json: ", data);
        if (!data.patients) {
          navigate("/login");
        }
        setPatientsArray(data.patients);
      })
      .catch(() => console.log("got nothing"));
  }, []);

  const handleAddPatient = () => {
    // Initialize an array 'update' to be equal to what is stored in the state patientsArray variable
    let update = [...patientsArray];

    // Push relevant state variables to the update array
    update.push({
      firstName,
      lastName,
      age,
      weight,
    });

    // Send the updated data to the backend to be added to the patched to the
    fetch(`/api/dashboard/patient`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ email, update }),
    })
      .then((data) => {
        return data.json();
        // reloadPatients();
      })
      .then((data) => {
        console.log("======= handlePatient: ", data);
        // if data is undefined, then reload patients and don't do update
        if (data === false) {
          navigate("/login");
        } else {
          // Push relevant state variables to the update array
          update.push({
            firstName,
            lastName,
            age,
            weight,
          });
          reloadPatients();
        }
      })
      .catch((error) => {
        console.error("Error: in dashboard post request", error);
      });
  };

  const reloadPatients = () => {
    fetch(`/api/dashboard/${email}`)
      .then((data) => data.json())
      .then((data) => {
        // console.log(data);
        setPatientsArray(data.patients);
      })
      // .then(data => console.log("log" ,data))
      .catch(() => console.log("got nothing"));
  };

  return (
    <div className="dashboard-container">
      <h2>Welcome, {name}!</h2>
      <h3 className="patients-header">Patients</h3>
      <div className="patients-container">
        {patientsArray && (
          <PatientList
            className="patients-list"
            patients={patientsArray}
            handleAddPatient={handleAddPatient}
          ></PatientList>
        )}
      </div>
      <form
        className="form-input"
        id="add-patient-form"
        onSubmit={(event) => {
          event.preventDefault();
          handleAddPatient();
        }}
      >
        <span className="add-patient">Add Patient</span>
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        ></input>
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        ></input>
        <input
          type="text"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        ></input>
        <input
          type="text"
          placeholder="Weight"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        ></input>
        <br></br>
        <input type="submit"></input>
      </form>
    </div>
  );
};

export default Dashboard;
