import React, { useEffect, useState } from "react";
import CommonHeader from "../common/common-header";
import useGetValuesTab, { usePostValuesTab } from "./useValueTab";

const Values = () => {
  const heading = "FIRM SETTINGS TITLE WITH CENTERED TEXT";
  const points = [
    "1. Firm settings panel instruction point one",
    "2. Firm settings panel instruction point two",
    "3. Firm settings panel instruction point three",
  ];
  const { data, refetch } = useGetValuesTab();
  const { saveValuesTab } = usePostValuesTab();
  const [values, setValues] = useState({
    property_damage_value: "",
    property_damage_value_min: "",
    property_damage_value_max: "",
  });

  useEffect(() => {
    if (data) {
      setValues({
        property_damage_value: data.property_damage_value || "",
        property_damage_value_min: data.property_damage_value_min || "",
        property_damage_value_max: data.property_damage_value_max || "",
      });
    }
  }, [data]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    const payload = {
      property_damage_value: values.property_damage_value
        ? parseInt(values.property_damage_value, 10)
        : "",
      property_damage_value_min: values.property_damage_value_min
        ? parseInt(values.property_damage_value_min, 10)
        : "",
      property_damage_value_max: values.property_damage_value_max
        ? parseInt(values.property_damage_value_max, 10)
        : "",
    };

    await saveValuesTab(payload);
    refetch();
  };

  return (
    <div className="tab-pane fade firm-settings-user-perms-fs active show">
      <div>
        <CommonHeader heading={heading} points={points} />
      </div>
      <div className="col-lg-12 mt-2 mb-2">
        <h2>Firm Threshold Values</h2>
      </div>
      <div className="row mb-2 col-lg-12">
        <span className="col-lg-12">Property Damage Value: </span>
      </div>
      <div className="row mb-2 ">
        <div className="col-lg-12 d-flex align-items-center">
          <div className="col-lg-3">
            <input
              type="number"
              className="form-control"
              name="property_damage_value"
              value={values.property_damage_value}
              onChange={handleInputChange}
              placeholder="Property damage value"
            />
          </div>
          <div className="col-lg-3">
            <input
              type="number"
              className="form-control"
              name="property_damage_value_min"
              value={values.property_damage_value_min}
              onChange={handleInputChange}
              placeholder="Minimum property damage value"
            />
          </div>
          <div className="col-lg-3">
            <input
              type="number"
              className="form-control"
              name="property_damage_value_max"
              value={values.property_damage_value_max}
              onChange={handleInputChange}
              placeholder="Maximum property damage value"
            />
          </div>
        </div>
      </div>
      <div className="row col-lg-12">
        <div className="col-lg-12">
          <button className="btn btn-success" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Values;
