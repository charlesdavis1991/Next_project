import React, { useState } from "react";
import Dropdown from "./shared/dropdwon";
import Modal from "./modals/modal";
import Insruance from "./modals/insurance";
import Counsel from "./modals/counsel";
import Case from "./modals/newCaseModal";
import Communication from "./modals/communicationModal";

const ClientSubHeader = () => {
    const labelsArray = [
        "Client Address",
        "Client Gender",
        "Client Last Name",
        "Client Email",
        "Client Birthday",
        "Client First Name",
        "Client SSN",
        "Emergency Address",
        "Emergency Last Name",
        "Emergency First Name",
        "Emergency Phone",
        "Client Phone"
      ];
      
      const [insurance, setInsurance] = useState(false);
      const [counsel, setCounsel] = useState(false);
      const [newCase, setNewCase] = useState(false);
      const [communication,setCommunication] = useState(false);
      
      const handleInsurance = () =>{
        setInsurance(!insurance)
      }
      
      const handleCounsel = () =>{
        setCounsel(!counsel)
      }
      
      const handleCommunication = () =>{
        setCommunication(!communication)
      }
      
      const handleCase =() =>{
        setNewCase(!newCase)
      }
      
    return (
        <div className="action-bar-client client-BarAlign main-action-bar  d-flex m-b-5 m-t-5 row">
            <div className="col-md-10 pr-0">
                <div className="d-flex">
                    <div ><span className="page-icon"><img src="/BP_resources/images/icon/client-icon-color.svg" /></span></div>
                    <div className="skew-insurance-sub-header ml-2"></div>
                    <div className="insurance-sub-header w-100">
                        <div className="row">
                            <div className="col-md-2">
                                <div className="ml-2 text-white d-flex">
                                    <div className="text-wrapper text-white d-flex align-items-center p-l-5">
                                        <h3 className="text-white pt-1">Client</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-10">
                                <div className="ml-2 text-white d-flex">
                                    <div className="d-flex align-items-center justify-content-between w-100">
                                        <ul className="search-by-alphabets d-flex list-unstyled">
                                            <li onClick={handleInsurance}>
                                                <button className="btn-primary m-t-02"><span className="font-weight-bold pr-2 text-gold">+</span> Insurance</button></li>
                                            <li onClick={handleCounsel}>
                                                <button className="btn-primary m-t-02 ml-2"><span className="font-weight-bold pr-2 text-gold">+</span> Counsel</button></li>
                                            <li onClick={handleCommunication}><button className="btn-primary m-t-02 ml-2"> Communication Preference</button></li>
                                        </ul>
                                        <div >
                                            <div onClick={handleCase}><button className="btn-primary m-t-02 mr-4"><span className="font-weight-bold pr-2 text-gold">+</span> New Case For Client</button></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <div className="col-md-2 pl-0 pr-0">
                <div className="d-flex">
                    <div className="client-check-list-skew"></div>
                    <div className="client-insurance-checklist w-100 d-flex justify-content-space-between">
                        <div className="d-flex justify-content-space-between">
                            <div class="circlechart" data-percentage="100"><svg class="circle-chart" viewBox="0 0 33.83098862 33.83098862" xmlns="http://www.w3.org/2000/svg"><circle class="circle-chart__background" cx="16.9" cy="16.9" r="15.9"></circle><circle class="circle-chart__circle stroke-green" stroke-dasharray="100,100" cx="16.9" cy="16.9" r="15.9"></circle><g class="circle-chart__info">   <text class="circle-chart__percent" x="17.9" y="12.5">100%</text><text class="circle-chart__subline" x="16.91549431" y="22">   100%
                            </text> </g></svg></div>
                            <span class="ml-2 ic has-no-after ic-check text-success d-flex align-items-center justify-content-center text-brightgreen">
                                <svg width="17" height="50" viewBox="0 0 17 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0 25.5923L2.16281 23.2528L6.69618 27.4438L14.5501 18L17 20.0372L6.99858 32.0626L0 25.5923Z" fill="currentColor"></path>
                                </svg>
                            </span>
                        </div>
                        <div className="d-flex pr-1">
                            <span class="checklist-text text-white ml-5">Client <br /> Page</span>
                                <div className="m-r-15">
                                <Dropdown label={labelsArray} />
                                </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal show={insurance} onHide={()=>setInsurance(false)} size="modal-w70">
                <Insruance hideModal={()=>setInsurance(false)} />
            </Modal>
            <Modal show={counsel} onHide={()=> setCounsel(false)} size="modal-w70">
                <Counsel hideModal={()=> setCounsel(false)} />
            </Modal>
            <Modal show={newCase} onHide={()=> setNewCase(false)} size="modal-w80">
                <Case hideModal={()=> setNewCase(false)} />
            </Modal>
            <Modal show={communication} onHide={()=> setCommunication(false)} size="modal-w70">
                <Communication hideModal={()=> setCommunication(false)} />
            </Modal>
            
        </div>
    )
}

export default ClientSubHeader;