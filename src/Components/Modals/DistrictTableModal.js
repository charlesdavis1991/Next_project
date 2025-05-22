import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getCaseId, getClientId } from "../../Utils/helper";
import { Modal } from "react-bootstrap";
import {
  deleteDistrict,
  updateDistrict,
} from "../../Redux/district-table/districtSlice";

function DistrictTableModal({ districtPopUp, handleClose, districtData }) {
  const tokenBearer = localStorage.getItem("token");
  const currentCaseId = getCaseId();
  const clientId = getClientId();
  const origin = process.env.REACT_APP_BACKEND_URL;
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const { statesData } = useSelector((state) => state.states);
  const [selectedState, setSelectedState] = useState("");
  const [countiesData, setCountiesData] = useState([]);
  const [filteredCounties, setFilteredCounties] = useState([]);
  const [selectedCounties, setSelectedCounties] = useState([]);
  const [form, setForm] = useState({
    id: "",
    name: "",
    district_type: "",
    state: "",
    counties: [],
  });

  const getCountiesDataHandler = async () => {
    try {
      const response = await axios.get(`${origin}/api/all/counties/`, {
        headers: {
          Authorization: tokenBearer,
        },
      });
      setCountiesData(response.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCountiesDataHandler();
  }, []);

  useEffect(() => {
    if (districtData && statesData?.length && countiesData.length) {
      setForm({
        id: districtData.id,
        name: districtData?.name || "",
        district_type: districtData?.district_type || "",
        state: districtData?.state || "",
        counties: districtData?.counties?.map((county) => ({
          id: county.id,
          name: county.name,
        })),
      });
      setSelectedState(districtData?.state);
      setSelectedCounties(districtData?.counties?.map((county) => county.id));
      const initialFilteredCounties = countiesData.filter(
        (county) => county.in_state?.StateAbr === districtData.state?.StateAbr
      );
      setFilteredCounties(initialFilteredCounties);
    }
  }, [districtData, countiesData, statesData]);

  const handleStateChange = (e) => {
    const stateAbr = e.target.value;
    setSelectedCounties([]);

    const state = statesData?.find((state) => state.StateAbr === stateAbr);
    setSelectedState(state);

    setForm((prevForm) => ({
      ...prevForm,
      state: state,
      counties: [],
    }));

    const filterCounties = countiesData.filter(
      (county) => county?.in_state?.StateAbr === stateAbr
    );
    setFilteredCounties(filterCounties);
  };

  const handleCountyChange = (e) => {
    const { value, checked } = e.target;
    const selectCounty = countiesData.find(
      (county) => county.id.toString() === value
    );
    const countyObj = selectCounty
      ? { id: selectCounty.id, name: selectCounty.name }
      : null;

    if (countyObj) {
      setSelectedCounties((prev) =>
        checked
          ? [...prev, countyObj.id]
          : prev.filter((id) => id !== countyObj.id)
      );

      setForm((prevForm) => {
        const newCounties = checked
          ? [...prevForm.counties, countyObj]
          : prevForm.counties.filter((county) => county.id !== countyObj.id);
        return {
          ...prevForm,
          counties: newCounties,
        };
      });
    }
  };

  const handleRadioChange = (e) => {
    setForm((prevForm) => ({
      ...prevForm,
      district_type: e.target.value,
    }));
  };

  const handleDistrictSubmit = async () => {
    console.error(null);
    try {
      const response = await axios.patch(
        `${origin}/api/add/districts/directory/${clientId}/${currentCaseId}/`,
        form,
        {
          headers: {
            Authorization: tokenBearer,
          },
        }
      );
      if (response.status === 200) {
        handleClose();
        dispatch(
          updateDistrict({
            id: districtData.id,
            updatedData: response.data.data,
          })
        );
      }
    } catch (err) {
      console.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteButton = async () => {
    try {
      const response = await axios.delete(
        `${origin}/api/add/districts/directory/${clientId}/${currentCaseId}/?id=${districtData.id}`,
        {
          headers: {
            Authorization: tokenBearer,
          },
        }
      );
      if (response.status == 204) {
        handleClose();
        dispatch(deleteDistrict(districtData.id));
      }
    } catch (error) {
      console.error("Error deleting insurance company:", error.message);
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
      show={districtPopUp}
      onHide={handleClose}
      dialogClassName="modal-dialog-centered Law-firm-direct-max-width-800px"
    >
      <Modal.Header className="bg-primary text-center p-2">
        <h4 className="modal-title text-white mx-auto">Edit Court District</h4>
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
              className="form-select form-control"
              value={form.state.StateAbr}
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
          <div className="row align-items-center form-group">
            <div className="col-2 text-left">
              <span className="d-inline-block text-grey">Counties</span>
            </div>
            <div className="col-10">
              {filteredCounties.length > 0 ? (
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
                  {filteredCounties.map((county, index) => (
                    <div key={index} className="form-check">
                      <label className="form-check-label">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          value={county.id}
                          style={{ accentColor: "grey" }}
                          onChange={handleCountyChange}
                          checked={selectedCounties.includes(county.id)}
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
          onClick={handleDistrictSubmit}
          class="btn btn-success"
        >
          Save
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default DistrictTableModal;
