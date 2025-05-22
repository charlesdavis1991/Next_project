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

const BillsRecieved = ({
  formData,
  onChange,
  specialitie,
  caseProvider,
  verification,
  refetchAllParams,
  // isRequestBillingVerified,
  // isReceivedBillingVerified,
  // isBillingCostVerified,
  // isBillingPaidVerified,
  generateDoc,
  setStateNewShow,
}) => {
  const origin = process.env.REACT_APP_BACKEND_URL;

  const formatPanelDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
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

  const handleBillingChange = (field, value) => {
    onChange({
      ...formData,
      [field]: value,
    });
  };

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

  console.log(caseProvider, "billing_paid");
  return (
    <>
      <form>
        <div className={`has-speciality-color-${specialitie?.id} row m-0`}>
          <div className="col-4 m-l-0 p-l-5" style={{ maxWidth: "265px" }}>
            <div style={{ width: "fit-content", maxWidth: "265px" }}>
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
                  caseProvider?.billing_ordered
                    ? `Billing Ordered  ${formatPanelDate(caseProvider?.billing_ordered)}`
                    : "Request Billing"
                }
                className="m-b-5"
                pageName={"treatment"}
                websiteURL={formData?.website}
                name={formData?.name}
                address1={formData?.address1}
                address2={formData?.address2}
                email={formData?.email}
                city={formData?.city}
                state={formData?.state}
                zip_code={formData?.zip}
                phone_number={formData?.phone_number}
                fax_number={formData?.fax}
                buttonData={PanelGenereateButtons}
                genrate_doc_address="Medical Billing Request"
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
        <div className="col-6 p-l-5 p-r-5">
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
                  name="billing_ordered"
                  id="is_request_billing_ordered_date"
                  value={formData.billingOrdered}
                  onChange={(e) =>
                    handleBillingChange("billingOrdered", e.target.value)
                  }
                />
              </div>
              <div
                style={{ width: "116px" }}
                className="d-flex justify-content-between align-items-center"
              >
                <div className="icon-wrap ic-19 m-l-5 m-r-5">
                  {verification?.billing_ordered !== null ? (
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
                  id="is_request_billing_recived_verified_btn"
                  className="btn btn-primary rounded-0 height-25 d-flex justify-content-center align-items-center"
                  style={{ minWidth: "80px", marginRight: "7px" }}
                  onClick={() =>
                    verify_unverify("CaseProviders-billing_ordered")
                  }
                >
                  {/* {isRequestBillingVerified?.action
                    ? isRequestBillingVerified?.action.toLowerCase() ===
                      "verified"
                      ? "Unverify"
                      : "Verify"
                    : "Verify"} */}
                  {verification?.billing_ordered !== null
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
                    id="request_billing_recived_verified_date"
                    className="p-r-5"
                  >
                    {/* {isRequestBillingVerified?.action
                      ? isRequestBillingVerified?.action.toLowerCase() ===
                        "verified"
                        ? created_at_format(
                            isRequestBillingVerified?.created_at
                          )
                        : null
                      : null} */}
                    {verification?.billing_ordered !== null
                      ? created_at_format(verification?.billing_ordered?.date)
                      : null}
                  </span>

                  <span id="request_billing_recived_verified_by">
                    {/* {isRequestBillingVerified?.action
                      ? isRequestBillingVerified?.action.toLowerCase() ===
                        "verified"
                        ? isRequestBillingVerified?.verification_by +
                          " ip: " +
                          isRequestBillingVerified?.ip_address
                        : null
                      : null} */}
                    {verification?.billing_ordered !== null
                      ? verification?.billing_ordered?.verification_by +
                        " ip:" +
                        verification?.billing_ordered?.ip_address
                      : null}
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div className="row align-items-center form-group">
            <div
              style={{ paddingRight: "18px" }}
              className="col-12 d-flex align-items-center justify-content-between "
            >
              <div className="d-flex align-items-center w-100">
                <p
                  style={{ marginRight: "5px", width: "65px" }}
                  className="text-right text-grey"
                >
                  Received:
                </p>
                {/* </div> */}
                {/* <div className="col-11 d-flex align-items-center justify-content-between "> */}
                <input
                  type="date"
                  class="Treatment-page-modal-form-control text-right"
                  name="billing_received"
                  id="is_request_billing_received_date"
                  value={formData.billingReceived}
                  onChange={(e) =>
                    handleBillingChange("billingReceived", e.target.value)
                  }
                />
              </div>
              <div
                style={{ width: "116px" }}
                className="d-flex justify-content-between align-items-center"
              >
                <div className="icon-wrap ic-19 m-l-5 m-r-5">
                  {verification?.billing_received !== null ? (
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
                  id="is_request_billing_recived_verified_btn"
                  className="btn btn-primary rounded-0 height-25 d-flex justify-content-center align-items-center"
                  style={{ minWidth: "80px", marginRight: "7px" }}
                  onClick={() =>
                    verify_unverify("CaseProviders-billing_received")
                  }
                >
                  {/* {isReceivedBillingVerified?.action
                    ? isReceivedBillingVerified?.action.toLowerCase() ===
                      "verified"
                      ? "Unverify"
                      : "Verify"
                    : "Verify"} */}
                  {verification?.billing_received !== null
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
                    id="request_billing_recived_verified_date"
                    className="p-r-5"
                  >
                    {/* {isReceivedBillingVerified?.action
                      ? isReceivedBillingVerified?.action.toLowerCase() ===
                        "verified"
                        ? created_at_format(
                            isReceivedBillingVerified?.created_at
                          )
                        : null
                      : null} */}
                    {verification?.billing_received !== null
                      ? created_at_format(verification?.billing_received?.date)
                      : null}
                  </span>

                  <span id="request_billing_recived_verified_by">
                    {/* {isReceivedBillingVerified?.action
                      ? isReceivedBillingVerified?.action.toLowerCase() ===
                        "verified"
                        ? isReceivedBillingVerified?.verification_by +
                          "ip:" +
                          isReceivedBillingVerified?.ip_address
                        : null
                      : null} */}
                    {verification?.billing_received !== null
                      ? verification?.billing_received?.verification_by +
                        " ip:" +
                        verification?.billing_received?.ip_address
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
              <span className="d-inline-block text-grey">
                <nobr>Cost:</nobr>
              </span>
            </div>
            <div
              className="col-11 d-flex justify-content-between align-items-center"
              style={{ paddingRight: "3px" }}
            >
              <input
                type="number"
                class="Treatment-page-modal-form-control"
                name="bills_cost"
                id="request_billing_cost"
                placeholder="Enter Cost"
                value={formData.billingCost}
                onChange={(e) =>
                  handleBillingChange("billingCost", e.target.value)
                }
              />
              <div className="d-flex  align-items-center">
                <div className="icon-wrap ic-19 m-l-5 m-r-5">
                  {verification?.billsCost !== null ? (
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
                  id="bills_cost_verify_btn"
                  className="btn btn-primary rounded-0 height-25 d-flex justify-content-center align-items-center"
                  style={{ minWidth: "80px", marginRight: "7px" }}
                  onClick={() => verify_unverify("CaseProviders-billsCost")}
                >
                  {/* {isBillingCostVerified?.action
                    ? isBillingCostVerified?.action.toLowerCase() === "verified"
                      ? "Unverify"
                      : "Verify"
                    : "Verify"} */}
                  {verification?.billsCost !== null ? "Unverify" : "Verify"}
                </button>
              </div>
            </div>
            <div className="col-12 pr-0 ">
              <div className="bg-grey-100  height-25 d-flex align-items-center justify-content-center text-center">
                <p className="text-black d-flex align-items-center verification_note">
                  <span className="ic ic-avatar ic-19 has-avatar-icon has-cover-img mx-1">
                    <img src={Avatar} alt="" />
                  </span>
                  <span
                    id="request_billing_recived_verified_date"
                    className="p-r-5"
                  >
                    {/* {isBillingCostVerified?.action
                      ? isBillingCostVerified?.action.toLowerCase() ===
                        "verified"
                        ? created_at_format(isBillingCostVerified?.created_at)
                        : null
                      : null} */}
                    {verification?.billsCost !== null
                      ? created_at_format(verification?.billsCost?.date)
                      : null}
                  </span>

                  <span id="request_billing_recived_verified_by">
                    {/* {isBillingCostVerified?.action
                      ? isBillingCostVerified?.action.toLowerCase() ===
                        "verified"
                        ? isBillingCostVerified?.verification_by +
                          " ip: " +
                          isBillingCostVerified?.ip_address
                        : null
                      : null} */}
                    {verification?.billsCost !== null
                      ? verification?.billsCost?.verification_by +
                        " ip: " +
                        verification?.billsCost?.ip_address
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
                    name="billing_paid"
                    value={formData.billingPaidTime}
                    id="bills_coast_paid_at"
                    onChange={(e) =>
                      handleBillingChange("billingPaidTime", e.target.value)
                    }
                  />
                </div>
                <div className="d-flex justify-content-around align-items-center ">
                  <p className="m-r-5 d-flex">
                    <input
                      key={formData?.billingPaid} // Force re-render when state changes
                      className="m-r-5"
                      type="radio"
                      name="bills_request_paid_yes"
                      value="YES"
                      // id="bills_coast_paid_yes"
                      onChange={(e) =>
                        handleBillingChange("billingPaid", e.target.value)
                      }
                      checked={formData.billingPaid === "YES"}
                    />
                    Yes
                  </p>
                  <p className="d-flex">
                    <input
                      key={formData?.billingPaid} // Force re-render when state changes
                      className="m-r-5"
                      type="radio"
                      name="bills_request_paid_no"
                      value="NO"
                      // id="bills_coast_paid_no"
                      onChange={(e) =>
                        handleBillingChange("billingPaid", e.target.value)
                      }
                      checked={formData.billingPaid === "NO"}
                    />
                    No
                  </p>
                </div>
                <div className="d-flex  align-items-center">
                  <div className="icon-wrap ic-19 m-l-5 m-r-5">
                    {verification?.bills_request_paid !== null ? (
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
                    id="is_bills_request_paid_verified_btn"
                    className="btn btn-primary rounded-0 height-25 d-flex justify-content-center align-items-center"
                    style={{ minWidth: "80px", marginRight: "7px" }}
                    onClick={() =>
                      verify_unverify("CaseProviders-bills_request_paid")
                    }
                  >
                    {/* {isBillingPaidVerified?.action
                      ? isBillingPaidVerified?.action.toLowerCase() ===
                        "verified"
                        ? "Unverify"
                        : "Verify"
                      : "Verify"} */}
                    {verification?.bills_request_paid !== null
                      ? "Unverify"
                      : "Verify"}
                  </button>
                </div>
              </div>
            </div>
            <div className="col-12 pr-0">
              <div className="bg-grey-100  height-25 d-flex align-items-center justify-content-center text-center">
                <p className="text-black d-flex align-items-center verification_note">
                  <span className="ic ic-avatar ic-19 has-avatar-icon has-cover-img mx-1">
                    <img src={Avatar} alt="" />
                  </span>
                  <span
                    id="request_billing_recived_verified_date"
                    className="p-r-5"
                  >
                    {/* {isBillingPaidVerified?.action
                      ? isBillingPaidVerified?.action.toLowerCase() ===
                        "verified"
                        ? created_at_format(isBillingPaidVerified?.created_at)
                        : null
                      : null} */}
                    {verification?.bills_request_paid !== null
                      ? created_at_format(
                          verification?.bills_request_paid?.date
                        )
                      : null}
                  </span>

                  <span id="request_billing_recived_verified_by">
                    {/* {isBillingPaidVerified?.action
                      ? isBillingPaidVerified?.action.toLowerCase() ===
                        "verified"
                        ? isBillingPaidVerified?.verification_by +
                          " ip: " +
                          isBillingPaidVerified?.ip_address
                        : null
                      : null} */}
                    {verification?.bills_request_paid !== null
                      ? verification?.bills_request_paid?.verification_by +
                        " ip: " +
                        verification?.bills_request_paid?.ip_address
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
export default BillsRecieved;
