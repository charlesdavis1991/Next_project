import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getCaseId, getClientId } from "../../Utils/helper";
import { addCourt } from "../../Redux/courts-table/courtsSlice";
import { Modal, Tab, Nav } from "react-bootstrap";

const initialState = {
  court_name: "",
  address1: "",
  address2: "",
  court_county: "",
  city: "",
  state: "",
  zip: "",
  phone_number: "",
  phone_ext: "",
  fax: "",
  email: "",
  website: "",
  jurisdiction_type: {},
  jurisdiction: {},
  court_title_1: "",
  court_title_2: "",
  counties_served: [],
};

function CourtDirectoryModal({ courtPopUp, handleClose }) {
  const tokenBearer = localStorage.getItem("token");
  const currentCaseId = getCaseId();
  const clientId = getClientId();
  const origin = process.env.REACT_APP_BACKEND_URL;
  const dispatch = useDispatch();
  const { statesData } = useSelector((state) => state.states);
  const [countiesData, setCountiesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(initialState);
  const [activeTab, setActiveTab] = useState("court");
  const [searchTerm, setSearchTerm] = useState([]);
  const [jurisdictionData, setJurisdictionData] = useState([]);
  const [filteredJurisdictions, setFilteredJurisdictions] = useState([]);
  const [form_State, setForm_State] = useState("");

  const getJurisdictionDataHandler = async () => {
    try {
      const response = await axios.get(
        `${origin}/api/get/jurisdiction/directory/?state=${form_State}`,
        {
          headers: {
            Authorization: tokenBearer,
          },
        }
      );
      setJurisdictionData(response.data.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const getCounties = async () => {
    try {
      const response = await axios.get(
        `${origin}/api/all/counties/?state=${form_State}`,
        {
          headers: {
            Authorization: tokenBearer,
          },
        }
      );
      setCountiesData(response.data.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courtPopUp){      
      getCounties();
      getJurisdictionDataHandler();
    }
  }, [form_State, courtPopUp]);

  const handleCountiesChange = (countyId) => {
    setForm((prevForm) => {
      const updatedCounties = prevForm.counties_served.includes(countyId)
        ? prevForm.counties_served.filter((id) => id !== countyId) // Deselect county
        : [...prevForm.counties_served, countyId]; // Select county

      return {
        ...prevForm,
        counties_served: updatedCounties,
      };
    });
  };

  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    if (!value) {
      setFilteredJurisdictions([]);
      return;
    }

    const filtered = jurisdictionData?.filter((item) => {
      const nameMatch = item.name?.toLowerCase().includes(value);
      const jurisdictionTypeMatch = item?.jurisdiction_type?.name
        ?.toLowerCase()
        .includes(value);

      const stateMatch = item.states?.some(
        (state) =>
          state.name?.toLowerCase().includes(value) ||
          state.StateAbr?.toLowerCase().includes(value)
      );

      const countyMatch = item.counties?.some((county) =>
        county.name?.toLowerCase().includes(value)
      );

      const circuitMatch = item.circuits?.some((circuit) =>
        circuit.circuit_name?.toLowerCase().includes(value)
      );

      const districtMatch = item.districts?.some((district) =>
        district.name?.toLowerCase().includes(value)
      );

      return (
        nameMatch ||
        jurisdictionTypeMatch ||
        stateMatch ||
        countyMatch ||
        circuitMatch ||
        districtMatch
      );
    });

    setFilteredJurisdictions(filtered);
  };

  const handleSelectJurisdiction = (jurisdiction) => {
    setForm((prevForm) => ({
      ...prevForm,
      jurisdiction: jurisdiction,
      jurisdiction_type: jurisdiction.jurisdiction_type,
    }));
    setSearchTerm("");
    setFilteredJurisdictions([]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "state") {
      setForm_State(value);
    }
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
      ...(name === "state" && { counties_served: [], court_county: "" }),
      ...(name === "state" && prevForm.jurisdiction?.states && !prevForm.jurisdiction.states.some((state) => state.StateAbr === value) && {jurisdiction: {}})
    }));
  };

  const handleSaveClick = async () => {
    try {
      const response = await axios.post(
        `${origin}/api/add/court/directory/${clientId}/${currentCaseId}/`,
        form,
        {
          headers: {
            Authorization: tokenBearer,
          },
        }
      );
      if (response.status == 200) {
        handleClose();
        dispatch(addCourt(response.data.data));
        setActiveTab("court");
        setForm(initialState);
      }
    } catch (error) {
      console.error("Error Response:", error);
    }
  };

  const handleCloseModal = () => {
    handleClose();
    setActiveTab("court");
    setForm(initialState);
  };

  return (
    <Modal
      show={courtPopUp}
      onHide={handleClose}
      dialogClassName="modal-dialog-centered Law-firm-direct-max-width-1100px"
    >
      <Modal.Header className="text-center bg-primary p-2">
        <h4 className="modal-title text-white mx-auto">Add Court</h4>
      </Modal.Header>
      <Modal.Body>
        <Tab.Container
          activeKey={activeTab}
          onSelect={(key) => setActiveTab(key)}
        >
          <Nav variant="tabs" className="mb-2">
            <Nav.Item>
              <Nav.Link eventKey="court">Court</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="contact">Contact</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="jurisdiction">Jurisdiction</Nav.Link>
            </Nav.Item>
            {form?.state && (
              <Nav.Item>
                <Nav.Link eventKey="counties">Counties Served</Nav.Link>
              </Nav.Item>
            )}
          </Nav>
          <Tab.Content className="min-h-400">
            <Tab.Pane eventKey="court" className="overflow-hidden">
              <div className="row align-items-center form-group">
                <div className="col-md-2 text-left">
                  <span className="d-inline-block text-grey">
                    <nobr>Court Name</nobr>
                  </span>
                </div>
                <div className="col-md-10">
                  <input
                    type="text"
                    placeholder="Enter Court Name"
                    value={form.court_name}
                    className="form-control"
                    name="court_name"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="row align-items-center form-group">
                <div className="col-md-2 text-left">
                  <span className="d-inline-block text-grey">
                    <nobr>Court Title</nobr>
                  </span>
                </div>
                <div className="col-md-5">
                  <input
                    type="text"
                    placeholder="Enter Title 1"
                    value={form?.court_title_1}
                    className="form-control"
                    name="court_title_1"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-5">
                  <input
                    type="text"
                    placeholder="Enter Title 2"
                    value={form?.court_title_2}
                    className="form-control"
                    name="court_title_2"
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
                    value={form?.address1}
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
                    value={form?.address2}
                    className="form-control"
                    name="address2"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="row align-items-center form-group">
                <div className="col-md-2 text-left">
                  <span className="d-inline-block text-grey dispay-none-LFD"></span>
                </div>
                <div className="col-md-5">
                  <input
                    type="text"
                    placeholder="City"
                    value={form?.city}
                    className="form-control"
                    name="city"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-5">
                  <select
                    name="state"
                    className="form-select form-control"
                    value={form?.state || ""}
                    onChange={handleChange}
                  >
                    <option value="" className="text-grey">
                      Select State
                    </option>
                    {statesData?.map((item) => (
                      <option key={item.id} value={item.StateAbr}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="row align-items-center form-group pb-4">
                <div className="col-md-2 text-left">
                  <span className="d-inline-block text-grey">
                    County Location
                  </span>
                </div>
                <div className="col-md-5">
                  <select
                    name="court_county"
                    className="form-select form-control"
                    value={form?.court_county}
                    onChange={handleChange}
                    disabled={!form?.state}
                  >
                    <option value="">Select County</option>
                    {countiesData?.map((item) => (
                        <option key={item.id} value={item.name}>
                          {item.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="col-md-5">
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
            </Tab.Pane>
            <Tab.Pane eventKey="contact" className="overflow-hidden">
              <div className="row align-items-center form-group">
                <div className="col-md-2 text-left">
                  <span className="d-inline-block text-grey">Phone</span>
                </div>
                <div className="col-md-5">
                  <input
                    type="text"
                    placeholder="Enter Phone"
                    value={form.phone_number}
                    className="form-control"
                    name="phone_number"
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
                    value={form.phone_ext}
                    className="form-control"
                    name="phone_ext"
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

              <div class="row align-items-center form-group pb-4">
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
            </Tab.Pane>
            <Tab.Pane eventKey="jurisdiction" className="overflow-hidden">
              <input
                type="text"
                style={{
                  flex: 1,
                }}
                className="form-control p-2 mb-2"
                placeholder="Search for Jurisdiction"
                onChange={handleSearchChange}
                disabled={!form.state}
              />
              {filteredJurisdictions.length > 0 && (
                <ul
                  className="list-group mt-2 position-fixed bg-white"
                  style={{ zIndex: 1, width: "42.6%" }}
                >
                  {filteredJurisdictions.map((jurisdiction) => {
                    const displayName = [
                      jurisdiction.jurisdiction_type?.name
                        ? `Type: ${jurisdiction.jurisdiction_type.name}`
                        : "",
                      jurisdiction.name ? `Name: ${jurisdiction.name}` : "",
                      jurisdiction.circuits?.length > 0
                        ? `Circuits: ${jurisdiction.circuits?.map((circuit) => circuit.circuit_name).join(" | ")}`
                        : "",
                    ]
                      .filter(Boolean)
                      .join(" - ");

                    const truncatedDisplayName =
                      displayName.length > 180
                        ? `${displayName.slice(0, 180)}...`
                        : displayName;

                    return (
                      <li
                        key={jurisdiction.id}
                        className="list-group-item"
                        onClick={() => handleSelectJurisdiction(jurisdiction)}
                        style={{ cursor: "pointer" }}
                      >
                        {truncatedDisplayName || "Unnamed Jurisdiction"}{" "}
                      </li>
                    );
                  })}
                </ul>
              )}
              <div className="row align-items-center form-group">
                <div className="col-md-2 text-left">
                  <span className="d-inline-block text-grey">Name</span>
                </div>
                <div className="col-md-10">
                  <span className="custom-input-like d-inline-block w-100">
                    {form?.jurisdiction?.name}
                  </span>
                </div>
              </div>
              <div className="row align-items-center form-group py-2">
                <div className="col-md-2 text-left">
                  <span className="d-inline-block text-grey">
                    Jurisdiction Type
                  </span>
                </div>
                <div className="col-md-10 row">
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      value="1"
                      style={{ accentColor: "grey" }}
                      checked={form?.jurisdiction?.jurisdiction_type?.id === 1}
                      readOnly
                    />
                    <label className="form-check-label" htmlFor="federal">
                      Federal
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      value="2"
                      style={{ accentColor: "grey" }}
                      checked={form?.jurisdiction?.jurisdiction_type?.id === 2}
                      readOnly
                    />
                    <label className="form-check-label" htmlFor="state">
                      State
                    </label>
                  </div>
                </div>
              </div>
              <div className="row align-items-center form-group">
                <div className="col-md-2 text-left">
                  <span className="d-inline-block text-grey">
                    State(s) & Counties
                  </span>
                </div>
                <div className="col-md-5">
                  <span className="custom-input-like d-inline-block w-100">
                    {form?.jurisdiction?.states &&
                      form?.jurisdiction?.states
                        ?.map((state) => `${state.StateAbr}, ${state.name}`)
                        .join(", ")
                        .slice(0, 80)
                        .concat(
                          form?.jurisdiction?.states?.join(", ").length > 50
                            ? "..."
                            : ""
                        )}
                  </span>
                </div>
                <div className="col-md-5">
                  <span className="custom-input-like d-inline-block w-100">
                    {form?.jurisdiction?.counties &&
                      form?.jurisdiction?.counties
                        ?.map((county) => county.name)
                        .join(", ")
                        .slice(0, 80)
                        .concat(
                          form?.jurisdiction?.counties?.join(", ").length > 50
                            ? "..."
                            : ""
                        )}
                  </span>
                </div>
              </div>
              <div className="row align-items-center form-group">
                <div className="col-md-2 text-left">
                  <span className="d-inline-block text-grey">
                    Circuit(s) & District(s)
                  </span>
                </div>
                <div className="col-md-5">
                  <span className="custom-input-like d-inline-block w-100">
                    {form?.jurisdiction?.circuits &&
                      form?.jurisdiction?.circuits
                        ?.map((circuit) => circuit.circuit_name)
                        .join(", ")
                        .slice(0, 50) // Truncate to 50 characters
                        .concat(
                          form?.jurisdiction?.circuits?.join(", ").length > 50
                            ? "..."
                            : ""
                        )}
                  </span>
                </div>
                <div className="col-md-5">
                  <span className="custom-input-like d-inline-block w-100">
                    {form?.jurisdiction?.districts &&
                      form?.jurisdiction?.districts
                        ?.map((district) => district.name)
                        .join(", ")
                        .slice(0, 50)
                        .concat(
                          form?.jurisdiction?.districts?.join(", ").length > 50
                            ? "..."
                            : ""
                        )}
                  </span>
                </div>
              </div>
              <div className="row align-items-center form-group mb-2">
                <div className="col-md-2 text-left">
                  <span className="d-inline-block text-grey">Division(s)</span>
                </div>
                <div className="col-md-10">
                  <span className=" custom-input-like d-inline-block w-100">
                    {form?.jurisdiction?.divisions &&
                      form?.jurisdiction.divisions
                        ?.map((division) => division.name)
                        .join(", ")
                        .slice(0, 100)
                        .concat(
                          form?.jurisdiction.divisions.join(", ").length > 100
                            ? "..."
                            : ""
                        )}
                  </span>
                </div>
              </div>
            </Tab.Pane>
            <Tab.Pane eventKey="counties" className="overflow-hidden">
              <div className="row align-items-start form-group">
                <div className="col-2 text-left">
                  <span className="d-inline-block text-grey">
                    Counties For {form_State}
                  </span>
                </div>
                <div className="col-10">
                  <div
                    className="form-control"
                    style={{
                      height: "380px",
                      overflowY: "scroll",
                      border: "1px solid #ccc",
                      padding: "10px",
                    }}
                  >
                    {countiesData?.length > 0 ? (
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(4, 1fr)",
                          gap: "4px",
                        }}
                      >
                        {countiesData.map((county, index) => (
                          <div key={index} className="form-check">
                            <label className="form-check-label">
                              <input
                                type="checkbox"
                                name="counties_served"
                                value={county.id}
                                className="form-check-input"
                                style={{ accentColor: "grey" }}
                                checked={form?.counties_served?.includes(
                                  county.id
                                )}
                                onChange={() => handleCountiesChange(county.id)}
                              />
                              {county.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div>No Counties available</div>
                    )}
                  </div>
                </div>
              </div>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Modal.Body>
      <Modal.Footer>
        <button
          type="button"
          class="btn btn-secondary float-left-margin-right-auto"
          onClick={handleCloseModal}
        >
          Cancel
        </button>
        <button type="button" onClick={handleSaveClick} class="btn btn-success">
          Save
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default CourtDirectoryModal;
