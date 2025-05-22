import React from "react";
import CommonHeader from "../common/common-header";
import useGetTopUp from "./hooks/useTopUp";
import TableFirmSettings from "../common/table-firm-settings";
import { formatDate, formatDateUTC } from "../../../Utils/helper";

const TopUp = () => {
  const heading = "FIRM SETTINGS TITLE WITH CENTERED TEXT";
  const points = [
    "1. Firm settings panel instruction point one",
    "2. Firm settings panel instruction point two",
    "3. Firm settings panel instruction point three",
  ];

  const { data } = useGetTopUp();

  function formatDate(dateString) {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      timeZone: "UTC",
    };
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", options)
      .format(date)
      .replace(", ", ", ");
  }

  return (
    <div className="tab-pane fade firm-settings-user-perms-fs active show">
      <div>
        <CommonHeader heading={heading} points={points} />
      </div>
      <h2 className="font-weight-bold m-b-5" style={{ marginTop: "10px" }}>
        Top Up
      </h2>
      <div className="" style={{ marginBottom: "10px" }}>
        <b>Balance: </b>${data?.balance}
      </div>
      <h3 className="" style={{ marginBottom: "10px" }}>
        Top-Up History
      </h3>
      <TableFirmSettings>
        <thead>
          <tr id="tb-header">
            <th>Credit</th>
            <th>Debit</th>
            <th>Balance</th>
            <th>Description</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {data?.top_up_history?.map((item) => (
            <tr style={{ height: "35px" }} key={item.id}>
              <td className="color-grey">{item.credit}</td>
              <td>{item.debit}</td>
              <td>{item.balance}</td>
              <td>{item.description}</td>
              <td>{formatDate(item.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </TableFirmSettings>
    </div>
  );
};

export default TopUp;
