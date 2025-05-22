import React, { useState, useEffect } from "react";
import axios from "axios";
import { getCaseId, getClientId } from "../../Utils/helper";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteProcessServer,
  updateProcessServer,
} from "../../Redux/process-server/processServerSlice";

function ProcessorServerPopUp({ processorPopUp, handleClose, processServer }) {
  const tokenBearer = localStorage.getItem("token");
  const currentCaseId = getCaseId();
  const clientId = getClientId();
  const dispatch = useDispatch();
  const origin = process.env.REACT_APP_BACKEND_URL;
  const { statesData } = useSelector((state) => state.states);
  const [countyData, setCountyData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
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
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredCounties, setFilteredCounties] = useState([]);

  const [form2, setForm2] = useState({
    states: [],
    counties: [],
  });

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
    getCountyDataHandler();
  }, []);

  useEffect(() => {
    if (processServer) {
      setForm({
        name: processServer?.contact_id?.name || "",
        cost: processServer?.cost || "",
        address1: processServer?.contact_id?.address1 || "",
        address2: processServer?.contact_id?.address2 || "",
        city: processServer?.contact_id?.city || "",
        state: processServer?.contact_id?.state || "",
        zip: processServer?.contact_id?.zip || "",
        phone: processServer?.contact_id?.phone_number || "",
        extension: processServer?.contact_id?.phone_ext || "",
        fax: processServer?.contact_id?.fax || "",
        email: processServer?.contact_id?.email || "",
        website: processServer?.contact_id?.website || "",
        states_list_textarea:
          processServer?.process_served_list?.states_list || "",
        cities_list_textarea:
          processServer?.process_served_list?.cities_list || "",
        counties_list_textarea:
          processServer?.process_served_list?.counties_list || "",
        zipcodes_list_textarea:
          processServer?.process_served_list?.zipcodes_list || "",
      });
    }
  }, [processServer]);

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
      setForm2((prevForm) => ({
        ...prevForm,
        states: [...prevForm.states, id],
      }));
    } else {
      setForm2((prevForm) => ({
        ...prevForm,
        states: prevForm.states.filter((stateId) => stateId !== id),
      }));
    }
  };

  const handleCheckboxChange2 = (e, id) => {
    if (e.target.checked) {
      setForm2((prevForm) => ({
        ...prevForm,
        counties: [...prevForm.counties, id],
      }));
    } else {
      setForm2((prevForm) => ({
        ...prevForm,
        counties: prevForm.counties.filter((countyId) => countyId !== id),
      }));
    }
  };

  useEffect(() => {
    if (form2.states?.length > 0 && countyData) {
      const newFilteredCounties = countyData.filter(
        (county) => county.in_state && form2.states.includes(county.in_state.id)
      );
      setFilteredCounties(newFilteredCounties);
    } else {
      setFilteredCounties(countyData);
    }
  }, [form2.states, countyData]);

  const handleSaveClick = async () => {
    const updatedProcessServer = {
      ...processServer,
      id: processServer.id,
      name: form.name,
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

      cost: form.cost,
      states_list_textarea: form.states_list_textarea,
      cities_list_textarea: form.cities_list_textarea,
      counties_list_textarea: form.counties_list_textarea,
      zipcodes_list_textarea: form.zipcodes_list_textarea,
    };

    try {
      const response = await axios.patch(
        `${origin}/api/add/server/processor/${clientId}/${currentCaseId}/`,
        updatedProcessServer,
        {
          headers: {
            Authorization: tokenBearer,
          },
        }
      );
      if (response.status == 200) {
        handleClose();
        dispatch(
          updateProcessServer({
            id: processServer.id,
            updatedData: response.data.data,
          })
        );
      }
    } catch (error) {
      console.error("Error Response:", error);
    }
  };

  const handleDeleteClick = async () => {
    try {
      const response = await axios.delete(
        `${origin}/api/add/server/processor/${clientId}/${currentCaseId}/`,
        {
          data: { id: processServer.id },
          headers: {
            Authorization: tokenBearer,
          },
        }
      );
      if (response.status === 200) {
        handleClose();
        dispatch(deleteProcessServer(processServer.id));
      }
    } catch (error) {
      console.error("Error deleting process server:", error.message);
    }
  };

  return (
    <Modal
      show={processorPopUp}
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
              href="#information-tabE"
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
              href="#states_served-tabE"
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
              href="#cities_served-tabE"
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
              href="#counties_served-tabE"
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
              href="#zip_served-tabE"
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
          style={{ margin: "8px", padding: "8px", minHeight: "420px" }}
        >
          <div
            className="tab-pane fade show active"
            id="information-tabE"
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
                  placeholder="Enter Address 2"
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
                    placeholder="Enter City"
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
                    {statesData.map((state) => (
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
              <div className="col-md-10">
                <input
                  type="text"
                  placeholder="Enter Phone"
                  value={form.phone}
                  className="form-control"
                  name="phone"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="row align-items-center form-group">
              <div className="col-md-2 text-left">
                <span className="d-inline-block text-grey">Extension</span>
              </div>
              <div className="col-md-10">
                <input
                  type="text"
                  placeholder="Enter Extension"
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
                  placeholder="Enter Fax"
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
                  type="email"
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
                  type="url"
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
            id="states_served-tabE"
            role="tabpanel"
            aria-labelledby="states_served-link"
            style={{ overflow: "hidden" }}
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
                    {statesData.map((item) => (
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
            id="cities_served-tabE"
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
                  name="cities_list_textarea"
                  value={form.cities_list_textarea}
                  onChange={handleChange}
                  placeholder="Enter cities served"
                  rows="4"
                />
              </div>
            </div>
          </div>

          <div
            className="tab-pane fade"
            id="counties_served-tabE"
            role="tabpanel"
            aria-labelledby="counties_served-link"
            style={{ overflow: "hidden" }}
          >
            <div className="row align-items-center form-group">
              <div className="col-md-2 text-left">
                <span className="d-inline-block text-grey">
                  Service Areas :
                </span>
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
                        `${form2.counties?.length} Service Areas Selected`
                      ) : (
                        `${form2.counties?.length} Service Areas Selected`
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
            id="zip_served-tabE"
            role="tabpanel"
            aria-labelledby="zip_served-link"
            style={{ overflowX: "hidden" }}
          >
            <>
              <div className="row align-items-center form-group">
                <div className="col-md-2 text-left">
                  <span className="d-inline-block text-grey">Zip Codes :</span>
                </div>
                <div className="col-md-10">
                  <textarea
                    className="form-control"
                    name="zipcodes_list_textarea"
                    value={form.zipcodes_list_textarea}
                    onChange={handleChange}
                    placeholder="Enter zip codes served"
                    rows="4"
                  />
                </div>
              </div>
            </>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="mt-0">
        <button
          type="button"
          className="btn btn-secondary h-35px"
          onClick={handleClose}
        >
          Close
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
          Save Process Server Information
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default ProcessorServerPopUp;
