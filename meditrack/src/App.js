import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from "./components/Home";
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Signup from './components/Signup';
import About from './components/About';
import Diagnostic from './components/Diagnostic';
import DoctorCalendar from './components/DoctorCalendar';
import PatientCalendar from './components/PatientCalendar';
import ScheduleReminders from './components/ScheduleReminders';
import PatientsPage from './components/PatientsPage'
import SideNav from './components/SideNav';

/*
====================================
DASHBOARD PATH IS A TEMP PLACEHOLDER
====================================
*/


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Navbar />
          <Routes>
            <Route exact path ="/" element={<Home />}></Route>
            <Route path="/signup" element={<Signup />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/dashboard" element={<Dashboard />}></Route>
            <Route path="/about" element={<About />}></Route>
            <Route path="/doccal" element={<DoctorCalendar />}></Route>
            <Route path="/patientcal" element={<PatientCalendar />}></Route>
            <Route path="/dse" element={<Diagnostic />}></Route>
            <Route path="/schedule" element={<ScheduleReminders/>}></Route>
            <Route path="/patients" element={<PatientsPage />}></Route>
          </Routes>
        <Footer />
      </header>
    </div>
  );
}

export default App;
