import React from 'react'
import { useSelector } from 'react-redux';
import PanelChecklist from '../../common/PanelChecklist';
import TitleBarImg from "../../../../public/BP_resources/images/icon/litigation-icon-color.svg"

function CounselTitleBar({object , entity_name , For_instance_name}) {
    const client = useSelector((state) => state.todos.client);

    return (
      <div className="border-box  has-checklist position-relative" style={{zIndex : "2", right: '1px'  }}>
        <div className=" title-bar-main-div d-flex flex-row has-title-bg" >
          <PanelChecklist entity={"Counsel"} entity_id={object.id} /> 
          <div style={{position:'absolute',left:"5px",width:"25px",height:"25px"}}>
               <span className="page-icon">
                    <img src={TitleBarImg} alt="Insurance Icon" style={{height:"100%",width:"100%"}} />
                </span>
        </div>
          <div
              style={{paddingLeft:"50px", marginRight: "5px" }}
                className="top-header height-25 d-flex  responsive-width-of-title "
              >
              <div className="top-head-fixed d-flex align-items-center">
                <h2 className="d-flex align-items-center mr-1" >
                  <small className="custom-font-14px"  style={{fontWeight: "600"}}>
                  {/* Counsel For {object?.opposingcounselcontact?.name}  */}
                  Counsel For {entity_name && entity_name} {For_instance_name && For_instance_name}

                  </small>
                </h2>
              
  
              </div>
  
                
                
              </div>
                
              <h2 className="d-flex align-items-center position-relative " style={{right: "0px"  , zIndex: "1"}} >
                <small className="custom-font-14px"  style={{fontWeight: "600"}}>
                  {object?.counsel_type?.name} Notes
                  </small>
                </h2>
        
         </div>
  
       </div>
  
    );
}

export default CounselTitleBar