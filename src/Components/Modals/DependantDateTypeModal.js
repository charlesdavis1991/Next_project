import React, { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import { addDependantDateType, deleteDependantDateType, updateDependantDateType } from "../../Redux/dependant-date-type-table/dependantDateTypeSlice";

function DependantDateTypeModal({ dateTypePopUp, handleClose, dateTypeData }) {
  const tokenBearer = localStorage.getItem("token");
  const origin = process.env.REACT_APP_BACKEND_URL;
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const { statesData } = useSelector((state) => state.states);
  const [form, setForm] = useState({
    dependent_date_name: dateTypeData?.dependent_date_name || "",
    table_name: dateTypeData?.table_name || "",
    field_name: dateTypeData?.field_name || "",
    state: dateTypeData?.state?.id || "",
    dsdate: dateTypeData?.dsdate || false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;
    
    setForm(prevState => ({
      ...prevState,
      [name]: inputValue
    }));
  };

  const handleDependantDateTypeSubmit = async () => {
    console.error(null);
    if (dateTypeData?.id) {
      try {
        const updatedForm = {
          id: dateTypeData?.id,
          ...form
        };
        const response = await axios.patch(
          `${origin}/api/dependant/date/type/directory/`,
          updatedForm,
          {
            headers: {
              Authorization: tokenBearer,
            },
          }
        );
        if (response.status === 200) {
          handleClose();
          dispatch(
            updateDependantDateType({
              id: dateTypeData.id,
              updatedData: response.data.data,
            })
          );
        }
      } catch (err) {
        console.error(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const response = await axios.post(
          `${origin}/api/dependant/date/type/directory/`,
          form,
          {
            headers: {
              Authorization: tokenBearer,
            },
          }
        );
        if (response.status === 201) {
          handleClose();
          dispatch(
            addDependantDateType(response.data.data)
          );
        }
      } catch (err) {
        console.error(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteButton = async () => {
    try {
      const response = await axios.delete(
        `${origin}/api/dependant/date/type/directory/?id=${dateTypeData.id}`,
        {
          headers: {
            Authorization: tokenBearer,
          },
        }
      );
      if (response.status == 204) {
        handleClose();
        dispatch(deleteDependantDateType(dateTypeData.id));
      }
    } catch (error) {
      console.error("Error deleting insurance company:", error.message);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-container">
          <span class="loader"></span>
        </div>
      </div>
    );
  }

  return (
    <Modal
      show={dateTypePopUp}
      onHide={handleClose}
      dialogClassName="modal-dialog-centered Law-firm-direct-max-width-800px"
    >
      <Modal.Header className="bg-primary text-center p-2">
        {dateTypeData?.id ? <h4 className="modal-title text-white mx-auto">Edit Dependante Date Type</h4> : <h4 className="modal-title text-white mx-auto">Add Dependante Date Type</h4>}

      </Modal.Header>
      <Modal.Body>
        <div className="row align-items-center form-group">
          <div className="col-md-2 text-left">
            <span className="d-inline-block text-grey">Dependent Date Name</span>
          </div>
          <div className="col-10">
            <input
              type="text"
              placeholder="Enter Dependent Date Name"
              value={form?.dependent_date_name}
              className="form-control"
              name="dependent_date_name"
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="row align-items-center form-group">
          <div className="col-2 text-left">
            <span className="d-inline-block text-grey">State</span>
          </div>
          <div className="col-10">
            <select
              name="state"
              className="form-select form-control"
              value={form?.state}
              onChange={handleChange}
            >
              <option value="">Select State</option>
              {statesData?.map((state) => (
                <option key={state.id} value={state.id}>
                  {state.StateAbr}, {state.name}
                </option>
              ))}<div class="col-9"></div>
            </select>
          </div>
        </div>
        <div className="row align-items-center form-group">
          <div className="col-md-2 text-left">
            <span className="d-inline-block text-grey">Table Name</span>
          </div>
          <div className="col-10">
            <input
              type="text"
              placeholder="Enter Table Name"
              value={form?.table_name}
              className="form-control"
              name="table_name"
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="row align-items-center form-group">
          <div className="col-md-2 text-left">
            <span className="d-inline-block text-grey">Field Name</span>
          </div>
          <div className="col-10">
            <input
              type="text"
              placeholder="Enter Field Name"
              value={form?.field_name}
              className="form-control"
              name="field_name"
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="row align-items-center form-group">
          <div className="col-md-2 text-left">
            <span className="d-inline-block text-grey">Is Start Date?</span>
          </div>
          <div className="col-9">
            <input
              type="checkbox"
              checked={form?.dsdate}
              className="form-control"
              style={{accentColor: "grey"}}
              name="dsdate"
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
        {dateTypeData?.id &&
        <button
          type="button"
          className="btn btn-danger"
          onClick={handleDeleteButton}
        >
          Delete
        </button>
        }
        <button
          type="button"
          onClick={handleDependantDateTypeSubmit}
          class="btn btn-success"
        >
          Save
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default DependantDateTypeModal;
