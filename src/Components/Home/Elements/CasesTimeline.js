import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import {
  setCaseId,
  setClientId,
  standardFormatDate,
} from "../../../Utils/helper";

import { fetchCaseSummary } from "../../../api/case";
import {
  fetchAllPages,
  fetchCurrentCase,
  setCaseSummary,
} from "../../../Redux/caseData/caseDataSlice";
import { setHeaderName } from "../../../Redux/header_name/action";
import {
  setCommonLoadingEffect,
  setComponentLoadingEffect,
} from "../../../Redux/common/Loader/action";

const CasesTimeline = (chats) => {
  const origin = process.env.REACT_APP_BACKEND_URL;

  const [caseTimeline, setCaseTimeline] = useState([]);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeCase = async (client_id, case_id) => {
    dispatch(setComponentLoadingEffect("medicalProviders", true));
    dispatch(setComponentLoadingEffect("detailBar", true));

    const response = await api.get(
      `/api/switch_client/${client_id}/${case_id}/Case/`
    );

    setClientId(client_id);
    setCaseId(case_id);
    dispatch(fetchCurrentCase(client_id, case_id));
    fetchCaseSummary(client_id, case_id)
      .then((data) => {
        dispatch(setCaseSummary(data));
        dispatch(fetchAllPages(case_id));
        dispatch(setHeaderName("Case"));

        navigate(`/bp-case/${client_id}/${case_id}`, {
          replace: true,
        });
      })
      .catch((err) => {
        console.log("Error occurred", err);
      });
  };

  const isValidName = (str) => {
    return str && str.trim().length > 0 && /[a-zA-Z]/.test(str.trim());
  };

  const fetchCaseTimeline = async () => {
    try {
      const response = await api.get(`${origin}/api/homepage/case-timeline/`);
      if (response.status === 200) {
        const data = response.data;
        console.log("fetchCaseTimeline", data);
        setCaseTimeline(data);
      }
    } catch (error) {
      console.error("Error fetching case types:", error);
    }
  };

  useEffect(() => {
    fetchCaseTimeline();
  }, []);
  const renderedCases = new Set();

  return (
    <div
      className="case-timeline right-calendar border-0 h-100"
      style={{ width: "255px" }}
    >
      <div className="background-main-10 height-25 has-sticky-header">
        <h4 className="client-contact-title text-center height-25 d-flex justify-content-center align-items-center h-100">
          All Cases Timeline
        </h4>
      </div>
      <div className="calendar-borders position-relative border-0">
        {caseTimeline && caseTimeline.length > 0 ? (
          caseTimeline.map((item, index) => {
            const dateStr = item.date;
            const date = new Date(dateStr);
            const daysOfWeek = [
              "Sunday",
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
            ];
            const dayName = daysOfWeek[date.getDay()];
            return (
              <>
                <div key={index}>
                  {/* Display the item date in one row */}
                  <div className="d-flex justify-content-between task case-timeline-dark-row">
                    <div>
                      <strong>{dayName}</strong>
                    </div>
                    <div>
                      <strong>{standardFormatDate(dateStr)}</strong>
                    </div>
                  </div>
                </div>

                {/* Display each event in its own row */}
                {item.events.map((event, i) => {
                  const { id, first_name, last_name, profile_pic_19p } =
                    event.event.for_case.for_client || {};
                  const renderClientName = `${last_name.trim()}, ${first_name.trim()} `;
                  const case_id_ind = event.event.for_case.id;
                  // Check if both first_name and last_name are valid (contains at least one letter after trimming)
                  const isValidFirstName = isValidName(first_name);
                  const isValidLastName = isValidName(last_name);

                  // Create a unique identifier for the case using client name and case type
                  const uniqueCaseIdentifier = `${first_name?.trim()} ${last_name?.trim()} - ${standardFormatDate(dateStr)}`;

                  let exist = false;

                  // Only render the case if both first and last names are valid, and the case hasn't been rendered before
                  if (
                    isValidFirstName &&
                    isValidLastName &&
                    !renderedCases.has(uniqueCaseIdentifier)
                  ) {
                    renderedCases.add(uniqueCaseIdentifier);
                  } else {
                    exist = true;
                  }

                  return (
                    <div
                      key={i}
                      className="task d-block"
                      style={{ background: "var(--primary-2) !important" }}
                      onClick={() => changeCase(id, case_id_ind)}
                    >
                      {!exist ? (
                        <div className="td-autosize d-flex align-items-center">
                          <span
                            className="ic ic-avatar ic-19 has-avatar-icon has-cover-img bg-white"
                            style={{ minWidth: "auto" }}
                          >
                            <img src={profile_pic_19p} className="theme-ring" />
                          </span>
                          <span
                            className="ml-1 client-type d-block align-items-center"
                            style={{ textAlign: "left" }}
                          >
                            {renderClientName}
                          </span>
                        </div>
                      ) : null}
                      <div
                        className="d-flex justify-content-between"
                        style={{ textAlign: "right" }}
                      >
                        <span className="text-right d-block ml-auto">
                          {event.event.name}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </>
            );
          })
        ) : (
          <div>No events available</div>
        )}
      </div>
    </div>
  );
};

export default CasesTimeline;
