import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import { getCaseId, getClientId } from "../../Utils/helper";
import {
  deleteInsuranceAdjuster,
  updateInsuranceAdjuster,
} from "../../Redux/insuranceAdjuster/insuranceAdjusterSlice";

function InsuranceAdjusterTablePopUp({
  insuranceAdjusterPopup,
  handleClose,
  insurance,
}) {
  const currentCaseId = getCaseId();
  const clientId = getClientId();
  const origin = process.env.REACT_APP_BACKEND_URL;
  const tokenBearer = localStorage.getItem("token");
  const dispatch = useDispatch();
  const { statesData } = useSelector((state) => state.states);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    name: "",
    adjuster_ID: "",
    first_name: "",
    last_name: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    phone_number: "",
    phone_ext: "",
    fax: "",
    email: "",
  });
  const latestInsuranceRef = useRef(insurance);

  useEffect(() => {
    if (insurance) {
      setForm({
        name: insurance?.contact?.name || "",
        first_name: insurance?.contact?.first_name || "",
        last_name: insurance?.contact?.last_name || "",
        address1: insurance?.contact?.address1 || "",
        address2: insurance?.contact?.address2 || "",
        city: insurance?.contact?.city || "",
        state: insurance?.contact?.state || "",
        zip: insurance?.contact?.zip || "",
        phone_number: insurance?.contact?.phone_number || "",
        phone_ext: insurance?.contact?.phone_ext || "",
        fax: insurance?.contact?.fax || "",
        email: insurance?.contact?.email || "",
      });

      latestInsuranceRef.current = insurance;
    }
  }, [insurance]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSaveClick = async () => {
    const updatedInsurance = {
      ...latestInsuranceRef.current,
      id: latestInsuranceRef.current.id,
      block_name: "Adjuster",
      first_name: form.first_name,
      last_name: form.last_name,
      address1: form.address1,
      address2: form.address2,
      city: form.city,
      state: form.state,
      zip: form.zip,
      phone_number: form.phone_number,
      phone_ext: form.phone_ext,
      fax: form.fax,
      email: form.email,
      name: form.name,
    };

    try {
      const response = await axios.patch(
        `${origin}/api/insurance/company/${clientId}/${currentCaseId}/`,
        updatedInsurance,
        {
          headers: {
            Authorization: tokenBearer,
          },
        }
      );
      dispatch(
        updateInsuranceAdjuster({
          id: latestInsuranceRef.current.id,
          updatedData: response.data.data,
        })
      );
      handleClose();
    } catch (error) {
      console.error("Error updating insurance company:", error.message);
    }
  };

  const handleDeleteButton = async () => {
    try {
      const response = await axios.delete(
        `${origin}/api/insurance/company/${clientId}/${currentCaseId}/`,
        {
          data: {
            id: insurance.id,
            block_name: "Adjuster",
          },
          headers: {
            Authorization: tokenBearer,
          },
        }
      );
      dispatch(deleteInsuranceAdjuster(insurance.id));
      handleClose();
    } catch (error) {
      console.error("Error deleting insurance company:", error.message);
    }
  };

  return (
    <Modal
      show={insuranceAdjusterPopup ? true : false}
      onHide={handleClose}
      dialogClassName="modal-dialog-centered Law-firm-direct-max-width-1100px"
    >
      <Modal.Header className="bg-primary p-2">
        <h4 className="modal-title text-white mx-auto">Edit Adjuster</h4>
      </Modal.Header>
      <Modal.Body>
        <div className="row align-items-center form-group">
          <div className="col-md-2 text-left">
            <span className="d-inline-block text-grey">
              <nobr>Company Name</nobr>
            </span>
          </div>
          <div className="col-md-10">
            <input
              type="text"
              className="form-control"
              id="company_name"
              name="company_name"
              value={form.name || ""}
              onChange={(e) =>
                setForm((prevForm) => ({
                  ...prevForm,
                  name: e.target.value,
                }))
              }
            />
          </div>
        </div>
        <div className="row align-items-center form-group">
          <div className="col-md-2 text-left">
            <span className="d-inline-block text-grey">First Name</span>
          </div>
          <div className="col-md-10">
            <input
              type="text"
              className="form-control"
              id="first_name"
              name="first_name"
              value={form.first_name || ""}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="row align-items-center form-group">
          <div className="col-md-2 text-left">
            <span className="d-inline-block text-grey">Last Name</span>
          </div>
          <div className="col-md-10">
            <input
              type="text"
              className="form-control"
              id="last_name"
              name="last_name"
              value={form.last_name || ""}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="row align-items-center form-group">
          <div className="col-md-2 text-left">
            <span className="d-inline-block text-grey">Address 1</span>
          </div>
          <div className="col-md-10">
            <input
              type="text"
              className="form-control"
              id="address1"
              name="address1"
              value={form.address1 || ""}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="row align-items-center form-group">
          <div className="col-md-2 text-left">
            <span className="d-inline-block text-grey">Address 2</span>
          </div>
          <div className="col-md-10">
            <input
              type="text"
              className="form-control"
              id="address2"
              name="address2"
              value={form.address2 || ""}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="row align-items-center form-group">
          <div className="col-md-2 text-left">
            <span className="d-inline-block text-grey dispay-none-LFD "></span>
          </div>

          <div className="col-md-10 row">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                id="city"
                name="city"
                value={form.city || ""}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4 PRL15-B1">
              <select
                name="state"
                className="form-select form-control"
                value={form.state}
                onChange={handleChange}
              >
                {form.state?.length ? null : (
                  <option value="">select state</option>
                )}
                {statesData?.map((item) => (
                  <option key={item.id} value={item.StateAbr}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-4 PRL30px">
              <input
                type="text"
                className="form-control"
                id="zip"
                name="zip"
                value={form.zip || ""}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="row align-items-center form-group">
          <div className="col-md-2 text-left">
            <span className="d-inline-block text-grey">Phone</span>
          </div>
          <div className="col-md-5">
            <input
              type="text"
              className="form-control"
              id="phone_number"
              name="phone_number"
              value={form.phone_number || ""}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-1 text-left">
            <span className="d-inline-block text-grey">Ext.</span>
          </div>
          <div className="col-md-4 pl-0">
            <input
              type="text"
              className="form-control"
              id="phone_ext"
              name="phone_ext"
              value={form.phone_ext || ""}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="row align-items-center form-group">
          <div className="col-md-2 text-left">
            <span className="d-inline-block text-grey">Fax</span>
          </div>
          <div className="col-md-10">
            <input
              type="text"
              className="form-control"
              id="fax"
              name="fax"
              value={form.fax || ""}
              onChange={handleChange}
            />
          </div>
        </div>
        <div class="row align-items-center form-group">
          <div class="col-md-2 text-left">
            <span class="d-inline-block text-grey">Email</span>
          </div>
          <div class="col-md-10">
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={form.email || ""}
              onChange={handleChange}
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="mt-0">
        <button
          type="button"
          className="btn btn-secondary h-35px"
          onClick={handleClose}
        >
          Cancel
        </button>
        <button
          type="button"
          className="btn btn-danger"
          onClick={handleDeleteButton}
        >
          Delete
        </button>
        <button
          type="button"
          className="btn btn-success"
          onClick={handleSaveClick}
        >
          Save
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default InsuranceAdjusterTablePopUp;
