import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getCaseId, getClientId } from "../../Utils/helper";
import { addInsuranceAdjuster } from "../../Redux/insuranceAdjuster/insuranceAdjusterSlice";
import { Modal } from "react-bootstrap";

const initialState = {
  block_name: "Adjuster",
  company_name: "",
  company_id: "",
  adjuster_fname: "",
  adjuster_lname: "",
  address1: "",
  address2: "",
  city: "",
  state: "",
  zip: "",
  phone: "",
  extension: "",
  fax: "",
  email: "",
};

function InsuranceAdjusterPopUp({ insuranceAdjusterPopup, handleClose }) {
  const tokenBearer = localStorage.getItem("token");
  const currentCaseId = getCaseId();
  const clientId = getClientId();
  const dispatch = useDispatch();
  const origin = process.env.REACT_APP_BACKEND_URL;
  const [searchResults, setSearchResults] = useState([]);
  const [filteredResults, setfilteredResults] = useState([]);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const { statesData } = useSelector((state) => state.states);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(initialState);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    if (insuranceAdjusterPopup) {
      getInsuranceDataHandler();
    }
  }, [insuranceAdjusterPopup]);

  const [conpanyId, setConpanyId] = useState(null);

  useEffect(() => {
    if (insuranceAdjusterPopup) {
      getInsuranceDataHandler();
    }
  }, [insuranceAdjusterPopup]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleCompanyAdjusterSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Attempting to make POST request...");
      const response = await axios.post(
        `${origin}/api/insurance/company/${clientId}/${currentCaseId}/`,
        form,
        {
          headers: {
            Authorization: tokenBearer,
          },
        }
      );
      dispatch(addInsuranceAdjuster(response.data.data));
      handleClose();
      setForm(initialState);
    } catch (err) {
      console.error("Error during POST request:", err.message);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const getInsuranceDataHandler = async () => {
    try {
      const response = await axios.get(
        `${origin}/api/insurance/company/${clientId}/${currentCaseId}/`,
        {
          headers: {
            Authorization: tokenBearer,
          },
        }
      );
      const data = response.data.data?.map((comp) => ({
        ...comp.company_contact,
        company_id: comp.company,
      }));

      setSearchResults(data);
    } catch (err) {
      setError(err);
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value.toLowerCase();
    setSearchInput(e.target.value);
    if (inputValue !== "" && inputValue.length > 2) {
      const filtered = searchResults?.filter((result) => {
        const company = result?.name?.toLowerCase() ?? "";
        const address1 = result?.address1?.toLowerCase() ?? "";
        const address2 = result?.address2?.toLowerCase() ?? "";
        const city = result?.city?.toLowerCase() ?? "";
        const state = result?.state?.toLowerCase() ?? "";

        return (
          company.startsWith(inputValue) ||
          address1.startsWith(inputValue) ||
          address2.startsWith(inputValue) ||
          city.startsWith(inputValue) ||
          state.startsWith(inputValue)
        );
      });

      setfilteredResults(filtered.slice(0, 10));
      setIsFiltersOpen(true);
    } else {
      setfilteredResults("");
    }
  };

  const handleSelectConpany = (company) => {
    console.log(company, "LLLLLLLLLLLLLLLLLLL");
    setForm((prevForm) => ({
      ...prevForm,
      block_name: "Adjuster",
      company_name: company.name || "",
      company_id: company.company_id || "",

      adjuster_fname: company.first_name || "",
      adjuster_lname: company.last_name || "",
      address1: company.address1 || "",
      address2: company.address2 || "",
      city: company.city || "",
      state: company.state || "",
      zip: company.zip || "", // previously `zip_code`
      email: company.email || "",
      phone: company.phone_number || "", // previously `phone`
      extension: company.phone_ext || "",
      fax: company.fax || "",
      website: company.website || "",
    }));

    // setSelectedReportTypeID(Number(reportingAgency.report_type));
    setIsFiltersOpen(false);
  };

  const handleCloseForm = () => {
    setForm(initialState);
    handleClose();
  };

  return (
    <Modal
      show={insuranceAdjusterPopup}
      onHide={handleClose}
      dialogClassName="modal-dialog-centered Law-firm-direct-max-width-1100px"
    >
      <Modal.Header className="bg-primary p-2">
        <h4 className="modal-title text-white mx-auto">Add Adjuster</h4>
      </Modal.Header>
      <Modal.Body>
        <div class="row">
          <div class="col-md-12">
            <input
              type="text"
              value={searchInput}
              placeholder="Type insurance company name to search directory then click an entry"
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
                  }}
                >
                  {filteredResults.map((result, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        handleSelectConpany(result);
                        setIsFiltersOpen(false);
                      }}
                      style={{
                        padding: "8px",
                        cursor: "pointer",
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      {result.name && `${result.name}, `}
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
            <span className="d-inline-block text-grey">
              <nobr>Company Name</nobr>
            </span>
          </div>
          <div className="col-md-10">
            <input
              type="text"
              placeholder="Enter Company Name"
              value={form.company_name}
              className="form-control"
              name="company_name"
              onChange={handleChange}
            />
            <input
              type="hidden"
              placeholder="Enter Company Name"
              value={form.block_name}
              className="form-control"
              name="block_name"
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
              placeholder="Enter First Name"
              value={form.adjuster_fname}
              className="form-control"
              name="adjuster_fname"
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
              placeholder="Enter Last Name"
              value={form.adjuster_lname}
              className="form-control"
              name="adjuster_lname"
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

        <div class="row align-items-center form-group">
          <div class="col-md-2 text-left">
            <span class="d-inline-block text-grey">Email</span>
          </div>
          <div class="col-md-10">
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
      </Modal.Body>
      <Modal.Footer className="mt-0">
        <button
          type="button"
          class="btn btn-secondary float-left-margin-right-auto"
          onClick={() => {
            handleClose();
            setForm(initialState);
            setSearchInput("");
            setIsFiltersOpen(false);
          }}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleCompanyAdjusterSubmit}
          class="btn btn-success"
        >
          Save
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default InsuranceAdjusterPopUp;
