import React, { useEffect, useState, useMemo, useRef } from "react";
import {  Form, Row, Col } from "react-bootstrap";
import api from "../../../../../api/api";
import CustomSelect from "../../../../CoPilotPage/CustomSelect";
import { mediaRoute } from "../../../../../Utils/helper";

const PagesTab = ({
    selectedCaseTypes,
    pageId,
    dropdownId,
    setDropdownId,
    setPageId
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
    </>
  );
};

export default PagesTab;
