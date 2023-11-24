import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import styled, { css, createGlobalStyle } from 'styled-components';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

Modal.setAppElement('#root');


const DatePickerWrapperStyles = createGlobalStyle`
    .form_control {
        width: 250px;
    }
`; 
const modalStyle = {
  content: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '800px',
    padding: '0',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    borderRadius: '8px',
    height: '65%',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  header: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '0.5px', // Reduced padding
    textAlign: 'center',
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px',
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    padding: '8px',
    border: 'none',
    background: 'transparent',
    color: 'white',
    fontSize: '16px',
    cursor: 'pointer',
  },
  form: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
};

const colorThemes = [
  {
    label: 'Theme 1 and Theme 2',
    colors: [
      '#2196F3', '#4CAF50', '#F44336', '#FFC107', '#9C27B0', '#FF5722',
      '#00BCD4', 
    ],
  },
  // Add more color themes as needed
];

const AddEventModal = ({ isOpen, onClose, onEventAdded, onDelete, event , onEventUpdate }) => {

  const [title, setTitle] = useState(event != null ? event.title : 'sdfsd');
  const [start, setStart] = useState(event != null ? event.start : new Date());
  const [end, setEnd] = useState(event != null ? event.end : new Date());
  const [reminderTiming, setReminderTiming] = useState(0); 
  const [selectedColor, setSelectedColor] = useState(event != null? event.color : colorThemes[0].colors[0]); 

  useEffect(() => {
    if (!isOpen && !event) {
      setTitle('');
      setStart(new Date());
      setEnd(new Date());
      setReminderTiming(0);
      setSelectedColor(colorThemes[0].colors[0]); 
    }
  }, [isOpen, event]);

  const handleStartDateChange = (date) => {
    setStart(date);
  };

  const handleEndDateChange = (date) => {
    setEnd(date);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const reminderTime = start.getTime() - reminderTiming;
    if( isEditMode == true ){
      console.log('editing')
      onEventUpdate({
        title,
        start,
        end,
        reminderTime,
        color: selectedColor, 
        key : event.key,
      })
    }
    else{
      onEventAdded({
        title,
        start,
        end,
        reminderTime,
        color: selectedColor, 
      });
    }
   
  
    onClose();
  };

  const handleDelete = () => {
    if (event) {
      onDelete(event.key);
      onClose();
    }
  };

  const handleDateClick = (date) => {
    setStart(date);
    setEnd(date);
  };

  const isEditMode = event !== null;

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} style={modalStyle}>
      <div style={modalStyle.header}>
        <h2>{isEditMode ? `Edit Event: ${event.title}` : 'Add Event'}</h2>
        <button style={modalStyle.closeButton} onClick={onClose}>
          X
        </button>
      </div>

      <form onSubmit={onSubmit} style={modalStyle.form}>
        <input
          placeholder="Add Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            marginBottom: '16px',
            fontSize: '14px',
          }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', width: '100%' }}>
          <div style={{ flex: '1', marginRight: '8px' }}>
            <label style={{ marginBottom: '8px', display: 'block', fontSize: '14px' }}>
              Start Date
            </label>
            {
              console.log(title)
            }
            <DatePicker
              selected={start}
              onChange={handleStartDateChange}
              onClick={handleDateClick} 
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="Time"
              dateFormat="MMMM d, yyyy h:mm aa"
              wrapperClassName="form_control" 
            />
            <DatePickerWrapperStyles />
          </div>

          <div style={{ flex: '1', marginLeft: '8px' }}>
            <label style={{ marginBottom: '8px', display: 'block', fontSize: '14px' }}>
              End Date
            </label>
            <DatePicker
              selected={end}
              onChange={handleEndDateChange}
              onClick={handleDateClick} 
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="Time"
              dateFormat="MMMM d, yyyy h:mm aa"
              wrapperClassName="form_control" 
            />
            <DatePickerWrapperStyles />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', width: '100%' }}>
  <div style={{ flex: '1', marginRight: '8px' }}>
    <label style={{ marginBottom: '8px', display: 'block', fontSize: '14px' }}>
      Reminder Timing
    </label>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <input
        type="number"
        value={reminderTiming}
        onChange={(e) => setReminderTiming(e.target.value)}
        style={{
          width: '80px',
          padding: '8px',
          fontSize: '14px',
        }}
      />
      <select
        value="minutes" //daefault value 
        onChange={(e) => console.log('Selected timing unit:', e.target.value)}
        style={{
          marginLeft: '8px',
          padding: '8px',
          fontSize: '14px',
        }}
      >
        <option value="seconds">Seconds</option>
        <option value="minutes">Minutes</option>
        <option value="hours">Hours</option>
        <option value="days">Days</option>
      </select>
    </div>
  </div>

  <div style={{ flex: '1', marginLeft: '8px' }}>
  <label style={{ marginBottom: '8px', display: 'block', fontSize: '14px' }}>
    Event Color Theme
  </label>
  <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
    {colorThemes[0].colors.map((color) => (
      <div
        key={color}
        style={{
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          background: color,
          cursor: 'pointer',
          marginRight: '8px',
          transition: 'transform 0.1s ease-in-out, border 0.1s ease-in-out', 
          border: selectedColor === color ? '2px solid black' : 'none', 
        }}
        onClick={() => setSelectedColor(color)}
        onMouseEnter={(e) => e.target.style.transform = 'scale(1.2)'}
        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
      />
    ))}
  </div>
</div>
</div>


        <div style={{ display: 'flex', marginBottom: '16px', width: '100%' }}>
          <label style={{ marginBottom: '8px', display: 'block', fontSize: '14px', marginRight: '8px' }}>
            Description
          </label>
          <textarea
            style={{
              flex: 1,
              padding: '8px',
              fontSize: '14px',
            }}
          />
        </div>

        <div style={{ display: 'flex' }}>
          {isEditMode && (
            <button
              type="button"
              onClick={handleDelete}
              style={{
                backgroundColor: '#FF0000',
                color: 'white',
                padding: '8px 16px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                marginRight: '10px',
              }}
            >
              Delete Event
            </button>
          )}
          <button
            type="submit"
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            {isEditMode ? 'Save Changes' : 'Add Event'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddEventModal;