import React, { useEffect, useState } from "react";
import ActionBarImg from "../../../public/BP_resources/images/icon/defendants-icon-color.svg";
import Button from "react-bootstrap/Button";
import { useSelector } from "react-redux";
import PageChecklist from "../common/PageChecklist";
import AddDefendant from "./DefandantMain/AddDefendant";
import ActionBarComponent from "../common/ActionBarComponent";

function DefendantsActionBar({
  onFetchDefendants,
  pageData,
  defendantsLength,
  isDummy,
  setReducer,
}) {
  const [show, setShow] = useState(false);

  const handleNewDefendantShow = () => setShow(!show);

  const buttonsConfig = [
    // {
    //   label: "Defendants",
    //   icon: "+",
    //   className: "btn btn-primary rounded-0 height-25 p-b-0 p-t-0",
    //   dataToggle: "modal",
    //   dataTarget: "#addDefendant",
    //   onClick: () => handleNewDefendantShow(),
    // },
  ];

  const data = {
    total_defendants: pageData?.total_defendants,
    case_served: pageData?.case_served,
    defendantsLength: defendantsLength,
  };

  const header_name = useSelector((state) => state.header_name?.header_name);

  return (
    <div>
      <ActionBarComponent
        src={ActionBarImg}
        page_name={"Defendants"}
        buttons={buttonsConfig}
        isChecklist={true}
        defendantData={data}
        isDummy={isDummy}
      />
      {/* <div className="action-bar client-BarAlign main-action-bar has-checklist d-flex m-b-5 margin-left-11 overflow-visible">
                <span className="page-icon">
                    <img className="m-l-2" src={ActionBarImg} alt="Incident Folder Icon" />
                    
                </span>
                <div className="title-bar-title text-white d-flex align-items-center p-l-5" style={{paddingRight : "0px!important"}}>
                     <h2 className="text-white"><nobr>Defendants</nobr></h2> 
                </div>
                <div className='text-wrapper text-white d-flex align-items-center p-l-5'>
                    <span className='text-gray-2'>{pageData?.total_defendants}  </span><p className='p-l-5 p-r-5'>Total</p>
                    <span className='text-gray-2'>{pageData?.case_served  }</span><p className='p-l-5  p-r-5'>Served</p>
                </div>
               
                <PageChecklist entity={'Defendants'}/>
                <div className="mobile-action-btns ml-auto">
                    <button className="btn btn-primary rounded-0 position-relative z-index-1 ml-auto height-25 d-flex align-items-center mr-1" id="actionbarToggleBtn"><span className="font-weight-bold pr-2 text-gold">+</span>Actions</button>
                </div>
                <div className="btn-wrapper d-flex justify-content-end px-0">
                    <Button className="btn btn-primary rounded-0 p-b-0 p-t-0 height-25" onClick={handleNewDefendantShow}>
                        <span className="font-weight-bold pr-2 text-gold">+</span>Defendants
                    </Button>
                </div>
            </div> */}

      {/* <!-- Add a New Report to Popup Starts --> */}
      <AddDefendant
        show={show}
        handleClose={handleNewDefendantShow}
        defendantsLength={defendantsLength}
        onFetchDefendants={onFetchDefendants}
        // setReducer = {setReducer}
      />
      {/* <!-- Add a New Report to Popup Ends --> */}
    </div>
  );
}

export default DefendantsActionBar;
