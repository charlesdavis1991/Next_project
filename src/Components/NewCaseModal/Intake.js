import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import "./newcase.css";
import { getToken } from "../../Utils/helper";
const fields = [
  { label: "First Name", key: "first_name" },
  { label: "Last Name", key: "last_name" },
  { label: "Client Birthday", key: "client_birthday" },
  { label: "Incident Date", key: "incident_date" },
  { label: "Client Address", key: "client_address" },
  { label: "Client Phone Number", key: "client_phone_number" },
  { label: "Venue State", key: "venue_state" },
  { label: "Venue County", key: "venue_county" },
  { label: "Jurisdiction", key: "jurisdiction" },
];

const Intake = () => {
  const origin =
    process.env.REACT_APP_BACKEND_URL || "https://dev.simplefirm.com";

  const [fieldStates, setFieldStates] = useState({});

  useEffect(() => {
    const fetchFieldSettings = async () => {
      try {
        const response = await fetch(`${origin}/api/firm_enabled_fields/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: getToken(),
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch field settings");
        }
        const data = await response.json();
        console.log(data);
        setFieldStates(data.firm_field_settings.field_settings);
      } catch (error) {
        console.error("Error fetching field settings:", error);
      }
    };

    fetchFieldSettings();
  }, []);

  const handleCheckboxChange = (field, value) => {
    setFieldStates((prevState) => ({
      ...prevState,
      [field]: value,
    }));
    console.log(`${field} changed to ${value}`);
  };

  // post data
  const handleSave = async () => {
    const payload = {
      // firm_id: 5,
      field_settings: fieldStates,
    };

    try {
      const response = await fetch(`${origin}/api/firm_enabled_fields/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: getToken(),
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to save field settings");
      }

      const result = await response.json();
      console.log("Save successful:", result);
      //   alert("Field settings saved successfully!");
      //   fetchFieldSettings();
    } catch (error) {
      console.error("Error saving field settings:", error);
      alert("Failed to save field settings");
    }
  };

  return (
    <div className="p-2 row">
      <div className="col-4">
        {fields.map((field) => (
          <div
            key={field.key}
            className="d-flex flex-direction-col mt-2"
            style={{ gap: "1rem" }}
          >
            <p className="col-5">{field.label}</p>
            <input
              type="checkbox"
              checked={fieldStates[field.key] || false}
              onChange={(e) =>
                handleCheckboxChange(field.key, e.target.checked)
              }
            />
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          /* margin-top: -40px; */
          margin: "-3.5rem",
        }}
      >
        <Button variant="success" className="intake-save" onClick={handleSave}>
          Save
        </Button>
      </div>
    </div>
  );
};

export default Intake;
