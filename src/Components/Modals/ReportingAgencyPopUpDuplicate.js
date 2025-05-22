import React, { useState, useEffect } from "react";
import axios from "axios";
import { getCaseId, getClientId } from "../../Utils/helper";
import api from "../../api/api";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

function ReportingAgencyPopUpDuplicate({
  reportingAgencyPopup,
  handleClose,
  handleFetchReport,
}) {
  const currentCaseId = getCaseId();
  const clientId = getClientId();
  const origin = process.env.REACT_APP_BACKEND_URL;
  const tokenBearer = localStorage.getItem("token");

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [reportType, setReportType] = useState([]);
  const {statesData} = useSelector((state)=>state.states);
  const [searchResults, setSearchResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedReportTypeID, setSelectedReportTypeID] = useState(null);

  const { reset } = useForm();

  const [form, setForm] = useState({
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
  });

  useEffect(() => {
    const getReportTypeHandler = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${origin}/api/report/types/`);
        setReportType(response.data.data);
      } catch (err) {
        setError(err.message || "Failed to fetch report types");
      } finally {
        setLoading(false);
      }
    };

    getReportTypeHandler();
  }, [origin]);

  useEffect(() => {
    const fetchFilterReportData = async () => {
      try {
        const response = await api.get(`${origin}/api/search_filter_reports/`);
        if (response.status === 200) {
          setSearchResults(response.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (reportingAgencyPopup) {
      fetchFilterReportData();
    }
  }, [origin, reportingAgencyPopup]);

  const handleInputChange = (e) => {
    const inputValue = e.target.value.toLowerCase();
    if (inputValue !== "") {
      const filtered = searchResults.filter((result) => {
        const agency = result.name ? result.name.toLowerCase() : "";
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

      setFilteredResults(filtered);
      setIsFiltersOpen(true);
    } else {
      setFilteredResults([]);
    }
  };
  const handleSelectAgency = (reportingAgency) => {
    setForm((prevForm) => ({
      ...prevForm,
      reporting_agency: reportingAgency.name || "",
      address1: reportingAgency.address1 || "",
      address2: reportingAgency.address2 || "",
      city: reportingAgency.city || "",
      state: reportingAgency.state || "",
      zip: reportingAgency.zip || "",
      email: reportingAgency.email || "",
      phone: reportingAgency.phone || "",
      extension: reportingAgency.extension || "",
      fax: reportingAgency.fax || "",
      website: reportingAgency.website || "",
    }));

    setSelectedReportTypeID(Number(reportingAgency.report_type));
    setIsFiltersOpen(false);
  };

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAgencyReportSubmit = async () => {
    handleFetchReport();
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
        setData(response.data);
        handleClose();
        handleFetchReport();
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`modal generic-popup generic-popup-scroll fade bd-example-modal-md ${reportingAgencyPopup ? "show" : ""}`}
      style={{
        backgroundColor: "rgba(40, 80, 122, 0.5)",
        zIndex: 100000,
        display: reportingAgencyPopup ? "flex" : "none",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        className="modal-dialog modal-lg Law-firm-direct-max-width-800px directory-model"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <div className="modal-content">
          <div className="modal-body">
            <div className="text-center">
              <h5 className="modal-title mb-2 mx-auto">
                Add a New Report Directory
              </h5>
            </div>
            <div className="row">
              <div className="col-md-12">
                <input
                  type="text"
                  placeholder="Type Reporting agency name to search directory then click an entry"
                  className="form-control mb-3"
                  onChange={handleInputChange}
                />
                {Array.isArray(filteredResults) &&
                  filteredResults.length > 0 && (
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
                            onClick={() => handleSelectAgency(result)}
                            style={{
                              padding: "8px",
                              cursor: "pointer",
                              borderBottom: "1px solid #ddd",
                            }}
                          >
                            {result.name} {result.address1} {result.address2}{" "}
                            {result.city} {result.state}
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
                  <option value="">Select Report Type</option>
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
                  placeholder="Enter Address 2"
                  value={form.address2}
                  className="form-control"
                  name="address2"
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="row align-items-center form-group">
              <div className="col-md-2 text-left">
                <span className="d-inline-block text-grey">City</span>
              </div>
              <div className="col-md-10">
                <input
                  type="text"
                  placeholder="Enter City"
                  value={form.city}
                  className="form-control"
                  name="city"
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="row align-items-center form-group">
              <div className="col-md-2 text-left">
                <span className="d-inline-block text-grey">State</span>
              </div>
              <div className="col-md-10">
                <select
                  name="state"
                  className="form-control"
                  value={form.state}
                  onChange={handleChange}
                >
                  <option value="">Select State</option>
                  {statesData?.map((state) => (
                    <option key={state.id} value={state.name}>
                      {state.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="row align-items-center form-group">
              <div className="col-md-2 text-left">
                <span className="d-inline-block text-grey">Zip</span>
              </div>
              <div className="col-md-10">
                <input
                  type="text"
                  placeholder="Enter Zip"
                  value={form.zip}
                  className="form-control"
                  name="zip"
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="row align-items-center form-group">
              <div className="col-md-2 text-left">
                <span className="d-inline-block text-grey">Phone</span>
              </div>
              <div className="col-md-10">
                <input
                  type="text"
                  placeholder="Enter Phone"
                  value={form.phone}
                  className="form-control"
                  name="phone"
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="row align-items-center form-group">
              <div className="col-md-2 text-left">
                <span className="d-inline-block text-grey">Extension</span>
              </div>
              <div className="col-md-10">
                <input
                  type="text"
                  placeholder="Enter Extension"
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
                  placeholder="Enter Fax"
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
              <div className="col-md-10">
                <input
                  type="checkbox"
                  checked={form.enabled}
                  className="form-check-input"
                  name="enabled"
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="text-center">
              {error && <div className="alert alert-danger">{error}</div>}
              {loading ? (
                <div className="spinner-border text-primary" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleAgencyReportSubmit}
                >
                  Submit
                </button>
              )}
              <button
                type="button"
                className="btn btn-secondary ml-2"
                onClick={handleClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportingAgencyPopUpDuplicate;
