import React, { useState } from 'react'
import { supabase } from '../config/supabase';

import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { BiX } from 'react-icons/bi';
import EventForm from './EventForm';
import './CreateEvent.scss';

function CreateEvent({ eventButton, toggleEventBtn, setNotify }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleCreate = async (formData, imageFile) => {
    if (!user) {
      alert("Please log in");
      return;
    }

    setLoading(true);

    try {
      let imageUrl = "";

      if (imageFile) {
        const cleanFileName = `${user.id}/${Date.now()}_${imageFile.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;

        const { data, error: uploadError } = await supabase.storage
          .from("event-fliers")
          .upload(cleanFileName, imageFile, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error("Storage upload error:", uploadError);
          throw new Error(`Image upload failed: ${uploadError.message}`);
        }

        const { data: urlData } = supabase.storage
          .from("event-fliers")
          .getPublicUrl(cleanFileName);

        imageUrl = urlData.publicUrl;
      }

      const { data: dbData, error: dbError } = await supabase
        .from("events")
        .insert([
          {
            event_title: formData.eventTitle,
            start_date: formData.startDate,
            start_time: formData.startTime,
            end_date: formData.endDate,
            end_time: formData.endTime,
            event_country: formData.eventCountry,
            event_state: formData.eventState,
            address: formData.address,
            policy: formData.policy,
            image_url: imageUrl,
            user_id: user.id, // Supabase uses .id
          }
        ])
        .select();

      if (dbError) {
        console.error("Database insert error:", dbError);
        throw new Error(`Event creation failed: ${dbError.message}`);
      }

      toast.success("Event created successfully! 🎉");
      if (setNotify) setNotify(prev => !prev);
      if (toggleEventBtn) toggleEventBtn();
      
    } catch (err) {
      console.error("Create Event error:", err);
      toast.error(err.message || "Something went wrong creating the event");
    } finally {
      setLoading(false);
    }
  };

  if (!eventButton) return null;

  return (
    <div className="create-event-overlay" onClick={toggleEventBtn}>
      <div className="create-event-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={toggleEventBtn} title="Close"><BiX /></button>

        <div className="modal-header-simple">
          <h2>Create New Event</h2>
        </div>

        <EventForm
          onSubmit={handleCreate}
          onCancel={toggleEventBtn}
          loading={loading}
          submitLabel="Launch Event"
        />

        <ToastContainer position="top-center" autoClose={2000} />
      </div>
    </div>
  );
}

export default CreateEvent;
