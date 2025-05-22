import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Nav, Tab } from "react-bootstrap";
import axios from "axios";
import {
  deleteCircuit,
  updateCircuit,
} from "../../Redux/circuits/circuitSlice";

const initialState = {
  id: "",
  circuit_name: "",
  jurisdiction_type: {},
  states: [],
  counties: [],
};

function CircuitTableModal({ circuitPopUp, handleClose, circuitData }) {
  const tokenBearer = localStorage.getItem("token");
  const origin = process.env.REACT_APP_BACKEND_URL;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const { statesData } = useSelector((state) => state.states);
  const [countiesData, setCountiesData] = useState([]);
  const [form, setForm] = useState(initialState);
  const [activeTab, setActiveTab] = useState("circuit");

  useEffect(() => {
    if (circuitPopUp && circuitData) {
      setForm({
        id: circuitData?.id || "",
        circuit_name: circuitData?.circuit_name || "",
        jurisdiction_type: circuitData?.jurisdiction_type || {},
        states: circuitData?.states || [],
        counties: circuitData?.counties || [],
      });
    }
  }, [circuitData, circuitPopUp]);

  const getCountiesData = async () => {
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

  useEffect(() => {
    getCountiesData();
  }, [tokenBearer]);

  const handleStatesChange = (e, state) => {
    if (e.target.checked) {
      setForm((prevForm) => ({
        ...prevForm,
        states: [...prevForm.states, state],
      }));
    } else {
      setForm((prevForm) => ({
        ...prevForm,
        states: prevForm.states.filter((st) => st.id !== state.id),
        counties: prevForm.counties.filter(
          (county) => county?.in_state?.id !== state.id
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

  const handleRadioChange = (e) => {
    const jurisdictionTypeId = Number(e.target.value);
    setForm((prevForm) => ({
      ...prevForm,
      jurisdiction_type: { id: jurisdictionTypeId },
    }));
  };

  const handleCircuitSubmit = async () => {
    setError(null);
    try {
      const response = await axios.patch(
        `${origin}/api/circuits/directory/`,
        form,
        {
          headers: {
            Authorization: tokenBearer,
          },
        }
      );
      if (response.status === 200) {
        dispatch(
          updateCircuit({
            id: circuitData?.id,
            updatedData: response.data.data,
          })
        );
        setForm(initialState);
        handleClose();
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
      handleClose();
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteButton = async () => {
    try {
      const response = await axios.delete(
        `${origin}/api/circuits/directory/?id=${circuitData.id}`,
        {
          headers: {
            Authorization: tokenBearer,
          },
        }
      );
      if (response.status == 204) {
        dispatch(deleteCircuit(circuitData.id));
        handleClose();
      }
    } catch (error) {
      console.error("Error deleting jurisdiction", error.message);
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
      show={circuitPopUp}
      onHide={handleClose}
      dialogClassName="modal-dialog-centered Law-firm-direct-max-width-1100px"
    >
      <Modal.Header className="text-center bg-primary p-2">
        <h5 className="modal-title text-white mx-auto">Edit Circuit</h5>
      </Modal.Header>
      <Modal.Body>
        <Tab.Container
          activeKey={activeTab}
          onSelect={(key) => {
            setActiveTab(key);
          }}
        >
          <Nav variant="tabs" className="mb-3 row justify-content-center">
            <Nav.Item>
              <Nav.Link eventKey="circuit">Circuit</Nav.Link>
            </Nav.Item>
            {form.states.length > 0 && (
              <Nav.Item>
                <Nav.Link eventKey="counties">Counties</Nav.Link>
              </Nav.Item>
            )}
          </Nav>
          <Tab.Content className="min-h-400 overflow-hidden">
            <Tab.Pane
              eventKey="circuit"
              style={{ overflowX: "hidden", height: "100%" }}
            >
              <div className="row align-items-center form-group">
                <div className="col-md-2 text-left">
                  <span className="d-inline-block text-grey">Circuit</span>
                </div>
                <div className="col-md-10">
                  <input
                    type="text"
                    placeholder="Enter Circuit Name"
                    value={form.circuit_name}
                    className="form-control"
                    name="circuit_name"
                    onChange={(e) =>
                      setForm((prevForm) => ({
                        ...prevForm,
                        circuit_name: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              {/* jurisdiction Type */}
              <div className="row align-items-center form-group my-2">
                <div className="col-2 text-left">
                  <span className="d-inline-block text-grey">
                    Jurisdiction Type
                  </span>
                </div>
                <div className="col-10">
                  <label className="mr-4 ml-2">
                    <input
                      type="radio"
                      value="1"
                      checked={form.jurisdiction_type.id === 1}
                      onChange={handleRadioChange}
                      style={{ accentColor: "grey", marginRight: "8px" }}
                    />
                    Federal
                  </label>
                  <label>
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
              <div className="row align-items-start form-group">
                <div className="col-2 text-left">
                  <span className="d-inline-block text-grey">States</span>
                </div>
                <div className="col-10">
                  <div
                    className="form-control"
                    style={{
                      height: "300px",
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
              {form.states.length > 0 && (
                <div className="row align-items-start form-group">
                  <div className="col-md-2 text-left">
                    <span className="d-inline-block text-grey">Counties</span>
                  </div>
                  <div className="col-md-10">
                    <div
                      className="form-control"
                      style={{
                        height: "380px",
                        overflowY: "scroll",
                        border: "1px solid #ccc",
                        padding: "10px",
                      }}
                    >
                      {countiesData ? (
                        (() => {
                          const filteredCounties = countiesData.filter(
                            (county) =>
                              form.states.some(
                                (state) => state.id === county.in_state.id
                              )
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
                            <div>
                              No Counties available for the selected states
                            </div>
                          );
                        })()
                      ) : (
                        <div>No Counties available for the selected states</div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Modal.Body>
      <Modal.Footer className="mt-0">
        <button
          type="button"
          class="btn btn-secondary float-left-margin-right-auto"
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
          onClick={handleCircuitSubmit}
          class="btn btn-success"
        >
          Save
        </button>
      </Modal.Footer>
    </Modal>
  );
}
export default CircuitTableModal;
