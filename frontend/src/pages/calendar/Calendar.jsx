import React, { useEffect, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import AddEventModal from './AddEventModal';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import multiMonthPlugin from '@fullcalendar/multimonth';

import { Navigate, useParams } from 'react-router-dom'
import { v4 as uuid } from 'uuid'
import { backendURL, send } from '../../global/request';

const Calendar = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const calendarRef = useRef(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const { id } = useParams();
  console.log('rendered')
  useEffect(
    () => {
      //fetch data here
      try{
        console.log('start')
        const getData = async ( databaseId ) => {
          const res = await send.get(
            backendURL + '/data/getContent' , {
              params : {
                databaseId : databaseId
              }
            }
          )
          console.log(res)
          if(res.status == 201){
            setEvents([])
          }
          if(res.status == 200){
            setEvents(res.data.data)
          }
        }
        getData(id)
        console.log('end')
      }
      catch (e){
        console.log(e)
      }
     
    }
    
    ,
    [id]
  )
  useEffect(
    () => {
      const sendData = ( databaseId ) => {
        console.log('saving')
        try{
          send.post(backendURL + '/data/saveContent' ,
          {
            data : {
              databaseId : databaseId,
              content : events,
              filetype : 'calendar',
            }
          })
        }
        catch(e){
          console.log(e)
        }
      }
      sendData(id)
    },
    [events,id]
  )
 
  const onEventAdded = (event) => {
    console.log(event)
    setEvents([...events , { 
       key : uuid(),      
      ...event
    }])
    setModalOpen(false);
  };

  const handleEventDeleted = (key) => {
    if (selectedEvent) {
      const updatedEvents = events.filter((event) => (event.key != key))
      setEvents([...updatedEvents])
      setModalOpen(false);
    }
  };

  const customButtons = {
    monthButton: {
      text: 'Month',
      click: () => changeView('dayGridMonth'),
    },
    weekButton: {
      text: 'Week',
      click: () => changeView('timeGridWeek'),
    },
    dayButton: {
      text: 'Day',
      click: () => changeView('timeGridDay'),
    },
    listButton: {
      text: 'List',
      click: () => changeView('listWeek'),
    },
    yearButton: {
      text: 'Year',
      click: () => changeView('multiMonthYear'),
    },
  };

  const changeView = (viewName) => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.changeView(viewName);
  };

  const handleDateClick = (arg) => {
    setModalOpen(true);
  };

  const handleEventClick = (event) => {
    const updatedEvent = {
      key : event.event.extendedProps.key,
      start : event.event.start,
      end : event.event.end,
      title : event.event.title,
      color : event.event.backgroundColor,
      reminderTime : event.event.extendedProps.reminderTime, 
    }
    setSelectedEvent(updatedEvent);
    setModalOpen(true);
  };

  const handleEventChange = (event) => {
    const calendarApi = calendarRef.current.getApi();
    const updatedEvent = {
      key : event.event.extendedProps.key,
      start : event.event.start,
      end : event.event.end,
      title : event.event.title,
      color : event.event.backgroundColor,
      reminderTime : event.event.extendedProps.reminderTime, 
    }
    for( let i = 0 ; i < events.length ; i++ ){
      if( updatedEvent.key == events[i].key ){
        events[i] = updatedEvent
      }
    }
    setEvents([...events])
    //update the event here
  }
  const onEventUpdate = (event) => {
    console.log(event)
    for( let i = 0 ; i < events.length ; i++ ){
      if( event.key == events[i].key ){
        events[i] = event
        console.log('found and updated')
        console.log(events[i])
      }
    }
    setEvents([...events])
    window.location.reload()
  }
  return (
    <section
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        padding: '20px',
      }}
    >
      <button
        onClick={() => {
          setSelectedEvent(null);
          setModalOpen(true);
        }}
        style={{
          backgroundColor: '#4CAF50',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px',
          marginBottom: '20px',
        }}
      >
        Add Event
      </button>

      <div
        style={{
          position: 'relative',
          zIndex: 0,
          width: '100%', 
          maxWidth: '800px', 
          maxHeight: '800px',
        }}
      >
        <FullCalendar
          ref={calendarRef}
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            listPlugin,
            interactionPlugin,
            multiMonthPlugin,
          ]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'monthButton,weekButton,dayButton,listButton,yearButton',
          }}
          customButtons={customButtons}
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          eventResizable={true} 
          eventResizableFromStart={true} 
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          eventChange={handleEventChange}
          events={events}
          // Set events explicitly
        />
      </div>

      <AddEventModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedEvent(null);
        }}
        onEventAdded={(event) => onEventAdded(event)}
        onEventUpdate={(event) => onEventUpdate(event)}
        onDelete={handleEventDeleted}
        event={selectedEvent}
      />
    </section>
  );
};


export function RedirectCalendar ( ){

    return (
        <Navigate to={`/calendar/${uuid()}`}></Navigate>
    )
}
export default Calendar;
