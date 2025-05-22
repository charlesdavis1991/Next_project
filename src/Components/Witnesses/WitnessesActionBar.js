import React, { useState } from "react";
import ActionBarImg from "../../../public/BP_resources/images/icon/defendants-icon-color.svg";
import Button from "react-bootstrap/Button";
import { useSelector } from "react-redux";
import PageChecklist from "../common/PageChecklist";
import AddWitnessModal from "../Modals/AddWitnessModal";
import ActionBarComponent from "../common/ActionBarComponent";

function WitnessesActionBar({
  handleFetchWitnesses,
  isDummy,
  reducerValue,
  setReducer,
  states,
  retainedByList,
}) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const buttonsConfig = [
    {
      label: "Witnesses",
      icon: "+",
      className: "btn btn-primary rounded-0 height-25 p-b-0 p-t-0",
      dataToggle: "modal",
      dataTarget: "#addWitnessModal",
      onClick: () => handleShow(),
    },
  ];
  const header_name = useSelector((state) => state.header_name?.header_name);

  return (
    <div>
      <ActionBarComponent
        src="https://simplefirm-bucket.s3.amazonaws.com/static/BP_resources/images/icon/witnesses-icon-color.svg"
        page_name={"Witnesses"}
        buttons={buttonsConfig}
        isChecklist={true}
        isDummy={isDummy}
      />
      {/* <div className="action-bar client-BarAlign main-action-bar has-checklist d-flex m-b-5 margin-left-11 overflow-visible">
                <span className="page-icon">
                    <img
                        className="translate-note-icon"
                        src="https://simplefirm-bucket.s3.amazonaws.com/static/BP_resources/images/icon/witnesses-icon-color.svg"
                        alt="Witnesses Icon"
                    />
                </span>
                <div className="title-bar-title text-white d-flex align-items-center p-l-5" style={{paddingRight : "0px!important"}}>
                     <h2 className="text-white"><nobr>Witnesses</nobr></h2> 
                </div> */}
      {/* <div className='text-wrapper text-white d-flex align-items-center p-l-5'>
                    <span className='text-gray-2'>{pageData?.total_defendants}  </span><p className='p-l-5 p-r-5'>Total</p>
                    <span className='text-gray-2'>{pageData?.case_served  }</span><p className='p-l-5  p-r-5'>Served</p>
                </div> */}

      {/* <PageChecklist entity={'Witnesses'}/>
               
                <div className="mobile-action-btns ml-auto">
                    <button className="btn btn-primary rounded-0 position-relative z-index-1 ml-auto height-25 d-flex align-items-center mr-1" id="actionbarToggleBtn"><span className="font-weight-bold pr-2 text-gold">+</span>Actions</button>
                </div>
                <div className="btn-wrapper d-flex justify-content-end px-0">
                    <Button className="btn btn-primary rounded-0 p-b-0 p-t-0 height-25" onClick={handleShow}>
                        <span className="font-weight-bold pr-2 text-gold">+</span>Witnesses
                    </Button>
                </div>
            </div> */}

      {show && (
        <AddWitnessModal
          show={show}
          setReducer={setReducer}
          reducerValue={reducerValue}
          handleClose={handleClose}
          setStatusUpdate={handleFetchWitnesses}
          statesAbrs={states}
          retainedByList={retainedByList}
        />
      )}
    </div>
  );
}

export default WitnessesActionBar;
