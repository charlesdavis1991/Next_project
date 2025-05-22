import React, { useState, useEffect } from "react";
import CheckListNav from "./CheckListNav";
import CheckListTable from "./CheckListTable";
import "./check-list.css";

const CheckListsDashboard = () => {
  const [duration, setDuration] = useState(90);

  return (
    <div className="check-list-page">
      <CheckListNav duration={duration} setDuration={setDuration} />
      <div className="tab-content directroy-tables-container check-lists-dashboard">
        <p>
          Welcome to the Checklist page. This page allows you to quickly assess
          the cases within your firm with the lowest checklist completion
          percentages across all case types and page checklists. Simply click a
          gauge and you will be presented with a control showing up to 10 of the
          cases within your firm that have the lowest checklist completion
          percentage for that combination of case type and page. You can then
          send tasks to the people assigned to that cases either in a group or
          as individual cases. The “Cases Older Than:” selection tool above will
          allow you to determine the age of the cases you want to assess and by
          selecting a number of days you will limit the control to cases older
          than the selected number of days.
        </p>
        <CheckListTable duration={duration} />
      </div>
    </div>
  );
};

export default CheckListsDashboard;
