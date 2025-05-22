import React, { useEffect, useState } from "react";
import "./red-flag-auto.css";
import CommonHeader from "../common/common-header";
import useGetRedFlagAuto from "./hooks/useRedFlagAuto";
import api from "../../../api/api";

const RedFlagAuto = () => {
  const heading =
    "Select what missing data automatically flags a case and how long the data is missing from the case creation date the flagging is triggered";
  const points = [
    "1. Select what Flagging triggers you want to enable.",
    "2. Select how many days after the case file creation date you want the value to be checked.",
    "3. If the values are missing from the case file after the number of days you checked, the case will be automatically Red Flagged to all firm users assigned to that case and tasks will be created for each team member to review the case.",
  ];

  const { data, loading, error } = useGetRedFlagAuto();
  const [formData, setFormData] = useState(data || {});

  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

  const preparePayload = (updatedFormData) => {
    console.log("updatedFormData ====>", updatedFormData);
    const payload = {};

    Object.entries(updatedFormData)
      .filter(([key]) => key !== "id")
      .forEach(([key, value]) => {
        payload[key] = value.is_filled === true ? "True" : "False";
      });

    return payload;
  };

  const handleCheckboxChange = async (key) => {
    const previousValue = formData[key].is_filled;

    const updatedFormData = {
      ...formData,
      [key]: {
        ...formData[key],
        is_filled: !formData[key].is_filled,
      },
    };

    setFormData(updatedFormData);
    const payload = preparePayload(updatedFormData);
    console.log("Payload ====>", payload);
    try {
      const response = await api.post(
        "/api/firmsetting-page/submit-red-flag",
        payload
      );
      console.log("Form submitted successfully:", response.data);
    } catch (error) {
      console.error("Error submitting form:", error);

      setFormData((prevFormData) => ({
        ...prevFormData,
        [key]: {
          ...prevFormData[key],
          is_filled: previousValue,
        },
      }));
    }
  };
  const formatKey = (key) => {
    return key
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };
  return (
    <div className="tab-pane fade firm-settings-user-perms-fs active show">
      <div>
        <CommonHeader heading={heading} points={points} />
      </div>
      <div className="tab-content">
        <table
          className={`table table-borderless table-striped table-treatment has-specialty-icon has-height-25 block-table m-r-5`}
          id="treatment-summary-table"
        >
          <thead>
            <tr id="tb-header">
              <th></th>
              <th className="text-uppercase">Missing Information</th>
            </tr>
          </thead>
          <tbody>
            {data &&
              Object.entries(formData ? formData : data)
                .filter(([key]) => key !== "id") // Filter out the `id` field
                .map(([key, value], idx) => (
                  <tr key={idx}>
                    <td className="text-center color-gray">{idx + 1}</td>
                    <td className="text-center">
                      <span className="d-flex justify-content-center align-items-center">
                        <span className="d-flex align-items-center justify-content-between w-100">
                          <p className="m-r-8">{formatKey(key)}</p>
                          <span className="m-r-8 d-flex align-items-center">
                            <label className="m-r-8">
                              <input
                                type="radio"
                                name="incident_date_case_age"
                                value="2"
                              />{" "}
                              2
                            </label>
                            <label className="m-r-8">
                              <input
                                type="radio"
                                name="incident_date_case_age"
                                value="5"
                              />{" "}
                              5
                            </label>
                            <label className="m-r-8">
                              <input
                                type="radio"
                                name="incident_date_case_age"
                                value="10"
                              />{" "}
                              10
                            </label>
                            <label>
                              <input
                                type="radio"
                                name="incident_date_case_age"
                                value="30"
                              />{" "}
                              30
                            </label>
                          </span>
                          <div>
                            <input
                              type="checkbox"
                              id="redflag1"
                              checked={value.is_filled}
                              onChange={() => handleCheckboxChange(key)}
                            />
                          </div>
                        </span>
                      </span>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RedFlagAuto;
