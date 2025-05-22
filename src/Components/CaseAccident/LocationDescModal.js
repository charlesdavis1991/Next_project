import React, { useState, useEffect } from "react";

const LocationDescModal = ({ setLocationDesc, inputVal }) => {
  const [text, setText] = useState(inputVal);
  const [maxLength, setMaxLength] = useState(300);
  const [characterCount, setCharacterCount] = useState(0);

  const handleChange = (event) => {
    const newText = event.target.value;
    if (newText.length <= maxLength) setText(newText);
    setCharacterCount(newText.length);
    setLocationDesc(newText);
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
            <label for="loc_desc">Location Description</label>
          </div>
          <div className="col-12">
            <textarea
              className="form-control h-100px"
              placeholder="Enter Location Description"
              onChange={handleChange}
              maxLength={maxLength}
              value={text}
            ></textarea>
            <p className="text-right">{characterCount}/300</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LocationDescModal;
