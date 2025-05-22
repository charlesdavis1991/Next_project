import React from "react";
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';

const CustomDropdown = (props) => {
    const icon = (
        <span class="ic has-no-after text-white"><svg width="17" height="50" viewBox="0 0 17 50" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 16H4.59998L8.5 19.95L12.4 16H17L8.5 24.55L0 16Z" fill="currentColor"></path><path d="M0 25.4512H4.59998L8.5 29.4012L12.4 25.4512H17L8.5 34.0012L0 25.4512Z" fill="currentColor"></path></svg></span>
    );


    return (

        <Dropdown className="dropdown-menu-parent"> 
            <Dropdown.Toggle variant="" id="dropdown-basic-button" style={{ marginTop: "-7px" }}>
                {icon}
            </Dropdown.Toggle>

            {props.label && props.label.length > 0 &&
             <Dropdown.Menu className="dropdown-menu">
             {props.label?.map((label, index) => ( 
                 <Dropdown.Item href="#/action-1"  className={`pl-4 ${index % 2 === 0 ? "checkbox-even-background" : "checkbox-odd-background"}`}>
                         <Form.Check aria-label="option 1" label={label || "check box"} className="custom-checkbox" />
                 </Dropdown.Item>
                  ))}
 
             </Dropdown.Menu>
             }
        </Dropdown>

    );
}

export default CustomDropdown;
