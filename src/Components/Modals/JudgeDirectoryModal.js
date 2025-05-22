import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getCaseId, getClientId } from "../../Utils/helper";
import { addJudge } from "../../Redux/judge-table/judgeSlice";
import { Modal } from "react-bootstrap";
const initialState = {
  judge_name: "",
  judge_firstname: "",
  judge_middlename: "",
  judge_lastname: "",
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
  court_id: "1",
  department_id: "",
};
function JudgeDirectoryModal({ judgePopUp, handleClose }) {
  const tokenBearer = localStorage.getItem("token");
  const currentCaseId = getCaseId();
  const clientId = getClientId();
  const origin = process.env.REACT_APP_BACKEND_URL;
  const dispatch = useDispatch();
  const [courtData, setCourtData] = useState([]);
  const { statesData } = useSelector((state) => state.states);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(initialState);
  const [departments, setDepartments] = useState([]);
  const [courtName, setCourtName] = useState("");
  const [departmentName, setDepartmentName] = useState("");
  const [courtId, setcourtId] = useState();
  const [filteredCourts, setFilteredCourts] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [depDropdown, setDepDropdown] = useState(false);

  useEffect(() => {
    if (judgePopUp) {
      getCourtDataHandler();
    }
  }, [judgePopUp]);

  useEffect(() => {
    if (courtId && judgePopUp) {
      getDepartmentHandler();
    }
  }, [courtId, judgePopUp]);

  useEffect(() => {
    if (courtName && judgePopUp) {
      setDepDropdown(true);
    }
  }, [departments, judgePopUp]);

  const getCourtDataHandler = async () => {
    try {
      const response = await axios.get(`${origin}/api/get/court/directory/`, {
        headers: {
          Authorization: tokenBearer,
        },
      });
      setCourtData(response.data.data);
      setSearchResults(response.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleJudgeDirectorySubmit = async () => {
    setLoading(true);
    setError(null);
    console.log("Data for form of adding new Judge = ", form);
    try {
      const response = await axios.post(
        `${origin}/api/add/judge/directory/${clientId}/${currentCaseId}/`,
        form,
        {
          headers: {
            Authorization: tokenBearer,
          },
        }
      );
      if (response.status === 200) {
        dispatch(addJudge(response.data.data));
        handleClose();
        setForm(initialState);
        setCourtName("");
        setDepartmentName("");
        setSearchInput("");
        setDepDropdown(false);
        setcourtId();
      }
    } catch (err) {
      console.log(err.message);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Handles input change and filters court names
  const handleInputChange = (e) => {
    const { value } = e.target;
    setCourtName(value);

    if (value !== "" && value.length >= 3) {
      const filtered = courtData.filter((court) => {
        // Check if court_name exists before calling toLowerCase()
        const court_name = court?.court_name
          ?.toLowerCase()
          .startsWith(value.toLowerCase());
        const address1 = court?.court_contact?.address1
          .toLowerCase()
          .startsWith(value.toLowerCase());
        const address2 = court?.court_contact?.address2
          .toLowerCase()
          .startsWith(value.toLowerCase());
        const city = court?.court_contact?.city
          .toLowerCase()
          .startsWith(value.toLowerCase());
        const state = court?.court_contact?.address2
          .toLowerCase()
          .startsWith(value.toLowerCase());
        return court_name || address1 || address2 || city || state;
      });
      setFilteredCourts(filtered.slice(0, 10));
      setShowDropdown(true);
    } else {
      setcourtId();
      setShowDropdown(false);
    }
    setDepartmentName("");
    if (form.department_id) {
      setForm((prev) => ({
        ...prev,
        department_id: "",
      }));
    }
  };

  // Handles selecting a court name
  const handleSelectCourt = (court) => {
    setCourtName(court.court_name); // Display court name in the input
    setForm((prevForm) => ({
      ...prevForm,
      court_id: court.id, // Store court id for form submission
    }));
    setcourtId(court.id);
    setDepartmentName("");
    setForm((prev) => ({
      ...prev,
      department_id: "",
    }));
    setShowDropdown(false);
  };

  const getDepartmentHandler = async () => {
    try {
      const response = await axios.get(
        `${origin}/api/get/dept/court/${courtId}`,
        {
          headers: {
            Authorization: tokenBearer,
          },
        }
      );
      const data = response.data.data;
      setDepartments(data);
      setFilteredDepartments(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Handles input change and filters court names
  const handleDepartchange = (e) => {
    const { value } = e.target;
    setDepartmentName(value);
    if (value) {
      const filtered = departments.filter((dept) =>
        dept.department.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredDepartments(filtered);
      setDepDropdown(true);
    } else {
      setForm((prev) => ({
        ...prev,
        department_id: "",
      }));
      setDepDropdown(false);
    }
  };
  // Handles selecting a court name
  const handleSelectdeptarment = (dept) => {
    setDepartmentName(dept.department);
    setForm((prevForm) => ({
      ...prevForm,
      department_id: dept.id,
    }));
    setDepDropdown(false);
  };

  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [filteredResults, setfilteredResults] = useState([]);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const handleUpperInputChange = (e) => {
    const inputValue = e.target.value.toLowerCase();
    setSearchInput(e.target.value);
    if (inputValue !== "" && inputValue.length >= 3) {
      const filtered = searchResults?.filter((result) => {
        const court_name = result?.court_name?.toLowerCase() ?? "";
        const address1 = result?.court_contact?.address1?.toLowerCase() ?? "";
        const address2 = result?.court_contact?.address2?.toLowerCase() ?? "";
        const city = result?.court_contact?.city?.toLowerCase() ?? "";
        const state = result?.court_contact?.state?.toLowerCase() ?? "";

        return (
          court_name.startsWith(inputValue) ||
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

  const handleClosedData = () => {
    setForm(initialState);
    setCourtName("");
    setDepartmentName("");
    setSearchInput("");
    setDepDropdown(false);
    setcourtId();
    handleClose();
  };
  const handleSelectAgency = (company) => {
    setForm({
      courtName: "",
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
    });
    setCourtName(company?.court_name);
    setcourtId(company?.id);
    setForm((prevForm) => ({
      ...prevForm,
      court_id: company?.id || "",
      address1: company?.court_contact?.address1 || "",
      address2: company?.court_contact?.address2 || "",
      city: company?.court_contact?.city || "",
      state: company?.court_contact?.state || "",
      zip: company?.court_contact?.zip || "",
      email: company?.court_contact?.email || "",
      phone: company?.court_contact?.phone_number || "",
      extension: company?.court_contact?.phone_ext || "",
      fax: company?.court_contact?.fax || "",
      website: company?.court_contact?.website || "",
    }));

    // setSelectedReportTypeID(Number(reportingAgency.report_type));
    setIsFiltersOpen(false);
  };

  return (
    <Modal
      show={judgePopUp}
      onHide={handleClose}
      dialogClassName="Law-firm-direct-max-width-800px"
      centered
    >
      <Modal.Header className="bg-primary p-2">
        <h4 className="modal-title text-white mx-auto">Add Judge</h4>
      </Modal.Header>
      <Modal.Body>
        <div class="row">
          <div class="col-md-12">
            <input
              type="text"
              value={searchInput}
              placeholder="Search Court"
              className="form-control mb-3"
              onChange={handleUpperInputChange}
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
                    // maxHeight: "150px",
                    // overflowY: "auto",
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
                      {result.court_name && `${result.court_name}, `}
                      {result.court_contact.address1 &&
                        `${result.court_contact.address1}, `}
                      {result.court_contact.address2 &&
                        `${result.court_contact.address2}, `}
                      {result.court_contact.city &&
                        `${result.court_contact.city}, `}
                      {result.court_contact.state &&
                        `${result.court_contact.state}`}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="row align-items-center form-group">
          <div className="col-md-3 text-left">
            <span className="d-inline-block text-grey">
              <nobr>Court Name</nobr>
            </span>
          </div>
          <div className="col-md-9 relative">
            <>
              <input
                type="text"
                className="form-control"
                value={courtName} // Display court name
                onChange={handleInputChange}
                onFocus={() => courtName && setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)} // Timeout to allow click event to register before hiding
                placeholder="Type court name..."
              />

              {showDropdown && filteredCourts.length > 0 && (
                <div
                  className="dropdown "
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: "15px",
                    right: 0,
                    backgroundColor: "white",
                    border: "1px solid #ccc",
                    zIndex: 1000,
                    width: "95.5%",
                    // maxHeight: '150px',
                    // overflowY: "auto",
                  }}
                >
                  {filteredCourts.slice(0, 5).map((court) => (
                    <div
                      key={court.id}
                      className="form-control mb-1"
                      style={{
                        padding: "8px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleSelectCourt(court)}
                    >
                      {court.court_name} {court.court_contact.address1}{" "}
                      {court.court_contact.address2} {court.court_contact.city}{" "}
                      {court.court_contact.state}
                    </div>
                  ))}
                </div>
              )}
            </>
          </div>
        </div>
        {/* adding new department for api */}
        <div className="row align-items-center form-group">
          <div className="col-md-3 text-left">
            <span className="d-inline-block text-grey">
              <nobr>Department</nobr>
            </span>
          </div>
          <div
            style={{
              cursor: courtId ? "pointer" : "not-allowed",
            }}
            className="col-md-9 relative"
          >
            <>
              <input
                type="text"
                className="form-control"
                value={departmentName}
                onChange={handleDepartchange}
                onFocus={() => departmentName && setDepDropdown(true)}
                onBlur={() => setTimeout(() => setDepDropdown(false), 200)} // Timeout to allow click event to register before hiding
                placeholder={
                  courtId
                    ? filteredDepartments.length === 0
                      ? "No departments available for this court"
                      : "Type Department"
                    : "Select a court first"
                }
                disabled={!courtId}
                style={{
                  cursor: courtId ? "pointer" : "not-allowed",
                }}
              />

              {depDropdown && (
                <div
                  className="dropdown"
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: "15px",
                    right: 0,
                    backgroundColor: "white",
                    border: "1px solid #ccc",
                    zIndex: 1000,
                    width: "95.5%",
                    overflowY: "auto",
                  }}
                >
                  {filteredDepartments.slice(0, 5)?.map((dept) => (
                    <div
                      key={dept.id}
                      className="form-control mb-1"
                      style={{
                        padding: "8px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleSelectdeptarment(dept)}
                    >
                      {dept.department}
                    </div>
                  ))}
                </div>
              )}
            </>
          </div>
        </div>
        {/* ending new department for api */}
        {/* <div className="row align-items-center form-group">
              <div className="col-md-3 text-left">
                <span className="d-inline-block text-grey">
                  <nobr>Department</nobr>
                </span>
              </div>
              <div className="col-md-9">
                <select
                  disabled={courtId ? false : true}
                  style={{
                    cursor: courtId ? "pointer" : "not-allowed",
                  }}
                  name="department_id"
                  className="form-select form-control"
                  value={form.department_id}
                  onChange={handleChange}
                >
                  <option value="" disabled>
                    Select a department
                  </option>
                  {departments.length ? (
                    departments.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.department}
                      </option>
                    ))
                  ) : (
                    <option disabled>Not Enough Data</option>
                  )}
                </select>
              </div>
            </div> */}
        {/* <div className="row align-items-center form-group">
              <div className="col-md-3 text-left">
                <span className="d-inline-block text-grey">
                  <nobr>Judge Name</nobr>
                </span>
              </div>
              <div className="col-md-9">
                <input
                  type="text"
                  placeholder="Enter Judge Name"
                  value={form.judge_name}
                  className="form-control"
                  name="judge_name"
                  onChange={handleChange}
                />
               
              </div>
            </div> */}
        <div className="row align-items-center form-group">
          <div className="col-md-3 text-left">
            <span className="d-inline-block text-grey">
              <nobr>Judge First Name</nobr>
            </span>
          </div>
          <div className="col-md-9">
            <input
              type="text"
              placeholder="Enter Judge First Name"
              value={form.judge_firstname}
              className="form-control"
              name="judge_firstname"
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="row align-items-center form-group">
          <div className="col-md-3 text-left">
            <span className="d-inline-block text-grey">
              <nobr>Judge Middle Name</nobr>
            </span>
          </div>
          <div className="col-md-9">
            <input
              type="text"
              placeholder="Enter Judge Middle Name"
              value={form.judge_middlename}
              className="form-control"
              name="judge_middlename"
              onChange={handleChange}
            />
            {/* <input
                  type="hidden"
                  placeholder="Enter Company Name"
                  value={form.block_name}
                  className="form-control"
                  name="block_name"
                /> */}
          </div>
        </div>
        <div className="row align-items-center form-group">
          <div className="col-md-3 text-left">
            <span className="d-inline-block text-grey">
              <nobr>Judge Last Name</nobr>
            </span>
          </div>
          <div className="col-md-9">
            <input
              type="text"
              placeholder="Enter Judge Last Name"
              value={form.judge_lastname}
              className="form-control"
              name="judge_lastname"
              onChange={handleChange}
            />
            {/* <input
                  type="hidden"
                  placeholder="Enter Company Name"
                  value={form.block_name}
                  className="form-control"
                  name="block_name"
                /> */}
          </div>
        </div>

        <div className="row align-items-center form-group">
          <div className="col-md-3 text-left">
            <span className="d-inline-block text-grey">Address 1</span>
          </div>
          <div className="col-md-9">
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
          <div className="col-md-3 text-left">
            <span className="d-inline-block text-grey">Address 2</span>
          </div>
          <div className="col-md-9">
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
          <div className="col-md-3 text-left">
            <span className="d-inline-block text-grey dispay-none-LFD "></span>
          </div>

          <div className="col-md-9 row">
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
          <div className="col-md-3 text-left">
            <span className="d-inline-block text-grey">Phone</span>
          </div>
          <div className="col-md-4">
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
          <div className="col-md-3 text-left">
            <span className="d-inline-block text-grey">Fax</span>
          </div>
          <div className="col-md-9">
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
          <div class="col-md-3 text-left">
            <span class="d-inline-block text-grey">Email</span>
          </div>
          <div class="col-md-9">
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

        <div class="row align-items-center form-group">
          <div class="col-md-3 text-left">
            <span class="d-inline-block text-grey">Website</span>
          </div>
          <div class="col-md-9">
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
      </Modal.Body>
      <Modal.Footer className="mt-0">
        <button
          type="button"
          class="btn btn-secondary float-left-margin-right-auto"
          onClick={handleClosedData}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleJudgeDirectorySubmit}
          class="btn btn-success"
        >
          Save
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default JudgeDirectoryModal;
