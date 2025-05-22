import React, { useState,useEffect } from "react";
import TitleBarImg from '../../../public/BP_resources/images/icon/insurance-icon-color.svg';
import api from "../../api/api";
import PanelChecklist from "../common/PanelChecklist";



const TitleBar = ({ insurance_type='',entity_id,entity_name ,record_id,client_name}) => {
  const [name,setName] = useState('')
  


  useEffect(() => {
    const fetchData = async () => {
      
        
          try {
            const response = await api.get('api/insurances/panel_header_entity_name/'+entity_name+'/'+record_id+'/');
            setName(response.data);
        } catch (err) {
            console.log(err)
        } finally {
            
        }
        
    };

    fetchData();
}, []);

  return (
    <div className="border-box has-checklist position-relative" style={{zIndex: '2',paddingLeft:'35px' , right: '1px' }}>
       
      <div className=" title-bar-main-div d-flex flex-row has-title-bg" >
        <PanelChecklist entity={'Insurance'} entity_id={entity_id}/>
        <div style={{position:'absolute',left:"0px",width:"19px",height:"19px"}}>
               <span className="page-icon">
                    <img src={TitleBarImg} alt="Insurance Icon" style={{height:"100%",width:"100%"}} />
                </span>
        </div>
       
        {/* title bar */}
        <div
            style={{paddingLeft:"15px"}}
              className={`top-header height-25 d-flex  responsive-width-of-title  `}
            >
              <div className="top-head-fixed d-flex align-items-center">
              <p className="d-flex align-items-center mr-1 " >
                <small className={`custom-font-14px text-capitalize `}  style={{fontWeight:'600'}}>
                  {insurance_type}
                </small>
              </p>
              <p className="d-flex align-items-center mr-1" >
                <small className="custom-font-14px text-capitalize"  style={{fontWeight:'600'}}>
                   For
                </small>
              </p>
              <p className="d-flex align-items-center mr-1" >
                <small className="custom-font-14px text-capitalize"   style={{fontWeight:'600'}}>
                {/* {entity_name && entity_name == "Client"? `${entity_name} ${client_name}`:(name !='' ? name:'')} */}
                {entity_name && entity_name } {client_name && client_name}
                </small>
              </p>
             
              </div>
            </div>

            <p className="d-flex align-items-center position-relative " style={{right: "0px" ,color:'#ffffff' , zIndex: "1"}} >
                <small className="custom-font-14px"  style={{fontWeight:'600'}}>
                 {insurance_type} Notes
                </small>
            </p>
      
      </div>
    </div>

  );
};

export default TitleBar;
