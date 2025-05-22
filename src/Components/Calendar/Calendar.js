import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import { useSelector } from "react-redux";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import NavBar from "../../Components/Navbars/main";
import Sidebar from "../../Components/Sidebars/main";
import { fetchCalenderEvents, fetchDropdownData } from "../../Providers/main";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import { setComponentLoadingEffect } from "../../Redux/common/Loader/action";
import CalenderHeading from "./Components/CalenderHeading";
import EventModal from "../ClientDashboard/modals/eventModal";
import {
  getCaseId,
  getClientId,
  fetchShakespeareStatus,
} from "../../Utils/helper";
import { useDispatch } from "react-redux";
import ActionBarComponent from "../common/ActionBarComponent";
import {
  formatCaseProvider,
  formatLitigationActEvent,
  formatTodoEvent,
  formatTreatmentEvent,
  safeToISOString,
} from "./Util/format";
import ModalComponent from "../FirmSettings/common/ModalComponent";
import Footer from "../common/footer";

export default function Calendar() {
  const isLoading = useSelector(
    (state) => state?.loadEffect?.componentLoadStates?.calendarProviders
  );
  const dispatch = useDispatch();

  const [showEvent, setEvent] = useState(false);
  const [caseSummary, setCaseSummary] = useState(
    useSelector((state) => state?.caseData?.summary)
  );
  const [treatmentDayInfo, setTreatmentDayInfo] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [firmUserList, setFirmUserList] = useState([]);
  const [todoCategoryType, setTodoCategoryType] = useState([]);
  const [caseList, setCaseList] = useState([]);
  const [caseProviderList, setCaseProviderList] = useState([]);
  const [weekendsVisible, setWeekendsVisible] = useState(true);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventType, setEventType] = useState(null);
  const [litigationEventType, setLitigationEventType] = useState([[]]);
  const [litigationEvent, setLitigationEvent] = useState([[]]);
  const [client, setClient] = useState(
    useSelector((state) => state?.caseData?.summary?.for_client)
  );
  console.log("Click client ===>", client);

  const [overallProviders, setOverallProvider] = useState([]);

  const [dropdownResponse, setDropdownResponse] = useState([]);
  const getInitialDateRange = () => {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() - 2, 0);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 2, 1);
    return { start: safeToISOString(startDate), end: safeToISOString(endDate) };
  };
  const [loadedRange, setLoadedRange] = useState(getInitialDateRange());

  function handleWeekendsToggle() {
    setWeekendsVisible(!weekendsVisible);
  }
  const handleEventClick = (clickInfo) => {
    console.log("Click Info ===>", clickInfo);
    setSelectedEvent(clickInfo.event);
  };

  const handleClosePopup = () => {
    setSelectedEvent(null);
  };

  const formatEvents = (data, otherData, providerMapList) => {
    let events = [];

    try {
      data?.todos?.forEach((todo) => {
        events.push(formatTodoEvent(todo));
      });
      data?.litigation_acts?.forEach((act) => {
        events.push(formatLitigationActEvent(act));
      });
      data?.treatment_dates?.forEach((treatment) => {
        events.push(
          formatTreatmentEvent(treatment, otherData, providerMapList)
        );
      });

      return events;
    } catch (e) {
      console.error(e);
      console.log(e);
    }
  };
  function formatDateTimeForURL(dateString) {
    try {
      // Check if dateString is provided
      if (!dateString) {
        throw new Error("Date string is required.");
      }

      // Attempt to create a Date object
      const date = new Date(dateString);

      // Check if the date is valid
      if (isNaN(date.getTime())) {
        throw new Error(
          `Invalid date string: "${dateString}". Please provide a valid date.`
        );
      }

      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, "0");
      const day = String(date.getUTCDate()).padStart(2, "0");
      const hours = String(date.getUTCHours()).padStart(2, "0");
      const minutes = String(date.getUTCMinutes()).padStart(2, "0");
      const seconds = String(date.getUTCSeconds()).padStart(2, "0");

      return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    } catch (error) {
      console.error("Error formatting date:", error.message);
      console.log("Error formatting date:", error.message);
      return null;
    }
  }

  const fetchData = async (startDate, endDate, isFirst = true) => {
    try {
      // console.log(startDate, endDate);

      let dropdownResponseLocal = [];
      let providerMapListLocal = [];
      dispatch(setComponentLoadingEffect("detailBar", true));

      if (isFirst) {
        dropdownResponseLocal = await fetchDropdownData(
          getClientId(),
          getCaseId()
        );
        setDropdownResponse(dropdownResponseLocal);
        console.log(dropdownResponseLocal);
        setLitigationEventType(dropdownResponseLocal?.event_types);
        setLitigationEvent(dropdownResponseLocal?.litigation_events);
        setFirmUserList(dropdownResponseLocal?.firm_users);
        setOverallProvider(dropdownResponseLocal?.case_providers);
        const formattedCaseProvider =
          dropdownResponseLocal?.case_providers?.map(formatCaseProvider);
        setCaseList(dropdownResponseLocal?.cases);
        setCaseProviderList(formattedCaseProvider);
        setTodoCategoryType(dropdownResponseLocal?.todo_types);
      }
      if (dropdownResponseLocal?.length == 0) {
        dropdownResponseLocal = dropdownResponse;
      }
      const eventResponse = await fetchCalenderEvents(
        getClientId(),
        getCaseId(),
        formatDateTimeForURL(startDate),
        formatDateTimeForURL(endDate)
      );
      eventResponse?.treatment_dates?.forEach((i) => {
        dropdownResponseLocal?.case_providers?.forEach((j) => {
          dropdownResponseLocal?.cases?.forEach((k) => {
            if (i?.for_provider == j?.id && j?.for_case == k?.id) {
              providerMapListLocal.push({
                for_provider: i?.for_provider,
                first_name: k?.for_client?.first_name,
                last_name: k?.for_client?.last_name,
                case_summary: k?.case_type?.name,
                id: i?.id,
              });
            }
          });
        });
      });
      // console.log(providerMapListLocal);
      console.log(eventResponse);
      setTreatmentDayInfo(providerMapListLocal);
      const formattedEvents = formatEvents(
        eventResponse,
        dropdownResponseLocal?.case_providers,
        providerMapListLocal
      );
      setCurrentEvents(formattedEvents);
      dispatch(setComponentLoadingEffect("detailBar", false));
    } catch (error) {
      console.error("Error fetching calendar events:", error);
      console.log("Error fetching calendar events:", error);
      dispatch(setComponentLoadingEffect("detailBar", false));
    }
  };

  useEffect(() => {
    const { start, end } = getInitialDateRange();
    fetchData(start, end);
    fetchShakespeareStatus(getCaseId(), getClientId(), "Calendar", dispatch);
  }, [refresh]);

  const datesSet = (arg) => {
    const startDate = new Date(arg.start);
    const endDate = new Date(arg.end);
    const loadedStart = new Date(loadedRange.start);
    const loadedEnd = new Date(loadedRange.end);
    const loadedStartYear = loadedStart.getFullYear();
    const loadedEndYear = loadedEnd.getFullYear();
    const loadedStartMonth = loadedStart.getMonth();
    const loadedEndMonth = loadedEnd.getMonth();
    const startYear = startDate.getFullYear();
    const startMonth = startDate.getMonth();
    const endYear = endDate.getFullYear();
    const endMonth = endDate.getMonth();
    const isNewRange =
      startYear < loadedStartYear ||
      (startYear == loadedStartYear && startMonth <= loadedStartMonth) ||
      endYear > loadedEndYear ||
      (endYear == loadedEndYear && endMonth >= loadedEndMonth);

    // console.log( ( startMonth <=loadedStartMonth && startYear<loadedStartYear) , (endMonth >= loadedEndMonth && endYear>loadedEndYear))
    // console.log(startMonth,endMonth,startYear,endYear,loadedStartMonth,loadedEndMonth,loadedStartYear,loadedEndYear)

    if (isNewRange) {
      // console.log("new Range");
      const finalStart = new Date(startYear, startMonth - 2, 0);
      const finalEnd = new Date(endYear, endMonth + 2, 1);
      fetchData(safeToISOString(finalStart), safeToISOString(finalEnd), false);
      setLoadedRange({
        start: safeToISOString(finalStart),
        end: safeToISOString(finalEnd),
      });
    }
  };

  console.log("selected Event ===>", selectedEvent);

  const calendarRef = useRef(null);
  return (
    <>
    <div
      className="page-wrapper"
      style={{ overflowY: "hidden", height: "100vh" }}
    >
      <Sidebar />
      <div className="page-container" style={{ overflowY: "hidden" }}>
        <div className="top-panel-wrapper"></div>
        <NavBar />
        {/* <CalenderHeading name={"calendar"}/> */}
        <ActionBarComponent
          src="/BP_resources/images/icon/calendar-logo-icon.svg"
          page_name="calendar"
        />
        <div
          className="main-content cost-tb padding-zero-on-small-width overflowY-hidden"
          style={{ paddingTop: "165px", overflowY: "hidden" }}
        >
          {showEvent && (
            <EventModal
              currentEvents={currentEvents}
              setCurrentEvents={setCurrentEvents}
              show={showEvent}
              setShow={setEvent}
              setRefresh={setRefresh}
              todoCategoryType={todoCategoryType}
              caseProviderList={caseProviderList}
              litigationEvent={litigationEvent}
              litigationEventType={litigationEventType}
              firmUserList={firmUserList}
              overallProviders={overallProviders}
              caseList={caseList}
              treatmentDayInfo={treatmentDayInfo}
            />
          )}

          <FullCalendar
            ref={calendarRef}
            events={currentEvents}
            buttonHints={{
              today: "",
              // Add more button hints as needed
            }}
            slotLabelContent={(args) => {
              return args.date
                .toLocaleString("en-US", {
                  hour: "numeric",
                  hour12: true,
                })
                .replace("am", " AM")
                .replace("pm", " PM");
            }}
            schedulerLicenseKey="0725467818-fcs-1721250612"
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              resourceTimelinePlugin,
              listPlugin,
            ]}
            customButtons={{
              Event: {
                text: "Add Event",
                click: function () {
                  setEvent(true);
                },
              },
              customToday: {
                text: "Today",
                click: function () {
                  calendarRef.current.getApi().today();
                },
              },
            }}
            dayCellClassNames={(arg) => {
              if (arg.view.type == "customMonth") {
                const isCurrentMonth =
                  arg.date.getMonth() ===
                  new Date(arg.view.currentStart).getMonth();
                return isCurrentMonth ? "" : "hide-day";
              }
            }}
            views={{
              cutomTimeline: {
                buttonText: "Timeline",
                type: "listWeek",
                dayMaxEvents: 2,
                eventMaxStack: 3,
              },

              customWeek: {
                type: "timeGridWeek",
                buttonText: "Week",
              },
              customMonth: {
                type: "dayGridMonth",
                buttonText: "Month",
                dayMaxEvents: 3,
              },
            }}
            headerToolbar={{
              left: "customMonth customWeek timeGridDay cutomTimeline",
              center: "prev title next customToday",
              right: "Event",
            }}
            buttonText={{
              // today: "Today",
              // week: "week", // change week button text to "weekly"
              timelineMonth: "Timeline Month",
              timelineDay: "Timeline Day",
              timelineWeek: "Timeline Week",
              day: "Day",
            }}
            initialView="customWeek"
            // editable={true}
            // selectable={true}
            // allDaySlot={false}
            expandRows={true}
            interactive={true}
            dayMaxEvents={20}
            overlap={false}
            eventColor="#19395f"
            eventBackgroundColor="#19395f"
            // slotLabelFormat= {false}
            // eventTextColor="#19395f"
            // Show a maximum of 3 events per day
            moreLinkClick="popover" //
            weekends={weekendsVisible}
            display="list-item"
            eventResizableFromStart={true}
            timeZone="local"
            defaultTimedEventDuration="00:00:01"
            // Set initial events here
            eventContent={renderEventContent} // custom render function
            eventClick={handleEventClick} // h// called after events are initialized/added/changed/removed
            eventTimeFormat={{
              hour: "numeric",
              minute: "2-digit",
              meridiem: "short",
            }}
            firstDay={1}
            dayHeaderFormat={{ weekday: "long" }}
            eventDidMount={(info) => {
              const eventStartTime = new Date(info.event.start).getHours();

              if (eventStartTime === 23) {
                info.el.style.height = "20px"; // Set the desired height here
              }

              info.el.setAttribute("title", info.event.title);
            }}
            datesSet={datesSet}
            dateClick={(info) => {
              const calendarApi = calendarRef.current.getApi();
              calendarApi.changeView("timeGridDay", info.date);
            }}
          />
        </div>

        {selectedEvent && (
          <ModalComponent
            show={selectedEvent}
            title={"Event Details"}
            handleClose={handleClosePopup}
            buttonData={[
              {
                text: "Cancel",
                variant: "secondary",
                onClick: handleClosePopup,
              },
            ]}
            size={"lg"}
          >
            <div className="row">
              <div className="col-lg-12 p-4 d-flex align-items-center">
                <div className="col-sm-2">
                  <span>Client Details:</span>
                </div>
                <div className="col-sm-10  d-flex align-items-center">
                  <div
                    className="form-control d-flex align-items-center"
                    style={{ height: "35px" }}
                  >
                    <div
                      className="ic ic-avatar ic-29 has-avatar-icon has-cover-img"
                      id={`case-profile-${selectedEvent?.sourceId + 1}`}
                    >
                      {client?.profile_pic_19p ? (
                        <img id="output" src={client?.profile_pic_19p} />
                      ) : (
                        <span className="ic ic-29 ic-avatar"></span>
                      )}
                    </div>
                    <div
                      className="ml-2"
                      id={`case-username-${selectedEvent?.sourceId + 1}`}
                    >
                      {selectedEvent?.extendedProps?.clientFirstName}{" "}
                      {selectedEvent?.extendedProps.clientLastName}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-12 p-4 d-flex align-items-center">
                <div className="col-sm-2">
                  <span>Case Type:</span>
                </div>
                <div className="col-sm-10  d-flex align-items-center">
                  <input
                    type="text"
                    className="form-control"
                    value={selectedEvent?.extendedProps.caseType}
                    disabled
                  />
                </div>
              </div>
              {selectedEvent?.extendedProps.provider?.specialty?.name && (
                <div className="col-lg-12 p-4 d-flex align-items-center">
                  <div className="col-sm-2">
                    <span>Provider: </span>
                  </div>
                  <div className="col-sm-10  d-flex align-items-center">
                    <input
                      type="text"
                      className="form-control"
                      value={
                        selectedEvent?.extendedProps.provider?.specialty?.name
                      }
                      disabled
                    />
                  </div>
                </div>
              )}
              <div className="col-lg-12 p-4 d-flex align-items-center">
                <div className="col-sm-2">
                  <span>Title: </span>
                </div>
                <div className="col-sm-10  d-flex align-items-center">
                  <input
                    type="text"
                    className="form-control"
                    value={selectedEvent?.extendedProps.title2}
                    disabled
                  />
                </div>
              </div>
              <div className="col-lg-12 p-4 d-flex align-items-center">
                <div className="col-sm-2">
                  <span>Event Created By: </span>
                </div>
                <div className="col-sm-10  d-flex align-items-center">
                  <input
                    type="text"
                    className="form-control"
                    value={client?.created_by?.office_name}
                    disabled
                  />
                </div>
              </div>
            </div>
          </ModalComponent>
        )}

        {/* {selectedEvent && (
  <div
    className="modal generic-popup bd-example-modal-lg fade zoom-in show"
    style={{
      display: "block",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: 100000,
    }}
  >
    <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-1 modal-dialog-4-max-width">
      <div className="modal-content" id="no-border-popup" style={{ width: "50%", marginLeft: "20%" }}>
        <div className="modal-header text-center p-0 bg-primary-5 popup-heading-color justify-content-center">
          <h5 className="modal-title mx-auto font-size-24 height-35 text-uppercase text-primary font-weight-500">
            Event Details
          </h5>
        </div>

                <div className="d-flex flex-column align-items-start mx-auto">
                  {selectedEvent?.extendedProps.eventType === "todo" && (
                    <EventDetail
                      name={selectedEvent?.extendedProps.clientFirstName}
                      lastName={selectedEvent?.extendedProps.clientLastName}
                      caseType={selectedEvent?.extendedProps.caseType?.replace(
                        /:$/,
                        ""
                      )}
                      title={selectedEvent?.extendedProps.title2?.replace(
                        /:$/,
                        ""
                      )}
                    />
                  )}

                  {selectedEvent?.extendedProps.eventType ===
                    "litigationAct" && (
                    <EventDetail
                      name={selectedEvent?.extendedProps.clientFirstName}
                      lastName={selectedEvent?.extendedProps.clientLastName}
                      title={selectedEvent?.extendedProps.title2?.replace(
                        /:$/,
                        ""
                      )}
                      caseType={selectedEvent?.extendedProps.caseType}
                    />
                  )}

                  {selectedEvent?.extendedProps.eventType ===
                    "treatmentDates" && (
                    <EventDetail
                      provider={
                        selectedEvent?.extendedProps.provider?.specialty?.name
                      }
                      name={selectedEvent?.extendedProps.clientFirstName}
                      lastName={selectedEvent?.extendedProps.clientLastName}
                      caseType={selectedEvent?.extendedProps.caseType}
                      description={selectedEvent?.extendedProps.title2?.replace(
                        /:$/,
                        ""
                      )}
                    />
                  )}
                </div>

                <button
                  className="btn btn-secondary my-2 mx-auto"
                  onClick={handleClosePopup}
                  style={{ width: "10vw" }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )} */}
      </div>
    </div>
    <Footer/>
    </>
  );
}

