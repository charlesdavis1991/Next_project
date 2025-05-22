import React, { useState,useEffect } from "react"
import api from "../../../../api/api";
import PanelChecklist from "../../../common/PanelChecklist";
import TitleBarImg from "../../../../../public/BP_resources/images/icon/litigation-icon-color.svg"



const TitleBar = ({ insurance_type='',entity_id,entity_name ,record_id,client_name}) => {
  const [name,setName] = useState('Counsel')
  


  return (
    <div className="border-box has-checklist position-relative" style={{zIndex: '2',paddingLeft:'35px',position:'relative',left:'-2.5px', width: "100.3%"}}>
      <div className=" title-bar-main-div d-flex flex-row has-title-bg" >
        <PanelChecklist entity={'Insurance'} entity_id={entity_id}/>
       
        <div style={{position:'absolute',left:"5px",width:"25px",height:"25px"}}>
               <span className="page-icon">
                    <img src={TitleBarImg} alt="Counsel Icon" style={{height:"100%",width:"100%"}} />
                </span>
        </div>
        {/* title bar */}
        <div
            style={{paddingLeft:"15px"}}
              className="top-header height-25 d-flex  responsive-width-of-title "
            >
              <div className="top-head-fixed d-flex align-items-center">
              <h2 className="d-flex align-items-center mr-1" >
                 <small className="custom-font-14px"  style={{fontWeight: "600"}}>
                  {insurance_type}
                </small>
              </h2>
              <h2 className="d-flex align-items-center mr-1" >
                <small className="font-weight-normal">
                Counsel For 
                </small>
              </h2>
              <h2 className="d-flex align-items-center mr-1" >
                 <small className="custom-font-14px"  style={{fontWeight: "600"}}>
                {entity_name && entity_name == "Client"? `${entity_name} ${client_name}`:(name !='' ? name:'')}
                </small>
              </h2>
             
              </div>
            </div>

            <h2 className="d-flex align-items-center position-relative " style={{right: "0px" ,  zIndex: "1"}} >
                 <small className="custom-font-14px"  style={{fontWeight: "600"}}>
                 {insurance_type} Notes
                </small>
            </h2>
      
      </div>
    </div>

  );
};

export default TitleBar;
