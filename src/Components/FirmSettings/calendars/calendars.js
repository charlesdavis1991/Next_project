import React, { useEffect, useState } from "react";
import CommonHeader from "../common/common-header";
import useGetCalendars, {
  useGetIntegrateCalendars,
} from "./hooks/useCalendars";
import "./calendar.css";

const Calendars = () => {
  const heading = "FIRM SETTINGS TITLE WITH CENTERED TEXT";
  const points = [
    "1. Firm settings panel instruction point one",
    "2. Firm settings panel instruction point two",
    "3. Firm settings panel instruction point three",
  ];
  const { data, refetch } = useGetCalendars();
  const [connection, setConnection] = useState(null);
  const {
    data: integrateCalendars,
    refetch: integrateCalendarsRefetch,
    error,
  } = useGetIntegrateCalendars(connection);
  //   const [calendarData, setCalendarData] = useState()

  //   useEffect(() => {
  //     if (data) {
  //       setCalendarData(data)
  //     }
  //   },[data])

  useEffect(() => {
    if (integrateCalendars) {
      window.location.href = integrateCalendars?.auth_url;
    }
  }, [integrateCalendars]);

  const calendars = [
    {
      calendar: "Outlook",
      active: data?.microsoft_outlook_calendar?.active,
      lastLogin:
        data?.microsoft_outlook_calendar?.logged_in_at?.toLocaleString(
          "en-US",
          {
            month: "long",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          }
        ) || "N/A",
      connect: "Integrate",
      connection: "outlook",
    },
    {
      calendar: "Google",
      active: data?.google_calendar_obj?.active,
      lastLogin:
        new Date(data?.google_calendar_obj?.logged_in_at).toLocaleString(
          "en-US",
          {
            month: "long",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          }
        ) || "N/A",
      connect: "Integrate",
      connection: "google_calendar",
    },
  ];

  const handleConnect = (connection) => {
    setConnection(connection);
  };
  return (
    <div className="tab-pane fade firm-settings-user-perms-fs active show">
      <div>
        <CommonHeader heading={heading} points={points} />
      </div>
      <div className="col-lg-12 m-t-5">
        <table className="table">
          <thead className="">
            <tr>
              <th id="calendar-id-firm-settings">Calendar</th>
              <th id="calendar-id-firm-settings">Active</th>
              <th id="calendar-id-firm-settings">Firm User</th>
              <th id="calendar-id-firm-settings">Last Login</th>
              <th id="calendar-id-firm-settings">Connect</th>
            </tr>
          </thead>
          <tbody>
            {data &&
              calendars?.map((calendarItem, idx) => (
                <tr key={idx} id="calendar-id-firm-settings-border">
                  <td id="calendar-id-firm-settings">
                    <span className="calendar-section">
                      <span
                        className="calendar-header"
                        style={{ fontSize: "14px" }}
                      >
                        {calendarItem.calendar}
                      </span>
                    </span>
                  </td>
                  <td id="calendar-id-firm-settings">
                    <input
                      type="radio"
                      checked={calendarItem.active}
                      readOnly
                    />
                  </td>
                  <td id="calendar-id-firm-settings">
                    {data?.profile_pic ? (
                      <span className="firm-user">
                        <span className="user-image">
                          <img src={data?.profile_pic} alt={data?.firm_user} />
                        </span>
                      </span>
                    ) : (
                      <span className="ic ic-26 ic-avatar"></span>
                    )}
                    {data?.firm_user}
                  </td>
                  <td id="calendar-id-firm-settings">
                    {calendarItem.lastLogin}
                  </td>
                  <td id="calendar-id-firm-settings">
                    <button
                      onClick={() => handleConnect(calendarItem.connection)}
                      className="btn btn-primary btn_length"
                    >
                      {calendarItem.connect}
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Calendars;
