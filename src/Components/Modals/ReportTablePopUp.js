import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import { getCaseId, getClientId } from "../../Utils/helper";
import {
  deleteReportingAgency,
  updateReportingAgency,
} from "../../Redux/reportingAgencies/reportingAgenciesAdjusterSlice";

function ReportTablePopUp({ ReportTablePopUp, handleClose, report }) {
  const currentCaseId = getCaseId();
  const clientId = getClientId();
  const origin = process.env.REACT_APP_BACKEND_URL;
  const tokenBearer = localStorage.getItem("token");
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reportType, setReportType] = useState([]);
  const { statesData } = useSelector((state) => state.states);

  const [form, setForm] = useState({
    report_type_id: "",
    reporting_agency: "",
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
    enabled: false,
  });

  const getReportTypeHandler = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${origin}/api/report/types/`, {
        headers: {
          Authorization: tokenBearer,
        },
      });
      setReportType(response.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getReportTypeHandler();
  }, []);

  useEffect(() => {
    if (report) {
      setForm({
        report_type_id: report?.report_type_id || "",
        reporting_agency: report?.reporting_agency || "",
        address1: report?.contact_id?.address1 || "",
        address2: report?.contact_id?.address2 || "",
        city: report?.contact_id?.city || "",
        state: report?.contact_id?.state || "",
        zip: report?.contact_id?.zip || "",
        phone: report?.contact_id?.phone_number || "",
        extension: report?.contact_id?.phone_ext || "",
        fax: report?.contact_id?.fax || "",
        email: report?.contact_id?.email || "",
        website: report?.contact_id?.website || "",
        enabled: report?.Enabled || false,
      });
    }
  }, [report]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSaveClick = async () => {
    const updatedReport = {
      id: report.id,
      report_type_id: form.report_type_id,
      reporting_agency: form.reporting_agency,
      address1: form.address1,
      address2: form.address2,
      city: form.city,
      state: form.state,
      zip: form.zip,
      phone: form.phone,
      extension: form.extension,
      fax: form.fax,
      email: form.email,
      website: form.website,
      Enabled: form.enabled,
    };

    setLoading(true);
    try {
      const response = await axios.patch(
        `${origin}/api/agency/report/${clientId}/${currentCaseId}/`,
        updatedReport,
        {
          headers: {
            Authorization: tokenBearer,
          },
        }
      );
      if (response.status === 200) {
        dispatch(
          updateReportingAgency({
            id: report.id,
            updatedData: response.data.data,
          })
        );
        handleClose();
      }
    } catch (error) {
      console.error("Error updating report:", error.message);
      if (error.response) {
        console.error("Error Response:", error.response);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = async () => {
    setLoading(true);
    try {
      const response = await axios.delete(
        `${origin}/api/agency/report/${clientId}/${currentCaseId}/`,
        {
          headers: {
            Authorization: tokenBearer, // Add the token here
          },
          data: {
            id: report.id,
          },
        }
      );
      dispatch(deleteReportingAgency(report.id));
      handleClose();
    } catch (error) {
      setError(error.message || "Error deleting report agent");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      show={ReportTablePopUp}
      onHide={handleClose}
      dialogClassName="modal-dialog-centered Law-firm-direct-max-width-1100px"
    >
      <Modal.Header className="bg-primary p-2">
        <h4 className="modal-title text-white mx-auto">
          Edit Reporting Agency
        </h4>
      </Modal.Header>
      <Modal.Body>
        <div className="row align-items-center form-group">
          <div className="col-md-2 text-left">
            <span className="d-inline-block text-grey">Report Type</span>
          </div>
          <div className="col-md-10">
            <select
              name="report_type_id"
              className="form-control"
              value={form.report_type_id}
              onChange={handleChange}
            >
              {reportType?.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="row align-items-center form-group">
          <div className="col-md-2 text-left">
            <span className="d-inline-block text-grey">Reporting Agency</span>
          </div>
          <div className="col-md-10">
            <input
              type="text"
              placeholder="Enter Reporting Agency"
              value={form.reporting_agency}
              className="form-control"
              name="reporting_agency"
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
              placeholder="Enter Address 1"
              value={form.address1}
              className="form-control"
              name="address1"
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
              placeholder="Address 2"
              value={form.address2}
              className="form-control"
              name="address2"
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
              placeholder="Enter Phone"
              value={form.phone}
              className="form-control"
              name="phone"
              onChange={handleChange}
            />
          </div>
          <div className="col-md-1 text-left">
            <span className="d-inline-block text-grey">Ext.</span>
          </div>
          <div className="col-md-4 pl-0">
            <input
              type="number"
              placeholder="Extension"
              value={form.extension}
              className="form-control"
              name="extension"
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
              placeholder="Enter fax"
              value={form.fax}
              className="form-control"
              name="fax"
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
              placeholder="Enter Email"
              value={form.email}
              class="form-control"
              name="email"
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
              type="url"
              placeholder="Enter Website"
              value={form.website}
              class="form-control"
              name="website"
              onChange={handleChange}
            />
          </div>
        </div>
        <div class="row align-items-center form-group form-check pl-0">
          <div class="col-md-2 text-left">
            <span class="d-inline-block text-grey form-check-label">
              Enabled
            </span>
          </div>
          <div class="col-md-10">
            <input
              type="checkbox"
              className="form-check-input ml-2"
              name="enabled"
              checked={form.enabled}
              onChange={handleChange}
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="mt-2">
        <button
          type="button"
          class="btn btn-secondary h-35px"
          onClick={handleClose}
        >
          Cancel
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
          Save
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default ReportTablePopUp;
