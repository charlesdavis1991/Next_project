
import React, { useRef } from 'react';
import Select from 'react-select';
import { Button, Nav, Tab, Form, Row, Col, Dropdown } from "react-bootstrap";


function CustomSelect({ options, handlePageChange, selectedOption,colSize,height,selectRef}) {
  // Set the selected option based on the selectedPageId
  
  return (

<Col xs={colSize}>
            <Select
                ref={selectRef}
                options={options}
                value={selectedOption}
                onChange={(optionSelected) => handlePageChange(optionSelected)}
                isSearchable={false}
                
                styles={{
        
                    
                  container: (base) => ({
                      ...base,
                    width: '100%'
                      
                    }),
                }}
              />
            </Col>
            );
        }
        
export default CustomSelect;