import { useEffect, useState } from "react"
import "./EventList.scss"
import { supabase } from "../../config/supabase"
import { BiCheckDouble, BiCopy, BiPencil, BiPlus, BiTime, BiTrash, BiSolidLocationPlus, BiCalendarX, BiX, BiImage } from "react-icons/bi"
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import EventForm from "../EventForm";

const EventList = ({ eventButton, toggleEventBtn, notify }) => {
  const [eventList, setEventList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [upcomingEvent, setUpcomingEvent] = useState([]);
  const [displayBtn, setDisplayBtn] = useState(true);
  const [copiedId, setCopiedId] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [updating, setUpdating] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuth();
  const date = new Date();

  const fetchEvents = async () => {
    setLoading(true);
    const { data: events, error } = await supabase.from("events").select("*");
    if (error) {
      console.error("Error fetching events:", error);
      setLoading(false);
      return;
    }

    if (events) {
      const eventsData = events.map(doc => ({
        id: doc.id,
        eventTitle: doc.event_title,
        startDate: doc.start_date,
        startTime: doc.start_time,
        endDate: doc.end_date,
        endTime: doc.end_time,
        eventCountry: doc.event_country,
        eventState: doc.event_state,
        address: doc.address,
        policy: doc.policy,
        imageUrl: doc.image_url,
        userId: doc.user_id,
        guest: doc.guest || []
      }));

      const toDate = (dateString) => dateString ? new Date(dateString + "T00:00:00") : null;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      setEventList(eventsData);
      setUpcomingEvent(eventsData.filter(ev => toDate(ev.startDate) > today));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();

    const channel = supabase
      .channel('public:events')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, payload => {
        fetchEvents();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [notify]);

  const formatDate = (dateVal) => {
    const d = new Date(dateVal);
    return isNaN(d.getTime()) ? "" : d.toLocaleDateString("en-US", { day: "numeric" });
  };

  const formatMonth = (dateVal) => {
    const d = new Date(dateVal);
    return isNaN(d.getTime()) ? "" : d.toLocaleDateString("en-US", { month: "short" });
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    const [hour, minute] = timeStr.split(":");
    let h = parseInt(hour, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h}:${minute} ${ampm}`;
  };

  const removeItem = async (itemId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        const { error } = await supabase.from("events").delete().eq("id", itemId);
        if (error) throw error;
        setEventList(prev => prev.filter(e => e.id !== itemId));
        setUpcomingEvent(prev => prev.filter(e => e.id !== itemId));
      } catch (err) {
        console.error("Error deleting event:", err);
      }
    }
  };

  const handleUpdate = async (updatedData, imageFile) => {
    setUpdating(true);
    try {
      let imageUrl = updatedData.imageUrl;

      if (imageFile) {
        const fileName = `${user.id}_${Date.now()}_${imageFile.name}`;
        const { error: uploadError } = await supabase.storage.from("event-fliers").upload(fileName, imageFile);
        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage.from("event-fliers").getPublicUrl(fileName);
        imageUrl = urlData.publicUrl;
      }

      const { error } = await supabase.from("events").update({
        event_title: updatedData.eventTitle,
        start_date: updatedData.startDate,
        start_time: updatedData.startTime,
        end_date: updatedData.endDate,
        end_time: updatedData.endTime,
        event_country: updatedData.eventCountry,
        event_state: updatedData.eventState,
        address: updatedData.address,
        policy: updatedData.policy,
        image_url: imageUrl
      }).eq("id", editingEvent.id);
      
      if (error) throw error;
      setEditingEvent(null);
      fetchEvents();
    } catch (error) {
      console.error("Error updating event:", error);
    } finally {
      setUpdating(false);
    }
  };

  const rsvp = async (itemId) => {
    if (!user) return alert("Please log in to RSVP");
    try {
      const event = eventList.find(e => e.id === itemId);
      const guestList = event.guest || [];
      if (guestList.includes(user.email)) return;
      
      const newGuestList = [...guestList, user.email];
      const { error } = await supabase.from("events").update({ guest: newGuestList }).eq("id", itemId);
      if (error) throw error;
      fetchEvents();
    } catch (error) {
      console.error("Error RSVPing:", error);
    }
  };

  const cancelRsvp = async (itemId) => {
    if (!user) return;
    try {
      const event = eventList.find(e => e.id === itemId);
      const guestList = event.guest || [];
      const newGuestList = guestList.filter(email => email !== user.email);
      
      const { error } = await supabase.from("events").update({ guest: newGuestList }).eq("id", itemId);
      if (error) throw error;
      fetchEvents();
    } catch (error) {
      console.error("Error canceling RSVP:", error);
    }
  };

  const copyLink = (id, link) => {
    navigator.clipboard.writeText(link).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 3000);
    });
  };

  const todayEvents = eventList.filter(item => {
    const d = new Date(item.startDate);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  });

  const renderEvent = (event) => (
    <article className="event-card" key={event.id} onClick={() => navigate(`/event/${event.id}`)}>
      <div className="card-media">
        {event.imageUrl ? (
          <img src={event.imageUrl} alt={event.eventTitle} loading="lazy" />
        ) : (
          <div className="media-placeholder">
            <BiImage className="icon" />
            <span>No Flier</span>
          </div>
        )}
      </div>

      <div className="card-header">
        <div className="date-badge">
          <span className="month">{formatMonth(event.startDate)}</span>
          <span className="day">{formatDate(event.startDate)}</span>
        </div>
        <div className="event-info">
          <h3 className="title">{event.eventTitle}</h3>
          <div className="time-info">
            <BiTime className="icon" />
            <span>{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
          </div>
        </div>
      </div>

      <div className="card-body">
        <div className="location-info">
          <BiSolidLocationPlus className="icon" />
          <span>{event.address}, {event.eventState}</span>
        </div>
      </div>

      <div className="card-footer" onClick={(e) => e.stopPropagation()}>
        <div className="link-actions">
          <span>Get Link</span>
          {copiedId === event.id ?
            <BiCheckDouble className="icon-btn" style={{ color: 'var(--primary)' }} /> :
            <BiCopy className="icon-btn" onClick={() => copyLink(event.id, `${window.location.origin}/event/${event.id}`)} />
          }
        </div>
        {event.guest?.includes(user?.email) ? (
          <button className="rsvp-btn cancel" onClick={() => cancelRsvp(event.id)}>Cancel RSVP</button>
        ) : (
          user?.id !== event.userId && <button className="rsvp-btn join" onClick={() => rsvp(event.id)}>RSVP</button>
        )}
      </div>

      {event.userId === user?.id && (
        <div className="admin-actions" onClick={(e) => e.stopPropagation()}>
          <button className="action-btn" onClick={() => setEditingEvent(event)} title="Edit Event"><BiPencil /></button>
          <button className="action-btn delete" onClick={() => removeItem(event.id)} title="Delete Event"><BiTrash /></button>
        </div>
      )}
    </article>
  );

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="welcome-text">Your Dashboard</h1>
        <div className="current-date">
          <span>{date.toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>

      <div className="actions-bar">
        <div className="tabs">
          <button className={`tab-btn ${displayBtn ? 'active' : ''}`} onClick={() => setDisplayBtn(true)}>Today</button>
          <button className={`tab-btn ${!displayBtn ? 'active' : ''}`} onClick={() => setDisplayBtn(false)}>Upcoming</button>
        </div>
        <button className="btn-primary" onClick={toggleEventBtn}>
          <BiPlus /> Create new event
        </button>
      </div>

      {loading ? (
        <div className="spinner-container"><div className="spinner"></div></div>
      ) : (
        <div className="events-grid">
          {(displayBtn ? todayEvents : upcomingEvent).length > 0 ? (
            (displayBtn ? todayEvents : upcomingEvent).map(renderEvent)
          ) : (
            <div className="empty-state">
              <BiCalendarX className="empty-icon" />
              <h3>No events found</h3>
              <p>{displayBtn ? "Check back later or view your upcoming schedule." : "Ready to plan? Create your first event now!"}</p>
            </div>
          )}
        </div>
      )}

      {editingEvent && (
        <div className="create-event-overlay" onClick={() => setEditingEvent(null)}>
          <div className="create-event-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setEditingEvent(null)}><BiX /></button>
            <div className="modal-header-simple">
              <h2>Edit Event</h2>
            </div>
            <EventForm
              initialData={editingEvent}
              onSubmit={handleUpdate}
              onCancel={() => setEditingEvent(null)}
              submitLabel="Save Changes"
              loading={updating}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EventList;