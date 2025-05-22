import React, { useEffect, useState } from "react";
import axios from "axios";
import { getCaseId, getClientId } from "../../Utils/helper";
import { setLoading } from "../../Redux/actions";
import ActionBarComponent from "../common/ActionBarComponent";
import { useSelector } from "react-redux";

// Utility function to convert 24-hour time format to 12-hour format with AM/PM
const formatTimeTo12Hour = (time24) => {
  if (!time24) return ""; // Return empty if time24 is not defined

  // Split the time string and parse hours and minutes
  const timeParts = time24.split(":");
  if (timeParts.length !== 2) return ""; // Return empty if the time string is invalid

  const hours = parseInt(timeParts[0], 10);
  const minutes = parseInt(timeParts[1], 10);

  if (isNaN(hours) || isNaN(minutes)) return ""; // Return empty if hours or minutes are not valid numbers

  const ampm = hours >= 12 ? "am" : "pm";
  const hours12 = hours % 12 || 12; // Convert 24-hour to 12-hour format

  return `${hours12}:${minutes.toString().padStart(2, "0")} ${ampm}`;
};

// Utility function to format 'first_touch' and 'most_recent' times
const formatRecordTimes = (record) => {
  return {
    firstTouch: formatTimeTo12Hour(record.first_touch),
    mostRecent: formatTimeTo12Hour(record.most_recent),
  };
};

// Utility function to remove duplicates from a string and sort it
const removeDuplicatesAndSort = (str) => {
  return Array.from(
    new Set(
      str
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    )
  )
    .sort((a, b) => a.localeCompare(b))
    .join(", ");
};

// Utility function to remove duplicates while maintaining order
const removeDuplicates = (arr) => [...new Set(arr.filter(Boolean))];

// Utility function to find earliest and latest records
const findEarliestAndLatest = (records) => {
  let earliestRecord = records[0];
  let latestRecord = records[0];

  records.forEach((rec) => {
    const recDate = new Date(rec.date);

    if (recDate < new Date(earliestRecord.date)) {
      earliestRecord = rec;
    }

    if (recDate > new Date(latestRecord.date)) {
      latestRecord = rec;
    }
  });

  return { earliestRecord, latestRecord };
};

// Utility function to format seconds into HH:MM:SS
const formatSecondsToTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return [
    String(hours).padStart(2, "0"),
    String(minutes).padStart(2, "0"),
    String(secs).padStart(2, "0"),
  ].join(":");
};

// Utility function to convert time string to seconds
const timeToSeconds = (timeStr) => {
  const [hours, minutes, seconds] = timeStr.split(":").map(Number);
  return (hours || 0) * 3600 + (minutes || 0) * 60 + (seconds || 0);
};

// Utility function to format number as currency
const formatCurrency = (amount) => `$${parseFloat(amount).toFixed(2)}`;

// Utility function to format date to MM/DD/YYYY with leading zeros
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const month = String(date.getMonth() + 1); //.padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

// Utility function to merge user's records into one
const mergeUserRecords = (records) => {
  const { earliestRecord, latestRecord } = findEarliestAndLatest(records);

  const totalSeconds = records.reduce(
    (acc, rec) => acc + (timeToSeconds(rec.time) || 0),
    0
  );

  const totalRate = records.reduce(
    (acc, rec) => acc + (parseFloat(rec.rate) || 0),
    0
  );

  const totalCost = records.reduce(
    (acc, rec) => acc + (parseFloat(rec.total_cost) || 0),
    0
  );

  const mergedRecord = {
    ...earliestRecord,
    date: {
      earliest: earliestRecord.date ? formatDate(earliestRecord.date) : "",
      latest: latestRecord.date ? formatDate(latestRecord.date) : "",
    },
    time: formatSecondsToTime(totalSeconds),
    earliest_first_time: formatTimeTo12Hour(earliestRecord.first_touch),
    latest_first_time: formatTimeTo12Hour(latestRecord.most_recent),
    bill_code_category: removeDuplicatesAndSort(
      records.map((rec) => rec.bill_code_category).join(", ")
    ),
    bill_code_category_name: removeDuplicatesAndSort(
      records.map((rec) => rec.bill_code_category_name).join(", ")
    ),
    bill_code: removeDuplicatesAndSort(
      records.map((rec) => rec.bill_code).join(", ")
    ),
    bill_code_name: removeDuplicatesAndSort(
      records.map((rec) => rec.bill_code_name).join(", ")
    ),
    bill_code_definition: removeDuplicatesAndSort(
      records.map((rec) => rec.bill_code_definition).join(", ")
    ),
    note: removeDuplicates(
      records.flatMap((rec) =>
        Array.isArray(rec.note)
          ? rec.note.map((noteObj) => noteObj.note)
          : rec.note
      )
    ).join(", "),
    rate: formatCurrency(totalRate),
    total_cost: formatCurrency(totalCost),
  };

  return mergedRecord;
};