function renderEventContent(eventInfo) {
  return (
    <div
      className="d-flex "
      style={{
        width: "100%",
        overflowX: "hidden",
        fontSize: "14px",
        textOverflow: "ellipsis",
        cursor: "pointer",
      }}
    >
      <div>
        <span style={{ color: "black" }}>{" " + eventInfo.event.title}</span>
      </div>
    </div>
  );
}
const EventDetail = ({
  name,
  lastName,
  caseType,
  title,
  provider,
  description,
}) => {
  const labelStyles = {
    fontSize: "20px",
    minWidth: "135px",
  };

  const valueStyles = {
    fontSize: "20px",
  };

  const renderDetailRow = (label, value) => (
    <div className="d-flex justify-content-center">
      <div
        className="modal-title text-uppercase text-primary font-weight-500"
        style={labelStyles}
      >
        {label}
      </div>
      <span
        className="modal-title text-uppercase text-primary mr-2 font-weight-500"
        style={valueStyles}
      >
        :
      </span>
      <div
        className="modal-title text-uppercase text-primary font-weight-600"
        style={valueStyles}
      >
        {value}
      </div>
    </div>
  );

  return (
    <>
      {name && renderDetailRow("First Name", name)}
      {lastName && renderDetailRow("Last Name", lastName)}
      {caseType && renderDetailRow("Case Type", caseType)}
      {title && renderDetailRow("Title", title)}
      {provider && renderDetailRow("Provider", provider)}
      {description && renderDetailRow("Description", description)}
    </>
  );
};
