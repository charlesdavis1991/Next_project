import React, {useState} from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';


const DocumentDropDown = () => {
    const [selectedItem, setSelectedItem] = useState('Save Document To Case');

    const handleItemClick = (item) => {
      setSelectedItem(item);
    };
    return (
    <>
        <Dropdown style={{width: "100%"}}   className="custom-dropdown-wrapper d-inline-block">
        <div style={{width: "100%"}}  className='position custom-dropdown-opener'>
            <Dropdown.Toggle
            id="dropdown-custom"
            className="dropdown-toggle form-select has-no-bg text-left d-flex align-items-center height-25 btn btn-default"
            variant="secondary"
            style={{width: "100%"}} 
            >
                <b>{selectedItem}</b>
                <span className="ic has-no-after ic-arrow text-white d-flex align-items-center justify-content-center ml-auto">
                    <svg width="34" height="17" viewBox="0 0 34 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0.00683594 0H9.20684L17.0069 7.85384L24.807 0H34.007L17.0069 17L0.00683594 0Z" fill="currentColor"></path>
                    </svg>
                </span>
            </Dropdown.Toggle>
        </div>
            <Dropdown.Menu className="dropdown-menu w-100 p-0 add-menu" id="dropdown-custom-menu">
                <Dropdown.Item className='dropdown-submenu w-100' onClick={() => handleItemClick('Save Document To Case')}>
                    <i className="icon-file-text mr-1"></i>
                    <b>Save Document To Case</b>
                </Dropdown.Item>
                <Dropdown.Item className='dropdown-submenu w-100' onClick={() => handleItemClick('Case')}>
                    <span className="has-no-after text-primary width-17 right-0 m-l-5 hidden">
                    <img
                        src="https://simplefirm-bucket.s3.amazonaws.com/static/images/case-icon-color_gIGzPMA.svg"
                        alt="Page Icon"
                        className="mr-1 inbox-width-15px-height-15px"
                    />
                    Case
                    </span>
                </Dropdown.Item>
                <Dropdown.Item className='dropdown-submenu w-100' onClick={() => handleItemClick('Client')}>
                    <span className="has-no-after text-primary width-17 right-0 m-l-5 hidden">
                    <img
                        src="https://simplefirm-bucket.s3.amazonaws.com/static/images/client-icon-color_KismKtn.svg"
                        alt="Page Icon"
                        className="mr-1 inbox-width-15px-height-15px"
                    />
                    Client
                    </span>
                </Dropdown.Item>
            </Dropdown.Menu>

        </Dropdown>

    </>
  )
}

export default DocumentDropDown;