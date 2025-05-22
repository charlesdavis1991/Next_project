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

const LineHolder = ({
  formData,
  onChange,
  caseProvider,
  verification,
  refetchAllParams,
  // isLineHolderBalanceVerified,
  // isLineHolderBalanceConfirmedVerified,
  // onUpdate,
  // updateCall,
  specialitie,
  ref,
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

  // Hasnat
  const [lineHolderBalance, setLineHolderBalance] = useState(
    caseProvider?.final || ""
  );
  console.log(formData);
  const [LineHolderBalanceConfirm, setLineHolderBalanceConfirm] = useState(
    caseProvider?.balance_confirmed
  );

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
        //handleClose()
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
      {/* <input type="text" name="address_block_name" hidden value="lien_holder" />
      <input type="text" name="case_provider_id" hidden /> */}

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
                panel_name={"Lien Holder"}
                className="m-b-5"
                pageName={"treatment"}
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
                websiteURL={formData?.website}
                buttonData={PanelGenereateButtons}
                genrate_doc_address="Medical Provider Lien"
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
            <div className="col-1 text-left">
              <span className="d-inline-block text-grey">Balance:</span>
            </div>
            <div
              style={{ paddingRight: "18px" }}
              className="col-11 d-flex justify-content-between align-items-center "
            >
              <input
                type="number"
                placeholder="Enter Balance"
                class="Treatment-page-modal-form-control m-l-12"
                name="balance"
                id="line_holder_balance_input"
                value={formData.lineHolderBalance}
                onChange={(e) =>
                  handleFieldChange("lineHolderBalance", e.target.value)
                }
              />
              <div
                style={{ width: "116" }}
                className="d-flex justify-content-between align-items-center"
              >
                <div className="icon-wrap ic-19 m-l-5 m-r-5">
                  {verification?.final !== null ? (
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
                  id="is_line_holder_balance_verified_btn"
                  class="btn btn-primary rounded-0 height-25 d-flex justify-content-center align-items-center"
                  style={{ minWidth: "80px", marginRight: "7px" }}
                  onClick={() => verify_unverify("CaseProviders-final")}
                >
                  {/* {isLineHolderBalanceVerified?.action
                    ? isLineHolderBalanceVerified?.action.toLowerCase() ===
                      "verified"
                      ? "Unverify"
                      : "Verify"
                    : "Verify"} */}
                  {verification?.final === null ? "Verify" : "Unverify"}
                </button>
              </div>
            </div>
            <div className="col-12 ">
              <div className="bg-grey-100  height-25 d-flex align-items-center justify-content-center text-center">
                <p className=" text-black d-flex align-items-center verification_note">
                  <span className="ic ic-avatar ic-19 has-avatar-icon has-cover-img mx-1">
                    <img src={Avatar} alt="" />
                  </span>
                  <span
                    id="line_holder_balance_verified_date"
                    className="p-r-5"
                  >
                    {/* {isLineHolderBalanceVerified?.action
                      ? isLineHolderBalanceVerified?.action.toLowerCase() ===
                        "verified"
                        ? created_at_format(
                            isLineHolderBalanceVerified?.created_at
                          )
                        : null
                      : null} */}

                    {verification?.final !== null
                      ? created_at_format(verification?.final?.date)
                      : null}
                  </span>

                  <span id="line_holder_balance_verified_by">
                    {/* {isLineHolderBalanceVerified?.action
                      ? isLineHolderBalanceVerified?.action.toLowerCase() ===
                        "verified"
                        ? isLineHolderBalanceVerified?.verification_by +
                          " ip: " +
                          isLineHolderBalanceVerified?.ip_address
                        : null
                      : null} */}
                    {verification?.final !== null
                      ? verification?.final?.verification_by +
                        " ip: " +
                        verification?.final?.ip_address
                      : null}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-6 p-r-5">
          <div className="row mx-0 align-items-center form-group">
            <div className="col-12 d-flex align-items-center justify-content-between">
              <div className="d-flex justify-content-between align-items-center ">
                <p
                  style={{ marginRight: "5px" }}
                  className="d-inline-block text-grey"
                >
                  Confirmed
                </p>

                <div className="d-flex justify-content-around align-items-center ml-3">
                  <p className="m-r-5 d-flex">
                    <input
                      className="m-r-5"
                      type="radio"
                      name="balance_confirmed"
                      id="is_line_holder_balance_confirmed_yes"
                      value="YES"
                      onChange={(e) =>
                        handleFieldChange(
                          "lineHolderBalanceConfirm",
                          e.target.value
                        )
                      }
                      checked={formData.lineHolderBalanceConfirm === "YES"}
                    />
                    Yes
                  </p>
                  <p className="d-flex">
                    <input
                      className="m-r-5"
                      type="radio"
                      id="is_line_holder_balance_confirmed_no"
                      name="balance_confirmed"
                      value="NO"
                      onChange={(e) =>
                        handleFieldChange(
                          "lineHolderBalanceConfirm",
                          e.target.value
                        )
                      }
                      checked={formData.lineHolderBalanceConfirm === "NO"}
                    />
                    No
                  </p>
                </div>
              </div>
              <div className="d-flex  align-items-center">
                <div className="icon-wrap ic-19 m-l-5 m-r-5">
                  {verification?.balance_confirmed !== null ? (
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
                  id="is_line_holder_balance_confirmed_btn"
                  class="btn btn-primary rounded-0 height-25 d-flex justify-content-center align-items-center"
                  style={{ minWidth: "80px", marginRight: "7px" }}
                  onClick={() =>
                    verify_unverify("CaseProviders-balance_confirmed")
                  }
                >
                  {/* {isLineHolderBalanceConfirmedVerified?.action
                    ? isLineHolderBalanceConfirmedVerified?.action.toLowerCase() ===
                      "verified"
                      ? "Unverify"
                      : "Verify"
                    : "Verify"} */}
                  {verification?.balance_confirmed === null
                    ? "Verify"
                    : "Unverify"}
                </button>
              </div>
            </div>
            <div className="col-12 pr-0 ">
              <div className="bg-grey-100  height-25 d-flex align-items-center justify-content-center text-center">
                <p className=" text-black d-flex align-items-center verification_note">
                  <span className="ic ic-avatar ic-19 has-avatar-icon has-cover-img mx-1">
                    <img src={Avatar} alt="" />
                  </span>
                  <span
                    id="line_holder_balance_confirmed_date"
                    className="p-r-5"
                  >
                    {/* {isLineHolderBalanceConfirmedVerified?.action
                      ? isLineHolderBalanceConfirmedVerified?.action.toLowerCase() ===
                        "verified"
                        ? created_at_format(
                            isLineHolderBalanceConfirmedVerified?.created_at
                          )
                        : null
                      : null} */}

                    {verification?.balance_confirmed === null
                      ? null
                      : created_at_format(
                          verification?.balance_confirmed?.date
                        )}
                  </span>

                  <span id="line_holder_balance_confirmed_by">
                    {verification?.balance_confirmed !== null
                      ? verification?.balance_confirmed?.verification_by +
                        " ip: " +
                        verification?.balance_confirmed?.ip_address
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

export default LineHolder;
