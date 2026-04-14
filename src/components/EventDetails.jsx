import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { BiSolidLocationPlus, BiTime, BiCalendar, BiArrowBack, BiImage } from 'react-icons/bi';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabase';
import './EventDetails.scss';

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 FETCH SINGLE EVENT FROM SUPABASE
  useEffect(() => {
    if (!id) return;

    const fetchEvent = async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching event:", error);
      } else {
        setEventData(data);
      }

      setLoading(false);
    };

    fetchEvent();
  }, [id]);

  // 🕒 FORMAT TIME
  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    const [hour, minute] = timeStr.split(":");
    let h = parseInt(hour, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h}:${minute} ${ampm}`;
  };

  // 📅 FORMAT DATE
  const formatDateFull = (dateStr) => {
    const d = new Date(dateStr);
    return isNaN(d.getTime())
      ? dateStr
      : d.toLocaleDateString("en-US", {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
  };

  // ✅ RSVP (ADD USER)
  const rsvp = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    const currentGuests = eventData.guest || [];

    // prevent duplicate RSVP
    if (currentGuests.includes(user.email)) return;

    const updatedGuests = [...currentGuests, user.email];

    const { error } = await supabase
      .from("events")
      .update({ guest: updatedGuests })
      .eq("id", id);

    if (error) {
      console.error("RSVP error:", error);
    } else {
      setEventData(prev => ({ ...prev, guest: updatedGuests }));
    }
  };

  // ❌ CANCEL RSVP
  const cancelRsvp = async () => {
    if (!user) return;

    const updatedGuests = (eventData.guest || []).filter(
      g => g !== user.email
    );

    const { error } = await supabase
      .from("events")
      .update({ guest: updatedGuests })
      .eq("id", id);

    if (error) {
      console.error("Cancel RSVP error:", error);
    } else {
      setEventData(prev => ({ ...prev, guest: updatedGuests }));
    }
  };

  // ⏳ LOADING
  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  // ❌ NOT FOUND
  if (!eventData) {
    return (
      <div className="container">
        <h2>Event not found</h2>
        <Link to="/">Go back home</Link>
      </div>
    );
  }

  return (
    <div className="event-details-page">

      <button className="back-btn" onClick={() => navigate("/")}>
        <BiArrowBack /> Back to Dashboard
      </button>

      <div className="details-card">

        {/* 🖼 IMAGE */}
        {eventData.image_url ? (
          <div className="details-hero">
            <img src={eventData.image_url} alt={eventData.event_title} />
          </div>
        ) : (
          <div className="details-hero placeholder">
            <BiImage className="icon" />
            <span>No Event Flier</span>
          </div>
        )}

        {/* HEADER */}
        <div className="details-header">
          <div className="category-tag">Social Event</div>
          <h1 className="event-title">{eventData.event_title}</h1>

          <div className="header-meta">
            <div className="meta-item">
              <BiCalendar className="icon" />
              <span>{formatDateFull(eventData.start_date)}</span>
            </div>

            <div className="meta-item">
              <BiTime className="icon" />
              <span>
                {formatTime(eventData.start_time)} - {formatTime(eventData.end_time)}
              </span>
            </div>
          </div>
        </div>

        {/* MAIN */}
        <div className="details-main">

          <section className="info-section">
            <h3>About this event</h3>
            <p>
              {eventData.policy ||
                "No specific policy provided for this event. Please coordinate with the host for further details."}
            </p>
          </section>

          <section className="info-section">
            <h3>Venue & Map</h3>

            <div
              className="location-box"
              onClick={() =>
                window.open(
                  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(eventData.address)}`,
                  "_blank"
                )
              }
            >
              <BiSolidLocationPlus className="icon" />
              <div>
                <p className="address-text">{eventData.address}</p>
                <p className="region-text">
                  {eventData.event_state}, {eventData.event_country}
                </p>
              </div>
            </div>
          </section>

          <section className="info-section">
            <h3>RSVP Status</h3>
            <p className="guest-count">
              <b>{eventData.guest?.length || 0}</b> people are attending
            </p>
          </section>

        </div>

        {/* FOOTER */}
        <div className="details-footer">

          {eventData.guest?.includes(user?.email) ? (
            <button className="rsvp-btn cancel" onClick={cancelRsvp}>
              Cancel My RSVP
            </button>
          ) : (
            user?.id !== eventData.user_id && (
              <button className="rsvp-btn join" onClick={rsvp}>
                Join Event
              </button>
            )
          )}

          {user?.id === eventData.user_id && (
            <p className="host-note">You are managing this event.</p>
          )}

        </div>

      </div>
    </div>
  );
}

export default EventDetails;