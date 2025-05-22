import React from "react";

const Input = (props) => {
  const handleInputChange = (e) => {
    // Allow only numeric input
    const numericValue = e.target.value.replace(/\D/g, '');

    // Format the numeric value as (555) 555-5555
    const formattedValue = `(${numericValue.slice(0, 3)}) ${numericValue.slice(3, 6)}-${numericValue.slice(6, 10)}`;

    // Set the formatted value back to the input
    e.target.value = formattedValue;

    // You can also pass the formatted value to a parent component using props.onChange
    if (props.onChange) {
      props.onChange(formattedValue);
    }
  };

  return (
    <div className="row align-items-center mt-2">
      <div className="col-2">
        <label className="text-grey">{props.lable}</label>
      </div>
      <div className="col-10">
        <input
          type="text"
          className="modal-input"
          placeholder={props.placeholder}
          onInput={handleInputChange}
        />
      </div>
    </div>
  );
};

export default Input;

