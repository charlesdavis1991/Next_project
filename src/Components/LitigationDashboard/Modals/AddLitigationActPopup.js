import React, { useContext, useEffect, useState,useRef } from "react";
import axios from "axios";
import { Modal, Nav, Tab } from "react-bootstrap";
import { getClientId, getCaseId } from "../../../Utils/helper";
import { ClientDataContext } from "../../ClientDashboard/shared/DataContext";
import { useSelector } from "react-redux";
import GenericTabs from "../../common/GenericTab";

//for litigation page
const initialState = {
  name: "",
  address1: "",
  address2: "",
  city: "",
  state: "",
  zip: "",
  phone_number: "",
  fax: "",
  email: "",
  website: "",
  event_type_id: null,
  event_id: null,
  for_client: null,
  for_case: null,
  is_allday: false,
  service_date: null,
  for_service: null,
  calculated_dates: "",
  events_blocked: [],
  events_triggered: [],
  dependant_date_type: null,
  start_date: "",
  end_date: "",
  start_time: "",
  end_time: "",
  sameDay: false,
  meetingurl: "",
  trigger_on_accept: [],
  trigger_on_reject: [],
  trigger_on_deadline: [],
  trigger_on_dependant_date: [],
  trigger_type: "",
};

function AddLitigationActPopup({
  showPopup,
  handleClose,
  litigationDetail,
}) {
  const [litigationActTab,setLitigationActTab] = useState("event");
  const handleTabChange = (tab)=> setLitigationActTab(tab);
  const tabsData = [
    {   id: "event", 
        label: "Litigation Event",
        onClick: () => handleTabChange("event"),
        className: litigationActTab === "event" ? "active tab-trapezium-cycles-corners" : "tab-trapezium-cycles-corners",
        background: litigationActTab === "event" ? "var(--primary) !important" : "var(--primary-70) !important",
        rightHand:true,
        activeColor: 'white',
    },
    {   id: "dates", 
        label: "Dates", 
        onClick: () => handleTabChange("dates"),
        className: litigationActTab === "dates" ? "active tab-trapezium-cycles-corners" : "tab-trapezium-cycles-corners",
        background: litigationActTab === "dates" ? "var(--primary) !important" : "var(--primary-70) !important",
        rightHand:true,
        activeColor: 'white',
    },
    {   id: "location", 
        label: "Location", 
        onClick: () => handleTabChange("location"),
        className: litigationActTab === "location" ? "active tab-trapezium-cycles-corners" : "tab-trapezium-cycles-corners",
        background: litigationActTab === "location" ? "var(--primary) !important" : "var(--primary-70) !important",
        rightHand:true,
        activeColor: 'white',
    },

  ];

  const origin = process.env.REACT_APP_BACKEND_URL;
  const token = localStorage.getItem("token");
  const clientId = getClientId();
  const caseId = getCaseId();
  // const [partiesData, setPartiesData] = useState([]);
  const [serviceData, setServiceData] = useState([]);
  const [eventsData, setEventsData] = useState([]);
  const [eventsData2, setEventsData2] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);
  const [calculatedDates, setCalculatedDates] = useState([]);
  const [activeTab, setActiveTab] = useState("event");
  const [selectedEventType, setSelectedEventType] = useState("");
  const [form, setForm] = useState(initialState);
  if(form?.start_date !== ""){
    tabsData.push({
      id: "triggered", 
      label: "Triggered/Block", 
      onClick: () => handleTabChange("triggered"),
      className: litigationActTab === "triggered" ? "active tab-trapezium-cycles-corners" : "tab-trapezium-cycles-corners",
      background: litigationActTab === "triggered" ? "var(--primary) !important" : "var(--primary-70) !important",
      rightHand:true,
      activeColor: 'white',
  })
  }
  const [caseData, setCaseData] = useState({});
  const { setLitigationActDataUpdated } = useContext(ClientDataContext);
  const [selectedContact, setSelectedContact] = useState('');
  const [caseAddresses, setCaseAddresses] = useState([]);
  const { statesData } = useSelector((state) => state.states);
  const [notStartDate, setNotStartDate] = useState(false);
  const [calculatingEndDate, setCalculatingEndDate] = useState(false);
  const [dependantDateFieldLabel, setDependantDateFieldLabel] = useState("Dependant Date");

  // const fetchPartiesData = async () => {
  //   try {
  //     const response = await axios.get(
  //       `${origin}/api/litigation-page/defendants-and-other-parties/${clientId}/${caseId}/`,
  //       {
  //         params: { litigation_event_popup: true },
  //         headers: { Authorization: token },
  //       }
  //     );
  //     setPartiesData(response.data.data);
  //   } catch (err) {
  //     console.log("error", err);
  //   }
  // };

  const fetchCaseData = async () => {
    try {
      const response = await axios.get(
        `${origin}/api/litigation-page/litigation_case/${caseId}/`,
        {
          headers: { Authorization: token },
        }
      );
      setCaseData(response.data);
    } catch (err) {
      console.log("error", err);
    }
  };

  const fetchServiceData = async () => {
    try {
      const response = await axios.get(
        `${origin}/api/litigation-page/service-methods/`,
        {
          params: { client_id: clientId, case_id: caseId },
          headers: { Authorization: token },
        }
      );
      setServiceData(response.data.data);
    } catch (err) {
      console.log("error", err);
    }
  };

  const fetchLitEventsData = async () => {
    try {
      const response = await axios.get(
        `${origin}/api/litigation-page/litigation-events-for-popups/`,
        {
          params: {
            state: litigationDetail?.state?.id,
            county: litigationDetail?.county?.id,
            state_fed: litigationDetail?.jurisdicition_type?.name || "",
            event_type: selectedEventType,
          },
          headers: { Authorization: token },
        }
      );
      setEventsData(response.data);
    } catch (err) {
      console.log("error", err);
    }
  };

  const fetchLitEventsData2 = async () => {
    try {
      const response = await axios.get(
        `${origin}/api/litigation-page/litigation-events-for-popups/`,
        {
          params: {
            state: litigationDetail?.state?.id,
            county: litigationDetail?.county?.id,
            state_fed: litigationDetail?.jurisdicition_type?.name || "",
          },
          headers: { Authorization: token },
        }
      );
      setEventsData2(response.data);
    } catch (err) {
      console.log("error", err);
    }
  };

  const getEventType = async () => {
    try {
      const response = await axios.get(`${origin}/api/all/event/types/`, {
        headers: {
          Authorization: token,
        },
      });
      setEventTypes(response.data.data);
    } catch (err) {
      console.error("Error fetching Event Types:", err);
    }
  };


  const getCaseAddresses = async () => {
    try {
      const response = await axios.get(
        `${origin}/api/litigation-page/get_case_addresses/${clientId}/${caseId}/`,
        {
          headers: { Authorization: token },
        }
      );
      console.log("RES",response)
      getContactOptions(response.data.contacts);
    } catch (err) {
      console.error("Error fetching Case Addresses:", err);
    }
  };

  const calculateEndDate = async (eventId, startDate) => {
    if (!eventId || !startDate) return;
    
    setCalculatingEndDate(true);
    try {
      const response = await axios.post(
        `${origin}/api/litigation-page/calculate-end-date/`,
        {
          event_id: eventId,
          start_date: startDate
        },
        {
          headers: { Authorization: token }
        }
      );
      
      if (response.status === 200) {
        const endDate = response.data.end_date;
        // Extract date part only for end_date input field
        const dateOnly = endDate.split('T')[0];
        const timeOnly = endDate.split('T')[1]?.slice(0, 5) || '00:00';
        
        setForm(prevForm => ({
          ...prevForm,
          end_date: dateOnly,
          end_time: timeOnly
        }));
      }
    } catch (err) {
      console.error("Error calculating end date:", err);
    } finally {
      setCalculatingEndDate(false);
    }
  };

  useEffect(() => {
    if (showPopup) {
      // fetchPartiesData();
      fetchServiceData();
      getEventType();
      fetchLitEventsData2();
      fetchCaseData();
      getCaseAddresses()
    }
  }, [showPopup]);

  useEffect(() => {
    if (showPopup && selectedEventType) {
      fetchLitEventsData();
    }
  }, [selectedEventType, showPopup]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));

    if (name === 'start_date' && value && form.event_id) {
      calculateEndDate(form.event_id, value);
    }
  };


  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleDropdownToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleOptionSelect = (id) => {
    setIsOpen(false);
    handleIntChange({ target: { name: "event_type_id", value: id } });
  };
  const handleIntChange = (e) => {
    const { name, value, type } = e.target;
    if (name === "event_type_id") {
      setSelectedEventType(value);
      setForm((prevForm) => ({
        ...prevForm,
        event_id: null,
        dependant_date_type: null,
      }));
    }
    setForm((prevForm) => ({
      ...prevForm,
      [name]: Number(value),
    }));
  };

  // Close dropdown when clicking outside
  useEffect(() => {
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

  const handleCalDatesChange = (e) => {
    const id = parseInt(e.target.value);
    if (e.target.checked) {
      setForm((prevForm) => ({
        ...prevForm,
        calculated_dates: [...prevForm.calculated_dates, id],
      }));
    } else {
      setForm((prevForm) => ({
        ...prevForm,
        calculated_dates: prevForm.calculated_dates.filter(
          (date) => date !== id
        ),
      }));
    }
  };

  const handleEventChange = (e) => {
    const event = eventsData?.find(
      (event) => event.id === Number(e.target.value)
    );
    setCalculatedDates(event?.calculated_dates_id);
    setDependantDateFieldLabel(event?.dependent_date_type_id?.dependent_date_name || "Dependant Date");
    if (
      event?.dependent_date_type_id?.dependent_date_name === "Incident Date"
    ) {
      const [dateOnly, timeOnly] = caseData?.incident_date?.split("T");

      setDependantDate(dateOnly);

      if (dateOnly) {
        calculateEndDate(event.id, dateOnly);
      }
    }

    if (event?.sameDay) {
      const now = new Date();
      const endTimeFromEvent = event.sameDay_endTime;
      const [hours, minutes] = endTimeFromEvent.split(":");

      now.setHours(parseInt(hours));
      now.setMinutes(parseInt(minutes));

      const formattedEndTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

      setForm((prevForm) => ({
        ...prevForm,
        is_allday: false,
        sameDay: true,
        end_time: formattedEndTime,
      }));
    }
    if (event?.is_allday) {
      setForm((prevForm) => ({
        ...prevForm,
        is_allday: true,
        sameDay: false,
      }));
    } else {
      setForm((prevForm) => ({
        ...prevForm,
        is_allday: false,
        sameDay: false,
      }));
    }

    if (form.start_date) {
      calculateEndDate(event.id, form.start_date);
    }

    if (event?.dependent_date_type_id?.id) {
      if(event?.dependent_date_type_id?.dsdate){
        setNotStartDate(false);
      }
      setForm((prevForm) => ({
        ...prevForm,
        dependant_date_type: Number(event?.dependent_date_type_id?.id) || null,
      }));
    }
    if (event?.trigger_type === "DependantDate") {
      setForm((prevForm) => ({
        ...prevForm,
        trigger_on_dependant_date: event?.trigger_on_dependant_date || [],
        trigger_on_deadline: event?.trigger_on_deadline || [],
      }));
    }
    else if (event?.trigger_type === "Accept/Reject") {
      setForm((prevForm) => ({
        ...prevForm,
        trigger_on_accept: event?.trigger_on_accept || [],
        trigger_on_reject: event?.trigger_on_reject || [],
        trigger_on_deadline: event?.trigger_on_deadline || [],
      }));
    }
    setForm((prevForm) => ({
      ...prevForm,
      event_id: Number(event?.id) || null,
    }));
  };

  const handleEventAction = (event, action) => {
    setForm((prevForm) => {
      // Remove from both arrays first
      const newTriggered =
        prevForm.events_triggered?.filter((id) => id !== event.id) || [];
      const newBlocked =
        prevForm.events_blocked?.filter((id) => id !== event.id) || [];

      // If clicking the same button that's already active, just remove it
      if (
        (action === "trigger" &&
          prevForm.events_triggered?.includes(event.id)) ||
        (action === "block" && prevForm.events_blocked?.includes(event.id))
      ) {
        return {
          ...prevForm,
          events_triggered: newTriggered,
          events_blocked: newBlocked,
        };
      }

      // Add to appropriate array based on action
      if (action === "trigger") {
        newTriggered.push(event.id);
      } else {
        newBlocked.push(event.id);
      }

      return {
        ...prevForm,
        events_triggered: newTriggered,
        events_blocked: newBlocked,
      };
    });
  };

  const [isOpen2, setIsOpen2] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(
    selectedContact
      ? caseAddresses.findIndex((opt) => opt.contact === selectedContact)
      : ""
  );

  const dropdownRef2 = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef2.current && !dropdownRef2.current.contains(event.target)) {
        setIsOpen2(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDropdownToggle2 = () => {
    setIsOpen2((prev) => !prev);
  };

  const handleAddressChange = (index) => {
    setIsOpen2(false);
    setSelectedIndex(index);
    if (index !== '') {
      const selectedOption = caseAddresses[index];
      setSelectedContact(selectedOption.contact);
  
      // Get the appropriate contact details based on the selected contact type
      let contactDetails = selectedOption.contact[selectedOption.contact.selectedContact];
  
      // Update the form with contact details
      if (contactDetails) {
        setForm(prevForm => ({
          ...prevForm,
          name: contactDetails.name || "",
          address1: contactDetails.address1 || "",
          address2: contactDetails.address2 || "",
          city: contactDetails.city || "",
          state: contactDetails.state || "",
          zip: contactDetails.zip || "",
          phone_number: contactDetails.phone_number || "",
          fax: contactDetails.fax || "",
          email: contactDetails.email || "",
          website: contactDetails.website || ""
        }));
      }
    }
  };

  const handleSubmit = async () => {
    try {
      const updatedForm = Object.entries(form).reduce((acc, [key, value]) => {
        if (
          value !== null &&
          value !== "" &&
          (!Array.isArray(value) || value.length > 0)
        ) {
          if (key === "service_date" && value) {
            if (!value.includes('T')) {
              acc[key] = `${value}T00:00:00Z`;
            } else {
              acc[key] = value;
            }
          } else {
            acc[key] = value;
          }
        }

        return acc;
      }, {});
      updatedForm.for_client = clientId;
      updatedForm.for_case = caseId;
      const response = await axios.post(
        `${origin}/api/litigation-page/litigation-act/`,
        updatedForm,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (response.status === 201) {
        handleClose();
        setForm(initialState);
        setLitigationActDataUpdated(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const calculateNewDate = (
    baseDate,
    { day_count, month_count, year_count }
  ) => {
    const date = new Date(baseDate);
    if (year_count) {
      date.setFullYear(date.getFullYear() + parseInt(year_count, 10));
    }
    if (month_count) {
      date.setMonth(date.getMonth() + parseInt(month_count, 10));
    }
    if (day_count) {
      date.setDate(date.getDate() + parseInt(day_count, 10));
    }
    return date.toISOString().split("T")[0];
  };

  const getContactOptions = (contacts) => {
    const options = [];
    console.log("CON",contacts)
    contacts.forEach(contact => {
      if (contact.contact_1) {
        options.push({
          label: `${contact.type} - ${contact.name} Address 1`,
          contact: { ...contact, selectedContact: 'contact_1' }
        });
      }
      
      if (contact.contact_2) {
        options.push({
          label: `${contact.type} - ${contact.name} Address 2`,
          contact: { ...contact, selectedContact: 'contact_2' }
        });
      }
      
      if (contact.home_contact) {
        options.push({
          label: `${contact.type} - ${contact.name} Home Address`,
          contact: { ...contact, selectedContact: 'home_contact' }
        });
      }
      
      if (contact.work_contact) {
        options.push({
          label: `${contact.type} - ${contact.name} Work Address`,
          contact: { ...contact, selectedContact: 'work_contact' }
        });
      }
      
      if (contact.party_home_contact) {
        options.push({
          label: `${contact.type} - ${contact.name} Home Address`,
          contact: { ...contact, selectedContact: 'party_home_contact' }
        });
      }
    });
    setCaseAddresses(options);
  };
  console.log("ADD",caseAddresses)
  return (
    <Modal
      show={showPopup}
      onHide={handleClose}
      centered
      dialogClassName="Law-firm-direct-max-width-900px"
    >
      <Modal.Header className="bg-primary text-center p-2">
        <h4 className="modal-title text-white mx-auto">Add Litigation Act</h4>
      </Modal.Header>
      <Modal.Body className="py-2">
        <div className="mb-2">
          <span className="row justify-content-center">
            {litigationDetail?.court_name ? (
              litigationDetail.court_name
            ) : (
              <span className="text-grey mr-1">Court</span>
            )}
            {" | "}Case #{litigationDetail?.case_number}
          </span>
          <span className="row justify-content-center">
            {litigationDetail?.jurisdiction_obj?.name ? (
              litigationDetail.jurisdiction_obj.name
            ) : (
              <span className="text-grey mr-1">Jurisdiction</span>
            )}
            {" | "}
            {litigationDetail?.jurisdiction_type?.name ? (
              litigationDetail.jurisdiction_type.name
            ) : (
              <span className="text-grey mx-1">Type</span>
            )}
            {" | "}
            {litigationDetail?.state?.name ? (
              litigationDetail.state.name
            ) : (
              <span className="text-grey mx-1">State</span>
            )}
            {" | "}
            {litigationDetail?.county?.name ? (
              litigationDetail.county.name
            ) : (
              <span className="text-grey mr-1">County</span>
            )}
          </span>
        </div>
        <GenericTabs tabsData={tabsData} height={25} />
        <Tab.Container
          activeKey={activeTab}
          onSelect={(key) => {
            setActiveTab(key);
          }}
        >
          {/* <Nav variant="tabs" className="mb-2 justify-content-center">
            <Nav.Item>
              <Nav.Link eventKey="event">Litigation Event</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="dates">Dates</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="location">Location</Nav.Link>
            </Nav.Item>
            {form?.start_date !== "" && (
              <Nav.Item>
                <Nav.Link eventKey="triggered">Trigger/Block</Nav.Link>
              </Nav.Item>
            )}
          </Nav> */}
          { litigationActTab == "event" && 
            <div className="min-h-400 m-t-5">
              <div className="height-21 mt-2 mb-1"></div>
              <div className="row align-items-center form-group">
                <div className="col-2 text-left">
                  <span className="d-inline-block text-grey">
                    <nobr>Event Type</nobr>
                  </span>
                </div>
                <div className="col-10">
                  <div className="dropdown-container" ref={dropdownRef}>
                    <div className="form-select form-control" onClick={handleDropdownToggle}>
                      {eventTypes.find((item) => item.id === form?.event_type_id)?.litigation_event_type || "Select Event Type"}
                    </div>
                    {isOpen && (
                      <ul className="dropdown-list">
                        <li onClick={() => handleOptionSelect(null)}>
                          <i className={`ic ic-19 ic-default-event m-r-5`}></i>
                          <span>Select Event Type</span>
                        </li>
                        {eventTypes?.map((item) => (
                          <li key={item.id} onClick={() => handleOptionSelect(item.id)}>
                            <i className={`ic ic-19 ${item.litigation_event_type === "Discovery" ? "ic-discovery" : item.litigation_event_type === "Statute of Limitations" || item.litigation_event_type === "Statute of Limitation" ? "ic-SOL" :  'ic-' + item.litigation_event_type} m-r-5`}></i>
                            <span>{item.litigation_event_type}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
                <div className="row align-items-center form-group">
                  <div className="col-2 text-left">
                    <span className="d-inline-block text-grey">Events</span>
                  </div>
                  <div className="col-10">
                    <div
                      style={{
                        maxHeight: "300px",
                        minHeight: "38px",
                        overflowY: "auto",
                        padding: "10px 0px",
                        display: "grid",
                        gap: "10px",
                        height: "auto",
                      }}
                    >
                      {eventsData?.map((item, index) => (
                        <label key={index} className="form-check-label d-flex">
                          <input
                            type="radio"
                            name="event_id"
                            value={item.id}
                            checked={form?.event_id === item.id}
                            onChange={handleEventChange}
                            style={{
                              marginRight: "5px",
                              accentColor: "var(--primary)",
                            }}
                          />
                          {item.event_name}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
            </div> 
          }

          { litigationActTab == "dates" &&  
            <div className="min-h-400 m-t-5">
                {!form?.event_id && (
                  <div className="text-center text-red mt-2 mb-1">
                    Select Event First
                  </div>
                )}
                <div className="row align-items-center form-group">
                  <div className="col-2 text-left">
                    <span className="d-inline-block text-grey">
                      <nobr>Start Date</nobr>
                    </span>
                  </div>
                  <div className="col-10">
                    <div
                      className={
                        !form?.is_allday && !form?.sameDay ? "row" : "d-flex"
                      }
                    >
                      <span
                        className={
                          !form?.is_allday && !form?.sameDay ? "col-6" : "w-100"
                        }
                      >
                        <input
                          type="date"
                          placeholder="DD-MM-YYYY"
                          value={form?.start_date}
                          className="form-control"
                          name="start_date"
                          onChange={handleChange}
                          disabled={form?.sameDay}
                        />
                      </span>
                      {!form?.is_allday && !form?.sameDay && (
                        <span className="col-6">
                          <input
                            type="time"
                            placeholder="THH:MM"
                            value={form?.start_time}
                            className="form-control"
                            name="start_time"
                            onChange={handleChange}
                          />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {form?.is_allday === false && (
                  <>
                    <div className="row align-items-center form-group">
                      <div className="col-2 text-left">
                        <span className="d-inline-block text-grey">
                          <nobr>End {form?.sameDay ? "Time" : "Date"}</nobr>
                        </span>
                      </div>
                      <div className="col-10">
                        <div className={form?.sameDay ? "d-flex" : "row"}>
                          {!form?.sameDay && (
                            <span className="col-6">
                              <input
                                type="date"
                                placeholder="DD-MM-YYYY"
                                value={form?.end_date}
                                className="form-control"
                                name="end_date"
                                readOnly={true}
                              />
                              {calculatingEndDate && (
                                <div className="spinner-border spinner-border-sm text-primary" role="status">
                                  <span className="sr-only">Loading...</span>
                                </div>
                              )}
                            </span>
                          )}
                          <span className={form?.sameDay ? "w-100" : "col-6"}>
                            <input
                              type="time"
                              placeholder="THH:MM"
                              value={form?.end_time}
                              className="form-control"
                              name="end_time"
                              onChange={handleChange}
                              readOnly={form?.sameDay}
                              disabled={form?.is_allday}
                            />
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                {/* {!notStartDate && (
                  <div className="row align-items-center form-group">
                    <div className="col-2 text-left">
                      <span className="d-inline-block text-grey">
                        <nobr>{dependantDateFieldLabel}</nobr>
                      </span>
                    </div>
                    <div className="col-10">
                      <input
                        type="date"
                        placeholder="DD-MM-YYYY"
                        value={form?.dependant_date}
                        className="form-control"
                        name="dependant_date"
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                )} */}
                <div className="row align-items-center form-group">
                  <div className="col-2 text-left">
                    <span className="d-inline-block text-grey">
                      <nobr>Service Date</nobr>
                    </span>
                  </div>
                  <div className="col-10">
                    <div className="row">
                      <span className="col-6">
                        <input
                          type="date"
                          placeholder="DD-MM-YYYY"
                          value={form?.service_date}
                          className="form-control"
                          name="service_date"
                          onChange={handleChange}
                        />
                      </span>
                      <span className="col-6">
                        <select
                          name="for_service"
                          className="form-select form-control"
                          value={form.for_service}
                          onChange={handleIntChange}
                        >
                          <option value="">Select Service Method</option>
                          {serviceData?.map((item) => (
                            <option key={item?.id} value={item?.id}>
                              {item?.name}
                            </option>
                          ))}
                        </select>
                      </span>
                    </div>
                  </div>
                </div>
                {/* After Dependant date is input, use it to calculate */}
                {!form?.start_date && (
                  <div className="text-center text-red">
                    Add Start Date
                  </div>
                )}
                <div>
                  <div
                    style={{
                      maxHeight: "250px",
                      overflowY: "scroll",
                      padding: "10px",
                      display: "grid",
                      gap: "10px",
                      height: "auto",
                    }}
                  >
                    {calculatedDates?.length > 0 ? (
                      calculatedDates.map((date, index) => {
                        const calculatedDate = notStartDate
                          && form.start_date &&
                            calculateNewDate(form.start_date, date)
                        return (
                          <div key={index} className="form-check">
                            <label className="form-check-label">
                              <input
                                type="checkbox"
                                className="form-check-input"
                                value={date.id}
                                style={{ accentColor: "grey" }}
                                onChange={handleCalDatesChange}
                                checked={form.calculated_dates?.includes(date.id)}
                              />
                              {date?.calculated_date_name}
                              {" - "}
                              {calculatedDate
                                ? `${calculatedDate}`
                                : date?.dependant_date?.dependent_date_name
                                  ? `${date?.dependant_date?.dependent_date_name}`
                                  : ""}
                            </label>
                          </div>
                        );
                      })
                    ) : (
                      <p>No Calculated Dates Available</p>
                    )}
                  </div>
                </div>
            </div>
          }

          { litigationActTab == "location" && 
            <div className="min-h-400 m-t-5">
              <div className="height-21 mt-2 mb-1"></div>
            <div className="mb-2">
                <div className="dropdown-container" ref={dropdownRef2}>
                  <div className="form-select form-control d-flex" onClick={handleDropdownToggle2}>
                  {selectedIndex !== "" && caseAddresses[selectedIndex] ? (
                      <>
                      <i className={`ic ic-19 ${caseAddresses[selectedIndex]?.contact?.type == "Defendant" ? "ic-defendants" : "ic-client"} m-l-5 m-r-5`}></i> {caseAddresses[selectedIndex]?.label}  |{" "}
                        {caseAddresses[selectedIndex]?.contact?.[
                          caseAddresses[selectedIndex]?.contact?.selectedContact
                        ]?.address1 &&
                          `${caseAddresses[selectedIndex]?.contact?.[
                            caseAddresses[selectedIndex]?.contact?.selectedContact
                          ]?.address1}, `}

                        {caseAddresses[selectedIndex]?.contact?.[
                          caseAddresses[selectedIndex]?.contact?.selectedContact
                        ]?.address2 &&
                          `${caseAddresses[selectedIndex]?.contact?.[
                            caseAddresses[selectedIndex]?.contact?.selectedContact
                          ]?.address2}, `}

                        {caseAddresses[selectedIndex]?.contact?.[
                          caseAddresses[selectedIndex]?.contact?.selectedContact
                        ]?.city &&
                          `${caseAddresses[selectedIndex]?.contact?.[
                            caseAddresses[selectedIndex]?.contact?.selectedContact
                          ]?.city}, `}

                        {caseAddresses[selectedIndex]?.contact?.[
                          caseAddresses[selectedIndex]?.contact?.selectedContact
                        ]?.state &&
                          `${caseAddresses[selectedIndex]?.contact?.[
                            caseAddresses[selectedIndex]?.contact?.selectedContact
                          ]?.state} `}

                        {caseAddresses[selectedIndex]?.contact?.[
                          caseAddresses[selectedIndex]?.contact?.selectedContact
                        ]?.zip &&
                          `${caseAddresses[selectedIndex]?.contact?.[
                            caseAddresses[selectedIndex]?.contact?.selectedContact
                          ]?.zip}`}
                      </>
                    ) : (
                      <>
                        <span>Select Litigation Act Location</span>
                      </>
                    )}
                  </div>
                  {isOpen2 && (
                    <ul className="dropdown-list">
                      <li onClick={() => handleAddressChange("")}><i className={`ic ic-19 m-r-5`}></i> <span>Select Litigation Act Location</span></li>
                      {caseAddresses.map((option, index) => (
                        <li key={index} onClick={() => handleAddressChange(index)}>
                          <i className={`ic ic-19 ${option?.contact?.type == "Defendant" ? "ic-defendants" : "ic-client"} m-r-5`}></i> {option?.label} |{" "}
                          {option?.contact?.[option?.contact?.selectedContact]?.address1 &&
                            `${option?.contact?.[option?.contact?.selectedContact]?.address1}, `}
                          {option?.contact?.[option?.contact?.selectedContact]?.address2 &&
                            `${option?.contact?.[option?.contact?.selectedContact]?.address2}, `}
                          {option?.contact?.[option?.contact?.selectedContact]?.city &&
                            `${option?.contact?.[option?.contact?.selectedContact]?.city}, `}
                          {option?.contact?.[option?.contact?.selectedContact]?.state &&
                            `${option?.contact?.[option?.contact?.selectedContact]?.state}`}
                          {option?.contact?.[option?.contact?.selectedContact]?.zip &&
                          ` ${option?.contact?.[option?.contact?.selectedContact]?.zip}`}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="row align-items-center form-group">
                <div className="col-2 text-left">
                  <span className="d-inline-block text-grey">Name</span>
                </div>
                <div className="col-10">
                  <input
                    type="text"
                    placeholder="Name"
                    value={form?.name}
                    className="form-control bg-white"
                    onChange={handleChange}
                    name="name"
                  />
                </div>
              </div>
              <div className="row align-items-center form-group">
                <div className="col-2 text-left">
                  <span className="d-inline-block text-grey">Address</span>
                </div>
                <div className="col-10 d-flex p-0">
                  <span className="col-6">
                    <input
                      type="text"
                      placeholder="Address 1"
                      value={form?.address1}
                      className="form-control bg-white"
                      onChange={handleChange}
                      name="address1"
                    />
                  </span>
                  <span className="col-6">
                    <input
                      type="text"
                      placeholder="Address 2"
                      value={form?.address2}
                      className="form-control bg-white"
                      onChange={handleChange}
                      name="address2"
                    />
                  </span>
                </div>
              </div>
              <div className="row align-items-center form-group">
                <div className="col-2 text-left">
                  <span className="d-inline-block text-grey">City & State</span>
                </div>
                <div className="col-10 d-flex p-0">
                  <span className="col-6">
                    <input
                      type="text"
                      placeholder="City"
                      value={form?.city}
                      className="form-control bg-white"
                      onChange={handleChange}
                      name="city"
                    />
                  </span>
                  <span className="col-6">
                    <select
                      className="form-control"
                      name="state"
                      value={form?.state}
                      onChange={handleChange}
                    >
                      <option value={null}>Select State</option>
                      {statesData?.map((state) => (
                        <option key={state.id} value={state.StateAbr}>
                          {state.name}
                        </option>
                      ))}
                    </select>
                  </span>
                </div>
              </div>
              <div className="row align-items-center form-group">
                <div className="col-2 text-left">
                  <span className="d-inline-block text-grey">Phone & Fax</span>
                </div>
                <div className="col-10 d-flex p-0">
                  <span className="col-6">
                    <input
                      type="text"
                      placeholder="Phone"
                      value={form?.phone_number}
                      className="form-control bg-white"
                      onChange={handleChange}
                      name="phone_number"
                    />
                  </span>
                  <span className="col-6">
                    <input
                      type="text"
                      placeholder="Fax"
                      value={form?.fax}
                      className="form-control bg-white"
                      onChange={handleChange}
                      name="fax"
                    />
                  </span>
                  {/* <span className="col-4">
                        <input
                          type="text"
                          placeholder="Zip"
                          value={form?.zip}
                          className="form-control bg-white"
                          onChange={handleChange}
                          name="zip"
                        />
                      </span> */}
                </div>
              </div>
              <div className="row align-items-center form-group">
                <div className="col-2 text-left">
                  <span className="d-inline-block text-grey">
                    Email & Website
                  </span>
                </div>
                <div className="col-10 d-flex p-0">
                  <span className="col-6">
                    <input
                      type="text"
                      placeholder="Email"
                      value={form?.email}
                      className="form-control bg-white"
                      onChange={handleChange}
                      name="email"
                    />
                  </span>
                  <span className="col-6">
                    <input
                      type="text"
                      placeholder="Website"
                      value={form?.website}
                      className="form-control bg-white"
                      onChange={handleChange}
                      name="website"
                    />
                  </span>
                </div>
              </div>
              <div className="row align-items-center form-group">
                <div className="col-2 text-left">
                  <span className="d-inline-block text-grey">Meeting Link</span>
                </div>
                <div className="col-10">
                  <input
                    type="url"
                    placeholder="meetingurl"
                    value={form?.meetingurl}
                    className="form-control bg-white"
                    onChange={handleChange}
                    name="meetingurl"
                  />
                </div>
              </div>
            </div>  
          }

          { form?.start_date !== "" && litigationActTab == "triggered" && 
            <div className="min-h-400 m-t-5">
              <div className="height-21 mt-2 mb-1"></div>
              <div className="events-list">
                {eventsData2.map((event) => {
                  const isTriggered = form.events_triggered?.includes(event.id);
                  const isBlocked = form.events_blocked?.includes(event.id);

                  return (
                    <div
                      key={event.id}
                      className="d-flex align-items-center justify-content-between py-2"
                    >
                      <span>{event.event_name}</span>
                      <div className="btn-group" style={{ minWidth: "160px" }}>
                        <button
                          type="button"
                          className="btn btn-primary flex-grow-1"
                          onClick={() => handleEventAction(event, "trigger")}
                        >
                          {isTriggered ? "Triggered" : "Trigger"}
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger flex-grow-1"
                          onClick={() => handleEventAction(event, "block")}
                        >
                          {isBlocked ? "Blocked" : "Block"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          }
          
        </Tab.Container>
      </Modal.Body>
      <Modal.Footer>
        <button
          type="button"
          class="btn btn-secondary float-left-margin-right-auto"
          onClick={handleClose}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          class="btn btn-success"
          disabled={
            form?.event_id === null ||
            form?.start_date === "" ||
            form?.event_type_id === null
          }
        >
          Save
        </button>
      </Modal.Footer>
    </Modal>
  );
}
const areEqual = (prevProps, nextProps) => {
  return (
    prevProps.showPopup === nextProps.showPopup &&
    prevProps.litigationDetail === nextProps.litigationDetail &&
    prevProps.handleClose === nextProps.handleClose
  );
};

export default React.memo(AddLitigationActPopup, areEqual);
