import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getCaseId, getClientId } from "../../Utils/helper";
import { Modal, Tab, Nav } from "react-bootstrap";
import { addJurisdiction } from "../../Redux/jurisdiction-table/jurisdictionSlice";

const initialState = {
  name: "",
  states: [],
  counties: [],
  districts: [],
  circuits: [],
  divisions: [],
  jurisdiction_type: {},
};

function AddJurisdictionModal({ addJurisdictions, handleClose }) {
  const tokenBearer = localStorage.getItem("token");
  const currentCaseId = getCaseId();
  const clientId = getClientId();
  const origin = process.env.REACT_APP_BACKEND_URL;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { statesData } = useSelector((state) => state.states);
  const [countiesData, setCountiesData] = useState([]);
  const [circuitsData, setCircuitsData] = useState([]);
  const [districtsData, setDistrictsData] = useState([]);
  const [divisionsData, setDivisionsData] = useState([]);
  const [form, setForm] = useState(initialState);
  const [activeTab, setActiveTab] = useState("jurisdiction");
  const [type, setType] = useState("");

  const getCounties = async () => {
    try {
      const response = await axios.get(`${origin}/api/all/counties/`, {
        headers: {
          Authorization: tokenBearer,
        },
      });
      setCountiesData(response.data.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const getCircuits = async () => {
    try {
      const response = await axios.get(
        `${origin}/api/get/all/circuits/?type=${type}`,
        {
          headers: {
            Authorization: tokenBearer,
          },
        }
      );
      setCircuitsData(response.data.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const getDistricts = async () => {
    try {
      const response = await axios.get(
        `${origin}/api/add/districts/directory/${clientId}/${currentCaseId}/?type=${type}`,
        {
          headers: {
            Authorization: tokenBearer,
          },
        }
      );
      setDistrictsData(response.data.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const getDivisions = async () => {
    try {
      const response = await axios.get(`${origin}/api/divisions/directory/`, {
        headers: {
          Authorization: tokenBearer,
        },
      });
      setDivisionsData(response.data.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (addJurisdictions) {
      getCounties();
      getCircuits();
      getDistricts();
      getDivisions();
    }
  }, [addJurisdictions]);

  const handleStatesChange = (e, state) => {
    if (e.target.checked) {
      setForm((prevForm) => ({
        ...prevForm,
        states: [...prevForm.states, state],
      }));
    } else {
      setForm((prevForm) => ({
        ...prevForm,
        states: prevForm.states.filter((s) => s.id !== state.id),
        counties: prevForm.counties.filter(
          (county) => county.in_state.id !== state.id
        ),
        districts: prevForm.districts.filter(
          (district) => district.state.id !== state.id
        ),
        circuits: prevForm.circuits.filter(
          (circuit) => !circuit.states.some((s) => s.id === state.id)
        ),
        divisions: prevForm.divisions.filter(
          (division) => !division.states.some((s) => s.id === state.id)
        ),
      }));
    }
  };

  const handleCountiesChange = (e, county) => {
    if (e.target.checked) {
      setForm((prevForm) => ({
        ...prevForm,
        counties: [...prevForm.counties, county],
      }));
    } else {
      setForm((prevForm) => ({
        ...prevForm,
        counties: prevForm.counties.filter((c) => c.id !== county.id),
      }));
    }
  };

  const handleDistrictsChange = (e, district) => {
    if (e.target.checked) {
      setForm((prevForm) => ({
        ...prevForm,
        districts: [...prevForm.districts, district],
      }));
    } else {
      setForm((prevForm) => ({
        ...prevForm,
        districts: prevForm.districts.filter((d) => d.id !== district.id),
        divisions: prevForm.divisions.filter(
          (division) => division.district.id !== district.id
        ),
      }));
    }
  };

  const handleCircuitsChange = (e, circuit) => {
    if (e.target.checked) {
      setForm((prevForm) => ({
        ...prevForm,
        circuits: [...prevForm.circuits, circuit],
      }));
    } else {
      setForm((prevForm) => ({
        ...prevForm,
        circuits: prevForm.circuits.filter((c) => c.id !== circuit.id),
      }));
    }
  };

  const handleDivisionsChange = (e, division) => {
    if (e.target.checked) {
      setForm((prevForm) => ({
        ...prevForm,
        divisions: [...prevForm.divisions, division],
      }));
    } else {
      setForm((prevForm) => ({
        ...prevForm,
        divisions: prevForm.divisions.filter((div) => div.id !== division.id),
      }));
    }
  };

  const handleRadioChange = (e) => {
    const jurisdictionTypeId = Number(e.target.value);
    if (jurisdictionTypeId) {
    }
    setForm((prevForm) => ({
      ...prevForm,
      jurisdiction_type: { id: jurisdictionTypeId },
    }));
  };

  if (loading) {
    return (
      <div className="loading-container">
        <span className="loader"></span>
      </div>
    );
  }

  const handleJurisdictionSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${origin}/api/add/jurisdiction/directory/${clientId}/${currentCaseId}/`,
        form,
        {
          headers: {
            Authorization: tokenBearer,
          },
        }
      );

      if (response.status === 200) {
        const responseData = response.data.data;
        dispatch(addJurisdiction(responseData));
        handleClose();
        setForm(initialState);
        setActiveTab("jurisdiction");
      }
    } catch (err) {
      console.log(err.message);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-container">
          <span class="loader"></span>
        </div>
      </div>
    );
  }

  return (
    <Modal
      show={addJurisdictions}
      onHide={handleClose}
      dialogClassName="modal-dialog-centered Law-firm-direct-max-width-1100px"
    >
      <Modal.Header className="text-center p-2 bg-primary">
        <h4 className="modal-title text-white mx-auto">Add Jurisdiction</h4>
      </Modal.Header>
      <Modal.Body>
        <Tab.Container
          activeKey={activeTab}
          onSelect={(key) => {
            setActiveTab(key);
          }}
        >
          <Nav variant="tabs" className="mb-3 justify-content-center">
            <Nav.Item>
              <Nav.Link eventKey="jurisdiction">Jurisdiction</Nav.Link>
            </Nav.Item>
            {form.states.length > 0 && (
              <>
                <Nav.Item>
                  <Nav.Link eventKey="counties">Counties</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="districts">Districts</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="circuits">Circuits</Nav.Link>
                </Nav.Item>
                {form.districts.length > 0 && (
                  <Nav.Item>
                    <Nav.Link eventKey="divisions">Divisions</Nav.Link>
                  </Nav.Item>
                )}
              </>
            )}
          </Nav>
          <Tab.Content style={{ height: "500px" }}>
            <Tab.Pane
              eventKey="jurisdiction"
              style={{ overflowX: "hidden", height: "100%" }}
            >
              <div className="row align-items-center form-group">
                <div className="col-3 text-left">
                  <span className="d-inline-block text-grey">
                    <nobr>Jurisdiction Name</nobr>
                  </span>
                </div>
                <div className="col-8">
                  <input
                    type="text"
                    placeholder="Enter Jurisdiction Name"
                    value={form.name}
                    className="form-control"
                    name="name"
                    onChange={(e) =>
                      setForm((prevForm) => ({
                        ...prevForm,
                        name: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="row align-items-center form-group">
                <div className="col-3 text-left">
                  <span className="d-inline-block text-grey">
                    Jurisdiction Type
                  </span>
                </div>
                <div className="col-8">
                  <div className="row">
                    <label className="d-inline-block mx-3 px-2">
                      <input
                        type="radio"
                        value="1"
                        checked={form.jurisdiction_type.id === 1}
                        onChange={handleRadioChange}
                        style={{ accentColor: "grey", marginRight: "8px" }}
                      />
                      Federal
                    </label>
                    <label className="d-inline-block mx-3 px-2">
                      <input
                        type="radio"
                        value="2"
                        checked={form.jurisdiction_type.id === 2}
                        onChange={handleRadioChange}
                        style={{ accentColor: "grey", marginRight: "8px" }}
                      />
                      State
                    </label>
                  </div>
                </div>
              </div>
              <div className="row align-items-start form-group">
                <div className="col-3 text-left">
                  <span className="d-inline-block text-grey">States :</span>
                </div>
                <div className="col-8">
                  <div
                    className="form-control"
                    style={{
                      height: "380px",
                      overflowY: "scroll",
                      border: "1px solid #ccc",
                      padding: "10px",
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: "10px",
                    }}
                  >
                    {statesData?.map((state) => (
                      <div key={state.id} className="form-check">
                        <label className="form-check-label">
                          <input
                            type="checkbox"
                            name="states"
                            value={state}
                            className="form-check-input"
                            style={{ accentColor: "grey" }}
                            checked={form.states?.some(
                              (st) => st.id === state.id
                            )}
                            onChange={(e) => handleStatesChange(e, state)}
                          />
                          {state.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Tab.Pane>
            <Tab.Pane
              eventKey="counties"
              style={{ overflowX: "hidden", height: "100%" }}
            >
              {form.states.length > 0 &&
                form.states.map((state) => (
                  <div
                    className="row align-items-start form-group"
                    key={state.id}
                  >
                    <div className="col-3 text-left">
                      <span className="d-inline-block text-grey">
                        Counties For {state.name}
                      </span>
                    </div>
                    <div className="col-8">
                      <div
                        className="form-control"
                        style={{
                          height: "400px",
                          overflowY: "scroll",
                          border: "1px solid #ccc",
                          padding: "10px",
                        }}
                      >
                        {countiesData ? (
                          (() => {
                            const filteredCounties = countiesData.filter(
                              (county) => county.in_state?.id === state.id
                            );

                            return filteredCounties.length > 0 ? (
                              <div
                                style={{
                                  display: "grid",
                                  gridTemplateColumns: "repeat(3, 1fr)",
                                  gap: "4px",
                                }}
                              >
                                {filteredCounties.length > 1 && (
                                  <div className="form-check">
                                    <label className="form-check-label">
                                      <input
                                        type="checkbox"
                                        className="form-check-input"
                                        style={{ accentColor: "grey" }}
                                        checked={filteredCounties.every(
                                          (county) =>
                                            form.counties?.some(
                                              (count) => count.id === county.id
                                            )
                                        )}
                                        onChange={(e) => {
                                          setForm((prevForm) => ({
                                            ...prevForm,
                                            counties: e.target.checked
                                              ? [
                                                  ...new Set([
                                                    ...prevForm.counties,
                                                    ...filteredCounties,
                                                  ]),
                                                ]
                                              : prevForm.counties.filter(
                                                  (county) =>
                                                    !filteredCounties.some(
                                                      (count) =>
                                                        count.id === county.id
                                                    )
                                                ),
                                          }));
                                        }}
                                      />
                                      All Counties
                                    </label>
                                  </div>
                                )}

                                {filteredCounties.map((county) => (
                                  <div key={county.id} className="form-check">
                                    <label className="form-check-label">
                                      <input
                                        type="checkbox"
                                        name="counties"
                                        value={county}
                                        className="form-check-input"
                                        style={{ accentColor: "grey" }}
                                        checked={form.counties?.some(
                                          (count) => count.id === county.id
                                        )}
                                        onChange={(e) =>
                                          handleCountiesChange(e, county)
                                        }
                                      />
                                      {county.name}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div>No Counties available for {state.name}</div>
                            );
                          })()
                        ) : (
                          <div>No Counties available for {state.name}</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </Tab.Pane>
            <Tab.Pane
              eventKey="districts"
              style={{ overflowX: "hidden", height: "100%" }}
            >
              {form.states.length > 0 &&
                form.states.map((state) => (
                  <div
                    className="row align-items-start form-group"
                    key={state.id}
                  >
                    <div className="col-3 text-left">
                      <span className="d-inline-block text-grey">
                        District(s) For {state.name}
                      </span>
                    </div>
                    <div className="col-8">
                      <div
                        className="form-control"
                        style={{
                          height: "400px",
                          overflowY: "scroll",
                          border: "1px solid #ccc",
                          padding: "10px",
                        }}
                      >
                        {districtsData ? (
                          (() => {
                            let jurisdiction = "";
                            if (form?.jurisdiction_type?.id === 1) {
                              jurisdiction = "Federal";
                            } else if (form?.jurisdiction_type?.id === 2) {
                              jurisdiction = "State";
                            }
                            const filteredDistricts = districtsData.filter(
                              (district) =>
                                district.state?.id === state.id &&
                                (!form?.jurisdiction_type?.id ||
                                  district?.district_type === jurisdiction)
                            );

                            return filteredDistricts.length > 0 ? (
                              <div
                                style={{
                                  display: "grid",
                                  gridTemplateColumns: "repeat(3, 1fr)",
                                  gap: "10px",
                                }}
                              >
                                {filteredDistricts.length > 1 && (
                                  <div className="form-check">
                                    <label className="form-check-label">
                                      <input
                                        type="checkbox"
                                        className="form-check-input"
                                        style={{ accentColor: "grey" }}
                                        checked={filteredDistricts.every(
                                          (district) =>
                                            form.districts?.some(
                                              (dis) => dis.id === district.id
                                            )
                                        )}
                                        onChange={(e) => {
                                          setForm((prevForm) => ({
                                            ...prevForm,
                                            districts: e.target.checked
                                              ? [
                                                  ...new Set([
                                                    ...prevForm.districts,
                                                    ...filteredDistricts,
                                                  ]),
                                                ]
                                              : prevForm.districts.filter(
                                                  (district) =>
                                                    !filteredDistricts.some(
                                                      (dis) =>
                                                        dis.id === district.id
                                                    )
                                                ),
                                          }));
                                        }}
                                      />
                                      All Districts
                                    </label>
                                  </div>
                                )}

                                {/* Individual District Checkboxes */}
                                {filteredDistricts.map((district) => (
                                  <div key={district.id} className="form-check">
                                    <label className="form-check-label">
                                      <input
                                        type="checkbox"
                                        name="districts"
                                        value={district}
                                        className="form-check-input"
                                        style={{ accentColor: "grey" }}
                                        checked={form.districts?.some(
                                          (dis) => dis.id === district.id
                                        )}
                                        onChange={(e) =>
                                          handleDistrictsChange(e, district)
                                        }
                                      />
                                      {district.name}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div>No Districts available for {state.name}</div>
                            );
                          })()
                        ) : (
                          <div>No Districts available for {state.name}</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </Tab.Pane>
            <Tab.Pane
              eventKey="circuits"
              style={{ overflowX: "hidden", height: "100%" }}
            >
              {form.states.length > 0 &&
                form.states.map((state) => (
                  <div
                    className="row align-items-start form-group"
                    key={state.id}
                  >
                    <div className="col-3 text-left">
                      <span className="d-inline-block text-grey">
                        Circuit(s) for {state.name}
                      </span>
                    </div>
                    <div className="col-8">
                      <div
                        className="form-control"
                        style={{
                          height: "400px",
                          overflowY: "scroll",
                          border: "1px solid #ccc",
                          padding: "10px",
                        }}
                      >
                        {circuitsData ? (
                          (() => {
                            const filteredCircuits = circuitsData.filter(
                              (circuit) =>
                                circuit.states?.some(
                                  (circuitState) => circuitState.id === state.id
                                ) &&
                                (!form?.jurisdiction_type?.id ||
                                  circuit?.jurisdiction_type?.id ===
                                    form.jurisdiction_type.id)
                            );

                            return filteredCircuits.length > 0 ? (
                              <div
                                style={{
                                  display: "grid",
                                  gridTemplateColumns: "repeat(3, 1fr)",
                                  gap: "10px",
                                }}
                              >
                                {filteredCircuits.length > 1 && (
                                  <div className="form-check">
                                    <label className="form-check-label">
                                      <input
                                        type="checkbox"
                                        className="form-check-input"
                                        style={{ accentColor: "grey" }}
                                        checked={filteredCircuits.every(
                                          (circuit) =>
                                            form.circuits?.some(
                                              (cir) => cir.id === circuit.id
                                            )
                                        )}
                                        onChange={(e) => {
                                          setForm((prevForm) => ({
                                            ...prevForm,
                                            circuits: e.target.checked
                                              ? [
                                                  ...new Set([
                                                    ...prevForm.circuits,
                                                    ...filteredCircuits,
                                                  ]),
                                                ]
                                              : prevForm.circuits.filter(
                                                  (circuit) =>
                                                    !filteredCircuits.some(
                                                      (cir) =>
                                                        cir.id === circuit.id
                                                    )
                                                ),
                                          }));
                                        }}
                                      />
                                      All Circuits
                                    </label>
                                  </div>
                                )}
                                {filteredCircuits.map((circuit) => (
                                  <div key={circuit.id} className="form-check">
                                    <label className="form-check-label">
                                      <input
                                        type="checkbox"
                                        name="circuits"
                                        value={circuit}
                                        className="form-check-input"
                                        style={{ accentColor: "grey" }}
                                        checked={form.circuits.some(
                                          (cir) => cir.id === circuit.id
                                        )}
                                        onChange={(e) =>
                                          handleCircuitsChange(e, circuit)
                                        }
                                      />
                                      {circuit.circuit_name}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div>No Circuits available for {state.name}</div>
                            );
                          })()
                        ) : (
                          <div>No Circuits available for {state.name}</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </Tab.Pane>
            <Tab.Pane
              eventKey="divisions"
              style={{ overflowX: "hidden", height: "100%" }}
            >
              {form.districts.length > 0 &&
                form.districts.map((district) => (
                  <div
                    className="row align-items-start form-group"
                    key={district.id}
                  >
                    <div className="col-3 text-left">
                      <span className="d-inline-block text-grey">
                        Division(s) For {district.name}
                      </span>
                    </div>
                    <div className="col-8">
                      <div
                        className="form-control"
                        style={{
                          height: "400px",
                          overflowY: "scroll",
                          border: "1px solid #ccc",
                          padding: "10px",
                        }}
                      >
                        {divisionsData ? (
                          (() => {
                            const filteredDivisions = divisionsData.filter(
                              (division) =>
                                division.district?.id === district.id
                            );

                            return filteredDivisions.length > 0 ? (
                              <div
                                style={{
                                  display: "grid",
                                  gridTemplateColumns: "repeat(3, 1fr)",
                                  gap: "10px",
                                }}
                              >
                                {filteredDivisions.length > 1 && (
                                  <div className="form-check">
                                    <label className="form-check-label">
                                      <input
                                        type="checkbox"
                                        className="form-check-input"
                                        style={{ accentColor: "grey" }}
                                        checked={filteredDivisions.every(
                                          (division) =>
                                            form.divisions?.some(
                                              (div) => div.id === division.id
                                            )
                                        )}
                                        onChange={(e) => {
                                          setForm((prevForm) => ({
                                            ...prevForm,
                                            divisions: e.target.checked
                                              ? [
                                                  ...new Set([
                                                    ...prevForm.divisions,
                                                    ...filteredDivisions,
                                                  ]),
                                                ]
                                              : prevForm.divisions.filter(
                                                  (division) =>
                                                    !filteredDivisions.some(
                                                      (div) =>
                                                        div.id === division.id
                                                    )
                                                ),
                                          }));
                                        }}
                                      />
                                      All Divisions
                                    </label>
                                  </div>
                                )}

                                {/* Individual District Checkboxes */}
                                {filteredDivisions.map((division) => (
                                  <div key={division.id} className="form-check">
                                    <label className="form-check-label">
                                      <input
                                        type="checkbox"
                                        name="divisions"
                                        value={division}
                                        className="form-check-input"
                                        style={{ accentColor: "grey" }}
                                        checked={form.divisions.some(
                                          (div) => div.id === division.id
                                        )}
                                        onChange={(e) =>
                                          handleDivisionsChange(e, division)
                                        }
                                      />
                                      {division.name}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div>
                                No Divisions available for {district.name}
                              </div>
                            );
                          })()
                        ) : (
                          <div>No Divisions available for {district.name}</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Modal.Body>
      <Modal.Footer className="mt-0">
        <button
          type="button"
          class="btn btn-secondary float-left-margin-right-auto"
          onClick={() => {
            handleClose();
            setForm(initialState);
          }}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleJurisdictionSubmit}
          class="btn btn-success"
        >
          Save
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddJurisdictionModal;
