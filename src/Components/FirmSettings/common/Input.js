import React from "react";

const Input = ({
  label,
  type,
  placeholder,
  value,
  onChange,
  cn = "",
  labelCN = "",
}) => {
  return (
    <div className={`col-sm-6 ${cn}`}>
      <label className={`form-label ${labelCN}`}>{label}</label>
      <input
        type={type}
        className="form-control"
        style={{ margin: "5px 0px 5px 0px" }}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default Input;
