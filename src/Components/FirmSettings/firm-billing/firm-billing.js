import React, { useEffect, useState } from "react";
import CommonHeader from "../common/common-header";
import useGetFirmBilling from "./hooks/useFirmBilling";
import TableFirmSettings from "../common/table-firm-settings";
import api from "../../../api/api";

const FirmBilling = () => {
  const heading = "FIRM SETTINGS TITLE WITH CENTERED TEXT";
  const points = [
    "1. Firm settings panel instruction point one",
    "2. Firm settings panel instruction point two",
    "3. Firm settings panel instruction point three",
  ];

  const { data, refetch } = useGetFirmBilling();
  const [billingData, setBillingData] = useState([]);

  useEffect(() => {
    if (data) {
      setBillingData(data);
    }
  }, [data]);

  const handleInputChange = async (index, field, value) => {
    const updatedData = [...billingData];
    updatedData[index][field] = value;
    setBillingData(updatedData);

    if (index !== 0) {
      try {
        const response = await api.post(
          "/api/firmsetting-page/edit-firm-billing/",
          {
            minimum: updatedData[index].minimumValue,
            round_up: updatedData[index].roundUp,
            round_down: updatedData[index].roundDn,
            user_id: updatedData[index].for_user.id,
          }
        );

        if (response.status === 200) {
          refetch();
        }
      } catch (error) {
        console.error("Error updating billing:", error);
        setBillingData(data);
      }
    }
  };

  const handleSave = async () => {
    try {
      const firstRow = billingData[0];
      const response = await api.post(
        "/api/firmsetting-page/save-firm-billing/",
        {
          minimum: firstRow.minimumValue,
          round_up: firstRow.roundUp,
          round_down: firstRow.roundDn,
        }
      );

      if (response.status === 200) {
        refetch();
      }
    } catch (error) {
      console.error("Error saving billing:", error);
    }
  };

  return (
    <div className="tab-pane fade firm-settings-user-perms-fs active show">
      <div className="mb-4">
        <CommonHeader heading={heading} points={points} />
      </div>
      <TableFirmSettings>
        <thead>
          <tr id="tb-header">
            <th className="td-autosize"></th>
            <th className="td-autosize">Firm User</th>
            <th className="td-autosize">Minimum</th>
            <th className="td-autosize">Round Down</th>
            <th className="td-autosize">Round Up</th>
            <th className="td-autosize"></th>
          </tr>
        </thead>
        <tbody>
          {billingData?.map((item, idx) => (
            <tr style={{ height: "35px" }} key={item.id}>
              <td className="color-grey td-autosize">{idx === 0 ? "" : idx}</td>
              <td className="td-autosize">
                <span className="d-flex align-items-center">
                  <span className="ic-avatar ic-29 has-avatar-icon has-cover-img ">
                    <img
                      className="output-3 output-3 theme-ring border-color-primary-50"
                      src={
                        item?.profile_pic && item.profile_pic !== ""
                          ? item.profile_pic
                          : "https://simplefirm-bucket.s3.amazonaws.com/static/bp_assets/img/avatar_new.svg"
                      }
                    />
                  </span>
                  <span className="m-l-5 text-black">
                    {item?.for_user?.first_name +
                      " " +
                      item?.for_user?.last_name}
                  </span>
                </span>
              </td>
              <td style={{ padding: "1px 5px" }}>
                <input
                  className="form-control"
                  type="number"
                  value={item.minimumValue}
                  onChange={(e) =>
                    handleInputChange(idx, "minimumValue", e.target.value)
                  }
                />
              </td>
              <td style={{ padding: "1px 5px" }}>
                <input
                  className="form-control"
                  type="number"
                  value={item.roundDn}
                  onChange={(e) =>
                    handleInputChange(idx, "roundDn", e.target.value)
                  }
                />
              </td>
              <td style={{ padding: "1px 5px" }}>
                <input
                  className="form-control"
                  type="number"
                  value={item.roundUp}
                  onChange={(e) =>
                    handleInputChange(idx, "roundUp", e.target.value)
                  }
                />
              </td>

              <td className="">
                {idx === 0 && (
                  <button onClick={handleSave} className="btn btn-primary">
                    Save
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </TableFirmSettings>
    </div>
  );
};

export default FirmBilling;
