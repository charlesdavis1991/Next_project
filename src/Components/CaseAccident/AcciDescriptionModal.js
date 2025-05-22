import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

const AcciDescriptionModal = ({
  setAccidentDesc,
  inputVal,
  setAccidentTypeID,
  accident_type,
}) => {
  const [text, setText] = useState(inputVal);
  const [maxLength, setMaxLength] = useState(300);
  const [characterCount, setCharacterCount] = useState(0);
  const accident_types = useSelector((state) => state.accident.accident_types);
  const handleChange = (event, type = "") => {
    if (type === "select") {
      setAccidentTypeID(parseInt(event.target.value));
    } else {
      const newText = event.target.value;
      if (newText.length <= maxLength) setText(newText);
      setCharacterCount(newText.length);
      setAccidentDesc(newText);
    }
  };
  useEffect(() => {
    if (inputVal) {
      setCharacterCount(inputVal.length);
    }
  }, []);
  return (
    <>
      <div className="modal-body min-h-300">
        <div className="row align-items-center">
          <div className="col-12">
            <label for="loc_desc">Accident Description</label>
          </div>
          <div className="col-12">
            <textarea
              className="form-control h-100px"
              placeholder="Enter Accident Description"
              onChange={handleChange}
              maxLength={maxLength}
              value={text}
            ></textarea>
            <p className="text-right">{characterCount}/300</p>
          </div>
        </div>
        <div className="row align-items-center mt-1">
          <div className="col-md-2">
            <label for="loc_desc">Accident Type</label>
          </div>
          <div className="col-md-10">
            <select
              required
              className="form-select autofill no-bootstrap-focus no-bootstrap-effect"
              name="state"
              id="state"
              onChange={(e) => handleChange(e, "select")}
              defaultValue={accident_type?.id}
            >
              <option>Select</option>
              {accident_types.map((type) => (
                <option value={type?.id}>{type?.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </>
  );
};

export default AcciDescriptionModal;
