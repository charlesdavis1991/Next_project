import React, { useEffect, useState } from "react";
import { getCaseId, getClientId } from "../../Utils/helper";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Nav, Tab } from "react-bootstrap";
import { addDivision } from "../../Redux/divisions/divisonSlice";
import axios from "axios";

const initialState = {
  name: "",
  district: {},
  states: [],
  counties: [],
};

function AddDivisionModal({ addDivisions, handleClose }) {
  const tokenBearer = localStorage.getItem("token");
  const currentCaseId = getCaseId();
  const clientId = getClientId();
  const origin = process.env.REACT_APP_BACKEND_URL;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const { statesData } = useSelector((state) => state.states);
  const [countiesData, setCountiesData] = useState([]);
  const [districtsData, setDistrictsData] = useState([]);
  const [form, setForm] = useState(initialState);
  const [activeTab, setActiveTab] = useState("division");

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

  const getDistrictsData = async () => {
    try {
      const response = await axios.get(
        `${origin}/api/add/districts/directory/${clientId}/${currentCaseId}/`,
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

  useEffect(() => {
    if (addDivisions) {
      getCountiesData();
      getDistrictsData();
    }
  }, [addDivisions]);

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

  const handleDivisionSubmit = async () => {
    setError(null);
    try {
      const response = await axios.post(
        `${origin}/api/divisions/directory/`,
        form,
        {
          headers: {
            Authorization: tokenBearer,
          },
        }
      );
      if (response.status === 201) {
        dispatch(addDivision(response.data.data));
        setForm(initialState);
        setActiveTab("division");
        handleClose();
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
      setActiveTab("division");
      handleClose();
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setForm(initialState);
    setActiveTab("division");
    handleClose();
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
      show={addDivisions}
      onHide={handleClose}
      dialogClassName="modal-dialog-centered Law-firm-direct-max-width-1100px"
    >
      <Modal.Header className="bg-primary p-2">
        <h4 className="modal-title text-white mx-auto">Add Division</h4>
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
              <Nav.Link eventKey="division">Division</Nav.Link>
            </Nav.Item>
            {form.states.length > 0 && (
              <Nav.Item>
                <Nav.Link eventKey="counties">Counties</Nav.Link>
              </Nav.Item>
            )}
          </Nav>
          <Tab.Content className="min-h-400 overflow-hidden">
            <Tab.Pane
              eventKey="division"
              style={{ overflowX: "hidden", height: "100%" }}
            >
              <div className="row align-items-center form-group">
                <div className="col-md-2 text-left">
                  <span className="d-inline-block text-grey">Division</span>
                </div>
                <div className="col-md-10">
                  <input
                    type="text"
                    placeholder="Enter Division Name"
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
                <div className="col-md-2 text-left">
                  <span className="d-inline-block text-grey">District</span>
                </div>
                <div className="col-md-10">
                  <select
                    name="state"
                    className="form-select form-control oveflow-hidden"
                    value={form.district.id || ""}
                    onChange={(e) => {
                      const selectedDistrict = districtsData.find(
                        (district) => district.id === parseInt(e.target.value)
                      );
                      setForm((prevForm) => ({
                        ...prevForm,
                        district: selectedDistrict || null,
                      }));
                    }}
                  >
                    <option value="">Select District</option>
                    {districtsData.map((district) => (
                      <option key={district.id} value={district.id}>
                        {district.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="row align-items-start form-group">
                <div className="col-md-2 text-left">
                  <span className="d-inline-block text-grey">States</span>
                </div>
                <div className="col-md-10">
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
                                (state) => state.id === county?.in_state?.id
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
          onClick={handleModalClose}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleDivisionSubmit}
          class="btn btn-success"
        >
          Save
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddDivisionModal;
