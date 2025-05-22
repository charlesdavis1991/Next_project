import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getCaseId, getClientId } from "../../Utils/helper";
import { addDistrict } from "../../Redux/district-table/districtSlice";
import { Modal } from "react-bootstrap";

const initialState = {
  name: "",
  district_type: "",
  state: "",
  counties: [],
};

function AddCourtDistrictModal({ addCourtDistrict, handleClose }) {
  const tokenBearer = localStorage.getItem("token");
  const currentCaseId = getCaseId();
  const clientId = getClientId();
  const origin = process.env.REACT_APP_BACKEND_URL;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const { statesData } = useSelector((state) => state.states);
  const [selectedState, setSelectedState] = useState("");
  const [countiesData, setCountiesData] = useState([]);
  const [form, setForm] = useState(initialState);

  const getCountiesData = async () => {
    try {
      const response = await axios.get(
        `${origin}/api/all/counties/?state=${selectedState}`,
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
    if (addCourtDistrict) {
      setError(null);
      setForm(initialState);
    }
  }, [addCourtDistrict]);

  useEffect(() => {
    if (selectedState && addCourtDistrict) {
      getCountiesData();
    }
  }, [selectedState, addCourtDistrict]);

  const handleStateChange = (e) => {
    const stateAbr = e.target.value;
    const state = statesData?.find((state) => state.StateAbr === stateAbr);
    setSelectedState(stateAbr);

    if (state) {
      setForm((prevForm) => ({
        ...prevForm,
        state: state,
        counties: [],
      }));
    }
  };

  const handleCountyChange = (e, county) => {
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
    setForm((prevForm) => ({
      ...prevForm,
      district_type: e.target.value,
    }));
  };

  const handleDistrictSubmit = async () => {
    setError(null);
    try {
      const response = await axios.post(
        `${origin}/api/add/districts/directory/${clientId}/${currentCaseId}/`,
        form,
        {
          headers: {
            Authorization: tokenBearer,
          },
        }
      );
      if (response.status === 201) {
        dispatch(addDistrict(response.data.data));
        setForm(initialState);
        handleModalClose();
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
      handleModalClose();
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setForm(initialState);
    setSelectedState("");
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
      show={addCourtDistrict}
      onHide={handleClose}
      dialogClassName="modal-dialog-centered Law-firm-direct-max-width-800px"
    >
      <Modal.Header className="text-center bg-primary p-2">
        <h4 className="modal-title text-white mx-auto">Add Court District</h4>
      </Modal.Header>
      <Modal.Body>
        <div className="row align-items-center form-group">
          <div className="col-md-2 text-left">
            <span className="d-inline-block text-grey">District</span>
          </div>
          <div className="col-10">
            <input
              type="text"
              placeholder="Enter District Name"
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
          <div className="col-2 text-left">
            <span className="d-inline-block text-grey">District Type</span>
          </div>
          <div className="col-10">
            <label className="mr-4 ml-2">
              <input
                type="radio"
                value="Federal"
                checked={form.district_type === "Federal"}
                onChange={handleRadioChange}
                style={{ accentColor: "grey", marginRight: "8px" }}
              />
              Federal
            </label>
            <label>
              <input
                type="radio"
                value="State"
                checked={form.district_type === "State"}
                onChange={handleRadioChange}
                style={{ accentColor: "grey", marginRight: "8px" }}
              />
              State
            </label>
          </div>
        </div>
        <div className="row align-items-center form-group">
          <div className="col-2 text-left">
            <span className="d-inline-block text-grey">State</span>
          </div>
          <div className="col-10">
            <select
              name="state"
              className="form-select form-control oveflow-hidden"
              value={form?.state?.StateAbr || ""}
              onChange={handleStateChange}
            >
              <option value="">Select State</option>
              {statesData?.map((state) => (
                <option key={state.id} value={state.StateAbr}>
                  {state.StateAbr}, {state.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        {selectedState && (
          <div className="row align-items-start form-group">
            <div className="col-2 text-left">
              <span className="d-inline-block text-grey">Counties</span>
            </div>
            <div className="col-10">
              {countiesData?.length > 0 ? (
                <div
                  style={{
                    maxHeight: "300px",
                    overflowY: "scroll",
                    border: "1px solid #ccc",
                    padding: "10px",
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "10px",
                  }}
                >
                  {countiesData?.map((county, index) => (
                    <div key={index} className="form-check">
                      <label className="form-check-label">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          value={county}
                          style={{ accentColor: "grey" }}
                          onChange={(e) => handleCountyChange(e, county)}
                          checked={form.counties?.some(
                            (count) => count.id === county.id
                          )}
                        />
                        {county.name}
                      </label>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No counties available</p>
              )}
            </div>
          </div>
        )}
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
          onClick={handleDistrictSubmit}
          class="btn btn-success"
        >
          Save
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddCourtDistrictModal;
