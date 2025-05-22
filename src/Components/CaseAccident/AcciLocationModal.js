import React from "react";
import { useSelector } from "react-redux";

const AcciLocationModal = ({ accLocation, updateLocationDetail }) => {
  const clientProvider = useSelector((state) => state.clientProvider);
  const states = clientProvider?.states;
  const {state, location, address1, address2, city, zip} = accLocation;

  const handleChange = (type, event) => {
    const val = event.target.value;
    updateLocationDetail(type, val);
  };

  return (
    <>
      <div className="modal-body min-h-300">
        <div className="row align-items-center">
          <div className="col-md-2">
            <label className="m-0" for="address">
              Location
            </label>
          </div>
          <div className="col-md-10">
            <input
              id="location"
              className="form-control"
              placeholder="Location"
              defaultValue={location}
              onChange={(e) => handleChange("location", e)}
            />
          </div>
        </div>
        <div className="row align-items-center mt-3">
          <div className="col-md-2">
            <label className="m-0" for="name">
              Address 1{" "}
            </label>
          </div>
          <div className="col-md-10">
            <input
              id="address1"
              className="form-control"
              placeholder="Address 1 "
              defaultValue={address1}
              onChange={(e) => handleChange("address1", e)}
            />
          </div>
        </div>
        <div className="row align-items-center mt-3">
          <div className="col-md-2">
            <label className="m-0" for="intersection">
              Address 2
            </label>
          </div>
          <div className="col-md-10">
            <input
              id="address2"
              className="form-control"
              placeholder="Address 2"
              defaultValue={address2}
              onChange={(e) => handleChange("address2", e)}
            />
          </div>
        </div>
        <div className="row align-items-center mt-3">
          <div className="col-md-2"></div>
          <div className="col-md-10">
            <div className="row">
              <div className="col-md-4">
                <input
                  id="city"
                  className="form-control"
                  placeholder="City"
                  defaultValue={city}
                  onChange={(e) => handleChange("city", e)}
                />
              </div>
              <div className="col-md-4">
                <select
                  required
                  className="form-select autofill state-dd no-bootstrap-focus no-bootstrap-effect"
                  name="state"
                  id="state"
                  onChange={(e) => {
                    handleChange("state", e);
                    console.log("State: ", e.target.value);
                    console.log("state?.StateAbr: ", state?.StateAbr);
                    console.log("state?.name: ", state?.name);
                  }}
                  value={state}
                >
                  {states.map((state) => (
                    <option value={state?.StateAbr}>{state?.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-4">
                <input
                  id="zipcode"
                  className="form-control"
                  placeholder="Zip Code"
                  defaultValue={zip}
                  onChange={(e) => handleChange("zip", e)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AcciLocationModal;
