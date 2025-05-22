import React, { useState } from "react";

const LocationsFullAddress = ({
  name,
  locationId,
  FullAddress,
  handleCopyAddress,
  handleLocationAddressChange,
  stateData,
}) => {
  const { address, address2, city, state, zip, phone, fax, email } =
    FullAddress;
  const [isCopied, setIsCopied] = useState(false);
  const handleCopy = () => {
    setIsCopied(true);
    handleCopyAddress(FullAddress, name);
    setTimeout(() => {
      setIsCopied(false);
    }, 500);
  };
  const handleChange = (e) => {
    const { value, name } = e.target;
    handleLocationAddressChange(name, value, locationId);
  };
  return (
    <div className="col-md-8 row">
      <div className="row">
        <div className="col-3 bg-blue">
          <input
            value={address}
            required={true}
            name="address"
            id="location-address"
            className="form-control height-25 p-1"
            type="text"
            placeholder="Enter Address 1"
            data-field="xaddress1"
            onChange={handleChange}
          />
        </div>

        <div className="col-3">
          <input
            required={true}
            value={address2}
            name="address2"
            id="address2"
            className="form-control height-25 p-1"
            type="text"
            placeholder="Enter Address 2"
            data-field="xaddress2"
            onChange={handleChange}
          />
        </div>
        <div className="col-3">
          <input
            value={city}
            required={true}
            name="city"
            id="location-city"
            className="form-control height-25 p-1"
            type="text"
            placeholder="Enter City"
            data-field="xcity"
            onChange={handleChange}
          />
        </div>
        <div className="col-3">
          <select
            value={state}
            name="state"
            id="location-state"
            data-field="xstate"
            className="form-select form-control height-25 p-t-0 p-b-0 p-l-5 p-r-5"
            onChange={handleChange}
          >
            {stateData?.map((state) => (
              <option value={state.id} key={state.StateAbr}>
                {state.name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-3">
          <input
            value={zip}
            required={true}
            name="zip"
            id="location-zip"
            className="form-control height-25 p-1"
            type="text"
            placeholder="Enter Zip"
            data-field="xzip"
            onChange={handleChange}
          />
        </div>
        <div className="col-3">
          <input
            value={phone}
            required={true}
            name="phone"
            className="form-control height-25 p-1"
            type="text"
            placeholder="Enter Phone"
            data-field="xphone"
            onChange={handleChange}
          />
        </div>
        <div className="col-3">
          <input
            value={fax}
            required={true}
            name="fax"
            className="form-control height-25 p-1"
            type="text"
            placeholder="Enter Fax"
            data-field="xfax"
            onChange={handleChange}
          />
        </div>
        <div className="col-3">
          <input
            value={email}
            required={true}
            name="email"
            className="form-control height-25 p-1"
            type="text"
            placeholder="Enter Email"
            data-field="xemail"
            onChange={handleChange}
          />
        </div>
      </div>
      {handleCopyAddress && (
        <div
          style={{
            width: "100%",
          }}
          className="d-flex justify-content-end m-t-5 m-b-5 align-items-center bg-blue"
        >
          <div>
            <button
              onClick={handleCopy}
              type="button"
              style={{
                width: "200px",
              }}
              className="btn btn-primary btn-sm btn-copy d-flex align-items-center height-25"
            >
              {isCopied ? (
                <i class="fas fa-clipboard-check"></i>
              ) : (
                <i className="fa fa-clone me-1"></i>
              )}

              <span className="m-l-5" style={{ color: "white" }}>
                {isCopied ? "Copied" : "Copy Location Address"}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationsFullAddress;
