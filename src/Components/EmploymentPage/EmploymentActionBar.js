import React, { useState } from "react";
import { Button } from "react-bootstrap";
import EmploymentModal from "./components/EmploymentModal";
import ActionBarComponent from "../common/ActionBarComponent";

function EmploymentActionBar({ handleEmploymentAddedOrEdited, states }) {  // Receive states here
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const buttonsConfig = [
    {
      label: "Employment",
      icon: "+",
      className: "btn btn-primary rounded-0 height-25 p-b-0 p-t-0",
      dataToggle: "modal",
      dataTarget: "#addEmployee",
      onClick: () => handleShow(),
    },
  ];

  return (
    <div>
      <ActionBarComponent
        src="/BP_resources/images/icon/defendants-icon-color.svg"
        page_name="Employment"
        buttons={buttonsConfig}
        isChecklist={true}
      />
      <EmploymentModal
        show={show}
        handleClose={handleClose}
        handleEmploymentAddedOrEdited={handleEmploymentAddedOrEdited}
        states={states}  // Pass states to modal
      />
    </div>
  );
}

export default EmploymentActionBar;
