// src/components/ModalComponent.js
import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import ModalHeaderTabs from "./ModalHeaderTabs";
import TabContentOne from "./TabContentOne";
import BrokenImageOutlinedIcon from "@mui/icons-material/BrokenImageOutlined";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import "./newcase.css";
import TabContentTwo from "./TabContentTwo";
import TabContentThree from "./TabContentThree";
import TabContentFour from "./TabContentFour";
import { getToken } from "../../Utils/helper";
import { useNavigate } from "react-router-dom";

function ModalComponent({ show, onClose }) {
  const origin =
    process.env.REACT_APP_BACKEND_URL || "https://dev.simplefirm.com";

  const [activeTab, setActiveTab] = useState("new-client");
  const [loading, setLoading] = useState(false);
  const [fieldStates, setFieldStates] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [showNormal, setShowNormal] = useState(true);
  const [storeLink, setStoreLink] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const fetchFieldSettings = async () => {
      // isLoading(true);
      try {
        const response = await fetch(`${origin}/api/firm_enabled_fields/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: getToken(),
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch field settings");
        }
        const data = await response.json();
        setFieldStates(data.firm_field_settings.field_settings);
      } catch (error) {
        console.error("Error fetching field settings:", error);
      }
    };

    fetchFieldSettings();
  }, []);

  const [emailValid, setEmailValid] = useState({
    client_email: true,
    defendant_email: true,
  });

  const [phoneValid, setPhoneValid] = useState({
    client_phone: true,
    defendant_phone: true,
  });

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const phoneRegex = /^(?:\d{10}|\(\d{3}\) \d{3}-\d{4})$/;

  const [formData, setFormData] = useState({
    // new client new case
    "new-client": {
      // intake tab
      intake_jurisdiction: "",
      intake_venue_county: "",

      // client
      client_id: 0,
      client_first_name: "",
      client_middle_name: "",
      client_last_name: "",
      client_dob: "",
      client_phone: "",
      client_email: "",
      client_case_type: 0,
      client_case_category: 0,
      client_incident_date: "",
      client_address1: "",
      client_address2: "",
      client_city: "",
      client_state: "",
      client_zip: "",
      client_insurance: 0,
      client_policy_number: "",
      client_claim_number: "",

      // defendant
      case_id: 0,

      defendant_first_name: "",
      defendant_middle_name: "",
      defendant_last_name: "",
      defendant_last_name: "",
      defendant_phone: "",
      defendant_email: "",
      defendant_address1: "",
      defendant_address2: "",
      defendant_city: "",
      defendant_state: "",
      defendant_zip: "",
      defendant_insurance: 0,
      defendant_policy_number: "",
      defendant_claim_number: "",
      defendant_report_number: "",
      defendant_reporting_agency: "",

      // source
      source_type: 0,
      source_category: 0,
      source_name: 0,
      source_date: "",
      source_time: "",
      source_location: "",
      source_address1: "",
      source_address2: "",
      source_city: "",
      source_state: "",
      source_zip: "",

      // notes
      notes: "",
    },

    // existing client new case
    "existing-client": {
      // intake tab
      // intake_venue_state: "",
      // intake_jurisdiction: "",
      // intake_venue_county: "",
      // intake_client_address1: "",
      // intake_client_address2: "",

      // client
      client_id: 0,
      // client_first_name: "",
      // client_last_name: "",
      // client_dob: "",
      client_case_category: 0,
      client_case_type: 0,
      client_incident_date: "",
      // client_phone_number: "",

      // source
      source_type: 0,
      source_category: 0,
      source_name: 0,
      source_date: "",
      source_time: "",
      source_location: "",
      source_address1: "",
      source_address2: "",
      source_city: "",
      source_state: "",
      source_zip: "",

      // defendant
      defendant_first_name: "",
      defendant_middle_name: "",
      defendant_last_name: "",
      defendant_phone: "",
      defendant_email: "",
      defendant_address1: "",
      defendant_address2: "",
      defendant_city: "",
      defendant_state: "",
      defendant_zip: "",
      defendant_insurance: 0,
      defendant_policy_number: "",
      defendant_claim_number: "",
      defendant_report_number: "",
      defendant_reporting_agency: "",

      // notes
      notes: "",
    },

    // new client existing case
    "new-client-existing-case": {
      // intake tab
      // intake_jurisdiction: "",
      // intake_venue_county: "",

      // client
      client_first_name: "",
      client_middle_name: "",
      client_last_name: "",
      client_dob: "",
      client_phone: "",
      client_email: "",
      client_address1: "",
      client_address2: "",
      client_city: "",
      client_state: "",
      client_zip: "",
      client_insurance: 0,
      client_policy_number: "",
      client_claim_number: "",

      // from
      case_id: 0,
      client_incident_date: "",

      // source
      source_type: 0,
      source_category: 0,
      source_name: 0,
      source_date: "",
      source_time: "",
      source_location: "",
      source_address1: "",
      source_address2: "",
      source_city: "",
      source_state: "",
      source_zip: "",

      // notes
      notes: "",
    },
  });

  const resetFormData = (data) => {
    // Recursively reset all values
    const resetObject = (obj) => {
      return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => {
          if (typeof value === "object" && value !== null) {
            return [key, resetObject(value)];
          }
          if (typeof value === "string") return [key, ""];
          if (typeof value === "number") return [key, 0];
          return [key, value]; // Handle other cases if necessary
        })
      );
    };

    return resetObject(data);
  };

  const handleClose = () => {
    document.body.classList.remove("modal-open");
    // const backdrop = document.querySelector(".modal-backdrop");
    // if (backdrop) {
    //   backdrop.remove(); // Remove lingering backdrop
    // }
    onClose();

    // cleaning on closing
    const cleanedData = resetFormData(formData);
    setFormData(cleanedData);
  };

  const handleClosePopup = () => {
    handleClose();
    setShowNormal(true);
    setShowPopup(false);
  };

  const handleInputChange = (tab, field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [tab]: {
        ...prevData[tab],
        [field]: value,
      },
    }));

    // if (field === "client_email" || field === "defendant_email") {
    //   // Validate email based on field (client or defendant)
    //   setEmailValid((prevValid) => ({
    //     ...prevValid,
    //     [field]: emailRegex.test(value),
    //   }));
    // }
  };

  const handleSave = async () => {
    const apiEndpoints = {
      "new-client": `${origin}/api/new_client_new_case/`,
      "existing-client": `${origin}/api/new_case_existing_client/`,
      "new-client-existing-case": `${origin}/api/new_client_existing_case/`,
    };

    const endpoint = apiEndpoints[activeTab];
    const dataToSave = formData[activeTab];

    if (!endpoint) {
      console.error("No endpoint defined for the active tab");
      return;
    }

    // New Section
    if (
      activeTab === "new-client" &&
      dataToSave.client_id !== 0 &&
      dataToSave.client_id !== undefined
    ) {
      const fieldsToRemove = [
        "intake_jurisdiction",
        "intake_venue_county",
        "client_first_name",
        "client_middle_name",
        "client_last_name",
        "client_phone_number",
        "client_dob",
        "client_phone",
        "client_email",
        "client_address1",
        "client_address2",
        "client_city",
        "client_state",
        "client_zip",
        "client_insurance",
        "client_policy_number",
        "client_claim_number",
      ];
      fieldsToRemove.forEach((field) => delete dataToSave[field]);
    } else if (activeTab === "new-client" && dataToSave.client_id === 0) {
      delete dataToSave.client_id;
    }

    if (
      activeTab === "new-client" &&
      dataToSave.case_id !== 0 &&
      dataToSave.case_id !== undefined
    ) {
      const caseFieldsToRemove = [
        "defendant_first_name",
        "defendant_middle_name",
        "defendant_last_name",
        "defendant_phone",
        "defendant_email",
        "defendant_address1",
        "defendant_address2",
        "defendant_city",
        "defendant_state",
        "defendant_zip",
        "defendant_insurance",
        "defendant_policy_number",
        "defendant_claim_number",
        "defendant_report_number",
        "defendant_reporting_agency",
        "client_case_category",
        "client_case_type",
        "client_incident_date",
      ];
      caseFieldsToRemove.forEach((field) => delete dataToSave[field]);
    } else if (activeTab === "new-client" && dataToSave.case_id === 0) {
      delete dataToSave.case_id;
    }

    let filteredData;

    if (
      activeTab === "new-client" ||
      activeTab === "new-client-existing-case"
    ) {
      filteredData = Object.fromEntries(
        Object.entries(dataToSave).filter(([key, value]) => {
          const fieldMappings = {
            jurisdiction: ["intake_jurisdiction"],
            venue_county: ["intake_venue_county"],
          };

          for (const [fieldKey, formFields] of Object.entries(fieldMappings)) {
            if (formFields.includes(key)) {
              return fieldStates[fieldKey] !== false; // Include if enabled in fieldStates
            }
          }

          // Include all other fields by default
          return true;
        })
      );
    } else if (activeTab === "existing-client") {
      filteredData = Object.fromEntries(
        Object.entries(dataToSave).filter(([key, value]) => {
          const fieldMappings = {
            venue_state: ["intake_venue_state"],
            jurisdiction: ["intake_jurisdiction"],
            venue_county: ["intake_venue_county"],
            client_address: [
              "intake_client_address1",
              "intake_client_address2",
            ],
          };

          for (const [fieldKey, formFields] of Object.entries(fieldMappings)) {
            if (formFields.includes(key)) {
              return fieldStates[fieldKey] !== false; // Include if enabled in fieldStates
            }
          }

          // Include all other fields by default
          return true;
        })
      );
    } else {
      // Default fallback
      filteredData = dataToSave;
    }

    let excludedFields = [];
    if (activeTab === "new-client") {
      excludedFields = [
        "client_email",
        "client_address2",
        "client_middle_name",
        "client_city",
        "client_zip",
        "client_insurance",
        "intake_client_address2",
        "client_policy_number",
        "client_claim_number",
        "defendant_first_name",
        "defendant_middle_name",
        "defendant_last_name",
        "defendant_phone",
        "defendant_email",
        "defendant_address1",
        "defendant_address2",
        "defendant_city",
        "defendant_state",
        "defendant_zip",
        "defendant_insurance",
        "defendant_policy_number",
        "defendant_claim_number",
        "defendant_report_number",
        "defendant_reporting_agency",
        "source_type",
        "source_category",
        "source_name",
        "source_date",
        "source_time",
        "source_location",
        "source_address1",
        "source_address2",
        "source_city",
        "source_state",
        "source_zip",
        "notes",
      ];
    } else if (activeTab === "existing-client") {
      excludedFields = [
        "intake_venue_state",
        "intake_jurisdiction",
        "intake_venue_county",
        "intake_client_address1",
        "intake_client_address2",
        "client_city",
        "client_state",
        "client_zip",
        "client_insurance",
        "client_policy_number",
        "client_claim_number",
        "client_email",
        "client_phone_number",
        "client_dob",
        "client_address1",
        "client_address2",
        "client_city",
        "client_zip",
        "client_insurance",
        "client_policy_number",
        "client_claim_number",
        "defendant_first_name",
        "defendant_middle_name",
        "defendant_last_name",
        "defendant_phone",
        "defendant_email",
        "defendant_address1",
        "defendant_address2",
        "defendant_city",
        "defendant_state",
        "defendant_zip",
        "defendant_insurance",
        "defendant_policy_number",
        "defendant_claim_number",
        "defendant_report_number",
        "defendant_reporting_agency",
        "source_type",
        "source_category",
        "source_name",
        "source_date",
        "source_time",
        "source_location",
        "source_address1",
        "source_address2",
        "source_city",
        "source_state",
        "source_zip",
        "notes",
      ];
    } else if (activeTab === "new-client-existing-case") {
      excludedFields = [
        "intake_jurisdiction",
        "intake_venue_county",
        // "intake_client_address1 + state",
        "intake_client_address2",
        "client_middle_name",
        "client_city",
        "client_zip",
        "client_insurance",
        "client_policy_number",
        "client_claim_number",
        "client_email",
        "client_address2",
        "client_city",
        "client_zip",
        "client_insurance",
        "client_policy_number",
        "client_claim_number",
        "defendant_first_name",
        "defendant_middle_name",
        "defendant_last_name",
        "defendant_phone",
        "defendant_email",
        "defendant_address1",
        "defendant_address2",
        "defendant_city",
        "defendant_state",
        "defendant_zip",
        "defendant_insurance",
        "defendant_policy_number",
        "defendant_claim_number",
        "defendant_report_number",
        "defendant_reporting_agency",
        "source_type",
        "source_category",
        "source_name",
        "source_date",
        "source_time",
        "source_location",
        "source_address1",
        "source_address2",
        "source_city",
        "source_state",
        "source_zip",
        "notes",
      ];
    }

    for (const field in filteredData) {
      // Skip the excluded fields
      if (excludedFields.includes(field)) {
        continue;
      }

      // Check if the field value is 0 or an empty string
      if (filteredData[field] === 0 || filteredData[field] === "") {
        alert("Please fill the required fields");
        return;
      }
    }

    try {
      setLoading(true);
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: getToken(),
        },
        body: JSON.stringify(filteredData),
      });
      if (response.ok) {
        const result = await response.json();
        setStoreLink(result);
        setLoading(false);
        //      // Modal Open
        setShowPopup(true);
        setShowNormal(false);
      } else {
        console.error("Failed to save data:", response.statusText);
        setLoading(false);
        alert("Failed to save the data");
      }
    } catch (error) {
      console.error("Error during save operation:", error);
      // setLoading(false)
      alert("Failed to save the data");
    }
  };

  const handleSavePopup = () => {
    handleClose();
    setShowNormal(true);
    setShowPopup(false);
    // navigate(`/bp-case/${storeLink.client_id}/${storeLink.case_id}`, {
    //   replace: true,
    // });
    window.location.href = `https://react-dev.simplefirm.com/bp-case/${storeLink.client_id}/${storeLink.case_id}`;
  };

  return (
    <>
      {showNormal && (
        <Modal
          show={show}
          onHide={handleClose}
          size="lg"
          centered
          dialogClassName="newcasemodalhuz"
        >
          <Modal.Header closeButton>
            <Modal.Title
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  fontSize: "1rem",
                  display: "flex",
                  gap: "5px",
                  marginBottom: "-10px",
                }}
              >
                <span>
                  <BrokenImageOutlinedIcon />
                </span>
                <span>Add New Case</span>
              </div>

              <div
                className="closeicon"
                onClick={handleClose}
                style={{
                  marginBottom: "-10px",
                }}
              >
                <ClearOutlinedIcon />
              </div>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="modal-body">
            <ModalHeaderTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
            <div
              className="tab-content-new-case"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                marginTop: "1rem",
              }}
            >
              {activeTab === "new-client" && (
                <TabContentOne
                  data={formData["new-client"]}
                  onChange={(field, value) =>
                    handleInputChange("new-client", field, value)
                  }
                  isEmailValid={emailValid}
                  setEmailValid={setEmailValid}
                  isPhoneValid={phoneValid}
                  setPhoneValid={setPhoneValid}
                />
              )}

              {activeTab === "existing-client" && (
                <TabContentTwo
                  data={formData["existing-client"]}
                  onChange={(field, value) =>
                    handleInputChange("existing-client", field, value)
                  }
                  isEmailValid={emailValid}
                  setEmailValid={setEmailValid}
                  isPhoneValid={phoneValid}
                  setPhoneValid={setPhoneValid}
                />
              )}
              {activeTab === "new-client-existing-case" && (
                <TabContentThree
                  data={formData["new-client-existing-case"]}
                  onChange={(field, value) =>
                    handleInputChange("new-client-existing-case", field, value)
                  }
                  isEmailValid={emailValid}
                  setEmailValid={setEmailValid}
                  isPhoneValid={phoneValid}
                  setPhoneValid={setPhoneValid}
                />
              )}
              {activeTab === "intake-reporting" && <TabContentFour />}
            </div>
          </Modal.Body>
          <Modal.Footer style={{ marginTop: "0px" }}>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button
              variant="success"
              onClick={handleSave}
              disabled={
                loading ||
                !(emailValid.client_email && emailValid.defendant_email) ||
                !(phoneValid.client_phone && phoneValid.defendant_phone)
              }
            >
              {loading ? "Saving" : "Save"}
              {/* Save */}
              {/* Save */}
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* // Other Modal */}
      {showPopup && (
        <Modal
          show={show}
          onHide={handleClosePopup}
          size="md"
          centered
          dialogClassName="newcasemodalhuz2"
        >
          <Modal.Header closeButton>
            <Modal.Title
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  fontSize: "1rem",
                  display: "flex",
                  gap: "5px",
                  marginBottom: "-10px",
                }}
              >
                <span>
                  <BrokenImageOutlinedIcon />
                </span>
                <span>Confirmation Message</span>
              </div>

              <div
                className="closeicon"
                onClick={handleClosePopup}
                style={{
                  marginBottom: "-10px",
                }}
              >
                <ClearOutlinedIcon />
              </div>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="modal-body">
            {/* Three Conditions */}
            {activeTab == "new-client" && (
              <p style={{ fontSize: "1rem" }}>
                New Client with New Case has been created successfully.
              </p>
            )}
            {activeTab == "new-client-existing-case" && (
              <p style={{ fontSize: "1rem" }}>
                New Client for Existing Case has been created successfully.
              </p>
            )}
            {activeTab == "existing-client" && (
              <p style={{ fontSize: "1rem" }}>
                New Case for Existing Client has been created successfully.
              </p>
            )}
          </Modal.Body>
          <Modal.Footer style={{ marginTop: "0px" }}>
            <Button variant="secondary" onClick={handleClosePopup}>
              Cancel
            </Button>
            <Button variant="success" onClick={handleSavePopup}>
              {/* {loading ? "Saving" : "Save"} */}
              Go to case
              {/* Save */}
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
}

export default ModalComponent;
