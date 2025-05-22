import React, { useEffect, useState, useMemo, useRef } from "react";
import {  Form, Row, Col } from "react-bootstrap";
import api from "../../../../../api/api";

const CaseTypes = ({
    selectedCaseTypes,
    handleCaseTypeSelect,
    caseCategoryId,
    setCaseCategoryId,
    setSelectedCaseTypes
}) => {
    const origin = process.env.REACT_APP_BACKEND_URL;

    const [caseTypes, setCaseTypes] = useState([]); // State to hold case types
    const [caseTypeCategories, setCaseTypeCategories] = useState([]); // State to hold case types


  
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
                  setCaseCategoryId(caseCategoryId)
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
          }
        }
        } catch (error) {
          console.error("Error fetching case types:", error);
        }
      };

      useEffect(() => {
          fetchCaseTypeCategory();
      }, []);


      useEffect(() => {
        if(caseCategoryId){
          fetchCaseTypes();   
        }
      }, [caseCategoryId]);

  return (
    <>
          <div className="col-lg-12 mt-3">
                          <Form.Group as={Row} controlId="caseTypeCategory" className="ml-3">
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
                      </div>
    </>
  );
};

export default CaseTypes;
