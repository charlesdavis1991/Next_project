import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Tab, Nav } from "react-bootstrap";
import { getCaseId, getClientId } from "../../Utils/helper";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteStatute,
  updateStatute,
} from "../../Redux/statue-data/statuteSlice";

function StatuePopUp({ statuesPopUp, handleClose, selectedStatue }) {
  const tokenBearer = localStorage.getItem("token");
  const currentCaseId = getCaseId();
  const clientId = getClientId();
  const origin = process.env.REACT_APP_BACKEND_URL;
  const dispatch = useDispatch();
  const { statesData } = useSelector((state) => state.states);
  const [statueLimit, setStatueLimit] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("statute");
  const [form, setForm] = useState({
    name: "",
    time_span: "",
    statue_type: "",
    state: "",
    expired_on: "",
    filing_date: "",
    filing_date_added: false,
    satisfied: false,
    removed: false,
    incident_date_bool: false,
    case_type_bool: false,
    case_state_bool: false,
    is_triggered: false,
    triggered_item: [],
  });
  const [form2, setForm2] = useState({
    name: "",
    time_span: "",
    statue_type: "",
    state: "",
    expired_on: "",
    filing_date: "",
    filing_date_added: false,
    satisfied: false,
    removed: false,
    incident_date_bool: false,
    case_type_bool: false,
    case_state_bool: false,
    is_triggered: false,
    triggered_item: [],
    category: "",
  });
  const ttr = [
    {
      id: 2,
      name: "Public Entity Expired",
      time_span: "45 Days",
    },
    {
      id: 15,
      name: "Claim Form Filing Minor",
      time_span: "2 years",
    },
    {
      id: 18,
      name: "khan statue",
      time_span: "2",
    },
    {
      id: 19,
      name: "Umar Farooq",
      time_span: "55",
    },
  ];

  const getStatuesLimitationHandle = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${origin}/api/get/statue/limits/`, {
        headers: {
          Authorization: tokenBearer,
        },
      });

      setStatueLimit(response.data.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getStatuesLimitationHandle();
  }, []);

  useEffect(() => {
    if (selectedStatue) {
      const filingDate = selectedStatue.claim_form_filing_date
        ? selectedStatue.claim_form_filing_date.split("T")[0]
        : "";
      const triggered_item = selectedStatue.additional_statute_triggered?.map(
        (st) => String(st.id)
      );
      setForm({
        name: selectedStatue?.name || "",
        time_span: selectedStatue?.time_span || "",
        statue_type: selectedStatue?.statute_type || "After 18th birthday",
        state: selectedStatue?.for_state?.id || "",
        expired_on: selectedStatue?.expired_on?.id || "", // Ensure this is set correctly
        filing_date: filingDate || "",
        filing_date_added: selectedStatue?.filing_date_added || false,
        satisfied: selectedStatue?.satisfied || false,
        removed: selectedStatue?.removed || false,
        incident_date_bool: selectedStatue?.incident_date_bool || false,
        case_type_bool: selectedStatue?.case_type_bool || false,
        case_state_bool: selectedStatue?.case_state_bool || false,
        is_triggered: selectedStatue?.is_triggered || false,
        triggered_item: triggered_item || [],
      });
    }
  }, [selectedStatue]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleChange2 = (e) => {
    const { name, value, type, checked } = e.target;
    setForm2((prevForm) => ({
      ...prevForm,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setForm((prevForm) => {
      const updatedTriggeredItem = checked
        ? [...prevForm.triggered_item, value]
        : prevForm.triggered_item.filter((item) => item !== value);
      return {
        ...prevForm,
        triggered_item: updatedTriggeredItem,
      };
    });
  };

  const handleDeleteClick = async () => {
    try {
      const response = await axios.delete(
        `${origin}/api/add/statue/${clientId}/${currentCaseId}/`,
        {
          data: {
            id: selectedStatue.id,
          },
          headers: {
            Authorization: tokenBearer,
          },
        }
      );
      if (response.status === 200) {
        handleClose();
        dispatch(deleteStatute(selectedStatue.id));
      }
    } catch (error) {
      console.error("Error deleting statue:", error.message);
    }
  };

  const handleSaveClick = async () => {
    // const expired_on =
    //   typeof form.expired_on === "object"
    //     ? form.expired_on
    //     : statueLimit.find((st) => st.id == form.expired_on);
    const updatedStatue = {
      id: selectedStatue.id,
      name: form.name,
      time_span: form.time_span,
      statue_type: form.statue_type,
      state: form.state,
      expired_on: form.expired_on,
      filing_date: form.filing_date,
      filing_date_added: form.filing_date_added,
      satisfied: form.satisfied,
      removed: form.removed,
      incident_date_bool: form.incident_date_bool,
      case_type_bool: form.case_type_bool,
      case_state_bool: form.case_state_bool,
      is_triggered: form.is_triggered,
      triggered_item: form.triggered_item?.map((num) => Number(num)),
    };

    try {
      const response = await axios.patch(
        `${origin}/api/add/statue/${clientId}/${currentCaseId}/`,
        updatedStatue,
        {
          headers: {
            Authorization: tokenBearer,
          },
        }
      );
      if (response.status === 200) {
        handleClose();
        dispatch(
          updateStatute({
            id: updatedStatue.id,
            updatedData: response.data.data,
          })
        );
      }
    } catch (error) {
      console.error("Error updating insurance company:", error.message);
      console.error("Error Response:", error.response); // Add this line to get more details about the error
    }
  };

  return (
    <Modal
      show={statuesPopUp}
      onHide={handleClose}
      dialogClassName="modal-dialog-centered max-1000p custom-insurance-dialog"
    >
      <Modal.Header className="bg-primary text-center p-2">
        <h4 className="modal-title text-white mx-auto" id="exampleModalLabel">
          Edit Statues
        </h4>
      </Modal.Header>
      <Modal.Body>
        {/* Form Fields */}
        <div className="row">
          <div className="col-6 w-100">
            <div className="text-center">
              <h5 className="modal-title mb-2 mx-auto">Original</h5>
            </div>
            <div className="row align-items-center form-group">
              <div className="col-md-2 text-left">
                <span className="d-inline-block text-grey">
                  <nobr>Name</nobr>
                </span>
              </div>
              <div className="col-md-10">
                <input
                  type="text"
                  placeholder="Enter Name"
                  value={form.name}
                  className="form-control"
                  name="name"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="row align-items-center form-group">
              <div className="col-md-2 text-left">
                <span className="d-inline-block text-grey">
                  <nobr>Time Span</nobr>
                </span>
              </div>
              <div className="col-md-10">
                <input
                  type="text"
                  placeholder="Enter Time Span"
                  value={form.time_span}
                  className="form-control"
                  name="time_span"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="row align-items-center form-group">
              <div className="col-md-2 text-left">
                <span className="d-inline-block text-grey">
                  <nobr>Statue Type</nobr>
                </span>
              </div>
              <div className="col-md-10">
                <select
                  name="statue_type"
                  className="form-select form-control"
                  value={form.statue_type}
                  onChange={handleChange}
                >
                  <option value="After 18th birthday">
                    After 18th birthday
                  </option>
                  <option value="After DOI">After DOI</option>
                </select>
              </div>
            </div>

            <div className="row align-items-center form-group">
              <div className="col-md-2 text-left">
                <span className="d-inline-block text-grey">State</span>
              </div>
              <div className="col-md-10">
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
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="row align-items-center form-group">
              <div className="col-md-2 text-left">
                <span className="d-inline-block text-grey">Expired On</span>
              </div>
              <div className="col-md-10">
                <select
                  name="expired_on"
                  className="form-select form-control"
                  value={form.expired_on}
                  onChange={handleChange}
                >
                  {statueLimit?.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="row align-items-center form-group">
              <div className="col-md-2 text-left">
                <span className="d-inline-block text-grey">
                  <nobr>Filing Date</nobr>
                </span>
              </div>
              <div className="col-md-10">
                <input
                  type="date"
                  min="1000-01-01"
                  max="9999-12-31"
                  placeholder=""
                  value={form.filing_date}
                  className="form-control"
                  name="filing_date"
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Checkbox Fields */}
            <div className="row align-items-center form-group">
              <div className="col-md-2 text-left">
                <span className="d-inline-block text-grey">
                  Filing Date Added
                </span>
              </div>
              <div className="col-md-10">
                <input
                  type="checkbox"
                  placeholder=""
                  className="form-control"
                  name="filing_date_added"
                  checked={form.filing_date_added}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="row align-items-center form-group">
              <div className="col-md-2 text-left">
                <span className="d-inline-block text-grey">Satisfied</span>
              </div>
              <div className="col-md-10">
                <input
                  type="checkbox"
                  placeholder=""
                  className="form-control"
                  name="satisfied"
                  checked={form.satisfied}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="row align-items-center form-group">
              <div className="col-md-2 text-left">
                <span className="d-inline-block text-grey">Removed</span>
              </div>
              <div className="col-md-10">
                <input
                  type="checkbox"
                  placeholder=""
                  className="form-control"
                  name="removed"
                  checked={form.removed}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="row align-items-center form-group">
              <div className="col-md-2 text-left">
                <span className="d-inline-block text-grey">Incident Date</span>
              </div>
              <div className="col-md-10">
                <input
                  type="checkbox"
                  placeholder=""
                  className="form-control"
                  name="incident_date_bool"
                  checked={form.incident_date_bool}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="row align-items-center form-group">
              <div className="col-md-2 text-left">
                <span className="d-inline-block text-grey">Case Type</span>
              </div>
              <div className="col-md-10">
                <input
                  type="checkbox"
                  placeholder=""
                  className="form-control"
                  name="case_type_bool"
                  checked={form.case_type_bool}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="row align-items-center form-group">
              <div className="col-md-2 text-left">
                <span className="d-inline-block text-grey">Case State</span>
              </div>
              <div className="col-md-10">
                <input
                  type="checkbox"
                  placeholder=""
                  className="form-control"
                  name="case_state_bool"
                  checked={form.case_state_bool}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="row align-items-center form-group">
              <div className="col-md-2 text-left">
                <span className="d-inline-block text-grey">Is Triggered</span>
              </div>
              <div className="col-md-10">
                <input
                  type="checkbox"
                  placeholder=""
                  className="form-control"
                  name="is_triggered"
                  checked={form.is_triggered}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="row align-items-center form-group">
              <div className="col-md-2 text-left">
                <span className="d-inline-block text-grey">
                  Additional Statute Triggered
                </span>
              </div>
              <div className="col-md-8" id="triggered_statute_block">
                {statueLimit?.map((item) => (
                  <div
                    className="col-md-6"
                    key={item.id}
                    data-state={item.for_state.id}
                  >
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={`item_Checkbox${item.id}`}
                        value={String(item.id)} // Ensure the value is a string
                        name="triggered_item"
                        checked={form.triggered_item.includes(String(item.id))} // Ensure the includes check is against a string
                        onChange={handleCheckboxChange}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`item_Checkbox${item.id}`}
                      >
                        <nobr>{item.name}</nobr>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div class="divider"></div>
          <div className="col-6 w-100">
            <Tab.Container
              activeKey={activeTab}
              onSelect={(key) => {
                setActiveTab(key);
              }}
            >
              <Nav variant="tabs" className="mb-3 justify-content-center">
                <Nav.Item>
                  <Nav.Link eventKey="statute">Statute</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="caseType">Case Type</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="trigger">Triggers Statute</Nav.Link>
                </Nav.Item>
              </Nav>
              <Tab.Content>
                <Tab.Pane
                  eventKey="statute"
                  style={{ overflowX: "hidden", height: "100%" }}
                >
                  <div className="row align-items-center form-group">
                    <div className="col-md-2 text-left">
                      <span className="d-inline-block text-grey">
                        <nobr>Name</nobr>
                      </span>
                    </div>
                    <div className="col-md-9">
                      <input
                        type="text"
                        placeholder="Enter Name"
                        value={form2.name}
                        className="form-control"
                        name="name"
                        onChange={handleChange2}
                      />
                    </div>
                  </div>
                  <div className="row align-items-center form-group">
                    <div className="col-md-2 text-left">
                      <span className="d-inline-block text-grey">State</span>
                    </div>
                    <div className="col-md-9">
                      <select
                        name="state"
                        className="form-select form-control"
                        value={form2.state}
                        onChange={handleChange2}
                      >
                        {form2.state?.length ? null : (
                          <option value="">select state</option>
                        )}
                        {statesData?.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="row align-items-center form-group">
                    <div className="col-md-2 text-left">
                      <span className="d-inline-block text-grey">
                        <nobr>Trigger Date</nobr>
                      </span>
                    </div>
                    <div className="col-md-9">
                      <select
                        name="statue_type"
                        className="form-select form-control"
                        value={form2.statue_type}
                        onChange={handleChange2}
                      >
                        <option value="After 18th birthday">
                          After 18th birthday
                        </option>
                        <option value="After DOI">After DOI</option>
                        <option value="Filing Date">Filing Date</option>
                      </select>
                    </div>
                  </div>
                </Tab.Pane>
                <Tab.Pane
                  eventKey="caseType"
                  style={{ overflowX: "hidden", height: "100%" }}
                >
                  <div className="row align-items-center form-group">
                    <div className="col-md-2 text-left">
                      <span className="d-inline-block text-grey">
                        <nobr>Category</nobr>
                      </span>
                    </div>
                    <div className="col-md-9">
                      <select
                        name="category"
                        className="form-select form-control"
                        value={form2.category}
                        onChange={handleChange2}
                      >
                        <option value="Category 1">Category 1</option>
                        <option value="Category 2">Category 2</option>
                        <option value="Category 3">Category 3</option>
                      </select>
                    </div>
                  </div>
                  <div className="row align-items-center form-group">
                    <div className="col-md-2 text-left">
                      <span className="d-inline-block text-grey">
                        Case Type
                      </span>
                    </div>
                    <div className="col-md-9">
                      <input
                        type="checkbox"
                        placeholder=""
                        className="form-control"
                        name="case_type_bool"
                        checked={form2.case_type_bool}
                        onChange={handleChange2}
                      />
                    </div>
                  </div>
                  <div className="row align-items-center form-group">
                    <div className="col-md-2 text-left">
                      <span className="d-inline-block text-grey">
                        Additional Statute Triggered
                      </span>
                    </div>
                    <div className="col-md-9" id="triggered_statute_block">
                      <select
                        className="form-control"
                        multiple
                        style={{ minHeight: "200px" }}
                        value={form2.triggered_item}
                        onChange={handleChange2}
                      >
                        {statueLimit?.map((item) => (
                          <option key={item.id} value={String(item.id)}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </Tab.Pane>
                <Tab.Pane
                  eventKey="trigger"
                  style={{ overflowX: "hidden", height: "100%" }}
                ></Tab.Pane>
              </Tab.Content>
            </Tab.Container>
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

export default StatuePopUp;
