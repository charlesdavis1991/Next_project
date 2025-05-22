//LitigationAction Bar
import React, { useState, useCallback } from "react";
import ActionBarImg from "../../../public/BP_resources/images/icon/litigation-icon-color.svg";
import LitigationQuestionsModal from "./Modals/LitigationQuestionsModal";
import { useSelector } from "react-redux";
import ActionBarComponent from "../common/ActionBarComponent";
import AddLitigationActPopup from "./Modals/AddLitigationActPopup";

export default function ActionBarLitigation({LitigationDetail}) {

  const [showPopup, setShowPopup] = useState(false);
  const [showActPopup, setShowActPopup] = useState(false);

   const buttonsConfig = [
    // {
    //   label: "Lit Template 1",
    //   icon: "",
    //   className: "btn btn-primary rounded-0 height-25 p-b-0 p-t-0",
    //   dataToggle: "modal",
    //   dataTarget: "",
    // },
    // {
    //   label: "Lit Template 2",
    //   icon: "",
    //   className: "btn btn-primary rounded-0 height-25 p-b-0 p-t-0",
    //   dataToggle: "modal",
    //   dataTarget: "",
    // },
    // {
    //   label: "Lit Template 3",
    //   icon: "",
    //   className: "btn btn-primary rounded-0 height-25 p-b-0 p-t-0",
    //   dataToggle: "modal",
    //   dataTarget: "",
    // },
    // {
    //   label: "Generate Questions",
    //   icon: "",
    //   className: "btn btn-primary rounded-0 height-25 p-b-0 p-t-0",
    //   dataToggle: "modal",
    //   dataTarget: "",
    //   onClick: () => setShowPopup(true),
    // },
    // {
    //   label: "Litigation Act",
    //   icon: "+",
    //   className: "btn btn-primary rounded-0 height-25 p-b-0 p-t-0",
    //   dataToggle: "modal",
    //   dataTarget: "#addEvent",
    //   onClick: () => setShowActPopup(true),
    // },
  ];


  //const handleCaseClick = () => {setShowPopup(true);};

  const handleClosePopup = useCallback(() => {
    if (showPopup === true) {
      setShowPopup(false);
    } else if (showActPopup === true) {
      setShowActPopup(false);
    }
  }, [showPopup, showActPopup]);

  //const handleEventPopupClick = () => {setShowActPopup(true);};

  const open = useSelector((state) => state?.open?.open);

  return (
    <>
      <ActionBarComponent
        src={ActionBarImg}
        page_name={"Litigation"}
        buttons={buttonsConfig}
        isChecklist={true}
      />
      
    
      {showPopup && (
        <LitigationQuestionsModal
          showPopup={showPopup}
          handleClose={handleClosePopup}
        />
      )}
      {showActPopup && (
        <AddLitigationActPopup
          showPopup={showActPopup}
          handleClose={handleClosePopup}
          litigationDetail={LitigationDetail}
        />
      )}
    </>
  );
}
