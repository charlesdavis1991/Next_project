import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import axios from "axios";
import { addStatus } from "../../Redux/status-table/statusesSlice";

function StatusesModal({ addStatuses, handleClose }) {
  const tokenBearer = localStorage.getItem("token");
  const origin = process.env.REACT_APP_BACKEND_URL;
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    name: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        `${origin}/api/statuses/directory/`,
        form,
        {
          headers: {
            Authorization: tokenBearer,
          },
        }
      );
      if (response.status === 201) {
        handleClose();
        dispatch(addStatus(response.data.data));
        setForm({name: ""});
      }
    } catch (err) {
      console.log(err.message || "Something went wrong");
      handleClose();
    }
  };

  const handleCloseModal = () => {
    handleClose();
    setForm({name: ""});
  }

  return (
    <Modal
      show={addStatuses}
      onHide={handleClose}
      dialogClassName="modal-dialog-centered Law-firm-direct-max-width-900px"
    >
      <Modal.Header className="bg-primary text-center p-2">
        <h4 className="modal-title mx-auto text-white">Add Status</h4>
      </Modal.Header>
      <Modal.Body>
        <div className="row align-items-center form-group">
          <div className="col-md-2 text-left">
            <span className="d-inline-block text-grey">Name</span>
          </div>
          <div className="col-md-10">
            <input
              type="text"
              placeholder="Enter Specialty"
              value={form?.name}
              className="form-control"
              name="name"
              onChange={handleChange}
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="mt-0">
        <button
          type="button"
          class="btn btn-secondary float-left-margin-right-auto"
          onClick={handleCloseModal}
        >
          Cancel
        </button>
        <button type="button" onClick={handleSubmit} class="btn btn-success">
          Save
        </button>
      </Modal.Footer>
    </Modal>
  );
}
export default StatusesModal;
