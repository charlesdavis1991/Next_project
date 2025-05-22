import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import { formatDateForInput } from "../../TreatmentPage/utils/helperFn";

function EditDeleteTreatmentDateModal({
  date,
  show,
  handleClose,
  setAllTreatmentDates,
}) {
  const origin = process.env.REACT_APP_BACKEND_URL;
  const [treatmentDateId, setTreatmentDateId] = useState(date.id);
  const [treatmentDate, setTreatmentDate] = useState();
  const [treatmentNotes, setTreatmentNotes] = useState(date.description);

  useEffect(() => {
    if (show && date.length !== 0) {
      const date1 = formatDateForInput(date.date);
      setTreatmentDate(date1);
    }
  }, [show, date]);

  const handleDelete = async () => {
    try {
      const response = await axios.post(
        `${origin}/api/treatment/delete_treatment_date/`,
        {
          treatment_date_id: treatmentDateId,
        }
      );
      console.log(response, "<<<<<<<<<<<<<");
      setAllTreatmentDates((prevDates) =>
        prevDates.filter((td) => td.id !== treatmentDateId)
      );
      handleClose();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.post(
        `${origin}/api/treatment/delete_treatment_update/`,
        {
          treatment_date_id: treatmentDateId,
          treatment_date_date: treatmentDate,
          treatment_date_note: treatmentNotes,
        }
      );
      console.log(response, "<<<<<<<<<<<<<");
      setAllTreatmentDates((prevDates) =>
        prevDates.map((td) =>
          td.id === treatmentDateId
            ? { ...td, date: treatmentDate, description: treatmentNotes }
            : td
        )
      );
      handleClose();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Body>
        <div className="modal-header">
          <h5 className="modal-title mx-auto">
            Edit or Delete Treatment Date Entry
          </h5>
          <button
            type="button"
            className="btn-close"
            onClick={handleClose}
          ></button>
        </div>
        <div className="modal-body">
          <div className="mb-3">
            <label htmlFor="treatment_date" className="fw-bold">
              Treatment Date
            </label>
            <input
              type="date"
              className="form-control"
              id="treatment_date"
              value={formatDateForInput(treatmentDate)}
              // onChange={(e) => setTreatmentDate(e.target.value)}
              readOnly
            />
          </div>
          <div className="mb-3">
            <label htmlFor="treatment_note" className="fw-bold">
              Treatment Note
            </label>
            <textarea
              id="treatment_note"
              className="form-control"
              value={treatmentNotes}
              onChange={(e) => setTreatmentNotes(e.target.value)}
            ></textarea>
          </div>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleDelete}
          >
            Delete
          </button>
          <button
            type="button"
            className="btn btn-success"
            onClick={handleUpdate}
          >
            Save
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default EditDeleteTreatmentDateModal;
