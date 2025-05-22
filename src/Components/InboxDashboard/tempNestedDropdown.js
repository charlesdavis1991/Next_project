import React, { useState, useEffect } from 'react';
import { Dropdown } from 'react-bootstrap';
import { fetchPagePanels } from '../../Providers/main';

const TempNestedDropdown = (props) => {
  const [showNestedDropdown, setShowNestedDropdown] = useState(true);
  const [selectedItem, setSelectedItem] = useState(`Select Page for Document:`);
  const [selectedPage, setSelectedPage] = useState(`Select Document Row Icon for Document`);
  const [selectedPageName, setSelectedPageName] = useState();
  const [selectedPageId, setSelectedPageId] = useState();
  const [selectedPageHasPanels, setSelectedPageHasPanels] = useState(false);
  
  const [selectedPanelId, setSelectedPanelId] = useState("-1");
  const [selectedPanelName, setSelectedPanelName] = useState("Select Panel or Document Row Icon for Document");
  const [nestedDropdowns, setNestedDropdowns] = useState([])

  const handlePanelClick = (panel_id, panel_name) => {
    window.document.getElementById("dropdown-2").classList.remove("show")
    setSelectedPanelId(panel_id.toString())
    setSelectedPanelName(panel_name)
  };

  const handleItemClick = (item, page_id, slot) => {
    window.document.getElementById("dropdown-3").classList.remove("show")
    setSelectedPage(item)
    props.setSelectedData({"page_id": page_id, "slot": slot, "panel": selectedPanelId})
  };

  const handlePageSelect = (page_id, page_name, panels) => {
    window.document.getElementById("dropdown-1").classList.remove("show")
    setSelectedPageHasPanels(panels)
    setSelectedPageId(page_id)
    setSelectedPageName(page_name)
    // setSelectedPage("Attach to "+page_name)
    setSelectedItem(`Save Document To ${page_name}`);
    fetchPagePanels(props.case?.id, page_id, page_name, setNestedDropdowns)
  };
  
  return (
    <>
    <Dropdown id='dropdown-1' style={{width: "100%"}}   className="mb-2 custom-dropdown-wrapper d-inline-block1"
        >
            <div style={{ width: "100%" }} className="position custom-dropdown-opener">
    <Dropdown.Toggle
        id="dropdown-custom-1"
        className="bg-white dropdown-toggle form-select has-no-bg text-left d-flex align-items-center height-25 btn btn-default hover-black-text"
        variant="secondary"
        style={{ width: "100%", content: "none", marginBottom: "10px" }}
    >
        <b>Select Page</b>
        <span className="ic has-no-after ic-arrow text-white d-flex align-items-center justify-content-center ml-auto">
            <svg width="34" height="17" viewBox="0 0 34 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.00683594 0H9.20684L17.0069 7.85384L24.807 0H34.007L17.0069 17L0.00683594 0Z" fill="#203f64"></path>
            </svg>
        </span>
    </Dropdown.Toggle>

    <Dropdown.Toggle
        id="dropdown-custom-2"
        className="bg-white dropdown-toggle form-select has-no-bg text-left d-flex align-items-center height-25 btn btn-default hover-black-text"
        variant="secondary"
        style={{ width: "100%", content: "none" }}
    >
        <b>Select</b>
        <span className="ic has-no-after ic-arrow text-white d-flex align-items-center justify-content-center ml-auto">
            <svg width="34" height="17" viewBox="0 0 34 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.00683594 0H9.20684L17.0069 7.85384L24.807 0H34.007L17.0069 17L0.00683594 0Z" fill="#203f64"></path>
            </svg>
        </span>
    </Dropdown.Toggle>
</div>


         {/* <div style={{width: "100%"}}  className='position custom-dropdown-opener'>
            <Dropdown.Toggle
                id="dropdown-custom"
                className="bg-white dropdown-toggle form-select has-no-bg text-left d-flex align-items-center height-25 btn btn-default hover-black-text"
                variant="secondary"
                style={{width: "100%", content: "none"}} 
                >
                <b>Select Page</b>
                <span className="ic has-no-after ic-arrow text-white d-flex align-items-center justify-content-center ml-auto">
                    <svg width="34" height="17" viewBox="0 0 34 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0.00683594 0H9.20684L17.0069 7.85384L24.807 0H34.007L17.0069 17L0.00683594 0Z" fill="#203f64"></path>
                    </svg>
                </span>
            </Dropdown.Toggle>
            <br/>
            <Dropdown.Toggle
                id="dropdown-custom"
                className="bg-white dropdown-toggle form-select has-no-bg text-left d-flex align-items-center height-25 btn btn-default hover-black-text"
                variant="secondary"
                style={{width: "100%", content: "none"}} 
                >
                <b>Select</b>
                <span className="ic has-no-after ic-arrow text-white d-flex align-items-center justify-content-center ml-auto">
                    <svg width="34" height="17" viewBox="0 0 34 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0.00683594 0H9.20684L17.0069 7.85384L24.807 0H34.007L17.0069 17L0.00683594 0Z" fill="#203f64"></path>
                    </svg>
                </span>
            </Dropdown.Toggle>
        </div> */}

      <Dropdown.Menu className="dropdown-menu w-100 p-0 add-menu" id="dropdown-custom-menu" style={{backgroundColor: "#fafbfc"}}>     
        <div className="row" style={{ width: "inherit" }}>
            {props.case ? props.case?.selected_pages?.map((selected_page, index) => (
                <div key={index} className="col-3" style={{backgroundColor: "#fafbfc"}}>
                    <Dropdown show={showNestedDropdown} className='dropdown-submenu w-100' style={{ height: "30px", minWidth: "inherit" }}>
                        <Dropdown.Toggle 
                            className='dropdown-submenu dropdown-item w-100 pl-2'
                            variant="secondary"
                            style={{width: "100%", height: "inherit"}}
                            as={"a"}
                            onClick={(event) => handlePageSelect(selected_page?.id, selected_page?.name, selected_page?.panels)}
                        >
                            <span className="has-no-after text-primary width-17 right-0 m-r-5" style={{ display: "inline-block"}}>
                                <svg width="15" className="vertical-align-mid remove-hover-effect Rot-270Deg" height="15" viewBox="0 0 34 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0.00683594 0H9.20684L17.0069 7.85384L24.807 0H34.007L17.0069 17L0.00683594 0Z" fill="#203f64"></path>
                                </svg>
                            </span>        
                            {selected_page?.page_icon && 
                                <img
                                    src={selected_page?.page_icon}
                                    alt="Page Icon"
                                    className="mr-1 inbox-width-15px-height-15px"
                                />
                            }
                            {selected_page?.name}
                        </Dropdown.Toggle>
                    </Dropdown>
                </div>
            )) : null}
        </div>
    </Dropdown.Menu>

      {/* End Nested Dropdown */}
    </Dropdown>
    
    {
      nestedDropdowns?.data?.length > 0 && 
        <Dropdown id='dropdown-2' style={{width: "100%"}}   className="mb-2 custom-dropdown-wrapper d-inline-block"
        >
          <div style={{width: "100%"}}  className='position custom-dropdown-opener'>
              <Dropdown.Toggle
                  id="dropdown-custom"
                  className="dropdown-toggle form-select has-no-bg text-left d-flex align-items-center height-25 btn btn-default hover-black-text"
                  variant="secondary"
                  style={{width: "100%"}} 
                  >
                  <b>{ !selectedPanelName.includes("Select Panel") ? ("Selected Panel: "+selectedPanelName): selectedPanelName}</b>
                  <span className="ic has-no-after ic-arrow text-white d-flex align-items-center justify-content-center ml-auto">
                      <svg width="34" height="17" viewBox="0 0 34 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M0.00683594 0H9.20684L17.0069 7.85384L24.807 0H34.007L17.0069 17L0.00683594 0Z" fill="#203f64"></path>
                      </svg>
                  </span>
              </Dropdown.Toggle>
          </div>

        <Dropdown.Menu className="dropdown-menu w-100 p-0 add-menu" id="dropdown-custom-menu" style={{backgroundColor: "#fafbfc"}}>     
          <div className="row" style={{ width: "inherit" }}>
          {nestedDropdowns?.data ? nestedDropdowns?.data?.map((dropdown, index) => dropdown?.panel_name != "" ?
              <div key={index} className="col-3" style={{backgroundColor: "#fafbfc"}}>
                <Dropdown show={showNestedDropdown} className='dropdown-submenu w-100' style={{ height: "30px", minWidth: "inherit", backgroundColor: "#fafbfc" }}>
                  <Dropdown.Toggle 
                    className='dropdown-submenu dropdown-item w-100 pl-2'
                    variant="secondary"
                    style={{width: "100%", height: "inherit"}}
                    as={"a"}
                    onClick={() => handlePanelClick(dropdown.id, dropdown.panel_name)}
                  >
                    <span className="has-no-after text-primary width-17 right-0 m-r-5" style={{ display: "inline-block"}}>
                        <svg width="15" className="vertical-align-mid remove-hover-effect Rot-270Deg" height="15" viewBox="0 0 34 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0.00683594 0H9.20684L17.0069 7.85384L24.807 0H34.007L17.0069 17L0.00683594 0Z" fill="#203f64"></path>
                        </svg>
                    </span>
                    {index+1}. {dropdown?.panel_name}
                  </Dropdown.Toggle>
                </Dropdown>
              </div>
              : 
              null
              )
              : null}
              <Dropdown show={showNestedDropdown} className='dropdown-submenu w-100' style={{ height: "30px", minWidth: "inherit", backgroundColor: "#fafbfc" }}>
                <Dropdown.Toggle 
                  className='dropdown-submenu dropdown-item w-100 pl-2'
                  variant="secondary"
                  style={{width: "100%"}}
                  as={"a"}
                  onClick={() => handlePanelClick("-1", "")}  
                >
                  Select Panel
                </Dropdown.Toggle>
              </Dropdown>
            </div>
          </Dropdown.Menu>
        </Dropdown>
    }
    
    
    {
    nestedDropdowns?.document_slots?.length > 0 &&
    <Dropdown id='dropdown-3' style={{width: "100%"}}   className="custom-dropdown-wrapper d-inline-block"
    >
        <div style={{width: "100%"}}  className='position custom-dropdown-opener'>
            <Dropdown.Toggle
                id="dropdown-custom"
                className="dropdown-toggle form-select has-no-bg text-left d-flex align-items-center height-25 btn btn-default hover-black-text"
                variant="secondary"
                style={{width: "100%"}} 
                >
                <b>{ selectedPage }</b>
                <span className="ic has-no-after ic-arrow text-white d-flex align-items-center justify-content-center ml-auto">
                    <svg width="34" height="17" viewBox="0 0 34 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0.00683594 0H9.20684L17.0069 7.85384L24.807 0H34.007L17.0069 17L0.00683594 0Z" fill="#203f64"></path>
                    </svg>
                </span>
            </Dropdown.Toggle>
        </div>

      <Dropdown.Menu className="dropdown-menu w-100 p-0 add-menu" id="dropdown-custom-menu" style={{backgroundColor: "#fafbfc"}}>     
      <div className="row" style={{ width: "inherit" }}>
        {nestedDropdowns?.document_slots && nestedDropdowns?.data?.length > 0 ? nestedDropdowns?.document_slots?.map((dropdown, index) => dropdown?.slot_number != 0 ?
          <div key={index} className="col-3" style={{backgroundColor: "#fafbfc"}}>
          <Dropdown show={showNestedDropdown} className='dropdown-submenu w-100' style={{ height: "30px", minWidth: "inherit", backgroundColor: "#fafbfc" }}>
            <Dropdown.Toggle 
              className='dropdown-submenu dropdown-item w-100 pl-2'
              variant="secondary"
              style={{width: "100%", height: "inherit"}}
              as={"a"}
              onClick={() => handleItemClick(`${dropdown?.slot_number}. ${dropdown?.slot_name ? dropdown?.slot_name : "Available"}`, selectedPageId, dropdown?.id)}
            >
              <span className="has-no-after text-primary width-17 right-0 m-r-5" style={{ display: "inline-block"}}>
                  <svg width="15" className="vertical-align-mid remove-hover-effect Rot-270Deg" height="15" viewBox="0 0 34 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0.00683594 0H9.20684L17.0069 7.85384L24.807 0H34.007L17.0069 17L0.00683594 0Z" fill="#203f64"></path>
                  </svg>
              </span>   
              {dropdown?.slot_number}. {dropdown?.slot_name ? dropdown?.slot_name : "Available"}
            </Dropdown.Toggle>
          </Dropdown>
          </div>
          : 
          null
          )
          : null}
          <Dropdown show={showNestedDropdown} className='dropdown-submenu w-100' style={{ height: "30px", minWidth: "inherit", backgroundColor: "#fafbfc" }}>
            <Dropdown.Toggle 
              className='dropdown-submenu dropdown-item w-100 pl-2'
              variant="secondary"
              style={{width: "100%"}}
              as={"a"}
              onClick={() => handleItemClick(selectedItem?.replace("Save Document To", "Attach to"), selectedPageId, "")}  
            >
              <span className="has-no-after text-primary width-17 right-0 m-r-5" style={{ display: "inline-block"}}>
                  <svg width="15" className="vertical-align-mid remove-hover-effect Rot-270Deg" height="15" viewBox="0 0 34 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0.00683594 0H9.20684L17.0069 7.85384L24.807 0H34.007L17.0069 17L0.00683594 0Z" fill="#203f64"></path>
                  </svg>
              </span>
              {selectedItem?.replace("Save Document To", "Attach to")}
            </Dropdown.Toggle>
          </Dropdown>
      </div>
      </Dropdown.Menu>
    </Dropdown>
    }
    </>
  );
}

export default TempNestedDropdown;
