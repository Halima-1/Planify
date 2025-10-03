import React, { useState } from 'react'
import "./home.scss"
import CreateEvent from '../createEvent'
import Eventlist from '../eventList/eventlist'
import {BiPlus} from "react-icons/bi"
function Home() {
    const [eventButton, setEventButton] =useState(false)
    const toggleEventBtn =() =>{
        setEventButton(!eventButton)
      }
      console.log(eventButton)

    return (
        <section className='container'>
            {/* <input type="text" /> */}
            <Eventlist 
            toggleEventBtn={toggleEventBtn}
            eventButton={eventButton}/>
        <CreateEvent 
        eventButton={eventButton}/>
           

        </section>
    )
}

export default Home
