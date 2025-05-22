import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import NoteTableContent from "./NoteTableContent";
import NotesEventBlock from "./NotesEventBlock";
import "../../../public/BP_resources/css/notes.css";
import { setSearchNoteId } from "../../Redux/search/searchSlice";
import "./NotesTableComponent.css";

// Notes Table Tabs Component --- M202421051155
const NotesTableComponent = ({
  NotesTableData,
  fetchNotesTableData,
  TableTabsPage,
  fetchTableTabsPage,
  setNotesDataLoad,
}) => {
  const origin = process.env.REACT_APP_BACKEND_URL;
  const currentCase = useSelector((state) => state?.caseData?.current);
  const client = useSelector((state) => state?.client?.current);
  const node_env = process.env.NODE_ENV;
  const media_origin =
    node_env === "production" ? "" : process.env.REACT_APP_BACKEND_URL;
  // const tabsPage = useSelector((state) => state.caseData?.pages);

  // For scolling to a specific report page
  const dispatch = useDispatch();
  const notesRefs = useRef({});
  const containerRef = useRef(null);
  const searchNoteId = useSelector((state) => state.searchS.searchNoteId);

  const [activeTab, setActiveTab] = useState("all");
  const handleActiveTabClick = (item) => {
    setActiveTab(item);
  };

  // Fetching the Event Log Data
  const [EventLogData, setEventLogData] = useState([]);
  const fetchEventLogData = async () => {
    try {
      const event_data = await axios.get(
        origin +
          "/api/notes/notes_event_log_data/" +
          client.id +
          "/" +
          currentCase.id +
          "/"
      );
      setEventLogData(event_data.data);
    } catch (error) {
      console.error("Failed to fetch Event Logs:", error);
    }
  };
  // Fetching the aba_utbms instances from database
  const [Aba_utbmsData, setAba_utbmsData] = useState([]);
  const fetchaba_utbmsData = async () => {
    try {
      const data = await axios.get(origin + "/api/notes/fetch_aba_utbms_data/");
      setAba_utbmsData(data.data);
    } catch (error) {
      console.error("Failed to fetch Aba_utbms:", error);
    }
  };
  useEffect(() => {
    fetchEventLogData();
    fetchaba_utbmsData();
  }, []);

  // For Scrolling to specfic defendant record from redirected from search page
  useEffect(() => {
    // console.log(searchNoteId,'search Note id ...................')
    // Scroll to that specific record
    if (searchNoteId && notesRefs.current[searchNoteId]) {
      const searchRecordElement = notesRefs.current[searchNoteId];
      const containerElement = containerRef.current;

      // Calculate the top offset of the product relative to the container
      const searchRecordOffsetTop = searchRecordElement.offsetTop;
      const containerScrollTop = containerElement.scrollTop;
      const smallScrollAdjustment = 10;

      // Scroll the container to the product with a small adjustment
      containerElement.scrollTo({
        top: searchRecordOffsetTop - containerScrollTop - smallScrollAdjustment,
        behavior: "smooth",
      });
      dispatch(setSearchNoteId(""));
      setNotesDataLoad(true);
    } else {
      console.log("Note not found in the ");
    }
  }, [NotesTableData]);

  return (
    <>
      <nav className="notes-nav-tabs p-l-15 ">
        <div
          className="nav nav-tabs d-flex-lg-1  p-l-2p"
          id="nav-tab-account-checks"
          role="tablist"
        >
          <a
            className="nav-item nav-link  active show rlmargin-z note-categories-spaces "
            id="custom-nav-all-tab"
            data-toggle="tab"
            href="#custom-nav-all"
            role="tab"
            aria-controls="custom-nav-all"
            aria-selected="true"
            onClick={() => handleActiveTabClick("all")}
          >
            All
          </a>
          <a
            href="#event-log"
            onclick="addClickRecord('1', false)"
            id="event-log-tab"
            role="tab"
            aria-controls="event-log"
            aria-selected="true"
            data-toggle="tab"
            className="custom-event-tab"
            onClick={() => handleActiveTabClick("event_log")}
          >
            Event Log
          </a>
          {TableTabsPage.map((tab, index) => (
            <a
              key={index}
              className="nav-item rlmargin-z nav-link  note-categories-spaces"
              data-toggle="tab"
              role="tab"
              aria-selected="true"
              onClick={() => handleActiveTabClick(tab.id)}
            >
              <span class="ic-avatar ic-19 m-r-5">
                <img src={media_origin + tab.page_icon} />
              </span>
              {tab.name}
            </a>
          ))}
        </div>
      </nav>
      <div className="tab-content notes-nav-tabContent" id="nav-tabContent">
        {activeTab !== "event_log" ? (
          <div
            className="tab-pane active show"
            id="custom-nav-all"
            role="tabpanel"
            aria-labelledby="custom-nav-all-tab"
          >
                <div
                  className="table--no-card rounded-0 border-0 w-100 invisible-scroll"
                  id="table-height "
                  ref={containerRef}
                >
                  <table
                    className="table table-borderless table-striped table-earning has-height-25 fixed-table-header-notes-page"
                    id="table-x"
                  >
                    <thead className="toolbar-fonts">
                      <tr
                        id="tb-header"
                        style={{
                          backgroundColor: "rgba(225,57,95)",
                          color: "white",
                          textTransform: "uppercase",
                        }}
                      >
                        <th className="width-notes-custom" scope="col" />
                        <th className="note-col-2 x2 text-center">Date</th>
                        <th className="note-col-3 x3 text-center">Time</th>
                        <th className="td-autosize note-col-4 x4">
                          Case Worker
                        </th>
                        <th className="notes-col note-col-5 x5 text-center">
                          Note
                        </th>
                        <th className="note-col-6 x6 text-left">Category</th>
                      </tr>
                    </thead>
                    <tbody
                      id="table-body-cat"
                      className="all_notes_tab fixed_column_width"
                    >
                      {activeTab === "all"
                        ? NotesTableData.map((filteredNote, index) => (
                            <NoteTableContent
                              key={index}
                              index={index}
                              data={filteredNote}
                              notesRef={notesRefs}
                            />
                          ))
                        : NotesTableData.filter(
                            (note) => note.note_data.category.id === activeTab
                          ).map((filteredNote, index) => (
                            <NoteTableContent
                              key={index}
                              index={index}
                              data={filteredNote}
                              notesRef={notesRefs}
                            />
                          ))}
                    </tbody>
                  </table>
                </div>
          </div>
        ) : (
          <NotesEventBlock
            eventLogData={EventLogData}
            Aba_utbmsData={Aba_utbmsData}
            fetchEventLogData={fetchEventLogData}
          />
        )}
      </div>
    </>
  );
};

export default NotesTableComponent;
