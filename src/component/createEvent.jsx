import { getAuth } from 'firebase/auth';
import { addDoc, collection, doc, getDoc, setDoc } from 'firebase/firestore';
import React, { useState } from 'react'
import { db } from '../config/firebase';
import { getNames } from "country-list";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
export const countries = getNames();
export const nigeriaStates = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
  "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu",
  "FCT - Abuja", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina",
  "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo",
  "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
];
function CreateEvent({eventButton, toggleEventBtn,setNotify, notify}) {
    const [errData, setErrData] = useState({});
    const [notification, setNotification] =useState({})
    const [eventList, setEventList] = useState({
        eventTitle: "",
        startTime: "10:12",
        startDate:"2025-01-01",
        endTime: "10:10",
        endDate:"2025-01-01",
        guest:[],
        eventCountry:"",
        eventState:"",
        address:"",
        entry:"",
        policy:""
      });
    
      const handleChange = (e) => {
        const value = e.target.value;
        setEventList({ ...eventList, [e.target.name]: value });
      };
      const  handleAddToEvent =async (e)=>{
        e.preventDefault()
                const newErr ={}
        // newErr.new =""
        if(eventList.eventTitle ==""){
          toast.error("Kindly input your event's title 🎉");
            newErr.title ="Kindly input your event's title"
        }
        else if(eventList.address ==""){
          toast.error("Kindly input your event's address");
            newErr.address ="Kindly input your event's address"
        }
        else if(eventList.startDate ==""){
            newErr.date ="Kindly input your event's date"
        }
        else if(eventList.endDate ==""){
            newErr.date ="Kindly input your event's date"
        }
        else if(eventList.startTime ==""){
            newErr.startTime ="Kindly input your event's starting time"
        }
        else if(eventList.endTime ==""){
            newErr.endTime ="Kindly input your event's ending time"
        }
        else if(eventList.eventCountry ==""){
            newErr.eventCountry ="Kindly input your event's country"
        }
        else{
            const auth = getAuth();
            const user = auth.currentUser;
            if (!user) {
              console.error(" User not logged in");
              return;
            }
            try {
              const eventRef = collection(db, "events");
                await addDoc(eventRef, {
                  ...eventList,
                  createdAt: new Date(),
                  userId: user.uid,
                });

                // const notifyRef = collection(db, "notifications");
                //     await addDoc(notifyRef, {
                //       title:`${eventList.eventTitle} added by ${user.email}`,
                //       createdAt: new Date(),
                //       userId: user.uid,
                //     });
                    // const payload ={
                      // title:`${eventList.eventTitle} added by ${user.email}`,
                      // userId: user.uid,
                    // }
                    // await addDoc(notifyRef, payload);
                    //  console.log("notify:"+ JSON.stringify(payload))

                toast.success("Event added successfully! 🎉");
                window.location.href="/"
                console.log(`Added ${eventList.eventTitle} to events`);
        }catch (error) {
        }    
      
        console.log(user)
        }
        setErrData(newErr)
      }

    return (
        <>
        <form
        action=""
        onSubmit={(event) => {
          event.preventDefault();
          handleAddToEvent();
        }}
        style={eventButton? {display:"block"} :{display:"none"}}
      >
        <h2 style={({ color: "navy", marginBottom: 30 })}>Create event</h2>
        <ToastContainer position="top-center" autoClose={3000} />

        {errData.title && <p style={{ color: "red" }}>{errData.title}</p>}
<textarea
        value={eventList.eventTitle}
        onChange={handleChange}
        placeholder="Event title"
        rows="5"
        cols="30"
        name='eventTitle'
      />
        {errData.startDate && <p style={{ color: "red" }}>{errData.startDate}</p>}
        {errData.endDate && <p style={{ color: "red" }}>{errData.endDate}</p>}
       {errData.startTime && <p style={{ color: "red" }}>{errData.startTime}</p>}
       <div className='event-time'>
       <div style={{borderBottom:" 1px solid rgb(206, 205, 205)"}}>
        {/* <input type='' name="" id="" /> */}
        <label htmlFor="startDate"><b>Starts:</b>
         </label>
         <input type="date" name="startDate"
         value={eventList.startDate} required
         onChange={handleChange}
         id="eventDate" placeholder={"date"}/>
        <input type="time" name="startTime" 
        id="" value={eventList.startTime} required
        onChange={handleChange}
        />
        </div>
        {errData.endTime && <p style={{ color: "red" }}>{errData.endTime}</p>}

       <div >
         <label htmlFor="endDate"><b>End:</b>
         </label>
         <input type="date" name="endDate"
         value={eventList.endDate} required
         onChange={handleChange}
         id="eventDate" placeholder={"date"}/>
         <input type="time" name="endTime"
         id="" value={eventList.endTime} required
         onChange={handleChange}/>
       </div>
       </div>
               {errData.eventCountry && <p style={{ color: "red" }}>{errData.eventCountry}</p>}
       <div id='location'>
       <select value={eventList.eventCountry} name='eventCountry' onChange={handleChange}>
      <option value="" name='eventCountry'>-- Select Country --</option>
      {countries.map((eventCountry, index) => (
        <option key={index} value={eventCountry}>
          {eventCountry}
        </option>
      ))}
    </select>
    <select value={eventList.eventState} name='eventState' onChange={handleChange}>
      <option value="">-- Select State --</option>
      {nigeriaStates.map((eventState, index) => (
        <option key={index} value={eventState}>
          {eventState}
        </option>
      ))}
    </select>
       </div>
               {errData.address && <p style={{ color: "red" }}>{errData.address}</p>}
       <div className="address">
       <label htmlFor="address">Address:</label>
       <input type="text" id="address" name='address' 
       value={eventList.
       address}
        onChange={handleChange} 
        placeholder="Event's address"/>
       </div>
        <input style={!eventButton? {display:"none"}:{display:"block"}}
         className="submit-btn" type="submit" 
        onClick={handleAddToEvent} value={"Create event"} />
      </form>
        </>
    )
}

export default CreateEvent
