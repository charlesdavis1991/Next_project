import React from "react";

const AcciInfoModal = ({
  onCheckboxChange,
  checkboxValues,
  onRadioBoxChange,
  radioBoxValues,
  handleUncheckRadioChange,
}) => {
  return (
    <>
      <div className="modal-body min-h-300 acciInfo">
        <div>
          <div className="row align-items-center mb-1">
            <div className="col-md-4">
              <p className="car-accident-color-000">
                <nobr>Ambulance?</nobr>
              </p>
            </div>
            <div className="col-md-5" />
            <div className="col-md-1">
              <div className="custom-control custom-radio">
                <input
                  type="radio"
                  id="ambulance_yes"
                  name="ambulance"
                  value="ambulance"
                  className="custom-control-input"
                  checked={radioBoxValues.includes("ambulance")}
                  onChange={onRadioBoxChange}
                />
                <label className="custom-control-label" for="ambulance_yes">
                  Yes
                </label>
              </div>
            </div>
            <div className="col-md-1 ml-1">
              <div className="custom-control custom-radio">
                <input
                  type="radio"
                  id="ambulance_no"
                  name="ambulance"
                  value="ambulance"
                  className="custom-control-input"
                  checked={!radioBoxValues.includes("ambulance")}
                  onChange={handleUncheckRadioChange}
                />
                <label className="custom-control-label" for="ambulance_no">
                  No
                </label>
              </div>
            </div>
          </div>
          <div className="row align-items-center mb-1">
            <div className="col-md-4">
              <p className="car-accident-color-000">
                <nobr>Emergency Room?</nobr>
              </p>
            </div>
            <div className="col-md-5" />

            <div className="col-md-1">
              <div className="custom-control custom-radio">
                <input
                  type="radio"
                  id="emergency_yes"
                  value="emergencyRoom"
                  name="emergencyRoom"
                  className="custom-control-input"
                  checked={radioBoxValues.includes("emergencyRoom")}
                  onChange={onRadioBoxChange}
                />
                <label className="custom-control-label" for="emergency_yes">
                  Yes
                </label>
              </div>
            </div>
            <div className="col-md-1 ml-1">
              <div className="custom-control custom-radio">
                <input
                  type="radio"
                  id="emergency_no"
                  name="emergencyRoom"
                  value="emergencyRoom"
                  className="custom-control-input"
                  checked={!radioBoxValues.includes("emergencyRoom")}
                  onChange={handleUncheckRadioChange}
                />
                <label className="custom-control-label" for="emergency_no">
                  No
                </label>
              </div>
            </div>
          </div>
          <div className="row align-items-center mb-1">
            <div className="col-md-4">
              <p className="car-accident-color-000">
                <nobr>Loss of Consciousness?</nobr>
              </p>
            </div>
            <div className="col-md-5" />

            <div className="col-md-1">
              <div className="custom-control custom-radio">
                <input
                  type="radio"
                  id="loss_yes"
                  name="lossOfConc"
                  value="lossOfConc"
                  className="custom-control-input"
                  checked={radioBoxValues.includes("lossOfConc")}
                  onChange={onRadioBoxChange}
                />
                <label className="custom-control-label" for="loss_yes">
                  Yes
                </label>
              </div>
            </div>
            <div className="col-md-1 ml-1">
              <div className="custom-control custom-radio">
                <input
                  type="radio"
                  id="loss_no"
                  name="lossOfConc"
                  value="lossOfConc"
                  className="custom-control-input"
                  checked={!radioBoxValues.includes("lossOfConc")}
                  onChange={handleUncheckRadioChange}
                />
                <label className="custom-control-label" for="loss_no">
                  No
                </label>
              </div>
            </div>
          </div>
          <div className="row align-items-center mb-1">
            <div className="col-md-4">
              <p className="car-accident-color-000">Report Taken?</p>
            </div>
            <div className="col-md-5" />

            <div className="col-md-1">
              <div className="custom-control custom-radio">
                <input
                  type="radio"
                  id="report_yes"
                  name="reportTaken"
                  value="reportTaken"
                  className="custom-control-input"
                  checked={radioBoxValues.includes("reportTaken")}
                  onChange={onRadioBoxChange}
                />
                <label className="custom-control-label" for="report_yes">
                  Yes
                </label>
              </div>
            </div>
            <div className="col-md-1 ml-1">
              <div className="custom-control custom-radio">
                <input
                  type="radio"
                  id="report_no"
                  name="reportTaken"
                  value="reportTaken"
                  className="custom-control-input"
                  checked={!radioBoxValues.includes("reportTaken")}
                  onChange={handleUncheckRadioChange}
                />
                <label className="custom-control-label" for="report_no">
                  No
                </label>
              </div>
            </div>
          </div>
          <div className="d-flex align-items-center">
            <p className="font-weight-bold">
              Weather:
            </p>
          </div>
          <div className="row align-items-center mb-1">
            <div className="col-md-4">
              <p className="car-accident-color-000 ml-2">Dry?</p>
            </div>
            <div className="col-md-5" />

            <div className="col-md-1">
              <div className="custom-control custom-radio">
                <input
                  type="checkbox"
                  id="dry_yes"
                  value="dry"
                  className=""
                  checked={checkboxValues.includes("dry")}
                  onChange={onCheckboxChange}
                />
              </div>
            </div>
          </div>
          <div className="row align-items-center mb-1">
            <div className="col-md-4">
              <p className="car-accident-color-000 ml-2">Wet?</p>
            </div>
            <div className="col-md-5" />

            <div className="col-md-1">
              <div className="custom-control custom-radio">
                <input
                  type="checkbox"
                  id="wet_yes"
                  value="wet"
                  className=""
                  checked={checkboxValues.includes("wet")}
                  onChange={onCheckboxChange}
                />
              </div>
            </div>
          </div>

          <div className="row align-items-center mb-1">
            <div className="col-md-4">
              <p className="car-accident-color-000 ml-2">Raining?</p>
            </div>
            <div className="col-md-5" />

            <div className="col-md-1">
              <div className="custom-control custom-radio">
                <input
                  type="checkbox"
                  id="raining_yes"
                  value="raining"
                  className=""
                  checked={checkboxValues.includes("raining")}
                  onChange={onCheckboxChange}
                />
              </div>
            </div>
          </div>
          <div className="row align-items-center mb-1">
            <div className="col-md-4">
              <p className="car-accident-color-000 ml-2">Fog?</p>
            </div>
            <div className="col-md-5" />

            <div className="col-md-1">
              <div className="custom-control custom-radio">
                <input
                  type="checkbox"
                  id="fog_yes"
                  value="fog"
                  className=""
                  checked={checkboxValues.includes("fog")}
                  onChange={onCheckboxChange}
                />
              </div>
            </div>
          </div>
          <div className="row align-items-center mb-1">
            <div className="col-md-4">
              <p className="car-accident-color-000 ml-2">Cloudy?</p>
            </div>
            <div className="col-md-5" />

            <div className="col-md-1">
              <div className="custom-control custom-radio">
                <input
                  type="checkbox"
                  id="cloudy_yes"
                  value="cloudy"
                  className=""
                  checked={checkboxValues.includes("cloudy")}
                  onChange={onCheckboxChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default AcciInfoModal;
