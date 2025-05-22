import React, { useEffect, useState, useMemo, useRef } from "react";
import {  Form, Row, Col } from "react-bootstrap";
import api from "../../../../../api/api";
import CustomSelect from "../../../../CoPilotPage/CustomSelect";
import { mediaRoute,formatDate } from "../../../../../Utils/helper";


const CopyTemplateModalBody = ({
  data,
  templateName,
  setTemplateName,
  pageId,
  setPageId,
  dropdownId,
  setDropdownId,
  selectedCaseTypes,
}) => {


  const origin = process.env.REACT_APP_BACKEND_URL;

    const [options, setOptions] = useState([]); // Default to 'Both'
    const [dropdowns, setDropdowns] = useState([]); // State to hold case types
    const [selectedOption, setSelectedOption] = useState({}); // Default to 'Both'

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
              setOptions(options_data)

              if (filteredPages.some(page => page.id === pageId)) {
                fetchDropdowns(pageId)
                const selectedOpt = options_data.find(option => option.value === pageId); 
                setSelectedOption(selectedOpt)
              } else {
                setPageId(filteredPages[0].id); // Set the ID of the first filtered page
                fetchDropdowns(filteredPages[0].id)
                setSelectedOption(options_data[0])

              }
            
              
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
            const response = await api.get(`${origin}/api/firmsetting-page/upload-dl-template/?page_id=${page_id}`);
          
            if (response.status === 200) {
                var data = response.data.dropdown_data
                if(data.length > 0){
                  setDropdowns(data); // Assuming API response has an array of case types
                  if (data.some(dropdown => dropdown.id === dropdownId)) {
                    setDropdownId(dropdownId)
                  } else{
                    setDropdownId(data[0].id)
                  }
  
                } else {
                  setDropdownId("")
                  setDropdowns([]);
                }
            }
          
         
        } catch (error) {
          console.error("Error fetching case types:", error);
          
        }
      };

      useEffect(() => {
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

     
    
      
      


      
     
    
  const handleDropdownChange = (value) => {
    setDropdownId(value);
    };
  const handlePageChange = (value) => {
    setSelectedOption(value);
    setPageId(value.value)
    fetchDropdowns(value.value)
    };


  return (
    <>
      <div className="row align-items-center form-group">
        <div className="col-md-3 text-left">
          <span
            style={{ fontSize: "14px" }}
            className="d-inline-block text-grey"
          >
            Template Name:{" "}
          </span>
        </div>
        <div className="col-md-9">
          <input
            type="text"
            className="form-control"
            placeholder="Template Name"
            value={templateName}
            onChange={setTemplateName}
          />
        </div>
      </div>
      <Form.Group as={Row} controlId="caseTypeSelect" className="row align-items-center form-group" > 
                <Form.Label column xs={3} className="col-md-3 text-left text-grey">Select Page </Form.Label>
                <CustomSelect options={options} colSize={9} handlePageChange={handlePageChange} selectedOption={selectedOption} height={'38px'}/>
      </Form.Group> 
      { pageId ? (<Form.Group as={Row} controlId="caseTypeSelect" className="row align-items-center form-group">
                <Form.Label column xs={3} className="col-md-3 text-left text-grey">Select Dropdown</Form.Label>
                <Col xs={9}>
                  <Form.Control as="select" className="custom-select-options" onChange={(e) => handleDropdownChange(e.target.value)} value={dropdownId}>
                    {dropdowns.map((dropdown, index) => (
                        <option key={dropdown.id} value={dropdown.id}>
                          {dropdown.name}
                        </option>
                    ))}
                  </Form.Control>
                </Col>
          </Form.Group>) : ""}
      <div className="row align-items-center form-group">
        <div className="col-md-3 text-left">
          <span
            style={{ fontSize: "14px" }}
            className="d-inline-block text-grey"
          >
            File Name:{" "}
          </span>
        </div>
        <div className="col-md-9">
          <input
            value={data?.for_template?.template?.file_name}
            disabled={true}
            type="text"
            className="form-control"
          />
        </div>
      </div>
      <div className="row align-items-center form-group">
        <div className="col-md-3 text-left">
          <span
            style={{ fontSize: "14px" }}
            className="d-inline-block text-grey"
          >
            Date Uploaded:{" "}
          </span>
        </div>
        <div className="col-md-9">
          <input
            value={formatDate(data?.for_template?.template?.created)}
            disabled={true}
            type="text"
            className="form-control"
          />
        </div>
      </div>
      <div className="row align-items-center form-group">
        <div className="col-md-3 text-left">
          <span
            style={{ fontSize: "14px" }}
            className="d-inline-block text-grey"
          >
            Firm User:{" "}
          </span>
        </div>
        <div className="col-md-9">
          <div className="d-flex align-items-center form-control">
            {data?.profile_pic ? (
              <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
                <img
                  className="important-z-index-0"
                  src={data?.profile_pic}
                  alt={`${data?.profile_pic} Icon`}
                />
              </span>
            ) : (
              <span className="ic ic-29 ic-avatar"></span>
            )}

            <div className="ml-1 text-black">
              {data?.for_firm_user?.first_name} {data?.for_firm_user?.last_name}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CopyTemplateModalBody;
