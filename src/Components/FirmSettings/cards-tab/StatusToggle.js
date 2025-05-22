import React, { useState } from "react";
import "./status.css";

const StatusToggle = ({ initialActive = false, onToggle }) => {
  const [isActive, setIsActive] = useState(initialActive);

  const handleToggle = () => {
    const newState = !isActive;
    setIsActive(newState);
    if (onToggle) {
      onToggle(newState);
    }
  };

  return (
    <div
      className={`status-button-cards-tab ${isActive ? "active" : "inactive"}`}
      onClick={handleToggle}
    >
      <div className="status-text-cards-tab active-text-cards-tab">Active</div>
      <div className="status-text-cards-tab inactive-text-cards-tab">
        Inactive
      </div>
      <div className="slider-indicator-cards-tab"></div>
    </div>
  );
};

export default StatusToggle;
