import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Modal } from "react-bootstrap";
import { getCaseId, getClientId } from "../../Utils/helper";
import {
  deleteLitigation,
  updateLitigation,
} from "../../Redux/litigation-event/litigationEventSlice";

function LitigationEventPopUp({
  eventsPopUp,
  handleClose,
  events,
  litigationEvent,
}) {
  const origin = process.env.REACT_APP_BACKEND_URL;
  const currentCaseId = getCaseId();
  const clientId = getClientId();
  const dispatch = useDispatch();
  const tokenBearer = localStorage.getItem("token");
  const { statesData } = useSelector((state) => state.states);
  const [countyData, setCountyData] = useState([]);
  const [dependantDateType, setDependantDateType] = useState([]);
  const [calculatedDates, setCalculatedDates] = useState([]);
  const [eventType, setEventType] = useState(events);
  const [activeTab, setActiveTab] = useState("state-federal");
  const [selectedState, setSelectedState] = useState("");
  const [caseTypes, setCaseTypes] = useState([]);

  const [form, setForm] = useState({
    id: "",
    event_name: "",
    event_type: "",
    state: "",
    counties: [],
    state_fed: "",
    date_type: "",
    description: "",
    event_code: "",
    service_one_party: false,
    service_all_parties: false,
    service_all_defendents: false,
    calculated_dates: [],
    is_allday: false,
    expiry: null,
    sameDay: false,
    sameDay_endTime: null,
    defendant_types: "ALL",
    litigation_event_triggered: [],
    litigation_event_blocked: [],
    trigger_date_name: "",
    days: "",
    months: "",
    years: "",
    days_type: "",
    case_type_id: [],
    trigger_on_accept: [],
    trigger_on_reject: [],
    trigger_on_deadline: [],
    trigger_on_dependant_date: [],
    trigger_type: "DependantDate",
  });

  const latestEventRef = useRef(litigationEvent);

  const getEventType = async () => {
    try {
      const response = await axios.get(`${origin}/api/all/event/types/`, {
        headers: {
          Authorization: tokenBearer,
        },
      });

      setEventType(response.data.data);
    } catch (err) {
      console.error("Error fetching event types:", err);
    }
  };

  const getCountyData = async () => {
    try {
      const response = await axios.get(
        `${origin}/api/all/counties/?state=${selectedState}`,
        {
          headers: {
            Authorization: tokenBearer,
          },
        }
      );

      setCountyData(response.data.data);
    } catch (err) {
      console.error("Error fetching counties:", err);
    }
  };

  const getDependantDateType = async () => {
    try {
      const response = await axios.get(
        `${origin}/api/all/dependant/date/types/`,
        {
          headers: {
            Authorization: tokenBearer,
          },
        }
      );

      setDependantDateType(response.data.data);
    } catch (err) {
      console.error("Error fetching dependant date types:", err);
    }
  };

  const getCalculatedDates = async () => {
    try {
      const response = await axios.get(
        `${origin}/api/all/calculated/dates/?state=${selectedState}`,
        {
          headers: {
            Authorization: tokenBearer,
          },
        }
      );

      setCalculatedDates(response.data.data);
    } catch (err) {
      console.error("Error fetching calculated dates:", err);
    }
  };

  const getCaseTypes = async () => {
    try {
      const response = await axios.get(`${origin}/api/getCaseTypes/`, 
        {
          headers: {
            Authorization: tokenBearer,
          },
        }
      );
      setCaseTypes(response.data.data);
    } catch (err) {
      console.error("Error fetching case types:", err);
    }
  };

  useEffect(() => {
    if (eventsPopUp && litigationEvent) {
      getEventType();
      getCaseTypes();
      getDependantDateType();
      setForm({
        id: litigationEvent?.id || "",
        event_name: litigationEvent?.event_name || "",
        event_type: litigationEvent?.event_type_id?.id || "",
        state: litigationEvent?.state_id?.id || "",
        state_fed: litigationEvent?.state_fed || "",
        counties: litigationEvent?.counties.map((c) => c.id) || [],
        date_type: litigationEvent?.dependent_date_type_id?.id || "",
        description: litigationEvent?.event_description || "",
        event_code: litigationEvent?.event_code || "",
        service_one_party: litigationEvent?.service_one_party || false,
        service_all_parties: litigationEvent?.service_all_parties || false,
        service_all_defendents:
          litigationEvent?.service_all_defendents || false,
        calculated_dates:
          litigationEvent?.calculated_dates_id?.map((date) => date.id) || [],
        is_allday: litigationEvent?.is_allday || false,
        expiry: litigationEvent?.expiry || null,
        sameDay: litigationEvent?.sameDay || false,
        sameDay: litigationEvent?.sameDay_endTime || null,
        defendant_types: litigationEvent?.defendant_types || "ALL",
        litigation_event_blocked:
          litigationEvent?.litigation_event_blocked?.map((event) => event.id) ||
          [],
        litigation_event_triggered:
          litigationEvent?.litigation_event_triggered?.map(
            (event) => event.id
          ) || [],
        days: litigationEvent?.day_count || "",
        months: litigationEvent?.month_count || "",
        years: litigationEvent?.year_count || "",
        days_type: litigationEvent?.day_count_type || "",
        trigger_date_name: litigationEvent?.trigger_date_name || "",
        case_type_id:
          litigationEvent?.case_type_id?.map((type) => type.id) || [],
        trigger_on_accept: litigationEvent?.trigger_on_accept?.map((obj)=> obj.id) || [],
        trigger_on_reject: litigationEvent?.trigger_on_reject?.map((obj)=> obj.id) || [],
        trigger_on_deadline: litigationEvent?.trigger_on_deadline?.map((obj)=> obj.id) || [],
        trigger_on_dependant_date: litigationEvent?.trigger_on_dependant_date?.map((obj)=> obj.id) || [],
        trigger_type: litigationEvent?.trigger_type || "DependantDate"
      });
      setSelectedState(litigationEvent?.state_id?.StateAbr);
      latestEventRef.current = litigationEvent;
    }
  }, [litigationEvent, eventsPopUp]);

  useEffect(() => {
    if (eventsPopUp && selectedState) {
      getCountyData();
      getCalculatedDates();
    }
  }, [selectedState, eventsPopUp]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setForm((prevForm) => ({
        ...prevForm,
        [name]: checked,
      }));
    } else {
      setForm((prevForm) => ({
        ...prevForm,
        [name]: value,
      }));
    }
  };

  // Generic handler for checkbox lists that require IDs
  const handleListItemChange = (e, listName) => {
    const id = parseInt(e.target.value);
    if (e.target.checked) {
      setForm((prevForm) => ({
        ...prevForm,
        [listName]: [...prevForm[listName], id],
      }));
    } else {
      setForm((prevForm) => ({
        ...prevForm,
        [listName]: prevForm[listName].filter((item) => item !== id),
      }));
    }
  };

  // Handler for checkboxes that need to be mutually exclusive across lists
  const handleMutuallyExclusiveListChange = (e, selectedList) => {
    const id = parseInt(e.target.value);
    const lists = [
      "trigger_on_accept",
      "trigger_on_reject",
      "trigger_on_deadline",
      "trigger_on_dependant_date",
    ];
  
    if (e.target.checked) {
      const updatedForm = { ...form };
  
      lists.forEach((list) => {
        updatedForm[list] = updatedForm[list].filter((item) => item !== id);
      });
  
      updatedForm[selectedList] = [...updatedForm[selectedList], id];
  
      setForm(updatedForm);
    } else {
      setForm((prevForm) => ({
        ...prevForm,
        [selectedList]: prevForm[selectedList].filter((item) => item !== id),
      }));
    }
  };

  const onRadioChange = (e) => {
    handleChange({
      target: {
        name: "trigger_date_name",
        value: e.target.value,
      },
    });
  };

  const handleStateChange = (e) => {
    const stateId = parseInt(e.target.value);
    const state = statesData?.find((state) => state.id === stateId);
    if (state) {
      setSelectedState(state.StateAbr);
      setForm((prevForm) => ({
        ...prevForm,
        state: state.id,
        counties: [],
      }));
    }
  };

  const handleCalculatedDatesChange = (e) => {
    handleListItemChange(e, "calculated_dates");
  };

  const handleCountiesChange = (e) => {
    handleListItemChange(e, "counties");
  };

  const handleSelectAllCounties = (e) => {
    if (e.target.checked) {
      setForm((prevForm) => ({
        ...prevForm,
        counties: countyData?.map((county) => county.id),
      }));
    } else {
      setForm((prevForm) => ({
        ...prevForm,
        counties: [],
      }));
    }
  };

  const handleEventsChange = (e) => {
    handleListItemChange(e, "litigation_event_triggered");
  };

  const handleCaseTypeChange = (e) => {
    handleListItemChange(e, "case_type_id");
  };

  const handleSaveClick = async () => {
    try {
      const response = await axios.patch(
        `${origin}/api/add/litigation/event/${clientId}/${currentCaseId}/`,
        form,
        {
          headers: {
            Authorization: tokenBearer,
          },
        }
      );
      dispatch(
        updateLitigation({
          id: latestEventRef.current.id,
          updatedData: response.data.data,
        })
      );
      handleClose();
    } catch (error) {
      console.error("Error updating litigation events", error.message);
    }
  };

  const handleDeleteClick = async () => {
    try {
      const response = await axios.delete(
        `${origin}/api/add/litigation/event/${clientId}/${currentCaseId}/`,
        {
          data: {
            id: litigationEvent.id,
            block_name: "litigationEvent",
          },
          headers: {
            Authorization: tokenBearer,
          },
        }
      );
      dispatch(deleteLitigation(litigationEvent.id));
      handleClose();
      setActiveTab("state-federal");
    } catch (error) {
      console.error("Error deleting litigation events:", error.message);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <Modal
      show={eventsPopUp}
      onHide={handleClose}
      dialogClassName="modal-dialog-centered max-width-1900px"
    >
      <Modal.Header className="bg-primary p-2">
        <h4 className="modal-title text-white mx-auto">
          Edit Litigation Event
        </h4>
      </Modal.Header>
      <Modal.Body>
        <nav className="d-flex justify-content-center">
          <div
            className="nav nav-tabs"
            id="nav-tab"
            role="tablist"
            style={{ width: "60%" }}
          >
            <a
              className={`nav-item nav-link tab-item ${activeTab === "state-federal" ? "active" : ""}`}
              onClick={() => handleTabClick("state-federal")}
              id="add-state-federal-link"
              data-toggle="tab"
              href="#add-state-federal-tab"
              role="tab"
              aria-controls="add-state-federal-tab"
              aria-selected={activeTab === "state-federal"}
            >
              State/Federal
            </a>
            <a
              className={`nav-item nav-link tab-item ${activeTab === "event-details" ? "active" : ""}`}
              onClick={() => handleTabClick("event-details")}
              id="add-event-details-link"
              data-toggle="tab"
              href="#add-event-details-tab"
              role="tab"
              aria-controls="add-event-details-tab"
              aria-selected={activeTab === "event-details"}
            >
              Event Details
            </a>

            <a
              className={`nav-item nav-link tab-item ${activeTab === "events-triggered" ? "active" : ""}`}
              onClick={() => handleTabClick("events-triggered")}
              id="add-events-triggered-link"
              data-toggle="tab"
              href="#add-events-triggered-tab"
              role="tab"
              aria-controls="add-events-triggered-tab"
              aria-selected={activeTab === "events-triggered"}
            >
              Event Triggered
            </a>

            <a
              className={`nav-item nav-link tab-item ${activeTab === "triggering-date" ? "active" : ""}`}
              onClick={() => handleTabClick("triggering-date")}
              id="add-triggering-date-link"
              data-toggle="tab"
              href="#add-triggering-date-tab"
              role="tab"
              aria-controls="add-triggering-date-tab"
              aria-selected={activeTab === "triggering-date"}
            >
              Dates
            </a>

            <a
              className={`nav-item nav-link tab-item ${activeTab === "accept-reject-trigger" ? "active" : ""}`}
              onClick={() => handleTabClick("accept-reject-trigger")}
              id="add-accept-reject-trigger-link"
              data-toggle="tab"
              href="#add-accept-reject-trigger-tab"
              role="tab"
              aria-controls="add-accept-reject-trigger-tab"
              aria-selected={activeTab === "accept-reject-trigger"}
            >
              Accept/Reject Trigger
            </a>

            <a
              className={`nav-item nav-link tab-item ${activeTab === "calculated-dates" ? "active" : ""}`}
              onClick={() => handleTabClick("calculated-dates")}
              id="add-calculated-dates-link"
              data-toggle="tab"
              href="#add-calculated-dates-tab"
              role="tab"
              aria-controls="add-calculated-dates-tab"
              aria-selected={activeTab === "calculated-dates"}
            >
              Calculated Dates
            </a>
          </div>
        </nav>

        <div
          className="tab-content mt-2"
          id="nav-tabContent"
          style={{ height: "700px" }}
        >
          <div
            className={`tab-pane fade overflow-hidden ${activeTab === "state-federal" ? "show active" : ""}`}
            id="add-state-federal-tab"
            role="tabpanel"
            aria-labelledby="add-state-federal-link"
          >
            <div className="row align-items-center form-group mt-2">
              <div className="col-md-2 text-left">
                <span className="d-inline-block text-grey">
                  <nobr>State/Federal</nobr>
                </span>
              </div>
              <div className="col-md-10">
                <div className="row">
                  <div className="form-check form-check-inline">
                    <label className="form-check-label" htmlFor="stateOption">
                      <input
                        type="radio"
                        id="stateOption"
                        name="state_fed"
                        value="State"
                        style={{ accentColor: "grey" }}
                        className="form-check-input"
                        onChange={handleChange}
                        checked={form.state_fed === "State"}
                      />
                      State
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <label className="form-check-label" htmlFor="federalOption">
                      <input
                        type="radio"
                        id="federalOption"
                        name="state_fed"
                        value="Federal"
                        style={{ accentColor: "grey" }}
                        className="form-check-input"
                        onChange={handleChange}
                        checked={form.state_fed === "Federal"}
                      />
                      Federal
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="row align-items-center form-group">
              <div className="col-md-2 text-left">
                <span className="d-inline-block text-grey">State</span>
              </div>
              <div className="col-md-10">
                <select
                  name="state"
                  className="form-select form-control"
                  value={form.state}
                  onChange={handleStateChange}
                  disabled={form.state_fed !== "State"}
                >
                  <option value="">Select State</option>
                  {statesData?.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="row align-items-start form-group">
              <div className="col-2 text-left">
                <span className="d-inline-block text-grey">Counties</span>
              </div>
              <div className="col-10">
                <div
                  style={{
                    maxHeight: "650px",
                    overflowY: "scroll",
                    border: "1px solid #ccc",
                    padding: "10px",
                    display: "grid",
                    gridTemplateColumns: "repeat(7, 1fr)",
                    gap: "10px",
                    height: "auto",
                  }}
                >
                  {countyData?.length > 1 && (
                    <div className="form-check">
                      <input
                        id="all-counties"
                        type="checkbox"
                        className="form-check-input"
                        style={{ accentColor: "grey" }}
                        onChange={handleSelectAllCounties}
                        checked={form.counties?.length === countyData.length}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="all-counties"
                        style={{ cursor: "pointer" }}
                      >
                        All Counties
                      </label>
                    </div>
                  )}
                  {countyData?.length > 0 ? (
                    countyData.map((county, index) => (
                      <div key={index} className="form-check">
                        <input
                          id={county.name}
                          type="checkbox"
                          className="form-check-input"
                          value={county.id}
                          style={{ accentColor: "grey" }}
                          onChange={handleCountiesChange}
                          checked={form.counties?.includes(county.id)}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={county.name}
                          style={{ cursor: "pointer" }}
                        >
                          {county.name}
                        </label>
                      </div>
                    ))
                  ) : (
                    <p>Select State First</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div
            className={`tab-pane fade overflow-hidden ${activeTab === "event-details" ? "show active" : ""}`}
            id="add-event-details-tab"
            role="tabpanel"
            aria-labelledby="add-event-details-link"
          >
            <div className="row align-items-center form-group">
              <div className="col-md-2 text-left">
                <span className="d-inline-block text-grey">
                  <nobr>Event Name</nobr>
                </span>
              </div>
              <div className="col-md-10">
                <input
                  type="text"
                  placeholder="Enter Event Name"
                  value={form.event_name}
                  className="form-control"
                  name="event_name"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="row align-items-center form-group">
              <div className="col-md-2 text-left">
                <span className="d-inline-block text-grey">
                  <nobr>Event Type</nobr>
                </span>
              </div>
              <div className="col-md-10">
                <select
                  name="event_type"
                  className="form-select form-control"
                  value={form.event_type}
                  onChange={handleChange}
                >
                  <option value="">Select Event type</option>
                  {eventType?.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.litigation_event_type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="row align-items-start form-group">
              <div className="col-2 text-left text-grey">Case Types</div>
              <div className="col-10">
                <div
                  className="form-control"
                  style={{
                    minHeight: "42px",
                    height: "auto",
                    maxHeight: "222px",
                    overflowY: "scroll",
                    border: "1px solid #ccc",
                    padding: "10px",
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "10px",
                  }}
                >
                  {caseTypes?.map((obj, index) => (
                    <div key={index} className="form-check">
                      <label className="form-check-label">
                        <input
                          type="checkbox"
                          name="case_type_id"
                          value={obj.id}
                          className="form-check-input"
                          style={{ accentColor: "grey" }}
                          checked={form.case_type_id?.some(
                            (id) => id === obj.id
                          )}
                          onChange={handleCaseTypeChange}
                        />
                        {obj.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="row align-items-center form-group">
              <div className="col-md-2 text-left">
                <span className="d-inline-block text-grey">
                  Event Description
                </span>
              </div>
              <div className="col-md-10">
                <input
                  type="text"
                  placeholder="Enter Description"
                  value={form.description}
                  className="form-control"
                  name="description"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="row align-items-center form-group">
              <div className="col-md-2 text-left">
                <span className="d-inline-block text-grey">Event Code</span>
              </div>
              <div className="col-md-10">
                <input
                  type="text"
                  placeholder="Enter Event Code"
                  value={form.event_code}
                  className="form-control"
                  name="event_code"
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="row mt-2">
              <div className="text-left col-3">
                <span className="d-inline-block text-grey">Defendant Type</span>
              </div>
              <label
                className="d-flex align-items-center form-group col-2"
                htmlFor="defendant-type-all"
                style={{ cursor: "pointer" }}
              >
                <div className="text-left" style={{ paddingLeft: "104px" }}>
                  <span className="d-inline-block text-grey">All</span>
                </div>
                <div className="mb-2">
                  <input
                    id="defendant-type-all"
                    type="checkbox"
                    className="form-check-input ml-3"
                    name="defendant_types"
                    style={{ accentColor: "grey" }}
                    checked={form.defendant_types === "ALL"}
                    onChange={() =>
                      setForm((prevForm) => ({
                        ...prevForm,
                        defendant_types: "ALL",
                      }))
                    }
                  />
                </div>
              </label>
              <label
                className="d-flex align-items-center form-group col-2"
                htmlFor="defendant-type-private"
                style={{ cursor: "pointer" }}
              >
                <div className="text-left">
                  <span className="d-inline-block text-grey">
                    Private Individuals
                  </span>
                </div>
                <div className="mb-2">
                  <input
                    id="defendant-type-private"
                    type="checkbox"
                    className="form-check-input ml-3"
                    name="defendant_types"
                    style={{ accentColor: "grey" }}
                    checked={form.defendant_types === "PRIVATE_INDIVIDUALS"}
                    onChange={() =>
                      setForm((prevForm) => ({
                        ...prevForm,
                        defendant_types: "PRIVATE_INDIVIDUALS",
                      }))
                    }
                  />
                </div>
              </label>
              <label
                className="d-flex align-items-center form-group col-2"
                htmlFor="defendant-type-public"
                style={{ cursor: "pointer" }}
              >
                <div className="text-left" style={{ paddingLeft: "58px" }}>
                  <span className="d-inline-block text-grey">
                    Public Entities
                  </span>
                </div>
                <div className="mb-2">
                  <input
                    id="defendant-type-public"
                    type="checkbox"
                    className="form-check-input ml-3"
                    name="defendant_types"
                    style={{ accentColor: "grey" }}
                    checked={form.defendant_types === "PUBLIC_ENTITIES"}
                    onChange={() =>
                      setForm((prevForm) => ({
                        ...prevForm,
                        defendant_types: "PUBLIC_ENTITIES",
                      }))
                    }
                  />
                </div>
              </label>
              <label
                className="d-flex align-items-center form-group col-2"
                htmlFor="defendant-type-companies"
                style={{ cursor: "pointer" }}
              >
                <div className="text-left">
                  <span className="d-inline-block text-grey">Companies</span>
                </div>
                <div className="mb-2">
                  <input
                    id="defendant-type-companies"
                    type="checkbox"
                    className="form-check-input ml-3"
                    name="defendant_types"
                    style={{ accentColor: "grey" }}
                    checked={form.defendant_types === "COMPANIES"}
                    onChange={() =>
                      setForm((prevForm) => ({
                        ...prevForm,
                        defendant_types: "COMPANIES",
                      }))
                    }
                  />
                </div>
              </label>
            </div>
            <div className="row mt-2">
              <div className="text-left col-3">
                <span className="d-inline-block text-grey">Service Type</span>
              </div>
              <label
                className="d-flex align-items-center form-group col-2"
                htmlFor="serice-one-party"
                style={{ cursor: "pointer" }}
              >
                <div className="text-left">
                  <span className="d-inline-block text-grey">
                    Service One Party
                  </span>
                </div>
                <div className="mb-2">
                  <input
                    id="serice-one-party"
                    type="checkbox"
                    className="form-check-input ml-3"
                    name="service_one_party"
                    style={{ accentColor: "grey" }}
                    checked={form.service_one_party}
                    onClick={() =>
                      setForm((prevForm) => ({
                        ...prevForm,
                        service_one_party: true,
                        service_all_parties: false,
                        service_all_defendents: false,
                      }))
                    }
                  />
                </div>
              </label>
              <label
                className="d-flex align-items-center form-group col-2"
                htmlFor="service-all-parties"
                style={{ cursor: "pointer" }}
              >
                <div className="text-left">
                  <span className="d-inline-block text-grey">
                    Service All Parties
                  </span>
                </div>
                <div className="mb-2">
                  <input
                    id="service-all-parties"
                    type="checkbox"
                    className="form-check-input ml-3"
                    name="service_all_parties"
                    style={{ accentColor: "grey" }}
                    checked={form.service_all_parties}
                    onClick={() =>
                      setForm((prevForm) => ({
                        ...prevForm,
                        service_one_party: false,
                        service_all_parties: true,
                        service_all_defendents: false,
                      }))
                    }
                  />
                </div>
              </label>
              <label
                className="d-flex align-items-center form-group col-2"
                htmlFor="service-all-defendants"
                style={{ cursor: "pointer" }}
              >
                <div className="text-left">
                  <span className="d-inline-block text-grey">
                    Service All Defendents
                  </span>
                </div>
                <div className="mb-2">
                  <input
                    id="service-all-defendants"
                    type="checkbox"
                    className="form-check-input ml-3"
                    name="service_all_defendents"
                    style={{ accentColor: "grey" }}
                    checked={form.service_all_defendents}
                    onClick={() =>
                      setForm((prevForm) => ({
                        ...prevForm,
                        service_one_party: false,
                        service_all_parties: false,
                        service_all_defendents: true,
                      }))
                    }
                  />
                </div>
              </label>
              <label
                className="d-flex align-items-center form-group col-2"
                htmlFor="no-service"
                style={{ cursor: "pointer" }}
              >
                <div className="text-left" style={{ paddingLeft: "2px" }}>
                  <span className="d-inline-block text-grey">No Service</span>
                </div>
                <div className="mb-2">
                  <input
                    id="no-service"
                    type="checkbox"
                    className="form-check-input ml-3"
                    name="no_service"
                    style={{ accentColor: "grey" }}
                    checked={
                      !form.service_one_party &&
                      !form.service_all_parties &&
                      !form.service_all_defendents
                    }
                    onClick={() =>
                      setForm((prevForm) => ({
                        ...prevForm,
                        service_one_party: false,
                        service_all_parties: false,
                        service_all_defendents: false,
                      }))
                    }
                  />
                </div>
              </label>
            </div>
          </div>
          <div
            className={`tab-pane fade overflow-hidden ${activeTab === "events-triggered" ? "show active" : ""}`}
            id="add-events-triggered-tab"
            role="tabpanel"
            aria-labelledby="add-events-triggered-link"
          >
            <div className="row align-items-start form-group">
              <div className="col-2 text-left text-grey">
                Litigation Event Triggered
              </div>
              <div className="col-10">
                <div
                  className="form-control"
                  style={{
                    minHeight: "42px",
                    height: "auto",
                    maxHeight: "500px",
                    overflowY: "scroll",
                    border: "1px solid #ccc",
                    padding: "10px",
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "10px",
                  }}
                >
                  {events?.map((event) => (
                    <div key={event.id} className="form-check">
                      <label className="form-check-label">
                        <input
                          type="checkbox"
                          name="litigation_event_triggered"
                          value={event.id}
                          className="form-check-input"
                          style={{ accentColor: "grey" }}
                          checked={form.litigation_event_triggered?.some(
                            (id) => id === event.id
                          )}
                          onChange={handleEventsChange}
                        />
                        {event.event_name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div
            className={`tab-pane fade overflow-hidden ${activeTab === "triggering-date" ? "show active" : ""}`}
            id="add-triggering-date-tab"
            role="tabpanel"
            aria-labelledby="add-triggering-date-link"
          >
            <div className="row align-items-center form-group">
              <div className="col-md-2 text-left">
                <span className="d-inline-block text-grey">Dependant Date Type</span>
              </div>
              <div className="col-md-10">
                <select
                  name="date_type"
                  className="form-select form-control"
                  value={form.date_type}
                  onChange={handleChange}
                >
                  <option value="">Select Dependant Date</option>
                  {dependantDateType?.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.dependent_date_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="row align-items-center form-group">
              <div className="col-3 text-left">
                <span className="d-inline-block text-grey">
                  <nobr>All Day</nobr>
                </span>
              </div>
              <div style={{ marginLeft: "135px" }}>
                <input
                  type="checkbox"
                  checked={form.is_allday}
                  className="form-check-input ml-3"
                  name="is_allday"
                  style={{ accentColor: "grey" }}
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      is_allday: !prev.is_allday,
                      sameDay: false,
                      ...((!prev.is_allday) ? { days: "", months: "", years: "" } : {})
                    }))
                  }
                />
              </div>
            </div>

            <div className="row align-items-center form-group pb-2">
              <div className="col-3 text-left">
                <span className="d-inline-block text-grey">
                  <nobr>Same Day</nobr>
                </span>
              </div>
              <div style={{ marginLeft: "135px" }}>
                <input
                  type="checkbox"
                  checked={form.sameDay}
                  className="form-check-input ml-3"
                  name="sameDay"
                  style={{ accentColor: "grey" }}
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      sameDay: !prev.sameDay,
                      is_allday: false,
                      ...((!prev.sameDay) ? { days: "", months: "", years: "" } : {})
                    }))
                  }
                />
              </div>
            </div>

            {form.sameDay && (
              <div className="row align-items-center form-group">
                <div className="col-md-2 text-left">
                  <span className="d-inline-block text-grey">End Time</span>
                </div>
                <div className="col-md-10">
                  <input
                    type="time"
                    value={form.sameDay_endTime || ""}
                    className="form-control bg-white"
                    onChange={handleChange}
                    name="sameDay_endTime"
                  />
                </div>
              </div>
            )}
            <div className="row align-items-center form-group mt-2">
              <div className="col-3 text-left">
                <span className="d-inline-block text-grey">
                  Trigger Date Type
                </span>
              </div>
              <div className="row col-9">
                <div className="form-check col-4">
                  <input
                    type="radio"
                    id="incident-date"
                    name="trigger_date_name"
                    value="Incident Date"
                    checked={form?.trigger_date_name === "Incident Date"}
                    onChange={onRadioChange}
                    className="form-check-input"
                    style={{ accentColor: "grey" }}
                  />
                  <label className="form-check-label" htmlFor="incident-date">
                    Incident Date
                  </label>
                </div>

                <div className="form-check col-4">
                  <input
                    type="radio"
                    id="client-birth-day"
                    name="trigger_date_name"
                    value="Birthday"
                    checked={form?.trigger_date_name === "Birthday"}
                    onChange={onRadioChange}
                    className="form-check-input"
                    style={{ accentColor: "grey" }}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="client-birth-day"
                  >
                    Birthday
                  </label>
                </div>

                <div className="form-check col-4">
                  <input
                    type="radio"
                    id="client-18th-birthday"
                    name="trigger_date_name"
                    value="18th Birthday"
                    checked={form?.trigger_date_name === "18th Birthday"}
                    onChange={onRadioChange}
                    className="form-check-input"
                    style={{ accentColor: "grey" }}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="client-18th-birthday"
                  >
                    18th birthday
                  </label>
                </div>
              </div>
            </div>
            <div className="row align-items-center form-group">
              <div className="col-2 text-left">
                <span className="d-inline-block text-grey">Date Type</span>
              </div>
              <div className="col-10">
                <select
                  name="days_type"
                  className="form-select form-control"
                  value={form?.days_type}
                  onChange={handleChange}
                >
                  <option value="">Select Day Count Type</option>
                  <option value="Calender">Calender Days</option>
                  <option value="Court">Court Days</option>
                </select>
              </div>
            </div>
            <div className="row align-items-center form-group">
              <div className="col-2"></div>
              <div className="d-flex p-0 form-group col-10">
                <div className="col-4">
                  <input
                    type="text"
                    placeholder="Enter Day Count"
                    value={form?.days}
                    className="form-control"
                    name="days"
                    onChange={handleChange}
                    disabled={form.is_allday || form.sameDay}
                  />
                </div>
                <div className="col-4">
                  <input
                    type="text"
                    placeholder="Enter Month Count"
                    value={form?.months}
                    className="form-control"
                    name="months"
                    onChange={handleChange}
                    disabled={form.is_allday || form.sameDay}
                  />
                </div>
                <div className="col-4">
                  <input
                    type="text"
                    placeholder="Enter Year Count"
                    value={form?.years}
                    className="form-control"
                    name="years"
                    onChange={handleChange}
                    disabled={form.is_allday || form.sameDay}
                  />
                </div>
              </div>
            </div>
            <div className="row align-items-center form-group mt-2">
              <div className="col-3 text-left">
                <span className="d-inline-block text-grey">Trigger Type</span>
              </div>
              <div className="row col-9">
                <div className="form-check col-4">
                  <input
                    type="radio"
                    id="trigger-dependant-date"
                    name="trigger_type"
                    value="DependantDate"
                    checked={form.trigger_type === "DependantDate"}
                    onChange={handleChange}
                    className="form-check-input"
                    style={{ accentColor: "grey" }}
                  />
                  <label className="form-check-label" htmlFor="trigger-dependant-date">
                    Dependant Date
                  </label>
                </div>

                <div className="form-check col-4">
                  <input
                    type="radio"
                    id="trigger-accept-reject"
                    name="trigger_type"
                    value="Accept/Reject"
                    checked={form.trigger_type === "Accept/Reject"}
                    onChange={handleChange}
                    className="form-check-input"
                    style={{ accentColor: "grey" }}
                  />
                  <label className="form-check-label" htmlFor="trigger-accept-reject">
                    Accept/Reject
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`tab-pane fade overflow-hidden ${activeTab === "accept-reject-trigger" ? "show active" : ""}`}
            id="add-accept-reject-trigger-tab"
            role="tabpanel"
            aria-labelledby="add-accept-reject-trigger-link"
          >
            {form.trigger_type === "DependantDate" && (
              <div className="row align-items-start form-group mt-3">
                <div className="col-2 text-left text-grey">Trigger on Dependant Date</div>
                <div className="col-10">
                  <div
                    className="form-control"
                    style={{
                      minHeight: "42px",
                      height: "auto",
                      maxHeight: "222px",
                      overflowY: "scroll",
                      border: "1px solid #ccc",
                      padding: "10px",
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: "10px",
                    }}
                  >
                    {events?.map((event) => {
                      const isInOtherList = form.trigger_on_deadline.includes(event.id);
                      return (
                        <div key={`dependant-${event.id}`} className="form-check">
                          <label
                            className="form-check-label"
                            style={isInOtherList ? { color: "#ccc" } : {}}
                          >
                            <input
                              type="checkbox"
                              name="trigger_on_dependant_date"
                              value={event.id}
                              className="form-check-input"
                              style={{ accentColor: "grey" }}
                              checked={form.trigger_on_dependant_date?.includes(event.id)}
                              onChange={(e) =>
                                handleMutuallyExclusiveListChange(
                                  e,
                                  "trigger_on_dependant_date"
                                )
                              }
                              disabled={isInOtherList}
                            />
                            {event.event_name}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
            

            {form.trigger_type === "Accept/Reject" && (
              <>
                <div className="row align-items-start form-group mt-3">
                  <div className="col-2 text-left text-grey">Trigger on Accept</div>
                  <div className="col-10">
                    <div
                      className="form-control"
                      style={{
                        minHeight: "42px",
                        height: "auto",
                        maxHeight: "222px",
                        overflowY: "scroll",
                        border: "1px solid #ccc",
                        padding: "10px",
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: "10px",
                      }}
                    >
                      {events?.map((event) => {
                        const isInOtherList =
                          form.trigger_on_reject.includes(event.id) ||
                          form.trigger_on_deadline.includes(event.id);

                        return (
                          <div key={`accept-${event.id}`} className="form-check">
                            <label
                              className="form-check-label"
                              style={isInOtherList ? { color: "#ccc" } : {}}
                            >
                              <input
                                type="checkbox"
                                name="trigger_on_accept"
                                value={event.id}
                                className="form-check-input"
                                style={{ accentColor: "grey" }}
                                checked={form.trigger_on_accept?.includes(event.id)}
                                onChange={(e) =>
                                  handleMutuallyExclusiveListChange(
                                    e,
                                    "trigger_on_accept"
                                  )
                                }
                                disabled={isInOtherList}
                              />
                              {event.event_name}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="row align-items-start form-group mt-3">
                  <div className="col-2 text-left text-grey">Trigger on Reject</div>
                  <div className="col-10">
                    <div
                      className="form-control"
                      style={{
                        minHeight: "42px",
                        height: "auto",
                        maxHeight: "222px",
                        overflowY: "scroll",
                        border: "1px solid #ccc",
                        padding: "10px",
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: "10px",
                      }}
                    >
                      {events?.map((event) => {
                        const isInOtherList =
                          form.trigger_on_accept.includes(event.id) ||
                          form.trigger_on_deadline.includes(event.id);

                        return (
                          <div key={`reject-${event.id}`} className="form-check">
                            <label
                              className="form-check-label"
                              style={isInOtherList ? { color: "#ccc" } : {}}
                            >
                              <input
                                type="checkbox"
                                name="trigger_on_reject"
                                value={event.id}
                                className="form-check-input"
                                style={{ accentColor: "grey" }}
                                checked={form.trigger_on_reject?.includes(event.id)}
                                onChange={(e) =>
                                  handleMutuallyExclusiveListChange(
                                    e,
                                    "trigger_on_reject"
                                  )
                                }
                                disabled={isInOtherList}
                              />
                              {event.event_name}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </>
            )}


            {/* Trigger on Deadline */}
            <div className="row align-items-start form-group mt-3">
              <div className="col-2 text-left text-grey">
                Trigger on Deadline
              </div>
              <div className="col-10">
                <div
                  className="form-control"
                  style={{
                    minHeight: "42px",
                    height: "auto",
                    maxHeight: "222px",
                    overflowY: "scroll",
                    border: "1px solid #ccc",
                    padding: "10px",
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "10px",
                  }}
                >
                  {events?.map((event) => {
                    // Check if this event is in any other trigger list
                    const isInOtherList =
                      form.trigger_on_accept.includes(event.id) ||
                      form.trigger_on_reject.includes(event.id);

                    return (
                      <div key={`deadline-${event.id}`} className="form-check">
                        <label
                          className="form-check-label"
                          style={isInOtherList ? { color: "#ccc" } : {}}
                        >
                          <input
                            type="checkbox"
                            name="trigger_on_deadline"
                            value={event.id}
                            className="form-check-input"
                            style={{ accentColor: "grey" }}
                            checked={form.trigger_on_deadline?.includes(
                              event.id
                            )}
                            onChange={(e) =>
                              handleMutuallyExclusiveListChange(
                                e,
                                "trigger_on_deadline"
                              )
                            }
                            disabled={isInOtherList}
                          />
                          {event.event_name}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <div
            className={`tab-pane fade overflow-hidden ${activeTab === "calculated-dates" ? "show active" : ""}`}
            id="add-calculated-dates-tab"
            role="tabpanel"
            aria-labelledby="add-calculated-dates-link"
          >
            <div className="row align-items-center form-group">
              <div className="col-md-2 text-left">
                <span className="d-inline-block text-grey">Dependant Date</span>
              </div>
              <div className="col-md-10">
                <select
                  name="date_type"
                  className="form-select form-control"
                  value={form?.date_type}
                  onChange={handleChange}
                >
                  <option value="">Select Dependant Date</option>
                  {dependantDateType?.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item?.dependent_date_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="row align-items-start form-group">
              <div className="col-md-2 text-left">
                <span className="d-inline-block text-grey">
                  Calculated Dates
                </span>
              </div>
              <div className="col-md-10">
                <div
                  style={{
                    minHeight: "42px",
                    height: "auto",
                    maxHeight: "650px",
                    overflowY: "scroll",
                    border: "1px solid #ccc",
                    padding: "10px",
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: "10px",
                    height: "auto",
                  }}
                >
                  {calculatedDates?.map((date) => (
                    <div className key={date.id}>
                      <label
                        className="d-inline"
                        htmlFor={`cal_date_Checkbox${date.id}`}
                      >
                        <input
                          type="checkbox"
                          data-state={date?.state ? date.state?.id : ""}
                          // className="form-check-input"
                          id={`cal_date_Checkbox${date.id}`}
                          value={date.id}
                          name="calculated_dates"
                          style={{
                            accentColor: "grey",
                            marginRight: "5px",
                          }}
                          onChange={handleCalculatedDatesChange}
                          checked={form?.calculated_dates.includes(date.id)}
                        />
                        <nobr>{date?.calculated_date_name}</nobr>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="mt-0">
        <button
          type="button"
          className="btn btn-secondary float-left-margin-right-auto"
          onClick={() => {
            handleClose();
            setActiveTab("state-federal");
          }}
        >
          Cancel
        </button>
        <button
          type="button"
          className="btn btn-danger"
          onClick={handleDeleteClick}
        >
          Delete
        </button>
        <button
          type="button"
          onClick={handleSaveClick}
          className="btn btn-success"
        >
          Save
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default LitigationEventPopUp;
