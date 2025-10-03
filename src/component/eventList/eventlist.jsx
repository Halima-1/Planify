import { useEffect, useState } from "react"
import "./eventlist.scss"
import { collection, deleteDoc, doc, getDocs, getFirestore, onSnapshot } from "firebase/firestore";
import { db } from "../../config/firebase";
import { getAuth, onAuthStateChanged, updateCurrentUser } from "firebase/auth";
import {BiPlus, BiTime, BiTrash} from "react-icons/bi"
import { BiSolidLocationPlus } from "react-icons/bi";


const Eventlist =({eventButton,toggleEventBtn}) =>{
  
    const [eventlist,setEventList] =useState([])
    const [loading, setLoading] = useState(true);
    const [upcomingEvent, setUpcomingEvent] =useState([])
    const [pastEvent, setPastEvent] =useState([])

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
            setEventList(eventsData);

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
setLoading(false)

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
const today = eventlist.filter((item) => format(item.startDate) == format(date) )

console.log(today)
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
    return(
        <>
        <div className="event-container" 
        style={eventButton? {display:"none"}: {display: "block"}}>
          <div className="grt">
            <h2>Welcome back</h2>
            <button >{formatMonth(date)} {formatDate(date)}</button>
          </div>
          <div className="search">
            <></>
          <input type="text" />
          </div>
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
            <BiTrash 
            style={eventlist.userId === user?.uid ?{display:"block"} : {display:"none"}}
            onClick={() => removeItem(eventlist.id)}/>
            <div>
            </div>
          </div>
)) : upcomingEvent.map((eventlist,index) =>(
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
  <BiTrash 
            style={eventlist.userId === user?.uid ?{display:"block"} : {display:"none"}}
            onClick={() => removeItem(eventlist.id)}/>
  <div>
  </div>
</div>
))}
          </>
          }


 <button style={eventButton? {visibility:"hidden"}:{visibility:"visible"}}
             onClick={toggleEventBtn}><BiPlus/> Create Event</button>
        </div>
        </>
    )
}

export default Eventlist