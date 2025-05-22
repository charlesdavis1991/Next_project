import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Nav, Tab } from "react-bootstrap";
import axios from "axios";
import {
  deleteCourtForm,
  updateCourtForm,
} from "../../Redux/courtForms-table/courtFormsSlice";
import { getCaseId, getClientId } from "../../Utils/helper";

const initialState = {
  id: null,
  court_form_code: "",
  court_form_name: "",
  for_case_types: [],
  for_counties: [],
  for_jurisdiction_types: [],
  for_jurisdictions: [],
  for_states: [],
  form: null,
  form_name: "",
  key: null,
  is_pdf_uploaded: false,
  litigation_acts: [],
};

function CourtFormsTableModal({ courtFormPopUp, handleClose, courtFormData }) {
  const tokenBearer = localStorage.getItem("token");
  const origin = process.env.REACT_APP_BACKEND_URL;
  const currentCaseId = getCaseId();
  const clientId = getClientId();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const { statesData } = useSelector((state) => state.states);
  const [countiesData, setCountiesData] = useState([]);
  const [jurisdictionData, setJurisdictionsData] = useState([]);
  const [litigationActsData, setLitigationActsData] = useState([]);
  const [caseTypesData, setCaseTypesData] = useState([]);
  const [form, setForm] = useState(initialState);
  const [activeTab, setActiveTab] = useState("form");

  useEffect(() => {
    if (courtFormData) {
      setForm({
        id: courtFormData?.id || null,
        court_form_code: courtFormData?.court_form_code || "",
        court_form_name: courtFormData?.court_form_name || "",
        for_case_types: courtFormData?.for_case_types || [],
        for_counties: courtFormData?.for_counties || [],
        for_jurisdiction_types:
          courtFormData?.for_jurisdiction_types?.map((type) => type.id) || [],
        for_jurisdictions: courtFormData?.for_jurisdictions || [],
        for_states: courtFormData?.for_states || [],
        form: courtFormData?.form || "",
        form_name: courtFormData?.form_name || "",
        is_pdf_uploaded: false,
        key: courtFormData?.key || "",
      });
    }
  }, [courtFormData]);

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

  const getJurisdictionsData = async () => {
    try {
      const response = await axios.get(
        `${origin}/api/get/jurisdiction/directory/`,
        {
          headers: {
            Authorization: tokenBearer,
          },
        }
      );
      setJurisdictionsData(response.data.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const getCaseTypesData = async () => {
    try {
      const response = await axios.get(`${origin}/api/get_case_types/`, {
        headers: {
          Authorization: tokenBearer,
        },
      });
      setCaseTypesData(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCountiesData();
    getJurisdictionsData();
    getCaseTypesData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleRadioChange = (event) => {
    const selectedId = parseInt(event.target.value);

    setForm((prevForm) => ({
      ...prevForm,
      for_jurisdiction_types: [selectedId],
    }));
  };

  const handleStatesChange = (e, state) => {
    setForm((prevForm) => {
      const updatedStates = e.target.checked
        ? [...prevForm.for_states, state]
        : prevForm.for_states.filter((st) => st.id !== state.id);

      const filteredCounties = prevForm.for_counties.filter((county) =>
        updatedStates.some((state) => state.id === county.in_state.id)
      );

      return {
        ...prevForm,
        for_states: updatedStates,
        for_counties: filteredCounties,
        for_jurisdictions: prevForm.for_jurisdictions.filter((jurisdiction) =>
          jurisdiction.states.some((jurisdictionState) =>
            updatedStates.some(
              (updatedState) => updatedState.id === jurisdictionState.id
            )
          )
        ),
      };
    });
  };

  const handleCountiesChange = (e, county) => {
    if (e.target.checked) {
      setForm((prevForm) => ({
        ...prevForm,
        for_counties: [...prevForm.for_counties, county],
      }));
    } else {
      setForm((prevForm) => ({
        ...prevForm,
        for_counties: prevForm.for_counties.filter((c) => c.id !== county.id),
      }));
    }
  };

  const handleJurisdictionChange = (e, jurisdiction) => {
    if (e.target.checked) {
      setForm((prevForm) => ({
        ...prevForm,
        for_jurisdictions: [...prevForm.for_jurisdictions, jurisdiction],
      }));
    } else {
      setForm((prevForm) => ({
        ...prevForm,
        for_jurisdictions: prevForm.for_jurisdictions.filter(
          (j) => j.id !== jurisdiction.id
        ),
      }));
    }
  };

  const handleCaseTypeChange = (e, caseType) => {
    if (e.target.checked) {
      setForm((prevForm) => ({
        ...prevForm,
        for_case_types: [...prevForm.for_case_types, caseType],
      }));
    } else {
      setForm((prevForm) => ({
        ...prevForm,
        for_case_types: prevForm.for_case_types.filter(
          (j) => j.id !== caseType.id
        ),
      }));
    }
  };

  const handleFileChange = (e, name) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prevForm) => ({
        ...prevForm,
        [name]: file,
      }));
    }
  };

  const handleFileDrop = (e, name) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setFormForm((prevForm) => ({
        ...prevForm,
        [name]: file,
      }));
    }
  };

  const handleClearFile = (name) => {
    if (name === "form") {
    }
    setForm((prevState) => ({
      ...prevState,
      [name]: null,
      ...(name === "form" && { form_name: "" }),
    }));
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("id", courtFormData?.id);
      formData.append("court_form_name", form.court_form_name);
      formData.append("court_form_code", form.court_form_code);
      formData.append(
        "for_states",
        JSON.stringify(form.for_states?.map((state) => state.id))
      );
      formData.append(
        "for_case_types",
        JSON.stringify(form.for_case_types?.map((caseType) => caseType.id))
      );
      formData.append(
        "for_jurisdiction_types",
        JSON.stringify(form.for_jurisdiction_types)
      );
      formData.append(
        "for_jurisdictions",
        JSON.stringify(
          form.for_jurisdictions?.map((jurisdiction) => jurisdiction.id)
        )
      );
      formData.append(
        "for_counties",
        JSON.stringify(form.for_counties?.map((county) => county.id))
      );
      if (form.form) {
        formData.append("form", form.form); // Assuming form.form is a file object
      }
      if (form.key) {
        formData.append("key", form.key); // Assuming form.key is a file object
      }

      const response = await axios.patch(
        `${origin}/api/court/forms/directory/${clientId}/${currentCaseId}/`,
        formData,
        {
          headers: {
            Authorization: tokenBearer,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        handleClose();
        dispatch(
          updateCourtForm({
            id: courtFormData.id,
            updatedData: response.data.data,
          })
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `${origin}/api/court/forms/directory/${clientId}/${currentCaseId}/?id=${courtFormData.id}`,
        {
          headers: {
            Authorization: tokenBearer,
          },
        }
      );
      if (response.status === 204) {
        handleClose();
        dispatch(deleteCourtForm(courtFormData.id));
      }
      handleClose();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Modal
      show={courtFormPopUp}
      onHide={handleClose}
      dialogClassName="modal-dialog-centered Law-firm-direct-max-width-900px"
    >
      <Modal.Header className="bg-primary text-center p-2">
        <h4 className="modal-title text-white mx-auto">Edit Court Form</h4>
      </Modal.Header>
      <Modal.Body>
        <Tab.Container
          activeKey={activeTab}
          onSelect={(key) => {
            setActiveTab(key);
          }}
        >
          <Nav variant="tabs" className="mb-2 justify-content-center">
            <Nav.Item>
              <Nav.Link eventKey="form">Court Form</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="county">Counties</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="jurisdiction">Jurisdictions</Nav.Link>
            </Nav.Item>
            {/* <Nav.Item>
                  <Nav.Link eventKey="litigation">Litigation Acts</Nav.Link>
                </Nav.Item> */}
            <Nav.Item>
              <Nav.Link eventKey="case">Case Types</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="files">Files</Nav.Link>
            </Nav.Item>
          </Nav>
          <Tab.Content className="min-h-400">
            <Tab.Pane eventKey="form" className="overflow-hidden">
              <div className="row align-items-center form-group">
                <div className="col-2 text-left">
                  <span className="d-inline-block text-grey">
                    <nobr>Court Form Name</nobr>
                  </span>
                </div>
                <div className="col-10">
                  <input
                    type="text"
                    placeholder="Enter Court Form Name"
                    value={form?.court_form_name}
                    className="form-control"
                    name="court_form_name"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="row align-items-center form-group">
                <div className="col-2 text-left">
                  <span className="d-inline-block text-grey">
                    <nobr>Court Form Code</nobr>
                  </span>
                </div>
                <div className="col-10">
                  <input
                    type="text"
                    placeholder="Enter Court Form Code"
                    value={form?.court_form_code}
                    className="form-control"
                    name="court_form_code"
                    onChange={handleChange}
                  />
                </div>
              </div>
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
                      value={1}
                      checked={form.for_jurisdiction_types[0] === 1}
                      onChange={handleRadioChange}
                      style={{ accentColor: "grey", marginRight: "8px" }}
                    />
                    Federal
                  </label>
                  <label className="mr-4">
                    <input
                      type="radio"
                      value={2}
                      checked={form.for_jurisdiction_types[0] === 2}
                      onChange={handleRadioChange}
                      style={{ accentColor: "grey", marginRight: "8px" }}
                    />
                    State
                  </label>
                  <label>
                    <input
                      type="radio"
                      value={0}
                      checked={form.for_jurisdiction_types[0] === 0}
                      onChange={handleRadioChange}
                      style={{ accentColor: "grey", marginRight: "8px" }}
                    />
                    Both
                  </label>
                </div>
              </div>
              <div className="row align-items-start form-group mb-0">
                <div className="col-2 text-left">
                  <span className="d-inline-block text-grey">States</span>
                </div>
                <div className="col-10">
                  <div
                    className="form-control"
                    style={{
                      height: "280px",
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
                            name="for_states"
                            value={state}
                            className="form-check-input"
                            style={{ accentColor: "grey" }}
                            checked={form.for_states?.some(
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
            <Tab.Pane eventKey="county" className="overflow-hidden">
              {form.for_states.length > 0 && (
                <div className="row align-items-start form-group">
                  <div className="col-2 text-left">
                    <span className="d-inline-block text-grey">Counties</span>
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
                      {countiesData && form.for_states.length > 0 ? (
                        (() => {
                          const filteredCounties = countiesData.filter(
                            (county) =>
                              form.for_states?.some(
                                (state) => state?.id === county?.in_state?.id
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
                                          form.for_counties?.some(
                                            (count) => count.id === county.id
                                          )
                                      )}
                                      onChange={(e) => {
                                        setForm((prevForm) => ({
                                          ...prevForm,
                                          for_counties: e.target.checked
                                            ? [
                                                ...new Set([
                                                  ...prevForm.for_counties,
                                                  ...filteredCounties,
                                                ]),
                                              ]
                                            : prevForm.for_counties.filter(
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
                                      name="for_counties"
                                      value={county}
                                      className="form-check-input"
                                      style={{ accentColor: "grey" }}
                                      checked={form.for_counties?.some(
                                        (count) => count.id === county.id
                                      )}
                                      onChange={(e) =>
                                        handleCountiesChange(e, county)
                                      }
                                    />
                                    {county.in_state.StateAbr} - {county.name}
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
            <Tab.Pane eventKey="jurisdiction" className="overflow-hidden">
              <div className="row align-items-start form-group">
                <div className="col-2 text-left">
                  <span className="d-inline-block text-grey">
                    Jurisdictions
                  </span>
                </div>
                <div className="col-10">
                  <div
                    className="form-control"
                    style={{
                      maxHeight: "380px",
                      overflowY: "scroll",
                      border: "1px solid #ccc",
                      padding: "10px",
                      height: "auto",
                    }}
                  >
                    {jurisdictionData ? (
                      (() => {
                        let filteredJurisdictions = jurisdictionData;
                        if (form.for_states?.length) {
                          const stateFiltered = filteredJurisdictions.filter(
                            (jurisdiction) =>
                              jurisdiction.states?.some((state) =>
                                form.for_states.some(
                                  (state) => state.id === state.id
                                )
                              )
                          );

                          filteredJurisdictions = stateFiltered.length
                            ? stateFiltered
                            : [];
                        } else if (!form.for_states?.length) {
                          filteredJurisdictions = [];
                        }
                        if (form.for_jurisdiction_types?.length) {
                          let typeFiltered = [];
                          if (form.for_jurisdiction_types[0] !== 0) {
                            typeFiltered = filteredJurisdictions.filter(
                              (jurisdiction) =>
                                form.for_jurisdiction_types.includes(
                                  jurisdiction.jurisdiction_type?.id
                                )
                            );
                          }
                          filteredJurisdictions = typeFiltered.length
                            ? typeFiltered
                            : filteredJurisdictions;
                        }
                        if (form.for_counties?.length) {
                          const countyFiltered = filteredJurisdictions.filter(
                            (jurisdiction) =>
                              jurisdiction.counties?.some(
                                (jurisdictionCounty) =>
                                  form.for_counties.some(
                                    (selectedCounty) =>
                                      selectedCounty.id ===
                                      jurisdictionCounty.id
                                  )
                              )
                          );
                          filteredJurisdictions = countyFiltered.length
                            ? countyFiltered
                            : [];
                        }
                        return (
                          filteredJurisdictions.length > 0 && (
                            <div
                              style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(3, 1fr)",
                                gap: "4px",
                              }}
                            >
                              {filteredJurisdictions.length > 1 && (
                                <div className="form-check">
                                  <label className="form-check-label">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      style={{ accentColor: "grey" }}
                                      checked={filteredJurisdictions.every(
                                        (jurisdiction) =>
                                          form.for_jurisdictions?.some(
                                            (juri) =>
                                              juri.id === jurisdiction.id
                                          )
                                      )}
                                      onChange={(e) => {
                                        setForm((prevForm) => ({
                                          ...prevForm,
                                          for_jurisdictions: e.target.checked
                                            ? [
                                                ...new Set([
                                                  ...prevForm.for_jurisdictions,
                                                  ...filteredJurisdictions,
                                                ]),
                                              ]
                                            : prevForm.for_jurisdictions.filter(
                                                (jurisdiction) =>
                                                  !filteredJurisdictions.some(
                                                    (juri) =>
                                                      juri.id ===
                                                      jurisdiction.id
                                                  )
                                              ),
                                        }));
                                      }}
                                    />
                                    All Jurisdictions
                                  </label>
                                </div>
                              )}
                              {filteredJurisdictions.map((jurisdiction) => (
                                <div
                                  key={jurisdiction.id}
                                  className="form-check"
                                >
                                  <label className="form-check-label">
                                    <input
                                      type="checkbox"
                                      name="for_jurisdictions"
                                      value={jurisdiction}
                                      className="form-check-input"
                                      style={{ accentColor: "grey" }}
                                      checked={form.for_jurisdictions?.some(
                                        (j) => j.id === jurisdiction.id
                                      )}
                                      onChange={(e) =>
                                        handleJurisdictionChange(
                                          e,
                                          jurisdiction
                                        )
                                      }
                                    />
                                    {jurisdiction.name}
                                  </label>
                                </div>
                              ))}
                            </div>
                          )
                        );
                      })()
                    ) : (
                      <div>No Counties available for the selected states</div>
                    )}
                  </div>
                </div>
              </div>
            </Tab.Pane>
            {/* <Tab.Pane eventKey="litigation" className="overflow-hidden">
                </Tab.Pane> */}
            <Tab.Pane eventKey="case" className="overflow-hidden">
              <div className="row align-items-start form-group">
                <div className="col-2 text-left">
                  <span className="d-inline-block text-grey">Case Types</span>
                </div>
                <div className="col-10">
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
                      height: "auto",
                    }}
                  >
                    {caseTypesData?.case_type_categories?.map((caseType) => (
                      <div key={caseType.id} className="form-check">
                        <label className="form-check-label">
                          <input
                            type="checkbox"
                            name="for_case_Types"
                            value={caseType.id}
                            className="form-check-input"
                            style={{ accentColor: "grey" }}
                            checked={form.for_case_types?.some(
                              (ct) => ct.id === caseType.id
                            )}
                            onChange={(e) => handleCaseTypeChange(e, caseType)}
                          />
                          {caseType.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Tab.Pane>
            <Tab.Pane eventKey="files" className="overflow-hidden">
              <div className="row mt-4">
                {/* Form file section */}
                <div className="col-6">
                  {form.form && (
                    <div className="d-flex justify-content-between w-100 mb-2">
                      <a
                        href={
                          typeof form.form === "string"
                            ? form.form // Use the URL directly if it's a string
                            : URL.createObjectURL(form.form) // Create an object URL if it's a file
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary text-decoration-underline"
                      >
                        View Form
                      </a>
                      <button
                        type="button"
                        className="btn-close"
                        aria-label="Remove form"
                        onClick={() => handleClearFile("form")}
                      >
                        x
                      </button>
                    </div>
                  )}

                  {/* Form file upload area */}
                  <div
                    className="file-upload-area border rounded d-flex flex-column justify-content-center align-items-center"
                    style={{
                      flex: 1,
                      marginRight: "10px",
                      padding: "20px",
                      borderStyle: "dashed",
                    }}
                    id="edit-form-area"
                    onDrop={(e) => handleFileDrop(e, "form")}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    <p className="text-center">
                      {form.form_name
                        ? `Uploaded: ${form.form_name}` // Display form_name if it exists
                        : form.form && typeof form.form !== "string"
                          ? `Uploaded: ${form.form?.name}` // Fall back to form.name if form_name is not present
                          : "Drag and drop Form file here, or click to upload"}
                    </p>
                    <input
                      type="file"
                      id="edit-form-upload"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => handleFileChange(e, "form")}
                      className="d-none"
                    />
                    <label
                      htmlFor="edit-form-upload"
                      className="btn btn-primary mt-2"
                    >
                      {form.form ? "Change Form" : "Upload Form"}
                    </label>
                  </div>

                  {/* Key file section */}
                </div>
                <div className="col-6">
                  {form.key && (
                    <div className="d-flex justify-content-between w-100 mb-2">
                      <a
                        href={
                          typeof form.key === "string"
                            ? form.key // Use the URL directly if it's a string
                            : URL.createObjectURL(form.key) // Create an object URL if it's a file
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary text-decoration-underline"
                      >
                        View Key
                      </a>
                      <button
                        type="button"
                        className="btn-close"
                        aria-label="Remove key"
                        onClick={() => handleClearFile("key")}
                      >
                        x
                      </button>
                    </div>
                  )}

                  {/* Key file upload area */}
                  <div
                    className="file-upload-area border rounded d-flex flex-column justify-content-center align-items-center"
                    style={{
                      flex: 1,
                      marginLeft: "10px",
                      padding: "20px",
                      borderStyle: "dashed",
                    }}
                    id="edit-key-area"
                    onDrop={(e) => handleFileDrop(e, "key")}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    <p className="text-center">
                      {form.key && typeof form.key !== "string"
                        ? `Uploaded: ${form.key?.name}` // Show the file name if it's a file object
                        : "Drag and drop Key file here, or click to upload"}
                    </p>
                    <input
                      type="file"
                      id="edit-key-upload"
                      accept=".csv"
                      onChange={(e) => handleFileChange(e, "key")}
                      className="d-none"
                    />
                    <label
                      htmlFor="edit-key-upload"
                      className="btn btn-primary mt-2"
                    >
                      {form.key ? "Change Key" : "Upload Key"}
                    </label>
                  </div>
                </div>
              </div>
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
        <button type="button" className="btn btn-danger" onClick={handleDelete}>
          Delete
        </button>
        <button type="button" onClick={handleSubmit} class="btn btn-success">
          Save
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default CourtFormsTableModal;
