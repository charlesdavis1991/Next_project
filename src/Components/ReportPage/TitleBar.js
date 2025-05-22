import React from "react";
import { useSelector } from "react-redux";
import PanelChecklist from "../common/PanelChecklist";



const TitleBar = ({ ...report }) => {
  const client = useSelector((state) => state.todos.client);
  return (
    <div className="border-box  has-checklist position-relative" style={{zIndex : "2"}}>
      <div className=" title-bar-main-div d-flex flex-row has-title-bg" >
        <PanelChecklist entity={"Reports"} entity_id={report.id} /> 
        <div
            style={{paddingLeft:"50px", marginRight: "5px" }}
              className="top-header height-25 d-flex  responsive-width-of-title "
            >
            <div className="top-head-fixed d-flex align-items-center">
              <h2 className="d-flex align-items-center mr-1" >
                <small style={{fontWeight:"600"}}>
                  {report.contact_title}
                </small>
              </h2>
              <h2 className="d-flex align-items-center mr-1" >
                <small style={{fontWeight:"600"}}>
                  {report.contact_firstname}  {report.contact_lastname}
                </small>
              </h2>
              <h2 className="d-flex align-items-center mr-1" >
                <small style={{fontWeight:"600"}}>
                 {report.reporting_agency_name}
                </small>
              </h2>
              <h2 className="d-flex align-items-center mr-1" >
                <small style={{fontWeight:"600"}}>
                 {report.report_type_name} 
                </small>
              </h2>

            </div>

              
              
            </div>
              
            <p className="d-flex align-items-center position-relative " style={{right: "0px"  , zIndex: "1"}} >
                <small style={{fontSize:"14px",color:"#ffffff",fontWeight:'600'}}>
                 {report.report_type_name} Notes
                </small>
              </p>
      
       </div>

     </div>

  );
};

export default TitleBar;
