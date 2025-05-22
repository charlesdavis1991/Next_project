import React, { useEffect, useState,useCallback } from 'react'
import avatarImage from './../../assets/images/avatar.svg';
import { useSelector } from "react-redux";
import api from "../../api/api";
import axios from 'axios';
import NotesEventRow from './NotesEventRow';
import NoteEventModal from './NoteEventModal';

export default function NotesEventBlock({eventLogData,Aba_utbmsData,fetchEventLogData}) {
  const origin = process.env.REACT_APP_BACKEND_URL;
  const node_env = process.env.NODE_ENV
  const media_origin = node_env === 'production'? "": process.env.REACT_APP_BACKEND_URL;
  
  const [showEventModal, setshowEventModal] = useState(false);
  const [selectedEventLog, setselectedEventLog] = useState(null);
  
  const handleShowModal = () => {    
    setshowEventModal(prevState => !prevState)
  };
  const handleSelectedEventLog = (item) => {    
    setselectedEventLog(item)
  };
  const handleRowClick = useCallback((eventLog) => {
    handleShowModal();
    handleSelectedEventLog(eventLog);
  }, [handleShowModal, handleSelectedEventLog]);
  return (
      <>
      <NoteEventModal eventLog={selectedEventLog} Aba_utbmsData={Aba_utbmsData} handleShowModal={handleShowModal} showEventModal={showEventModal} fetchEventLogData={fetchEventLogData} />
      
      <div class="tab-pane active show" id="event-log" role="tabpanel" aria-labelledby="event-log-tab">
          <div class="table--no-card rounded-0 border-0 w-100  invisible-scroll" id="table-height-event" >
            <table class="table table-borderless table-striped table-earning has-height-25 fixed-table-header-notes-page">
              <thead>
                <tr>
                  <th class="table-col-1 note-col-1 x1 width-36" scope="col" ></th>
                  <th class="note-col-2 x2 text-uppercase" >Date</th>
                  <th class="note-col-3 x3 text-uppercase" >Time</th>
                  <th class="td-autosize note-col-4 x4 text-uppercase" >Worker- Click to Chat</th>
                  <th class="notes-col note-col-5 x5 text-uppercase" >Event</th>
                  <th class="note-col-7 x6 text-uppercase">Code Category</th>
                  <th class="note-col-7 x7 text-uppercase">Category Name</th>
                  <th class="note-col-7 x8 text-uppercase">Code</th>
                  <th class="note-col-7 x9 text-uppercase">Code Name</th>
                  <th class="note-col-7 x10 text-uppercase">Code Description</th>
                  <th class="note-col-6 x11 text-uppercase" >Page</th>
                  <th class="note-col-6 x11 text-uppercase" >Note</th>
                  <th class="note-col-6 x11 text-uppercase" >Firm User</th>
                  <th class="note-col-6 x11 text-uppercase" >Date and Time</th>
                  


                </tr>
              </thead>
              <tbody class="fixed_column_width" id="event-log-tab-tbody">
                {eventLogData.map((event_log, index) => (
                  <NotesEventRow key={index} eventLog= {event_log} index = {index} handleShowModal={handleShowModal} handleRowClick={handleRowClick} />
                ))}
              </tbody>
            </table>
        </div>
      </div>
      </>

  )
}
