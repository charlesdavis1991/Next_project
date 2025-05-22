import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { Modal } from "react-bootstrap";
import { getCaseId, getClientId } from "../../Utils/helper";
import {
  deleteTimeCode,
  updateTimeCode,
} from "../../Redux/time-code/timeCodeSlice";
function TimeCodePopUp({ timeCodesPopup, handleClose, timecode }) {
  const tokenBearer = localStorage.getItem("token");
  const currentCaseId = getCaseId();
  const clientId = getClientId();
  const dispatch = useDispatch();
  const origin = process.env.REACT_APP_BACKEND_URL;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    bill_code_category: "",
    bill_code_category_name: "",
    bill_code_name: "",
    bill_code: "",
    bill_code_definition: "",
  });

  useEffect(() => {
    if (timecode) {
      setForm({
        bill_code_category: timecode.bill_code_category || "",
        bill_code_category_name: timecode.bill_code_category_name || "",
        bill_code: timecode.bill_code || "",
        bill_code_name: timecode.bill_code_name || "",
        bill_code_definition: timecode.bill_code_definition || "",
      });
    }
  }, [timecode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSaveClick = async () => {
    setLoading(true);

    try {
      const updatedTimeCode = {
        ...timecode,
        id: timecode.id,
        bill_code_category: form.bill_code_category,
        bill_code_category_name: form.bill_code_category_name,
        bill_code: form.bill_code,
        bill_code_name: form.bill_code_name,
        bill_code_definition: form.bill_code_definition,
      };

      try {
        const response = await axios.patch(
          `${origin}/api/add/time/code/${clientId}/${currentCaseId}/`,
          updatedTimeCode,
          {
            headers: {
              Authorization: tokenBearer,
            },
          }
        );
        if (response.status) {
          handleClose();
          dispatch(
            updateTimeCode({
              id: timecode.id,
              updatedData: response.data.data,
            })
          );
        }
      } catch (error) {
        console.error("Error Response:", error);
      }
    } catch (err) {
      setError(err);
      alert("An error occurred while updating the time code.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = async () => {
    try {
      console.log("Deleted", timecode.id);

      const response = await axios.delete(
        `${origin}/api/add/time/code/${clientId}/${currentCaseId}/`,
        {
          data: {
            id: timecode.id,
          },
          headers: {
            Authorization: tokenBearer,
          },
        }
      );
      if (response.status === 200) {
        dispatch(deleteTimeCode(timecode.id));
      }
    } catch (error) {
      console.error("Error deleting insurance company:", error.message);
    }
  };

  return (
    <Modal
      show={timeCodesPopup}
      onHide={handleClose}
      dialogClassName="modal-dialog-centered max-width-1500px"
    >
      <Modal.Header className="bg-primary p-2">
        <h4 className="modal-title text-white mx-auto">Edit Time Codes</h4>
      </Modal.Header>
      <Modal.Body className="min-h-400">
        <div className="row align-items-center form-group">
          <div className="col-md-4 text-left">
            <span className="d-inline-block text-grey">
              <nobr>Bill Code Category</nobr>
            </span>
          </div>
          <div className="col-md-8">
            <input
              type="text"
              placeholder="Enter Code Category"
              value={form.bill_code_category}
              className="form-control"
              name="bill_code_category"
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="row align-items-center form-group">
          <div className="col-md-4 text-left">
            <span className="d-inline-block text-grey">
              <nobr>Bill Code Category Name</nobr>
            </span>
          </div>
          <div className="col-md-8">
            <input
              type="text"
              placeholder="Enter Code Category Name"
              value={form.bill_code_category_name}
              className="form-control"
              name="bill_code_category_name"
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="row align-items-center form-group">
          <div className="col-md-4 text-left">
            <span className="d-inline-block text-grey">
              <nobr>Bill Code</nobr>
            </span>
          </div>
          <div className="col-md-8">
            <input
              type="text"
              placeholder="Enter Code"
              value={form.bill_code}
              className="form-control"
              name="bill_code"
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="row align-items-center form-group">
          <div className="col-md-4 text-left">
            <span className="d-inline-block text-grey">
              <nobr>Bill Code Name</nobr>
            </span>
          </div>
          <div className="col-md-8">
            <input
              type="text"
              placeholder="Enter Bill Code Name"
              value={form.bill_code_name}
              className="form-control"
              name="bill_code_name"
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="row align-items-center form-group">
          <div className="col-md-4 text-left">
            <span className="d-inline-block text-grey">
              <nobr>Bill Code Definition</nobr>
            </span>
          </div>
          <div className="col-md-8">
            <textarea
              className="form-control"
              value={form.bill_code_definition}
              name="bill_code_definition"
              rows="5"
              onChange={handleChange}
              style={{height: "140px"}}
            ></textarea>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="mt-0">
        <button
          type="button"
          className="btn btn-secondary h-35px"
          data-dismiss="modal"
          onClick={handleClose}
        >
          Close
        </button>
        <button
          type="button"
          className="btn btn-danger"
          onClick={handleDeleteClick}
        >
          Delete
        </button>
        <button
          type="button"
          className="btn btn-success"
          onClick={handleSaveClick}
        >
          {loading ? "Submitting..." : "Save"}
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default TimeCodePopUp;
