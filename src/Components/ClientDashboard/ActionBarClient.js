//ClientAction Bar
import React, { useEffect, useState, useRef } from "react";
import ActionBarImg from "../../../public/BP_resources/images/icon/client-icon-color.svg";
import PageChecklist from "../common/PageChecklist";
import InsuranceModal from "../ClientDashboard/modals/insurance";
import AddCounselModal from "./modals/counsel";
import CommunicationModalBody from "./modals/communicationModal";
import AddClientModalBody from "./modals/newCaseModal";
import ActionBarComponent from "../common/ActionBarComponent";
import { useSelector } from "react-redux";

export default function ActionBarClient() {
  // const [showInsurance,setShowInsurance] = useState(false)
  // const [showCounsel,setShowCounsel] = useState(false)
  // const [showCommunicationModal,setShowCommunicationModal] = useState(false)
  // const [showClientModal,setShowClientModal] = useState(false)
  // function insuranceHandleClose(){
  //     setShowInsurance(false)
  // }
  // useEffect(()=>{

  // },[showInsurance,showCounsel,showCommunicationModal])

  const [showInsurance, setShowInsurance] = useState(false);
  const [showCounsel, setShowCounsel] = useState(false);
  const [showCommunicationModal, setShowCommunicationModal] = useState(false);
  const [showClientModal, setShowClientModal] = useState(false);

  const handleInsuranceClose = () => setShowInsurance(false);
  const buttonsConfig = [
    {
      label: "Insurance",
      icon: "+",
      className: "btn btn-primary rounded-0 height-25 p-b-0 p-t-0",
      dataToggle: "modal",
      dataTarget: "#addparty",
      onClick: () => setShowInsurance(true),
    },
    {
      label: "Counsel",
      icon: "+",
      className: "btn btn-primary rounded-0 height-25 p-b-0 p-t-0",
      dataToggle: "modal",
      dataTarget: "#addlegalcounsel",
      onClick: () => setShowCounsel(true),
    },
    {
      label: "Communication Preferences",
      className: "btn btn-primary rounded-0 height-25 p-b-0 p-t-0",
      dataToggle: "modal",
      dataTarget: "#addlegalcounsel",
      onClick: () => setShowCommunicationModal(!showCommunicationModal),
    },
    {
      label: "New Case For Client",
      icon: "+",
      className: "btn btn-primary rounded-0 height-25 p-b-0 p-t-0",
      dataToggle: "modal",
      dataTarget: "#addlegalcounsel",
      onClick: () => setShowClientModal(!showClientModal),
    },
  ];
  const header_name = useSelector((state) => state.header_name?.header_name);

  return (
    <>
      <ActionBarComponent
        src={ActionBarImg}
        page_name={"Client"}
        buttons={buttonsConfig}
        isChecklist={true}
      />

      {/* <PageChecklist entity={"Clients"} /> */}

      {showInsurance && (
        <InsuranceModal
          handleClose={handleInsuranceClose}
          show={showInsurance}
        />
      )}
      {showCounsel && (
        <AddCounselModal
          handleClose={() => setShowCounsel(false)}
          show={showCounsel}
        />
      )}
      {showCommunicationModal && (
        <CommunicationModalBody
          handleClose={() => setShowCommunicationModal(false)}
          show={showCommunicationModal}
        />
      )}
      {showClientModal && (
        <AddClientModalBody
          handleClose={() => setShowClientModal(false)}
          show={showClientModal}
        />
      )}
    </>
    // <div className="action-bar client-BarAlign main-action-bar has-checklist d-flex m-b-5 margin-left-11" style={{ overflow: "unset" }}>
    //     <span className="page-icon">
    //         <img className="translate-note-icon" src={ActionBarImg} alt="Client Icon" />
    //     </span>
    //     <div className="text-wrapper text-white d-flex align-items-center pl-3" style={{ position: "relative" }}>
    //         <h2 className="text-white">Clients</h2>
    //     </div>
    //     <PageChecklist entity={'Clients'}/>
    //     <div className="btn-wrapper">
    //         <button type="button" onClick={(e)=>setShowInsurance(true)} className="btn btn-primary rounded-0" data-toggle="modal" data-target="#addparty">
    //             <span className="font-weight-bold pr-2 text-gold">+</span>
    //             Insurance
    //         </button>
    //         <button type="button" className="btn btn-primary rounded-0" onClick={(e)=>setShowCounsel(true)} data-toggle="modal" data-target="#addlegalcounsel">
    //             <span className="font-weight-bold pr-2 text-gold">+</span>
    //             Counsel
    //         </button>
    //         <button type="button" className="btn btn-primary rounded-0" onClick={()=>{setShowCommunicationModal(!showCommunicationModal)}} data-toggle="modal" data-target="#addlegalcounsel">
    //             Communication Preferences
    //         </button>
    //         <button type="button" className="btn btn-primary rounded-0" onClick={()=>{setShowClientModal(!showClientModal)}} data-toggle="modal" data-target="#addlegalcounsel">
    //             <span className="font-weight-bold pr-2 text-gold">+</span>
    //             New Case For Client
    //         </button>
    //     </div>
    //     {showInsurance && <InsuranceModal handleClose={insuranceHandleClose} show={showInsurance}/>}
    //     {showCounsel && <AddCounselModal handleClose={()=>{setShowCounsel(!showCounsel)}} show={showCounsel}/>}
    //     {showCommunicationModal && <CommunicationModalBody handleClose={()=>{setShowCommunicationModal(!showCommunicationModal)}} show={showCommunicationModal}/>}
    //     {showClientModal && <AddClientModalBody handleClose={()=>{setShowClientModal(!showClientModal)}} show={showClientModal}/>}
    // </div>
  );
}
