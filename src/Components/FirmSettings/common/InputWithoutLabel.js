import React from "react";

const InputWithOutLabels = ({
  type,
  placeholder,
  value,
  onChange,
  cn = "",
}) => {
  return (
    <div className={`${cn}`}>
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

export default InputWithOutLabels;
