import React, { useEffect } from "react";

const UserTypeCheckboxLessScreen = ({
  label,
  userId,
  checked,
  onChange,
  marginLeft = "0",
  firm_user1,
}) => {
  return (
    <div className="d-flex align-items-center justify-content-start user-desingation-detail">
      <input
        className="m-r-5 checkbox"
        style={{ marginLeft }}
        onClick={(e) => {
          e.stopPropagation();
          onChange();
        }}
        type="checkbox"
        user_id={userId || ""}
        checked={checked}
      />
      <div
        style={{
          textAlign: "left",
          fontWeight: "600",
        }}
        className="text-darker user-designation"
      >
        {label}
      </div>
    </div>
  );
};

export default UserTypeCheckboxLessScreen;
