import React from 'react';
import { Link } from 'react-router-dom'
import logo from '../logo.png';
import schedule from '../clipart58110.png';
import './Home.css';
// created assets folder to import images and update welcome/landing page
import adherence from '../../assets/adherence.jpg'
// import doctor from '../../assets/doctor.jpeg'
import doctor from '../../assets/doctor.jpg';

const Home = () => {

    const background1 = {
        height: '800px',
        background: `url(${doctor})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        // margin: '0px',
        // backgroundPosition: 'center',
        // border:'5px solid red',
        // boxSizing:'border-box',
    }
    const background2 ={
        width: '100vw',
        height: '800px',
        background: `url(${adherence})`,
        backgroundSize:'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        // border:'5px solid red',
        // boxSizing:'border-box',
    }


    const overlayStyle = {
        content: '', // Required for the pseudo-element to render
        position: 'absolute',
        width: '100%',
        height: '800px',
        backgroundPosition: 'center',
        backgroundImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.5) 100%)', 
      };

      const textContainerStyle = {
        position: 'relative', // Set the position to 'relative' to enable the z-index
        zIndex: 1, // Set a higher z-index to render the text above the overlay
        marginLeft: '200px',
        textAlign: 'center', // Center the text horizontally within the container
        alignItems: 'center', // Center the elements horizontally
        justifyContent: 'center', // Center the elements vertically
      };
    
    

      const grayButton = {
        backgroundColor: 'transparent',
        color: 'white',
        border: '2px solid #e7e7e7',
        borderRadius: '5px',
      };

      const handleSignupClick = () => {
        // Redirect the user to the "/signup" page when the button is clicked
        window.location.href = "/signup";
      };
    
    return(
        <main >
            {/* <h1 style={{fontSize: "5rem"}}>MediTrack</h1> */}
            <section  style={background1}>
           <div >
           {/* <img  src={doctor} alt="doctor" /> */}
           <div style ={overlayStyle}></div>
                <div className="home-content" style={textContainerStyle}>
                    <h1 className="upper-text" style={{fontSize: "2.5rem", color: "white", 
                    opacity: 0.5 }}>Seamlessly Manage Your Medication Journey</h1>
                    <p  style={{ textAlign: "center", width: "50%", color: "white", fontSize: "20px"}}>Never miss a dose and always know the directions with calendar events automatically populated based on your medication schedule.</p>
                    <h3 style={{marginBottom: "100px", color: "white"}}>Please <button style={{fontSize: '20px', ...grayButton}} className="link" onClick={() => {window.location.href = "/login"}}>login</button> or <button style={{fontSize: '20px', ...grayButton}} className="link" onClick={handleSignupClick}>
        Signup
      </button> to continue</h3>
                    <div className = "image-container ">
                    {/* <img  src={doctor} alt="doctor" /> */}
                    </div>
                    {/* <img src={schedule} alt="schedule" style={{width: "9%", marginRight: "20%"}}/> */}
                    </div>
                    </div>
            </section>
             <br/>
            <section className="home-section-padding">
            <div style={background2}>
            <div style ={overlayStyle}></div>
                <div className="home-image" >
                    {/* <img src={logo} alt="logo" /> */}
                </div>
                <div style={{paddingTop: "250px",...textContainerStyle}}>
                <h1 style={{fontSize: "2.5rem", color: "white", opacity: 0.5 }}>Get Reminded of Your <br /> Medication Priorities</h1>
                <p style={{textAlign: "center", color: "white", fontSize: '20px'}}>Fridays and Saturdays can be the toughest  adherence days of the week.<br /> Meditrack's system enables targeted and personalized notifications to improve adherence.</p>
                     {/* added code here for img */}
                     {/* <img src={adherence} alt="clock with pills" /> */}
                </div>
                <div className="home-content">
                {/* <h1 className="gradient__text">Get Reminded of Your <br /> Medication Priorities</h1> */}
                {/* <p style={{textAlign: "center"}}>Fridays and Saturdays can be the toughest  adherence days of the week. Meditrack's system enables targeted and personalized notifications to improve adherence.</p> */}
            </div>
            </div>
        </section>
         </main>
    );


}



export default Home;