export default function Main() {
  const tokenBearer = localStorage.getItem("token");
  const currentCaseId = getCaseId();
  const clientId = getClientId();
  const origin = process.env.REACT_APP_BACKEND_URL;

  const [timePage, setTimePage] = useState({ user_data: [] });
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    getTimePageHandler();
  }, []);

  const getTimePageHandler = async () => {
    try {
      const response = await axios.get(
        `${origin}/api/timepage/${clientId}/${currentCaseId}/`,
        {
          headers: {
            Authorization: tokenBearer,
          },
        }
      );

      setTimePage(response.data);
    } catch (err) {
      console.error("Error fetching time page:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Extract unique users and create a dictionary for quick lookup
  const uniqueUsers = {};
  if (Array.isArray(timePage.user_data)) {
    timePage.user_data.forEach((item) => {
      const user = item.user;
      if (!uniqueUsers[user.id]) {
        // Replace "/media" with the desired S3 URL prefix
        const avatarUrl = user.profile_pic
          ? user.profile_pic.replace(
              "/media",
              "https://simplefirm-bucket.s3.amazonaws.com/static"
            )
          : ""; // Fallback in case profile_pic is not available

        console.log("User avatar URL:", avatarUrl);

        uniqueUsers[user.id] = {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          avatar_url: avatarUrl, // Updated avatar URL with S3 link
        };
      }
    });
  }

  // Convert uniqueUsers object to an array and sort by name
  const sortedUsers = Object.values(uniqueUsers).sort((a, b) => b.id - a.id);

  // Group records by user ID and merge them
  const mergedUserData = Array.isArray(timePage.user_data)
    ? Object.values(
        timePage.user_data.reduce((acc, record) => {
          const userId = record.user.id;
          if (!acc[userId]) {
            acc[userId] = [];
          }
          acc[userId].push(record);
          return acc;
        }, {})
      ).map(mergeUserRecords)
    : [];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  const timeData = [{ label: 5, value: "Total" }];
  const header_name = useSelector((state) => state.header_name?.header_name);

  return (
    <div className="main" style={{ paddingTop: "0px", overflow: "auto" }}>
      <ActionBarComponent
        src="https://simplefirm-bucket.s3.amazonaws.com/static/images/time-a-clock-icon.svg"
        page_name={"Time"}
        caseAccident={timeData}
      />
      {/* <div className="action-bar client-BarAlign main-action-bar has-checklist d-flex m-b-5 m-t-5">
        <span className="page-icon">
          <img
            className="translate-note-icon"
            src="https://simplefirm-bucket.s3.amazonaws.com/static/images/time-a-clock-icon.svg"
          />
        </span>
        <div className="text-wrapper text-white d-flex align-items-center p-l-5 width-60">
          <h2 className="text-white font-18">Time</h2>
          <span className="mx-2 mar-0">|</span>
          <ul className="info-list text-white d-flex list-unstyled">
            <li>
              <span className="label">5</span>
              <span className="value">Total</span>
            </li>
          </ul>
        </div>
      </div> */}
      <div className="custom-tab" style={{ paddingTop: "39px" }}>
        <nav className="nav nav-tabs d-flex align-items-center" role="tablist">
          <a
            className={`text-start nav-item nav-link flex-item-content-width font-weight-bold ${
              activeTab === "all" ? "active" : ""
            }`}
            id="all-tab"
            data-toggle="tab"
            href="#tab-all"
            role="tab"
            aria-controls="tab-all"
            aria-selected="true"
            onClick={() => handleTabClick("all")}
            style={{ margin: 0 }}
          >
            <span className="ml-2 mr-2">All</span>
          </a>

          {Array.isArray(timePage.user_data) &&
          timePage.user_data.length > 0 ? (
            [
              ...new Map(
                timePage.user_data.map((item) => [item.user.id, item.user])
              ).values(),
            ].map((user) => (
              <a
                key={user.id}
                className={`text-start nav-item nav-link flex-item-content-width font-weight-bold ${
                  activeTab === `user-${user.id}` ? "active" : ""
                }`}
                id={`user-${user.id}-tab`}
                data-toggle="tab"
                href={`#tab-user-${user.id}`}
                role="tab"
                aria-controls={`tab-user-${user.id}`}
                aria-selected="false"
                onClick={() => handleTabClick(`user-${user.id}`)}
                style={{ margin: 0 }}
              >
                <span className="d-flex align-items-center">
                  <span className="ic ic-avatar ic-19 has-avatar-icon has-cover-img ml-2">
                    <img
                      className="output-3 theme-ring"
                      src={
                        user.profile_pic
                          ? user.profile_pic.replace(
                              "/media/",
                              "https://simplefirm-bucket.s3.amazonaws.com/static/"
                            )
                          : user.avatar_url
                      }
                    />
                  </span>
                  <span className="ml-2 mr-2">{`${user.first_name} ${user.last_name}`}</span>
                </span>
              </a>
            ))
          ) : (
            <p></p>
          )}
        </nav>

        <div className="tab-content" style={{ zIndex: "0" }}>
          {activeTab === "all" && mergedUserData.length > 0 && (
            <div
              className="tab-pane active show"
              id="tab-all"
              role="tabpanel"
              aria-labelledby="all-tab"
            >
              <div className="table--no-card rounded-0 border-0 w-100">
                <table className="table table-borderless table-striped table-earning has-height-25 time-page-table">
                  <thead>
                    <tr>
                      <th className="text-center">User</th>
                      <th className="text-center">User Role</th>
                      <th className="text-center">Date</th>
                      <th className="text-center">Time</th>
                      <th className="text-center">Code Categories</th>
                      <th className="text-center">Category Names</th>
                      <th className="text-center">Codes</th>
                      <th className="text-center">Code Names</th>
                      <th className="text-center">Code Description</th>
                      <th className="text-center">Notes</th>
                      <th className="text-end">Rate</th>
                      <th className="text-center">Total Time</th>
                      <th className="text-end">Total Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mergedUserData.map((record, index) => (
                      <tr key={index}>
                        <td className="text-center text-black">
                          <span className="d-flex align-items-center">
                            <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
                              <img
                                className="output-3 theme-ring"
                                src={
                                  record.user.profile_pic
                                    ? record.user.profile_pic.replace(
                                        "/media/",
                                        "https://simplefirm-bucket.s3.amazonaws.com/static/"
                                      )
                                    : record.user.avatar_url
                                }
                              />
                            </span>
                            <span className="ml-2 mr-2">{`${record.user.first_name} ${record.user.last_name}`}</span>
                          </span>
                        </td>
                        <td className="text-center">{record.user.role}</td>
                        <td className="text-center">
                          {record.date.earliest}
                          <br></br> {record.date.latest}
                        </td>
                        <td className="text-center">
                          {record.earliest_first_time}
                          <br></br> {record.latest_first_time}
                        </td>
                        <td
                          className="text-center text-wrap"
                          style={{
                            whiteSpace: "normal",
                            wordWrap: "break-word",
                          }}
                        >
                          {record.bill_code_category}
                        </td>
                        <td
                          className="text-center text-wrap"
                          style={{
                            whiteSpace: "normal",
                            wordWrap: "break-word",
                          }}
                        >
                          {record.bill_code_category_name}
                        </td>
                        <td
                          className="text-center text-wrap"
                          style={{
                            whiteSpace: "normal",
                            wordWrap: "break-word",
                          }}
                        >
                          {record.bill_code}
                        </td>
                        <td
                          className="text-center text-wrap"
                          style={{
                            whiteSpace: "normal",
                            wordWrap: "break-word",
                          }}
                        >
                          {record.bill_code_name}
                        </td>
                        <td
                          className="text-center text-wrap"
                          style={{
                            whiteSpace: "normal",
                            wordWrap: "break-word",
                          }}
                        >
                          {record.bill_code_definition}
                        </td>
                        <td
                          className="text-center text-wrap"
                          style={{
                            whiteSpace: "normal",
                            wordWrap: "break-word",
                          }}
                        >
                          {record.note}
                        </td>
                        <td className="text-center">{record.rate}</td>
                        <td className="text-center">{record.time}</td>
                        <td className="text-center">{record.total_cost}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {sortedUsers.map((user) =>
            activeTab === `user-${user.id}` ? (
              <div
                key={user.id}
                className="tab-pane active show"
                id={`tab-user-${user.id}`}
                role="tabpanel"
                aria-labelledby={`user-${user.id}-tab`}
              >
                <div className="table--no-card rounded-0 border-0 w-100">
                  <table className="table table-borderless table-striped table-earning has-height-25 time-page-table">
                    <thead>
                      <tr>
                        <th className="text-center">User</th>
                        <th className="text-center">Role</th>
                        <th className="text-center">Date</th>
                        <th className="text-center">First</th>
                        <th className="text-center">Recent</th>
                        <th className="text-center">Code Categories</th>
                        <th className="text-center">Category Names</th>
                        <th className="text-center">Codes</th>
                        <th className="text-center">Code Names</th>
                        <th className="text-center">Code Descriptions</th>
                        <th className="text-center">Notes</th>
                        <th className="text-end">Rate</th>
                        <th className="text-center">Total Time</th>
                        <th className="text-end">Total Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {timePage.user_data
                        .filter((item) => item.user.id === user.id)
                        .slice() // Create a shallow copy of the array
                        .sort((a, b) => {
                          let dateA = new Date(a.date);
                          let dateB = new Date(b.date);

                          // Handle empty date fields
                          if (!a.date) return 1;
                          if (!b.date) return -1;

                          return dateB - dateA;
                        })
                        .map((item, index) => {
                          const { firstTouch, mostRecent } =
                            formatRecordTimes(item);
                          return (
                            <tr key={index}>
                              <td className="text-black text-center">
                                {index === 0 ? (
                                  <span className="d-flex align-items-center">
                                    <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
                                      <img
                                        className="output-3 theme-ring"
                                        src={
                                          item.user.profile_pic
                                            ? item.user.profile_pic.replace(
                                                "/media/",
                                                "https://simplefirm-bucket.s3.amazonaws.com/static/"
                                              )
                                            : item.user.avatar_url
                                        }
                                      />
                                    </span>
                                    <span className="ml-2 mr-2">{`${item.user.first_name} ${item.user.last_name}`}</span>
                                  </span>
                                ) : (
                                  " "
                                )}
                              </td>
                              <td className="text-center">
                                {item.user_role || " "}
                              </td>
                              <td className="text-center">
                                {item.date || " "}
                              </td>
                              <td className="text-center">{firstTouch}</td>
                              <td className="text-center">{mostRecent}</td>
                              <td className="text-center">
                                {item.bill_code_category || " "}
                              </td>
                              <td
                                className="text-center text-wrap"
                                style={{
                                  whiteSpace: "normal",
                                  wordWrap: "break-word",
                                }}
                              >
                                {item.bill_code_category_name || " "}
                              </td>
                              <td className="text-center">
                                {item.bill_code || " "}
                              </td>
                              <td
                                className="text-center text-wrap"
                                style={{
                                  whiteSpace: "normal",
                                  wordWrap: "break-word",
                                }}
                              >
                                {item.bill_code_name || " "}
                              </td>
                              <td
                                className="text-center text-wrap"
                                style={{
                                  whiteSpace: "normal",
                                  wordWrap: "break-word",
                                }}
                              >
                                {item.bill_code_definition || " "}
                              </td>
                              <td
                                className="text-center text-wrap"
                                style={{
                                  whiteSpace: "normal",
                                  wordWrap: "break-word",
                                }}
                              >
                                {Array.isArray(item.note) &&
                                item.note.length > 0
                                  ? item.note
                                      .map((noteObj) => noteObj.note || "")
                                      .join(", ")
                                  : " "}
                              </td>
                              <td className="text-end">
                                {item.hourly_rate
                                  ? `$${item.hourly_rate}`
                                  : " "}
                              </td>
                              <td className="text-center">
                                {item.time || " "}
                              </td>
                              <td className="text-end">
                                {item.total_cost ? `$${item.total_cost}` : " "}
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : null
          )}
        </div>
      </div>
    </div>
  );
}
