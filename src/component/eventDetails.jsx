import { arrayRemove, arrayUnion, collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { auth, db } from '../config/firebase';
import { BiLogOut, BiSolidLocationPlus, BiTime } from 'react-icons/bi';

function EventDetails() {
    const navigate =useNavigate()
    const [displayValue, setDisplayValue] = useState(0);
    const params = useParams();
    const [eventlist,setEventlist] =useState([])
    const [loading, setLoading] = useState(true);
const user=auth.currentUser
    useEffect(() => {
        const fetchEvents = async () => {
          try {
            const querySnapshot = await getDocs(collection(db, "events"));
            const eventsData = querySnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            setEventlist(eventsData);
            setLoading(false)
          } catch (error) {
          };
        }
          fetchEvents();
      }, []);
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

  const id = params.id;
    const eventt = eventlist.filter((item) => {
        return item.id == id;
      });
      console.log(id)
      console.log(loading)

        !loading?  console.log(eventt):console.log(eventt)
        const checkUser =localStorage.getItem("oldUser")

        // to RSVP
const rsvp=async(itemId) =>{
  // console.log(eventlist.guest) 
  try {
    const ref = doc(db, "events", itemId);
    await updateDoc(ref, {
      guest: arrayUnion(user.email),
    });
    console.log(`who rsvp:${user.email}` );
    console.log(ref) 
    // navigate("/");
    window.location.href=id 
  }
   catch (error) {
  console.error("Error updating event:", error); 
  } 
}

// to cancle RSVP
const cancleRsvp=async(itemId) =>{
  // console.log(eventlist.guest) 
  try {
    const ref = doc(db, "events", itemId);
    await updateDoc(ref, {
      guest: arrayRemove(user.email),
    });
    console.log(`who rsvp:${user.email}` );
    console.log(ref) 
    // navigate("/");
    window.location.href=id 
  }
   catch (error) {
  console.error("Error updating event:", error); 
  } 
}
// to log out
const handleLogout = async () => {
  const auth = getAuth();

  try {
    await signOut(auth);
    // console.log("User signed out successfully!");
    window.location.href = "/login";
    localStorage.removeItem("oldUser")
  } catch (error) {
    console.error("Error signing out:", error);
  }
};
      return (
        <> 
        {checkUser? <div className="container" >
          <div className="grt">
            <h2><Link to={"/"}>Home</Link></h2>
           <div>
           {/* <BiBell style={notify? {backgroundColor:"red"}: {color:"blue"}}/> */}
            <button >{formatMonth(date)} {formatDate(date)}</button>
            <BiLogOut className="logout" onClick={handleLogout}/>
           </div>
          </div>
          {loading? <div className="spinner"></div>:
          <>
            <section className="event-container">
           <div className="eventt">
             <div className="event today">
            <div className="date">
              <span className="month">{formatMonth(eventt[0].startDate)}</span>
              <b>{formatDate(eventt[0].startDate)}</b>
              <span>{formatDay(eventt[0].startDate)}</span>
            </div>
            <div className="details">
              <b className="title">{(eventt[0].eventTitle.slice(0,25)+ "..." )}</b>
              <p><BiTime className="icon"/> <span>{formatTime(eventt[0].startTime)}</span> - 
               <span style={{color: "blue"}}> {formatTime(eventt[0].endTime)}</span></p>
               <p> <BiSolidLocationPlus className="icon"/><span>{eventt[0].address}</span></p>

              <p><BiSolidLocationPlus className="icon"/> 
              <span>{(eventt[0].eventState + " State")}, {(eventt[0].eventCountry)}</span>
              </p>
            </div>
          </div>
          {/* <div className="titleDetails">
            <p>{eventt[0].eventTitle}</p>
          </div> */}
             <div className="viewDet">
              <button className="view" style={{visibility:"hidden"}}>
                View details
              </button>
             {!eventt[0].guest.includes(user.email)?          
             <button
             style={eventt[0].userId !== user?.uid ?{display:"block"} : {display:"none"}}

             onClick={() =>rsvp (eventt[0].id)}>RSVP</button>
:
          <button
          style={eventlist[0].userId !== user?.uid ?{display:"block"} : {display:"none"}}
           onClick={() =>cancleRsvp (eventt[0].id)}>Cancel RSVP</button>
 }
             </div>
           </div>
          </section>
          
          </>
          }


 
        </div>: navigate("/login")}
        
        </>
    )
}

export default EventDetails
