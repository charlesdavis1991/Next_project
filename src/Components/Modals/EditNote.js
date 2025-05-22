import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { useFormik } from "formik";
import api from "../../api/api";

export default function EditNote({ handleClose, show, editNoteData }) {
  const initialValues = {
    description: editNoteData?.description,
  };
  const [loading, setLoading] = useState(false);
  const { values, handleChange, handleSubmit } = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setLoading(true);
      api
        .post(`/api//`, {
          witness_id: editNoteData?.id,
          description: values.description,
        })
        .then((response) => {
          handleClose();
          setLoading(false);
          setStatusUpdate(false);
        })
        .catch((error) => {
          setLoading(false);
        });
    },
  });
  return (
    <Modal show={show} onHide={handleClose} centered className="modal-400w ">
      <div class="modal-header text-center">
        <h5 style={{ color: "black" }}>
          You do not have user permission to edit a case note
        </h5>
      </div>
      <Modal.Body>
        <div>
          <p>
            You can send a message to other team members on this case who have
            this user permission here:
          </p>
          <div className="mt-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Message"
              name="description"
              value={values.description}
              onChange={handleChange}
              required
            />
          </div>
          <button
            type="button"
            className="btn btn-secondary mt-2"
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-secondary mt-2 ml-2"
            onClick={handleSubmit}
          >
            Save
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
