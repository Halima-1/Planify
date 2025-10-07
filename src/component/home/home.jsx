import React, { useState } from 'react'
import "./home.scss"
import CreateEvent from '../createEvent'
import Eventlist from '../eventList/eventlist'
import {BiPlus} from "react-icons/bi"
import { auth } from '../../config/firebase'
import { useNavigate } from 'react-router-dom'
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
      

    return (
        <>
        <section className='container'>
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
           

        </section>
        </>
    )
}

export default Home
