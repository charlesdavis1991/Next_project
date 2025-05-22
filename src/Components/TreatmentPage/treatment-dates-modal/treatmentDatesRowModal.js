import React, { useState } from "react";
import styled from "styled-components";
import EditDeleteTreatmentDateModal from "../../BP/modals/EditDeleteTreatmentDateModal";
import "./treatmentDatesModal.css";
import {
  formatDateForInput,
  formatDateForInputTreatment,
  formatDateForInputTreatmentDatesModal,
} from "../utils/helperFn";

function TreatmentDatesNewRow({
  treatmentDate,
  specialitie,
  contact,
  setAllTreatmentDates,
}) {
  return (
    <>
      {/* <EditDeleteTreatmentDateModal
        date={treatmentDate}
        show={show}
        handleClose={handleClose}
        setAllTreatmentDates={setAllTreatmentDates}
        key={treatmentDate.id}
      /> */}
      <tr className={`height-25`} id="">
        <td
          className=""
          style={{
            height: "25px",
            backgroundColor:
              treatmentDate?.selectedSpecialtyProvider?.specialty?.color,
          }}
        >
          <div
            style={{
              backgroundColor:
                treatmentDate?.selectedSpecialtyProvider?.specialty?.color,
            }}
            className="d-flex align-items-center"
          >
            <div className="d-flex align-items-center justify-content-center">
              <div
                style={{
                  backgroundColor:
                    treatmentDate?.selectedSpecialtyProvider?.specialty?.color,
                }}
                className="d-flex align-items-center justify-content-center text-center text-white specialty-icon"
              >
                {treatmentDate?.selectedSpecialtyProvider?.specialty?.name
                  ? treatmentDate?.selectedSpecialtyProvider?.specialty?.name[0]
                  : ""}
              </div>
            </div>
            <p
              className="m-l-5 m-r-5"
              id="color-black-important-row"
              style={{ fontWeight: "600" }}
            >
              {
                treatmentDate?.selectedSpecialtyProvider?.provider
                  ?.providerprofile_office_name
              }
            </p>
          </div>
        </td>
        <td
          className="td-autosize client-location-class"
          id="dates-new-provider-padding"
          style={{ fontWeight: "600" }}
        >
          {treatmentDate.date
            ? formatDateForInputTreatmentDatesModal(
                treatmentDate.date.split("T")[0]
              )
            : ""}
        </td>
        <td
          className="td-autosize py-2 treatment-note-doc line-height-25"
          id="dates-new-provider-padding"
        ></td>
        <td
          className="client-location-class line-height-25"
          style={{ fontWeight: "600" }}
        >
          {treatmentDate.description}
        </td>
        {/* <td className="client-location-class line-height-25"></td> */}
      </tr>
    </>
  );
}

export default TreatmentDatesNewRow;
