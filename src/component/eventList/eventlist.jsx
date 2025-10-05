import { useEffect, useState } from "react"
import "./eventlist.scss"
import { collection, deleteDoc, doc, getDocs, getFirestore, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { getAuth, onAuthStateChanged, updateCurrentUser } from "firebase/auth";
import {BiCollapse, BiPen, BiPencil, BiPlus, BiTime, BiTrash} from "react-icons/bi"
import { BiSolidLocationPlus } from "react-icons/bi";
import { countries } from "../createEvent";
import { nigeriaStates } from "../createEvent";
import { useNavigate } from "react-router-dom";


const Eventlist =({eventButton,toggleEventBtn}) =>{
  
    const [eventlist,setEventlist] =useState([])
    const [loading, setLoading] = useState(true);
    const [upcomingEvent, setUpcomingEvent] =useState([])
    const [pastEvent, setPastEvent] =useState([])
    const navigate = useNavigate()

    // const [user, setUser] = useState(null);
    const auth = getAuth();
    const user = auth.currentUser;
    console.log(user)
    const db = getFirestore();
   // convert Firestore string date ("YYYY-MM-DD") to JS Date
const toDate = (dateString) => {
  if (!dateString) return null;
  return new Date(dateString + "T00:00:00"); 
  // Add T00:00:00 so JS Date parses correctly
};

const isUpcomingEvent = (eventDate) => {
  // if (!eventDate) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0); // normalize
  return eventDate > today; // strictly after today
};

const isPastEvent = (eventDate) => {
  if (!eventDate) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return eventDate < today; // strictly before today
};
    useEffect(() => {
        const fetchEvents = async () => {
          try {
            const querySnapshot = await getDocs(collection(db, "events"));
            const eventsData = querySnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            setEventlist(eventsData);

             // filter upcoming
        const upcoming = eventsData.filter((ev) =>
        isUpcomingEvent(toDate(ev.startDate))
      );

      // filter past
      const past = eventsData.filter((ev) =>
        isPastEvent(toDate(ev.startDate))
      );

setUpcomingEvent(upcoming);
setPastEvent(past)
console.log(eventsData)
console.log("UPCOMING:", upcoming);
console.log("PAST:", past);
console.log("today:", past);
setLoading(false)
updatedd
setEventlist(eventsData);

          } catch (error) {
            console.error("Error fetching events: ", error);
          };
        }
          fetchEvents();

        
      }, []);
  console.log('hi')
// localStorage.setItem("eventlist",JSON.stringify(eventlist))
  // formating date and time
  // format day
  const formatDay = (dateVal) => {
    if (!dateVal) return "";
    const date = new Date(dateVal);
    if (isNaN(date.getTime())) {
      console.warn("Invalid date:", dateVal);
      return dateVal; // fallback raw
    }
    return date.toLocaleDateString("en-US", {
      weekday: "short",
    });
  };

  // format date
const formatDate = (dateVal) => {
  if (!dateVal) return "";
  const date = new Date(dateVal);
  if (isNaN(date.getTime())) {
    console.warn("Invalid date:", dateVal);
    return dateVal; // fallback raw
  }

  return date.toLocaleDateString("en-US", {
    day: "numeric",
  });
};
// format month
const formatMonth= (dateVal) => {
  if (!dateVal) return "";

  // If string (e.g. "2025-01-01")
  const date = new Date(dateVal);
  if (isNaN(date.getTime())) {
    console.warn("Invalid date:", dateVal);
    return dateVal; // fallback raw
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
  });
};
// format year
const formatYear = (dateVal) => {
  if (!dateVal) return "";
  const date = new Date(dateVal);
  if (isNaN(date.getTime())) {
    console.warn("Invalid date:", dateVal);
    return dateVal; // fallback raw
  }
  return date.toLocaleDateString("en-US", {
    year: "numeric",
  });
};
  const formatTime = (timeStr) => {
    if (!timeStr) return "";
  
    const [hour, minute] = timeStr.split(":");
    let h = parseInt(hour, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12; // convert to 12-hour
    return `${h}:${minute} ${ampm}`;
  };
  const format= (dateVal) => {
    if (!dateVal) return "";
  
    // If string (e.g. "2025-01-01")
    const date = new Date(dateVal);
    if (isNaN(date.getTime())) {
      console.warn("Invalid date:", dateVal);
      return dateVal; // fallback raw
    }
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

const date =new Date()
// console.log(format(date))

const [displayBtn, setDisplayBtn] =useState(true)
const toggleDisplay =()=>{
  setDisplayBtn(!displayBtn)

}
// removing event
const removeItem = async (itemId) => {
  try {
    await deleteDoc(doc(db, "events", itemId.toString()));
    console.log("Event deleted!");
  } catch (err) {
    console.error("Error deleting event:", err);
  }
  console.log(itemId)

};

// editttgg
const [updatedd, setUpdatedDataa] = useState({
  eventTitle: eventlist.eventTitle,
  startTime: "10:12",
  startDate:"2025-01-01",
  endTime: "10:10",
  endDate:"2025-01-01",
  guest:"",
  eventCountry:"",
  eventState:"",
  address:"",
  entry:"",
  policy:""
});
// const [updatedData, setUpdatedData] =useState({})
const handleChange = (e) => {
  const value = e.target.value;
  setUpdatedDataa({ ...updatedd, [e.target.name]: value });
};
const [editEvent, setEditEvent] =useState(false)
const [openEventMenu, setOpenEventMenu] =useState(false)
const edit = (itemId)=>{
  document.getElementById(`event${itemId}`).style.display ="block"
}

// to cancel editing
const cancelEdt =(itemId)=>{
  document.getElementById(`event${itemId}`).style.display ="none"

}
const openMenu =(itemId) =>{
  document.getElementById(`editIcons${itemId}`).style.display="block"
}
console.log(updatedd)
const UpdateEvent = async(itemId)=>{
  try {
    const ref = doc(db, "events", itemId);
    await updateDoc(ref, updatedd);
    console.log(`Event updated!:${itemId}` );
    console.log(ref) 
    navigate("/");
    window.location.href="/" 
  }
   catch (error) {
  console.error("Error updating event:", error); 
  } 

} 
const today = eventlist.filter((item) => format(item.startDate) == format(date) )
console.log(today)
    return( 
        <> 
        <div className="container" 
        style={eventButton? {display:"none"}: {display: "block"}}>
          <div className="grt">
            <h2>Welcome back</h2>
            <button >{formatMonth(date)} {formatDate(date)}</button>
          </div>
          <div className="search">  
            <></> 
          <input type="text" />
          </div> 
          <button style={eventButton? {visibility:"hidden"}:{visibility:"visible"}}
             onClick={toggleEventBtn}><BiPlus/> Create Event</button>
          <div className="eventDisplay">
            <h2 onClick={()=>setDisplayBtn(true)}
            style={displayBtn? {color:"black"} : {color:"rgb(187, 185, 185)"}}
            >Today</h2>
            <h2 onClick={()=>setDisplayBtn(false)}
              style={!displayBtn? {color:"black"} : {color:"rgb(187, 185, 185)"}}
            >Upcoming</h2>
          </div>
          {loading? <div className="spinner"></div>:
          <>
            {displayBtn? today.map((eventlist,index) =>(
            <section className="event-container">
            <div className="event today" key={index}>
            <div className="date">
              <span className="month">{formatMonth(eventlist.startDate)}</span>
              <b>{formatDate(eventlist.startDate)}</b>
              <span>{formatDay(eventlist.startDate)}</span>
            </div>
            <div className="details">
              <b>{(eventlist.eventTitle)}</b>
              <p><BiTime className="icon"/> <span>{formatTime(eventlist.startTime)}</span> - 
               <span style={{color: "blue"}}> {formatTime(eventlist.endTime)}</span></p>
              <p><BiSolidLocationPlus className="icon"/> <span>{(eventlist.eventState + " State")}, {(eventlist.eventCountry)}</span></p>
            </div>
           <div className="edit-icons"
            id={`editIcons${eventlist.id}`}
            style={eventlist.userId === user?.uid ?{display:"block"} : {display:"none"}}

            // style={eventlist.userId === user?.uid ?{display:"block"} : {display:"none"}}
           >
            <BiPencil
            onClick={() =>edit(eventlist.id)}/>
           <BiTrash 
              onClick={() => removeItem(eventlist.id)}
            />
            
           </div>
           {/* {!openEventMenu?  <div 
           onClick={() => openMenu(eventlist.id)}
            style={eventlist.userId === user?.uid ?{display:"block"} : {display:"none"}}
            className="menu-bar">
              <h1>.</h1>
              <h1>.</h1>
              <h1>.</h1>
            </div>:<div className="menu-bar" ><  BiCollapse onClick={() =>setOpenEventMenu(false)}  /></div>} */}
          </div>
          <form
          className="edit-form"
          id={`event${eventlist.id}`}             
        action=""
        style={!editEvent? {display:"none"}:{display:"block"}}
        onSubmit={(event) => {
          event.preventDefault();
          // handleAddToEvent();
        }}
        // style={eventButton? {display:"block"} : {display:"none"}}
      >
        {/* <ToastContainer position="top-center" autoClose={3000} /> */}

        {/* {errData.title && <p style={{ color: "red" }}>{errData.title}</p>} */}
<textarea
        value={updatedd.eventTitle}
        onChange={handleChange}
        placeholder="Create event"
        rows="5"
        cols="30"
        name='eventTitle'
      />
        {/* {errData.startDate && <p style={{ color: "red" }}>{errData.startDate}</p>} */}
        {/* {errData.endDate && <p style={{ color: "red" }}>{errData.endDate}</p>} */}
       {/* {errData.startTime && <p style={{ color: "red" }}>{errData.startTime}</p>} */}
       <div className='event-time'>
       <div style={{borderBottom:" 1px solid rgb(206, 205, 205)"}}>
        {/* <input type='' name="" id="" /> */}
        <label htmlFor="startDate"><b>Starts:</b>
         </label>
         <input type="date" name="startDate"
         value={updatedd.startDate} required
         onChange={handleChange}
         id="eventDate" placeholder={"date"}/>
        <input type="time" name="startTime" 
        id="" value={updatedd.startTime} required
        onChange={handleChange}
        />
        </div>
        {/* {errData.endTime && <p style={{ color: "red" }}>{errData.endTime}</p>} */}

       <div >
         <label htmlFor="endDate"><b>End:</b>
         </label>
         <input type="date" name="endDate"
         value={updatedd.endDate} required
         onChange={handleChange}
         id="eventDate" placeholder={"date"}/>
         <input type="time" name="endTime"
         id="" value={updatedd.endTime} required
         onChange={handleChange}/>
       </div>
       </div>
               {/* {errData.eventCountry && <p style={{ color: "red" }}>{errData.eventCountry}</p>} */}
       <div id='location'>
       <select value={updatedd.eventCountry} name='eventCountry' onChange={handleChange}>
      <option value="" name='eventCountry'>-- Select Country --</option>
      {countries.map((eventCountry, index) => (
        <option key={index} value={eventCountry}>
          {eventCountry}
        </option>
      ))}
    </select>
    <select value={updatedd.eventState} name='eventState' onChange={handleChange}>
      <option value="">-- Select State --</option>
      {nigeriaStates.map((eventState, index) => (
        <option key={index} value={eventState}>
          {eventState}
        </option>
      ))}
    </select>
       </div>
               {/* {errData.address && <p style={{ color: "red" }}>{errData.address}</p>} */}
       <div className="address">
       <label htmlFor="address">Address:</label>
       <input type="text" id="address" name='address' 
       value={updatedd.
       address}
        onChange={handleChange} 
        placeholder="Event's address"/>
       </div>
       <input 
                style={{backgroundColor:"rgb(2, 107, 2)"}}
         className="submit-btn" type="submit" 
        onClick={() => UpdateEvent (eventlist.id)} value={"Save"} />
         <input 
                  style={{backgroundColor:"rgb(230, 116, 22)"}}
         className="submit-btn" type="submit" 
        onClick={() => cancelEdt (eventlist.id)} value={"Cancel"} />
      </form>
          </section>
)) : upcomingEvent.map((eventlist,index) =>(
  <section className="event-container">
            <div className="event today" key={index}>
            <div className="date">
              <span className="month">{formatMonth(eventlist.startDate)}</span>
              <b>{formatDate(eventlist.startDate)}</b>
              <span>{formatDay(eventlist.startDate)}</span>
            </div>
            <div className="details">
              <b>{(eventlist.eventTitle)}</b>
              <p><BiTime className="icon"/> <span>{formatTime(eventlist.startTime)}</span> - 
               <span style={{color: "blue"}}> {formatTime(eventlist.endTime)}</span></p>
              <p><BiSolidLocationPlus className="icon"/> <span>{(eventlist.eventState + " State")}, {(eventlist.eventCountry)}</span></p>
            </div>
           <div className="edit-icons"
            style={eventlist.userId === user?.uid ?{display:"block"} : {display:"none"}}
           >
           <BiTrash 
            style={!openEventMenu? {display:"none"}:{display:"block"}}
              onClick={() => removeItem(eventlist.id)}
            />
            <BiPen
              style={!openEventMenu? {display:"none"}:{display:"block"}}
            onClick={() =>edit(eventlist.id)}/>
           </div>
            <div onClick={() =>setOpenEventMenu(true)}
            style={eventlist.userId === user?.uid ?{display:"block"} : {display:"none"}}
            >
              <b>.</b>
              <b>.</b>
              <b>.</b>
            </div>
          </div>
          <form
            className="edit-form"
          id={`event${eventlist.id}`}             
        action=""
        style={!editEvent? {display:"none"}:{display:"block"}}
        onSubmit={(event) => {
          event.preventDefault();
          // handleAddToEvent();
        }}
        // style={eventButton? {display:"block"} : {display:"none"}}
      >
        {/* <ToastContainer position="top-center" autoClose={3000} /> */}

        {/* {errData.title && <p style={{ color: "red" }}>{errData.title}</p>} */}
<textarea
        value={updatedd.eventTitle}
        onChange={handleChange}
        placeholder="Create event"
        rows="5"
        cols="30"
        name='eventTitle'
      />
        {/* {errData.startDate && <p style={{ color: "red" }}>{errData.startDate}</p>} */}
        {/* {errData.endDate && <p style={{ color: "red" }}>{errData.endDate}</p>} */}
       {/* {errData.startTime && <p style={{ color: "red" }}>{errData.startTime}</p>} */}
       <div className='event-time'>
       <div style={{borderBottom:" 1px solid rgb(206, 205, 205)"}}>
        {/* <input type='' name="" id="" /> */}
        <label htmlFor="startDate"><b>Starts:</b>
         </label>
         <input type="date" name="startDate"
         value={updatedd.startDate} required
         onChange={handleChange}
         id="eventDate" placeholder={"date"}/>
        <input type="time" name="startTime" 
        id="" value={updatedd.startTime} required
        onChange={handleChange}
        />
        </div>
        {/* {errData.endTime && <p style={{ color: "red" }}>{errData.endTime}</p>} */}

       <div >
         <label htmlFor="endDate"><b>End:</b>
         </label>
         <input type="date" name="endDate"
         value={updatedd.endDate} required
         onChange={handleChange}
         id="eventDate" placeholder={"date"}/>
         <input type="time" name="endTime"
         id="" value={updatedd.endTime} required
         onChange={handleChange}/>
       </div>
       </div>
               {/* {errData.eventCountry && <p style={{ color: "red" }}>{errData.eventCountry}</p>} */}
       <div id='location'>
       <select value={updatedd.eventCountry} name='eventCountry' onChange={handleChange}>
      <option value="" name='eventCountry'>-- Select Country --</option>
      {countries.map((eventCountry, index) => (
        <option key={index} value={eventCountry}>
          {eventCountry}
        </option>
      ))}
    </select>
    <select value={updatedd.eventState} name='eventState' onChange={handleChange}>
      <option value="">-- Select State --</option>
      {nigeriaStates.map((eventState, index) => (
        <option key={index} value={eventState}>
          {eventState}
        </option>
      ))}
    </select>
       </div>
               {/* {errData.address && <p style={{ color: "red" }}>{errData.address}</p>} */}
       <div className="address">
       <label htmlFor="address">Address:</label>
       <input type="text" id="address" name='address' 
       value={updatedd.
       address}
        onChange={handleChange} 
        placeholder="Event's address"/>
       </div>
       <input 
         className="submit-btn" type="submit" 
        onClick={() => UpdateEvent (eventlist.id)} value={"Save"} />
      </form>
          </section>
))}
          </>
          }


 
        </div>
        </>
    )
}

export default Eventlist