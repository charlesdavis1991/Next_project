import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Alert, Modal, Nav, Spinner, Tab } from "react-bootstrap";
import { getClientId, getCaseId } from "../../../Utils/helper";
import { ClientDataContext } from "../../ClientDashboard/shared/DataContext";
import { useSelector } from "react-redux";

//for litigation page
const initialState = {
  parent_act: null,
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
  trigger_type: "DependantDate"
};

function EditLitigationActPopup({
  showPopup,
  handleClose,
  litigationDetail,
  act,
}) {
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
  const [activeTab, setActiveTab] = useState("decision");
  const [selectedEventType, setSelectedEventType] = useState("");
  const [form, setForm] = useState(initialState);
  const [caseData, setCaseData] = useState({});
  const { setLitigationActDataUpdated } = useContext(ClientDataContext);
  const [selectedContact, setSelectedContact] = useState("");
  const [caseAddresses, setCaseAddresses] = useState([]);
  const { statesData } = useSelector((state) => state.states);
  const [notStartDate, setNotStartDate] = useState(false);
  const [dependantDateFieldLabel, setDependantDateFieldLabel] =
    useState("");
  const [calculatingEndDate, setCalculatingEndDate] = useState(false);
  const [dependantDate, setDependantDate] = useState("");
  const [acceptedOnDate, setAcceptedOnDate] = useState("");
  const [rejectedOnDate, setRejectedOnDate] = useState("");
  const [statusUpdateError, setStatusUpdateError] = useState("");
  const [statusUpdateSuccess, setStatusUpdateSuccess] = useState("");
  const [isStatusProcessing, setIsStatusProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [triggerType, setTriggerType] = useState("DependantDate");

  useEffect(() => {
    if (showPopup && act?.id !== null) {
      const startDateObj = act?.start_date ? new Date(act.start_date) : null;
      const start_date = startDateObj
        ? startDateObj.toISOString().split("T")[0]
        : "";
      const start_time = startDateObj
        ? startDateObj.toTimeString().slice(0, 5)
        : "";

      const endDateObj = act?.end_date ? new Date(act.end_date) : null;
      const end_date = endDateObj ? endDateObj.toISOString().split("T")[0] : "";
      const end_time = endDateObj ? endDateObj.toTimeString().slice(0, 5) : "";

      setTriggerType(act?.event_id?.trigger_type);
      setDependantDateFieldLabel(act?.date_name);
      setForm((prevForm) => {
        return {
          ...prevForm,
          parent_act: act?.parent_act || null,
          name: act?.location?.name || "",
          address1: act?.location?.address1 || "",
          address2: act?.location?.address2 || "",
          city: act?.location?.city || "",
          state: act?.location?.state || "",
          zip: act?.location?.zip || "",
          phone_number: act?.location?.phone_number || "",
          fax: act?.location?.fax || "",
          email: act?.location?.email || "",
          website: act?.location?.website || "",
          event_type_id: act?.event_type_id?.id,
          event_id: act?.event_id?.id,
          for_client: act?.for_client,
          for_case: act?.for_case,
          is_allday: act?.is_allday,
          service_date: act?.service_date ? act.service_date.split("T")[0] : "",
          for_service: act?.for_service || null,
          calculated_dates: act?.calculated_dates || [],
          events_blocked: act?.events_blocked?.map((block) => block.id) || [],
          events_triggered:
            act?.events_triggered?.map((trigger) => trigger.id) || [],
          dependant_date_type: act?.dependant_date_type?.id,
          meetingurl: act?.meetingurl || "",
          start_date: start_date,
          start_time: start_time,
          end_date: end_date,
          end_time: end_time,
          sameDay: act?.sameDay,
          trigger_on_accept: act?.trigger_on_accept || [],
          trigger_on_reject: act?.trigger_on_reject || [],
          trigger_on_deadline: act?.trigger_on_deadline || [],
          trigger_on_dependant_date: act?.trigger_on_dependant_date || [],
          trigger_type: act?.event_id?.trigger_type || "",
        };
      });
      if (act?.dependant_date) {
        const date = new Date(act.dependant_date);
        setDependantDate(date.toISOString().split('T')[0]);
      } else {
        setDependantDate("");
      }
      
      if (act?.accepted_on) {
        const date = new Date(act.accepted_on);
        setAcceptedOnDate(date.toISOString().split('T')[0]);
      } else {
        setAcceptedOnDate("");
      }
      
      if (act?.rejected_on) {
        const date = new Date(act.rejected_on);
        setRejectedOnDate(date.toISOString().split('T')[0]);
      } else {
        setRejectedOnDate("");
      }
      
      if (act?.event_id?.trigger_type === "DependantDate") {
        setIsActAlreadyProcessed(!!act?.dependant_date || !!act?.rejected_on);
      } else {
        setIsActAlreadyProcessed(!!act?.accepted_on || !!act?.rejected_on);
      }
      
      // Set status message
      updateStatusMessage(act);
    }
  }, [showPopup, act]);

  const [isActAlreadyProcessed, setIsActAlreadyProcessed] = useState(false);

  const updateStatusMessage = (actData) => {
    if (actData?.event_id?.trigger_type === "DependantDate"){
      if (actData?.dependant_date){
        setStatusMessage(`Accepted on: ${formatDate(actData.dependant_date)}`);
      } else if (actData?.rejected_on && actData?.end_date && new Date(actData.end_date) < new Date(actData.rejected_on)) {
        setStatusMessage(`Expired on: ${formatDate(actData.rejected_on)}`);
      }
    } else if (actData?.event_id?.trigger_type === "Accept/Reject"){
      if (actData?.accepted_on) {
        setStatusMessage(`Accepted on: ${formatDate(actData.accepted_on)}`);
      } else if (actData?.rejected_on) {
        setStatusMessage(`Rejected on: ${formatDate(actData.rejected_on)}`);
      } else if (actData?.rejected_on && actData?.end_date && new Date(actData.end_date) < new Date(actData.rejected_on)) {
        setStatusMessage(`Expired on: ${formatDate(actData.rejected_on)}`);
      } else {
        setStatusMessage("");
      }
    }
  };

  const handleDependantDateChange = (e) => {
    const newDate = e.target.value;
    
    // Validate that dependant_date is between start_date and end_date
    if (newDate && form.start_date && form.end_date) {
      const dependantDate = new Date(newDate);
      const startDate = new Date(form.start_date);
      const endDate = new Date(form.end_date);
      
      // Check if dependant_date is within range
      if (dependantDate < startDate) {
        setStatusUpdateError("Dependant date cannot be before the start date");
        return;
      }
      
      if (dependantDate > endDate) {
        setStatusUpdateError("Dependant date cannot be after the end date");
        return;
      }
    }
    
    setDependantDate(newDate);
    setStatusUpdateError("");
    setStatusUpdateSuccess("");
  };
  
  const handleAcceptedDateChange = (e) => {
    const newDate = e.target.value;

    if (newDate && form.start_date && form.end_date) {
      const acceptDate = new Date(newDate);
      const startDate = new Date(form.start_date);
      const endDate = new Date(form.end_date);
      
      // Check if dependant_date is within range
      if (acceptDate < startDate) {
        setStatusUpdateError("Accepted date cannot be before the start date");
        return;
      }
      
      if (acceptDate > endDate) {
        setStatusUpdateError("Accepted date cannot be after the end date");
        return;
      }
    }
    
    setAcceptedOnDate(newDate);
    setRejectedOnDate("");
    setStatusUpdateError("");
    setStatusUpdateSuccess("");
  };
  
  const handleRejectedDateChange = (e) => {
    const newDate = e.target.value;

    if (newDate && form.start_date && form.end_date) {
      const rejectDate = new Date(newDate);
      const startDate = new Date(form.start_date);
      const endDate = new Date(form.end_date);
      
      // Check if dependant_date is within range
      if (rejectDate < startDate) {
        setStatusUpdateError("Rejected date cannot be before the start date");
        return;
      }
      
      if (rejectDate > endDate) {
        setStatusUpdateError("Rejected date cannot be after the end date");
        return;
      }
    }
    
    
    setRejectedOnDate(newDate);
    setAcceptedOnDate("");
    setStatusUpdateError("");
    setStatusUpdateSuccess("");
  };

  const handleSaveStatus = async () => {
    if (triggerType === "DependantDate") {
      if (!dependantDate) {
        setStatusUpdateError("Dependant date is required");
        return;
      }
      
      if (form.start_date && form.end_date) {
        const depDate = new Date(dependantDate);
        const startDate = new Date(form.start_date);
        const endDate = new Date(form.end_date);
        
        if (depDate < startDate) {
          setStatusUpdateError("Dependant date cannot be before the start date");
          return;
        }
        
        if (depDate > endDate) {
          setStatusUpdateError("Dependant date cannot be after the end date");
          return;
        }
      }
    } else if (triggerType === "Accept/Reject") {
      
      // Must have either accepted or rejected date (but not both)
      if (!acceptedOnDate && !rejectedOnDate) {
        setStatusUpdateError("Either accepted or rejected date must be provided");
        return;
      }
      
      if (acceptedOnDate && rejectedOnDate) {
        setStatusUpdateError("Cannot set both accepted and rejected dates");
        return;
      }
      
      // Validate accepted date if provided
      if (acceptedOnDate) {
        const acceptDate = new Date(acceptedOnDate);
        const startDate = new Date(form?.start_date);
        const endDate = new Date(form?.end_date);
        
        if (acceptDate < startDate) {
          setStatusUpdateError("Accepted date cannot be before the Start Date");
          return;
        }

        if (acceptDate > endDate) {
          setStatusUpdateError("Accepted date cannot be after the End Date");
          return;
        }
      }
      
      // Validate rejected date if provided
      if (rejectedOnDate) {
        const rejectDate = new Date(rejectedOnDate);
        const startDate = new Date(form?.start_date);
        const endDate = new Date(form?.end_date);
        
        if (rejectDate < startDate) {
          setStatusUpdateError("Rejected date cannot be before the Start Date");
          return;
        }

        if (rejectDate > endDate) {
          setStatusUpdateError("Rejected date cannot be after the End Date");
          return;
        }
      }
    }
    
    setIsStatusProcessing(true);
    setStatusUpdateError("");
    setStatusUpdateSuccess("");
    
    try {
      const payload = {};
      
      // For DependantDate type, only send dependant_date
      if (triggerType === "DependantDate") {
        if (dependantDate) {
          payload.dependant_date = dependantDate;
        }
      } 
      // For Accept/Reject type, only send the accepted_on or rejected_on date
      else {
        if (acceptedOnDate) {
          payload.accepted_on = acceptedOnDate;
        }
        
        else if (rejectedOnDate) {
          payload.rejected_on = rejectedOnDate;
        }
      }
      
      // Send update to API
      const response = await axios.patch(
        `${origin}/api/litigation-page/litigation-act/update-status/${act?.id}/`,
        payload,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      
      if (response.status === 200) {
        if (response.data.dependant_date) {
          setDependantDate(response.data.dependant_date.split('T')[0]);
        }
        
        if (response.data.accepted_on) {
          setAcceptedOnDate(response.data.accepted_on.split('T')[0]);
          setIsActAlreadyProcessed(true);
        }
        
        if (response.data.rejected_on) {
          setRejectedOnDate(response.data.rejected_on.split('T')[0]);
          setIsActAlreadyProcessed(true);
        }
        
        setStatusUpdateSuccess("Status updated successfully");
        
        // Update status message
        updateStatusMessage(response.data.act);
        
        // Flag data as updated
        setLitigationActDataUpdated(true);
        handleClose();
      }
    } catch (err) {
      console.error("Error updating status:", err);
      setStatusUpdateError(err.response?.data?.error || "Error updating status");
    } finally {
      setIsStatusProcessing(false);
    }
  };

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
          start_date: startDate,
        },
        {
          headers: { Authorization: token },
        }
      );

      if (response.status === 200) {
        const endDate = response.data.end_date;
        // Extract date part only for end_date input field
        const dateOnly = endDate.split("T")[0];
        const timeOnly = endDate.split("T")[1]?.slice(0, 5) || "00:00";

        setForm((prevForm) => ({
          ...prevForm,
          end_date: dateOnly,
          end_time: timeOnly,
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
      getCaseAddresses();
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

    if (name === "start_date" && value && form.event_id) {
      calculateEndDate(form.event_id, value);
    }
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
      setNotStartDate(true);
    }
    setForm((prevForm) => ({
      ...prevForm,
      [name]: Number(value),
    }));
  };

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

  const handleAddressChange = (e) => {
    const selectedIndex = e.target.value;
    if (selectedIndex !== "") {
      const selectedOption = caseAddresses[selectedIndex];
      setSelectedContact(selectedOption.contact);

      // Get the appropriate contact details based on the selected contact type
      let contactDetails =
        selectedOption.contact[selectedOption.contact.selectedContact];

      // Update the form with contact details
      if (contactDetails) {
        setForm((prevForm) => ({
          ...prevForm,
          name: contactDetails?.name || "",
          address1: contactDetails?.address1 || "",
          address2: contactDetails?.address2 || "",
          city: contactDetails?.city || "",
          state: contactDetails?.state || "",
          zip: contactDetails?.zip || "",
          phone_number: contactDetails?.phone_number || "",
          fax: contactDetails?.fax || "",
          email: contactDetails?.email || "",
          website: contactDetails?.website || "",
        }));
      }
    }
  };

  const handleDelete = async () => {
    try {
      if (act?.id !== null) {
        const response = await axios.delete(
          `${origin}/api/litigation-page/litigation-act/delete/${act?.id}/`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        if (response.status === 204) {
          handleClose();
          setForm(initialState);
          setLitigationActDataUpdated(true);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async () => {
    try {
      if (act?.id !== null) {
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
        const response = await axios.patch(
          `${origin}/api/litigation-page/litigation-act/update/${act?.id}/`,
          updatedForm,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        if (response.status === 200) {
          handleClose();
          setForm(initialState);
          setLitigationActDataUpdated(true);
        }
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
    contacts.forEach((contact) => {
      if (contact.contact_1) {
        options.push({
          label: `${contact.type} - ${contact.name} Address 1`,
          contact: { ...contact, selectedContact: "contact_1" },
        });
      }

      if (contact.contact_2) {
        options.push({
          label: `${contact.type} - ${contact.name} Address 2`,
          contact: { ...contact, selectedContact: "contact_2" },
        });
      }

      if (contact.home_contact) {
        options.push({
          label: `${contact.type} - ${contact.name} Home Address`,
          contact: { ...contact, selectedContact: "home_contact" },
        });
      }

      if (contact.work_contact) {
        options.push({
          label: `${contact.type} - ${contact.name} Work Address`,
          contact: { ...contact, selectedContact: "work_contact" },
        });
      }

      if (contact.party_home_contact) {
        options.push({
          label: `${contact.type} - ${contact.name} Home Address`,
          contact: { ...contact, selectedContact: "party_home_contact" },
        });
      }
    });
    setCaseAddresses(options);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Modal
      show={showPopup}
      onHide={handleClose}
      centered
      dialogClassName="Law-firm-direct-max-width-900px"
    >
      <Modal.Header className="bg-primary text-center p-2">
        <h4 className="modal-title text-white mx-auto">Edit Litigation Act</h4>
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
        <Tab.Container
          activeKey={activeTab}
          onSelect={(key) => {
            setActiveTab(key);
          }}
        >
          <Nav variant="tabs" className="mb-2 justify-content-center">
            <Nav.Item>
              <Nav.Link eventKey="decision">Outcome</Nav.Link>
            </Nav.Item>
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
          </Nav>
          <Tab.Content className="min-h-400">
            <Tab.Pane eventKey="decision" className="overflow-hidden">
              {/* Display status messages */}
              {statusMessage && (
                <div className={`alert ${
                    act?.end_date && new Date(act.end_date) < new Date() ? "alert-warning" :
                    act?.accepted_on ? "alert-success" : 
                    act?.rejected_on ? "alert-danger" : "alert-info"
                  }`}
                >
                  {statusMessage}
                </div>
              )}
              
              {/* Error message */}
              {statusUpdateError && <Alert variant="danger">{statusUpdateError}</Alert>}
              
              {/* Success message */}
              {statusUpdateSuccess && <Alert variant="success">{statusUpdateSuccess}</Alert>}
              
              {/* Duration display row */}
              <div className="row align-items-center form-group mt-3">
                <div className="col-3 text-left">
                  <span className="d-inline-block text-grey">
                    <nobr>Duration</nobr>
                  </span>
                </div>
                <div className="col-9">
                  <div className="justify-content-center text-red">
                    {form.start_date ? `${formatDate(form.start_date)} - ${formatDate(form.end_date)}` : "Not set"}
                  </div>
                </div>
              </div>
              
              <hr className="my-3" />
              {triggerType === "DependantDate" && 
                <div className="row align-items-center form-group mt-3">
                  <div className="col-3 text-left">
                    <span className="d-inline-block text-grey">
                      <nobr>{dependantDateFieldLabel}</nobr>
                    </span>
                  </div>
                  <div className="col-9">
                    <input
                      type="date"
                      placeholder="YYYY-MM-DD"
                      value={dependantDate}
                      className="form-control"
                      onChange={handleDependantDateChange}
                      disabled={isActAlreadyProcessed}
                    />
                  </div>
                </div>
              }

              {triggerType === "Accept/Reject" && (
                <>
                  <div className="row align-items-center form-group">
                    <div className="col-3 text-left">
                      <span className="d-inline-block text-grey">
                        <nobr>Accepted On</nobr>
                      </span>
                    </div>
                    <div className="col-9">
                      <input
                        type="date"
                        placeholder="YYYY-MM-DD"
                        value={acceptedOnDate}
                        className="form-control"
                        onChange={handleAcceptedDateChange}
                        disabled={isActAlreadyProcessed}
                      />
                    </div>
                  </div>

                  <div className="row align-items-center form-group">
                    <div className="col-3 text-left">
                      <span className="d-inline-block text-grey">
                        <nobr>Rejected On</nobr>
                      </span>
                    </div>
                    <div className="col-9">
                      <input
                        type="date"
                        placeholder="YYYY-MM-DD"
                        value={rejectedOnDate}
                        className="form-control"
                        onChange={handleRejectedDateChange}
                        disabled={isActAlreadyProcessed}
                      />
                    </div>
                  </div>
                </>
              )}
              
              {/* Save button */}
              {!isActAlreadyProcessed && (
                <div className="d-flex justify-content-center mt-4">
                  <button
                    type="button"
                    className="btn btn-success mx-2"
                    onClick={handleSaveStatus}
                    disabled={isStatusProcessing}
                  >
                    {isStatusProcessing ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="mr-2"
                        />
                        Processing...
                      </>
                    ) : (
                      "Save Outcome"
                    )}
                  </button>
                </div>
              )}
            </Tab.Pane>
            <Tab.Pane eventKey="event" className="overflow-hidden">
              <div className="row align-items-center form-group">
                <div className="col-2 text-left">
                  <span className="d-inline-block text-grey">
                    <nobr>Event Type</nobr>
                  </span>
                </div>
                <div className="col-10">
                  <select
                    name="event_type_id"
                    className="form-select form-control"
                    value={form?.event_type_id}
                    onChange={handleIntChange}
                  >
                    <option value={null}>Select Event type</option>
                    {eventTypes?.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.litigation_event_type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="row align-items-start form-group">
                <div className="col-2 text-left">
                  <span className="d-inline-block text-grey">Events</span>
                </div>
                <div className="col-10">
                  <div
                    style={{
                      maxHeight: "300px",
                      minHeight: "38px",
                      overflowY: "scroll",
                      border: "1px solid #ccc",
                      padding: "10px",
                      display: "grid",
                      gap: "10px",
                      height: "auto",
                    }}
                  >
                    {eventsData?.map((item, index) => (
                      <label key={index} className="form-check-label">
                        <input
                          type="radio"
                          name="event_id"
                          value={item.id}
                          checked={form?.event_id === item.id}
                          onChange={handleEventChange}
                          style={{
                            marginRight: "5px",
                            accentColor: "grey",
                          }}
                        />
                        {item.event_name}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </Tab.Pane>
            <Tab.Pane
              eventKey="dates"
              style={{ overflowX: "hidden", overflowY: "scroll" }}
            >
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
                              disabled={form?.is_allday || calculatingEndDate}
                            />
                            {calculatingEndDate && (
                              <div
                                className="spinner-border spinner-border-sm text-primary"
                                role="status"
                              >
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
                <div className="text-center text-red">Add Start Date</div>
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
                        ? form.start_date &&
                          calculateNewDate(form.start_date, date)
                        : dependantDate &&
                          calculateNewDate(dependantDate, date);
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
            </Tab.Pane>
            <Tab.Pane eventKey="location" className="overflow-hidden">
              <div className="mb-2">
                <select
                  className="form-select form-control"
                  value={
                    selectedContact
                      ? caseAddresses.findIndex(
                          (opt) => opt.contact === selectedContact
                        )
                      : ""
                  }
                  onChange={handleAddressChange}
                >
                  <option value="">Select Litigation Act Location</option>
                  {caseAddresses.map((option, index) => (
                    <option key={index} value={index}>
                      {option.label} |{" "}
                      {option?.contact?.[option?.contact?.selectedContact]
                        ?.address1 !== "" &&
                        `${option?.contact?.[option?.contact?.selectedContact]?.address1}, `}
                      {option?.contact?.[option?.contact?.selectedContact]
                        ?.address2 !== "" &&
                        `${option?.contact?.[option?.contact?.selectedContact]?.address2}, `}
                      {option?.contact?.[option?.contact?.selectedContact]
                        ?.city !== "" &&
                        `${option?.contact?.[option?.contact?.selectedContact]?.city}, `}
                      {option?.contact?.[option?.contact?.selectedContact]
                        ?.state &&
                        `${option?.contact?.[option?.contact?.selectedContact]?.state}, `}
                    </option>
                  ))}
                </select>
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
            </Tab.Pane>
            <Tab.Pane eventKey="triggered">
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
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Modal.Body>
      <Modal.Footer>
        <button type="button" class="btn btn-secondary" onClick={handleClose}>
          Cancel
        </button>

        <button type="button" className="btn btn-danger ml-auto" onClick={handleDelete}>
          Delete
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
    prevProps.handleClose === nextProps.handleClose &&
    prevProps.act === nextProps.act // Ensure function reference doesn't change
  );
};

export default React.memo(EditLitigationActPopup, areEqual);
