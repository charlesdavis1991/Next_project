import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../Components/Sidebars/main";
import NavBar from "../Components/Navbars/main";
import "./witnesses.css";
import { useDispatch, useSelector } from "react-redux";
import AddWitnessModal from "../Components/Modals/AddWitnessModal";
import WitnessesNotesModal from "../Components/Modals/WitnessesNotesModal";
import WitnessContactHomeModal from "./WitnessContactHomeModal";
import WitnessDetailsModal from "./WitnessDetailsModal";
import WorkContactModall from "../Components/Modals/WorkContactModall";
import GenerateDocumentModal from "./GenerateDocumentModal";
import AddInsuranceModal from "../Components/Modals/AddInsuranceModal";
import AddCounselModal from "../Components/Modals/AddCounselModal";
import { getCaseId, getClientId } from "../Utils/helper";
import api from "../api/api";
import CompanyModal from "../Components/Modals/CompanyModal";
import NotesSectionDashboard from "../Components/NotesSectionDashboard/main";
import UploadDocModal from "../Components/DocumentRow/UploadDocModal";
import NotesPanel from "../Components/NotesPanelSection/NotesPanel";
import DocumentRow from "../Components/DocumentRow/DocumentRow";
import Footer from "../Components/common/footer";

const WitnessesPage = () => {
  const [witnessData, setWitnessData] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [statusUpdate, setStatusUpdate] = useState(false);

  useEffect(() => {
    api
      .get(`/api/11/${getClientId()}/${getCaseId()}/`)
      .then((response) => {
        setWitnessData(response.data);
        setLoading(false);
        setStatusUpdate(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  }, [statusUpdate]);

  // date formate change
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const options = { day: "numeric", month: "numeric", year: "numeric" };
      return date.toLocaleDateString("en-US", options);
    } catch (error) {
      console.error("Error parsing date:", error);
      return "";
    }
  };

  const formatDate2 = (dateString) => {
    try {
      const date = new Date(dateString);
      const options = { day: "numeric", month: "short", year: "numeric" };
      return date.toLocaleDateString("en-US", options);
    } catch (error) {
      console.error("Error parsing date:", error);
      return "";
    }
  };

  // time formate change
  const formatTime = (dateTimeString) => {
    try {
      const dateTime = new Date(dateTimeString);
      const options = { hour: "numeric", minute: "numeric", hour12: true };
      return dateTime.toLocaleTimeString("en-US", options);
    } catch (error) {
      console.error("Error parsing date:", error);
      return "Invalid Time";
    }
  };
  // Redux
  const dispatch = useDispatch();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const witness = {
    witness_contact_home: {
      email: "",
    },
  };

  const templatePopUp = (
    param1,
    param2,
    witnessId,
    param4,
    param5,
    param6,
    param7,
    param8
  ) => {
   
    // Implement the actual functionality here
  };

  const editHomeContact = (element) => {
    // Dummy function for editing home contact
    console.log("Editing home contact:", element);
  };

  const witness12 = {
    id: "123", // Dummy witness ID
    witness_employer: "ABC Company", // Dummy employer name
    witness_contact_last: {
      address1: "456 Business St", // Dummy address line 1
      address2: "Suite 200", // Dummy address line 2
      city: "Metropolis", // Dummy city
      state: "NY", // Dummy state
      zip: "10001", // Dummy zip code
      phone_number: "5559876543", // Dummy phone number
      fax: "5551234567", // Dummy fax number
      email: "john.doe@example.com", // Dummy email
    },
  };

  const editWorkContact = (element) => {
    // Dummy function for editing work contact
    console.log("Editing work contact:", element);
  };

  // Define the functions
  function docPreview(docId, param) {
    // Implement the docPreview function
  }
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [checkedItems, setCheckedItems] = useState([...Array(10).fill(false)]);
  const [witnessVisible, setWitnessVisible] = useState(null);
  const [checkedItem, setCheckedItem] = useState([...Array(10).fill(false)]);
  const sampleData = {
    checklistPercentage: 75,
    clientProviderId: 1,
    pageName: "Witness",
    checklistItems: [
      { label: "example 1", checked: true },
      { label: "example 2", checked: true },
      { label: "example 3", checked: true },
      { label: "example 4", checked: true },
      { label: "example 5", checked: true },
      { label: "example 6", checked: true },
      { label: "example 7", checked: true },
      { label: "example 8", checked: true },
      { label: "example 9", checked: true },
      { label: "example 10", checked: true },
    ],
    witness: {
      id: 1,
      witnessFirstName: "John",
      witnessLastName: "Doe",
      witnessContactHome: {
        address1: "123 Main St",
        address2: "Apt 4B",
        city: "Springfield",
        state: "IL",
        zip: "62704",
        phoneNumber: "5551234567",
        fax: "5557654321",
        email: "john.doe@example.com",
      },
    },
  };
  const dropdownRef = useRef();
  const handleClick = () => {
    setDropdownVisible(!dropdownVisible);
    // setCumulativeProgress(
    //   commutativeChecklist?.all_checklists?.total_percentage
    // );
  };
  const handleCheckboxChange = (index) => {
    const updatedCheckedItems = [...checkedItems];
    updatedCheckedItems[index] = !updatedCheckedItems[index];
    setCheckedItems(updatedCheckedItems);
  };

  const handleCloseDropdown = () => {
    setDropdownVisible(false);
  };

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        e.target.closest(".dropdown-toggle") ||
        (dropdownRef.current && dropdownRef.current.contains(e.target))
      ) {
        return;
      }
      handleCloseDropdown();
    };
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleWitnessClick = (index) => {
    if (witnessVisible === index) {
      setWitnessVisible(null);
    } else {
      setWitnessVisible(index);
    }
  };
  const handleWitnessboxChange = (index) => {
    const updatedCheckedItems = [...checkedItems];
    updatedCheckedItems[index] = !updatedCheckedItems[index];
    setCheckedItem((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };
  const handleClose = () => {
    setWitnessVisible(false);
  };

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        e.target.closest(".dropdown-toggle") ||
        (dropdownRef.current && dropdownRef.current.contains(e.target))
      ) {
        return;
      }
      handleClose();
    };
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);
  const sampleData2 = {
    checklistPanelPercentage: { 1: 70, 2: 75, 3: 100 },
    witnessId: 1,
    clientProviderId: 1,
    pageName1: "Witness Checklist",
    pageName2: "Insurance Checklist",
    finalChecklist: [
      {
        providerId: 1,
        id: 1,
        name: "Witness First Name",
        status: false,
        panelCaseChecklist: "checklist1",
      },
      {
        providerId: 1,
        id: 2,
        name: "Witness Last Name",
        status: true,
        panelCaseChecklist: "checklist2",
      },
      {
        providerId: 3,
        id: 3,
        name: "Witness Address ",
        status: false,
        panelCaseChecklist: "checklist3",
      },
      {
        providerId: 4,
        id: 4,
        name: "Witness Phone ",
        status: false,
        panelCaseChecklist: "checklist4",
      },
      {
        providerId: 5,
        id: 5,
        name: "Witness Birthday ",
        status: false,
        panelCaseChecklist: "checklist5",
      },
      {
        providerId: 6,
        id: 6,
        name: "Representation Letter ",
        status: false,
        panelCaseChecklist: "checklist6",
      },
      {
        providerId: 7,
        id: 7,
        name: "Relationship to Client ",
        status: false,
        panelCaseChecklist: "checklist7",
      },
      {
        providerId: 8,
        id: 8,
        name: "Who Witness Supports ",
        status: false,
        panelCaseChecklist: "checklist8",
      },
      {
        providerId: 9,
        id: 9,
        name: "No Witnesses ",
        status: false,
        panelCaseChecklist: "checklist9",
      },
    ],
  };

  const sampleData3 = {
    witnessForEntity: "Company XYZ",
    witnessForRecordId: "123456",
    witnessId: 1,
    id: 3,
    witnessEmployer: "ABC Corp",
    witnessContactLast: {
      address1: "456 Elm St",
      address2: "Suite 300",
      city: "Metropolis",
      state: "NY",
      zip: "10001",
      phoneNumber: "5559876543",
      fax: "5551230987",
      email: "jane.doe@abccorp.com",
    },
  };

  const selectWitness = (event, formId) => {
    // Handle the witness selection logic here
    // console.log(`Selected witness: ${witnessId}, Form ID: ${formId}`);
  };
  const sampleData4 = {
    id: 4,
    witnessForEntity: "XYZ Inc",
    witnessForRecordId: "12345",
    age: 35,
    witnessBirthday: "1989-06-15",
    witnessGender: "Female",
    repLetterSent: "2022-05-10",
    relationshipToClient: "Friend",
    contactConfirmedDate: "2023-01-20",
  };
  const sampleData5 = {
    title: "Sample Title",
    dataPoints: [
      { label: "Data Point 1", value: "Value 1" },
      { label: "Data Point 2", value: "Value 2" },
      { label: "Data Point 3", value: "Value 3" },
      { label: "Data Point 4", value: "Value 4" },
      { label: "Data Point 5", value: "Value 5" },
      { label: "Data Point 6", value: "Value 6" },
      { label: "Data Point 7", value: "Value 7" },
    ],
  };

  const sampleData6 = [
    {
      date: "Jun 1, 2024",
      time: "12:30 PM",
      profilePic: "path/to/profilePic1.jpg",
      createdByName: "John Doe",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    // Add more sample data objects here as needed
  ];
  const sampleData7 = [
    {
      doc: {
        id: 1,
        created: "2024-05-01",
        file_name: "Document 1",
      },
      page_slot: {
        slot_number: 1,
        slot_name: "Slot 1",
      },
    },
    {
      doc: {
        id: 1,
        created: "2024-05-01",
        file_name: "Document 1",
      },
      page_slot: {
        slot_number: 1,
        slot_name: "Slot 1",
      },
    },
    {
      doc: {
        id: 1,
        created: "2024-05-01",
        file_name: "Document 1",
      },
      page_slot: {
        slot_number: 1,
        slot_name: "Slot 1",
      },
    },
    {
      doc: {
        id: 1,
        created: "2024-05-01",
        file_name: "Document 1",
      },
      page_slot: {
        slot_number: 1,
        slot_name: "Slot 1",
      },
    },
    {
      doc: {
        id: 1,
        created: "2024-05-01",
        file_name: "Document 1",
      },
      page_slot: {
        slot_number: 1,
        slot_name: "Slot 1",
      },
    },
    {
      doc: {
        id: 1,
        created: "2024-05-01",
        file_name: "Document 1",
      },
      page_slot: {
        slot_number: 1,
        slot_name: "Slot 1",
      },
    },
    {
      doc: {
        id: 1,
        created: "2024-05-01",
        file_name: "Document 1",
      },
      page_slot: {
        slot_number: 1,
        slot_name: "Slot 1",
      },
    },
  ];
  const [show, setShow] = React.useState(false);
  const [showWitnesseWorksContact, setShowWitnesseWorksContact] =
    React.useState(false);
  const [showWitnesseHomeContact, setShowWitnesseHomeContact] =
    React.useState(false);
  const [showCompany, setShowCompany] = useState(false);
  const [showInsurance, setShowInsurance] = React.useState(false);
  const [showCounsel, setShowCounsel] = React.useState(false);
  const [showDocModal, setShowDocModal] = React.useState(false);
  const toggleDoc = () => setShowDocModal(!showDocModal);

  const [showWitnesseDetail, setShowWitnesseDetail] = React.useState(false);
  const [generateDocument, setGenerateDocument] = React.useState(false);

  const toggleAddWitnessModal = () => setShow(!show);

  const [showWitnessesNotes, setShowWitnessesNotes] = React.useState(false);
  const [noteData, setNoteData] = React.useState([]);

  const toggleWitnessNotesModal = (note) => {
    setShowWitnessesNotes(!showWitnessesNotes);
    setNoteData(note);
  };
  const [witnessId, setWitnessId] = useState(null);
  const toggleWitnesseWorksContact = () =>
    setShowWitnesseWorksContact(!showWitnesseWorksContact);

  const toggleWitnesseHomeContact = () =>
    setShowWitnesseHomeContact(!showWitnesseHomeContact);
  const toggleCompany = () => setShowCompany(!showCompany);

  const toggleInsurance = () => setShowInsurance(!showInsurance);
  const toggleCounsel = () => setShowCounsel(!showCounsel);

  const toggleWitnessDetail = () => setShowWitnesseDetail(!showWitnesseDetail);
  const toggleGenerateDoc = () => setGenerateDocument(!generateDocument);
  const [notesData, setNotesData] = useState(null);

  // Define color ranges and corresponding colors
  const colorRanges = [
    { min: 0, max: 30, color: "#009900" },
    { min: 30, max: 50, color: "#FF5733" },
    { min: 50, max: 100, color: "#FFC300" },
    { min: 100, max: 1000, color: "#FF1493" },
  ];

  function getColor(value) {
    for (let i = 0; i < colorRanges.length; i++) {
      if (value <= colorRanges[i].max) {
        return colorRanges[i].color;
      }
    }
    return "#000000";
  }

  const [percentageData, setPercentageData] = useState(null);
  const caseId = getCaseId();
  const clientId = getClientId();
  useEffect(() => {
    api
      .get(
        `/30/GetCommulativeChecklistAPI/?case_id=${caseId}&client_id=${clientId}`
      )
      .then((response) => {
        setPercentageData(response.data);
        setLoading(false);
        setStatusUpdate(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  }, [statusUpdate]);

  const totalPercentage = percentageData?.data?.total_percentage || 0;
  return (
    <>
    <div className="page-wrapper">
      <AddWitnessModal
        show={show}
        handleClose={toggleAddWitnessModal}
        setStatusUpdate={setStatusUpdate}
      />

      <WitnessesNotesModal
        show={showWitnessesNotes}
        handleClose={toggleWitnessNotesModal}
        witnessData={witnessData}
        notesData={notesData}
        setStatusUpdate={setStatusUpdate}
        showWitnessesNotes={showWitnessesNotes}
        noteData={noteData}
      />

      <WorkContactModall
        show={showWitnesseWorksContact}
        handleClose={toggleWitnesseWorksContact}
        witnessData={witnessId}
      />

      <WitnessContactHomeModal
        show={showWitnesseHomeContact}
        handleClose={toggleWitnesseHomeContact}
        witnessData={witnessId}
        setStatusUpdate={setStatusUpdate}
      />
      <CompanyModal
        show={showCompany}
        handleClose={toggleCompany}
        witnessData={witnessId}
        setStatusUpdate={setStatusUpdate}
      />
      <AddInsuranceModal
        show={showInsurance}
        handleClose={toggleInsurance}
        witnessData={witnessId}
      />
      <WitnessDetailsModal
        show={showWitnesseDetail}
        handleClose={toggleWitnessDetail}
        witnessData={witnessId}
        setStatusUpdate={setStatusUpdate}
      />

      <GenerateDocumentModal
        show={generateDocument}
        handleClose={toggleGenerateDoc}
        witnessData={witnessData}
      />
      <AddCounselModal
        show={showCounsel}
        handleClose={toggleCounsel}
        witnessData={witnessId}
      />
      <UploadDocModal show={showDocModal} handleClose={toggleDoc} />
      <Sidebar />
      <div className="page-container">
        <div className="top-panel-wrapper"></div>
        <NavBar flaggedPageName="Witness" />
        <div class="main-content p-t-180 wit-ml5-2 ">
          {/* Navbar */}
          <div
            className="action-bar client-BarAlign main-action-bar has-checklist d-flex m-b-5 margin-left-11"
            style={{ overflow: "unset" }}
          >
            <span className="page-icon">
              <img
                className="translate-note-icon"
                src="https://simplefirm-bucket.s3.amazonaws.com/static/BP_resources/images/icon/witnesses-icon-color.svg"
                alt="Witnesses Icon"
              />
            </span>
            <div
              className="text-wrapper text-white d-flex align-items-center pl-3"
              style={{ position: "relative" }}
            >
              <h2 className="text-white">Witnesses</h2>
            </div>
            <div className="checklist-section-wrapper">
              <div className="skew-box"></div>
              <div className="checklist-section">
                <div style={{ position: "relative", cursor: "pointer" }}>
                  <button
                    className="dropdown-toggle text-darker d-flex align-items-center justify-content-end w-100"
                    onClick={handleClick}
                  >
                    <div className="nt-box" id="ntbox- margin-20">
                      <div
                        className="circlechart"
                        id="case-checklist-percentage"
                      >
                        <svg
                          className="circle-chart"
                          viewBox="0 0 33.83098862 33.83098862"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle
                            className="circle-chart__background"
                            cx="16.9"
                            cy="16.9"
                            r="15.9"
                          />
                          <circle
                            className="circle-chart__circle stroke-vivid-cerulean"
                            strokeDasharray={`${totalPercentage}, 100`}
                            cx="16.9"
                            cy="16.9"
                            r="15.9"
                            style={{
                              transition: "stroke-dasharray 0.3s ease",
                              transform: "rotate(-90deg)",
                              transformOrigin: "50% 50%",
                            }}
                          />
                          <g className="circle-chart__info">
                            <text
                              className="circle-chart__percent"
                              x="16.9"
                              y="12"
                              textAnchor="middle"
                              alignmentBaseline="middle"
                              fontSize="5"
                            >
                              {totalPercentage}%
                            </text>
                          </g>
                        </svg>
                      </div>
                    </div>
                    <span className="d-flex align-items-center">
                      <span className="ic has-no-after ic-check text-success d-flex align-items-center justify-content-center">
                        <svg
                          width="17"
                          height="50"
                          viewBox="0 0 17 50"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M0 25.5923L2.16281 23.2528L6.69618 27.4438L14.5501 18L17 20.0372L6.99858 32.0626L0 25.5923Z"
                            fill="currentColor"
                          />
                        </svg>
                      </span>
                      <span className="checklist-text text-capitalize">
                        Witness <br />
                        Page
                      </span>
                      <span className="ic has-no-after ic-arrow text-white d-flex align-items-center justify-content-center">
                        <svg
                          width="17"
                          height="50"
                          viewBox="0 0 17 50"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M0 16H4.59998L8.5 19.95L12.4 16H17L8.5 24.55L0 16Z"
                            fill="currentColor"
                          />
                          <path
                            d="M0 25.4512H4.59998L8.5 29.4012L12.4 25.4512H17L8.5 34.0012L0 25.4512Z"
                            fill="currentColor"
                          />
                        </svg>
                      </span>
                    </span>
                  </button>
                  {dropdownVisible && (
                    <div
                      ref={dropdownRef}
                      style={{
                        position: "absolute",
                        top: "100%",
                        right: "0px",
                        // zIndex: 9999,
                        width: "205px",
                        background: "white",
                        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                        maxHeight: "200px",
                      }}
                    >
                      {[...Array(10).keys()].map((index) => (
                        <div
                          className="checkbox-line"
                          key={index}
                          style={{
                            backgroundColor:
                              index % 2 === 0 ? "#BCCCDC" : "#95A8B5",
                            fontSize: "14px",
                            color: "white",
                          }}
                        >
                          <input
                            type="checkbox"
                            id={`examplecheck${index + 1}`}
                            name={`examplecheck${index + 1}`}
                            checked={checkedItems[index]}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleCheckboxChange(index);
                            }}
                          />
                          <label htmlFor={`examplecheck${index + 1}`}>
                            example {index + 1}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary rounded-0 action-line-btn height-25"
              data-toggle="modal"
              data-target="#addcase"
              onClick={toggleAddWitnessModal}
            >
              <span className="font-weight-bold pr-2 text-gold">+</span>Witness
            </button>
          </div>
          <div clasName="container-fluid overflow-hidden ml5-wit">
            <div class="row">
              <div class="col-12 ">
                {witnessData?.witnesses?.map((item, index) => {
                  return (
                    <>
                      <div
                        class="border-box has-checklist rounded-0 mr-15 m-t-5"
                        key={index}
                      >
                        <div
                          class="checklist-section-wrapper position-absolute top-0 z-index-9"
                          style={{
                            right: "0px",
                          }}
                        >
                          <div class="skew-box"></div>
                          <div class="checklist-section">
                            <div
                              style={{
                                position: "relative",
                                cursor: "pointer",
                              }}
                            >
                              <button
                                className="dropdown-toggle text-darker d-flex align-items-center justify-content-end w-100"
                                onClick={() => handleWitnessClick(index)}
                              >
                                <div
                                  className="circlechart-container"
                                  id="case-checklist-percentage"
                                >
                                  <div className="circle-chart-wrapper">
                                    <div className="nt-box sub-gauge">
                                      {Object.entries(
                                        witnessData.checklist_panelpercentage
                                      ).map(
                                        ([key, value]) =>
                                          key === String(item.id) && (
                                            <div
                                              className="circlechart"
                                              id="case-checklist-percentage"
                                              key={key}
                                            >
                                              <svg
                                                className="circle-chart"
                                                viewBox="0 0 33.83098862 33.83098862"
                                                xmlns="http://www.w3.org/2000/svg"
                                              >
                                                <circle
                                                  className="circle-chart__background"
                                                  cx="16.9"
                                                  cy="16.9"
                                                  r="15.9"
                                                />
                                                <circle
                                                  className="circle-chart__circle"
                                                  strokeDasharray={`${value}, 100`}
                                                  cx="16.9"
                                                  cy="16.9"
                                                  r="15.9"
                                                  style={{
                                                    transition:
                                                      "stroke-dasharray 0.3s ease",
                                                    transform: "rotate(-90deg)",
                                                    transformOrigin: "50% 50%",
                                                    stroke: getColor(value), // Assign color based on percentage
                                                  }}
                                                />
                                                <g className="circle-chart__info">
                                                  <text
                                                    className="circle-chart__percent"
                                                    x="16.9"
                                                    y="12"
                                                    textAnchor="middle"
                                                    alignmentBaseline="middle"
                                                    fontSize="5"
                                                  >
                                                    {value}%
                                                  </text>
                                                </g>
                                              </svg>
                                            </div>
                                          )
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <span className="d-flex align-items-center">
                                  <span className="ic has-no-after ic-check text-success d-flex align-items-center justify-content-center">
                                    <svg
                                      width="17"
                                      height="50"
                                      viewBox="0 0 17 50"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M0 25.5923L2.16281 23.2528L6.69618 27.4438L14.5501 18L17 20.0372L6.99858 32.0626L0 25.5923Z"
                                        fill="currentColor"
                                      />
                                    </svg>
                                  </span>
                                  <span className="checklist-text">
                                    {sampleData2.pageName1}
                                  </span>
                                  <span className="ic has-no-after ic-arrow text-white d-flex align-items-center justify-content-center">
                                    <svg
                                      width="17"
                                      height="50"
                                      viewBox="0 0 17 50"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M0 16H4.59998L8.5 19.95L12.4 16H17L8.5 24.55L0 16Z"
                                        fill="currentColor"
                                      />
                                      <path
                                        d="M0 25.4512H4.59998L8.5 29.4012L12.4 25.4512H17L8.5 34.0012L0 25.4512Z"
                                        fill="currentColor"
                                      />
                                    </svg>
                                  </span>
                                </span>
                              </button>
                              {witnessVisible === index && (
                                <div
                                  ref={dropdownRef}
                                  style={{
                                    position: "absolute",
                                    top: "100%",
                                    right: "0px",
                                    // zIndex: 9999,
                                    width: "205px",
                                    background: "white",
                                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                                    maxHeight: "200px",
                                  }}
                                >
                                  {sampleData2.finalChecklist.map(
                                    (item, index) => (
                                      <div
                                        className="checkbox-line"
                                        key={item.id}
                                        style={{
                                          backgroundColor:
                                            index % 2 === 0
                                              ? "#BCCCDC"
                                              : "#95A8B5",
                                          fontSize: "14px",
                                          color: "white",
                                        }}
                                      >
                                        <input
                                          type="checkbox"
                                          id={`examplecheck${item.id}`}
                                          name={`examplecheck${item.id}`}
                                          checked={checkedItem[index]}
                                          onChange={(e) => {
                                            e.stopPropagation();
                                            handleWitnessboxChange(index);
                                          }}
                                        />
                                        <label
                                          htmlFor={`examplecheck${item.id}`}
                                        >
                                          {item.name}
                                        </label>
                                      </div>
                                    )
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div class="row no-gutters has-title-bg m-b-5 flex-nowrap col-12 pl-2 p-r-0">
                          <div
                            className="witnessPanel"
                            // style={{ flexBasis: "43.8333%" }}
                          >
                            <div class="panel-icon">
                              <img src="https://simplefirm-bucket.s3.amazonaws.com/static/images/witnesses-icon-color_iYKDd0f.svg" />
                            </div>
                            {/* Header2 */}
                            <div className="top-header height-25 d-flex">
                              <div className="top-head d-flex align-items-center">
                                <div className="d-flex align-items-center">
                                  <h2 className="d-flex align-items-center">
                                    <small className="font-weight-bold text-wrap-no-wrap-Wit">
                                      Witness for
                                    </small>
                                  </h2>
                                  <div className="btn-wrapper">
                                    <button
                                      type="submit"
                                      className="btn btn-primary rounded-0"
                                      data-toggle="modal"
                                      data-target="#addparty"
                                      data-id={sampleData3.witnessId}
                                      onClick={() => {
                                        setShowInsurance(true);
                                        setWitnessId(item);
                                      }}
                                    >
                                      <span className="font-weight-bold pr-2 text-gold">
                                        +
                                      </span>
                                      Insurance
                                    </button>

                                    <button
                                      type="submit"
                                      className="btn btn-primary rounded-0"
                                      data-toggle="modal"
                                      data-target="#addlegalcounsel"
                                      data-id={sampleData3.witnessId}
                                      onClick={() => {
                                        setShowCounsel(true);
                                        setWitnessId(item);
                                      }}
                                    >
                                      <span className="font-weight-bold pr-2 text-gold">
                                        +
                                      </span>
                                      Counsel
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {/*  */}
                            <div class="row no-gutters equal-column-wrapper position-relative insurance-cols witness-col-pans col-12 pl-1">
                              <div className=" d-flex justify-content-between flex-column p-0 p-r-5  ">
                                <div
                                  className="information-wrapper "
                                  onClick={() => {
                                    toggleWitnessDetail();
                                    setWitnessId(item);
                                  }}
                                >
                                  <div
                                    data-toggle="modal"
                                    data-target="#home-adress-modal"
                                    data-witness-id={sampleData.witness.id}
                                    data-witness-first_name={
                                      sampleData.witness.witnessFirstName
                                    }
                                    data-witness-last_name={
                                      sampleData.witness.witnessLastName
                                    }
                                    data-witness-home_contact_address1={
                                      sampleData.witness.witnessContactHome
                                        .address1
                                    }
                                    data-witness-home_contact_address2={
                                      sampleData.witness.witnessContactHome
                                        .address2
                                    }
                                    data-witness-home_contact_city={
                                      sampleData.witness.witnessContactHome.city
                                    }
                                    data-witness-home_contact_state={
                                      sampleData.witness.witnessContactHome
                                        .state
                                    }
                                    data-witness-home_contact_zip={
                                      sampleData.witness.witnessContactHome.zip
                                    }
                                    data-witness-home_contact_phone_number={
                                      sampleData.witness.witnessContactHome
                                        .phoneNumber
                                    }
                                    data-witness-home_contact_fax={
                                      sampleData.witness.witnessContactHome.fax
                                    }
                                    data-witness-home_contact_email={
                                      sampleData.witness.witnessContactHome
                                        .email
                                    }
                                    onClick={() => editHomeContact(witness)}
                                  >
                                    <div className="text-left p-l-5 p-r-5">
                                      <p className=" text-primary text-center font-weight-semibold text-uppercase">
                                        witness
                                      </p>
                                      {/*Get back here*/}
                                      <p
                                        style={{
                                          color: "black",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        {item?.witness_first_name ||
                                        item?.witness_last_name ? (
                                          `${item?.witness_first_name} ${item?.witness_last_name}`
                                        ) : (
                                          <span className="text-primary-20">
                                            Full Name
                                          </span>
                                        )}
                                      </p>
                                      <div>
                                        <p className="colFont m-0 font-weight-semibold info_address">
                                          {item.witness_contact_home
                                            ?.address1 ? (
                                            `${item.witness_contact_home?.address1.replace(/,/g, ", ")}, `
                                          ) : (
                                            <span className="text-primary-20">
                                              Address
                                            </span>
                                          )}
                                          {item.witness_contact_home?.address2}
                                        </p>
                                        <p className="colFont m-0 font-weight-semibold info_city_state_zip">
                                          {item.witness_contact_home?.city ? (
                                            `${item.witness_contact_home?.city?.substring(0, 20)},`
                                          ) : (
                                            <span className="text-primary-20">
                                              City
                                            </span>
                                          )}{" "}
                                          {item.witness_contact_home?.state ? (
                                            `${item.witness_contact_home?.state},`
                                          ) : (
                                            <span className="text-primary-20">
                                              State
                                            </span>
                                          )}{" "}
                                          {item.witness_contact_home?.zip ? (
                                            item.witness_contact_home?.zip
                                          ) : (
                                            <span className="text-primary-20">
                                              Zip
                                            </span>
                                          )}
                                        </p>
                                      </div>
                                      <p className="colFont info_phone_number text-black">
                                        {item.witness_contact_home
                                          ?.phone_number ? (
                                          <>
                                            <span>(</span>
                                            {item.witness_contact_home?.phone_number.slice(
                                              0,
                                              3
                                            )}
                                            <span>) </span>
                                            {item.witness_contact_home?.phone_number.slice(
                                              3,
                                              6
                                            )}
                                            -
                                            {item.witness_contact_home?.phone_number.slice(
                                              6
                                            )}
                                          </>
                                        ) : (
                                          <span className="text-primary-20">
                                            (###) ###-####
                                          </span>
                                        )}
                                      </p>
                                      <p className="colFont info_fax">
                                        {item.witness_contact_home?.fax ? (
                                          <>
                                            <span>(</span>
                                            {item.witness_contact_home?.fax.slice(
                                              0,
                                              3
                                            )}
                                            <span>) </span>
                                            {item.witness_contact_home?.fax.slice(
                                              3,
                                              6
                                            )}
                                            -
                                            {item.witness_contact_home?.fax.slice(
                                              6
                                            )}
                                            <small className="ml-2 text-grey">
                                              fax
                                            </small>
                                          </>
                                        ) : (
                                          <span className="text-primary-20">
                                            (###) ###-####
                                          </span>
                                        )}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div style={{ marginTop: "5px" }}>
                                  <a
                                    href="#"
                                    className="btn btn-primary-lighter-2 font-weight-semibold btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center info_email m-b-5 p-l-6 p-r-6 mt-auto"
                                    style={{ width: "255px", height: "25px" }}
                                  >
                                    <i className="ic ic-19 ic-email-3d m-r-5"></i>
                                    {item.witness_contact_home?.email}
                                  </a>
                                  <a
                                    href="#"
                                    onClick={() => {
                                      toggleGenerateDoc();
                                    }}
                                    style={{ width: "255px", height: "25px" }}
                                    className="btn w-25px btn-primary-lighter-2 font-weight-semibold btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center p-l-6 p-r-5"
                                  >
                                    <i className="ic ic-19 ic-generate-document m-r-5"></i>
                                    Generate Document
                                  </a>
                                </div>
                              </div>

                              <div className=" d-flex justify-content-between flex-column p-0 p-r-5  ">
                                <div
                                  className="information-wrapper"
                                  onClick={() => {
                                    toggleWitnessDetail();
                                    setWitnessId(item);
                                  }}
                                  style={{ width: "255px" }}
                                >
                                  <div
                                    id="Div2"
                                    data-toggle="modal"
                                    data-target="#work-adress-modal"
                                    data-witness-id={sampleData3.id}
                                    data-witness-witness_employer={
                                      sampleData3.witnessEmployer
                                    }
                                    data-witness-work_contact_first_name={
                                      sampleData3.witnessContactLast.first_name
                                    }
                                    data-witness-work_contact_address1={
                                      sampleData3.witnessContactLast.address1
                                    }
                                    data-witness-work_contact_address2={
                                      sampleData3.witnessContactLast.address2
                                    }
                                    data-witness-work_contact_city={
                                      sampleData3.witnessContactLast.city
                                    }
                                    data-witness-work_contact_state={
                                      sampleData3.witnessContactLast.state
                                    }
                                    data-witness-work_contact_zip={
                                      sampleData3.witnessContactLast.zip
                                    }
                                    data-witness-work_contact_phone_number={
                                      sampleData3.witnessContactLast.phoneNumber
                                    }
                                    data-witness-work_contact_fax={
                                      sampleData3.witnessContactLast.fax
                                    }
                                    data-witness-work_contact_email={
                                      sampleData3.witnessContactLast.email
                                    }
                                    onClick={() => editWorkContact(sampleData3)}
                                  >
                                    <div className="text-left p-l-5 p-r-5">
                                      <p className=" text-primary text-center font-weight-semibold text-uppercase">
                                        witness employer
                                      </p>
                                      <p className=" text-capitalize">
                                        {item?.witness_employer ? (
                                          item?.witness_employer
                                        ) : (
                                          <span className="text-grey">
                                            Employer:
                                          </span>
                                        )}
                                      </p>
                                      <div>
                                        <p className="colFont m-0 font-weight-semibold info_address">
                                          {item.witness_contact_last
                                            ?.address1 ? (
                                            `${item.witness_contact_last?.address1.replace(/,/g, ", ")}, `
                                          ) : (
                                            <span className="text-primary-20">
                                              Address
                                            </span>
                                          )}
                                          {item.witness_contact_last?.address2.replace(
                                            /,/g,
                                            ", "
                                          )}
                                        </p>
                                        <p className="colFont m-0 font-weight-semibold info_city_state_zip">
                                          {item.witness_contact_last?.city ? (
                                            `${item.witness_contact_last?.city},`
                                          ) : (
                                            <span className="text-primary-20">
                                              City
                                            </span>
                                          )}{" "}
                                          {item.witness_contact_last?.state ? (
                                            item.witness_contact_last?.state
                                          ) : (
                                            <span className="text-primary-20">
                                              State
                                            </span>
                                          )}{" "}
                                          {item.witness_contact_last?.zip ? (
                                            item.witness_contact_last?.zip
                                          ) : (
                                            <span className="text-primary-20">
                                              Zip
                                            </span>
                                          )}
                                        </p>
                                      </div>
                                      <p className="colFont info_phone_number text-black">
                                        {item.witness_contact_last
                                          ?.phone_number ? (
                                          <>
                                            <span>(</span>
                                            {item.witness_contact_last?.phone_number.slice(
                                              0,
                                              3
                                            )}
                                            <span>) </span>
                                            {item.witness_contact_last?.phone_number.slice(
                                              3,
                                              6
                                            )}
                                            -
                                            {item.witness_contact_last?.phone_number.slice(
                                              6
                                            )}
                                          </>
                                        ) : (
                                          <span className="text-primary-20">
                                            (###) ###-####
                                          </span>
                                        )}
                                      </p>
                                      <p className="colFont info_fax">
                                        {item.witness_contact_last?.fax ? (
                                          <>
                                            <span>(</span>
                                            {item.witness_contact_last?.fax.slice(
                                              0,
                                              3
                                            )}
                                            <span>) </span>
                                            {item.witness_contact_last?.fax.slice(
                                              3,
                                              6
                                            )}
                                            -
                                            {item.witness_contact_last?.fax.slice(
                                              6
                                            )}
                                            <span className="ml-2 text-grey">
                                              fax
                                            </span>
                                          </>
                                        ) : (
                                          <span className="text-primary-20">
                                            (###) ###-####
                                          </span>
                                        )}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div style={{ marginTop: "5px" }}>
                                  <a
                                    href="#"
                                    className="btn btn-primary-lighter-2 font-weight-semibold btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center info_email m-b-5 p-l-6 p-r-6 mt-auto"
                                    style={{ width: "255px", height: "25px" }}
                                  >
                                    <i className="ic ic-19 ic-email-3d m-r-5"></i>
                                    {item.witness_contact_last?.email}
                                  </a>
                                  <a
                                    href="#"
                                    onClick={() => {
                                      toggleGenerateDoc();
                                    }}
                                    className="btn btn-primary-lighter-2 font-weight-semibold btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center p-l-6 p-r-5"
                                    style={{ width: "255px", height: "25px" }}
                                  >
                                    <i className="ic ic-19 ic-generate-document m-r-5"></i>
                                    Generate Document
                                  </a>
                                </div>
                              </div>

                              <div class="d-flex " style={{ width: "255px" }}>
                                <div className="dynamic-width col-auto d-flex flex-column p-0 p-r-5">
                                  <div
                                    className="information-wrapper"
                                    onClick={() => {
                                      toggleWitnessDetail();
                                      setWitnessId(item);
                                    }}
                                    style={{ width: "255px" }}
                                  >
                                    <div
                                      data-toggle="modal"
                                      data-target="#witness-details-modal"
                                      data-witness-id={sampleData4.id}
                                      data-witness-age={sampleData4.age}
                                      data-witness-for={`${sampleData4.witnessForEntity}, ${sampleData4.witnessForRecordId}`}
                                      data-witness-witness_birthday={
                                        sampleData4.witnessBirthday
                                      }
                                      data-witness-witness_gender={
                                        sampleData4.witnessGender
                                      }
                                      data-witness-RepLetterSent={
                                        sampleData4.repLetterSent
                                      }
                                      data-witness-relationship_to_client={
                                        sampleData4.relationshipToClient
                                      }
                                      data-witness-contact_confirmed_date={
                                        sampleData4.contactConfirmedDate
                                      }
                                    >
                                      <div className="text-left p-l-5 p-r-5">
                                        <p className=" text-primary text-center font-weight-semibold text-uppercase">
                                          witness details
                                        </p>
                                        <div className="d-flex justify-content-between Fonts mb-0">
                                          <div className="text-left">
                                            <span className="d-inline-block text-dark-grey">
                                              For :
                                            </span>
                                          </div>
                                          <div className="text-left font-weight-semibold">
                                            <p>
                                              {item.witness_for_entity},{" "}
                                              {item.witness_for_record_id}
                                            </p>
                                          </div>
                                        </div>

                                        <div className="row colFonts mb-0">
                                          <div className="col text-left">
                                            <span className="d-inline-block text-dark-grey">
                                              Birthday :
                                            </span>
                                          </div>
                                          <div className="col-auto text-left font-weight-semibold">
                                            <p>
                                              {formatDate(
                                                item.witness_birthday
                                              )}
                                              {item.age &&
                                                `, ${item.age} years old`}
                                            </p>
                                          </div>
                                        </div>
                                        <div className="row colFonts mb-0">
                                          <div className="col text-left">
                                            <span className="d-inline-block text-dark-grey">
                                              Gender :
                                            </span>
                                          </div>
                                          <div className="col-auto text-left font-weight-semibold">
                                            <p>{item.witness_gender}</p>
                                          </div>
                                        </div>
                                        <div className="row colFonts mb-0">
                                          <div className="col text-left">
                                            <span className="d-inline-block text-dark-grey">
                                              Rep Letter :
                                            </span>
                                          </div>
                                          <div className="col-auto text-left font-weight-semibold">
                                            <p>
                                              {formatDate(item.RepLetterSent)}
                                            </p>
                                          </div>
                                        </div>
                                        <div className="row colFonts mb-0">
                                          <div className="col text-left">
                                            <span className="d-inline-block text-dark-grey">
                                              Contact :
                                            </span>
                                          </div>
                                          <div className="col-auto text-left font-weight-semibold">
                                            <p>
                                              {formatDate(
                                                item.contact_confirmed_date
                                              )}
                                            </p>
                                          </div>
                                        </div>
                                        <div className="row colFonts mb-0">
                                          <div className="col text-left">
                                            <span className="d-inline-block text-dark-grey">
                                              Relationship to Client :
                                            </span>
                                          </div>
                                          <div className="col-auto text-left font-weight-semibold">
                                            <p>
                                              {item?.relationship_to_client?.toString()}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="dynamic-width col-auto d-flex flex-column hidden-panel p-0 p-r-5  ">
                                  <div className="information-wrapper">
                                    <div>
                                      <div className="text-left p-l-5 p-r-5">
                                        <p className=" text-primary text-center font-weight-semibold text-uppercase">
                                          {sampleData5.title}
                                        </p>
                                        {sampleData5.dataPoints.map(
                                          (dataPoint, index) => (
                                            <div
                                              key={index}
                                              className="row colFonts mb-0"
                                            >
                                              <div className="col text-left">
                                                <span className="d-inline-block text-dark-grey">
                                                  {dataPoint.label}
                                                </span>
                                              </div>
                                              <div className="col-auto text-left font-weight-semibold">
                                                <p>{dataPoint.value}</p>
                                              </div>
                                            </div>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div class="d-flex ">
                                <div className="h-100 d-flex justify-content-center align-items-center">
                                  <div
                                    className="defendant-placeholder"
                                    style={{
                                      border: "10px solid rgb(165, 175, 190)",
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                      // padding: "10px",
                                      boxSizing: "border-box",
                                      overflow: "hidden",
                                      width: "255px",
                                      height: "200px",
                                      marginTop: "5px",
                                      marginLeft: "5px",
                                    }}
                                  >
                                    <svg
                                      width="255px"
                                      height="200px"
                                      viewBox="10 2 4 22"
                                      xmlns="http://www.w3.org/2000/svg"
                                      style={{ overflow: "hidden" }}
                                    >
                                      <g>
                                        <g>
                                          <path
                                            d="M8,13L12,18L10,18L9,17L8,18L7,17L6,18L4,18L8,13Z"
                                            style={{
                                              fill: "rgb(220,225,230)",
                                              fillRule: "nonzero",
                                            }}
                                          />
                                          <path
                                            d="M1,20L8,13L15,20"
                                            style={{
                                              fill: "none",
                                              fillRule: "nonzero",
                                              stroke: "rgb(165,175,190)",
                                              strokeWidth: 2,
                                            }}
                                          />
                                          <path
                                            d="M23,20L19,16L12,23"
                                            style={{
                                              fill: "none",
                                              fillRule: "nonzero",
                                              stroke: "rgb(165,175,190)",
                                              strokeWidth: 2,
                                            }}
                                          />
                                          <path
                                            d="M8.508,5C7.729,5 7.132,5.482 6.762,6.109C5.99,5.876 5.296,6.344 5.113,7.16C4.499,7.348 4,7.828 4,8.5C4,9.323 4.677,10 5.5,10L10.5,10C11.323,10 12,9.323 12,8.5C12,7.718 11.371,7.105 10.604,7.043C10.55,5.918 9.645,5 8.508,5Z"
                                            style={{
                                              fill: "rgb(220,225,230)",
                                              fillRule: "nonzero",
                                            }}
                                          />
                                          <path
                                            d="M17.212,5.339C17.114,5.183 16.886,5.183 16.788,5.339L16.282,6.149C16.274,6.162 16.261,6.172 16.245,6.177C16.23,6.182 16.213,6.181 16.198,6.173L15.353,5.724C15.19,5.637 14.993,5.751 14.986,5.936L14.953,6.87C14.952,6.892 14.943,6.913 14.928,6.928C14.913,6.943 14.892,6.952 14.87,6.953L13.936,6.986C13.751,6.992 13.637,7.19 13.724,7.353L14.173,8.199C14.181,8.213 14.182,8.229 14.177,8.245C14.172,8.26 14.162,8.274 14.149,8.282L13.339,8.788C13.183,8.886 13.183,9.114 13.339,9.212L14.149,9.718C14.163,9.726 14.172,9.74 14.177,9.755C14.182,9.77 14.181,9.787 14.173,9.802L13.724,10.647C13.637,10.81 13.751,11.008 13.936,11.014L14.87,11.047C14.892,11.048 14.913,11.057 14.928,11.072C14.943,11.087 14.952,11.108 14.953,11.13L14.986,12.064C14.993,12.249 15.19,12.363 15.353,12.276L16.198,11.827C16.213,11.819 16.23,11.818 16.245,11.823C16.261,11.828 16.274,11.838 16.282,11.851L16.788,12.661C16.886,12.817 17.114,12.817 17.212,12.661L17.717,11.852C17.726,11.838 17.74,11.828 17.756,11.822C17.77,11.817 17.787,11.819 17.801,11.827L18.647,12.276C18.81,12.363 19.008,12.249 19.014,12.064L19.047,11.13C19.048,11.108 19.057,11.087 19.072,11.072C19.087,11.057 19.108,11.048 19.13,11.047L20.064,11.014C20.249,11.008 20.363,10.81 20.276,10.647L19.827,9.801C19.819,9.787 19.818,9.771 19.823,9.755C19.828,9.74 19.838,9.726 19.851,9.718L20.661,9.212C20.817,9.114 20.817,8.886 20.661,8.788L19.851,8.282C19.838,8.274 19.828,8.26 19.823,8.245C19.818,8.229 19.819,8.213 19.827,8.199L20.276,7.353C20.363,7.19 20.249,6.992 20.064,6.986L19.13,6.953C19.108,6.952 19.087,6.943 19.072,6.928C19.057,6.913 19.048,6.892 19.047,6.87L19.014,5.936C19.008,5.751 18.81,5.637 18.647,5.724L17.802,6.173C17.787,6.181 17.77,6.182 17.755,6.177C17.74,6.172 17.726,6.162 17.718,6.149L17.212,5.339Z"
                                            style={{
                                              fill: "rgb(165,175,190)",
                                              fillRule: "nonzero",
                                            }}
                                          />
                                          <circle
                                            cx={17}
                                            cy={9}
                                            r={2}
                                            style={{ fill: "white" }}
                                          />
                                        </g>
                                      </g>
                                    </svg>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            class="witnessNotes"
                            style={{ zIndex: 1 }}
                            // style={{ flexBasis: "56.1667%" }}
                          >
                            <p className="p-0 height-25 d-flex justify-content-center text-center text-white position-relative line-height-25 margin-right-206 ">
                              Witnesses Notes
                            </p>
                            <NotesPanel
                              entity_type={"Witness"}
                              record_id={item.id}
                              module={"Witnesses"}
                            />
                          </div>
                        </div>
                        <div className="row documents-wrapper m-t-5">
                          <div className="col-12">
                            <div className="height-25">
                              <h4 className="text-capitalize d-flex align-items-center justify-content-center h-100 text-lg text-upper-case background-main-10 font-weight-semibold text-center client-contact-title">
                                &nbsp;Document Row
                              </h4>
                            </div>
                            <DocumentRow
                              clientProvider={item}
                              page="Witnesses"
                            />
                          </div>
                        </div>
                      </div>

                      {/* <div
                        className="col-12 pr-0 pl-2"
                        onClick={() => setShowDocModal(true)}
                      >
                        <div
                          className="background-main-10 height-25 "
                          style={{
                            textAlign: "center",
                            fontWeight: "bold",
                            marginLeft: "5px"
                          }}
                        >
                          Upload Document to Page
                        </div>
                        <div className="row redtd2 icon-text-boxes-wrap flex-row position-relative ml-0 mr-0 m-0">
                          <div className="col p-0">
                            <div className="d-flex justify-content-start w-100">
                              <div className="icon-text-boxes d-flex flex-wrap w-100 quick-doc-row">
                                <div
                                  className="col-12 col-md-3 col-xl icon-text-box text-center dropzone-93-1"
                                  id="no-vertical-border"
                                  onclick="uploadPopUp('93','','1')"
                                >
                                  <p className="date" />
                                  <span className="icon-wrap">
                                    <i className="ic ic-35 ic-custom-icon-cloud-2 cursor-pointer" />
                                  </span>{" "}
                                  <p className="name text-lg-grey">
                                    1. Signed Agreement
                                  </p>
                                </div>{" "}
                                <div
                                  className="col-12 col-md-3 col-xl icon-text-box text-center dropzone-94-1"
                                  id="no-vertical-border"
                                  onclick="uploadPopUp('94','','1')"
                                >
                                  <p className="date" />
                                  <span className="icon-wrap">
                                    <i className="ic ic-35 ic-custom-icon-cloud-2 cursor-pointer" />
                                  </span>{" "}
                                  <p className="name text-lg-grey">
                                    2. Designation of Representation
                                  </p>
                                </div>{" "}
                                <div
                                  className="col-12 col-md-3 col-xl icon-text-box text-center dropzone-95-1"
                                  id="no-vertical-border"
                                  onclick="uploadPopUp('95','','1')"
                                >
                                  <p className="date" />
                                  <span className="icon-wrap">
                                    <i className="ic ic-35 ic-custom-icon-cloud-2 cursor-pointer" />
                                  </span>{" "}
                                  <p className="name text-lg-grey">
                                    3. Available
                                  </p>
                                </div>{" "}
                                <div
                                  className="col-12 col-md-3 col-xl icon-text-box text-center dropzone-96-1"
                                  id="no-vertical-border"
                                  onclick="uploadPopUp('96','','1')"
                                >
                                  <p className="date" />
                                  <span className="icon-wrap">
                                    <i className="ic ic-35 ic-custom-icon-cloud-2 cursor-pointer" />
                                  </span>{" "}
                                  <p className="name text-lg-grey">
                                    4. Available
                                  </p>
                                </div>{" "}
                                <div
                                  className="col-12 col-md-3 col-xl icon-text-box text-center dropzone-97-1"
                                  id="no-vertical-border"
                                  onclick="uploadPopUp('97','','1')"
                                >
                                  <p className="date" />
                                  <span className="icon-wrap">
                                    <i className="ic ic-35 ic-custom-icon-cloud-2 cursor-pointer" />
                                  </span>{" "}
                                  <p className="name text-lg-grey">
                                    5. Available
                                  </p>
                                </div>{" "}
                                <div
                                  className="col-12 col-md-3 col-xl icon-text-box text-center dropzone-98-1"
                                  id="no-vertical-border"
                                  onclick="uploadPopUp('98','','1')"
                                >
                                  <p className="date" />
                                  <span className="icon-wrap">
                                    <i className="ic ic-35 ic-custom-icon-cloud-2 cursor-pointer" />
                                  </span>{" "}
                                  <p className="name text-lg-grey">
                                    6. Available
                                  </p>
                                </div>{" "}
                                <div
                                  className="col-12 col-md-3 col-xl icon-text-box text-center dropzone-99-1"
                                  id="no-vertical-border"
                                  onclick="uploadPopUp('99','','1')"
                                >
                                  <p className="date" />
                                  <span className="icon-wrap">
                                    <i className="ic ic-35 ic-custom-icon-cloud-2 cursor-pointer" />
                                  </span>{" "}
                                  <p className="name text-lg-grey">
                                    7. Available
                                  </p>
                                </div>{" "}
                                <div
                                  className="col-12 col-md-3 col-xl icon-text-box text-center dropzone-100-1"
                                  id="no-vertical-border"
                                  onclick="uploadPopUp('100','','1')"
                                >
                                  <p className="date" />
                                  <span className="icon-wrap">
                                    <i className="ic ic-35 ic-custom-icon-cloud-2 cursor-pointer" />
                                  </span>{" "}
                                  <p className="name text-lg-grey">
                                    8. Available
                                  </p>
                                </div>{" "}
                                <div className="col-12 col-md-3 col-xl icon-text-box text-center order-last">
                                  <div className="upload-icon dropzone-page border-0 rounded-0 bg-transparent dz-clickable">
                                    <div className="d-flex align-items-center">
                                      <span className="font-weight-bold text-gold h5 m-0 pr-2">
                                        +
                                      </span>
                                      <span className="text-lg-grey">
                                        Upload Document to Page
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>{" "}
                            </div>
                          </div>
                        </div>
                      </div> */}
                    </>
                  );
                })}
              </div>
            </div>

            {/* for insurance  */}
            <div class="row" style={{ marginBottom: "5px" }}>
              <div class="col-12 ">
                {witnessData?.witnesses?.map((witnessItem, witnessItemIndex) =>
                  witnessItem?.witness_insurance?.map((item, index) => (
                    <>
                      <div
                        class="border-box has-checklist rounded-0 mr-15 m-t-5"
                        key={index}
                        // style={{ height: "236px" }}
                      >
                        <div
                          class="checklist-section-wrapper position-absolute top-6 z-index-9"
                          style={{
                            right: "0px",
                          }}
                        >
                          <div class="skew-box"></div>
                          <div class="checklist-section">
                            <div className="dropdown w-100">
                              <button
                                className="dropdown-toggle text-darker d-flex align-items-center justify-content-end w-100"
                                id={`myDropdown${sampleData2.clientProviderId}`}
                                type="button"
                                data-toggle="dropdown"
                                aria-expanded="false"
                              >
                                <div className="nt-box sub-gauge">
                                  {Object.entries(
                                    sampleData2.checklistPanelPercentage
                                  ).map(
                                    ([key, value]) =>
                                      key ===
                                        sampleData2.witnessId.toString() && ""
                                  )}
                                </div>
                                <span className="d-flex align-items-center">
                                  <span className="ic has-no-after ic-check text-success d-flex align-items-center justify-content-center">
                                    <svg
                                      width="17"
                                      height="50"
                                      viewBox="0 0 17 50"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M0 25.5923L2.16281 23.2528L6.69618 27.4438L14.5501 18L17 20.0372L6.99858 32.0626L0 25.5923Z"
                                        fill="currentColor"
                                      />
                                    </svg>
                                  </span>
                                  <span className="checklist-text">
                                    {sampleData2.pageName2}
                                  </span>
                                  <span className="ic has-no-after ic-arrow text-white d-flex align-items-center justify-content-center">
                                    <svg
                                      width="17"
                                      height="50"
                                      viewBox="0 0 17 50"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M0 16H4.59998L8.5 19.95L12.4 16H17L8.5 24.55L0 16Z"
                                        fill="currentColor"
                                      />
                                      <path
                                        d="M0 25.4512H4.59998L8.5 29.4012L12.4 25.4512H17L8.5 34.0012L0 25.4512Z"
                                        fill="currentColor"
                                      />
                                    </svg>
                                  </span>
                                </span>
                              </button>
                              <div
                                aria-labelledby={`myDropdown${sampleData2.clientProviderId}`}
                                className="dropdown-menu dropdown-menu-right dropdown-content"
                                id="insurance-dropdown-width"
                              >
                                {sampleData2.finalChecklist.map(
                                  (checklist, index) =>
                                    checklist.providerId ===
                                      sampleData2.witnessId && (
                                      <div
                                        className="checkbox-line"
                                        key={index}
                                      >
                                        <input
                                          type="checkbox"
                                          checked={checklist.status}
                                          onChange={() =>
                                            (window.location.href =
                                              checklist.status
                                                ? `/bp-uncheckPanelChecklist/${checklist.panelCaseChecklist}`
                                                : `/bp-markPanelChecklist/${checklist.id}/${sampleData2.witnessId}/client.id/case.id/Witness`)
                                          }
                                          id={`medicalcheck${index}`}
                                          name={`medicalcheck${index}`}
                                        />
                                        <label htmlFor={`medicalcheck${index}`}>
                                          {checklist.name}
                                        </label>
                                      </div>
                                    )
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="row no-gutters has-title-bg m-b-5 flex-nowrap col-12 pl-2 p-r-0">
                          <div
                            className="insurancePanel"
                            // style={{ flexBasis: "43.8333%" }}
                          >
                            <div class="panel-icon">
                              <img src="https://simplefirm-bucket.s3.amazonaws.com/static/images/insurance-icon-color_2pFtjE8.svg" />
                            </div>
                            <div className="top-header height-25 d-flex">
                              <div className="top-head d-flex align-items-center">
                                <div className="d-flex align-items-center">
                                  <h2 className="d-flex align-items-center">
                                    <small className="font-weight-bold text-wrap-no-wrap-Wit">
                                      {item?.insurance_type.name}{" "}
                                      <span
                                        style={{
                                          color: "#777777",
                                        }}
                                      >
                                        {" "}
                                        For Witness{" "}
                                      </span>
                                      {witnessItem?.witness_first_name}{" "}
                                      {witnessItem?.witness_last_name}
                                    </small>
                                  </h2>
                                </div>
                              </div>
                            </div>
                            <div
                              class="row no-gutters equal-column-wrapper position-relative insurance-cols witness-col-pans col-14 pl-1"
                              style={{
                                height: "80%",
                                marginTop: "5px",
                              }}
                            >
                              <div className="col-auto d-flex flex-column p-0 p-r-5 ">
                                <div
                                  className="information-wrapper"
                                  onClick={() => {
                                    toggleCompany();
                                    setWitnessId(item);
                                  }}
                                  style={{ width: "255px" }}
                                >
                                  <div
                                    data-toggle="modal"
                                    data-target="#home-adress-modal"
                                    data-witness-id={sampleData.witness.id}
                                    data-witness-first_name={
                                      sampleData.witness.witnessFirstName
                                    }
                                    data-witness-last_name={
                                      sampleData.witness.witnessLastName
                                    }
                                    data-witness-home_contact_address1={
                                      sampleData.witness.witnessContactHome
                                        .address1
                                    }
                                    data-witness-home_contact_address2={
                                      sampleData.witness.witnessContactHome
                                        .address2
                                    }
                                    data-witness-home_contact_city={
                                      sampleData.witness.witnessContactHome.city
                                    }
                                    data-witness-home_contact_state={
                                      sampleData.witness.witnessContactHome
                                        .state
                                    }
                                    data-witness-home_contact_zip={
                                      sampleData.witness.witnessContactHome.zip
                                    }
                                    data-witness-home_contact_phone_number={
                                      sampleData.witness.witnessContactHome
                                        .phoneNumber
                                    }
                                    data-witness-home_contact_fax={
                                      sampleData.witness.witnessContactHome.fax
                                    }
                                    data-witness-home_contact_email={
                                      sampleData.witness.witnessContactHome
                                        .email
                                    }
                                    onClick={() => editHomeContact(witness)}
                                  >
                                    <div className="text-left p-l-5 p-r-5">
                                      <p className=" text-primary text-center font-weight-semibold text-uppercase">
                                        Insurance Company
                                      </p>

                                      <p className="colFont m-0 font-weight-semibold info_address">
                                        {item?.company_contact?.name ? (
                                          `${item?.company_contact?.name},`
                                        ) : (
                                          <span className="text-primary-20">
                                            Company Name
                                          </span>
                                        )}
                                      </p>
                                      <div>
                                        <p className="colFont m-0 font-weight-semibold info_address">
                                          {item?.company_contact?.address1 ? (
                                            `${item?.company_contact?.address1.replace(/,/g, ", ")}, `
                                          ) : (
                                            <span className="text-primary-20">
                                              Address
                                            </span>
                                          )}
                                          {item?.company_contact?.address2.replace(
                                            /,/g,
                                            ", "
                                          )}
                                        </p>
                                        <p className="colFont m-0 font-weight-semibold info_city_state_zip">
                                          {item?.company_contact?.city ? (
                                            `${item?.company_contact?.city}, `
                                          ) : (
                                            <span className="text-primary-20">
                                              City
                                            </span>
                                          )}{" "}
                                          {item?.company_contact?.state ? (
                                            `${item?.company_contact?.state}, `
                                          ) : (
                                            <span className="text-primary-20">
                                              State
                                            </span>
                                          )}{" "}
                                          {item?.company_contact?.zip ? (
                                            item?.company_contact?.zip
                                          ) : (
                                            <span className="text-primary-20">
                                              Zip
                                            </span>
                                          )}
                                        </p>
                                      </div>
                                      <p className="colFont info_phone_number text-black">
                                        {item?.company_contact?.phone_ext ? (
                                          <>
                                            <span>(</span>
                                            {item?.company_contact?.phone_ext.slice(
                                              0,
                                              3
                                            )}
                                            <span>) </span>
                                            {item?.company_contact?.phone_ext.slice(
                                              3,
                                              6
                                            )}
                                            -
                                            {item?.company_contact?.phone_ext.slice(
                                              6
                                            )}
                                          </>
                                        ) : (
                                          <span className="text-primary-20">
                                            (###) ###-####
                                          </span>
                                        )}
                                      </p>
                                      <p className="colFont info_fax">
                                        {item.company_contact?.fax ? (
                                          <>
                                            <span>(</span>
                                            {item.company_contact?.fax.slice(
                                              0,
                                              3
                                            )}
                                            <span>) </span>
                                            {item.company_contact?.fax.slice(
                                              3,
                                              6
                                            )}
                                            -
                                            {item.company_contact?.fax.slice(6)}
                                            <small className="ml-2 text-grey">
                                              fax
                                            </small>
                                          </>
                                        ) : (
                                          <span className="text-primary-20">
                                            (###) ###-####
                                          </span>
                                        )}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                <div
                                  className="mt-auto"
                                  style={{ marginTop: "7px" }}
                                >
                                  <a
                                    href="#"
                                    className="btn btn-primary-lighter-2 font-weight-semibold btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center info_email m-b-5 p-l-6 p-r-6 mt-auto"
                                    style={{ height: "25px", width: "255px" }}
                                  >
                                    <i className="ic ic-19 ic-email-3d m-r-5"></i>
                                    {item?.company_contact?.email}
                                  </a>
                                  <a
                                    href="#"
                                    onClick={toggleGenerateDoc}
                                    className="btn btn-primary-lighter-2 font-weight-semibold btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center p-l-6 p-r-5"
                                    style={{ height: "25px", width: "255px" }}
                                  >
                                    <i className="ic ic-19 ic-generate-document m-r-5"></i>
                                    Generate Document
                                  </a>
                                </div>
                              </div>
                              <div className="col-auto d-flex flex-column p-0 p-r-5 ">
                                <div
                                  className="information-wrapper"
                                  onClick={() => {
                                    toggleWitnesseWorksContact();
                                    setWitnessId(item);
                                  }}
                                  style={{ width: "255px" }}
                                >
                                  <div
                                    id="Div2"
                                    data-toggle="modal"
                                    data-target="#work-adress-modal"
                                    data-witness-id={sampleData3.id}
                                    data-witness-witness_employer={
                                      sampleData3.witnessEmployer
                                    }
                                    data-witness-work_contact_address1={
                                      sampleData3.witnessContactLast.address1
                                    }
                                    data-witness-work_contact_address2={
                                      sampleData3.witnessContactLast.address2
                                    }
                                    data-witness-work_contact_city={
                                      sampleData3.witnessContactLast.city
                                    }
                                    data-witness-work_contact_state={
                                      sampleData3.witnessContactLast.state
                                    }
                                    data-witness-work_contact_zip={
                                      sampleData3.witnessContactLast.zip
                                    }
                                    data-witness-work_contact_phone_number={
                                      sampleData3.witnessContactLast.phoneNumber
                                    }
                                    data-witness-work_contact_fax={
                                      sampleData3.witnessContactLast.fax
                                    }
                                    data-witness-work_contact_email={
                                      sampleData3.witnessContactLast.email
                                    }
                                    onClick={() => editWorkContact(sampleData3)}
                                  >
                                    <div className="text-left p-l-5 p-r-5">
                                      <p className=" text-primary text-center font-weight-semibold text-uppercase">
                                        Adjuster
                                      </p>

                                      <p className="colFont m-0 font-weight-semibold info_address">
                                        {item?.adjuster?.first_name ? (
                                          `${item?.adjuster?.first_name} ${item?.adjuster?.last_name},`
                                        ) : (
                                          <span className="text-primary-20">
                                            Adjuster Name
                                          </span>
                                        )}
                                      </p>
                                      <div>
                                        <p className="colFont m-0 font-weight-semibold info_address">
                                          {item?.adjuster?.address1 ? (
                                            `${item?.adjuster?.address1.replace(/,/g, ", ")}, `
                                          ) : (
                                            <span className="text-primary-20">
                                              Address
                                            </span>
                                          )}
                                          {item?.adjuster?.address2.replace(
                                            /,/g,
                                            ", "
                                          )}
                                        </p>
                                        <p className="colFont m-0 font-weight-semibold info_city_state_zip">
                                          {item?.adjuster?.city ? (
                                            `${item?.adjuster?.city}, `
                                          ) : (
                                            <span className="text-primary-20">
                                              City
                                            </span>
                                          )}{" "}
                                          {item?.adjuster?.state ? (
                                            `${item?.adjuster?.state}, `
                                          ) : (
                                            <span className="text-primary-20">
                                              State
                                            </span>
                                          )}{" "}
                                          {item?.adjuster?.zip ? (
                                            `${item?.adjuster?.zip}`
                                          ) : (
                                            <span className="text-primary-20">
                                              Zip
                                            </span>
                                          )}
                                        </p>
                                      </div>
                                      <p className="colFont info_phone_number text-black">
                                        {item?.adjuster?.phone_number ? (
                                          <>
                                            <span>(</span>
                                            {item?.adjuster?.phone_number.slice(
                                              0,
                                              3
                                            )}
                                            <span>) </span>
                                            {item?.adjuster?.phone_number.slice(
                                              3,
                                              6
                                            )}
                                            -
                                            {item?.adjuster?.phone_number.slice(
                                              6
                                            )}
                                          </>
                                        ) : (
                                          <span className="text-primary-20">
                                            (###) ###-####
                                          </span>
                                        )}
                                      </p>
                                      <p className="colFont info_fax">
                                        {item?.adjuster?.fax ? (
                                          <>
                                            <span>(</span>
                                            {item?.adjuster?.fax.slice(0, 3)}
                                            <span>) </span>
                                            {item?.adjuster?.fax.slice(3, 6)}-
                                            {item?.adjuster?.fax.slice(6)}
                                            <span className="ml-2 text-grey">
                                              fax
                                            </span>
                                          </>
                                        ) : (
                                          <span className="text-primary-20">
                                            (###) ###-####
                                          </span>
                                        )}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div
                                  className="mt-auto"
                                  style={{ marginTop: "7px" }}
                                >
                                  <a
                                    href="#"
                                    className="btn btn-primary-lighter-2 font-weight-semibold btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center info_email m-b-5 p-l-6 p-r-6 mt-auto"
                                    style={{ height: "25px", width: "255px" }}
                                  >
                                    <i className="ic ic-19 ic-email-3d m-r-5"></i>
                                    {item?.adjuster?.email}
                                  </a>
                                  <a
                                    href="#"
                                    onClick={toggleGenerateDoc}
                                    className="btn btn-primary-lighter-2 font-weight-semibold btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center p-l-6 p-r-5"
                                    style={{ height: "25px", width: "255px" }}
                                  >
                                    <i className="ic ic-19 ic-generate-document m-r-5"></i>
                                    Generate Document
                                  </a>
                                </div>
                              </div>

                              <div className="col-auto d-flex flex-column p-0 p-r-5 ">
                                <div
                                  className="information-wrapper"
                                  onClick={() => {
                                    toggleWitnesseWorksContact();
                                    setWitnessId(item);
                                  }}
                                  style={{ width: "255px" }}
                                >
                                  <div
                                    id="Div2"
                                    data-toggle="modal"
                                    data-target="#work-adress-modal"
                                    data-witness-id={sampleData3.id}
                                    data-witness-witness_employer={
                                      sampleData3.witnessEmployer
                                    }
                                    data-witness-work_contact_address1={
                                      sampleData3.witnessContactLast.address1
                                    }
                                    data-witness-work_contact_address2={
                                      sampleData3.witnessContactLast.address2
                                    }
                                    data-witness-work_contact_city={
                                      sampleData3.witnessContactLast.city
                                    }
                                    data-witness-work_contact_state={
                                      sampleData3.witnessContactLast.state
                                    }
                                    data-witness-work_contact_zip={
                                      sampleData3.witnessContactLast.zip
                                    }
                                    data-witness-work_contact_phone_number={
                                      sampleData3.witnessContactLast.phoneNumber
                                    }
                                    data-witness-work_contact_fax={
                                      sampleData3.witnessContactLast.fax
                                    }
                                    data-witness-work_contact_email={
                                      sampleData3.witnessContactLast.email
                                    }
                                    onClick={() => editWorkContact(sampleData3)}
                                  >
                                    <div className="text-left p-l-5 p-r-5">
                                      <p className=" text-primary text-center font-weight-semibold text-uppercase">
                                        supervisor
                                      </p>
                                      <p className=" text-capitalize">
                                        {item?.supervisor?.first_name ? (
                                          `${item?.supervisor?.first_name},
                                          ${item?.supervisor?.last_name}`
                                        ) : (
                                          <span className="">
                                            {item?.supervisor?.name}
                                          </span>
                                        )}
                                      </p>
                                      <div>
                                        {/* <p className="colFont m-0 font-weight-semibold info_address">
                                        {item?.supervisor?.first_name ? (
                                          `${item?.supervisor?.first_name} ${item?.supervisor?.last_name},`
                                        ) : (
                                          <span className="text-primary-20">
                                            Supervisor Name
                                          </span>
                                        )}
                                      </p> */}
                                        <p className="colFont m-0 font-weight-semibold info_address">
                                          {item?.supervisor?.address1 ? (
                                            `${item?.supervisor?.address1.replace(/,/g, ", ")}, `
                                          ) : (
                                            <span className="text-primary-20">
                                              Address
                                            </span>
                                          )}
                                          {item?.supervisor?.address2.replace(
                                            /,/g,
                                            ", "
                                          )}
                                        </p>

                                        <p className="colFont m-0 font-weight-semibold info_city_state_zip">
                                          {item?.supervisor?.city ? (
                                            `${item?.supervisor?.city}, `
                                          ) : (
                                            <span className="text-primary-20">
                                              City
                                            </span>
                                          )}{" "}
                                          {item?.supervisor?.state ? (
                                            `${item?.supervisor?.state}, `
                                          ) : (
                                            <span className="text-primary-20">
                                              State
                                            </span>
                                          )}{" "}
                                          {item?.adjuster?.zip ? (
                                            `${item?.adjuster?.zip}, `
                                          ) : (
                                            <span className="text-primary-20">
                                              Zip
                                            </span>
                                          )}
                                        </p>
                                      </div>
                                      <p className="colFont info_phone_number text-black">
                                        {item?.supervisor?.phone_number ? (
                                          <>
                                            <span>(</span>
                                            {item?.supervisor?.phone_number.slice(
                                              0,
                                              3
                                            )}
                                            <span>) </span>
                                            {item?.supervisor?.phone_number.slice(
                                              3,
                                              6
                                            )}
                                            -
                                            {item?.supervisor?.phone_number.slice(
                                              6
                                            )}
                                          </>
                                        ) : (
                                          <span className="text-primary-20">
                                            (###) ###-####
                                          </span>
                                        )}
                                      </p>
                                      <p className="colFont info_fax">
                                        {item?.supervisor?.fax ? (
                                          <>
                                            <span>(</span>
                                            {item?.supervisor?.fax.slice(0, 3)}
                                            <span>) </span>
                                            {item?.supervisor?.fax.slice(3, 6)}-
                                            {item?.supervisor?.fax.slice(6)}
                                            <span className="ml-2 text-grey">
                                              fax
                                            </span>
                                          </>
                                        ) : (
                                          <span className="text-primary-20">
                                            (###) ###-####
                                          </span>
                                        )}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div
                                  className="mt-auto"
                                  style={{ marginTop: "7px" }}
                                >
                                  <a
                                    href="#"
                                    className="btn btn-primary-lighter-2 font-weight-semibold btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center info_email m-b-5 p-l-6 p-r-6 mt-auto"
                                    style={{ height: "25px", width: "255px" }}
                                  >
                                    <i className="ic ic-19 ic-email-3d m-r-5"></i>
                                    {item?.supervisor?.email}
                                  </a>
                                  <a
                                    href="#"
                                    onClick={toggleGenerateDoc}
                                    className="btn btn-primary-lighter-2 font-weight-semibold btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center p-l-6 p-r-5"
                                    style={{ height: "25px", width: "255px" }}
                                  >
                                    <i className="ic ic-19 ic-generate-document m-r-5"></i>
                                    Generate Document
                                  </a>
                                </div>
                              </div>

                              <div className=" col-auto d-flex flex-column p-0 p-r-5 ">
                                <div
                                  className="information-wrapper"
                                  onClick={() => {
                                    toggleWitnesseWorksContact();
                                    setWitnessId(item);
                                  }}
                                  style={{ width: "255px" }}
                                >
                                  <div
                                    id="Div2"
                                    data-toggle="modal"
                                    data-target="#work-adress-modal"
                                    data-witness-id={sampleData3.id}
                                    data-witness-witness_employer={
                                      sampleData3.witnessEmployer
                                    }
                                    data-witness-work_contact_address1={
                                      sampleData3.witnessContactLast.address1
                                    }
                                    data-witness-work_contact_address2={
                                      sampleData3.witnessContactLast.address2
                                    }
                                    data-witness-work_contact_city={
                                      sampleData3.witnessContactLast.city
                                    }
                                    data-witness-work_contact_state={
                                      sampleData3.witnessContactLast.state
                                    }
                                    data-witness-work_contact_zip={
                                      sampleData3.witnessContactLast.zip
                                    }
                                    data-witness-work_contact_phone_number={
                                      sampleData3.witnessContactLast.phoneNumber
                                    }
                                    data-witness-work_contact_fax={
                                      sampleData3.witnessContactLast.fax
                                    }
                                    data-witness-work_contact_email={
                                      sampleData3.witnessContactLast.email
                                    }
                                    onClick={() => editWorkContact(sampleData3)}
                                  >
                                    <div className="text-left p-l-5 p-r-5">
                                      <p className=" text-primary text-center font-weight-semibold text-uppercase">
                                        Claim Information
                                      </p>
                                      <div className="row colFonts mb-0">
                                        <div className="col text-left">
                                          <span className="d-inline-block text-dark-grey">
                                            Type
                                          </span>
                                        </div>
                                        <div className="col-auto text-left font-weight-semibold">
                                          <p>{item?.insurance_type.name}</p>
                                        </div>
                                      </div>
                                      <div className="row colFonts mb-0">
                                        <div className="col text-left">
                                          <span className="d-inline-block text-dark-grey">
                                            Policy
                                          </span>
                                        </div>
                                        <div className="col-auto text-left font-weight-semibold">
                                          <p>{item?.policy_number}</p>
                                        </div>
                                      </div>
                                      <div className="row colFonts mb-0">
                                        <div className="col text-left">
                                          <span className="d-inline-block text-dark-grey">
                                            Claim
                                          </span>
                                        </div>
                                        <div className="col-auto text-left font-weight-semibold">
                                          <p>{item?.claim_number}</p>
                                        </div>
                                      </div>
                                      <div className="row colFonts mb-0">
                                        <div className="col text-left">
                                          <span className="d-inline-block text-dark-grey">
                                            Limits
                                          </span>
                                        </div>
                                        <div className="col-auto text-left font-weight-semibold">
                                          <p>
                                            {item?.insurance_type.UMLimit1
                                              ? item?.insurance_type.UMLimit1
                                              : "$ / $"}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="row colFonts mb-0">
                                        <div className="col text-left">
                                          <span className="d-inline-block text-dark-grey">
                                            Confirmed
                                          </span>
                                        </div>
                                        <div className="col-auto text-left font-weight-semibold">
                                          <p></p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div
                                  className="mt-auto"
                                  style={{ marginTop: "5px !important" }}
                                >
                                  <a
                                    href="#"
                                    onClick={toggleGenerateDoc}
                                    className="btn btn-primary-lighter-2 font-weight-semibold btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center p-l-6 p-r-5"
                                    style={{ height: "25px", width: "255px" }}
                                  >
                                    <i className="ic ic-19 ic-generate-document m-r-5"></i>
                                    Generate Document
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* for notes  */}
                          <div
                            className="insuranceNotes"
                            // style={{ flexBasis: "56.1667%" }}
                          >
                            <div className="table-responsive table--no-card border-0 has-alternate-grey witness-col-table z1 overflow-hidden ">
                              <div
                                className=" w-100  cursor-pointer"
                                data-toggle="modal"
                                data-target="#individual_notes_modal"
                                onClick={toggleWitnessNotesModal}
                              >
                                {Array.from({ length: 12 }, (_, index) => (
                                  <div
                                    key={index}
                                    className="note-fake-row"
                                  ></div>
                                ))}
                              </div>
                              <p className="p-0 height-25 d-flex justify-content-center text-center text-white position-relative line-height-25">
                                {item?.insurance_type.name} Notes
                              </p>
                              <div className="insuranceNotes">
                                <table className="table table-borderless table-striped table-earning table-y-down1">
                                  <tbody className="tbody-panels">
                                    {witnessData?.notes?.map(
                                      (note, index) =>
                                        note?.entity_type === "Witness" && (
                                          <tr
                                            key={index}
                                            className=" cursor-pointer"
                                            onClick={() => {
                                              toggleWitnessNotesModal();
                                              setNotesData(note);
                                            }}
                                          >
                                            <td
                                              className="serial-number"
                                              style={{ width: "25px" }}
                                            >
                                              {index + 1}
                                            </td>
                                            <td className="td-autosize">
                                              {formatDate2(note?.created_at)}
                                            </td>
                                            <td className="td-autosize">
                                              {formatTime(note?.created_at)}
                                            </td>
                                            <td className="td-autosize">
                                              <div className="d-flex align-items-center">
                                                <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
                                                  {note?.created_by
                                                    ?.bp_attorneystaff_userprofile
                                                    ?.profile_pic_29p && (
                                                    <img
                                                      src={
                                                        note?.created_by
                                                          ?.bp_attorneystaff_userprofile
                                                          ?.profile_pic_29p
                                                      }
                                                      alt=""
                                                    />
                                                  )}
                                                </span>
                                                <span className="ml-2 text-black">
                                                  Witness
                                                </span>
                                                <span className="ml-2 text-black">
                                                  {note?.created_by?.first_name}{" "}
                                                  {note?.created_by?.last_name}
                                                </span>
                                              </div>
                                            </td>
                                            <td className="client_page_note_row color-white-space-word-wrap">
                                              {note.description}
                                            </td>
                                          </tr>
                                        )
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="row documents-wrapper m-b-15 ">
                        <div className="col-12 p-l-25 p-r-0 ">
                          <div className="m-r-15 background-main-10">
                            <h4 className="client-contact-title text-center d-flex justify-content-center align-items-center h-100">
                              Witness Quick-Access Document Row
                            </h4>
                          </div>
                          <div className="row no-gutters flex-row position-relative p-r-15">
                            <div className="col p-0">
                              <div className="d-flex justify-content-start w-100">
                                <div className="icon-text-boxes d-flex flex-wrap w-100 quick-doc-row">
                                  {sampleData7.map(
                                    (processed_page_slot, index) => (
                                      <div
                                        key={index}
                                        className="col-12 col-md-3 col-xl icon-text-box text-center"
                                        id={`no-vertical-border-${index}`}
                                        onClick={() =>
                                          docPreview(
                                            processed_page_slot.doc.id,
                                            ""
                                          )
                                        }
                                      >
                                        <p className="date">
                                          {processed_page_slot.doc.created}
                                        </p>
                                        <span className="icon-wrap">
                                          <i className="ic ic-35 ic-file-colored cursor-pointer"></i>
                                        </span>
                                        {processed_page_slot.page_slot
                                          .slot_name ? (
                                          <p className="name">
                                            {
                                              processed_page_slot.page_slot
                                                .slot_number
                                            }
                                            .{" "}
                                            {
                                              processed_page_slot.page_slot
                                                .slot_name
                                            }
                                          </p>
                                        ) : (
                                          <p className="name">
                                            {
                                              processed_page_slot.page_slot
                                                .slot_number
                                            }
                                            .{" "}
                                            {processed_page_slot.doc.file_name}
                                          </p>
                                        )}
                                      </div>
                                    )
                                  )}
                                </div>
                                <div className="upload-icon-wrap">
                                  <div className="upload-icon">
                                    <i className="ic ic-64 ic-upload-document cursor-pointer"></i>
                                    To Page
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ))
                )}
              </div>
            </div>
          </div>
          <NotesSectionDashboard />
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default WitnessesPage;
{
  /* <div className="row documents-wrapper m-b-15">
                      <div className="col-12">
                        <div className="m-r-15 background-main-10">
                          <h4 className="client-contact-title text-center d-flex justify-content-center align-items-center h-100">
                            Witness Quick-Access Document Row
                          </h4>
                        </div>
                        <div className="row no-gutters flex-row position-relative p-r-15">
                          <div className="col p-0">
                            <div className="d-flex justify-content-start w-100">
                              <div className="icon-text-boxes d-flex flex-wrap w-100 quick-doc-row">
                                {sampleData7.map(
                                  (processed_page_slot, index) => (
                                    <div
                                      key={index}
                                      className="col-12 col-md-3 col-xl icon-text-box text-center"
                                      id={`no-vertical-border-${index}`}
                                      onClick={() =>
                                        docPreview(
                                          processed_page_slot.doc.id,
                                          ""
                                        )
                                      }
                                    >
                                      <p className="date">
                                        {processed_page_slot.doc.created}
                                      </p>
                                      <span className="icon-wrap">
                                        <i className="ic ic-35 ic-file-colored cursor-pointer"></i>
                                      </span>
                                      {processed_page_slot.page_slot
                                        .slot_name ? (
                                        <p className="name">
                                          {
                                            processed_page_slot.page_slot
                                              .slot_number
                                          }
                                          .{" "}
                                          {
                                            processed_page_slot.page_slot
                                              .slot_name
                                          }
                                        </p>
                                      ) : (
                                        <p className="name">
                                          {
                                            processed_page_slot.page_slot
                                              .slot_number
                                          }
                                          . {processed_page_slot.doc.file_name}
                                        </p>
                                      )}
                                    </div>
                                  )
                                )}
                              </div>
                              <div className="upload-icon-wrap">
                                <div className="upload-icon">
                                  <i className="ic ic-64 ic-upload-document cursor-pointer"></i>
                                  To Page
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
              {/*Insurance section */
}
{
  /* <div class="border-box has-checklist rounded-0  mr-15 m-t-5 ">
                <div class="checklist-section-wrapper position-absolute top-0 right-0 z-index-9">
                  <div class="skew-box"></div>
                  <div className="checklist-section">
                    <div className="dropdown">
                      <button
                        className="dropdown-toggle text-darker d-flex align-items-center justify-content-end w-100"
                        type="button"
                        id={`myDropdown${clientProviderId}`}
                        data-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <div className="nt-box sub-gauge">
                          {Object.entries(
                            insuranceChecklistPanelPercentage
                          ).map(([key, value]) => {
                            return (
                              <div
                                className="circlechart"
                                data-percentage={value}
                              ></div>
                            );
                          })}
                        </div>
                        <span className="d-flex align-items-center">
                          <span className="ic has-no-after ic-check text-success d-flex align-items-center justify-content-center">
                            <svg
                              width="17"
                              height="50"
                              viewBox="0 0 17 50"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M0 25.5923L2.16281 23.2528L6.69618 27.4438L14.5501 18L17 20.0372L6.99858 32.0626L0 25.5923Z"
                                fill="currentColor"
                              />
                            </svg>
                          </span>
                          <span className="checklist-text">
                            Insurance
                            <br />
                            Checklist
                          </span>
                          <span className="ic has-no-after ic-arrow text-white d-flex align-items-center justify-content-center">
                            <svg
                              width="17"
                              height="50"
                              viewBox="0 0 17 50"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M0 16H4.59998L8.5 19.95L12.4 16H17L8.5 24.55L0 16Z"
                                fill="currentColor"
                              />
                              <path
                                d="M0 25.4512H4.59998L8.5 29.4012L12.4 25.4512H17L8.5 34.0012L0 25.4512Z"
                                fill="currentColor"
                              />
                            </svg>
                          </span>
                        </span>
                      </button>

                      <div
                        className="dropdown-menu dropdown-menu-right dropdown-content"
                        id="insurance-dropdown-width"
                        aria-labelledby={`myDropdown${clientProviderId}`}
                      >
                        {insuranceFinalChecklist.map((checklist) => (
                          <div className="checkbox-line" key={checklist.id}>
                            {checklist.status ? (
                              <input
                                type="checkbox"
                                // onClick={() => location.href={`{% url 'bp-uncheckChecklist' checklist.id ${clientId} ${caseId} %}`}}
                                checked
                                id={`medicalcheck${checklist.id}`}
                                name={`medicalcheck${checklist.id}`}
                              />
                            ) : (
                              <input
                                type="checkbox"
                                // onClick={() => location.href={`{% url 'bp-markChecklist' checklist.id ${clientId} ${caseId} %}`}}
                                id={`medicalcheck${checklist.id}`}
                                name={`medicalcheck${checklist.id}`}
                              />
                            )}
                            <label htmlFor={`medicalcheck${checklist.id}`}>
                              {checklist.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row no-gutters has-title-bg m-b-5 flex-nowrap">
                  <div class="col-auto p-0">
                    <div class="panel-icon">
                      <i class="ic ic-insurance ic-25"></i>
                    </div>
                    <div class="top-header height-25 d-flex">
                      <div class="top-head d-flex align-items-center">
                        <div class="d-flex align-items-center">
                          <h2 class="d-flex align-items-center">
                            <small class="font-weight-bold">
                              Health Insurance
                            </small>
                            <span
                              class="font-weight-normal ms-2 me-2"
                              id="for-defendant"
                            >
                              for Witness
                            </span>
                            <small class="font-weight-bold">John Doe</small>
                          </h2>
                        </div>
                      </div>
                    </div>
                    <div class="row no-gutters equal-column-wrapper position-relative panels-direction-column def-col-pans-2">
                      <div class="d-flex">
                        <div class="dynamic-width col-auto d-flex flex-column p-0 p-r-5 width-250 flex-g-1">
                          <div className="information-wrapper">
                            <div
                              data-toggle="modal"
                              data-target="#editinsurance_contact_modal"
                              onClick={() =>
                                insurance_contact_modal(insurance.id)
                              }
                              data-id={insurance.id}
                              data-coverage={insurance.insurance_type.id}
                              data-block="Insurance Company"
                              data-name={insurance.company_contact.name}
                              data-firstname={
                                insurance.company_contact.first_name
                              }
                              data-lastname={
                                insurance.company_contact.last_name
                              }
                              data-add1={insurance.company_contact.address1}
                              data-add2={insurance.company_contact.address2}
                              data-city={insurance.company_contact.city}
                              data-state={insurance.company_contact.state}
                              data-zip={insurance.company_contact.zip}
                              data-phone={
                                insurance.company_contact.phone_number
                              }
                              data-fax={insurance.company_contact.fax}
                              data-email={insurance.company_contact.email}
                            >
                              <div className="text-left p-l-5 p-r-5">
                                <p className="columnsTitle text-primary text-center font-weight-semibold text-uppercase">
                                  INSURANCE COMPANY
                                </p>
                                <p className="columnsTitle">
                                  {insurance.company_contact.name ? (
                                    insurance.company_contact.name
                                  ) : (
                                    <span className="text-primary-20">
                                      Company Name
                                    </span>
                                  )}
                                </p>
                                <div>
                                  <p className="colFont info_phone_number text-black">
                                    {insurance.company_contact.address1 ? (
                                      `${insurance.company_contact.address1},`
                                    ) : (
                                      <span className="text-primary-20">
                                        Address
                                      </span>
                                    )}
                                    {insurance.company_contact.address2}
                                  </p>
                                  <p className="colFont info_fax">
                                    {insurance.company_contact.city ? (
                                      `${insurance.company_contact.city},`
                                    ) : (
                                      <span className="text-primary-20">
                                        City
                                      </span>
                                    )}
                                    {insurance.company_contact.state ? (
                                      insurance.company_contact.state
                                    ) : (
                                      <span className="text-primary-20">
                                        State
                                      </span>
                                    )}
                                    {insurance.company_contact.zip ? (
                                      insurance.company_contact.zip
                                    ) : (
                                      <span className="text-primary-20">
                                        Zip
                                      </span>
                                    )}
                                  </p>
                                </div>
                                <p className="colFont info_phone_number text-black">
                                  {insurance.company_contact.phone_number ? (
                                    <>
                                      <small>(</small>
                                      {insurance.company_contact.phone_number.slice(
                                        0,
                                        3
                                      )}
                                      <small>)</small>
                                      {insurance.company_contact.phone_number.slice(
                                        3,
                                        6
                                      )}
                                      -
                                      {insurance.company_contact.phone_number.slice(
                                        6
                                      )}
                                    </>
                                  ) : (
                                    <span className="text-primary-20">
                                      (###) ###-####
                                    </span>
                                  )}
                                </p>
                                <p className="colFont info_fax">
                                  {insurance.company_contact.fax ? (
                                    <>
                                      <small>(</small>
                                      {insurance.company_contact.fax.slice(
                                        0,
                                        3
                                      )}
                                      <small>)</small>
                                      {insurance.company_contact.fax.slice(
                                        3,
                                        6
                                      )}
                                      -{insurance.company_contact.fax.slice(6)}
                                      <small className="ml-2 text-grey">
                                        fax
                                      </small>
                                    </>
                                  ) : (
                                    <span className="text-primary-20">
                                      (###) ###-####
                                    </span>
                                  )}
                                </p>
                              </div>
                            </div>
                            {insurance.company_contact.email ? (
                              <a
                                href="#"
                                className="btn btn-primary-lighter font-weight-semibold btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center info_email m-b-5 p-l-6 p-r-6"
                              >
                                <i className="ic ic-19 ic-email-3d m-r-5"></i>
                                {insurance.company_contact.email}
                              </a>
                            ) : (
                              <a
                                href="#"
                                className="btn btn-primary-lighter font-weight-semibold btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center info_email m-b-5 p-l-6 p-r-6"
                              >
                                <i className="ic ic-19 ic-email-3d m-r-5"></i>
                              </a>
                            )}
                          </div>
                          <div className="mt-auto">
                            <a
                              href="#"
                              //   onClick={() => TemplatePopUp(defendantId)}
                              className="btn btn-primary-lighter font-weight-semibold btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center p-l-6 p-r-5"
                            >
                              <i className="ic ic-19 ic-generate-document m-r-5"></i>
                              Generate Document
                            </a>
                          </div>
                        </div>
                        <div className="dynamic-width col-auto d-flex flex-column p-0 p-r-5 width-250 flex-g-1">
                          <div className="information-wrapper">
                            <div
                              data-toggle="modal"
                              data-target="#editinsurance_contact_modal"
                              onClick={handleClick}
                              data-id={insurance2.id}
                              data-block="Insurance Adjuster"
                              data-name={insurance2.adjuster.name}
                              data-firstname={insurance2.adjuster.first_name}
                              data-lastname={insurance2.adjuster.last_name}
                              data-add1={insurance2.adjuster.address1}
                              data-add2={insurance2.adjuster.address2}
                              data-city={insurance2.adjuster.city}
                              data-state={insurance2.adjuster.state}
                              data-zip={insurance2.adjuster.zip}
                              data-phone={insurance2.adjuster.phone_number}
                              data-fax={insurance2.adjuster.fax}
                              data-email={insurance2.adjuster.email}
                            >
                              <div className="text-left p-l-5 p-r-5">
                                <p className="columnsTitle text-primary text-center font-weight-semibold text-uppercase">
                                  ADJUSTER
                                </p>
                                <p className="columnsTitle">
                                  {insurance2.adjuster.first_name
                                    ? `${insurance2.adjuster.first_name} ${insurance2.adjuster.last_name}`
                                    : insurance2.adjuster.name || (
                                        <span className="text-primary-20">
                                          Adjuster Name
                                        </span>
                                      )}
                                </p>
                                <div>
                                  <p className="colFont info_phone_number text-black">
                                    {insurance2.adjuster.address1 ? (
                                      `${insurance2.adjuster.address1},`
                                    ) : (
                                      <span className="text-primary-20">
                                        Address
                                      </span>
                                    )}{" "}
                                    {insurance2.adjuster.address2}
                                  </p>
                                  <p className="colFont info_fax">
                                    {insurance2.adjuster.city ? (
                                      `${insurance2.adjuster.city},`
                                    ) : (
                                      <span className="text-primary-20">
                                        City
                                      </span>
                                    )}{" "}
                                    {insurance2.adjuster.state || (
                                      <span className="text-primary-20">
                                        State
                                      </span>
                                    )}{" "}
                                    {insurance2.adjuster.zip || (
                                      <span className="text-primary-20">
                                        Zip
                                      </span>
                                    )}
                                  </p>
                                </div>
                                <p className="colFont info_phone_number text-black">
                                  {insurance2.adjuster.phone_number ? (
                                    <>
                                      <small>(</small>
                                      {insurance2.adjuster.phone_number.slice(
                                        0,
                                        3
                                      )}
                                      <small>)</small>{" "}
                                      {insurance2.adjuster.phone_number.slice(
                                        3,
                                        6
                                      )}
                                      -
                                      {insurance2.adjuster.phone_number.slice(
                                        6
                                      )}
                                    </>
                                  ) : (
                                    <span className="text-primary-20">
                                      (###) ###-####
                                    </span>
                                  )}
                                </p>
                                <p className="colFont info_fax">
                                  {insurance2.adjuster.fax ? (
                                    <>
                                      <small>(</small>
                                      {insurance2.adjuster.fax.slice(0, 3)}
                                      <small>)</small>{" "}
                                      {insurance2.adjuster.fax.slice(3, 6)}-
                                      {insurance2.adjuster.fax.slice(6)}
                                      <small className="ml-2 text-grey">
                                        fax
                                      </small>
                                    </>
                                  ) : (
                                    <span className="text-primary-20">
                                      (###) ###-####
                                    </span>
                                  )}
                                </p>
                              </div>
                            </div>
                            {insurance2.adjuster.email ? (
                              <a
                                href="#"
                                className="btn btn-primary-lighter font-weight-semibold btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center info_email m-b-5 p-l-6 p-r-6"
                              >
                                <i className="ic ic-19 ic-email-3d m-r-5"></i>
                                {insurance2.adjuster.email}
                              </a>
                            ) : (
                              <a
                                href="#"
                                className="btn btn-primary-lighter font-weight-semibold btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center info_email m-b-5 p-l-6 p-r-6"
                              >
                                <i className="ic ic-19 ic-email-3d m-r-5"></i>
                              </a>
                            )}
                          </div>
                          <div className="mt-auto">
                            <a
                              href="#"
                              onClick={() =>
                                templatePopUp(
                                  "",
                                  defendant.id,
                                  "",
                                  "",
                                  "",
                                  "",
                                  "",
                                  12
                                )
                              }
                              className="btn btn-primary-lighter font-weight-semibold btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center"
                            >
                              <i className="ic ic-19 ic-generate-document m-r-5"></i>
                              Generate Document
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="d-flex">
                        <div className="dynamic-width col-auto d-flex flex-column p-0 p-r-5 width-250 flex-g-1">
                          <div className="information-wrapper">
                            <div
                              data-toggle="modal"
                              data-target="#editinsurance_contact_modal"
                              onClick={handleClick}
                              data-id={insurance.id}
                              data-block="Insurance Claim Supervisor"
                              data-name={insurance.supervisor.name}
                              data-firstname={insurance.supervisor.first_name}
                              data-lastname={insurance.supervisor.last_name}
                              data-add1={insurance.supervisor.address1}
                              data-add2={insurance.supervisor.address2}
                              data-city={insurance.supervisor.city}
                              data-state={insurance.supervisor.state}
                              data-zip={insurance.supervisor.zip}
                              data-phone={insurance.supervisor.phone_number}
                              data-fax={insurance.supervisor.fax}
                              data-email={insurance.supervisor.email}
                            >
                              <div className="text-left p-l-5 p-r-5 ">
                                <p className="columnsTitle text-primary text-center font-weight-semibold text-uppercase">
                                  supervisor
                                </p>
                                <p className="columnsTitle">
                                  {insurance.supervisor.first_name
                                    ? `${insurance.supervisor.first_name} ${insurance.supervisor.last_name}`
                                    : insurance.supervisor.name || (
                                        <span className="text-primary-20">
                                          Supervisor Name
                                        </span>
                                      )}
                                </p>
                                <div>
                                  <p className="colFont info_phone_number text-black">
                                    {insurance.supervisor.address1 ? (
                                      `${insurance.supervisor.address1},`
                                    ) : (
                                      <span className="text-primary-20">
                                        Address
                                      </span>
                                    )}{" "}
                                    {insurance.supervisor.address2}
                                  </p>
                                  <p className="colFont info_fax">
                                    {insurance.supervisor.city ? (
                                      `${insurance.supervisor.city},`
                                    ) : (
                                      <span className="text-primary-20">
                                        City
                                      </span>
                                    )}{" "}
                                    {insurance.supervisor.state || (
                                      <span className="text-primary-20">
                                        State
                                      </span>
                                    )}{" "}
                                    {insurance.supervisor.zip || (
                                      <span className="text-primary-20">
                                        Zip
                                      </span>
                                    )}
                                  </p>
                                </div>
                                <p className="colFont info_phone_number text-black">
                                  {insurance.supervisor.phone_number ? (
                                    <>
                                      <small>(</small>
                                      {insurance.supervisor.phone_number.slice(
                                        0,
                                        3
                                      )}
                                      <small>)</small>{" "}
                                      {insurance.supervisor.phone_number.slice(
                                        3,
                                        6
                                      )}
                                      -
                                      {insurance.supervisor.phone_number.slice(
                                        6
                                      )}
                                    </>
                                  ) : (
                                    <span className="text-primary-20">
                                      (###) ###-####
                                    </span>
                                  )}
                                </p>
                                <p className="colFont info_fax">
                                  {insurance.supervisor.fax ? (
                                    <>
                                      <small>(</small>
                                      {insurance.supervisor.fax.slice(0, 3)}
                                      <small>)</small>{" "}
                                      {insurance.supervisor.fax.slice(3, 6)}-
                                      {insurance.supervisor.fax.slice(6)}
                                      <small className="ml-2 text-grey">
                                        fax
                                      </small>
                                    </>
                                  ) : (
                                    <span className="text-primary-20">
                                      (###) ###-####
                                    </span>
                                  )}
                                </p>
                              </div>
                            </div>
                            {insurance.supervisor.email ? (
                              <a
                                href="#"
                                className="btn btn-primary-lighter font-weight-semibold btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center info_email m-b-5 p-l-6 p-r-6"
                              >
                                <i className="ic ic-19 ic-email-3d m-r-5"></i>
                                {insurance.supervisor.email}
                              </a>
                            ) : (
                              <a
                                href="#"
                                className="btn btn-primary-lighter font-weight-semibold btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center info_email m-b-5 p-l-6 p-r-6"
                              >
                                <i className="ic ic-19 ic-email-3d m-r-5"></i>
                              </a>
                            )}
                          </div>
                          <div className="mt-auto">
                            <a
                              href="#"
                              onClick={() =>
                                templatePopUp(
                                  "",
                                  defendant.id,
                                  "",
                                  "",
                                  "",
                                  "",
                                  "",
                                  13
                                )
                              }
                              className="btn btn-primary-lighter font-weight-semibold btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center"
                            >
                              <i className="ic ic-19 ic-generate-document m-r-5"></i>
                              Generate Document
                            </a>
                          </div>
                        </div>
                        <div className="dynamic-width col-auto d-flex flex-column p-0 p-r-5 width-250 flex-g-1">
                          <div className="information-wrapper">
                            <div
                              data-toggle="modal"
                              data-target="#editinsurance_information_modal"
                              onClick={handleClick}
                              data-id={insuranceData.id}
                              //   data-coverage={
                              //     insuranceData?.insuranceData_type.id
                              //   }
                              //   data-liability={insuranceData.liabilityLimit}
                              data-liabilityall={
                                insuranceData.liabilityLimitAll
                              }
                              data-policy_number={insuranceData.policy_number}
                              data-claim_number={insuranceData.claim_number}
                              data-confirmed_date={
                                insuranceData.Dateconfirmedactive
                              }
                            >
                              <div className="text-left p-l-5 p-r-5">
                                <p className="columnsTitle text-primary text-center font-weight-semibold text-uppercase">
                                  CLAIM INFORMATION
                                </p>
                                <div className="row mb-0 colFont">
                                  <div className="col text-left">
                                    <span className="d-inline-block text-dark-grey">
                                      Type
                                    </span>
                                  </div>
                                  <div className="col-auto text-left font-weight-semibold">
                                    <p>{insuranceData.insurance_type.name}</p>
                                  </div>
                                </div>

                                <div className="row mb-0 colFont">
                                  <div className="col text-left">
                                    <span className="d-inline-block text-dark-grey">
                                      Policy
                                    </span>
                                  </div>
                                  <div className="col-auto text-left font-weight-semibold">
                                    <p>{insuranceData.policy_number}</p>
                                  </div>
                                </div>
                                <div className="row mb-0 colFont">
                                  <div className="col text-left">
                                    <span className="d-inline-block text-dark-grey">
                                      Claim
                                    </span>
                                  </div>
                                  <div className="col-auto text-left font-weight-semibold">
                                    <p>{insuranceData.claim_number}</p>
                                  </div>
                                </div>
                                <div className="row mb-0 colFont">
                                  <div className="col text-left">
                                    <span className="d-inline-block text-dark-grey">
                                      Limits
                                    </span>
                                  </div>
                                  <div className="col-auto text-left font-weight-semibold">
                                    <p>
                                      ${" "}
                                      {insuranceData.liabilityLimit
                                        ? insuranceData.liabilityLimit.toLocaleString()
                                        : 0}{" "}
                                      / ${" "}
                                      {insuranceData.liabilityLimitAll
                                        ? insuranceData.liabilityLimitAll.toLocaleString()
                                        : 0}{" "}
                                    </p>
                                  </div>
                                </div>
                                <div className="row mb-0 colFont">
                                  <div className="col text-left">
                                    <span className="d-inline-block text-dark-grey">
                                      Confirmed
                                    </span>
                                  </div>
                                  <div className="col-auto text-left font-weight-semibold">
                                    <p>
                                      {new Date(
                                        insuranceData.Dateconfirmedactive
                                      ).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex-1 p-0 position-relative z-index-1">
                    <div
                      className="fields-wrap overflow-hidden h-100"
                      data-toggle="modal"
                      data-target="#individual_notes_modal"
                      onClick={() =>
                        show_notes(
                          this,
                          `${insurance11.model_name.title}${insurance11.id}`,
                          `${insurance11.model_name.title}`,
                          `${insurance11.id}`,
                          "Insurance"
                        )
                      }
                    >
                      <div
                        className="tab-pane"
                        id="custom-nav-todo"
                        role="tabpanel"
                        aria-labelledby="custom-nav-todo-tab"
                      >
                        <div className="col-lg-12">
                          <div className="row">
                            <div className="table-responsive table--no-card border-0 has-alternate-grey def-col-table-2 overflow-hidden p-r-15">
                              <div className="note-fake-rows w-100 p-r-15">
                                <div className="note-fake-row"></div>
                                <div className="note-fake-row"></div>
                                <div className="note-fake-row"></div>
                                <div className="note-fake-row"></div>
                                <div className="note-fake-row"></div>
                                <div className="note-fake-row"></div>
                                <div className="note-fake-row"></div>
                                <div className="note-fake-row"></div>
                                <div className="note-fake-row"></div>
                                <div className="note-fake-row"></div>
                                <div className="note-fake-row"></div>
                                <div className="note-fake-row"></div>
                              </div>
                              <p className="p-0 height-25 d-flex justify-content-center text-center text-white line-height-25 margin-right-206">
                                {insurance11.insurance_type.name} Notes
                              </p>
                              <table className="table table-borderless table-striped table-earning table-y-down1">
                                <tbody className="tbody-panels">
                                  {notes11.map((note, index) => {
                                    if (
                                      note.category.name === "Insurance" ||
                                      note.category.name ===
                                        "Update Case Status" ||
                                      note.category.name === "Critical"
                                    ) {
                                      if (
                                        note.entity_type ===
                                          insurance11.model_name.title &&
                                        note.record_id === insurance11.id
                                      ) {
                                        return (
                                          <tr key={index}>
                                            <td className="td-autosize serial-number">
                                              {note_counter}
                                            </td>
                                            <td className="td-autosize">
                                              {note.created_at.toLocaleDateString(
                                                "en-US"
                                              )}
                                            </td>
                                            <td className="td-autosize">
                                              {note.created_at.toLocaleTimeString(
                                                "en-US"
                                              )}
                                            </td>
                                            <td className="td-autosize">
                                              <div className="d-flex align-items-center">
                                                <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
                                                  {note.created_by_v1
                                                    .profile_pic ? (
                                                    <img
                                                      src={
                                                        note.created_by_v1
                                                          .profile_pic.url
                                                      }
                                                      alt=""
                                                      className=""
                                                    />
                                                  ) : null}
                                                </span>
                                                <span className="ml-2 text-black">
                                                  {note.created_by.first_name}{" "}
                                                  {note.created_by.last_name}
                                                </span>
                                              </div>
                                            </td>
                                            <td className="client_page_note_row color-white-space-word-wrap">
                                              {note.entity_type &&
                                              note.record_id
                                                ? `${note.entity_type} Note: `
                                                : null}{" "}
                                              {note.description}
                                            </td>
                                          </tr>
                                        );
                                      }
                                    }
                                    return null;
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row documents-wrapper">
                  <div className="col-12">
                    <div className="m-r-15 background-main-10 height-25">
                      <h4 className="client-contact-title text-center height-25 d-flex justify-content-center align-items-center">
                        {insuranceType} Quick-Access Document Row
                      </h4>
                    </div>
                    <div className="row no-gutters flex-row position-relative p-r-15">
                      <div className="col p-0">
                        <div className="d-flex justify-content-start w-100">
                          <div className="icon-text-boxes d-flex flex-wrap w-100 quick-doc-row">
                            {insurancePageSlots.map(
                              (processedPageSlot) =>
                                processedPageSlot.insuranceId ===
                                  insurance.id &&
                                (processedPageSlot.doc ? (
                                  <div
                                    key={processedPageSlot.doc.id}
                                    className="col-12 col-md-3 col-xl icon-text-box text-center"
                                    id="no-vertical-border"
                                    onClick={() =>
                                      docPreview(processedPageSlot.doc.id, "")
                                    }
                                  >
                                    <p className="date">
                                      {processedPageSlot.doc.created}
                                    </p>
                                    <span className="icon-wrap">
                                      <i className="ic ic-35 ic-file-colored cursor-pointer"></i>
                                    </span>
                                    <p className="name">
                                      {processedPageSlot.pageSlot.slotNumber}.{" "}
                                      {processedPageSlot.pageSlot.slotName ||
                                        processedPageSlot.doc.fileName}
                                    </p>
                                  </div>
                                ) : (
                                  <div
                                    key={processedPageSlot.pageSlot.id}
                                    className={`col-12 col-md-3 col-xl icon-text-box text-center dropzone-${processedPageSlot.pageSlot.id}-${insurance.id}-${processedPageSlot.pageSlot.pageId}`}
                                    id="no-vertical-border"
                                    onClick={() =>
                                      uploadPopUp(
                                        processedPageSlot.pageSlot.id,
                                        insurance.id,
                                        processedPageSlot.pageSlot.pageId
                                      )
                                    }
                                  >
                                    <p className="date"></p>
                                    <span className="icon-wrap">
                                      <i className="ic ic-35 ic-custom-icon-cloud-2 cursor-pointer"></i>
                                    </span>
                                    <p className="name text-lg-grey">
                                      {processedPageSlot.pageSlot.slotNumber}.{" "}
                                      {processedPageSlot.pageSlot.slotName
                                        ? processedPageSlot.pageSlot.slotName
                                        : "Available"}
                                    </p>
                                  </div>
                                ))
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div> */
}

{
  /* OPPOSING COUNSEL */
}
{
  /* <div class="border-box has-checklist rounded-0 mr-15 m-t-5 ">
                <div class="checklist-section-wrapper position-absolute top-0 right-0 z-index-9">
                  <div class="skew-box"></div>
                  <div className="checklist-section">
                    <button
                      className="dropdown-toggle text-darker d-flex align-items-center justify-content-end w-100"
                      id={`myDropdown${clientProviderId}`}
                      type="button"
                      data-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {Object.entries(checklistPanelPercentage).map(
                        ([key, value]) => {
                          if (key === opposingCounsel.id) {
                            return (
                              <div
                                className="circlechart"
                                data-percentage={value}
                              ></div>
                            );
                          }
                        }
                      )}
                      <span className="d-flex align-items-center">
                        <span className="ic has-no-after ic-check text-success d-flex align-items-center justify-content-center">
                          <svg
                            width="17"
                            height="50"
                            viewBox="0 0 17 50"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M0 25.5923L2.16281 23.2528L6.69618 27.4438L14.5501 18L17 20.0372L6.99858 32.0626L0 25.5923Z"
                              fill="currentColor"
                            />
                          </svg>
                        </span>
                        <span className="checklist-text">
                          {page.name} <br />
                          Checklist
                        </span>
                        <span className="ic has-no-after ic-arrow text-white d-flex align-items-center justify-content-center">
                          <svg
                            width="17"
                            height="50"
                            viewBox="0 0 17 50"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M0 16H4.59998L8.5 19.95L12.4 16H17L8.5 24.55L0 16Z"
                              fill="currentColor"
                            />
                            <path
                              d="M0 25.4512H4.59998L8.5 29.4012L12.4 25.4512H17L8.5 34.0012L0 25.4512Z"
                              fill="currentColor"
                            />
                          </svg>
                        </span>
                      </span>
                    </button>

                    <div
                      aria-labelledby={`myDropdown${clientProviderId}`}
                      className="dropdown-menu dropdown-menu-right dropdown-content"
                      id="insurance-dropdown-width"
                    >
                      {finalChecklist.map((checklist) => (
                        <div className="checkbox-line" key={checklist.id}>
                          <input
                            type="checkbox"
                            onClick={() => {
                              const url = checklist.status
                                ? `{% url 'bp-uncheckChecklist' ${checklist.id} client.id case.id %}`
                                : `{% url 'bp-markChecklist' ${checklist.id} client.id case.id %}`;
                              location.href = url;
                            }}
                            checked={checklist.status}
                            id={`medicalcheck${checklist.id}`}
                            name={`medicalcheck${checklist.id}`}
                          />
                          <label htmlFor={`medicalcheck${checklist.id}`}>
                            {checklist.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div class="row no-gutters has-title-bg m-b-5 flex-nowrap">
                  <div class="col-auto p-0">
                    <div class="panel-icon">
                      <i class="ic ic-insurance ic-25"></i>
                    </div>

                    <div className="top-header height-25 d-flex">
                      <div className="top-head d-flex align-items-center">
                        <div className="d-flex align-items-center">
                          <h2 className="d-flex align-items-center">
                            <small className="font-weight-bold">
                              {opposingCounsel.opposingCounselContact.name}
                            </small>
                            <span className="font-weight-normal ml-2 mr-2">
                              |
                            </span>
                          </h2>
                          <p>
                            {opposingCounsel.opposingCounselContact.website}
                          </p>
                          <span className="font-weight-normal ml-2 mr-2">
                            |
                          </span>
                          <p>
                            {
                              opposingCounsel.forClient.createdBy
                                .attorneyProfile.user.username
                            }
                          </p>
                          <span className="font-weight-normal ml-2 mr-2">
                            |
                          </span>
                          <p>{opposingCounsel.fileNumber}</p>
                          <span className="font-weight-normal ml-2 mr-2">
                            |
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="row no-gutters equal-column-wrapper position-relative panels-direction-column def-col-pans-3">
                      <div class="dynamic-width col-auto d-flex flex-column p-0 p-r-5 width-250 flex-g-1">
                        <div class="information-wrapper">
                          <div
                            data-toggle="modal"
                            data-target="#editcounsel_contact_modal"
                            // onClick={handleModalClick}
                            data-id={opposingCounsel.id}
                            data-block="firm_block"
                            data-name={
                              opposingCounsel.opposingCounselContact.name
                            }
                            data-add1={
                              opposingCounsel.opposingCounselContact.address1
                            }
                            data-add2={
                              opposingCounsel.opposingCounselContact.address2
                            }
                            data-city={
                              opposingCounsel.opposingCounselContact.city
                            }
                            data-state={
                              opposingCounsel.opposingCounselContact.state
                            }
                            data-zip={
                              opposingCounsel.opposingCounselContact.zip
                            }
                            data-phone={
                              opposingCounsel.opposingCounselContact
                                .phone_number
                            }
                            data-fax={
                              opposingCounsel.opposingCounselContact.fax
                            }
                            data-email={
                              opposingCounsel.opposingCounselContact.email
                            }
                            className="text-left p-l-5 p-r-5"
                          >
                            <p className="columnsTitle text-primary text-center font-weight-semibold text-uppercase">
                              opposing counsel
                            </p>
                            <p className="columnsTitle">
                              {opposingCounsel.opposingCounselContact.name ? (
                                opposingCounsel.opposingCounselContact.name
                              ) : (
                                <span className="text-primary-20">
                                  Opposing Counsel Name
                                </span>
                              )}
                            </p>
                            <div>
                              <p className="colFont info_phone_number text-black">
                                {opposingCounsel.opposingCounselContact
                                  .address1 ? (
                                  opposingCounsel.opposingCounselContact
                                    .address1 + ", "
                                ) : (
                                  <span className="text-primary-20">
                                    Address
                                  </span>
                                )}
                                {
                                  opposingCounsel.opposingCounselContact
                                    .address2
                                }
                              </p>
                              <p className="colFont info_fax">
                                {opposingCounsel.opposingCounselContact.city ? (
                                  opposingCounsel.opposingCounselContact.city +
                                  ", "
                                ) : (
                                  <span className="text-primary-20">City</span>
                                )}
                                {opposingCounsel.opposingCounselContact
                                  .state ? (
                                  opposingCounsel.opposingCounselContact.state
                                ) : (
                                  <span className="text-primary-20">State</span>
                                )}
                                {opposingCounsel.opposingCounselContact.zip ? (
                                  opposingCounsel.opposingCounselContact.zip
                                ) : (
                                  <span className="text-primary-20">Zip</span>
                                )}
                              </p>
                            </div>
                            <p className="colFont info_phone_number text-black">
                              {opposingCounsel.opposingCounselContact
                                .phone_number ? (
                                `(${opposingCounsel.opposingCounselContact.phone_number.slice(0, 3)}) ${opposingCounsel.opposingCounselContact.phone_number.slice(3, 6)}-${opposingCounsel.opposingCounselContact.phone_number.slice(6)}`
                              ) : (
                                <span className="text-primary-20">
                                  (###) ###-####
                                </span>
                              )}
                            </p>
                            <p className="colFont info_fax">
                              {opposingCounsel.opposingCounselContact.fax ? (
                                `(${opposingCounsel.opposingCounselContact.fax.slice(0, 3)}) ${opposingCounsel.opposingCounselContact.fax.slice(3, 6)}-${opposingCounsel.opposingCounselContact.fax.slice(6)} fax`
                              ) : (
                                <span className="text-primary-20">
                                  (###) ###-####
                                </span>
                              )}
                            </p>
                          </div>
                          {opposingCounsel?.opposingCounselContact.email ? (
                            <a
                              href="#"
                              className="btn btn-primary-lighter font-weight-semibold btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center info_email m-b-5 p-l-6 p-r-6"
                            >
                              <i className="ic ic-19 ic-email-3d m-r-5"></i>
                              {opposingCounsel?.opposingCounselContact.email}
                            </a>
                          ) : (
                            <a
                              href="#"
                              className="btn btn-primary-lighter font-weight-semibold btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center info_email m-b-5 p-l-6 p-r-6"
                            >
                              <i className="ic ic-19 ic-email-3d m-r-5"></i>
                            </a>
                          )}
                        </div>
                        <div className="mt-auto">
                          <a
                            href="#"
                            onClick={() =>
                              templatePopUp(
                                "",
                                `${defendant.id}`,
                                "",
                                "",
                                "",
                                "",
                                ""
                              )
                            }
                            className="btn btn-primary-lighter font-weight-semibold btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center"
                          >
                            <i className="ic ic-19 ic-generate-document m-r-5"></i>
                            Generate Document
                          </a>
                        </div>
                      </div>
                      <div className="dynamic-width col-auto d-flex flex-column p-0 p-r-5 width-250 flex-g-1">
                        <div className="information-wrapper">
                          <div
                            data-toggle="modal"
                            data-target="#editcounsel_contact_modal"
                            onClick={counselContactModal}
                            data-id={opposingcounsel.id}
                            data-block="opposingattorney_block"
                            data-name={opposingcounsel.opposingattorney.name}
                            data-add1={
                              opposingcounsel.opposingattorney.address1
                            }
                            data-add2={
                              opposingcounsel.opposingattorney.address2
                            }
                            data-city={opposingcounsel.opposingattorney.city}
                            data-state={opposingcounsel.opposingattorney.state}
                            data-zip={opposingcounsel.opposingattorney.zip}
                            data-phone={
                              opposingcounsel.opposingattorney.phone_number
                            }
                            data-fax={opposingcounsel.opposingattorney.fax}
                            data-email={opposingcounsel.opposingattorney.email}
                          >
                            <div className="text-left p-l-5 p-r-5">
                              <p className="columnsTitle text-primary text-center font-weight-semibold text-uppercase">
                                opposing attorney
                              </p>
                              <p className="columnsTitle">
                                {opposingcounsel.opposingattorney.name ? (
                                  opposingcounsel.opposingattorney.name
                                ) : (
                                  <span className="text-primary-20">
                                    Opposing Attorney Name
                                  </span>
                                )}
                              </p>
                              <div>
                                <p className="colFont info_phone_number text-black">
                                  {opposingcounsel.opposingattorney.address1 ? (
                                    `${opposingcounsel.opposingattorney.address1}, `
                                  ) : (
                                    <span className="text-primary-20">
                                      Address
                                    </span>
                                  )}
                                  {opposingcounsel.opposingattorney.address2}
                                </p>
                                <p className="colFont info_fax">
                                  {opposingcounsel.opposingattorney.city ? (
                                    `${opposingcounsel.opposingattorney.city}, `
                                  ) : (
                                    <span className="text-primary-20">
                                      City
                                    </span>
                                  )}
                                  {opposingcounsel.opposingattorney.state ? (
                                    `${opposingcounsel.opposingattorney.state} `
                                  ) : (
                                    <span className="text-primary-20">
                                      State
                                    </span>
                                  )}
                                  {opposingcounsel.opposingattorney.zip ? (
                                    opposingcounsel.opposingattorney.zip
                                  ) : (
                                    <span className="text-primary-20">Zip</span>
                                  )}
                                </p>
                              </div>
                              <p className="colFont info_phone_number text-black">
                                {opposingcounsel.opposingattorney
                                  .phone_number ? (
                                  <>
                                    <small>(</small>
                                    {opposingcounsel.opposingattorney.phone_number.slice(
                                      0,
                                      3
                                    )}
                                    <small>)</small>
                                    {opposingcounsel.opposingattorney.phone_number.slice(
                                      3,
                                      6
                                    )}
                                    -
                                    {opposingcounsel.opposingattorney.phone_number.slice(
                                      6
                                    )}
                                  </>
                                ) : (
                                  <span className="text-primary-20">
                                    (###) ###-####
                                  </span>
                                )}
                              </p>
                              <p className="colFont info_fax">
                                {opposingcounsel.opposingattorney.fax ? (
                                  <>
                                    <small>(</small>
                                    {opposingcounsel.opposingattorney.fax.slice(
                                      0,
                                      3
                                    )}
                                    <small>)</small>
                                    {opposingcounsel.opposingattorney.fax.slice(
                                      3,
                                      6
                                    )}
                                    -
                                    {opposingcounsel.opposingattorney.fax.slice(
                                      6
                                    )}
                                    <small className="ml-2 text-grey">
                                      fax
                                    </small>
                                  </>
                                ) : (
                                  <span className="text-primary-20">
                                    (###) ###-####
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                          {opposingcounsel.opposingattorney.email ? (
                            <a
                              href="#"
                              className="btn btn-primary-lighter font-weight-semibold btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center info_email m-b-5 p-l-6 p-r-6"
                            >
                              <i className="ic ic-19 ic-email-3d m-r-5"></i>
                              {opposingcounsel.opposingattorney.email}
                            </a>
                          ) : (
                            <a
                              href="#"
                              className="btn btn-primary-lighter font-weight-semibold btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center info_email m-b-5 p-l-6 p-r-6"
                            >
                              <i className="ic ic-19 ic-email-3d m-r-5"></i>
                            </a>
                          )}
                        </div>
                        <div className="mt-auto">
                          <a
                            href="#"
                            onClick={() =>
                              templatePopUp(
                                "",
                                defendant.id,
                                "",
                                "",
                                "",
                                "",
                                ""
                              )
                            }
                            className="btn btn-primary-lighter font-weight-semibold btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center"
                          >
                            <i className="ic ic-19 ic-generate-document m-r-5"></i>
                            Generate Document
                          </a>
                        </div>
                      </div>

                      <div className="dynamic-width col-auto d-flex flex-column p-0 p-r-5 width-250 flex-g-1">
                        <div className="information-wrapper">
                          <div
                            data-toggle="modal"
                            data-target="#editcounsel_contact_modal"
                            onClick={counselContactModal}
                            data-id={opposingcounsel.id}
                            data-block="opposingattorney_block"
                            data-name={opposingcounsel.opposingattorney.name}
                            data-add1={
                              opposingcounsel.opposingattorney.address1
                            }
                            data-add2={
                              opposingcounsel.opposingattorney.address2
                            }
                            data-city={opposingcounsel.opposingattorney.city}
                            data-state={opposingcounsel.opposingattorney.state}
                            data-zip={opposingcounsel.opposingattorney.zip}
                            data-phone={
                              opposingcounsel.opposingattorney.phone_number
                            }
                            data-fax={opposingcounsel.opposingattorney.fax}
                            data-email={opposingcounsel.opposingattorney.email}
                          >
                            <div className="text-left p-l-5 p-r-5">
                              <p className="columnsTitle text-primary text-center font-weight-semibold text-uppercase">
                                Opposing Attorney
                              </p>
                              <p className="columnsTitle">
                                {opposingcounsel.opposingattorney.name ? (
                                  opposingcounsel.opposingattorney.name
                                ) : (
                                  <span className="text-primary-20">
                                    Opposing Attorney Name
                                  </span>
                                )}
                              </p>
                              <div>
                                <p className="colFont info_phone_number text-black">
                                  {opposingcounsel.opposingattorney.address1 ? (
                                    opposingcounsel.opposingattorney.address1 +
                                    ","
                                  ) : (
                                    <span className="text-primary-20">
                                      Address
                                    </span>
                                  )}
                                  {opposingcounsel.opposingattorney.address2}
                                </p>
                                <p className="colFont info_fax">
                                  {opposingcounsel.opposingattorney.city ? (
                                    opposingcounsel.opposingattorney.city + ","
                                  ) : (
                                    <span className="text-primary-20">
                                      City
                                    </span>
                                  )}
                                  {opposingcounsel.opposingattorney.state ? (
                                    opposingcounsel.opposingattorney.state
                                  ) : (
                                    <span className="text-primary-20">
                                      State
                                    </span>
                                  )}
                                  {opposingcounsel.opposingattorney.zip ? (
                                    opposingcounsel.opposingattorney.zip
                                  ) : (
                                    <span className="text-primary-20">Zip</span>
                                  )}
                                </p>
                              </div>
                              <p className="colFont info_phone_number text-black">
                                {opposingcounsel.opposingattorney
                                  .phone_number ? (
                                  <>
                                    <small>(</small>
                                    {opposingcounsel.opposingattorney.phone_number.slice(
                                      0,
                                      3
                                    )}
                                    <small>)</small>
                                    {opposingcounsel.opposingattorney.phone_number.slice(
                                      3,
                                      6
                                    )}
                                    -
                                    {opposingcounsel.opposingattorney.phone_number.slice(
                                      6
                                    )}
                                  </>
                                ) : (
                                  <span className="text-primary-20">
                                    (###) ###-####
                                  </span>
                                )}
                              </p>
                              <p className="colFont info_fax">
                                {opposingcounsel.opposingattorney.fax ? (
                                  <>
                                    <small>(</small>
                                    {opposingcounsel.opposingattorney.fax.slice(
                                      0,
                                      3
                                    )}
                                    <small>)</small>
                                    {opposingcounsel.opposingattorney.fax.slice(
                                      3,
                                      6
                                    )}
                                    -
                                    {opposingcounsel.opposingattorney.fax.slice(
                                      6
                                    )}
                                    <small className="ml-2 text-grey">
                                      fax
                                    </small>
                                  </>
                                ) : (
                                  <span className="text-primary-20">
                                    (###) ###-####
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                          {opposingcounsel.opposingattorney.email ? (
                            <a
                              href="#"
                              className="btn btn-primary-lighter font-weight-semibold btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center info_email m-b-5 p-l-6 p-r-6"
                            >
                              <i className="ic ic-19 ic-email-3d m-r-5"></i>
                              {opposingcounsel.opposingattorney.email}
                            </a>
                          ) : (
                            <a
                              href="#"
                              className="btn btn-primary-lighter font-weight-semibold btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center info_email m-b-5 p-l-6 p-r-6"
                            >
                              <i className="ic ic-19 ic-email-3d m-r-5"></i>
                            </a>
                          )}
                        </div>
                        <div className="mt-auto">
                          <a
                            href="#"
                            onClick={() => templatePopUp("", defendant.id)}
                            className="btn btn-primary-lighter font-weight-semibold btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center"
                          >
                            <i className="ic ic-19 ic-generate-document m-r-5"></i>
                            Generate Document
                          </a>
                        </div>
                      </div>

                      <div className="dynamic-width col-auto d-flex flex-column p-0 p-r-5 width-250 flex-g-1">
                        <div className="information-wrapper">
                          <div
                            data-toggle="modal"
                            data-target="#editcounsel_information_modal"
                            // onClick={counselInformationModal}
                            data-id={opposingcounsel.id}
                            data-counsel_type={opposingcounsel.counsel_type.id}
                            data-file_number={opposingcounsel.file_number}
                          >
                            <div className="text-left p-l-5 p-r-5">
                              <p className="columnsTitle text-primary text-center font-weight-semibold text-uppercase">
                                Counsel Information
                              </p>
                              <div className="row mb-0 colFont">
                                <div className="col text-left">
                                  <span className="d-inline-block text-dark-grey">
                                    Type
                                  </span>
                                </div>
                                <div className="col-auto text-left font-weight-semibold">
                                  <p>{opposingcounsel.counsel_type.name}</p>
                                </div>
                              </div>
                              <div className="row mb-0 colFont">
                                <div className="col text-left">
                                  <span className="d-inline-block text-dark-grey">
                                    File #
                                  </span>
                                </div>
                                <div className="col-auto text-left font-weight-semibold">
                                  <p>{opposingcounsel.file_number}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="dynamic-width col-auto d-flex flex-column hidden-panel p-0 p-r-5 width-250 flex-g-1">
                        <div className="information-wrapper">
                          <div
                            data-toggle="modal"
                            data-target="#editcounsel_information_modal"
                            // onClick={counselInformationModal}
                            data-id={opposingcounsel.id}
                            data-counsel_type={opposingcounsel.counsel_type.id}
                            data-file_number={opposingcounsel.file_number}
                          >
                            <div className="text-left p-l-5 p-r-5">
                              <p className="columnsTitle text-primary font-weight-semibold text-uppercase"></p>
                              <div className="row mb-0 colFont">
                                <div className="col text-left">
                                  <span className="d-inline-block text-dark-grey"></span>
                                </div>
                                <div className="col-auto text-left font-weight-semibold">
                                  <p></p>
                                </div>
                              </div>
                              <div className="row mb-0 colFont">
                                <div className="col text-left">
                                  <span className="d-inline-block text-dark-grey"></span>
                                </div>
                                <div className="col-auto text-left font-weight-semibold">
                                  <p></p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex-1 p-0 position-relative z-index-1">
                    <div
                      className="fields-wrap overflow-hidden h-100"
                      data-toggle="modal"
                      data-target="#individual_notes_modal"
                      onClick={(event) =>
                        showNotes(
                          event,
                          `${opposingcounsel.model_name.title}${opposingcounsel.id}`,
                          opposingcounsel.model_name.title,
                          opposingcounsel.id,
                          "Counsel"
                        )
                      }
                    >
                      <div
                        className="tab-pane"
                        id="custom-nav-todo"
                        role="tabpanel"
                        aria-labelledby="custom-nav-todo-tab"
                      >
                        <div className="col-lg-12">
                          <div className="row">
                            <div className="table-responsive table--no-card border-0 has-alternate-grey def-col-table-3 overflow-hidden p-r-15">
                              <div className="note-fake-rows w-100 p-r-15">
                                {Array.from({ length: 12 }).map((_, index) => (
                                  <div
                                    key={index}
                                    className="note-fake-row"
                                  ></div>
                                ))}
                              </div>
                              <p className="p-0 height-25 d-flex justify-content-center text-center text-white line-height-25 margin-right-206">
                                Counsel Notes
                              </p>
                              <table className="table table-borderless table-striped table-earning table-y-down1">
                                <tbody className="tbody-panels">
                                  {notes.map((note, index) => {
                                    if (
                                      note.category.name === "Counsel" ||
                                      note.category.name ===
                                        "Update Case Status" ||
                                      note.category.name === "Critical"
                                    ) {
                                      if (
                                        note.entity_type ===
                                          `${opposingcounsel.model_name.title}` &&
                                        note.record_id === opposingcounsel.id
                                      ) {
                                        return (
                                          <tr key={index}>
                                            <td className="td-autosize serial-number">
                                              {noteCounter}
                                            </td>
                                            <td className="td-autosize">
                                              {note.created_at.toLocaleDateString(
                                                "en-US"
                                              )}
                                            </td>
                                            <td className="td-autosize">
                                              {note.created_at.toLocaleTimeString(
                                                "en-US"
                                              )}
                                            </td>
                                            <td className="td-autosize">
                                              <div className="d-flex align-items-center">
                                                <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
                                                  {note.created_by_v1
                                                    .profile_pic ? (
                                                    <img
                                                      src={
                                                        note.created_by_v1
                                                          .profile_pic.url
                                                      }
                                                      alt=""
                                                      className=""
                                                    />
                                                  ) : null}
                                                </span>
                                                <span className="ml-2 text-black">
                                                  {note.created_by.first_name}{" "}
                                                  {note.created_by.last_name}
                                                </span>
                                              </div>
                                            </td>
                                            <td className="client_page_note_row color-white-space-word-wrap ">
                                              {note.entity_type &&
                                              note.record_id
                                                ? `${note.entity_type} Note: `
                                                : ""}{" "}
                                              {note.description}
                                            </td>
                                          </tr>
                                        );
                                      }
                                    }
                                    return null;
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div> */
}
