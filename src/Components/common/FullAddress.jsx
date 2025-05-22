import React, { useState } from "react";

const FullAddress = ({
  FullAddress,
  handleAddressChange,
  stateData,
  parentKey,
}) => {
  const { name, address, address2, city, state, zip, phone, fax, email } =
    FullAddress;
  const handleChange = (e) => {
    const { value, name } = e.target;
    handleAddressChange(parentKey, name, value);
  };
  return (
    <>
      <div className="col-md-1 p-r-0">
        <input
          value={name}
          required={true}
          name="name"
          id="location-name"
          className="form-control height-25 p-1"
          type="text"
          placeholder="Enter Name"
          onChange={handleChange}
        />
      </div>
      <div className="col-md-1 p-r-0">
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

      <div className="col-md-1 p-r-0">
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
      <div className="col-md-1 p-r-0">
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
      <div className="col-md-1 p-r-0">
        <select
          value={state}
          name="state"
          id="location-state"
          data-field="xstate"
          className="form-select form-control height-25 p-t-0 p-b-0 p-l-5 p-r-5"
          onChange={handleChange}
        >
          {stateData?.map((state) => (
            <option value={state.id} key={state.id}>
              {state.name}
            </option>
          ))}
        </select>
      </div>
      <div className="col-md-1 p-r-0">
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
      <div className="col-md-1 p-r-0">
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
      <div className="col-md-1 p-r-0">
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
      <div className="col">
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
    </>
  );
};

export default FullAddress;
