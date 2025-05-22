import React, { useEffect, useState } from "react";
import SelectStateModal from "../../../TreatmentPage/modals/state-modal/SelectStateModal";
import { api_without_cancellation } from "../../../../api/api";
import PR from "../../../../assets/state-svg/puerto-rico";
import GU from "../../../../assets/state-svg/guam";
import MP from "../../../../assets/state-svg/marian";
import VI from "../../../../assets/state-svg/us-virigin-island";
const CaseProviderModalForm = ({ formData, onChange, setStateNewShow }) => {
  // Handle individual field changes
  const [statesAbrs, setStatesAbrs] = useState([]);
  const stateMap = {
    PR: PR,
    GU: GU,
    VI: VI,
    MP: MP,
  };
  const specialStates = Object.keys(stateMap);

  const handleFieldChange = (field, value) => {
    onChange({
      ...formData,
      [field]: value,
    });
  };

  const fetchSatesData = async () => {
    try {
      const response = await api_without_cancellation.get(`/api/states/`);
      if (response.status === 200) {
        setStatesAbrs(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSatesData();
  }, []);

  const handleStateChange = (state) => {
    console.log(state);
    onChange({
      ...formData,
      state: state.StateAbr,
    });
  };

  const [stateShow, setStateShow] = React.useState(false);
  const handleStateShow = () => {
    setStateNewShow(!stateShow);
    setStateShow(!stateShow);
  };

  return (
    <>
      <div className="row align-items-center" style={{ marginBottom: "5px" }}>
        <div className="m-r-5 text-right" style={{ width: "100px" }}>
          <span className="d-inline-block text-grey">Name:</span>
        </div>
        <div style={{ width: "calc(100% - 110px)" }} className="">
          <input
            type="text"
            id="completed_location_name"
            className="Treatment-page-modal-form-control"
            name="medical_name"
            onChange={(e) => handleFieldChange("name", e.target.value)}
          />
        </div>
      </div>

      <div className="row align-items-center" style={{ marginBottom: "5px" }}>
        <div className="m-r-5 text-right" style={{ width: "100px" }}>
          <span className="d-inline-block text-grey">
            <nobr>Address 1, 2:</nobr>
          </span>
        </div>
        <div className="m-r-5" style={{ width: "calc(50% - 15px)" }}>
          <input
            type="text"
            id="completed_location_address1"
            className="Treatment-page-modal-form-control"
            name="medical_address1"
            onChange={(e) => handleFieldChange("address1", e.target.value)}
          />
        </div>
        <div style={{ width: "calc(50% - 100px)" }}>
          <input
            type="text"
            id="completed_location_address2"
            className="Treatment-page-modal-form-control"
            name="medical_address2"
            onChange={(e) => handleFieldChange("address2", e.target.value)}
          />
        </div>
      </div>

      <div className="row align-items-center" style={{ marginBottom: "5px" }}>
        <div
          style={{ whiteSpace: "nowrap", width: "100px" }}
          className="m-r-5 text-right"
        >
          <span className="d-inline-block text-grey">City, State, Zip:</span>
        </div>
        <div style={{ width: "calc(48%)", marginRight: "5px" }}>
          <input
            type="text"
            className="Treatment-page-modal-form-control"
            onChange={(e) => handleFieldChange("city", e.target.value)}
          />
        </div>

        <div
          style={{ minWidth: "calc(23%)", width: "calc(23%)" }}
          className="col-md-2 p-l-0 height-25 p-r-5 custom-select-new-provider"
        >
          <div
            className="dropdown-button rounded-0 p-0 p-l-5 form-control height-25 d-flex align-items-center"
            onClick={handleStateShow}
          >
            <span id="selectedOption">
              {specialStates.includes(formData?.state) ? (
                <div className="d-flex align-items-center">
                  {React.createElement(stateMap[formData?.state])}
                  {formData?.state}
                </div>
              ) : formData?.state ? (
                <div className="d-flex align-items-center">
                  <svg
                    style={{
                      width: "15px",
                      height: "15px",
                      fill: "var(--primary-80)",
                      color: "var(--primary-80)",
                      stroke: "var(--primary-80)",
                    }}
                    className={`icon icon-state-${formData?.state}`}
                  >
                    <use xlinkHref={`#icon-state-${formData?.state}`}></use>
                  </svg>
                  {formData?.state}
                </div>
              ) : (
                "Select State"
              )}
            </span>
            {/* <span id="selectedOption">
              {formData?.state ? (
                <div className="d-flex align-items-center">
                  <svg
                    style={{
                      width: "15px",
                      height: "15px",
                      fill: "var(--primary-80)",
                      color: "var(--primary-80)",
                      stroke: "var(--primary-80)",
                    }}
                    className={`icon icon-state-${formData?.state}`}
                  >
                    <use xlinkHref={`#icon-state-${formData?.state}`}></use>
                  </svg>
                  {formData?.state}
                </div>
              ) : (
                "Select State"
              )}
            </span> */}
          </div>
        </div>

        <div
          style={{ width: "calc(100% - 48% - 23% - 120px", minWidth: "63px" }}
        >
          <input
            type="text"
            className="Treatment-page-modal-form-control"
            onChange={(e) => handleFieldChange("zip", e.target.value)}
          />
        </div>
      </div>

      <div className="row align-items-center" style={{ marginBottom: "5px" }}>
        <div className="m-r-5 text-right" style={{ width: "100px" }}>
          <span className="d-inline-block text-grey">Phone:</span>
        </div>
        <div style={{ width: "calc(100% - 110px" }}>
          <input
            type="text"
            id="completed_phone"
            className="Treatment-page-modal-form-control"
            name="medical_phone"
            onChange={(e) => handleFieldChange("phone_number", e.target.value)}
          />
        </div>
      </div>

      <div className="row align-items-center" style={{ marginBottom: "5px" }}>
        <div className="m-r-5 text-right" style={{ width: "100px" }}>
          <span className="d-inline-block text-grey">Fax:</span>
        </div>
        <div style={{ width: "calc(100% - 110px" }}>
          <input
            type="text"
            id="completed_fax"
            className="Treatment-page-modal-form-control"
            name="medical_fax"
            onChange={(e) => handleFieldChange("fax", e.target.value)}
          />
        </div>
      </div>

      <div className="row align-items-center" style={{ marginBottom: "5px" }}>
        <div className="m-r-5 text-right" style={{ width: "100px" }}>
          <span className="d-inline-block text-grey">Website:</span>
        </div>
        <div style={{ width: "calc(100% - 110px" }}>
          <input
            type="text"
            id="completed_website"
            className="Treatment-page-modal-form-control"
            name="medical_website"
            onChange={(e) => handleFieldChange("website", e.target.value)}
          />
        </div>
      </div>

      <div className="row align-items-center" style={{ marginBottom: "5px" }}>
        <div className="m-r-5 text-right" style={{ width: "100px" }}>
          <span className="d-inline-block text-grey">Email:</span>
        </div>
        <div className="" style={{ width: "calc(100% - 110px" }}>
          <input
            type="text"
            id="completed_email"
            className="Treatment-page-modal-form-control"
            name="medical_email"
            onChange={(e) => handleFieldChange("email", e.target.value)}
          />
        </div>
      </div>

      {stateShow && (
        <SelectStateModal
          show={stateShow}
          handleClose={handleStateShow}
          onChange={handleStateChange}
          statesData={statesAbrs}
        />
      )}
    </>
  );
};

export default CaseProviderModalForm;
