import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import { getCaseId, getClientId } from "../../Utils/helper";
import {
  deleteDepartment,
  updateDepartment,
} from "../../Redux/department-table/departmentSlice";

function DepartmentTablePopUp({
  departmentPopUp,
  departmentData,
  handleClose,
}) {
  const tokenBearer = localStorage.getItem("token");
  const currentCaseId = getCaseId();
  const clientId = getClientId();
  const origin = process.env.REACT_APP_BACKEND_URL;
  const dispatch = useDispatch();
  const { statesData } = useSelector((state) => state.states);
  const [courtData, setCourtData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [courtName, setCourtName] = useState("");
  const [filteredCourts, setFilteredCourts] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [state, setState] = useState(null);

  const [form, setForm] = useState({
    court_name: "",
    department: "",
    clerk_first_name: "",
    clerk_last_name: "",
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
    floor: "",
    room: "",
    deps: "",
  });

  const getCourtDataHandler = async () => {
    const stateAbr= state || null;
    try {
      const response = await axios.get(`${origin}/api/get/court/directory/?state=${stateAbr}`, {
        headers: {
          Authorization: tokenBearer,
        },
      });
      setCourtData(response.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(departmentPopUp){
      getCourtDataHandler();
    }
  }, [departmentPopUp, state]);

  useEffect(() => {
    if (departmentData) {
      const courtObj = courtData?.find(
        (court) => court.id === departmentData?.court?.id
      );
      setCourtName(courtObj?.court_name);

      setForm({
        court_name: departmentData?.court?.id || null,
        clerk_first_name: departmentData?.clerk_first_name || "",
        clerk_last_name: departmentData?.clerk_last_name || "",
        department: departmentData?.department || "",
        address1: departmentData?.department_contact?.address1 || "",
        address2: departmentData?.department_contact?.address2 || "",
        city: departmentData?.department_contact?.city || "",
        state: departmentData?.department_contact?.state || "",
        zip: departmentData?.department_contact?.zip || "",
        phone: departmentData?.department_contact?.phone_number || "",
        extension: departmentData?.department_contact?.phone_ext || "",
        fax: departmentData?.department_contact?.fax || "",
        email: departmentData?.department_contact?.email || "",
        website: departmentData?.department_contact?.website || "",
        floor: departmentData?.floor || "",
        room: departmentData?.room || "",
        deps: departmentData?.deps || "",
      });
    }
  }, [departmentData, courtData]);

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

  const handleSaveClick = async () => {
    const updatedDepartment = {
      ...departmentData,
      id: departmentData.id,
      court_name: form.court_name,
      clerk_first_name: form.clerk_first_name,
      clerk_last_name: form.clerk_last_name,
      department: form.department,

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
    };
    try {
      const response = await axios.patch(
        `${origin}/api/add/department/directory/${clientId}/${currentCaseId}/`,
        updatedDepartment,{
          headers: {
            Authorization: tokenBearer,
          }
        }
      );
      dispatch(
        updateDepartment({
          id: departmentData.id,
          updatedData: response.data.data,
        })
      );
      handleClose();
    } catch (error) {
      console.error("Error updating insurance company:", error.message);
      console.error("Error Response:", error.response); // Add this line to get more details about the error
    }
  };

  const handleDeleteButton = async () => {
    try {
      console.log("Deleted", departmentData.id);

      const response = await axios.delete(
        `${origin}/api/add/department/directory/${clientId}/${currentCaseId}/`,
        {
          data: {
            id: departmentData.id,
          },
          headers: {
            Authorization: tokenBearer,
          }
        }
      );
      dispatch(deleteDepartment(departmentData.id));
      handleClose();
    } catch (error) {
      console.error("Error deleting insurance company:", error.message);
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
      court_name: court.id, // Store court id for form submission
    }));
    setShowDropdown(false);
  };

  return (
    <Modal
      show={departmentPopUp}
      onHide={handleClose}
      dialogClassName="modal-dialog-centered Law-firm-direct-max-width-800px"
    >
      <Modal.Header className="bg-primary p-2">
        <h4 className="modal-title mx-auto text-white ">Edit Department</h4>
      </Modal.Header>
      <Modal.Body>
        <div className="row align-items-center form-group">
          <div className="col-2 text-left">
            <span className="d-inline-block text-grey">
              <nobr>Court Name </nobr>
            </span>
          </div>
          <div className="col-10">
            {/* <select
                name="court_name"
                className="form-select form-control"
                value={form.court_name || courtData[0]?.id || ""}
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
                    width: "98%",
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
              value={form.clerk_first_name}
              className="form-control"
              name="clerk_first_name"
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
              value={form.clerk_last_name}
              className="form-control"
              name="clerk_last_name"
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
            <span className="d-inline-block text-grey dispay-none-LFD "></span>
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

export default DepartmentTablePopUp;
