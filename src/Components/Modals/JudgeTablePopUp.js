import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal } from "react-bootstrap";
import { getCaseId, getClientId } from "../../Utils/helper";
import { useDispatch, useSelector } from "react-redux";
import { deleteJudge, updateJudge } from "../../Redux/judge-table/judgeSlice";

function JudgeTablePopUp({ judgePopUp, handleClose, courtData }) {
  const tokenBearer = localStorage.getItem("token");
  const currentCaseId = getCaseId();
  const clientId = getClientId();
  const origin = process.env.REACT_APP_BACKEND_URL;
  const dispatch = useDispatch();
  const { statesData } = useSelector((state) => state.states);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [courtName, setCourtName] = useState("");
  const [filteredCourts, setFilteredCourts] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [departmentName, setDepartmentName] = useState(
    judgePopUp?.dept_info?.department
  );
  const [courtId, setcourtId] = useState();
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [depDropdown, setDepDropdown] = useState(false);

  // const departments = useSelector((state) => state.judges.departments);

  const [form, setForm] = useState({
    court_name: "",
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
    department_id_update: "",
  });

  useEffect(() => {
    if (courtId) {
      getDepartmentHandler();
    }
  }, [courtId]);

  useEffect(() => {
    if (filteredDepartments?.length) {
      setDepDropdown(true);
    }
  }, [filteredDepartments]);

  useEffect(() => {
    if (judgePopUp && courtData) {
      const courtObj = courtData?.find(
        (court) => court.court_name === judgePopUp?.court?.court_name
      );
      setCourtName(courtObj?.court_name);

      setForm({
        court_name: courtObj?.id || null,
        judge_name: judgePopUp?.judge_name || "",
        judge_firstname: judgePopUp?.judge_first_name || "",
        judge_middlename: judgePopUp?.judge_middle_name || "",
        judge_lastname: judgePopUp?.judge_last_name || "",
        address1: judgePopUp?.judge_contact?.address1 || "",
        address2: judgePopUp?.judge_contact?.address2 || "",
        city: judgePopUp?.judge_contact?.city || "",
        state: judgePopUp?.judge_contact?.state || "",
        zip: judgePopUp?.judge_contact?.zip || "",
        phone: judgePopUp?.judge_contact?.phone_number || "",
        extension: judgePopUp?.judge_contact?.phone_ext || "",
        fax: judgePopUp?.judge_contact?.fax || "",
        email: judgePopUp?.judge_contact?.email || "",
        website: judgePopUp?.judge_contact?.website || "",
        department_id_update: judgePopUp?.dept_info?.id || "",
      });
    }
  }, [judgePopUp, courtData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSaveClick = async () => {
    const selectedCourt = courtData.find(
      (court) => court.court_name === form.court_name
    );

    const updatedJudge = {
      ...judgePopUp,
      court: { ...selectedCourt, court_name: form.court_name },
      judge_name: form.judge_name,
      judge_firstname: form.judge_firstname,
      judge_middlename: form.judge_middlename,
      judge_lastname: form.judge_lastname,
      id: judgePopUp.id,
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
      department_id_update: form.department_id_update,
    };

    try {
      const response = await axios.patch(
        `${origin}/api/add/judge/directory/${clientId}/${currentCaseId}/`,
        updatedJudge,
        {
          headers: {
            Authorization: tokenBearer,
          },
        }
      );
      dispatch(
        updateJudge({
          id: judgePopUp.id,
          updatedData: response.data.data,
        })
      );
      handleClose();
    } catch (error) {
      console.error("Error updating insurance company:", error.message);
      console.error("Error Response:", error.response);
    }
  };

  const handleDeleteButton = async () => {
    try {
      const response = await axios.delete(
        `${origin}/api/add/judge/directory/${clientId}/${currentCaseId}/`,
        {
          data: {
            id: judgePopUp.id,
          },
          headers: {
            Authorization: tokenBearer,
          },
        }
      );
      dispatch(deleteJudge(judgePopUp.id));
      handleClose();
    } catch (error) {
      console.error("Error deleting insurance company:", error.message);
    }
  };

  // Handles input change and filters court names
  const handleInputChange = (e) => {
    const { value } = e.target;
    setCourtName(value);

    if (value) {
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
    setDepartmentName("");

    if (form.department_id_update) {
      setForm((prev) => ({
        ...prev,
        department_id_update: "",
      }));
    }
  };

  // Handles selecting a court name
  const handleSelectCourt = (court) => {
    setCourtName(court.court_name); // Display court name in the input
    setForm((prevForm) => ({
      ...prevForm,
      court_name: court.id, // Store court id for form submission
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
  const handleDepartchange = (e) => {
    const { value } = e.target;
    setDepartmentName(value);
    if (value !== "" && value.length >= 3) {
      const filtered = departments.filter((dept) =>
        dept.department.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredDepartments(filtered.slice(0, 10));
      setDepDropdown(true);
    } else {
      setForm((prev) => ({
        ...prev,
        department_id_update: "",
      }));
      setDepDropdown(false);
    }
  };
  // Handles selecting a court name
  const handleSelectdeptarment = (dept) => {
    setDepartmentName(dept.department);
    setForm((prevForm) => ({
      ...prevForm,
      department_id_update: dept.id,
    }));
    setDepDropdown(false);
  };

  return (
    <Modal
      show={judgePopUp ? true : false}
      onHide={handleClose}
      dialogClassName="modal-dialog-centered Law-firm-direct-max-width-800px"
    >
      <Modal.Header className="text-center bg-primary p-2">
        <h4 className="modal-title text-white mx-auto">Judge</h4>
      </Modal.Header>
      <Modal.Body>
        <div className="row align-items-center form-group">
          <div className="col-md-2 text-left">
            <span className="d-inline-block text-grey">
              <nobr>Court Name</nobr>
            </span>
          </div>
          <div className="col-md-10">
            {/* <select
                name="court_name"
                className="form-select form-control"
                value={form.court_name}
                onChange={handleChange}
              >
                <option value="">Select a court</option>
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
                    width: "98%",
                    // maxHeight: '150px',
                    // overflowY: "auto",
                  }}
                >
                  {filteredCourts.slice(0, 5)?.map((court) => (
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
        <div className="row align-items-center form-group">
          <div className="col-md-2 text-left">
            <span className="d-inline-block text-grey">
              <nobr>Department</nobr>
            </span>
          </div>
          {/* <div className="col-md-10">
                <select
                  name="department_id_update"
                  className="form-select form-control"
                  value={form.department_id_update}
                  onChange={handleChange}
                >
                    <option value="" disabled>
                      Select a department
                    </option>
                  {departments && departments.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.department}
                    </option>
                  ))}
                </select>
              </div> */}
          <div
            style={{
              cursor: courtId ? "pointer" : "not-allowed",
            }}
            className="col-md-10 relative"
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
                  courtName
                    ? filteredDepartments.length === 0
                      ? "No departments available for this court"
                      : "Type Department"
                    : "Select a court first"
                }
                disabled={courtName ? false : true}
                style={{
                  cursor: courtName ? "pointer" : "not-allowed",
                }}
              />

              {depDropdown && (
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
                    // maxHeight: '190px',
                    overflowY: "auto",
                  }}
                >
                  {filteredDepartments.length > 0
                    ? filteredDepartments.slice(0, 5).map((dept) => (
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
                      ))
                    : ""}
                </div>
              )}
            </>
          </div>
        </div>
        {/* <div className="row align-items-center form-group">
            <div className="col-md-2 text-left">
              <span className="d-inline-block text-grey">
                <nobr>Judge Name</nobr>
              </span>
            </div>
            <div className="col-md-10">
              <input
                type="text"
                placeholder="Enter Judge Name"
                value={form.judge_name}
                className="form-control"
                name="judge_name"
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
          </div> */}
        <div className="row align-items-center form-group">
          <div className="col-md-2 text-left">
            <span className="d-inline-block text-grey">
              <nobr>Judge First Name</nobr>
            </span>
          </div>
          <div className="col-md-10">
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
          <div className="col-md-2 text-left">
            <span className="d-inline-block text-grey">
              <nobr>Judge Middle Name</nobr>
            </span>
          </div>
          <div className="col-md-10">
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
          <div className="col-md-2 text-left">
            <span className="d-inline-block text-grey">
              <nobr>Judge Last Name</nobr>
            </span>
          </div>
          <div className="col-md-10">
            <input
              type="text"
              placeholder="Enter Judge Last Name"
              value={form.judge_lastname}
              className="form-control"
              name="judge_lastname"
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

        <div class="row align-items-center form-group">
          <div class="col-md-2 text-left">
            <span class="d-inline-block text-grey">Website</span>
          </div>
          <div class="col-md-10">
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

export default JudgeTablePopUp;
