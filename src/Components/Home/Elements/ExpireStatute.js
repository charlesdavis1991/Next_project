import React, { useEffect, useRef, useState } from "react";
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
import "./leastAccess.css";

function getStyles() {
  return {
    height: window.innerWidth > 2300 ? "21px" : "61px",
    paddingTop: window.innerWidth > 2300 ? "0px" : "1px",
    paddingBottom: window.innerWidth > 2300 ? "0px" : "1px",
  };
}

const ExpireStatute = (chats) => {
  const isValidName = (str) => {
    return str && str.trim().length > 0 && /[a-zA-Z]/.test(str.trim());
  };

  const origin = process.env.REACT_APP_BACKEND_URL;

  const [litigationActs, setLitigationActs] = useState([]);
  const [style, setStyle] = useState({
    gap: window.innerWidth > 2300 ? "10px" : "0px",
    height: window.innerWidth > 2300 ? "21px" : "61px",
    flexDirection: window.innerWidth > 2300 ? "row" : "column",
    paddingTop: window.innerWidth > 2300 ? "0px" : "1px",
    paddingBottom: window.innerWidth > 2300 ? "0px" : "1px",
    alignItems: window.innerWidth > 2300 ? "center" : "start",
  });
  const [divStyle, setDivStyle] = useState({});
  const [initialStyle, setInitialStyle] = useState(getStyles());
  const [className, setClassName] = useState(getClassName());

  function getClassName() {
    return window.innerWidth > 2300 ? "paddingIssueinLeastAccess" : "";
  }

  useEffect(() => {
    const handleResize = () => {
      setClassName(getClassName());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setInitialStyle(getStyles());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setStyle({
        gap: window.innerWidth > 2300 ? "10px" : "0px",
        height: window.innerWidth > 2300 ? "21px" : "61px",
        flexDirection: window.innerWidth > 2300 ? "row" : "column",
        paddingTop: window.innerWidth > 2300 ? "0px !important" : "1px",
        paddingBottom: window.innerWidth > 2300 ? "0px !important" : "1px",
        alignItems: window.innerWidth > 2300 ? "center" : "start",
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const calculateRowHeight = () => (window.innerWidth > 2300 ? 21 : 61);

  const calculateRowsToDisplay = () => {
    const rowHeight = calculateRowHeight();
    const viewportHeight = window.innerHeight;
    return Math.floor(viewportHeight / rowHeight);
  };

  useEffect(() => {
    const handleResize = () => {
      const rowsToDisplay = calculateRowsToDisplay();
      const rowHeight = calculateRowHeight();
      setDivStyle({
        maxHeight: `${rowsToDisplay * rowHeight}px`,
        overflowY: "auto",
      });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchLitigationActs = async () => {
    try {
      const response = await api.get(
        `${origin}/api/homepage/expiring-statute/`
      );

      if (response.status === 200) {
        var data = response.data;
        console.log("fetchLitigationActs", data);
        setLitigationActs(data);
      }
    } catch (error) {
      console.error("Error fetching case types:", error);
    }
  };

  useEffect(() => {
    fetchLitigationActs();
  }, []);

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

  const renderedCases = new Set();
  const clientNameRefs = useRef([]);
  const [maxWidth, setMaxWidth] = useState("auto");
  const [maxWidthForCaseType, setMaxWidthCaseType] = useState("auto");
  const caseTypeRefs = useRef([]);

  useEffect(() => {
    if (clientNameRefs.current.length > 0) {
      let calculatedMaxWidth = 0;
      clientNameRefs.current.forEach((ref) => {
        if (ref && ref.clientWidth > calculatedMaxWidth) {
          calculatedMaxWidth = ref.clientWidth;
        }
      });
      setMaxWidth(`${calculatedMaxWidth}px`);
    }
  }, [litigationActs]);

  useEffect(() => {
    if (caseTypeRefs.current.length > 0) {
      let calculatedMaxWidth = 0;
      caseTypeRefs.current.forEach((ref) => {
        if (ref && ref.clientWidth > calculatedMaxWidth) {
          calculatedMaxWidth = ref.clientWidth;
        }
      });
      setMaxWidthCaseType(`${calculatedMaxWidth}px`);
    }
  }, [litigationActs]);

  return (
    <div class="column order-1 order-xxl-2 d-flex flex-column m-b-5">
      <div class="background-main-10 height-25">
        <h4 class="client-contact-title text-center height-25 d-flex justify-content-center align-items-center h-100">
          Expiring Statute of Limitations
        </h4>
      </div>
      <div
        class="table-responsive table--no-card position-relative  border-0 has-tint-rows has-tint-h-35 flex-g-1"
        style={divStyle}
      >
        {litigationActs.length > 0 ? (
          <table class="table table-earning position-relative z-index-1 position-relative">
            <thead class="d-none">
              <tr>
                <th scope="col" class="width-1"></th>
                <th class="width-6-padding-left-42">Client</th>
                <th class="width-6">S.O.L</th>
              </tr>
            </thead>
            <tbody id="group_chat_body">
              {litigationActs
                ?.slice(0, calculateRowsToDisplay())
                .map((caseData, index) => {
                  const { id, for_client, case_type, incident_date } =
                    caseData?.for_case;
                  const { first_name, last_name, profile_pic_19p } =
                    for_client || {};

                  // Check if both first_name and last_name are valid (contains at least one letter after trimming)
                  const isValidFirstName = isValidName(first_name);
                  const isValidLastName = isValidName(last_name);

                  // Create a unique identifier for the case using client name and case type
                  const uniqueCaseIdentifier = `${first_name?.trim()} ${last_name?.trim()} - ${case_type?.name}`;

                  // Only render the case if both first and last names are valid, and the case hasn't been rendered before
                  if (
                    isValidFirstName &&
                    isValidLastName &&
                    !renderedCases.has(uniqueCaseIdentifier)
                  ) {
                    // Mark this case as rendered by adding the unique identifier to the set
                    renderedCases.add(uniqueCaseIdentifier);

                    const renderClientName = `${first_name.trim()} ${last_name.trim()}`;
                    return (
                      <tr
                        key={id}
                        onClick={() => changeCase(for_client.id, id)}
                        style={{ textAlign: "start" }}
                      >
                        <td
                          id={`${className}`}
                          style={initialStyle}
                          scope="row"
                        >
                          {index + 1}
                        </td>
                        <td
                          className="text-black d-flex pt-0 pb-0"
                          style={style}
                        >
                          <div className="d-flex align-items-center">
                            <span className="ic ic-avatar ic-19 has-avatar-icon has-cover-img bg-white">
                              <img
                                src={profile_pic_19p}
                                className="theme-ring"
                              />
                            </span>
                            <span
                              className="ml-2 client-type d-block align-items-center"
                              ref={(el) => (clientNameRefs.current[index] = el)}
                              style={{ width: maxWidth }}
                            >
                              {renderClientName}
                            </span>
                          </div>
                          <div className="case-type d-flex align-items-center font-weight-600 nowrap">
                            <img
                              src={case_type?.casetype_icon}
                              className="mr-2 ic-19"
                            />
                            {case_type?.name}
                          </div>
                          <div
                            className="d-flex align-items-center"
                            ref={(el) => (caseTypeRefs.current[index] = el)}
                            style={{ width: maxWidthForCaseType }}
                          >
                            {caseData?.name}
                          </div>
                        </td>
                        <td
                          className="td-autosize"
                          style={initialStyle}
                          id={`${className}`}
                        >
                          {caseData?.start_date
                            ? standardFormatDate(caseData?.start_date)
                            : standardFormatDate(caseData?.date)}
                        </td>
                      </tr>
                    );
                  } else {
                    return (
                      <tr
                        key={id}
                        onClick={() => changeCase(for_client.id, id)}
                        style={{ textAlign: "start" }}
                      >
                        <td
                          scope="row"
                          id={`${className}`}
                          style={initialStyle}
                        >
                          {index + 1}
                        </td>
                        <td
                          className="text-black d-flex pt-0 pb-0"
                          style={style}
                        >
                          <div className="td-autosize d-flex align-items-center">
                            {caseData?.name}
                          </div>
                        </td>
                        <td
                          className="td-autosize"
                          style={initialStyle}
                          id={`${className}`}
                        >
                          {caseData?.start_date
                            ? standardFormatDate(caseData?.start_date)
                            : standardFormatDate(caseData?.date)}
                        </td>
                      </tr>
                    );
                  }

                  // If the case is already rendered or has invalid names, skip rendering this row
                })}
              {litigationActs.length < calculateRowsToDisplay() &&
                Array.from(
                  { length: calculateRowsToDisplay() - litigationActs.length },
                  (_, index) => (
                    <tr key={`fake-${index}`}>
                      <td
                        className=""
                        scope="row pb-0 pt-0"
                        style={initialStyle}
                      ></td>
                      <td className="text-black pb-0 pt-0 " style={style}></td>
                      <td className="td-autosize" style={initialStyle}></td>
                    </tr>
                  )
                )}
            </tbody>
          </table>
        ) : (
          <p className="text-center m-5"></p>
        )}
      </div>
    </div>
  );
};

export default ExpireStatute;
