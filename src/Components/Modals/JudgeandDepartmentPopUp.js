import React, { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { Modal } from "react-bootstrap";
import { getCaseId, getClientId } from "../../Utils/helper";
import { ClientDataContext } from "../ClientDashboard/shared/DataContext";
import { debounce } from "lodash";
import { useSelector } from "react-redux";

function JudgeandDepartmentPopUp({ JudgeData, showPopup, handleClose}) {
  const currentCaseId = getCaseId();
  const clientId = getClientId();
  const origin = process.env.REACT_APP_BACKEND_URL;
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const { setLitigationDashboardDataUpdated } = useContext(ClientDataContext);

  const [judges, setJudges] = useState([]);
  const [noJudges, setNoJudges] = useState(false);
  const [filteredJudges, setFilteredJudges] = useState([]);
  const [searchJudge, setJudgeSearch] = useState("");

  const [form, setForm] = useState({
    judge_id: JudgeData?.judgeId || null,
    department_id: JudgeData?.departmentId || null,
    judge_first_name: JudgeData?.judge_first_name || "",
    judge_last_name: JudgeData?.judge_last_name || "",
    judge_contact: {
      name: JudgeData?.judge_contact?.name || "",
      address1: JudgeData?.judge_contact?.address1 || "",
      address2: JudgeData?.judge_contact?.address2 || "",
      phone_number: JudgeData?.judge_contact?.phone_number || "",
      fax: JudgeData?.judge_contact?.fax || "",
      email: JudgeData?.judge_contact?.email || "",
      website: JudgeData?.judge_contact?.website || "",
      city: JudgeData?.judge_contact?.city || "",
      state: JudgeData?.judge_contact?.state || "",
      zip: JudgeData?.judge_contact?.zip || "",
    },
    department: JudgeData?.department || "",
    clerk_first_name: JudgeData?.clerk_first_name || "",
    clerk_last_name: JudgeData?.clerk_last_name || "",
    floor: JudgeData?.floor || "",
    room: JudgeData?.room || "",
    deps: JudgeData?.deps || "",
    clerk_contact: {
      name: JudgeData?.clerk_contact?.name || "",
      address1: JudgeData?.clerk_contact?.address1 || "",
      address2: JudgeData?.clerk_contact?.address2 || "",
      phone_number: JudgeData?.clerk_contact?.phone_number || "",
      fax: JudgeData?.clerk_contact?.fax || "",
      email: JudgeData?.clerk_contact?.email || "",
      website: JudgeData?.clerk_contact?.website || "",
      city: JudgeData?.clerk_contact?.city || "",
      state: JudgeData?.clerk_contact?.state || "",
      zip: JudgeData?.clerk_contact?.zip || "",
    },
  });
  const { statesData } = useSelector((state) => state.states);

  const litigationID = JudgeData?.litigation_id || null;
  const courtId = JudgeData?.courtId || null;

  const [departments, setDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);

  const debouncedJudgeSearch = useCallback(
    debounce((value) => {
      if (!value) {
        setFilteredJudges([]);
        return;
      }
      const filtered = judges.filter(
        (judge) =>
          judge.judge_first_name?.toLowerCase().includes(value.toLowerCase()) ||
          judge.judge_middle_name
            ?.toLowerCase()
            .includes(value.toLowerCase()) ||
          judge.judge_last_name?.toLowerCase().includes(value.toLowerCase()) ||
          judge.judge_name?.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredJudges(filtered);
    }, 300),
    [judges]
  );

  useEffect(() => {
    if (showPopup) {
      getJudges();
    }
  }, [courtId, showPopup]);

  useEffect(() => {
    if (courtId) {
      getDepartmentHandler();
    }
  }, [courtId]);

  const getJudges = async () => {
    const court = JudgeData?.courtId || null;
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${origin}/api/add/judge/directory/${clientId}/${currentCaseId}/?court=${court}`,
        { headers: { Authorization: token } }
      );
      setJudges(data.data);
      setNoJudges(!data.data?.length);
    } catch (err) {
      console.error("Error fetching judges:", err);
      setNoJudges(true);
    } finally {
      setLoading(false);
    }
  };

  const getDepartmentHandler = async () => {
    try {
      const { data } = await axios.get(
        `${origin}/api/get/dept/court/${courtId}`,
        { headers: { Authorization: token } }
      );
      setDepartments(data.data);
    } catch (err) {
      console.error("Error fetching departments:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleJudgeSearchChange = (e) => {
    const value = e.target.value;
    setJudgeSearch(value);
    debouncedJudgeSearch(value);
  };

  const handleSelectJudge = (judge) => {
    setForm((prev) => ({
      ...prev,
      judge_id: judge.id,
      department_id: judge?.dept_info?.id || null,
      judge_first_name: judge?.judge_first_name || "",
      judge_last_name: judge?.judge_last_name || "",
      judge_contact: {
        name: judge?.judge_contact?.name || "",
        address1: judge?.judge_contact?.address1 || "",
        address2: judge?.judge_contact?.address2 || "",
        phone_number: judge?.judge_contact?.phone_number || "",
        fax: judge?.judge_contact?.fax || "",
        email: judge?.judge_contact?.email || "",
        website: judge?.judge_contact?.website || "",
        city: judge?.judge_contact?.city || "",
        state: judge?.judge_contact?.state || "",
        zip: judge?.judge_contact?.zip || "",
      },
      department: judge?.dept_info?.department || "",
      clerk_first_name: judge?.dept_info?.clerk_first_name || "",
      clerk_last_name: judge?.dept_info?.clerk_last_name || "",
      floor: judge?.dept_info?.floor || "",
      room: judge?.dept_info?.room || "",
      deps: judge?.dept_info?.deps || "",
      clerk_contact: {
        name: judge?.dept_info?.department_contact?.name || "",
        address1: judge?.dept_info?.department_contact?.address1 || "",
        address2: judge?.dept_info?.department_contact?.address2 || "",
        phone_number: judge?.dept_info?.department_contact?.phone_number || "",
        fax: judge?.dept_info?.department_contact?.fax || "",
        email: judge?.dept_info?.department_contact?.email || "",
        website: judge?.dept_info?.department_contact?.website || "",
        city: judge?.dept_info?.department_contact?.city || "",
        state: judge?.dept_info?.department_contact?.state || "",
        zip: judge?.dept_info?.department_contact?.zip || "",
      },
    }));
    setJudgeSearch(judge?.judge_name);
    setFilteredJudges([]);
  };

  const handleDepartchange = (e) => {
    const { value } = e.target;
    if (value && value.length >= 3) {
      const filtered = departments.filter((dept) =>
        dept.department.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredDepartments(filtered.slice(0, 10));
    } else {
      setFilteredDepartments([]);
    }
  };

  const handleSelectdeptarment = (dept) => {
    if (!dept?.id) return;

    setForm((prev) => ({
      ...prev,
      department_id: dept.id || null,
      department: dept?.department || "",
      clerk_first_name: dept?.clerk_first_name || "",
      clerk_last_name: dept?.clerk_last_name || "",
      floor: dept?.floor || "",
      room: dept?.room || "",
      deps: dept?.deps || "",
      clerk_contact: {
        name: dept?.department_contact?.name || "",
        address1: dept?.department_contact?.address1 || "",
        address2: dept?.department_contact?.address2 || "",
        phone_number: dept?.department_contact?.phone_number || "",
        fax: dept?.department_contact?.fax || "",
        email: dept?.department_contact?.email || "",
        website: dept?.department_contact?.website || "",
        city: dept?.department_contact?.city || "",
        state: dept?.department_contact?.state || "",
        zip: dept?.department_contact?.zip || "",
      },
    }));
    setFilteredDepartments([]);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setForm(prevForm => ({
        ...prevForm,
        [parent]: {
          ...prevForm[parent],
          [child]: value
        }
      }));
    } else {

      setForm(prevForm => ({
        ...prevForm,
        [name]: value
      }));
    }
  };

  const handleSubmit = async () => {
    if (!litigationID) return;

    setLoading(true);
    try {
      const response = await axios.patch(
        `${origin}/api/litigation-page/litigation/contacts-update/${litigationID}/`,
        form,
        { headers: { Authorization: token } }
      );
      if (response.status === 200) {
        setLitigationDashboardDataUpdated(true);
        handleClose();
      }
    } catch (error) {
      console.error("Error updating litigation:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderJudgeFields = () => (
    <>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search for Judge"
          value={searchJudge}
          onChange={handleJudgeSearchChange}
        />
      </div>
      {filteredJudges?.length > 0 && (
        <ul
          className="list-group position-absolute bg-white overflow-scroll"
          style={{ zIndex: "1", width: "96%" }}
        >
          {filteredJudges.map((judge) => (
            <li
              key={judge.id}
              className="list-group-item"
              onClick={() => handleSelectJudge(judge)}
              style={{ cursor: "pointer" }}
            >
              {judge?.judge_full_name}
            </li>
          ))}
        </ul>
      )}
      <div className="row align-items-center form-group">
        <div className="col-2 text-left">
          <span className="d-inline-block text-grey">
            <nobr>Judge Name</nobr>
          </span>
        </div>
        <div className="col-10 d-flex p-0">
          <span className="col-6">
            <input
              type="text"
              placeholder="Judge First Name"
              value={form?.judge_first_name}
              className="form-control bg-white"
              name="judge_first_name"
              onChange={handleChange}
            />
          </span>
          <span className="col-6">
            <input
              type="text"
              placeholder="Judge Last Name"
              value={form?.judge_last_name}
              className="form-control bg-white"
              name="judge_last_name"
              onChange={handleChange}
            />
          </span>
        </div>
      </div>
    </>
  );

  const renderDepartmentField = () => (
    <div className="row align-items-center form-group">
      <div className="col-2 text-left">
        <span className="d-inline-block text-grey">Department</span>
      </div>
      <div className="col-10">
        <>
          <input
            type="text"
            className="form-control"
            value={form?.department}
            onChange={handleDepartchange}
            placeholder="Search for Department"
          />
          {filteredDepartments?.length > 0 && (
            <ul
              className="list-group position-absolute bg-white overflow-scroll"
              style={{ zIndex: "1", width: "96%" }}
            >
              {filteredDepartments.map((dept) => (
                <li
                  key={dept.id}
                  className="list-group-item"
                  onClick={() => handleSelectdeptarment(dept)}
                  style={{ cursor: "pointer" }}
                >
                  {dept.department}
                </li>
              ))}
            </ul>
          )}
        </>
      </div>
    </div>
  );

  const renderContactFields = () => (
    <>
      <div className="row align-items-center form-group">
        <div className="col-2 text-left">
          <span className="d-inline-block text-grey">Address</span>
        </div>
        <div className="col-10 d-flex p-0">
          <span className="col-6">
            <input
              type="text"
              placeholder="Address 1"
              value={
                form?.judge_contact?.address1 &&
                form.judge_contact.address1 !== "nan"
                  ? form.judge_contact.address1
                  : ""
              }
              className="form-control bg-white"
              name="judge_contact.address1"
              onChange={handleChange}
            />
          </span>
          <span className="col-6">
            <input
              type="text"
              placeholder="Address 2"
              value={
                form?.judge_contact?.address2 &&
                form.judge_contact.address2 !== "nan"
                  ? form.judge_contact.address2
                  : ""
              }
              className="form-control bg-white"
              name="judge_contact.address2"
              onChange={handleChange}
            />
          </span>
        </div>
      </div>
      <div className="row align-items-center form-group">
        <div className="col-2">{/* just for the col-2 space */}</div>
        <div className="col-10 d-flex p-0">
          <div className="col-4">
            <input
              type="text"
              placeholder="City"
              value={form?.judge_contact?.city}
              className="form-control"
              name="judge_contact.city"
              onChange={handleChange}
            />
          </div>
          <div className="col-4">
            <select
              name="judge_contact.state"
              className="form-select form-control"
              value={form?.judge_contact?.state}
              onChange={handleChange}
            >
              {form.state?.length ? null : (
                <option value="">Select State</option>
              )}
              {statesData?.map((item) => (
                <option key={item.id} value={item.StateAbr}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-4">
            <input
              type="text"
              placeholder="Zip"
              value={form?.judge_contact?.zip}
              className="form-control"
              name="judge_contact.zip"
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
      <div className="row align-items-center form-group">
        <div className="col-2 text-left">
          <span className="d-inline-block text-grey">Phone & Fax</span>
        </div>
        <div className="col-10 d-flex p-0">
          <span className="col-6">
            <input
              type="text"
              placeholder="Phone"
              value={
                form?.judge_contact?.phone_number &&
                form.judge_contact.phone_number !== "nan"
                  ? form.judge_contact.phone_number
                  : ""
              }
              className="form-control bg-white"
              name="judge_contact.phone_number"
              onChange={handleChange}
            />
          </span>
          <span className="col-6">
            <input
              type="text"
              placeholder="Fax"
              value={
                form?.judge_contact?.fax && form.judge_contact.fax !== "nan"
                  ? form.judge_contact.fax
                  : ""
              }
              className="form-control bg-white"
              name="judge_contact.fax"
              onChange={handleChange}
            />
          </span>
        </div>
      </div>
      <div className="row align-items-center form-group">
        <div className="col-2 text-left">
          <span className="d-inline-block text-grey text-nowrap">Email & Website</span>
        </div>
        <div className="col-10 d-flex p-0">
          <span className="col-6">
            <input
              type="text"
              placeholder="Email"
              value={
                form?.judge_contact?.email && form.judge_contact.email !== "nan"
                  ? form.judge_contact.email
                  : ""
              }
              className="form-control bg-white"
              name="judge_contact.email"
              onChange={handleChange}
            />
          </span>
          <span className="col-6">
            <input
              type="text"
              placeholder="Website"
              value={
                form?.judge_contact?.website &&
                form.judge_contact.website !== "nan"
                  ? form.judge_contact.website
                  : ""
              }
              className="form-control bg-white"
              name="judge_contact.website"
              onChange={handleChange}
            />
          </span>
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
    </>
  );

  const renderModalContent = () => {
    if (!litigationID) {
      return <div className="text-red mb-4">Create a Litigation First</div>;
    }
    if (!courtId) {
      return <div className="text-red mb-4">Select Court First</div>;
    }
    if (loading) {
      return <div>Loading...</div>;
    }

    return (
      <>
        {noJudges && JudgeData?.judgeId && (
          <div className="mb-2 text-red">No Judges for current Court</div>
        )}
        {renderJudgeFields()}
        {renderDepartmentField()}
        {renderContactFields()}
      </>
    );
  };

  return (
    <Modal
      show={showPopup}
      onHide={handleClose}
      dialogClassName="modal-dialog-2 modal-dialog-centered"
    >
      <Modal.Header className="p-2 bg-primary">
        <h4 className="modal-title mx-auto text-white">Judge & Department</h4>
      </Modal.Header>

      <Modal.Body className="min-h-400">{renderModalContent()}</Modal.Body>

      <Modal.Footer>
        <button
          type="button"
          className="btn btn-secondary h-35px"
          onClick={handleClose}
        >
          Cancel
        </button>
        {litigationID && courtId && (
          <button
            type="button"
            className="btn btn-success"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Save"}
          </button>
        )}
      </Modal.Footer>
    </Modal>
  );
}

export default JudgeandDepartmentPopUp;
