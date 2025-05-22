import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getCaseId, getClientId } from "../../Utils/helper";
import { addProcessServer } from "../../Redux/process-server/processServerSlice";
import { Modal } from "react-bootstrap";
const initialState = {
  name: "",
  cost: "",
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
  states_list_textarea: "",
  cities_list_textarea: "",
  counties_list_textarea: "",
  zipcodes_list_textarea: "",
};
function AddProcessorServerModal({ handleClose, addProcessorServers }) {
  const tokenBearer = localStorage.getItem("token");
  const currentCaseId = getCaseId();
  const clientId = getClientId();
  const origin = process.env.REACT_APP_BACKEND_URL;
  const dispatch = useDispatch();
  const { statesData } = useSelector((state) => state.states);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [lawFirmData, setLawFirmData] = useState(null);
  const [form, setForm] = useState(initialState);
  const [countyData, setCountyData] = useState([]);
  const [form2, setForm2] = useState({
    states: [],
    counties: [],
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredCounties, setFilteredCounties] = useState([]);

  const getLawFirmHandler = async () => {
    try {
      const response = await axios.get(`${origin}/api/get/law/firm/`, {
        headers: {
          Authorization: tokenBearer,
        },
      });
      const responseData = response.data;
      setLawFirmData(responseData.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const getCountyDataHandler = async () => {
    try {
      const response = await axios.get(`${origin}/api/all/counties/`, {
        headers: {
          Authorization: tokenBearer,
        },
      });
      setCountyData(response.data.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (addProcessorServers) {
      getLawFirmHandler();
      getCountyDataHandler();
    }
  }, [addProcessorServers]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  //not pushing to the form yet
  const handleCheckboxChange = (e, id) => {
    if (e.target.checked) {
      // Add state ID to array if checked
      setForm2((prevForm) => ({
        ...prevForm,
        states: [...prevForm.states, id],
      }));
    } else {
      // Remove state ID from array if unchecked
      setForm2((prevForm) => ({
        ...prevForm,
        states: prevForm.states.filter((stateId) => stateId !== id),
      }));
    }
  };

  const handleCheckboxChange2 = (e, id) => {
    if (e.target.checked) {
      // Add state ID to array if checked
      setForm2((prevForm) => ({
        ...prevForm,
        counties: [...prevForm.counties, id],
      }));
    } else {
      // Remove state ID from array if unchecked
      setForm2((prevForm) => ({
        ...prevForm,
        counties: prevForm.counties.filter((countyId) => countyId !== id),
      }));
    }
  };

  useEffect(() => {
    if (addProcessorServers) {
      if (form2.states?.length > 0 && countyData) {
        const newFilteredCounties = countyData.filter(
          (county) =>
            county.in_state && form2.states.includes(county.in_state.id)
        );
        setFilteredCounties(newFilteredCounties);
      } else {
        setFilteredCounties(countyData);
      }
    }
  }, [form2.states, countyData, addProcessorServers]);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("form", form);
      const response = await axios.post(
        `${origin}/api/add/server/processor/${clientId}/${currentCaseId}/`,
        form,
        {
          headers: {
            Authorization: tokenBearer,
          },
        }
      );
      if (response.status === 200) {
        handleClose();
        dispatch(addProcessServer(response.data.data));
        setData(response.data.data);
        setForm(initialState);
      }
    } catch (err) {
      console.log(err.message);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      show={addProcessorServers}
      onHide={handleClose}
      dialogClassName="modal-dialog-centered custom-insurance-dialogPS"
    >
      <Modal.Header className="text-center bg-primary p-2">
        <h4 className="modal-title text-white mx-auto">Add Processor Server</h4>
      </Modal.Header>
      <Modal.Body>
        <nav className="ml-0">
          <div
            className="nav nav-tabs justify-content-around"
            id="nav-tab"
            role="tablist"
          >
            <a
              className="nav-item nav-link active Pad8 tab-item"
              id="information-link"
              data-toggle="tab"
              href="#information-tab"
              role="tab"
              aria-controls="information-tab"
              aria-selected="false"
            >
              Information
            </a>

            <a
              className="nav-item nav-link Pad8 tab-item"
              id="states_served-link"
              data-toggle="tab"
              href="#states_served-tab"
              role="tab"
              aria-controls="states_served-tab"
              aria-selected="false"
            >
              States Served
            </a>
            <a
              className="nav-item nav-link Pad8 tab-item"
              id="cities_served-link"
              data-toggle="tab"
              href="#cities_served-tab"
              role="tab"
              aria-controls="cities_served-tab"
              aria-selected="false"
            >
              Cities Served
            </a>
            <a
              className="nav-item nav-link Pad8 tab-item"
              id="counties_served-link"
              data-toggle="tab"
              href="#counties_served-tab"
              role="tab"
              aria-controls="counties_served-tab"
              aria-selected="false"
            >
              Counties Served
            </a>
            <a
              className="nav-item nav-link Pad8 tab-item"
              id="zip_served-link"
              data-toggle="tab"
              href="#zip_served-tab"
              role="tab"
              aria-controls="zip_served-tab"
              aria-selected="false"
            >
              Zip Codes Served
            </a>
          </div>
        </nav>

        <div
          className="tab-content mt-2"
          id="nav-tabContent"
          style={{ minHeight: "400px" }}
        >
          <div
            className="tab-pane fade show active"
            id="information-tab"
            role="tabpanel"
            aria-labelledby="information-link"
            style={{ overflowX: "hidden" }}
          >
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
                  <nobr>Cost</nobr>
                </span>
              </div>
              <div className="col-md-10">
                <input
                  type="number"
                  placeholder="Enter Cost"
                  value={form.cost}
                  className="form-control"
                  name="cost"
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
                <span className="d-inline-block text-grey dispay-none-LFD ">
                  CityStateZip
                </span>
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
                    {statesData?.map((state) => (
                      <option key={state.id} value={state.id}>
                        {state.name}
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

            <div className="row align-items-center form-group">
              <div className="col-md-2 text-left">
                <span className="d-inline-block text-grey">Email</span>
              </div>
              <div className="col-md-10">
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

            <div className="row align-items-center form-group">
              <div className="col-md-2 text-left">
                <span className="d-inline-block text-grey">Website</span>
              </div>
              <div className="col-md-10">
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
          </div>

          <div
            className="tab-pane fade"
            id="states_served-tab"
            role="tabpanel"
            aria-labelledby="states_served-link"
            style={{ overflowX: "hidden" }}
          >
            <div className="row align-items-center form-group">
              <div className="col-md-2 text-left">
                <span className="d-inline-block text-grey">States :</span>
              </div>
              <div className="col-md-10">
                <div className="dropdown">
                  <div
                    className="form-control"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      cursor: "pointer",
                      padding: "8px",
                      border: "1px solid #ced4da",
                    }}
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    {form2.states?.length > 0 ? (
                      `${form2.states?.length} state(s) selected`
                    ) : (
                      <p className="text-grey">Select States</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="row align-items-center form-group">
              <div className="col-md-2 text-left">
                <span className="d-inline-block"></span>
              </div>
              <div className="col-md-10">
                {isDropdownOpen && (
                  <div
                    className="show"
                    style={{
                      maxHeight: "350px",
                      overflowY: "scroll",
                      border: "1px solid #ccc",
                      padding: "10px",
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: "10px",
                    }}
                  >
                    {statesData?.map((item) => (
                      <div key={item.id} className="form-check">
                        <label className="form-check-label">
                          <input
                            type="checkbox"
                            name="state"
                            value={item.id}
                            className="form-check-input"
                            checked={form2.states?.includes(item.id)}
                            onChange={(e) => handleCheckboxChange(e, item.id)}
                          />
                          {item.name}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div
            className="tab-pane fade"
            id="cities_served-tab"
            role="tabpanel"
            aria-labelledby="cities_served-link"
            style={{ overflowX: "hidden" }}
          >
            <div className="row align-items-center form-group">
              <div className="col-md-2 text-left">
                <span className="d-inline-block text-grey">Cities :</span>
              </div>
              <div className="col-md-10">
                <textarea
                  className="form-control"
                  onChange={handleChange}
                  value={form.cities_list_textarea}
                  name="cities_list_textarea"
                  cols="30"
                  rows="10"
                ></textarea>
              </div>
            </div>
          </div>

          <div
            className="tab-pane fade"
            id="counties_served-tab"
            role="tabpanel"
            aria-labelledby="counties_served-link"
            style={{ overflowX: "hidden" }}
          >
            <div className="row align-items-center form-group">
              <div className="col-md-2 text-left">
                <span className="d-inline-block text-grey">Service Areas:</span>
              </div>
              <div className="col-md-10">
                <div className="dropdown">
                  <div
                    className="form-control"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      cursor: "pointer",
                      padding: "8px",
                      border: "1px solid #ced4da",
                    }}
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    {form2.counties?.length > 0 ? (
                      form2.counties?.length === 1 ? (
                        `${form2.counties?.length} county selected`
                      ) : (
                        `${form2.counties?.length} counties selected`
                      )
                    ) : (
                      <p className="text-grey">Select Service Areas</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="row align-items-center form-group">
              <div className="col-md-2 text-left">
                <span className="d-inline-block"></span>
              </div>
              <div className="col-md-10">
                {isDropdownOpen && (
                  <div
                    className="show"
                    style={{
                      maxHeight: "350px",
                      overflowY: "scroll",
                      border: "1px solid #ccc",
                      padding: "10px",
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: "10px",
                    }}
                  >
                    {filteredCounties ? (
                      filteredCounties.map((item) => (
                        <div key={item.id} className="form-check">
                          <input
                            type="checkbox"
                            name="state"
                            value={item.id}
                            className="form-check-input"
                            checked={form2.counties?.includes(item.id)}
                            onChange={(e) => handleCheckboxChange2(e, item.id)}
                          />
                          <label className="form-check-label">
                            {item.name}
                          </label>
                        </div>
                      ))
                    ) : (
                      <div>No Counties exist</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div
            className="tab-pane fade"
            id="zip_served-tab"
            role="tabpanel"
            aria-labelledby="zip_served-link"
            style={{ overflowX: "hidden" }}
          >
            <div className="row align-items-center form-group">
              <div className="col-md-2 text-left">
                <span className="d-inline-block text-grey">Zip Codes :</span>
              </div>
              <div className="col-md-10">
                <textarea
                  className="form-control"
                  onChange={handleChange}
                  value={form.zipcodes_list_textarea}
                  name="zipcodes_list_textarea"
                  cols="30"
                  rows="10"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="mt-0">
        <button
          type="button"
          className="btn btn-secondary float-left-margin-right-auto"
          onClick={() => {
            handleClose();
            setForm(initialState);
          }}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="btn btn-success"
        >
          Save
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddProcessorServerModal;
