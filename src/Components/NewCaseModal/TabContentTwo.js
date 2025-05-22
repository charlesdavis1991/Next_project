import React, { useEffect, useRef, useState } from "react";
import {
  Form,
  FormGroup,
  FormLabel,
  FormControl,
  Row,
  Col,
  Button,
  Nav,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { calculateAge, getToken } from "../../Utils/helper";
import axios from "axios";
import Select from "react-select";
import PulseLoader from "react-spinners/PulseLoader";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import incidentIcon from "../../assets/images/incident.svg";
import birthdayIcon from "../../assets/images/birthdayicon.svg";

const formatDate = (date) => {
  if (!date) return "";
  const [month, day, year] = date.split("/");
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
};

const formatPhoneNumber = (phone) => {
  if (!phone) return "";
  const cleaned = ("" + phone).replace(/\D/g, "");
  if (cleaned.length === 10) {
    return `(${cleaned.substring(0, 3)}) ${cleaned.substring(3, 6)}-${cleaned.substring(6, 10)}`;
  }
  return phone;
};

const TabContentTwo = ({
  data,
  onChange,
  isEmailValid,
  setEmailValid,
  isPhoneValid,
  setPhoneValid,
}) => {
  const origin =
    process.env.REACT_APP_BACKEND_URL || "https://dev.simplefirm.com";

  const [loading, isLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState(0); // 0, 1, 2, 3, 4

  const [caseTypes, setCaseTypes] = useState([]);
  const [insuranceTypes, setInsuranceTypes] = useState([]);
  const [reportingagencyTypes, setReportingagencyTypes] = useState([]);
  const [filteredCaseTypes, setFilteredCaseTypes] = useState([]); //
  const [selectedCaseCategory, setSelectedCaseCategory] = useState(0);

  const [fieldStates, setFieldStates] = useState({});
  const [state, setState] = useState([]);

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null); // Selected dropdown value

  // source fields start here
  const [sourceTypes, setSourceTypes] = useState([]);
  const [sourceCategories, setSourceCategories] = useState([]);
  const [caseSources, setCaseSources] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSourceName, setSelectedSourceName] = useState("");
  const [disabledCategory, setDisabledCategory] = useState(true);
  const [disabledSourceName, setDisabledSourceName] = useState(true);
  //source fields end here

  const selectRef = useRef(null);

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const phoneRegex = /^(?:\d{10}|\(\d{3}\) \d{3}-\d{4})$/;

  // Handle defendant email input change
  const handleDefendantEmailChange = (e) => {
    const email = e.target.value;
    onChange("defendant_email", email);

    if (email !== "") {
      setEmailValid((prevValid) => ({
        ...prevValid,
        defendant_email: emailRegex.test(email),
      }));
    } else {
      setEmailValid((prevValid) => ({
        ...prevValid,
        defendant_email: true, // Set as valid when empty
      }));
    }
  };

  const handleDefendantPhoneChange = (e) => {
    const phone = e.target.value;
    onChange("defendant_phone", phone);

    if (phone !== "") {
      setPhoneValid((prevValid) => ({
        ...prevValid,
        defendant_phone: phoneRegex.test(phone),
      }));
    } else {
      setPhoneValid((prevValid) => ({
        ...prevValid,
        defendant_phone: true, // Set as valid when empty
      }));
    }
  };

  const tooltip = (
    <Tooltip id="tooltip">Please enter an valid email address</Tooltip>
  );

  const tooltipphone = (
    <Tooltip id="tooltip">Phone number must be of 10 digits</Tooltip>
  );

  const handleNext = () => {
    if (currentTab < 3) {
      setCurrentTab(currentTab + 1);
    } else {
      setCurrentTab(0);
    }
  };

  const handleBack = () => {
    if (currentTab > 0) {
      setCurrentTab(currentTab - 1);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleNext();
    }
  };

  const colourStyles = {
    control: (styles, { isFocused }) => ({
      ...styles,
      backgroundColor: "white",
      border: isFocused ? "1px solid red" : "1px solid #ff8f8f",
      boxShadow: isFocused ? "0 0 0 2px rgba(25, 57, 95, 0.2)" : "none",
      "&:hover": {
        border: "1px solid red",
      },
      width: "104.8%",
    }),
    valueContainer: (styles) => ({
      ...styles,
      padding: "0 7px",
    }),
    menuList: (provided) => ({
      ...provided,
      maxHeight: "calc(100vh - 350px)",
    }),
    option: (styles, { isFocused, isSelected }) => ({
      ...styles,
      backgroundColor: isSelected ? "#19395f" : isFocused ? "#e0e0e0" : "white",
      color: isSelected ? "white" : "#4a5568",
      fontWeight: isSelected ? "bold" : "normal",
      "&:hover": {
        backgroundColor: "#25568f",
        color: "white",
      },
    }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  };

  const handleChange = (selected) => {
    setSelectedOption(selected); // Set the selected option
    setSearch(""); // Reset the search field
    setSearchResults([]); // Clear the search results
    selectRef.current.blur();
  };

  const handleInputChange = (newValue) => {
    setSearch(newValue);
  };

  const fetchSearchData = async (searchTerm) => {
    if (searchTerm.trim().length < 3) {
      setSearchResults([]); // Clear results if search term is too short
      return;
    }
    try {
      const response = await axios.post(
        `${origin}/api/search/clients/`,
        { name: searchTerm },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: getToken(),
          },
        }
      );

      if (response.data && response.data.data) {
        console.log(response.data.data); // Debugging log to inspect the data structure
        setSearchResults(
          response.data.data.map((result) => {
            const age = result?.for_client?.birthday
              ? calculateAge(result.for_client.birthday)
              : "";
            return {
              value: result.id,
              label: (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <span>
                    {result?.for_client?.last_name || "N/A"}
                    {result?.for_client?.middle_name
                      ? `, ${result.for_client.middle_name} ${result.for_client.first_name}`
                      : `, ${result.for_client?.first_name || "N/A"}`}
                    ,{" "}
                  </span>
                  <img
                    src={birthdayIcon}
                    alt="Birthday"
                    style={{ width: "16px", height: "16px" }}
                  />
                  <span>
                    {result?.for_client?.birthday || "N/A"}{" , "}
                    {age ? `${age} years` : "0 years"},{" "}
                  </span>
                  {result?.case_type?.casetype_icon && (
                    <img
                      src={result?.case_type?.casetype_icon}
                      alt="Case"
                      style={{ width: "16px", height: "16px" }}
                    />
                  )}
                  {result?.case_type?.name || "N/A"}{" , "}
                  <img
                    src={incidentIcon}
                    alt="Incident"
                    style={{ width: "16px", height: "16px" }}
                  />
                  {result?.incident_date || "N/A"}
                </div>
              ),
              searchText: `${result?.for_client?.last_name || "N/A"} ${result?.for_client?.first_name || "N/A"} ${result?.for_client?.birthday || "N/A"} ${result?.case_type?.name || "N/A"} ${result?.incident_date || "N/A"}`,
              ...result,
            };
          })
        );
      } else {
        console.error("Unexpected response structure:", response.data);
        setSearchResults([]); // Clear results if response structure is unexpected
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
      setSearchResults([]); // Clear results on error
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search) fetchSearchData(search);
    }, 100); // Debounce input

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentTab]);

  useEffect(() => {
    const fetchFieldSettings = async () => {
      try {
        isLoading(true);
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
        console.log(data);
        setFieldStates(data.firm_field_settings.enabled_fields);

        // source fields
        const { source_types, source_categories, case_sources } = data;
        setSourceTypes(source_types);
        setSourceCategories(source_categories);
        setCaseSources(case_sources);

        // console.log(fieldStates);
      } catch (error) {
        isLoading(false);
        console.error("Error fetching field settings:", error);
      }
    };

    const fetchCaseTypes = async () => {
      try {
        isLoading(true);
        const response = await fetch(`${origin}/api/get_case_types/`);
        if (!response.ok) {
          throw new Error("Failed to fetch case types");
        }
        const data = await response.json();
        console.log(data);
        setCaseTypes(data.case_type_categories);
        setInsuranceTypes(data.insurance_companies);
        setReportingagencyTypes(data.reporting_agencies);
        setState(data.states);
        isLoading(false);
      } catch (error) {
        isLoading(false);
        console.error("Error fetching case types:", error);
      }
    };

    fetchCaseTypes();
    fetchFieldSettings();
  }, []);

  // Handler for category change
  const handleCaseCategoryChange = (value) => {
    const categoryId = parseInt(value, 10);
    setSelectedCaseCategory(categoryId);
    const category = caseTypes.find((cat) => cat.id === categoryId);
    setFilteredCaseTypes(category ? category.case_types : []); // Update filtered types
    onChange("client_case_category", categoryId);

    if (categoryId === 0) {
      onChange("client_case_type", 0);
    }
  };

  const handleSourceNameChange = (e) => {
    setSelectedSourceName(parseInt(e.target.value, 10));

    const selectedCategoryValue = parseInt(e.target.value, 10);
    onChange("source_name", selectedCategoryValue);
  };

  const handleTypeChange = (e) => {
    console.log(e.target.value);
    const selectedTypeValue = parseInt(e.target.value, 10); // Ensure it's an integer
    setSelectedType(selectedTypeValue);
    setSelectedCategory("");
    setSelectedSourceName("");
    setDisabledCategory(selectedTypeValue === 0);
    setDisabledSourceName(true);
    onChange("source_type", selectedTypeValue);

    if (selectedTypeValue === 0) {
      onChange("source_category", 0);
      onChange("source_name", 0);
    }
  };

  const handleCategoryChange = (e) => {
    const selectedCategoryValue = parseInt(e.target.value, 10);
    setSelectedCategory(selectedCategoryValue);
    setSelectedSourceName("");
    setDisabledSourceName(selectedCategoryValue === 0);
    onChange("source_category", selectedCategoryValue);

    if (selectedCategoryValue === 0) {
      onChange("source_name", 0);
    }
  };

  // Filter source categories based on selected type
  const filteredCategories = sourceCategories.filter(
    (category) => category.source_type === selectedType
  );

  // Filter case sources based on selected type and category
  const filteredCaseSources = caseSources.filter(
    (source) =>
      source.source_type === selectedType &&
      source.source_category === selectedCategory
  );

  useEffect(() => {
    const formattedBirthday = formatDate(selectedOption?.for_client?.birthday);
    const formattedPhone = formatPhoneNumber(selectedOption?.for_client?.phone);

    onChange("client_first_name", selectedOption?.for_client?.first_name || "");
    onChange("client_last_name", selectedOption?.for_client?.last_name || "");
    onChange("client_dob", formattedBirthday || "");
    //onChange("client_phone_number", selectedOption?.for_client?.phone || "");
    if (formattedPhone) {
      onChange("client_phone_number", formattedPhone);
    }
    onChange("client_id", selectedOption?.for_client?.id || "");
  }, [selectedOption]);

  const tooltipClient = (
    <Tooltip id="tooltip">
      Search for a client in next tab (client) to get these data filled
    </Tooltip>
  );

  return (
    <div className="scrollable-content">
      <Form>
        <Row>
          <Nav
            variant="tabs"
            className="mb-2"
            style={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            {/* <Nav.Item style={{ width: "20%" }}>
              <Nav.Link
                active={currentTab === 0}
                onClick={() => setCurrentTab(0)}
                className={`d-flex align-items-center ${currentTab === 0 ? "active-tab" : ""}`}
                style={{ width: "100%" }}
              >
                Required Intake Information
              </Nav.Link>
            </Nav.Item> */}
            <Nav.Item style={{ width: "25%" }}>
              <Nav.Link
                active={currentTab === 0} // -1
                onClick={() => setCurrentTab(0)}
                className={`d-flex align-items-center ${currentTab === 0 ? "active-tab" : ""}`}
                style={{ width: "100%" }}
              >
                Existing Client
              </Nav.Link>
            </Nav.Item>
            <Nav.Item style={{ width: "25%" }}>
              <Nav.Link
                active={currentTab === 1}
                onClick={() => setCurrentTab(1)}
                className={`d-flex align-items-center ${currentTab === 1 ? "active-tab" : ""}`}
                style={{ width: "100%" }}
              >
                Defendant
              </Nav.Link>
            </Nav.Item>
            <Nav.Item style={{ width: "25%" }}>
              <Nav.Link
                active={currentTab === 2}
                onClick={() => setCurrentTab(2)}
                className={`d-flex align-items-center ${currentTab === 2 ? "active-tab" : ""}`}
                style={{ width: "100%" }}
              >
                Source
              </Nav.Link>
            </Nav.Item>
            <Nav.Item style={{ width: "25%" }}>
              <Nav.Link
                active={currentTab === 3}
                onClick={() => setCurrentTab(3)}
                className={`d-flex align-items-center ${currentTab === 3 ? "active-tab" : ""}`}
              >
                Notes
              </Nav.Link>
            </Nav.Item>
          </Nav>

          {/* Case Type and Incident Date Section */}
          {currentTab === 3 && (
            <Col
              md="4"
              className="tabclient"
              style={{ paddingLeft: "0px", marginLeft: "-5px" }}
            >
              <FormGroup as={Row} className="mb-2">
                <FormLabel column sm="3">
                  Intake Notes:
                </FormLabel>
                <Col sm="9">
                  <FormControl
                    as="textarea"
                    placeholder="Enter Intake Notes"
                    value={data.notes || ""}
                    onChange={(e) => onChange("notes", e.target.value)}
                  />
                </Col>
              </FormGroup>
            </Col>
          )}

          {/* Defendant Information Section */}
          {currentTab === 1 && (
            <>
              <Col
                md="6"
                className="tabclient"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  paddingLeft: "0px",
                  marginLeft: "-5px",
                }}
              >
                <FormGroup as={Row} className="mb-2">
                  <FormLabel column sm="3">
                    First Name:
                  </FormLabel>
                  <Col sm="9">
                    <FormControl
                      type="text"
                      placeholder="Enter Defendant First Name"
                      value={data.defendant_first_name || ""}
                      onChange={(e) =>
                        onChange("defendant_first_name", e.target.value)
                      }
                    />
                  </Col>
                </FormGroup>

                <FormGroup as={Row} className="mb-2">
                  <FormLabel column sm="3">
                    Middle Name:
                  </FormLabel>
                  <Col sm="9">
                    <FormControl
                      type="text"
                      placeholder="Enter Defendant Middle Name"
                      value={data.defendant_middle_name || ""}
                      onChange={(e) =>
                        onChange("defendant_middle_name", e.target.value)
                      }
                    />
                  </Col>
                </FormGroup>

                <FormGroup as={Row} className="mb-2">
                  <FormLabel column sm="3">
                    Last Name:
                  </FormLabel>
                  <Col sm="9">
                    <FormControl
                      type="text"
                      placeholder="Enter Defendant Last Name"
                      value={data.defendant_last_name || ""}
                      onChange={(e) =>
                        onChange("defendant_last_name", e.target.value)
                      }
                    />
                  </Col>
                </FormGroup>

                <FormGroup as={Row} className="mb-2">
                  <FormLabel column sm="3">
                    Phone:
                  </FormLabel>
                  <Col sm="9" style={{ display: "flex" }}>
                    <FormControl
                      type="text"
                      placeholder="Enter Defendant Phone"
                      value={data.defendant_phone || ""}
                      onChange={handleDefendantPhoneChange}
                    />
                    {!isPhoneValid.defendant_phone && (
                      <>
                        <OverlayTrigger
                          placement="right"
                          overlay={tooltipphone}
                        >
                          <ErrorOutlineIcon
                            style={{
                              marginRight: "-25px",
                              position: "relative",
                              left: "10px",
                              top: "5px",
                            }}
                          />
                        </OverlayTrigger>
                      </>
                    )}
                  </Col>
                </FormGroup>

                <FormGroup as={Row} className="mb-2">
                  <FormLabel column sm="3">
                    Email:
                  </FormLabel>
                  <Col sm="9" style={{ display: "flex" }}>
                    <FormControl
                      type="email"
                      placeholder="Enter Defendant Email"
                      value={data.defendant_email || ""}
                      onChange={handleDefendantEmailChange}
                    />
                    {!isEmailValid.defendant_email && (
                      <>
                        <OverlayTrigger placement="right" overlay={tooltip}>
                          <ErrorOutlineIcon
                            style={{
                              marginRight: "-25px",
                              position: "relative",
                              left: "10px",
                              top: "5px",
                            }}
                          />
                        </OverlayTrigger>
                      </>
                    )}
                  </Col>
                </FormGroup>

                <FormGroup as={Row} className="mb-2">
                  <FormLabel column sm="3">
                    Address:
                  </FormLabel>
                  <Col sm="9">
                    <FormControl
                      type="text"
                      placeholder="Enter Address 1"
                      value={data.defendant_address1 || ""}
                      onChange={(e) =>
                        onChange("defendant_address1", e.target.value)
                      }
                    />
                  </Col>
                </FormGroup>

                <FormGroup as={Row} className="mb-2">
                  <Col sm={{ span: 9, offset: 3 }}>
                    <FormControl
                      type="text"
                      placeholder="Enter Address 2"
                      value={data.defendant_address2 || ""}
                      onChange={(e) =>
                        onChange("defendant_address2", e.target.value)
                      }
                    />
                  </Col>
                </FormGroup>

                <FormGroup as={Row} className="mb-2">
                  <FormLabel column sm="3"></FormLabel>
                  <Col sm="4" className="pr-1">
                    <FormControl
                      type="text"
                      placeholder="Enter City"
                      value={data.defendant_city || ""}
                      onChange={(e) =>
                        onChange("defendant_city", e.target.value)
                      }
                    />
                  </Col>
                  <Col sm="3" className="px-1">
                    <FormControl
                      as="select"
                      value={data.defendant_state || ""}
                      onChange={(e) =>
                        onChange("defendant_state", e.target.value)
                      }
                    >
                      <option value="">Select State</option>
                      {state.map((state) => (
                        <option key={state.name} value={state.name}>
                          {state.name}
                        </option>
                      ))}
                    </FormControl>
                  </Col>
                  <Col sm="2" className="pl-1">
                    <FormControl
                      type="text"
                      placeholder="ZIP"
                      value={data.defendant_zip || ""}
                      onChange={(e) =>
                        onChange("defendant_zip", e.target.value)
                      }
                    />
                  </Col>
                </FormGroup>

                {/* <FormGroup as={Row} className="mb-2">
                  <FormLabel column sm="3">
                    Insurance:
                  </FormLabel>
                  <Col sm="9">
                    <FormControl
                      type="text"
                      placeholder="Enter Defendant insurance company"
                      value={data.defendant_insurance || ""}
                      onChange={(e) =>
                        onChange("defendant_insurance", e.target.value)
                      }
                    />
                  </Col>
                </FormGroup> */}

                <FormGroup as={Row} className="mb-2">
                  <FormLabel column sm="3">
                    Insurance:
                  </FormLabel>
                  <Col sm="9">
                    <FormControl
                      as="select"
                      value={data.defendant_insurance || ""}
                      onChange={(e) =>
                        onChange(
                          "defendant_insurance",
                          e.target.value === "Select Insurance"
                            ? 0
                            : parseInt(e.target.value, 10)
                        )
                      }
                    >
                      <option value="0">Select Insurance</option>
                      {insuranceTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.company_name}
                        </option>
                      ))}
                    </FormControl>
                  </Col>
                </FormGroup>

                <FormGroup as={Row} className="mb-2">
                  <FormLabel column sm="3">
                    Policy #:
                  </FormLabel>
                  <Col sm="9">
                    <FormControl
                      type="text"
                      placeholder="Enter Policy #"
                      value={data.defendant_policy_number || ""}
                      onChange={(e) =>
                        onChange("defendant_policy_number", e.target.value)
                      }
                    />
                  </Col>
                </FormGroup>

                <FormGroup as={Row} className="mb-2">
                  <FormLabel column sm="3">
                    Claim #:
                  </FormLabel>
                  <Col sm="9">
                    <FormControl
                      type="text"
                      placeholder="Enter Claim #"
                      value={data.defendant_claim_number || ""}
                      onChange={(e) =>
                        onChange("defendant_claim_number", e.target.value)
                      }
                    />
                  </Col>
                </FormGroup>
              </Col>

              <Col
                md="6"
                className="tabclient"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  paddingRight: "0px",
                }}
              >
                <FormGroup as={Row} className="mb-2">
                  <FormLabel column sm="3">
                    Report #:
                  </FormLabel>
                  <Col sm="9" style={{ paddingRight: "0px" }}>
                    <FormControl
                      type="text"
                      placeholder="Enter Incident Report #"
                      value={data.defendant_report_number || ""}
                      onChange={(e) =>
                        onChange("defendant_report_number", e.target.value)
                      }
                    />
                  </Col>
                </FormGroup>

                {/* <FormGroup as={Row} className="mb-2">
                  <FormLabel column sm="3">
                    Reporting Agency:
                  </FormLabel>
                  <Col sm="9">
                    <FormControl
                      type="text"
                      placeholder="Enter Reporting Agency #"
                      value={data.defendant_reporting_agency || ""}
                      onChange={(e) =>
                        onChange("defendant_reporting_agency", e.target.value)
                      }
                    />
                  </Col>
                </FormGroup> */}

                <FormGroup as={Row} className="mb-2">
                  <FormLabel column sm="3">
                    Reporting Agency:
                  </FormLabel>
                  <Col sm="9" style={{ paddingRight: "0px" }}>
                    <FormControl
                      as="select"
                      value={data.defendant_reporting_agency || ""}
                      onChange={(e) =>
                        onChange(
                          "defendant_reporting_agency",
                          e.target.value === "Select Reporting Agency"
                            ? ""
                            : e.target.value,
                          10
                        )
                      }
                    >
                      <option value="">Select Reporting Agency</option>
                      {reportingagencyTypes.map((type) => (
                        <option
                          key={type.id}
                          value={type.reporting_agency}
                          title={
                            type.reporting_agency.length > 45
                              ? type.reporting_agency
                              : ""
                          }
                        >
                          {type.reporting_agency.length > 45
                            ? `${type.reporting_agency.slice(0, 45)}...`
                            : type.reporting_agency}
                        </option>
                      ))}
                    </FormControl>
                  </Col>
                </FormGroup>
              </Col>
            </>
          )}

          {/* Source Section */}
          {currentTab === 2 && (
            <>
              <Col
                md="6"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  paddingLeft: "0px",
                  marginLeft: "-5px",
                }}
              >
                {/* Source Type */}
                <FormGroup as={Row} className="mb-2">
                  <FormLabel column sm="3">
                    Source Type:
                  </FormLabel>
                  <Col sm="9">
                    <FormControl
                      as="select"
                      value={selectedType}
                      onChange={handleTypeChange}
                    >
                      <option value="0">Select Type</option>
                      {sourceTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.name}
                        </option>
                      ))}
                    </FormControl>
                  </Col>
                </FormGroup>

                {/* Source Category */}
                <FormGroup as={Row} className="mb-2">
                  <FormLabel column sm="3">
                    Source Category:
                  </FormLabel>
                  <Col sm="9">
                    <FormControl
                      as="select"
                      value={selectedCategory}
                      onChange={handleCategoryChange}
                      disabled={disabledCategory}
                    >
                      <option value="0">Select Source Category</option>
                      {filteredCategories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </FormControl>
                  </Col>
                </FormGroup>

                {/* Source Name */}
                <FormGroup as={Row} className="mb-2">
                  <FormLabel column sm="3">
                    Source Name:
                  </FormLabel>
                  <Col sm="9">
                    <FormControl
                      as="select"
                      value={selectedSourceName}
                      onChange={handleSourceNameChange}
                      disabled={disabledSourceName}
                    >
                      <option value="0">Select Source Name</option>
                      {filteredCaseSources.map((source) => (
                        <option key={source.id} value={source.id}>
                          {source.name}
                        </option>
                      ))}
                    </FormControl>
                  </Col>
                </FormGroup>

                {/* Date and Time */}
                <FormGroup as={Row} className="mb-2 align-items-center">
                  <FormLabel column sm="3">
                    Date:
                  </FormLabel>
                  <Col sm="4" className="pr-1">
                    <FormControl
                      type="date"
                      value={data.source_date || ""}
                      onChange={(e) => onChange("source_date", e.target.value)}
                    />
                  </Col>
                  <FormLabel column sm="2" className="text-center">
                    Time:
                  </FormLabel>
                  <Col sm="3" className="pl-1">
                    <FormControl
                      type="time"
                      value={data.source_time || ""}
                      onChange={(e) => onChange("source_time", e.target.value)}
                    />
                  </Col>
                </FormGroup>

                {/* Location */}
                <FormGroup as={Row} className="mb-2">
                  <FormLabel column sm="3">
                    Location:
                  </FormLabel>
                  <Col sm="9">
                    <FormControl
                      type="text"
                      placeholder="Enter Ad Location"
                      value={data.source_location || ""}
                      onChange={(e) =>
                        onChange("source_location", e.target.value)
                      }
                    />
                  </Col>
                </FormGroup>

                {/* Address */}
                <FormGroup as={Row} className="mb-2">
                  <FormLabel column sm="3">
                    Address:
                  </FormLabel>
                  <Col sm="9">
                    <FormControl
                      type="text"
                      placeholder="Enter Ad Location Address 1"
                      value={data.source_address1 || ""}
                      onChange={(e) =>
                        onChange("source_address1", e.target.value)
                      }
                    />
                  </Col>
                </FormGroup>

                <FormGroup as={Row} className="mb-2">
                  <Col sm={{ span: 9, offset: 3 }}>
                    <FormControl
                      type="text"
                      placeholder="Enter Ad Location Address 2"
                      value={data.source_address2 || ""}
                      onChange={(e) =>
                        onChange("source_address2", e.target.value)
                      }
                    />
                  </Col>
                </FormGroup>

                {/* City, State, and ZIP */}
                <FormGroup as={Row} className="mb-2">
                  <FormLabel column sm="3"></FormLabel>
                  <Col sm="4" className="pr-1">
                    <FormControl
                      type="text"
                      placeholder="Enter City"
                      value={data.source_city || ""}
                      onChange={(e) => onChange("source_city", e.target.value)}
                    />
                  </Col>
                  <Col sm="3" className="px-1">
                    <FormControl
                      as="select"
                      value={data.source_state || ""}
                      onChange={(e) => onChange("source_state", e.target.value)}
                    >
                      <option>Select State</option>
                      {state.map((state) => (
                        <option key={state.name} value={state.name}>
                          {state.name}
                        </option>
                      ))}
                    </FormControl>
                  </Col>
                  <Col sm="2" className="pl-1">
                    <FormControl
                      type="text"
                      placeholder="ZIP"
                      value={data.source_zip || ""}
                      onChange={(e) => onChange("source_zip", e.target.value)}
                    />
                  </Col>
                </FormGroup>
              </Col>
            </>
          )}

          {/* {currentTab === 0 &&
            (loading ? (
              <PulseLoader
                loading={isLoading}
                size={16}
                aria-label="Loading Spinner"
                data-testid="loader"
                color="#19395F"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  height: "calc(100vh-119px)",
                  justifyContent: "center",
                  alignItems: "center",
                  overflow: "hidden",
                }}
              />
            ) : (
              <>
                <Col
                  md="6"
                  className="tabclient"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  {fieldStates.first_name && (
                    <FormGroup as={Row} className="mb-2">
                      <FormLabel column sm="3">
                        First Name: <span class="required-aes">*</span>
                      </FormLabel>
                      <Col sm="9" style={{ display: "flex" }}>
                        <FormControl
                          type="text"
                          placeholder="Enter First Name"
                          value={data.client_first_name || ""}
                          onChange={(e) =>
                            onChange("client_first_name", e.target.value)
                          }
                          readOnly={
                            !selectedOption ||
                            selectedOption?.for_client?.first_name
                              ? true
                              : false
                          }
                          className="haddress2"
                        />

                        {!selectedOption && (
                          <>
                            <OverlayTrigger
                              placement="right"
                              overlay={tooltipClient}
                            >
                              <ErrorOutlineIcon
                                style={{
                                  marginRight: "-25px",
                                  position: "relative",
                                  left: "10px",
                                  top: "5px",
                                }}
                              />
                            </OverlayTrigger>
                          </>
                        )}
                      </Col>
                    </FormGroup>
                  )}
                  {fieldStates.last_name && (
                    <FormGroup as={Row} className="mb-2">
                      <FormLabel column sm="3">
                        Last Name: <span class="required-aes">*</span>
                      </FormLabel>
                      <Col sm="9">
                        <FormControl
                          type="text"
                          placeholder="Enter Last Name"
                          value={data.client_last_name || ""}
                          onChange={(e) =>
                            onChange("client_last_name", e.target.value)
                          }
                          readOnly={
                            !selectedOption ||
                            selectedOption?.for_client?.last_name
                              ? true
                              : false
                          }
                          className="haddress2"
                        />
                      </Col>
                    </FormGroup>
                  )}
                  {fieldStates.venue_state && (
                    <FormGroup as={Row} className="mb-2">
                      <FormLabel column sm="3">
                        State: <span class="required-aes">*</span>
                      </FormLabel>
                      <Col sm="9">
                        <FormControl
                          as="select"
                          value={data.intake_venue_state || ""}
                          className="haddress2"
                          onChange={(e) =>
                            onChange(
                              "intake_venue_state",
                              e.target.value === "Select State"
                                ? ""
                                : e.target.value
                            )
                          }
                        >
                          <option>Select State</option>
                          {filteredStates.map((state, index) => (
                            <option key={index} value={state}>
                              {state}
                            </option>
                          ))}
                        </FormControl>
                      </Col>
                    </FormGroup>
                  )}
                  {fieldStates.jurisdiction && (
                    <FormGroup as={Row} className="mb-2">
                      <FormLabel column sm="3">
                        Jurisdiction: <span class="required-aes">*</span>
                      </FormLabel>
                      <Col sm="9">
                        <FormControl
                          type="text"
                          placeholder="Enter Jurisdiction"
                          value={data.intake_jurisdiction || ""}
                          onChange={(e) =>
                            onChange("intake_jurisdiction", e.target.value)
                          }
                          className="haddress2"
                        />
                      </Col>
                    </FormGroup>
                  )}
                  {fieldStates.venue_county && (
                    <FormGroup as={Row} className="mb-2">
                      <FormLabel column sm="3">
                        Venue County: <span class="required-aes">*</span>
                      </FormLabel>
                      <Col sm="9">
                        <FormControl
                          type="text"
                          placeholder="Enter Venue County"
                          value={data.intake_venue_county || ""}
                          onChange={(e) =>
                            onChange("intake_venue_county", e.target.value)
                          }
                          className="haddress2"
                        />
                      </Col>
                    </FormGroup>
                  )}
                  {fieldStates.incident_date && (
                    <FormGroup as={Row} className="mb-2">
                      <FormLabel column sm="3">
                        Incident: <span class="required-aes">*</span>
                      </FormLabel>
                      <Col sm="9">
                        <FormControl
                          type="date"
                          placeholder="mm/dd/yyyy"
                          value={data.client_incident_date || ""}
                          onChange={(e) =>
                            onChange("client_incident_date", e.target.value)
                          }
                          className="haddress2"
                        />
                      </Col>
                    </FormGroup>
                  )}
                  {fieldStates.client_address && (
                    <>
                      <FormGroup as={Row} className="mb-2">
                        <FormLabel column sm="3">
                          Client Address: <span class="required-aes">*</span>
                        </FormLabel>
                        <Col sm="9">
                          <FormControl
                            type="text"
                            placeholder="Enter Client Address 1"
                            value={data.intake_client_address1 || ""}
                            onChange={(e) =>
                              onChange("intake_client_address1", e.target.value)
                            }
                            className="haddress2"
                          />
                        </Col>
                      </FormGroup>
                    </>
                  )}
                  {fieldStates.client_birthday && (
                    <FormGroup as={Row} className="mb-2">
                      <FormLabel column sm="3">
                        Client Birthday: <span class="required-aes">*</span>
                      </FormLabel>
                      <Col sm="9">
                        <FormControl
                          type="date"
                          value={data.client_dob || ""} // This will be in the format YYYY-MM-DD
                          onChange={(e) => {
                            // On change, send the date in YYYY-MM-DD format
                            onChange("client_dob", e.target.value);
                          }}
                          readOnly={
                            !selectedOption ||
                            selectedOption?.for_client?.birthday
                              ? true
                              : false
                          }
                          className="haddress2"
                        />
                      </Col>
                    </FormGroup>
                  )}
                  {fieldStates.client_phone_number && (
                    <FormGroup as={Row} className="mb-2">
                      <FormLabel column sm="3">
                        Client Phone: <span class="required-aes">*</span>
                      </FormLabel>
                      <Col sm="9">
                        <FormControl
                          type="text"
                          placeholder="Enter Client Phone Number"
                          value={data.client_phone_number || ""}
                          onChange={(e) =>
                            onChange("client_phone_number", e.target.value)
                          }
                          // readOnly
                          readOnly={
                            !selectedOption || selectedOption?.for_client?.phone
                              ? true
                              : false
                          }
                          className="haddress2"
                        />
                      </Col>
                    </FormGroup>
                  )}
                </Col>
              </>
            ))} */}

          {currentTab === 0 &&
            (loading ? (
              <PulseLoader
                loading={isLoading}
                size={16}
                aria-label="Loading Spinner"
                data-testid="loader"
                color="#19395F"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  height: "calc(100vh-119px)",
                  justifyContent: "center",
                  alignItems: "center",
                  overflow: "hidden",
                }}
              />
            ) : (
              <>
                <Select
                  ref={selectRef}
                  value={null}
                  onChange={handleChange}
                  onInputChange={handleInputChange}
                  options={searchResults}
                  styles={colourStyles}
                  isSearchable
                  placeholder="Type the client name in to identify the existing client and begin their new case."
                  menuPortalTarget={document.body}
                  filterOption={(option, input) => {
                    const text = `${option.data.for_client?.last_name || "N/A"} ${option.data.for_client?.first_name || "N/A"} ${option.data.for_client?.birthday || "N/A"} ${option.data.case_type?.name || "N/A"} ${option.data.incident_date || "N/A"}`;
                    return text.toLowerCase().includes(input.toLowerCase());
                  }}
                />

                {selectedOption && (
                  <Col
                    md="6"
                    className="tabclient"
                    style={{
                      margin: "20px 0px",
                      paddingLeft: "0px",
                      marginLeft: "-5px",
                    }}
                  >
                    {/* First Name */}
                    <FormGroup as={Row} className="mb-2">
                      <FormLabel column sm="3">
                        First Name:
                      </FormLabel>
                      <Col sm="3">
                        <FormLabel column sm="3" style={{ fontWeight: "bold" }}>
                          {selectedOption.for_client.first_name || "N/A"}
                        </FormLabel>
                      </Col>

                      <FormLabel column sm="3">
                        Last Name:
                      </FormLabel>
                      <Col sm="3">
                        <FormLabel column sm="3" style={{ fontWeight: "bold" }}>
                          {selectedOption.for_client.last_name || "N/A"}
                        </FormLabel>
                      </Col>
                    </FormGroup>

                    {/* Age */}
                    <FormGroup as={Row} className="mb-2">
                      <FormLabel column sm="3">
                        Middle Name:
                      </FormLabel>
                      <Col sm="3">
                        <FormLabel column sm="3" style={{ fontWeight: "bold" }}>
                          {selectedOption.for_client.middle_name || "N/A"}
                        </FormLabel>
                      </Col>
                      <FormLabel column sm="3">
                        Age:
                      </FormLabel>
                      <Col sm="3">
                        <FormLabel
                          column
                          sm="3"
                          style={{ fontWeight: "bold", whiteSpace: "nowrap" }}
                        >
                          {selectedOption.for_client.birthday
                            ? `${calculateAge(selectedOption.for_client.birthday)} years`
                            : "N/A"}
                        </FormLabel>
                      </Col>

                      {/* <FormLabel column sm="3">
                        Birthday:
                      </FormLabel>
                      <Col sm="3">
                        <FormLabel column sm="3" style={{ fontWeight: "bold" }}>
                          {selectedOption.for_client.birthday || "N/A"}
                        </FormLabel>
                      </Col> */}
                    </FormGroup>

                    <FormGroup as={Row} className="mb-2">
                      <FormLabel column sm="3">
                        Birthday:
                      </FormLabel>
                      <Col sm="3">
                        <FormLabel column sm="3" style={{ fontWeight: "bold" }}>
                          {selectedOption.for_client.birthday || "N/A"}
                        </FormLabel>
                      </Col>

                      {selectedOption?.for_client?.phone && (
                        <>
                          <FormLabel column sm="3">
                            Phone:
                          </FormLabel>
                          <Col sm="3">
                            {selectedOption?.for_client?.phone ? (
                              <FormLabel
                                column
                                sm="3"
                                style={{
                                  fontWeight: "bold",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {formatPhoneNumber(
                                  selectedOption.for_client.phone
                                )}
                              </FormLabel>
                            ) : null}
                          </Col>
                        </>
                      )}
                    </FormGroup>
                    {/* )} */}

                    <FormGroup as={Row} className="mb-2 align-items-center">
                      <FormLabel column sm="3">
                        Case Category: <span class="required-aes">*</span>
                      </FormLabel>
                      <Col sm="9">
                        <FormControl
                          as="select"
                          value={selectedCaseCategory || 0}
                          onChange={(e) =>
                            handleCaseCategoryChange(e.target.value)
                          }
                          className="haddress2"
                        >
                          <option value={0}>Select Case Category</option>
                          {caseTypes.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </FormControl>
                      </Col>
                    </FormGroup>

                    <FormGroup as={Row} className="mb-2 align-items-center">
                      <FormLabel column sm="3">
                        Case Type: <span class="required-aes">*</span>
                      </FormLabel>
                      <Col sm="4" className="pr-1">
                        <FormControl
                          as="select"
                          value={data.client_case_type || ""}
                          disabled={selectedCaseCategory === 0}
                          onChange={(e) =>
                            onChange(
                              "client_case_type",
                              parseInt(e.target.value, 10)
                            )
                          }
                          className="haddress2"
                        >
                          <option value={0}>Select Case Type</option>
                          {filteredCaseTypes.map((caseType) => (
                            <option key={caseType.id} value={caseType.id}>
                              {caseType.name}
                            </option>
                          ))}
                        </FormControl>
                      </Col>
                      <FormLabel column sm="2">
                        Incident: <span class="required-aes">*</span>
                      </FormLabel>
                      <Col sm="3" className="pl-1">
                        <FormControl
                          type="date"
                          placeholder="Incident"
                          value={data.client_incident_date || ""}
                          onChange={(e) =>
                            onChange("client_incident_date", e.target.value)
                          }
                          className="haddress2"
                        />
                      </Col>
                    </FormGroup>
                  </Col>
                )}
              </>
            ))}
        </Row>
      </Form>
      <div className="fixed-buttons">
        {currentTab > 0 && (
          <Button variant="secondary" onClick={handleBack}>
            Back
          </Button>
        )}
        {currentTab == 0 && (
          <Button variant="secondary" disabled>
            Back
          </Button>
        )}
        {currentTab < 3 && (
          <Button variant="primary" onClick={handleNext}>
            Next
          </Button>
        )}
        {currentTab == 3 && (
          <Button variant="secondary" disabled>
            Next
          </Button>
        )}
      </div>
    </div>
  );
};

export default TabContentTwo;
