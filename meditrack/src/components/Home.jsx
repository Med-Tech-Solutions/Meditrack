import React from 'react';
import { Link } from 'react-router-dom'
import logo from '../logo.png';
import schedule from '../clipart58110.png';
import './Home.css';

const Home = () => {
    return(
        <div className="homepage-container">
            
            <h1 style={{fontSize: "5rem"}}>MediTrack</h1>
            
            <h3 style={{marginBottom: "100px"}}>Please <Link className="link" to="/login">login</Link> or <Link className="link" to="signup">signup</Link> to continue</h3>
            
            <div className="upper-content">
                <div className="home-content" style={{marginLeft: "200px"}}>
                    <h1 className="upper-text" style={{fontSize: "2.5rem"}}>Seamlessly Manage Your Medication Journey</h1>
                    <p className="upper-text">Never miss a dose and always know the directions with calendar events automatically populated based on your medication schedule.</p>
                </div>
                    <img src={schedule} alt="schedule" style={{width: "9%", marginRight: "20%"}}/>
            </div>

            <div className="home-section-padding">
                <div className="home-image">
                    <img src={logo} alt="logo" />
                </div>
                <div className="home-content">
                <h1 className="gradient__text">Get Reminded of Your <br /> Medication Priorities</h1>
                <p style={{textAlign: "center"}}>Fridays and Saturdays can be the toughest  adherence days of the week. Meditrack's system enables targeted and personalized notifications to improve adherence.</p>
            </div>

        </div>
         </div>
    );


}



export default Home;
