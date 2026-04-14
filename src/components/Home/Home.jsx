import React, { useState } from 'react'
import "./Home.scss"
import CreateEvent from '../CreateEvent'
import EventList from '../EventList/EventList'
import {BiPlus} from "react-icons/bi"
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function Home() {
    const [eventButton, setEventButton] =useState(false)
    const [notify,setNotify] =useState(false)
    const { user } = useAuth()
    const navigate =useNavigate()
    const [loading,setLoading]= useState(false)
             const params = useParams();
    const toggleEventBtn = () =>{
        if(user) {
            setEventButton(!eventButton)
        } else {
            navigate("/login");
        }
    }
     
//   const details = product.filter((item) => {
//     return item.id == id;
//   });
const id = params.id;
  console.log(params.id)
    return (
        <>
       {user ?  <section className='container'>
            {/* <input type="text" /> */}
            <EventList 
            notify={notify}
            setNotify={setNotify}
            toggleEventBtn={toggleEventBtn}
            eventButton={eventButton}/>           
        <CreateEvent 
        notify={notify}
        setNotify={setNotify}
        toggleEventBtn={toggleEventBtn}
        eventButton={eventButton}/>
           

        </section>:
        <section className="hero-section">
            <div className="hero-content">
                <h1 className="hero-title">Plan. Share. <br /><span className="gradient-text">Celebrate.</span></h1>
                <p className="hero-subtitle">The all-in-one platform to orchestrate your events with ease. From intimate gatherings to large celebrations, Planify makes coordination seamless.</p>
                <div className="hero-actions">
                    <button className="btn-primary" onClick={() => navigate("/register")}>Create free account</button>
                    <p className="login-prompt">Already a member? <Link to="/login">Sign in</Link></p>
                </div>
            </div>
            <div className="hero-image-container">
                <img src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800" alt="celebration" className="hero-image" />
                <div className="image-overlay"></div>
            </div>
        </section>
        }
        </>
    )
}

export default Home
