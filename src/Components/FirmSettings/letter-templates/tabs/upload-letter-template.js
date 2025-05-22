import React, { useRef, useState, useEffect,useMemo } from "react";
import useGetUploadLetterTemplate, {
  useUploadLetterTemplate,
} from "../hooks/useUploadLetterTemplate";
import "./upload-template.css";
import { Nav, Tab,Form, Row, Col } from "react-bootstrap";
import api from "../../../../api/api";
import CustomSelect from "../../../CoPilotPage/CustomSelect";

import { mediaRoute,getCaseId } from "../../../../Utils/helper";

const UploadLetterTemplates = ({handleTabChange}) => {
  const caseId = getCaseId();

  const [caseTypeCategories, setCaseTypeCategories] = useState([]);
  const [caseCategoryId, setCaseCategoryId] = useState(""); 
  const [caseTypes, setCaseTypes] = useState([]);
  const [selectedCaseTypes, setSelectedCaseTypes] = useState([]); 


  const [states, setStates] = useState([]);
  const [selectedStates, setSelectedStates] = useState([]); 
  const [jurisdiction, setJurisdiction] = useState("Both"); 

  const [pageId, setPageId] = useState("");
  const [options, setOptions] = useState([]); 
  const [dropdownId, setDropdownId] = useState("");
  const [dropdowns, setDropdowns] = useState([]);
  const [selectedOption, setSelectedOption] = useState({}); 



  const [uploadedFile, setUploadedFile] = useState(null);
  const [templateName, setTemplateName] = useState("");
  const fileInputRef = useRef(null);


  const origin =process.env.REACT_APP_BACKEND_URL || "https://dev.simplefirm.com";
    
  const isSaveDisabled = useMemo(() => {
    console.log("Selected Case Types:", selectedCaseTypes);
    console.log("Selected States:", selectedStates);

    console.log("page IDs:", pageId);
    console.log("dropdown IDs:", dropdownId);

    console.log("Jurisdiction:", jurisdiction);
    console.log("Template Name:", templateName);
    console.log("File Input:",uploadedFile);
    return (
      selectedCaseTypes.length < 1 ||
      selectedStates.length < 1 ||
      !dropdownId ||
      !pageId ||
      !templateName ||
      !uploadedFile
    );
  }, [selectedCaseTypes, selectedStates, dropdownId,pageId,uploadedFile,templateName]);

  const textData = [
    {
      strong: "Start with a Blank Table:",
      p: "Open your Word document and insert a table with no borders. This will serve as your template.",
      explain: [],
    },
    {
      strong: "Add Titles to the Table:",
      p: 'In the first row of your table, type the titles for each column. These titles will describe the type of data each column will show (e.g., "Name," "Price," "Quantity").',
      explain: [],
    },

    {
      strong: "Insert a Loop Code for Data:",
      p: "In the second row, under each title, you'll use a loop to display multiple rows of data. The basic loop looks like this:",
      explain: [
        {
          explaination: "Explanation:",
          ul1: "mpvi is a variable stored in the Variables Table.",
          ul2: "By adding a_ at the beginning, the loop will pull all rows of data for that entity.",
        },
      ],
    },

    {
      strong: "Formatting Values:",
      p: "If you want to display a number next to each row (like a serial number), you can use loop.index:",
      explain: [],
    },

    {
      strong: "Add a Counter to Your Loop:",
      p: "Open your Word document and insert a table with no borders. This will serve as your template.",
      explain: [],
    },
    {
      strong: "Pay Attention to Spacing:",
      p: "When writing your Jinja2 code, make sure there’s a space after (% and before %}. This helps the code run correctly.",
      explain: [],
    },
  ];

  

  const { data } = useGetUploadLetterTemplate();
  const { uploadLetterTemplate } = useUploadLetterTemplate();
  
  const handleFileChange = (event) => {
    setUploadedFile(event.target.files[0]);
  };


  const handleCaseCategory = (value) => {
    setCaseCategoryId(value);

  // Add any other logic needed when the jurisdiction changes
  };

  const fetchCaseTypeCategory = async () => {
    try {
        const response = await api.get(`${origin}/api/case-type-categories/`);
      
        if (response.status === 200) {
            if (response.data.data.length > 0){
              setCaseTypeCategories(response.data.data)

              const selectId = response.data.data.find(item => 
                (item.name == "Personal Injury"));
              setCaseCategoryId(selectId.id)


            }
            else{
              setCaseTypeCategories([])
              setCaseCategoryId("")
            }
          
        }
     
    } catch (error) {
      console.error("Error fetching case types:", error);
    }
  };


    const fetchCaseTypes = async () => {
      try {
        if(caseCategoryId){
        const response = await api.get(`${origin}/api/case-type-categories/?category_id=${caseCategoryId}`);
        if (response.status === 200) {
          if (response.data.data.length > 0){
            setCaseTypes(response.data.data); // Assuming API response has an array of case types
          } else {
            setCaseTypes([])
          }
          setSelectedCaseTypes([])
        }
      }
      } catch (error) {
        console.error("Error fetching case types:", error);
      }
    };

    const fetchStates = async () => {
      try {
        const response = await api.get(`${origin}/api/firmsetting-page/update-copilot-states/`);
    

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


    const fetchPages = async () => {
      try {
        const response = await api.get(`${origin}/api/firmsetting-page/pages-with-dropdowns/`);

        if (response.status === 200) {
          const filteredPages = response.data.filter(page => 
            page.case_types.some(caseTypeId => selectedCaseTypes.includes(caseTypeId.id))
          );

          if (filteredPages.length > 0) {
            const options_data = filteredPages.map((page) => ({
              value: page.id,
              label: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img
                    src={mediaRoute(page.page_icon)}
                    alt="icon"
                    style={{ width: '20px', marginRight: '8px' }}
                  />
                  {page.name}
                </div>
              ),
            }))
            console.log("options_data",options_data)

            setOptions(options_data)
            setPageId(filteredPages[0].id); // Set the ID of the first filtered page
            fetchDropdowns(filteredPages[0].id)
          }
          else{
            setPageId(""); // Set the ID of the first filtered page
            setOptions([])
          }
        }
      } catch (error) {
        console.error("Error fetching case types:", error);
      }
    };

    const fetchDropdowns = async (page_id) => {
      try {
        if(pageId){
          const response = await api.get(`${origin}/api/firmsetting-page/upload-dl-template/?page_id=${page_id}`);
        
          if (response.status === 200) {
              var data = response.data.dropdown_data
              if(data.length > 0){
                setDropdowns(data); // Assuming API response has an array of case types
                setDropdownId(data[0].id)

              } else {
                setDropdownId("")
                setDropdowns([]);
              }
          }
        }
       
      } catch (error) {
        console.error("Error fetching case types:", error);
        
      }
    };


    useEffect(() => {
      console.log("casetypes changed")
      if(selectedCaseTypes.length > 0){
        fetchPages();
      }
      else{
        setPageId(""); // Set the ID of the first filtered page
        setOptions([])
        setSelectedOption({})
        setOptions([]) 
      }
    }, [selectedCaseTypes]);
  
    useEffect(() => {
      if(caseCategoryId){
        fetchCaseTypes();   
      }
    }, [caseCategoryId]);
    

  
      // Call fetchCaseTypeCategory only once when the component mounts
  useEffect(() => {
    fetchCaseTypeCategory();
    fetchStates();
  }, []); // Empty dependency array ensures this runs only once

  useEffect(() => {
    if(options.length == 0){
      setSelectedOption({})
    }
    else{
      setSelectedOption(options[0])
    }
  }, [options]);

  // Handle case type checkbox selection
  const handleCaseTypeSelect = (caseTypeId) => {
    setSelectedCaseTypes((prevSelectedCt) =>
      prevSelectedCt.includes(caseTypeId)
        ? prevSelectedCt.filter((id) => id !== caseTypeId) // Deselect if already selected
        : [...prevSelectedCt, caseTypeId] // Add if not selected
    );
  };

  const handleStateSelect = (StateId) => {
    setSelectedStates((prevSelectedSt) =>
      prevSelectedSt.includes(StateId)
        ? prevSelectedSt.filter((id) => id !== StateId) // Deselect if already selected
        : [...prevSelectedSt, StateId] // Add if not selected
    );
  };

  const handleJurisdictionChange = (value) => {
    setJurisdiction(value);
  };

  const handlePageChange = (value) => {
    setSelectedOption(value);
    setPageId(value.value)
    fetchDropdowns(value.value)
    };


  const handleDropdownChange = (value) => {
    setDropdownId(value);
    };


  const handleUploadTemplate = async () => {
   
    const formData = new FormData();
    formData.append("name", templateName);
    formData.append("case_id", caseId);
    formData.append("j_type", jurisdiction);
    formData.append("page_id", pageId);
    formData.append("dropdown_id", dropdownId);    
    formData.append("file", uploadedFile);
    formData.append("case_types", JSON.stringify(selectedCaseTypes));
    formData.append("states", JSON.stringify(selectedStates));

    await uploadLetterTemplate(formData);
      handleTabChange("letter_templates")
      setTemplateName("");
      setSelectedCaseTypes([])
      setSelectedStates([])
      setUploadedFile(null)
   
  };
  return (
    <>
    <Tab.Container id="left-tabs-example" defaultActiveKey="CaseType">
      
    <Nav variant="tabs" className="justify-content-around">
          <Nav.Link
            eventKey="CaseType"
      
          >
            Case Types
          </Nav.Link>
          <Nav.Link
            eventKey="VenueAndStates"
           
          >
            Venue And States
          </Nav.Link>
          <Nav.Link
            eventKey="Pages"
      
          >
            Pages
          </Nav.Link>
          <Nav.Link
            eventKey="uploaddoc"
          >
            Upload Document
          </Nav.Link>
        </Nav>
     
        <Tab.Content  className="mt-3">
        <Tab.Pane eventKey="CaseType" className="overflow-hidden h-100 upload-template-tab-firmsetting">
        <div className="col-lg-12 mt-3">
        <Form.Group as={Row} controlId="caseTypeSelect" className="ml-3">

        <Form.Label column xs={4} className="text-left">Select  Case Type Category</Form.Label>
                                          <Col xs={3}>
                                          <Form.Control as="select"   className="custom-select-options" onChange={(e) => handleCaseCategory(e.target.value)} value={caseCategoryId}>
                                          {caseTypeCategories.map((item, index) => (
                                            // Check if any selectedCaseTypes are present in the page's case_types array
                                              <option key={item.id} value={item.id}>
                                                {item.name}
                                              </option>
                                          ))}
                                          </Form.Control>
                                          </Col>
        </Form.Group>
        </div>
                                          
                          <div className="row">
                              <div className="copilotstate-columns Nav-state-2-F" >
                                  <ul>
                                      {caseTypes.map((caseType, index) => (
                                          <li className={index != 0 ? ("mt-2"):(null)}>
                                              
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
        </Tab.Pane>
        <Tab.Pane eventKey="VenueAndStates" className="overflow-hidden h-100 upload-template-tab-firmsetting">

        <div className="col-lg-12 mt-3">
                        <Form.Group as={Row} controlId="caseTypeSelect" className="ml-3">
                                        <Form.Label column xs={4} className="text-left">Select Case Jurisdiction</Form.Label>
                                        <Col xs={3}>
                                        <Form.Control as="select"   className="custom-select-options" onChange={(e) => handleJurisdictionChange(e.target.value)}> value={jurisdiction}
                                            <option className="custom-select-options" value="Both">Both</option>
                                            <option className="custom-select-options" value="Federal">Federal</option>
                                            <option className="custom-select-options" value="State">State</option>
                                        </Form.Control>
                                        </Col>
                        </Form.Group>
                        <div className="row mt-1">
                            <div className="copilotstate-columns Nav-state-2-F" >
                                <ul>
                                    {states.map((stateItem, index) => (
                                        <li className={index != 0 ? ("mt-1"):(null)}>
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
        <Tab.Pane eventKey="Pages" className="overflow-hidden h-100 upload-template-tab-firmsetting">
        <div className="col-lg-12 mt-3">
          
        <Form.Group as={Row} controlId="caseTypeSelect" className="ml-3" > 
              <Form.Label column xs={3} className="text-left">Select Page </Form.Label>
              <CustomSelect options={options} colSize={4} handlePageChange={handlePageChange} selectedOption={selectedOption} height={'38px'}/>
        </Form.Group> 

        { pageId ? (<Form.Group as={Row} controlId="caseTypeSelect" className="mt-2 ml-3">
              <Form.Label column xs={3} className="text-left">Select Dropdown</Form.Label>
              <Col xs={4}>
                <Form.Control as="select" className="custom-select-options" onChange={(e) => handleDropdownChange(e.target.value)} value={dropdownId}>
                  {dropdowns.map((dropdown, index) => (
                      <option key={dropdown.id} value={dropdown.id}>
                        {dropdown.name}
                      </option>
                  ))}
                </Form.Control>
              </Col>
        </Form.Group>) : ""}




      </div>
        </Tab.Pane>
        <Tab.Pane eventKey="uploaddoc" className="overflow-hidden h-100 upload-template-tab-firmsetting">
        <div className="form-group">
      <div>
        <h2 className="ml-2" style={{ fontSize: "30px" }}>
          Step-by-Step Guide to Creating a Dynamic Letter Template For All
          Variables
        </h2>
        <ol>
          {textData.map((data, idx) => (
            <li key={idx}>
              <strong>{data.strong}</strong>
              <p>{data.p}</p>
              {data?.explain && (
                <>
                  <p>{data?.explain?.explaination}</p>
                  <ul>
                    {data.explain.map((exp, idx) => (
                      <li key={idx}>
                        <ol>
                          <li>{exp.ul1}</li>
                          <li>{exp.ul2}</li>
                        </ol>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </li>
          ))}
        </ol>
        <div>
          <div className="mb-3">
            <label className="col-sm-2 col-form-label fw-bold">
              Template Name
            </label>
            <div className="col-sm-3">
              <input
                type="text"
                className="form-control"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
              />
            </div>
          </div>
          
          <div className="mb-3">
            <div className="col-sm-3">
              <input
                type="file"
                id="template_file"
                className="d-block"
                name="file"
                style={{ border: "none" }}
                ref={fileInputRef}
                onChange={(e) => handleFileChange(e)}
              />
            </div>
          </div>
         
        </div>
      </div>
    </div>

        </Tab.Pane>
        </Tab.Content>
        </Tab.Container>

        <div className="row">
            <div className="col-sm-3 ml-auto float-right">
              <button
                style={{ fontSize: "14px" }}
                className="btn btn-primary d-flex ml-auto mr-5"
                onClick={handleUploadTemplate}
                disabled={isSaveDisabled}

              >
                Upload Template
              </button>
            </div>
     

        </div>
    </>
      );
};

export default UploadLetterTemplates;
