import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import { getCaseId, getClientId } from "../../Utils/helper";
import {
  deleteInsuranceCompany,
  updateInsuranceCompany,
} from "../../Redux/insuranceCompany/insuranceCompanySlice";

function InsuranceCompanyTablePopUp({
  insuranceCompanyPopup,
  handleClose,
  insurance,
}) {
  const currentCaseId = getCaseId();
  const clientId = getClientId();
  const origin = process.env.REACT_APP_BACKEND_URL;
  const dispatch = useDispatch();
  const tokenBearer = localStorage.getItem("token");
  const { statesData } = useSelector((state) => state.states);
  const [insuranceTypes, setInsuranceTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    company_name: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    extension: "",
    fax: "",
    email: "",
    website: "",
    insurance_type: "",
    searchable: false,
  });

  const getTypes = async () => {
    try {
      const response = await axios.get(`${origin}/api/insurance/type/`, {
        headers: {
          Authorization: tokenBearer,
        },
      });
      setInsuranceTypes(response.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getTypes();
  }, []);

  useEffect(() => {
    if (insurance) {
      setForm({
        company_name: insurance?.company_contact?.name || "",
        address1: insurance?.company_contact?.address1 || "",
        address2: insurance?.company_contact?.address2 || "",
        city: insurance?.company_contact?.city || "",
        state: insurance?.company_contact?.state || "",
        zip: insurance?.company_contact?.zip || "",
        phone: insurance?.company_contact?.phone_number || "",
        extension: insurance?.company_contact?.phone_ext || "",
        fax: insurance?.company_contact?.fax || "",
        email: insurance?.company_contact?.email || "",
        website: insurance?.company_contact?.website || "",
        searchable: insurance.searchable || false,
        insurance_type: insurance?.insurance_type?.id || "",
      });
    }
  }, [insurance]);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    const updatedInsurance = {
      ...insurance,
      id: insurance.id,
      block_name: "Company",
      name: form.company_name,
      address1: form.address1,
      address2: form.address2,
      city: form.city,
      state: form.state,
      zip: form.zip,
      phone_number: form.phone,
      phone_ext: form.extension,
      fax: form.fax,
      email: form.email,
      website: form.website,
      searchable: form.searchable,
      insurance_type: form.insurance_type,
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
        updateInsuranceCompany({
          id: insurance.id,
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
          },
          headers: {
            Authorization: tokenBearer,
          },
        }
      );
      dispatch(deleteInsuranceCompany(insurance.id));
      handleClose();
    } catch (error) {
      console.error("Error deleting insurance company:", error.message);
    }
  };

  return (
    <Modal
      show={insuranceCompanyPopup}
      onHide={handleClose}
      dialogClassName="modal-dialog-centered Law-firm-direct-max-width-1100px"
    >
      <Modal.Header className="bg-primary p-2">
        <h4 className="modal-title text-white mx-auto">Edit Company</h4>
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
              value={form.company_name}
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
              value={form.address1}
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
              value={form.address2}
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
                placeholder="City"
                value={form.city}
                className="form-control"
                name="city"
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
                placeholder="Zip"
                value={form.zip}
                className="form-control"
                name="zip"
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
              id="phone"
              name="phone"
              value={form.phone}
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
              id="extension"
              name="extension"
              value={form.extension}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="row align-items-center form-group">
          <div className="col-md-2 text-left">
            <span className="d-inline-block text-grey">Type</span>
          </div>
          <div className="col-md-10">
            <select
              name="insurance_type"
              className="form-select form-control"
              value={form.insurance_type}
              onChange={handleChange}
            >
              {form.insurance_type.length === 0 && (
                <option value="">Select Type</option>
              )}
              {insuranceTypes?.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
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
              value={form.fax}
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
              value={form.email}
              onChange={handleChange}
            />
          </div>
        </div>
        <div class="row align-items-center form-group">
          <div class="col-md-2 text-left">
            <span class="d-inline-block text-grey">Website</span>
          </div>
          <div class="col-md-10">
            <input
              type="text"
              className="form-control"
              id="website"
              name="website"
              value={form.website}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="row align-items-center form-group">
          <div className="col-md-2 text-left">
            <span className="d-inline-block text-grey">Searchable</span>
          </div>
          <div className="col-md-10">
            <input
              type="checkbox"
              checked={form.searchable}
              value={form.searchable}
              className="form-control"
              name="searchable"
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
        {insurance && (
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleDeleteButton}
          >
            Delete
          </button>
        )}
        <button
          type="button"
          className="btn btn-success"
          onClick={handleSubmit}
        >
          Save
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default InsuranceCompanyTablePopUp;
