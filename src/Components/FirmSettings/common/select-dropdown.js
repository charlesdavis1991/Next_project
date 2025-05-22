import React from "react";

const SelectDropdown = ({ label, value, onChange, options }) => {
  return (
    <div className="position-field drop-down col-4">
      <select
        className="form-select custom-select position-dropdown"
        value={value}
        onChange={onChange}
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.user.first_name} {option.user.last_name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectDropdown;
