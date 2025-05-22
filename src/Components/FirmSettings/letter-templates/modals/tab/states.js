import React, { useEffect, useState, useMemo, useRef } from "react";
import {  Form, Row, Col } from "react-bootstrap";
import api from "../../../../../api/api";

const States = ({
    selectedStates,
    handleStateSelect,
    jurisdiction,
    setJurisdiction
}) => {
    const origin = process.env.REACT_APP_BACKEND_URL;

    const [states, setStates] = useState([]); // State to hold case types


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

      const handleJurisdictionChange = (value) => {
        setJurisdiction(value);
      };

      useEffect(() => {
          fetchStates();
      }, []);

  return (
    <>
          <div className="col-lg-12 mt-3">
              <Form.Group as={Row} controlId="caseTypeSelect" className="ml-3">
                  <Form.Label column xs={4} className="text-left">Select Case Jurisdiction</Form.Label>
                  <Col xs={3}>
                      <Form.Control as="select" className="custom-select-options" onChange={(e) => handleJurisdictionChange(e.target.value)} value={jurisdiction}> 
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
                              <li className={index != 0 ? ("mt-1") : (null)}>
                                  <Form.Check
                                      type="checkbox"
                                      label={stateItem.name}
                                      id={`state-${stateItem.id}`}
                                      onChange={() => handleStateSelect(stateItem.id)}
                                      checked={selectedStates.includes(stateItem.id)}

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

export default States;
