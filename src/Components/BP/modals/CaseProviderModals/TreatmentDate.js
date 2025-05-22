import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import axios from "axios";
import Avatar from "../../../../assets/images/avatar.png";
import TreatmentDatesRow from "./TreatmentDatesRow";
import "../NewEditCaseProviderModal.css";
import { getCaseId, getClientId, getToken } from "../../../../Utils/helper";
import { formatDateForInput } from "../../../TreatmentPage/utils/helperFn";

const TreatmentDate = ({
  formData,
  onChange,
  caseProvider,
  specialitie,
  verification,
  allTreatmentDates,
  setAllTreatmentDates,
  isTreatmentCompleteVerified,
  contact,
  refetch,
  refetchAllParams,
}) => {
  console.log(isTreatmentCompleteVerified);
  console.log("formData", formData);
  const origin = process.env.REACT_APP_BACKEND_URL;
  const [treatmentDate, setTreatmentDate] = useState(
    formatDateForInput(formData?.firstDate) || ""
  );
  const [treatmentNotes, setTreatmentNotes] = useState("");

  const addTreatmentDate = async () => {
    try {
      const response = await axios.post(
        `${origin}/api/treatment/add_treatment_date/`,
        {
          case_provider_id: caseProvider?.id,
          new_treatment_date: treatmentDate?.split("T")[0],
          new_treatment_notes: treatmentNotes,
        }
      );
      if (response.data) {
        setAllTreatmentDates((prevDates) => [...prevDates, response.data]);
      }
      setTreatmentDate("");
      setTreatmentNotes("");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // const [firstDate, setFirstDate] = useState(
  //   caseProvider?.first_date ? caseProvider?.first_date.split("T")[0] : ""
  // );
  // const [lastDate, setLastDate] = useState(
  //   caseProvider?.second_date ? caseProvider?.second_date.split("T")[0] : ""
  // );
  // const [visitCount, setVisitCount] = useState(caseProvider?.visits || "");
  // const [completeTreatment, setCompleteTreatment] = useState(
  //   caseProvider?.treatment_complete || ""
  // );
  const handleFieldChange = (field, value) => {
    onChange({
      ...formData,
      [field]: value,
    });
  };

  // Hasnat

  // useImperativeHandle(ref, () => ({
  //   save: async () => {
  //     // Updating case provider --  Hasnat
  //     try {
  //       const caseProviderResponse = await axios.put(
  //         `${origin}/api/treatment/update/case-provider/${caseProvider?.id}/`,
  //         {
  //           first_appointment: firstDate,
  //           last_appointment: lastDate,
  //           visits: visitCount,
  //           treatment_complete: completeTreatment,
  //         }
  //       );
  //       console.log("Case provider response data:", caseProviderResponse.data);
  //       if (caseProviderResponse.data) {
  //         console.log("Case provider information updated successfully!");
  //       }
  //     } catch (error) {
  //       console.error("Error updating case provider:", error);
  //     }
  //   },
  // }));

  function verify_unverify(arg) {
    const data = {
      client_id: 20,
      case_id: caseProvider?.for_case,
      Arg: arg,
      case_provider_id: caseProvider?.id,
    };

    const apiUrl = `${origin}/api/treatment/verify-unverify/`;

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: getToken(),
      },
    };

    axios
      .post(apiUrl, data, config)
      .then((response) => {
        console.log("Response Treatment Date:", response.data);
        console.log("verification successful");
        if (arg === "CaseProviders-visits") {
          refetch();
        } else {
          refetchAllParams();
        }
        // updateCall();
        // onUpdate();
        //handleClose()
      })
      .catch((error) => {
        console.error("Error posting data:", error);
      });
  }

  function created_at_format(string_date) {
    const date = new Date(string_date);

    const options = {
      timeZone: "UTC",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };
    const formattedDateTime = date.toLocaleString("en-US", options);
    return formattedDateTime;
  }

  return (
    <div>
      {/* <div className="row">
        <div className="col-6">
          <div className="row align-items-center form-group">
            <div className="col-2 text-left">
              <span className="d-inline-block text-grey">
                <nobr>First Appt.</nobr>
              </span>
            </div>
            <div className="col-10 d-flex">
              <input
                type="date"
                id="treatment_dates_first_date"
                class="Treatment-page-modal-form-control"
                name="first_appointment"
                value={firstDate}
                onChange={(e) => setFirstDate(e.target.value)}
              />
              <div className="d-flex  align-items-center">
                <div className="icon-wrap ic-19 m-l-5 m-r-5">
                  {isTreatmentDateFirstVerified?.action ? (
                    isTreatmentDateFirstVerified?.action.toLowerCase() ===
                    "verified" ? (
                      <i
                        id="is_request_billing_recived_verified"
                        className="ic ic-verified ic-19"
                      ></i>
                    ) : (
                      <i
                        id="is_request_billing_recived_verified"
                        className="ic ic-unverified ic-19"
                      ></i>
                    )
                  ) : (
                    <i
                      id="is_request_billing_recived_verified"
                      className="ic ic-unverified ic-19"
                    ></i>
                  )}
                </div>
                <button
                  id="treatment_dates_first_date_verified_btn"
                  className="btn btn-primary rounded-0 height-25 d-flex align-items-center"
                  onClick={() => verify_unverify("CaseProviders-first_date")}
                >
                  {isTreatmentDateFirstVerified?.action
                    ? isTreatmentDateFirstVerified?.action.toLowerCase() ===
                      "verified"
                      ? "Unverify"
                      : "Verify"
                    : "Verify"}
                </button>
              </div>
            </div>
            <div className="col-12 ">
              <div className="bg-grey-100 height-25 d-flex align-items-center justify-content-center text-center">
                <p className="font-italic text-black d-flex align-items-center verification_note">
                  <span id="treatment_dates_first_date_verified_date">
                    {isTreatmentDateFirstVerified?.action
                      ? isTreatmentDateFirstVerified?.action.toLowerCase() ===
                        "verified"
                        ? created_at_format(
                            isTreatmentDateFirstVerified?.created_at
                          )
                        : null
                      : null}
                  </span>
                  <span className="ic ic-avatar ic-19 has-avatar-icon has-cover-img mx-1">
                    <img src={Avatar} alt="" />
                  </span>
                  <span id="treatment_dates_first_date_verified_by">
                    {isTreatmentDateFirstVerified?.action
                      ? isTreatmentDateFirstVerified?.action.toLowerCase() ===
                        "verified"
                        ? isTreatmentDateFirstVerified?.verification_by +
                          " ip: " +
                          isTreatmentDateFirstVerified?.ip_address
                        : null
                      : null}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-6">
          <div className="row align-items-center form-group">
            <div className="col-2 text-left">
              <span className="d-inline-block text-grey">
                <nobr>Last Appt.</nobr>
              </span>
            </div>
            <div className="col-10 d-flex">
              <input
                type="date"
                id="treatment_dates_last_date"
                class="Treatment-page-modal-form-control"
                name="last_appointment"
                value={lastDate}
                onChange={(e) => setLastDate(e.target.value)}
              />
              <div className="d-flex  align-items-center">
                <div className="icon-wrap ic-19 m-l-5 m-r-5">
                  {isTreatmentDateLastVerified?.action ? (
                    isTreatmentDateLastVerified?.action.toLowerCase() ===
                    "verified" ? (
                      <i
                        id="is_request_billing_recived_verified"
                        className="ic ic-verified ic-19"
                      ></i>
                    ) : (
                      <i
                        id="is_request_billing_recived_verified"
                        className="ic ic-unverified ic-19"
                      ></i>
                    )
                  ) : (
                    <i
                      id="is_request_billing_recived_verified"
                      className="ic ic-unverified ic-19"
                    ></i>
                  )}
                </div>
                <button
                  id="treatment_dates_last_date_verified_btn"
                  className="btn btn-primary rounded-0 height-25 d-flex align-items-center"
                  onClick={() => verify_unverify("CaseProviders-second_date")}
                >
                  {isTreatmentDateLastVerified?.action
                    ? isTreatmentDateLastVerified?.action.toLowerCase() ===
                      "verified"
                      ? "Unverify"
                      : "Verify"
                    : "Verify"}
                </button>
              </div>
            </div>
            <div className="col-12 ">
              <div className="bg-grey-100 height-25 d-flex align-items-center justify-content-center text-center">
                <p className="font-italic text-black d-flex align-items-center verification_note">
                  <span id="treatment_dates_last_date_verified_date">
                    {isTreatmentDateLastVerified?.action
                      ? isTreatmentDateLastVerified?.action.toLowerCase() ===
                        "verified"
                        ? created_at_format(
                            isTreatmentDateLastVerified?.created_at
                          )
                        : null
                      : null}
                  </span>
                  <span className="ic ic-avatar ic-19 has-avatar-icon has-cover-img mx-1">
                    <img src={Avatar} alt="" />
                  </span>
                  <span id="treatment_dates_last_date_verified_by">
                    {isTreatmentDateLastVerified?.action
                      ? isTreatmentDateLastVerified?.action.toLowerCase() ===
                        "verified"
                        ? isTreatmentDateLastVerified?.verification_by +
                          " ip: " +
                          isTreatmentDateLastVerified?.ip_address
                        : null
                      : null}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      <div className="row">
        <div className="col-6">
          <div
            style={{ marginBottom: "5px" }}
            className="row align-items-center "
          >
            <div className="col-1 text-left">
              <span className="d-inline-block text-grey">
                <nobr>Visits #:</nobr>
              </span>
            </div>
            <div
              style={{ paddingRight: "18px" }}
              className="col-11 d-flex justify-content-between align-items-center"
            >
              <input
                type="number"
                placeholder="Enter Visits"
                class="Treatment-page-modal-form-control m-l-10"
                name="no_of_visits"
                id="treatment_dates_visits"
                value={formData?.visitCount}
                onChange={(e) =>
                  handleFieldChange("visitCount", e.target.value)
                }
              />
              <div className="d-flex  align-items-center">
                <div className="icon-wrap ic-19 m-l-5 ">
                  {verification?.visits !== null ? (
                    <i
                      id="is_request_billing_recived_verified"
                      className="ic ic-verified ic-19"
                    ></i>
                  ) : (
                    <i
                      id="is_request_billing_recived_verified"
                      className="ic ic-unverified ic-19"
                    ></i>
                  )}
                </div>
                <button
                  id="treatment_dates_visits_verify_btn"
                  className="btn btn-primary rounded-0 height-25 d-flex justify-content-center align-items-center"
                  style={{ minWidth: "80px", marginRight: "2px" }}
                  onClick={() => verify_unverify("CaseProviders-visits")}
                >
                  {verification?.visits === null ? "Verify" : "Unverify"}
                </button>
              </div>
            </div>
            <div className="col-12 ">
              <div className="bg-grey-100 height-25 d-flex align-items-center justify-content-center text-center">
                <p className="font-italic text-black d-flex align-items-center verification_note">
                  <span id="treatment_dates_visits_verify_date">
                    {/* {isTreatmentDateVisitVerified.action
                      ? isTreatmentDateVisitVerified.action.toLowerCase() ===
                        "verified"
                        ? created_at_format(
                            isTreatmentDateVisitVerified.created_at
                          )
                        : null
                      : null} */}
                    {verification?.visits !== null
                      ? created_at_format(verification?.visits?.date)
                      : null}
                  </span>
                  <span className="ic ic-avatar ic-19 has-avatar-icon has-cover-img mx-1">
                    <img src={Avatar} alt="" />
                  </span>
                  <span id="treatment_dates_visits_verify_by">
                    {/* {isTreatmentDateVisitVerified.action
                      ? isTreatmentDateVisitVerified.action.toLowerCase() ===
                        "verified"
                        ? isTreatmentDateVisitVerified.verification_by +
                          " ip: " +
                          isTreatmentDateVisitVerified.ip_address
                        : null
                      : null} */}
                    {verification?.visits !== null
                      ? `${verification?.visits?.verification_by} ip: ${verification?.visits?.ip_address} `
                      : null}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-6">
          <div
            style={{ marginBottom: "5px" }}
            className="row align-items-center"
          >
            <div className="col-2 text-left">
              <span className="d-inline-block text-grey">Complete?</span>
            </div>
            <div className="col-10">
              <div className="d-flex justify-content-between align-items-center ">
                <div className="d-flex justify-content-around align-items-center ml-3">
                  <p className="m-r-5 d-flex ">
                    <input
                      className="m-r-5"
                      type="radio"
                      name="treatment_complete"
                      id="treatment_complete_yes"
                      value="YES"
                      onChange={(e) =>
                        handleFieldChange("completeTreatment", e.target.value)
                      }
                      checked={formData?.completeTreatment === "YES"}
                    />
                    Yes
                  </p>
                  <p className="d-flex">
                    <input
                      className="m-r-5"
                      type="radio"
                      name="treatment_complete"
                      id="treatment_complete_no"
                      value="NO"
                      onChange={(e) =>
                        handleFieldChange("completeTreatment", e.target.value)
                      }
                      checked={formData?.completeTreatment === "NO"}
                    />
                    No
                  </p>
                </div>
                <div className="d-flex  align-items-center">
                  <div className="icon-wrap ic-19 m-l-5 m-r-5">
                    {isTreatmentCompleteVerified?.treatment_complete !==
                    null ? (
                      <i
                        id="isCaseCompleted"
                        className="ic ic-verified ic-19"
                      ></i>
                    ) : (
                      <i
                        id="isCaseCompleted"
                        className="ic ic-unverified ic-19"
                      ></i>
                    )}
                  </div>
                  <button
                    id="isCompleteVerifyBtn"
                    className="btn btn-primary rounded-0 height-25 d-flex justify-content-center align-items-center"
                    style={{ minWidth: "80px", marginRight: "7px" }}
                    onClick={() =>
                      verify_unverify("CaseProviders-treatment_complete")
                    }
                  >
                    {/* {isTreatmentCompleteVerified?.action
                      ? isTreatmentCompleteVerified?.action.toLowerCase() ===
                        "verified"
                        ? "Unverify"
                        : "Verify"
                      : "Verify"} */}
                    {isTreatmentCompleteVerified?.treatment_complete === null
                      ? "Verify"
                      : "Unverify"}
                  </button>
                </div>
              </div>
            </div>
            <div className="col-12 ">
              <div className="bg-grey-100 height-25 d-flex align-items-center justify-content-center text-center">
                <p className="font-italic text-black d-flex align-items-center verification_note">
                  <span id="completeVerificationDate">
                    {/* {isTreatmentCompleteVerified?.action
                      ? isTreatmentCompleteVerified?.action.toLowerCase() ===
                        "verified"
                        ? created_at_format(
                            isTreatmentCompleteVerified?.created_at
                          )
                        : null
                      : null} */}
                    {isTreatmentCompleteVerified?.treatment_complete === null
                      ? null
                      : created_at_format(
                          isTreatmentCompleteVerified?.treatment_complete?.date
                        )}
                  </span>
                  <span className="ic ic-avatar ic-19 has-avatar-icon has-cover-img mx-1">
                    <img src={Avatar} alt="" />
                  </span>
                  <span id="completeVerificationBy">
                    {isTreatmentCompleteVerified?.treatment_complete !== null
                      ? isTreatmentCompleteVerified?.treatment_complete
                          ?.verification_by +
                        " ip: " +
                        isTreatmentCompleteVerified?.treatment_complete
                          ?.ip_address
                      : null}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row ">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center w-100 col-6 p-l-0">
              <label
                // style={{ marginRight: "5px" }}
                for="treatment_date1"
                className="fw-bold mr-1 mb-0"
              >
                Date:
              </label>
              <input
                type="date"
                className="Treatment-page-modal-form-control text-right"
                placeholder="Treatment Date"
                value={treatmentDate}
                onChange={(e) => {
                  handleFieldChange("firstDate", e.target.value);
                  setTreatmentDate(e.target.value);
                }}
              />
            </div>
            <div style={{ paddingLeft: "11px" }} className="col-6 d-flex p-r-0">
              <div className="d-flex align-items-center w-100 m-r-5">
                <label
                  style={{ marginRight: "5px" }}
                  for="treatment_note1"
                  className="fw-bold mr-1 ml-1 mb-0"
                >
                  Note:
                </label>
                <input
                  type="text"
                  placeholder="Treatment Note"
                  className="Treatment-page-modal-form-control p-l-5"
                  value={treatmentNotes}
                  onChange={(e) => {
                    setTreatmentNotes(e.target.value);
                  }}
                />
              </div>
              <div className="d-flex justify-content-end align-items-center height-25 ">
                <button
                  className="btn btn-primary border-no height-25 d-flex align-items-center"
                  onClick={addTreatmentDate}
                >
                  <span className="font-weight-bold pr-2 text-gold margin-b-08">
                    +
                  </span>
                  Treatment Date
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="col-3"> */}

        {/* </div> */}
      </div>

      <div
        style={{ paddingLeft: "16px" }}
        className="row bg-white has-speciality-color-2"
        id="treatment-dates-block-92"
      >
        <div className="d-flex justify-content-start w-100">
          <div className="table-responsive table--no-card overflow-hidden">
            <table className="table table-borderless table-striped table-earning has-specialty-icon">
              <thead>
                <tr id="bg-m-10" className="line-height">
                  <th className="p-t-5 p-b-5 pr-3 btn-primary-lighter-default">
                    MEDICAL PROVIDER
                  </th>
                  <th className="p-t-5 p-b-5 btn-primary-lighter-default">
                    Date
                  </th>
                  <th className="pr-3 p-t-5 p-b-5 btn-primary-lighter-default">
                    Record
                  </th>
                  <th
                    colSpan="2"
                    className="p-t-5 p-b-5 btn-primary-lighter-default"
                  >
                    <div className="d-flex align-items-center notes-section">
                      <span>Treatment Note</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody id="treatment_dates_table">
                {allTreatmentDates?.map((td) => (
                  <TreatmentDatesRow
                    key={td.id}
                    treatmentDate={td}
                    specialitie={specialitie}
                    contact={contact}
                    setAllTreatmentDates={setAllTreatmentDates}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreatmentDate;
