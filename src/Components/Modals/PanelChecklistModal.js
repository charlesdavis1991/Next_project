import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Modal } from "react-bootstrap";
import axios from "axios";
import { addPanelChecklist } from "../../Redux/panelChecklists-table/panelChecklistsSlice";

const initialState = {
  panel_name: "",
  name: "",
  order: "",
  is_extra_credit: false,
  blocking: false,
  defendant_type: "NONE",
};

function PanelChecklistsModal({ addPanelChecklists, handleClose }) {
  const tokenBearer = localStorage.getItem("token");
  const origin = process.env.REACT_APP_BACKEND_URL;
  const dispatch = useDispatch();
  const [pages, setPages] = useState([]);
  const [form, setForm] = useState(initialState);

  const getPagesData = async () => {
    try {
      const response = await axios.get(`${origin}/api/getPages/`, {
        headers: {
          Authorization: tokenBearer,
        },
      });
      console.log(response);
      setPages(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (addPanelChecklists) {
      getPagesData();
    }
  }, [addPanelChecklists]);

  const handleIntChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: parseInt(value),
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        `${origin}/api/panel-checklists/directory/`,
        form,
        {
          headers: {
            Authorization: tokenBearer,
          },
        }
      );
      if (response.status === 201) {
        dispatch(addPanelChecklist(response.data.data));
        handleClose();
        setForm(initialState);
      }
    } catch (err) {
      console.log(err.message || "Something went wrong");
      handleClose();
    }
  };

  const handleCloseModal = () => {
    handleClose();
    setForm(initialState);
  };

  return (
    <Modal
      show={addPanelChecklists}
      onHide={handleCloseModal}
      dialogClassName="modal-dialog-centered Law-firm-direct-max-width-900px"
    >
      <Modal.Header className="bg-primary text-center p-2">
        <h4 className="modal-title mx-auto text-white">Panel Add Checklist</h4>
      </Modal.Header>
      <Modal.Body>
        <div className="row align-items-center form-group">
          <div className="col-3 text-left">
            <span className="d-inline-block text-grey">Name</span>
          </div>
          <div className="col-9">
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
        <div className="row align-items-center form-group">
          <div className="col-3 text-left">
            <span className="d-inline-block text-grey">Page</span>
          </div>
          <div className="col-9">
            <select
              className="form-control"
              value={form?.panel_name}
              name="panel_name"
              onChange={(e) => handleIntChange(e)}
            >
              <option value="">Select a page</option>
              {pages.map((page) => (
                <option key={page?.id} value={page?.id}>
                  {page?.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="row align-items-center form-group">
          <div className="col-3 text-left">
            <span className="d-inline-block text-grey">Defendant Type</span>
          </div>
          <div className="col-9">
            <select
              className="form-control"
              value={form?.defendant_type}
              name="defendant_type"
              onChange={(e) => handleChange(e)}
            >
              <option value="NONE">None</option>
              <option value="PRIVATE">Private</option>
              <option value="PUBLIC">Public</option>
              <option value="COMPANY">Company</option>
            </select>
          </div>
        </div>
        <div className="row align-items-center form-group">
          <div className="col-3 text-left">
            <span className="d-inline-block text-grey">Order</span>
          </div>
          <div className="col-9">
            <input
              type="number"
              placeholder="Enter Specialty"
              value={form?.order}
              className="form-control"
              name="order"
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="row align-items-center form-group">
          <div className="col-md-4 text-left">
            <span className="d-inline-block text-grey">Extra Credit</span>
          </div>
          <div className="col-md-8">
            <input
              type="checkbox"
              checked={form?.is_extra_credit || false}
              className="form-check-input"
              style={{ accentColor: "grey" }}
              name="is_extra_credit"
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="row align-items-center form-group">
          <div className="col-md-4 text-left">
            <span className="d-inline-block text-grey">Blocking</span>
          </div>
          <div className="col-md-8">
            <input
              type="checkbox"
              checked={form?.blocking || false}
              className="form-check-input"
              style={{ accentColor: "grey" }}
              name="blocking"
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
export default PanelChecklistsModal;
