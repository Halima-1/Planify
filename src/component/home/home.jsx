import React, { useState } from 'react'
import "./home.scss"
import CreateEvent from '../createEvent'
import Eventlist from '../eventList/eventlist'
import {BiPlus} from "react-icons/bi"
import { auth } from '../../config/firebase'
import { Link, useNavigate } from 'react-router-dom'
function Home() {
    const [eventButton, setEventButton] =useState(false)
    const [notify,setNotify] =useState(false)
    const user =auth.currentUser
    const navigate =useNavigate()
    const [loading,setLoading]= useState()

    const toggleEventBtn = async() =>{
        const user =auth.currentUser
        try{
            if(user)
            {
                setEventButton(!eventButton)
            }
            else{
                navigate("/login");
            }
            console.log(user)
            setLoading(false)
        }
        
        catch (error) {
            console.error("Error fetching user: ", error);
          };
      }
      console.log(eventButton)
      
      const checkUser =localStorage.getItem("oldUser")
    return (
        <>
       {checkUser?  <section className='container'>
            {/* <input type="text" /> */}
            <Eventlist 
            notify={notify}
            setNotify={setNotify}
            toggleEventBtn={toggleEventBtn}
            eventButton={eventButton}/>
            
        <CreateEvent 
        notify={notify}
        setNotify={setNotify}
        eventButton={eventButton}/>
           

        </section>:
        <section className="heroImage">
            <h2>Planify</h2>
            <h3>Seamless event booking made easy</h3>
            <div >
                <img src="https://media.istockphoto.com/id/1903623112/vector/event-planner-vector-illustration-with-planning-schedule-time-management-business-agenda-and.jpg?s=612x612&w=0&k=20&c=1Ad3hjpHcjllhcJunBmnQT9PQkTGsyXBjV4LWvzHTtw=" alt="hero image" />
            </div>
            <div >
                <button onClick={() =>navigate ("/register")}>Create account</button>
                <p>Already have an account? <Link to="login">Sign up</Link></p>
            </div>
        </section>
        }
        </>
    )
}

export default Home
