import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import axios from "axios";
import Avatar from "../../../../assets/images/avatar.png";
import { getCaseId, getClientId, getToken } from "../../../../Utils/helper";
import "../NewEditCaseProviderModal.css";
import ContactPanel from "../../../common/ContactPanel";
import CaseProviderModalForm from "./CaseProviderModalForm";
import { formatPanelDate } from "../../../TreatmentPage/utils/helperFn";
import ContactPanelForTreatment from "../../../TreatmentPage/components/ContactPanelForTreatment";

function mixColorWithWhite(hex, percentage) {
  const whitePercentage = (100 - percentage) / 100;

  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);

  // Mix each channel with white
  r = Math.floor(r + (255 - r) * whitePercentage);
  g = Math.floor(g + (255 - g) * whitePercentage);
  b = Math.floor(b + (255 - b) * whitePercentage);

  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

const RecordsPaid = ({
  specialitie,
  formData,
  onChange,
  caseProvider,
  // isRequestRecordVerified,
  // isRequestRecivedVerified,
  // isRecordCostVerified,
  // isRecordPaidVerified,
  verification,
  refetchAllParams,
  generateDoc,
  setStateNewShow,
}) => {
  const origin = process.env.REACT_APP_BACKEND_URL;
  const handleFieldChange = (field, value) => {
    onChange({
      ...formData,
      [field]: value,
    });
  };

  const PanelGenereateButtons = [
    {
      iconClassName: "ic ic-19 ic-generate-document",
      buttonText: "Generate Document",
      className: "p-l-6 p-r-5",
      style: { height: "25px" },
      onClick: (id, name) => {
        generateDoc(id, name);
      },
    },
  ];

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
        console.log("Response:", response.data);
        console.log("verification successful");
        refetchAllParams();
      })
      .catch((error) => {
        console.error("Error posting data:", error);
      });
  }

  function created_at_format(string_date) {
    if (!string_date) return "";
    const date = new Date(string_date);

    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1; // getUTCMonth() is zero-based
    const day = String(date.getUTCDate()).padStart(2, "0"); // Always two digits
    const hours = date.getUTCHours() % 12 || 12; // Convert to 12-hour format
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    const ampm = date.getUTCHours() >= 12 ? "PM" : "AM";

    return `${month}/${day}/${year}, ${hours}:${minutes} ${ampm}`;
  }

  return (
    <>
      <form>
        <div className={`has-speciality-color-${specialitie?.id} row m-0`}>
          <div className="col-4 m-l-0 p-l-5" style={{ maxWidth: "265px" }}>
            <div style={{ width: "fit-content", maxWidth: "265px" }}>
              {/* <div className="d-flex justify-content-start align-items-center"> */}
              <div
                style={{
                  backgroundColor: specialitie?.color,
                  height: "25px",
                  fontSize: "16px",
                  fontWeight: "600",
                  width: "255px",
                  paddingLeft: "5px",
                }}
                className="text-white "
              >
                {specialitie?.name}
              </div>
              <ContactPanelForTreatment
                id={formData?.id}
                panel_name={
                  caseProvider?.record_paid
                    ? `Records Request Paid ${formatPanelDate(caseProvider?.record_paid)}`
                    : "Pay for Records Request"
                }
                className="m-b-5"
                pageName={"treatment"}
                websiteURL={formData?.website}
                dynamic_label={"Company Name"}
                name={formData?.name}
                address1={formData?.address1}
                address2={formData?.address2}
                email={formData?.email}
                phone_number={formData?.phone_number}
                city={formData?.city}
                state={formData?.state}
                zip_code={formData?.zip}
                fax_number={formData?.fax}
                buttonData={PanelGenereateButtons}
                genrate_doc_address="Medical Records Request Payment"
                specialitie={specialitie}
              />
            </div>
          </div>
          <div className="col-7" style={{ minWidth: "calc(100% - 265px)" }}>
            <CaseProviderModalForm
              formData={formData}
              onChange={onChange}
              setStateNewShow={setStateNewShow}
            />
          </div>
        </div>
      </form>
      <div className="row m-0 m-t-5 align-items-end">
        <div className="col-6 p-r-5 p-l-5">
          <div className="row align-items-center form-group">
            <div
              style={{ paddingRight: "18px" }}
              className="col-12 d-flex align-items-center justify-content-between"
            >
              <div className="d-flex align-items-center w-100">
                <p
                  style={{ marginRight: "5px", width: "65px" }}
                  className="d-inline-block text-grey text-right"
                >
                  Ordered:
                </p>
                <input
                  type="date"
                  class="Treatment-page-modal-form-control text-right"
                  name="records_ordered"
                  id="is_record_ordered_date"
                  value={formData.requestOrdered}
                  onChange={(e) =>
                    handleFieldChange("requestOrdered", e.target.value)
                  }
                />
              </div>
              <div
                style={{ width: "116px" }}
                className="d-flex  align-items-center"
              >
                <div className="icon-wrap ic-19 m-l-5 m-r-5">
                  {/* {isRequestRecordVerified?.action ? (
                    isRequestRecordVerified?.action.toLowerCase() ===
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
                  )} */}
                  {verification?.record_ordered !== null ? (
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
                  id="is_request_records_received_verify_btn"
                  class="btn btn-primary rounded-0 height-25 d-flex justify-content-center align-items-center"
                  style={{ minWidth: "80px", marginRight: "7px" }}
                  onClick={() =>
                    verify_unverify("CaseProviders-record_ordered")
                  }
                >
                  {/* {isRequestRecordVerified?.action
                    ? isRequestRecordVerified?.action.toLowerCase() ===
                      "verified"
                      ? "Unverify"
                      : "Verify"
                    : "Verify"} */}
                  {verification?.record_ordered !== null
                    ? "Unverify"
                    : "Verify"}
                </button>
              </div>
            </div>
            <div className="col-12 ">
              <div className="bg-grey-100  height-25 d-flex align-items-center justify-content-center text-center">
                <p className="text-black d-flex align-items-center verification_note">
                  <span className="ic ic-avatar ic-19 has-avatar-icon has-cover-img mx-1">
                    <img src={Avatar} alt="" />
                  </span>
                  <span
                    id="request_records_order_verified_date"
                    className="p-r-5"
                  >
                    {/* {isRequestRecordVerified?.action
                      ? isRequestRecordVerified?.action.toLowerCase() ===
                        "verified"
                        ? created_at_format(isRequestRecordVerified?.created_at)
                        : null
                      : null} */}
                    {verification?.record_ordered !== null
                      ? created_at_format(verification?.record_ordered?.date)
                      : null}
                  </span>

                  <span id="request_records_order_verified_by">
                    {/* {isRequestRecordVerified?.action
                      ? isRequestRecordVerified?.action.toLowerCase() ===
                        "verified"
                        ? isRequestRecordVerified?.verification_by +
                          " ip: " +
                          isRequestRecordVerified?.ip_address
                        : null
                      : null} */}
                    {verification?.record_ordered !== null
                      ? verification?.record_ordered?.verification_by +
                        " ip: " +
                        verification?.record_ordered?.ip_address
                      : null}
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div className="row align-items-center form-group">
            <div
              style={{ paddingRight: "18px" }}
              className="col-12 d-flex align-items-center justify-content-between"
            >
              <div className="d-flex align-items-center w-100">
                <p
                  style={{ marginRight: "5px", width: "65px" }}
                  className="text-right text-grey"
                >
                  Received:
                </p>
                <input
                  type="date"
                  class="Treatment-page-modal-form-control text-right"
                  id="is_record_received_date"
                  name="records_received"
                  value={formData.requestReceived}
                  onChange={(e) =>
                    handleFieldChange("requestReceived", e.target.value)
                  }
                />
              </div>
              <div
                style={{ width: "116px" }}
                className="d-flex justify-content-between  align-items-center"
              >
                <div className="icon-wrap ic-19 m-l-5 m-r-5">
                  {verification?.record_received !== null ? (
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
                  id="is_request_records_received_verify_btn"
                  class="btn btn-primary rounded-0 height-25 d-flex justify-content-center align-items-center"
                  style={{ minWidth: "80px", marginRight: "7px" }}
                  onClick={() =>
                    verify_unverify("CaseProviders-record_received")
                  }
                >
                  {/* {isRequestRecivedVerified?.action
                    ? isRequestRecivedVerified?.action.toLowerCase() ===
                      "verified"
                      ? "Unverify"
                      : "Verify"
                    : "Verify"} */}
                  {verification?.record_received !== null
                    ? "Unverify"
                    : "Verify"}
                </button>
              </div>
            </div>
            <div className="col-12 ">
              <div className="bg-grey-100  height-25 d-flex align-items-center justify-content-center text-center">
                <p className="text-black d-flex align-items-center verification_note">
                  <span className="ic ic-avatar ic-19 has-avatar-icon has-cover-img mx-1">
                    <img src={Avatar} alt="" />
                  </span>
                  <span
                    id="request_records_received_verified_date"
                    className="p-r-5"
                  >
                    {/* {isRequestRecivedVerified?.action
                      ? isRequestRecivedVerified?.action.toLowerCase() ===
                        "verified"
                        ? created_at_format(
                            isRequestRecivedVerified?.created_at
                          )
                        : null
                      : null} */}
                    {verification?.record_received !== null
                      ? created_at_format(verification?.record_received?.date)
                      : null}
                  </span>

                  <span id="request_records_received_verified_by">
                    {/* {isRequestRecivedVerified?.action
                      ? isRequestRecivedVerified?.action.toLowerCase() ===
                        "verified"
                        ? isRequestRecivedVerified?.verification_by +
                          " ip: " +
                          isRequestRecivedVerified?.ip_address
                        : null
                      : null} */}
                    {verification?.record_received !== null
                      ? verification?.record_received?.verification_by +
                        " ip: " +
                        verification?.record_received?.ip_address
                      : null}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-6 p-r-5">
          <div className="row mx-0 align-items-center form-group">
            <div className="col-1 text-left">
              <span className="d-inline-block text-grey">Cost:</span>
            </div>
            <div
              className="col-11 d-flex justify-content-between align-items-center"
              style={{ paddingRight: "3px" }}
            >
              <input
                type="number"
                class="Treatment-page-modal-form-control"
                name="record_cost"
                id="is_request_record_cost"
                placeholder="Enter Cost"
                value={formData.requestCost}
                onChange={(e) =>
                  handleFieldChange("requestCost", e.target.value)
                }
              />
              <div className="d-flex justify-content-between align-items-center">
                <div className="icon-wrap ic-19 m-l-5 m-r-5">
                  {verification?.recordCost !== null ? (
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
                  id="is_request_record_cost_verify_btn"
                  className="btn btn-primary rounded-0 height-25 d-flex justify-content-center align-items-center"
                  style={{ minWidth: "80px", marginRight: "7px" }}
                  onClick={() => verify_unverify("CaseProviders-recordCost")}
                >
                  {/* {isRecordCostVerified?.action
                    ? isRecordCostVerified?.action.toLowerCase() === "verified"
                      ? "Unverify"
                      : "Verify"
                    : "Verify"} */}
                  {verification?.recordCost !== null ? "Unverify" : "Verify"}
                </button>
              </div>
            </div>
            <div className="col-12 pr-0">
              <div className="bg-grey-100  height-25 d-flex align-items-center justify-content-center text-center">
                <p className="text-black d-flex align-items-center verification_note">
                  <span className="ic ic-avatar ic-19 has-avatar-icon has-cover-img mx-1">
                    <img src={Avatar} alt="" />
                  </span>
                  <span
                    id="request_record_cost_verified_date"
                    className="p-r-5"
                  >
                    {/* {isRecordCostVerified?.action
                      ? isRecordCostVerified?.action.toLowerCase() ===
                        "verified"
                        ? created_at_format(isRecordCostVerified?.created_at)
                        : null
                      : null} */}
                    {verification?.recordCost !== null
                      ? created_at_format(verification?.recordCost?.date)
                      : null}
                  </span>

                  <span id="request_record_cost_verified_by">
                    {/* {isRecordCostVerified?.action
                      ? isRecordCostVerified?.action.toLowerCase() ===
                        "verified"
                        ? isRecordCostVerified?.verification_by +
                          " ip: " +
                          isRecordCostVerified?.ip_address
                        : null
                      : null} */}
                    {verification?.recordCost !== null
                      ? verification?.recordCost?.verification_by +
                        " ip: " +
                        verification?.recordCost?.ip_address
                      : null}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="row mx-0 align-items-center form-group">
            <div className="col-1 text-left">
              <span className="d-inline-block text-grey">Paid:</span>
            </div>
            <div className="col-11" style={{ paddingRight: "3px" }}>
              <div className="d-flex justify-content-between align-items-center ">
                <div className="d-flex justify-content-around align-items-center ">
                  <input
                    type="date"
                    class="Treatment-page-modal-form-control text-right"
                    name="record_paid"
                    value={formData.requestPaidTime}
                    onChange={(e) =>
                      handleFieldChange("requestPaidTime", e.target.value)
                    }
                  />
                </div>

                <div className="d-flex justify-content-around align-items-center ">
                  <p className="m-r-5 d-flex">
                    <input
                      className="m-r-5"
                      type="radio"
                      name="record_request_paid"
                      value="YES"
                      id="is_request_record_paid_verify_yes"
                      onChange={(e) =>
                        handleFieldChange("requestPaid", e.target.value)
                      }
                      checked={formData.requestPaid === "YES"}
                    />
                    Yes
                  </p>
                  <p className="d-flex">
                    <input
                      className="m-r-5"
                      type="radio"
                      name="record_request_paid"
                      value="NO"
                      id="is_request_record_paid_verify_no"
                      onChange={(e) =>
                        handleFieldChange("requestPaid", e.target.value)
                      }
                      checked={formData.requestPaid === "NO"}
                    />
                    No
                  </p>
                </div>
                <div className="d-flex  align-items-center">
                  <div className="icon-wrap ic-19 m-l-5 m-r-5">
                    {verification?.rec_request_paid !== null ? (
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
                    id="is_request_record_paid_verify_btn"
                    className="btn btn-primary rounded-0 height-25 d-flex justify-content-center align-items-center"
                    style={{ minWidth: "80px", marginRight: "7px" }}
                    onClick={() =>
                      verify_unverify("CaseProviders-rec_request_paid")
                    }
                  >
                    {/* {isRecordPaidVerified?.action
                      ? isRecordPaidVerified?.action.toLowerCase() ===
                        "verified"
                        ? "Unverify"
                        : "Verify"
                      : "Verify"} */}
                    {verification?.rec_request_paid !== null
                      ? "Unverify"
                      : "Verify"}
                  </button>
                </div>
              </div>
            </div>
            <div className="col-12 pr-0 ">
              <div className="bg-grey-100  height-25 d-flex align-items-center justify-content-center text-center">
                <p className="text-black d-flex align-items-center verification_note">
                  <span className="ic ic-avatar ic-19 has-avatar-icon has-cover-img mx-1">
                    <img src={Avatar} alt="" />
                  </span>
                  <span
                    id="request_record_paid_verified_date"
                    className="p-r-5"
                  >
                    {/* {isRecordPaidVerified?.action
                      ? isRecordPaidVerified?.action.toLowerCase() ===
                        "verified"
                        ? created_at_format(isRecordPaidVerified?.created_at)
                        : null
                      : null} */}
                    {verification?.rec_request_paid !== null
                      ? created_at_format(verification?.rec_request_paid?.date)
                      : null}
                  </span>

                  <span id="request_record_paid_verified_by">
                    {/* {isRecordPaidVerified?.action
                      ? isRecordPaidVerified?.action.toLowerCase() ===
                        "verified"
                        ? isRecordPaidVerified?.verification_by +
                          " ip: " +
                          isRecordPaidVerified?.ip_address
                        : null
                      : null} */}
                    {verification?.rec_request_paid !== null
                      ? verification?.rec_request_paid?.verification_by +
                        " ip: " +
                        verification?.rec_request_paid?.ip_address
                      : null}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RecordsPaid;
