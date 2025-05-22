import React from "react";
import FullAddress from "./FullAddress";

const ProviderModalChunk = ({
  formDataChunk,
  title,
  formDataKey,
  handleAddressChange,
  stateData,
}) => {
  return (
    <div>
      <div className="d-flex justify-content-between m-t-5 m-b-5 align-items-center">
        <h4 className="text-center text-uppercase align-self-end color-p0">
          {title}
        </h4>
      </div>
      <div
        className="row align-items-center form-group m-b-5 other_location_block"
        id="new-flex"
      >
        <FullAddress
          parentKey={formDataKey}
          handleAddressChange={handleAddressChange}
          stateData={stateData}
          FullAddress={formDataChunk}
        />
      </div>
    </div>
  );
};

export default ProviderModalChunk;
