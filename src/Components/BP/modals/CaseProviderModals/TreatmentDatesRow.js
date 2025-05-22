import React, { useState } from "react";
import styled from "styled-components";
import EditDeleteTreatmentDateModal from "../EditDeleteTreatmentDateModal";

function TreatmentDatesRow({
  treatmentDate,
  specialitie,
  contact,
  setAllTreatmentDates,
}) {
  function mixColorWithWhite(hex, percentage) {
    const whitePercentage = (100 - percentage) / 100;

    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);

    // Mix each channel with white
    r = Math.floor(r + (255 - r) * whitePercentage);
    g = Math.floor(g + (255 - g) * whitePercentage);
    b = Math.floor(b + (255 - b) * whitePercentage);

    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  }

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <EditDeleteTreatmentDateModal
        date={treatmentDate}
        show={show}
        handleClose={handleClose}
        setAllTreatmentDates={setAllTreatmentDates}
        key={treatmentDate.id}
      />
      <tr
        id="client_provider_treatment_date"
        className="black-color"
        onClick={handleShow}
      >
        <td className="td-autosize client-location-class bg-speciality-10">
          <div
            style={{
              backgroundColor: mixColorWithWhite(specialitie?.color, 10),
            }}
            className="d-flex align-items-center"
          >
            <div className="d-flex align-items-center justify-content-center">
              <div
                style={{
                  backgroundColor: specialitie?.color,
                }}
                className="d-flex align-items-center justify-content-center text-center text-white specialty-icon"
              >
                {specialitie.name ? specialitie.name[0] : ""}
              </div>
            </div>
            <p className="m-l-5 m-r-5">{contact?.name}</p>
          </div>
        </td>
        <td className="td-autosize client-location-class">
          {treatmentDate.date ? treatmentDate.date.split("T")[0] : ""}
        </td>
        <td className="td-autosize py-2 treatment-note-doc line-height-25"></td>
        <td className="client-location-class line-height-25">
          {treatmentDate.description}
        </td>
        <td className="client-location-class line-height-25"></td>
      </tr>
    </>
  );
}

export default TreatmentDatesRow;
