import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Nav, Tab } from "react-bootstrap";
import axios from "axios";
import {
  deleteCalculatedDate,
  updateCalculatedDate,
} from "../../Redux/calculated-dates-table/calculatedDatesSlice";

const initialState = {
  id: null,
  state: "",
  dependant_date: "",
  jurisdiction_type: "",
  counties: [],
  name: "",
  days: "",
  months: "",
  years: "",
  days_type: "",
};

function CalculatedDatesTableModal({
  calculatedDatePopUp,
  handleClose,
  calculatedDateData,
}) {
  const tokenBearer = localStorage.getItem("token");
  const origin = process.env.REACT_APP_BACKEND_URL;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const { statesData } = useSelector((state) => state.states);
  const [countiesData, setCountiesData] = useState([]);
  const [dependantDatesData, setDependentDatesData] = useState([]);
  const [form, setForm] = useState(initialState);
  const [activeTab, setActiveTab] = useState("date");
  const [state, setState] = useState("");

  useEffect(() => {
    if (calculatedDateData) {
      setForm({
        id: calculatedDateData?.id || null,
        state: calculatedDateData?.state?.id || "",
        dependant_date: calculatedDateData?.dependant_date?.id || "",
        jurisdiction_type: calculatedDateData?.jurisdiction_type?.id || "",
        counties:
          calculatedDateData?.counties?.map((county) => county.id) || [],
        name: calculatedDateData?.calculated_date_name || "",
        days: calculatedDateData?.day_count || "",
        months: calculatedDateData?.month_count || "",
        years: calculatedDateData?.year_count || "",
        days_type: calculatedDateData?.day_count_type || "",
      });
      setState(calculatedDateData?.state);
    }
  }, [calculatedDateData]);

  const getCountiesData = async () => {
    try {
      const response = await axios.get(
        `${origin}/api/all/counties/?state=${state.StateAbr}`,
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

  const getDependantDatesData = async () => {
    try {
      const response = await axios.get(
        `${origin}/api/all/dependant/date/types/?state=${state.StateAbr}`,
        {
          headers: {
            Authorization: tokenBearer,
          },
        }
      );
      setDependentDatesData(response.data.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (state?.StateAbr) {
      getCountiesData();
      getDependantDatesData();
    }
  }, [state]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prevForm) => {
      return {
        ...prevForm,
        [name]: value,
      };
    });
  };

  const handleStateChange = (e) => {
    const { name, value } = e.target;

    setForm((prevForm) => {
      const selectedState =
        statesData?.find((state) => state.id === parseInt(value)) || null;
      if (selectedState) {
        setState(selectedState);
      } else {
        setState(null);
        setCountiesData([]);
      }

      return {
        ...prevForm,
        [name]: value,
        counties: [], // Reset counties
        dependant_date: "", // Reset dependant_date
      };
    });
  };

  const handleCountiesChange = (e, countyID) => {
    if (e.target.checked) {
      setForm((prevForm) => ({
        ...prevForm,
        counties: [...prevForm.counties, countyID],
      }));
    } else {
      setForm((prevForm) => ({
        ...prevForm,
        counties: prevForm.counties.filter((ct) => ct !== countyID),
      }));
    }
  };

  const handleSelectAllCounties = (e) => {
    const isChecked = e.target.checked;

    if (isChecked) {
      setForm((prevForm) => ({
        ...prevForm,
        counties: countiesData?.map((county) => county.id),
      }));
    } else {
      setForm((prevForm) => ({
        ...prevForm,
        counties: [],
      }));
    }
  };

  const handleRadioChange = (e) => {
    const jurisdictionTypeId = Number(e.target.value);
    setForm((prevForm) => ({
      ...prevForm,
      jurisdiction_type: jurisdictionTypeId,
    }));
  };

  const handleSubmit = async () => {
    console.log("form", form);
    try {
      const response = await axios.patch(
        `${origin}/api/calculated/dates/directory/`,
        form,
        {
          headers: {
            Authorization: tokenBearer,
          },
        }
      );
      if (response.status === 200) {
        dispatch(
          updateCalculatedDate({
            id: calculatedDateData.id,
            updatedData: response.data.data,
          })
        );
        handleClose();
        setActiveTab("date");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `${origin}/api/calculated/dates/directory/?id=${calculatedDateData.id}`,
        {
          headers: {
            Authorization: tokenBearer,
          },
        }
      );
      if (response.status === 204) {
        dispatch(deleteCalculatedDate(calculatedDateData.id));
        handleClose();
        setActiveTab("date");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Modal
      show={calculatedDatePopUp}
      onHide={handleClose}
      dialogClassName="modal-dialog-centered Law-firm-direct-max-width-900px"
    >
      <Modal.Header className="bg-primary text-center p-2">
        <h4 className="modal-title text-white mx-auto">Edit Calculated Date</h4>
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
              <Nav.Link eventKey="date">Calculated Date</Nav.Link>
            </Nav.Item>
            {state && (
              <Nav.Item>
                <Nav.Link eventKey="county">Counties</Nav.Link>
              </Nav.Item>
            )}
          </Nav>
          <Tab.Content className="min-h-400">
            <Tab.Pane eventKey="date" className="overflow-hidden">
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Enter Calculated Date Name"
                  value={form?.name}
                  className="form-control"
                  name="name"
                  onChange={handleChange}
                />
              </div>
              <div className="row form-group">
                <div className="col-6">
                  <select
                    name="days_type"
                    className="form-select form-control"
                    value={form?.days_type}
                    onChange={handleChange}
                  >
                    <option value="">Select Day Count Type</option>
                    <option value="Calender">Calender Days</option>
                    <option value="Court">Court Days</option>
                  </select>
                </div>
                <div className="col-6">
                  <select
                    name="state"
                    className="form-select form-control"
                    value={form?.state}
                    onChange={handleStateChange}
                  >
                    <option value="">Select State</option>
                    {statesData?.map((state) => (
                      <option key={state.id} value={state.id}>
                        {state.StateAbr}, {state.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="row align-items-center form-group">
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
                      name="jurisdiction_type"
                      checked={form.jurisdiction_type == 1}
                      onChange={handleRadioChange}
                      style={{ accentColor: "grey", marginRight: "8px" }}
                    />
                    Federal
                  </label>
                  <label className="mr-4">
                    <input
                      type="radio"
                      value="2"
                      name="jurisdiction_type"
                      checked={form.jurisdiction_type == 2}
                      onChange={handleRadioChange}
                      style={{ accentColor: "grey", marginRight: "8px" }}
                    />
                    State
                  </label>
                  <label>
                    <input
                      type="radio"
                      value=""
                      name="jurisdiction_type"
                      checked={form.jurisdiction_type === ""}
                      onChange={handleChange}
                      style={{ accentColor: "grey", marginRight: "8px" }}
                    />
                    Both
                  </label>
                </div>
              </div>
              <div className="row form-group">
                <div className="col-4">
                  <input
                    type="text"
                    placeholder="Enter Day Count"
                    value={form?.days}
                    className="form-control"
                    name="days"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-4">
                  <input
                    type="text"
                    placeholder="Enter Month Count"
                    value={form?.months}
                    className="form-control"
                    name="months"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-4">
                  <input
                    type="text"
                    placeholder="Enter Year Count"
                    value={form?.years}
                    className="form-control"
                    name="years"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div>
                <select
                  name="dependant_date"
                  className="form-select form-control"
                  value={form?.dependant_date}
                  onChange={handleChange}
                >
                  <option value="">Select Dependent Date</option>
                  {dependantDatesData?.map((date) => (
                    <option key={date.id} value={date.id}>
                      {date.dependent_date_name}
                    </option>
                  ))}
                </select>
              </div>
            </Tab.Pane>
            <Tab.Pane eventKey="county" className="overflow-hidden">
              <div
                className="form-control"
                style={{
                  maxHeight: "380px",
                  overflowY: "scroll",
                  border: "1px solid #ccc",
                  padding: "10px",
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "10px",
                  height: "auto",
                }}
              >
                {countiesData?.length > 1 && (
                  <div className="form-check">
                    <label className="form-check-label">
                      <input
                        type="checkbox"
                        name="selectAllCounties"
                        className="form-check-input"
                        style={{ accentColor: "grey" }}
                        checked={form.counties?.length === countiesData?.length}
                        onChange={(e) => handleSelectAllCounties(e)}
                      />
                      Select All Counties
                    </label>
                  </div>
                )}
                {countiesData?.map((county) => (
                  <div key={county.id} className="form-check">
                    <label className="form-check-label">
                      <input
                        type="checkbox"
                        name="counties"
                        value={county.id}
                        className="form-check-input"
                        style={{ accentColor: "grey" }}
                        checked={form.counties?.some((ct) => ct === county.id)}
                        onChange={(e) => handleCountiesChange(e, county.id)}
                      />
                      {county.name}
                    </label>
                  </div>
                ))}
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
export default CalculatedDatesTableModal;
