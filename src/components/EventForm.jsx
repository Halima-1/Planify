import React, { useState, useRef } from 'react'
import { getNames } from "country-list";
import { BiChevronRight, BiChevronLeft, BiCheckCircle, BiCalendarEvent, BiMapAlt, BiDetail, BiImageAdd, BiTrash } from 'react-icons/bi';
import './CreateEvent.scss';

export const countries = getNames();
export const nigeriaStates = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
  "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu",
  "FCT - Abuja", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina",
  "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo",
  "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
];

const sanitizeFileName = (name) => {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[()]/g, "")
    .replace(/[^\w.-]/g, "");
};

function EventForm({ initialData, onSubmit, onCancel, submitLabel = "Publish Event", loading = false }) {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef();
  const totalSteps = 3;

  const [formData, setFormData] = useState(initialData || {
    eventTitle: "",
    startTime: "12:00",
    startDate: new Date().toISOString().split('T')[0],
    endTime: "13:00",
    endDate: new Date().toISOString().split('T')[0],
    eventCountry: "Nigeria",
    eventState: "Lagos",
    address: "",
    policy: "",
    imageUrl: ""
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(initialData?.imageUrl || "");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Only image files are allowed");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be less than 2MB");
      return;
    }

    const cleanName = sanitizeFileName(file.name);
    const cleanedFile = new File([file], cleanName, { type: file.type });

    setImageFile(cleanedFile);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(cleanedFile);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
    setFormData({ ...formData, imageUrl: "" });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validateStep = (s = step) => {
    const newErrors = {};

    if (s === 1 && !formData.eventTitle.trim()) {
      newErrors.eventTitle = "Please give your event a title";
    }

    if (s === 2) {
      if (!formData.startDate) {
        newErrors.startDate = "Date is required";
      }

      const start = new Date(`${formData.startDate}T${formData.startTime}`);
      const end = new Date(`${formData.endDate}T${formData.endTime}`);

      if (end <= start) {
        newErrors.endTime = "Ending time must be after the start";
      }
    }

    if (s === 3 && !formData.address.trim()) {
      newErrors.address = "Venue address is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) setStep(prev => prev + 1);
  };

  const prevStep = () => setStep(prev => prev - 1);

  const handleTabClick = (s) => {
    if (s < step) setStep(s);
    else if (s === step + 1 && validateStep()) setStep(s);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateStep(3)) {
      // 🚀 pass cleaned file
      onSubmit(formData, imageFile);
    }
  };

  return (
    <div className="event-form-container">

      <div className="progress-bar">
        <div style={{ width: `${(step / 3) * 100}%` }}></div>
      </div>

      <div className="tab-navigation">
        <div className={`tab ${step === 1 ? 'active' : ''}`} onClick={() => handleTabClick(1)}>
          <BiDetail /> Basics
        </div>
        <div className={`tab ${step === 2 ? 'active' : ''}`} onClick={() => handleTabClick(2)}>
          <BiCalendarEvent /> Timing
        </div>
        <div className={`tab ${step === 3 ? 'active' : ''}`} onClick={() => handleTabClick(3)}>
          <BiMapAlt /> Venue
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="modal-body-content">

          {step === 1 && (
            <div className="step-content">

              <div className="image-upload-section">
                <label>Event Flier</label>

                <div
                  className={`image-dropzone ${imagePreview ? 'has-image' : ''}`}
                  onClick={() => fileInputRef.current.click()}
                >
                  {imagePreview ? (
                    <div className="preview-container">
                      <img src={imagePreview} alt="Event Flier" />

                      <button
                        type="button"
                        className="remove-img-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage();
                        }}
                      >
                        <BiTrash />
                      </button>
                    </div>
                  ) : (
                    <div className="upload-placeholder">
                      <BiImageAdd className="icon" />
                      <span>Click to upload event flier</span>
                      <p>JPG, PNG or WEBP (Max 2MB)</p>
                    </div>
                  )}

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    hidden
                  />
                </div>
              </div>

              <div className={`form-group ${errors.eventTitle ? 'has-error' : ''}`}>
                <label>Event Title</label>
                <input
                  type="text"
                  name="eventTitle"
                  value={formData.eventTitle}
                  onChange={handleChange}
                  placeholder="Grand Wedding, Tech Expo, etc."
                />
                {errors.eventTitle && <span className="error-text">{errors.eventTitle}</span>}
              </div>

              <div className="form-group">
                <label>Event Details & Policy</label>
                <textarea
                  name="policy"
                  value={formData.policy}
                  onChange={handleChange}
                  placeholder="Tell your guests what to expect..."
                />
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="step-content">
              <div className="form-row">
                <div className={`form-group ${errors.startDate ? 'has-error' : ''}`}>
                  <label>Start Date</label>
                  <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} />
                  {errors.startDate && <span className="error-text">{errors.startDate}</span>}
                </div>

                <div className="form-group">
                  <label>Start Time</label>
                  <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>End Date</label>
                  <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} />
                </div>

                <div className={`form-group ${errors.endTime ? 'has-error' : ''}`}>
                  <label>End Time</label>
                  <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} />
                  {errors.endTime && <span className="error-text">{errors.endTime}</span>}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="step-content">
              <div className="form-row">
                <div className="form-group">
                  <label>Country</label>
                  <select name="eventCountry" value={formData.eventCountry} onChange={handleChange}>
                    {countries.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label>State / Region</label>
                  <select name="eventState" value={formData.eventState} onChange={handleChange}>
                    {nigeriaStates.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className={`form-group ${errors.address ? 'has-error' : ''}`}>
                <label>Venue Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Complete venue address..."
                />
                {errors.address && <span className="error-text">{errors.address}</span>}
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="modal-footer-content">
          {step > 1 ? (
            <button type="button" className="action-btn back" onClick={prevStep}>
              <BiChevronLeft /> Back
            </button>
          ) : (
            <button type="button" className="action-btn cancel" onClick={onCancel}>
              Cancel
            </button>
          )}

          {step < totalSteps ? (
            <button type="button" className="action-btn next" onClick={nextStep}>
              Continue <BiChevronRight />
            </button>
          ) : (
            <button type="submit" className="action-btn publish" disabled={loading}>
              {loading ? "Uploading & Saving..." : <><BiCheckCircle /> {submitLabel}</>}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default EventForm;