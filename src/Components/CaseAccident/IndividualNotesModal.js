import React from "react";
import "../../../public/BP_resources/css/car-accident.css";
import VehicleNotes from "./VehicleNotes";

export default function IndividualNotesModal() {
  return (
    <div
      className="modal generic-popup fade bd-example-modal-lg zoom-in"
      id="individual_notes_modal"
      tabIndex={-1}
      aria-labelledby="individual_notes_modal"

      role="dialog"
    >
      <div className="modal-dialog modal-dialog-centered Accident-max-width-100p-width-66p">
        <div className="modal-content">
         <VehicleNotes />
        </div>
      </div>
    </div>
  );
}
