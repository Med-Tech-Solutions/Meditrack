import React, { useState, useEffect } from 'react';
import { Link, useMatch, useResolvedPath } from 'react-router-dom';

const Navbar = () => {
    const [email, setEmail] = useState('');

    useEffect(() => {
        setEmail(localStorage.getItem('email'));

    }, []);

  return (
    <nav className="navbar">
        <Link className="site-title" to="/">Meditrack</Link>
        <ul>
            <CustomLink to="/dashboard/:email">Dashboard</CustomLink>
            <CustomLink to="/schedule">Schedule Reminders</CustomLink>
            <CustomLink to="/patientcal">Medication Calendar</CustomLink>
            <CustomLink to="/doccal">Schedule an Appointment</CustomLink>
            <CustomLink to="/dse">Diagnostic Suggestion Engine</CustomLink>
        </ul>
    </nav>
  );
};

function CustomLink ({ to, children, ...props }) {
    const resolvedPath = useResolvedPath(to);
    const isActive = useMatch( { path: resolvedPath.pathname, end: true })
    return (
        <li className={isActive ? "active" : ""}>
            <Link to={to} {...props}>{children}</Link>
        </li>
    )
}

export default Navbar;