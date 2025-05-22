import React, { useEffect } from "react";

const UserTypeCheckbox = ({
  label,
  userId,
  checked,
  onChange,
  marginLeft = "0",
  firm_user1,
}) => {
  const adjustCaseDetailsWidths = () => {
    const leftColumns = document.querySelectorAll(".user-desingation-detail");

    let maxLeftWidth = 0;
    let maxRightWidth = 0;

    leftColumns.forEach((column) => {
      const width = column.getBoundingClientRect().width;
      maxLeftWidth = Math.max(maxLeftWidth, width);
    });

    leftColumns.forEach((column) => {
      column.style.width = `${maxLeftWidth}px`;
    });
  };

  useEffect(() => {
    adjustCaseDetailsWidths();
    window.addEventListener("resize", adjustCaseDetailsWidths);
    return () => {
      window.removeEventListener("resize", adjustCaseDetailsWidths);
    };
  }, [label]);

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

      <div className="ic ic-avatar ic-19 has-avatar-icon has-cover-img">
        {firm_user1 && firm_user1?.profile_pic_19p && (
          <img src={firm_user1["profile_pic_19p"]} />
        )}
      </div>
      <div style={{ fontWeight: "600" }} className=" text-darker ml-2">
        {firm_user1 ? firm_user1?.user?.first_name : null}{" "}
        {firm_user1 ? firm_user1?.user?.last_name : null}
      </div>
    </div>
  );
};

export default UserTypeCheckbox;
