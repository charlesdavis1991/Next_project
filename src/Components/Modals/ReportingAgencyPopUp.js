import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getCaseId, getClientId } from "../../Utils/helper";
import api from "../../api/api";
import { useForm } from "react-hook-form";
import { addReportingAgency } from "../../Redux/reportingAgencies/reportingAgenciesAdjusterSlice";
import { Modal } from "react-bootstrap";
const initialState = {
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
  reporting_agency: "",
  report_type: "",
  enabled: false,
};
function ReportingAgencyPopUp({ reportingAgencyPopup, handleClose }) {
  const currentCaseId = getCaseId();
  const clientId = getClientId();
  const origin = process.env.REACT_APP_BACKEND_URL;
  const tokenBearer = localStorage.getItem("token");
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reportType, setReportType] = useState([]);
  const { statesData } = useSelector((state) => state.states);
  const [form, setForm] = useState(initialState);

  const getReportTypeHandler = async () => {
    try {
      const response = await axios.get(`${origin}/api/report/types/`, {
        headers: {
          Authorization: tokenBearer,
        },
      });
      setReportType(response.data.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (reportingAgencyPopup) {
      getReportTypeHandler();
    }
  }, [reportingAgencyPopup]);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAgencyReportSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${origin}/api/agency/report/${clientId}/${currentCaseId}/`,
        form,
        {
          headers: {
            Authorization: tokenBearer,
          },
        }
      );

      if (response.status === 200) {
        const responseData = response.data.data;
        dispatch(addReportingAgency(responseData));
        setForm(initialState);
        handleClose();
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const methods = useForm();
  const [searchResults, setSearchResults] = useState([]);
  const [filteredResults, setfilteredResults] = useState([]);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedReportTypeID, setSelectedReportTypeID] = useState(1);
  const { reset } = methods;
  const fetchFilterReportData = async () => {
    try {
      const response = await api.get(`${origin}/api/search_filter_reports/`);
      if (response.status === 200) {
        console.log("Reports Filter", response.data);
        setSearchResults(response.data);
      }
      console.log(response);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };
  useEffect(() => {
    if (reportingAgencyPopup) {
      fetchFilterReportData();
    }
  }, [reportingAgencyPopup]);

  const handleInputChange = (e) => {
    const inputValue = e.target.value.toLowerCase();
    if (inputValue !== "") {
      const filtered = searchResults?.filter((result) => {
        console.log("Filter", result);
        const agency = result.reporting_agency
          ? result.reporting_agency.toLowerCase()
          : "";
        const address1 = result.address1 ? result.address1.toLowerCase() : "";
        const address2 = result.address2 ? result.address2.toLowerCase() : "";
        const city = result.city ? result.city.toLowerCase() : "";
        const state = result.state ? result.state.toLowerCase() : "";

        return (
          agency.startsWith(inputValue) ||
          address1.startsWith(inputValue) ||
          address2.startsWith(inputValue) ||
          city.startsWith(inputValue) ||
          state.startsWith(inputValue)
        );
      });

      setfilteredResults(filtered);
      setIsFiltersOpen(true);
    } else {
      setfilteredResults("");
    }
  };
  const handleSelectAgency = (reportingAgency) => {
    setForm({
      reporting_agency: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      zip: "",
      email: "",
      phone: "",
      extension: "",
      fax: "",
      website: "",
      report_type: "",
    });
    setForm((prevForm) => ({
      ...prevForm,
      reporting_agency: reportingAgency?.reporting_agency || "",
      address1: reportingAgency?.address || "",
      address2: reportingAgency?.address1 || "",
      city: reportingAgency?.city || "",
      state: reportingAgency?.state || "",
      zip: reportingAgency?.zip_code || "",
      email: reportingAgency?.email || "",
      phone: reportingAgency?.phone || "",
      extension: reportingAgency?.phone_ext || "",
      fax: reportingAgency?.fax || "",
      website: reportingAgency?.website || "",
      report_type: reportingAgency?.report_type || "",
    }));

    setSelectedReportTypeID(Number(reportingAgency.report_type));
    setIsFiltersOpen(false);
  };

  const handleCloseForm = () => {
    setForm(initialState);
    handleClose();
  };

  return (
    <Modal
      show={reportingAgencyPopup}
      onHide={handleClose}
      dialogClassName="modal-dialog-centered Law-firm-direct-max-width-1100px"
    >
      <Modal.Header className="bg-primary p-2">
        <h4 className="modal-title text-white mx-auto">Add Report Directory</h4>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          <div className="col-md-12">
            <input
              type="text"
              // onClick="search_filter_reports(this)"
              placeholder="Type Reporting agency name to search directory then click an entry"
              className="form-control mb-3"
              onChange={handleInputChange}
            />
            {Array.isArray(filteredResults) && filteredResults.length > 0 && (
              <div style={{ position: "relative" }}>
                <div
                  className={`${isFiltersOpen ? "block" : "hidden"}`}
                  style={{
                    position: "absolute",
                    zIndex: 1000,
                    backgroundColor: "#fff",
                    border: "1px solid #ccc",
                    width: "100%",
                    maxHeight: "150px",
                    overflowY: "auto",
                  }}
                >
                  {filteredResults?.map((result, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        handleSelectAgency(result);
                        setIsFiltersOpen(false);
                      }}
                      style={{
                        padding: "8px",
                        cursor: "pointer",
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      {result.reporting_agency &&
                        `${result.reporting_agency}, `}
                      {result.address1 && `${result.address1}, `}
                      {result.address2 && `${result.address2}, `}
                      {result.city && `${result.city}, `}
                      {result.state && `${result.state}`}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="row align-items-center form-group">
          <div className="col-md-2 text-left">
            <span className="d-inline-block text-black">Report Type</span>
          </div>
          <div className="col-md-10">
            <select
              name="report_type"
              className="form-control"
              value={form.report_type}
              onChange={handleChange}
            >
              {reportType?.map((item) => (
                <option key={item.id} value={item.value}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="row align-items-center form-group">
          <div className="col-md-2 text-left">
            <span className="d-inline-block text-grey">
              <nobr>Reporting Agency</nobr>
            </span>
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
            <span className="d-inline-block text-grey dispay-none-LFD ">
              CityStateZip
            </span>
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
                <option value="">Select State</option>
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

        <div className="row align-items-center form-group">
          <div className="col-md-2 text-left">
            <span className="d-inline-block text-grey">Email</span>
          </div>
          <div className="col-md-10">
            <input
              type="text"
              placeholder="Enter Email"
              value={form.email}
              className="form-control"
              name="email"
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="row align-items-center form-group">
          <div className="col-md-2 text-left">
            <span className="d-inline-block text-grey">Website</span>
          </div>
          <div className="col-md-10">
            <input
              type="text"
              placeholder="Enter Website"
              value={form.website}
              className="form-control"
              name="website"
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="row align-items-center form-group">
          <div className="col-md-2 text-left">
            <span className="d-inline-block text-grey">Enabled</span>
          </div>
          <div className="col-md-9">
            <input
              type="checkbox"
              checked={form.enabled}
              value={form.enabled}
              className="form-control"
              name="enabled"
              onChange={handleChange}
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="mt-0">
        <button
          type="button"
          className="btn btn-secondary float-left-margin-right-auto"
          onClick={handleCloseForm}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleAgencyReportSubmit}
          className="btn btn-success"
        >
          Save
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default ReportingAgencyPopUp;
