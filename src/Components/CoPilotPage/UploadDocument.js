import React, { useEffect, useState, useMemo, useRef } from "react";
import { Button, Nav, Tab, Form, Row, Col, Dropdown } from "react-bootstrap";
import { getCaseId, getClientId } from "../../Utils/helper";
import GenericModalComponent from "../common/Modal/Modal";
import api from "../../api/api";
import "./copilotpage.css";
import { mediaRoute } from "../../Utils/helper";
import Select from "react-select";
import CustomSelect from "./CustomSelect";
import FileUpload from "./FileUpload";
import ButtonLoader from "../Loaders/ButtonLoader";

function UploadDocument({ setShowModal, show, fetchDocumentsData }) {
  const origin = process.env.REACT_APP_BACKEND_URL;
  const tokenBearer = localStorage.getItem("token");
  const caseId = getCaseId();
  const clientId = getClientId();

  const [selectAll, setSelectAll] = useState(false);
  const [selectedTab, setSelectedTab] = useState("ct");
  const [caseTypes, setCaseTypes] = useState([]); // State to hold case types
  const [states, setStates] = useState([]); // State to hold case types
  const [dropdowns, setDropdowns] = useState([]); // State to hold case types
  const [caseTypeCategories, setCaseTypeCategories] = useState([]); // State to hold case types

  const [pageId, setPageId] = useState(""); // State to hold case types
  const [dropdownId, setDropdownId] = useState(""); // State to hold case types

  const [selectedCaseTypes, setSelectedCaseTypes] = useState([]); // State to hold selected checkboxes
  const [selectedStates, setSelectedStates] = useState([]); // State to hold selected checkboxes
  const [jurisdiction, setJurisdiction] = useState("Both"); // Default to 'Both'
  const [caseCategoryId, setCaseCategoryId] = useState(""); // Default to 'Both'
  const [selectedOption, setSelectedOption] = useState({}); // Default to 'Both'
  const [options, setOptions] = useState([]); // Default to 'Both'
  const [selectedFile, setSelectedFile] = useState(null);

  const [buttonLoad, setButtonLoad] = useState(false);
  const selectRef = useRef(null); // Create a ref for the Select component

  // Handle file selection

  const handleClose = () => {
    closeSelect();
    setShowModal(false);
  };

  const isSaveDisabled = useMemo(() => {
    return (
      selectedCaseTypes.length < 1 ||
      selectedStates.length < 1 ||
      !pageId ||
      !dropdownId ||
      !selectedFile
    );
  }, [selectedCaseTypes, selectedStates, pageId, dropdownId, selectedFile]);
  const handleJurisdictionChange = (value) => {
    setJurisdiction(value);

    // Add any other logic needed when the jurisdiction changes
  };

  const handleCaseCategory = (value) => {
    setCaseCategoryId(value);

    // Add any other logic needed when the jurisdiction changes
  };

  const handlePageChange = (value) => {
    setSelectedOption(value);
    setPageId(value.value);
    fetchDropdowns(value.value);
  };

  const handleDropdownChange = (value) => {
    setDropdownId(value);
  };

  const fetchCaseTypes = async () => {
    try {
      if (caseCategoryId) {
        const response = await api.get(
          `${origin}/api/case-type-categories/?category_id=${caseCategoryId}`
        );
        if (response.status === 200) {
          if (response.data.data.length > 0) {
            setCaseTypes(response.data.data); // Assuming API response has an array of case types
          } else {
            setCaseTypes([]);
          }
          setSelectedOption({});
          setPageId("");
          setOptions([]);
          setSelectedCaseTypes([]);
        }
      }
    } catch (error) {
      console.error("Error fetching case types:", error);
    }
  };

  const fetchStates = async () => {
    try {
      const response = await api.get(
        `${origin}/api/firmsetting-page/update-copilot-states/`
      );

      if (response.status === 200) {
        const sortedStates = response.data.states.sort((a, b) => {
          return a.name.localeCompare(b.name); // Sorting alphabetically by 'name'
        });

        setStates(sortedStates); // Assuming API response has an array of case types
      }
    } catch (error) {
      console.error("Error fetching case types:", error);
    }
  };

  const closeSelect = () => {
    if (selectRef.current) {
      selectRef.current.blur(); // Call the blur method to close the dropdown
    }
  };

  const fetchPages = async () => {
    try {
      const response = await api.get(
        `${origin}/api/firmsetting-page/pages-with-dropdowns/`
      );

      if (response.status === 200) {
        const filteredPages = response.data.filter((page) =>
          page.case_types.some((caseTypeId) =>
            selectedCaseTypes.includes(caseTypeId.id)
          )
        );
        if (filteredPages.length > 0) {
          const options_data = filteredPages.map((page) => ({
            value: page.id,
            label: (
              <div style={{ display: "flex", alignItems: "center" }}>
                <img
                  src={mediaRoute(page.page_icon)}
                  alt="icon"
                  style={{ width: "20px", marginRight: "8px" }}
                />
                {page.name}
              </div>
            ),
          }));
          setOptions(options_data);
          setPageId(filteredPages[0].id); // Set the ID of the first filtered page
          fetchDropdowns(filteredPages[0].id);
        } else {
          setPageId(""); // Set the ID of the first filtered page
          setOptions([]);
        }
      }
    } catch (error) {
      console.error("Error fetching case types:", error);
    }
  };

  const fetchDropdowns = async (page_id) => {
    try {
      if (pageId) {
        const response = await api.get(
          `${origin}/api/firmsetting-page/upload-dl-template/?page_id=${page_id}`
        );

        if (response.status === 200) {
          var data = response.data.dropdown_data;
          if (data.length > 0) {
            setDropdowns(data); // Assuming API response has an array of case types
            setDropdownId(data[0].id);
          } else {
            setDropdownId("");
            setDropdowns([]);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching case types:", error);
    }
  };

  const saveTemplate = async () => {
    setButtonLoad(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("case_id", caseId);
    formData.append("j_type", jurisdiction);
    formData.append("page_id", pageId);
    formData.append("dropdown_id", dropdownId);
    formData.append("case_types", JSON.stringify(selectedCaseTypes));
    formData.append("states", JSON.stringify(selectedStates));

    try {
      const response = await api.post(
        `/api/documents/save-copilot-template/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200 && response.data.success) {
        setButtonLoad(false);

        handleClose();
        fetchDocumentsData();
      }
    } catch (error) {
      if (error.response) {
        // If the server responded with a status other than 2xx
        console.error("Error response:", error.response.data);
      } else if (error.request) {
        // If the request was made but no response was received
        console.error("No response received:", error.request);
      } else {
        // Something happened in setting up the request
        console.error("Error:", error.message);
      }
    }
  };

  const fetchCaseTypeCategory = async () => {
    try {
      const response = await api.get(`${origin}/api/case-type-categories/`);

      if (response.status === 200) {
        if (response.data.data.length > 0) {
          setCaseTypeCategories(response.data.data);

          const selectId = response.data.data.find(
            (item) => item.name == "Personal Injury"
          );
          setCaseCategoryId(selectId.id);
        } else {
          setCaseTypeCategories([]);
          setCaseCategoryId("");
        }
      }
    } catch (error) {
      console.error("Error fetching case types:", error);
    }
  };

  // Fetch case types from API on component mount
  useEffect(() => {
    if (show) {
      setSelectedOption({});
      setPageId("");
      setSelectedCaseTypes([]);
      setSelectedStates([]);

      fetchCaseTypeCategory();
      fetchCaseTypes();
      fetchStates();
    }
  }, [show]);

  useEffect(() => {
    if (caseCategoryId) {
      fetchCaseTypes();
    }
  }, [caseCategoryId]);

  useEffect(() => {
    if (selectedCaseTypes.length > 0) {
      fetchPages();
    } else {
      setPageId(""); // Set the ID of the first filtered page
      setOptions([]);
      setSelectedOption({});
      setOptions([]);
    }
  }, [selectedCaseTypes]);

  useEffect(() => {
    if (options.length == 0) {
      setSelectedOption({});
    } else {
      setSelectedOption(options[0]);
    }
  }, [options]);

  // Handle case type checkbox selection
  const handleCaseTypeSelect = (caseTypeId) => {
    setSelectedCaseTypes(
      (prevSelectedCt) =>
        prevSelectedCt.includes(caseTypeId)
          ? prevSelectedCt.filter((id) => id !== caseTypeId) // Deselect if already selected
          : [...prevSelectedCt, caseTypeId] // Add if not selected
    );
  };

  const handleStateSelect = (StateId) => {
    setSelectedStates(
      (prevSelectedSt) =>
        prevSelectedSt.includes(StateId)
          ? prevSelectedSt.filter((id) => id !== StateId) // Deselect if already selected
          : [...prevSelectedSt, StateId] // Add if not selected
    );
  };

  const bodyContent = useMemo(
    () => (
      <Tab.Container id="left-tabs-example" defaultActiveKey="CaseType">
        <Nav variant="tabs" className="justify-content-around">
          <Nav.Link
            eventKey="CaseType"
            onClick={() => {
              setSelectAll(false);
              setSelectedTab("ct");
            }}
          >
            Case Types
          </Nav.Link>
          <Nav.Link
            eventKey="VenueAndStates"
            onClick={() => {
              setSelectAll(false);
              setSelectedTab("vas");
            }}
          >
            Venue And States
          </Nav.Link>
          <Nav.Link
            eventKey="Pages"
            onClick={() => {
              setSelectAll(false);
              setSelectedTab("pg");
            }}
          >
            Pages
          </Nav.Link>
          <Nav.Link
            eventKey="uploaddoc"
            onClick={() => {
              setSelectAll(false);
              setSelectedTab("udt");
            }}
          >
            Upload Document
          </Nav.Link>
        </Nav>

        <Tab.Content>
          <Tab.Pane eventKey="CaseType" className="copilot-tab-pane">
            <div className="col-lg-12 mt-3">
              <Form.Group
                as={Row}
                controlId="caseTypeCategory"
                className="ml-3"
              >
                <Form.Label column xs={4} className="text-left">
                  Select Case Type Category
                </Form.Label>
                <Col xs={3}>
                  <Form.Control
                    as="select"
                    className="custom-select-options"
                    onChange={(e) => handleCaseCategory(e.target.value)}
                    value={caseCategoryId}
                  >
                    {caseTypeCategories.map((item, index) => (
                      // Check if any selectedCaseTypes are present in the page's case_types array
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </Form.Control>
                </Col>
              </Form.Group>
              <div className="row">
                <div className="copilotstate-columns Nav-state-2-F">
                  <ul>
                    {caseTypes.map((caseType, index) => (
                      <li className={index != 0 ? "mt-2" : null}>
                        <Form.Check
                          type="checkbox"
                          label={caseType.name}
                          id={`caseType-${caseType.id}`}
                          onChange={() => handleCaseTypeSelect(caseType.id)}
                          checked={selectedCaseTypes.includes(caseType.id)}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            {/* Case Type checkboxes */}
            {/* <Row>
                          {caseTypes.map((caseType, index) => (
                            <Col key={caseType.id} xs={5}>
                              <Form.Check
                                type="checkbox"
                                label={caseType.name}
                                id={`caseType-${caseType.id}`}
                                onChange={() => handleCaseTypeSelect(caseType.id)}
                                checked={selectedCaseTypes.includes(caseType.id)}
                              />
                            </Col>
                          ))}
                      </Row> */}
          </Tab.Pane>
          <Tab.Pane eventKey="VenueAndStates" className="copilot-tab-pane">
            <div className="col-lg-12 mt-3">
              <Form.Group as={Row} controlId="caseTypeSelect" className="ml-3">
                <Form.Label column xs={4} className="text-left">
                  Select Case Jurisdiction
                </Form.Label>
                <Col xs={3}>
                  <Form.Control
                    as="select"
                    className="custom-select-options"
                    onChange={(e) => handleJurisdictionChange(e.target.value)}
                    value={jurisdiction}
                  >
                    <option className="custom-select-options" value="Both">
                      Both
                    </option>
                    <option className="custom-select-options" value="Federal">
                      Federal
                    </option>
                    <option className="custom-select-options" value="State">
                      State
                    </option>
                  </Form.Control>
                </Col>
              </Form.Group>
              <div className="row mt-1">
                <div className="copilotstate-columns Nav-state-2-F">
                  <ul>
                    {states.map((stateItem, index) => (
                      <li className={index != 0 ? "mt-1" : null}>
                        <Form.Check
                          type="checkbox"
                          label={stateItem.name}
                          id={`state-${stateItem.id}`}
                          onChange={() => handleStateSelect(stateItem.id)}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Tab.Pane>
          <Tab.Pane eventKey="Pages" className="copilot-tab-pane">
            <div className="col-lg-12 mt-3">
              <Form.Group as={Row} controlId="caseTypeSelect" className="ml-3">
                <Form.Label column xs={3} className="text-left">
                  Select Page{" "}
                </Form.Label>
                <CustomSelect
                  options={options}
                  colSize={4}
                  handlePageChange={handlePageChange}
                  selectedOption={selectedOption}
                  height={"38px"}
                />
              </Form.Group>

              {pageId ? (
                <Form.Group
                  as={Row}
                  controlId="caseTypeSelect"
                  className="mt-2 ml-3"
                >
                  <Form.Label column xs={3} className="text-left">
                    Select Dropdown
                  </Form.Label>
                  <Col xs={4}>
                    <Form.Control
                      as="select"
                      className="custom-select-options"
                      onChange={(e) => handleDropdownChange(e.target.value)}
                      value={dropdownId}
                    >
                      {dropdowns.map((dropdown, index) => (
                        <option key={dropdown.id} value={dropdown.id}>
                          {dropdown.name}
                        </option>
                      ))}
                    </Form.Control>
                  </Col>
                </Form.Group>
              ) : (
                ""
              )}
            </div>
          </Tab.Pane>
          <Tab.Pane eventKey="uploaddoc" className="copilot-tab-pane">
            <FileUpload setSelectedFile={setSelectedFile} />
          </Tab.Pane>
        </Tab.Content>
        <div className="d-flex justify-content-between">
          <Button variant="secondary" onClick={handleClose} className="ml-2">
            Close
          </Button>
          <Button
            variant="success"
            onClick={saveTemplate}
            className="ml-2"
            disabled={isSaveDisabled}
          >
            {buttonLoad ? (
              <div className="d-flex align-items-center justify-content-center">
                <span className="d-flex align-items-center">
                  <ButtonLoader />
                </span>
                <span
                  className="d-flex align-items-center"
                  style={{ marginLeft: "8px" }}
                >
                  Saving
                </span>
              </div>
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </Tab.Container>
    ),
    [handleClose, selectedTab, caseTypes, selectedCaseTypes]
  );

  return (
    <GenericModalComponent
      show={show}
      handleClose={handleClose}
      title={
        <>
          <i className="ic ic-29 ic-generate-document m-r-5"></i> Upload Co
          Pilot Document
        </>
      }
      bodyContent={bodyContent}
      dialogClassName="modal-dialog-centered copilot-doc-upload-modal"
      titleClassName="mx-auto d-flex align-items-center justify-content-center font-size-24 height-35 font-weight-semibold text-uppercase popup-heading-color font-weight-500"
      headerClassName="text-center p-0 bg-primary-fixed popup-heading-color justify-content-center"
    />
  );
}

export default UploadDocument;
