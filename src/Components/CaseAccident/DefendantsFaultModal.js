import React, { useState } from "react";
import Alert from "react-bootstrap/Alert";

const DefendantsFaultModal = ({ defendants, updateDefendant }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [fault, setFault] = useState("");
  const [show, setShow] = useState(false);

  const handleChange = (type, e) => {
    const val = parseInt(e.target.value || 0);
    if (type === "select") {
      const foundObject = defendants.find((item) => item.id === val);
      setFirstName(foundObject.first_name);
      setLastName(foundObject.last_name);
      setFault(foundObject.fault_percent);
      updateDefendant(type, val);
    }
    if (type === "fault") {
      if (val <= 100) {
        setShow(false);
        setFault(val);
        updateDefendant(type, val);
      } else {
        setShow(true);
      }
    }
  };

  return (
    <>
      <div className="modal-body min-h-300 acciInfo">
        {show && (
          <Alert variant="danger" onClose={() => setShow(false)} dismissible>
            <p>Fault value cannot be greater than 100</p>
          </Alert>
        )}
        <div className="row align-items-center mb-2">
          <div className="col-md-2">
            <label className="m-0" for="f_name">
              Select Defendant
            </label>
          </div>
          <div className="col-md-10">
            <select
              required
              className="form-select autofill no-bootstrap-focus no-bootstrap-effect"
              name="state"
              id="state"
              onChange={(e) => handleChange("select", e)}
            >
              <option>Select</option>
              {defendants.map((defendant) => (
                <option value={defendant?.id}>
                  {defendant?.first_name} {defendant?.last_name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="row align-items-center">
          <div className="col-md-2">
            <label className="m-0" for="f_name">
              First Name
            </label>
          </div>
          <div className="col-md-10">
            <input
              id="f_name"
              disabled
              className="form-control"
              placeholder="First Name"
              value={firstName}
            />
          </div>
        </div>
        <div className="row align-items-center mt-3">
          <div className="col-md-2">
            <label className="m-0" for="l_name">
              Last Name
            </label>
          </div>
          <div className="col-md-10">
            <input
              disabled
              id="l_name"
              className="form-control"
              placeholder="Last Name"
              value={lastName}
            />
          </div>
        </div>
        <div className="row align-items-center mt-3">
          <div className="col-md-2">
            <label className="m-0" for="fault">
              Fault
            </label>
          </div>
          <div className="col-md-10">
            <div class="input-group mb-2 mr-sm-2">
              <input
                type="text"
                class="form-control"
                id="fault"
                placeholder="Fault"
                value={fault}
                onChange={(e) => handleChange("fault", e)}
              />
              <div class="input-group-prepend">
                <div class="input-group-text">%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DefendantsFaultModal;
