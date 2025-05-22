import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getCaseId, getClientId } from "../../Utils/helper";
import { addDepartment } from "../../Redux/department-table/departmentSlice";
import { Modal } from "react-bootstrap";
const initialState = {
  department: "",
  first_name: "",
  last_name: "",
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
  court_name: "",
  floor: "",
  room: "",
  deps: "",
};
function AddDepartmentModal({ departmentPopUp, handleClose }) {
  const tokenBearer = localStorage.getItem("token");
  const currentCaseId = getCaseId();
  const clientId = getClientId();
  const origin = process.env.REACT_APP_BACKEND_URL;
  const dispatch = useDispatch();
  const [courtData, setCourtData] = useState([]);
  const { statesData } = useSelector((state) => state.states);
  const [loading, setLoading] = useState(false);
  const [courtName, setCourtName] = useState("");
  const [filteredCourts, setFilteredCourts] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(initialState);
  const [searchResults, setSearchResults] = useState([]);
  const [state, setState] = useState(null);
  
  
  const getCourtDataHandler = async () => {
    const stateAbr = state || null;
    try {
      const response = await axios.get(`${origin}/api/get/court/directory/?state=${stateAbr}`, {
        headers: {
          Authorization: tokenBearer,
        },
      });
      // setSearchResults(response.data.data);
      setCourtData(response.data.data);
      setForm(initialState);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (departmentPopUp) {
      getCourtDataHandler();
    }
  }, [departmentPopUp, state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "state") {
      setState(value);
    }
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleDepartmentDirectorySubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${origin}/api/add/department/directory/${clientId}/${currentCaseId}/`,
        form,
        {
          headers: {
            Authorization: tokenBearer,
          },
        }
      );

      if (response.status === 200) {
        dispatch(addDepartment(response.data.data));
        handleClose();
        setForm(initialState);
        setCourtName("");
        // setSearchInput("");
      }
    } catch (err) {
      console.log(err.message);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleClosedData = () => {
    setForm(initialState);
    setCourtName("");
    // setSearchInput("");
    handleClose();
  };

  const handleInputChange = (e) => {
    const { value } = e.target;
    setCourtName(value);

    if (value !== "" && value.length >= 3) {
      const filtered = courtData.filter((court) => {
        // Check if court_name exists before calling toLowerCase()
        const court_name = court?.court_name
          ?.toLowerCase()
          .includes(value.toLowerCase());
        const address1 = court?.court_contact?.address1
          .toLowerCase()
          .includes(value.toLowerCase());
        const address2 = court?.court_contact?.address2
          .toLowerCase()
          .includes(value.toLowerCase());
        const city = court?.court_contact?.city
          .toLowerCase()
          .includes(value.toLowerCase());
        const state = court?.court_contact?.address2
          .toLowerCase()
          .includes(value.toLowerCase());
        return court_name || address1 || address2 || city || state;
      });
      setFilteredCourts(filtered);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };
  // Handles selecting a court name
  const handleSelectCourt = (court) => {
    setCourtName(court?.court_name); // Display court name in the input
    setForm((prevForm) => ({
      ...prevForm,
      court_id: court.id, // Store court id for form submission
    }));
    setShowDropdown(false);
  };

  // const [filteredResults, setfilteredResults] = useState([]);
  // const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  // const [searchInput, setSearchInput] = useState("");

  // const handleUpperInputChange = (e) => {
  //   const inputValue = e.target.value.toLowerCase();
  //   setSearchInput(e.target.value);
  //   if (inputValue !== "" && inputValue.length >= 3) {
  //     const filtered = searchResults?.filter((result) => {
  //       const court_name = result?.court_name?.toLowerCase() ?? "";
  //       const address1 = result?.court_contact?.address1?.toLowerCase() ?? "";
  //       const address2 = result?.court_contact?.address2?.toLowerCase() ?? "";
  //       const city = result?.court_contact?.city?.toLowerCase() ?? "";
  //       const state = result?.court_contact?.state?.toLowerCase() ?? "";

  //       return (
  //         court_name.startsWith(inputValue) ||
  //         address1.startsWith(inputValue) ||
  //         address2.startsWith(inputValue) ||
  //         city.startsWith(inputValue) ||
  //         state.startsWith(inputValue)
  //       );
  //     });

  //     setfilteredResults(filtered.slice(0, 10));
  //     setIsFiltersOpen(true);
  //   } else {
  //     setfilteredResults("");
  //   }
  // };

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
    // const fullCourtName = `${company?.court_name} - ${company?.court_contact?.address1}, ${company?.court_contact?.city}, ${company?.court_contact?.state}`;
    setCourtName(company?.court_name);

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
      show={departmentPopUp}
      onHide={handleClose}
      dialogClassName="modal-dialog-centered Law-firm-direct-max-width-800px"
    >
      <Modal.Header className="bg-primary p-2">
        <h4 className="modal-title mx-auto text-white ">Add Department</h4>
      </Modal.Header>
      <Modal.Body>
        {/* <div class="row">
          <div class="col-12">
            <input
              type="text"
              value={searchInput}
              placeholder="Type Court name to search directory then click an entry"
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
                  {filteredResults.map((result, index) => (
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
        </div> */}
        <div className="row align-items-center form-group">
          <div className="col-2 text-left">
            <span className="d-inline-block text-grey">
              <nobr>Court Name</nobr>
            </span>
          </div>
          <div className="col-10">
            {/* <select
                  name="court_id"
                  className="form-select form-control"
                  value={form.court_name}
                  onChange={handleChange}
                >
                  {courtData.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.court_name}
                    </option>
                  ))}
                </select> */}

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
                    // overflowY: 'auto',
                  }}
                >
                  {filteredCourts.slice(0, 5).map((court) => (
                    <div
                      key={court?.id}
                      className="form-control mb-1"
                      style={{
                        padding: "8px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleSelectCourt(court)}
                    >
                      {court?.court_name} {court?.court_contact?.address1}{" "}
                      {court?.court_contact?.address2}{" "}
                      {court?.court_contact?.city} {court?.court_contact?.state}
                    </div>
                  ))}
                </div>
              )}
            </>
          </div>
        </div>
        <div className="row align-items-center form-group">
          <div className="col-2 text-left">
            <span className="d-inline-block text-grey">
              <nobr>Clerk First Name</nobr>
            </span>
          </div>
          <div className="col-10">
            <input
              type="text"
              placeholder="Enter Clerk First Name"
              value={form.first_name}
              className="form-control"
              name="first_name"
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="row align-items-center form-group">
          <div className="col-2 text-left">
            <span className="d-inline-block text-grey">
              <nobr>Clerk Last name</nobr>
            </span>
          </div>
          <div className="col-10">
            <input
              type="text"
              placeholder="Enter Clerk Last name"
              value={form.last_name}
              className="form-control"
              name="last_name"
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="row align-items-center form-group">
          <div className="col-2 text-left">
            <span className="d-inline-block text-grey">
              <nobr>Department</nobr>
            </span>
          </div>
          <div className="col-10">
            <input
              type="text"
              placeholder="Enter Department"
              value={form.department}
              className="form-control"
              name="department"
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="row align-items-center form-group">
          <div className="col-2 text-left">
            <span className="d-inline-block text-grey">Address 1</span>
          </div>
          <div className="col-10">
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
          <div className="col-2 text-left">
            <span className="d-inline-block text-grey">Address 2</span>
          </div>
          <div className="col-10">
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
          <div className="col-2 text-left">
            <span className="d-inline-block text-grey dispay-none-LFD ">
              CityStateZip
            </span>
          </div>

          <div className="col-10 row">
            <div className="col-4">
              <input
                type="text"
                placeholder="City"
                value={form.city}
                className="form-control"
                name="city"
                onChange={handleChange}
              />
            </div>
            <div className="col-4 PRL15-B1">
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
            <div className="col-4 PRL30px">
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
          <div className="col-2 text-left">
            <span className="d-inline-block text-grey">Phone</span>
          </div>
          <div className="col-5">
            <input
              type="text"
              placeholder="Enter Phone"
              value={form.phone}
              className="form-control"
              name="phone"
              onChange={handleChange}
            />
          </div>
          <div className="col-1 text-left">
            <span className="d-inline-block text-grey">Ext.</span>
          </div>
          <div className="col-4 pl-0">
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
          <div className="col-2 text-left">
            <span className="d-inline-block text-grey">Fax</span>
          </div>
          <div className="col-10">
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
          <div class="col-2 text-left">
            <span class="d-inline-block text-grey">Email & Website</span>
          </div>
          <div class="col-5">
            <input
              type="text"
              placeholder="Enter Email"
              value={form.email}
              className="form-control"
              name="email"
              onChange={handleChange}
            />
          </div>
          <div class="col-5">
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

        <div className="row form-group">
          <div className="col-2 text-left">
            <span className="d-inline-block text-grey"></span>
          </div>
          <div className="col-10 d-flex p-0">
            <span className="col-4">
              <input
                type="text"
                placeholder="Floor"
                value={form?.floor}
                className="form-control bg-white"
                name="floor"
                onChange={handleChange}
              />
            </span>
            <span className="col-4">
              <input
                type="text"
                placeholder="Room"
                value={form?.room}
                className="form-control bg-white"
                name="room"
                onChange={handleChange}
              />
            </span>
            <span className="col-4">
              <input
                type="text"
                placeholder="DEPS"
                value={form?.deps}
                className="form-control bg-white"
                name="deps"
                onChange={handleChange}
              />
            </span>
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
          onClick={handleDepartmentDirectorySubmit}
          class="btn btn-success"
        >
          Save
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddDepartmentModal;
