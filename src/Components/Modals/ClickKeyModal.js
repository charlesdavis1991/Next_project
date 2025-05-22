import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Modal } from "react-bootstrap";
import axios from "axios";
import { addClickKey } from "../../Redux/clickKeys/clickKeysSlice";

const initialState = {
  click_id: "",
  click_label: "",
  click_short_description: "",
  click_description: "",
}

function ClickKeyModal({addClickKeys, handleClose }) {
  const tokenBearer = localStorage.getItem("token");
  const origin = process.env.REACT_APP_BACKEND_URL;
  const dispatch = useDispatch();
  const [form, setForm] = useState(initialState);

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
        `${origin}/api/click-keys/directory/`,
        form,
        {
          headers: {
            Authorization: tokenBearer,
          },
        }
      );
      if (response.status === 201) {
        handleClose();
        dispatch(addClickKey(response.data.data));
        setForm(initialState);
      }
    } catch (err) {
      console.log(err.message || "Something went wrong");
      handleClose();
    }
  };

  return (
    <Modal
      show={addClickKeys}
      onHide={handleClose}
      dialogClassName="modal-dialog-centered Law-firm-direct-max-width-900px"
    >
      <Modal.Header className="bg-primary text-center p-2">
        <h4 className="modal-title mx-auto text-white">Add Click Key</h4>
      </Modal.Header>
      <Modal.Body>
        <div className="row align-items-center form-group">
          <div className="col-3 text-left">
            <span className="d-inline-block text-grey">Click ID</span>
          </div>
          <div className="col-9">
            <input
              type="number"
              placeholder="Enter ID"
              value={form.click_id}
              className="form-control"
              name="click_id"
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="row align-items-center form-group">
          <div className="col-3 text-left">
            <span className="d-inline-block text-grey">Label</span>
          </div>
          <div className="col-9">
            <input
              type="text"
              placeholder="Enter Label"
              value={form.click_label}
              className="form-control"
              name="click_label"
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="row align-items-center form-group">
          <div className="col-3 text-left">
            <span className="d-inline-block text-grey">Short Description</span>
          </div>
          <div className="col-9">
            <input
              type="text"
              placeholder="Enter Short Description"
              value={form.click_short_description}
              className="form-control"
              name="click_short_description"
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="row align-items-center form-group">
          <div className="col-3 text-left">
            <span className="d-inline-block text-grey">Long Description</span>
          </div>
          <div className="col-9">
            <input
              type="textarea"
              placeholder="Enter Long Description"
              value={form.click_description}
              className="form-control"
              name="click_description"
              onChange={handleChange}
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="mt-0">
        <button
          type="button"
          class="btn btn-secondary float-left-margin-right-auto"
          onClick={handleClose}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          class="btn btn-success"
        >
          Save
        </button>
      </Modal.Footer>
    </Modal>
  );
}
export default ClickKeyModal;
