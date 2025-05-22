import React, { useState } from "react";
import "./AccountsRow.css";
import { useDocumentModal } from "../common/CustomModal/CustomModalContext";
import { useUpdateTrigger } from "./TriggerUpdateContext";
import { useCheckRequestModal } from "./CheckRequestModalContext";
import { useAlertCheckNotRequestedModal } from "./AlertCheckNotRequestedModalContext";
import { useCostManagement } from "./AccountsManagementContext";
import { useDropzone } from "react-dropzone";
import {
  checkClearedIconDetails,
  checkSentIconDetails,
  checkVerifyIconDetails,
} from "../CostDashboard/IconDetails";
import { currencyFormat, mediaRoute } from "../../Utils/helper";
import EditCheckModal from "./EditCheckModal";
import { api_without_cancellation } from "../../api/api";
import { useDispatch, useSelector } from "react-redux";
import { getCaseId, getClientId } from "../../Utils/helper";
import DocumentUploadModal from "../Modals/documentUploadModal";

const RequestCheckButton = ({ cost, showModal, fetchAccountsData }) => (
  <button
    style={{
      boxSizing: "border-box",
      fontSize: "14px",
      paddingTop: "0px",
      paddingBottom: "0px",
      paddingLeft: "5px",
      paddingRight: "5px",
      height: "25px",
      backgroundColor: "var(--primary)",
      color: "white",
      display: "flex",
      alignItems: "center",
      margin: "auto",
    }}
    type="button"
    onClick={(e) => {
      e.stopPropagation();
      showModal({
        clientId: cost.for_client,
        caseId: cost.for_case,
        costId: cost.id,
        payee: cost.payee,
        amount: cost.amount,
        invoice_number: cost.invoice_number,
        memo: cost.memo,
      });
    }}
  >
    Request Check
  </button>
);

const StyledTableCell = ({ children, className, ...props }) => (
  <td className={`cost-cell ${className || ""}`} {...props}>
    {children}
  </td>
);

function formatDateFromString(dateString) {
  // Convert the date string to a Date object
  if (!dateString) return "";
  const dateObject = new Date(dateString);

  // Get the month, day, and year
  const month = dateObject.getMonth() + 1; // months are 0-indexed
  const day = dateObject.getDate();
  const year = dateObject.getFullYear();

  // Format the date to "MM/DD/YYYY"
  const formattedDate = `${month}/${day}/${year}`;

  // Remove leading zero from month and day
  const cleanedDate = formattedDate.replace(/^0+/g, ""); // Remove leading zero from month and day if exists

  return cleanedDate;
}

// Example usage:

const AccountsTableRow = ({
  cost,
  slotDetails,
  idx = 0,
  fetchAccountsData,
}) => {
  const isProduction = process.env.NODE_ENV === "production";
  const origin =
    process.env.REACT_APP_BACKEND_URL || "https://dev.simplefirm.com";
  const [uploaded, setUploaded] = useState(false);
  const { showDocumentModal } = useDocumentModal();
  const { toggleTriggerUpdate } = useUpdateTrigger();
  const { showModal: showCheckRequestModal } = useCheckRequestModal();
  const { showModal: showAlertCheckNotRequestedModal } =
    useAlertCheckNotRequestedModal();
  const [showModal, showEditCostModal] = useState(false);

  const [uploadFile, setUploadFile] = useState("");
  const [fileUploadModal, setFileUploadModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onHide = () => {
    showEditCostModal(false);
  };
  const page_id_click_record = useSelector(
    (state) => state.page_id_click_record.page_id_click_record
  );

  const uploadAndAttachDocument = async (
    acceptedFiles,
    cost,
    slotDetails,
    toggleTriggerUpdate,
    documentType = "check_sent"
  ) => {
    if (!acceptedFiles.length) return; // Ensure there's at least one file to upload
    setUploadFile(acceptedFiles?.map((file) => file.name));
    setFileUploadModal(true);
    uploadDoc(acceptedFiles[0], documentType);
    // const formData = new FormData();
    // formData.append("file0", acceptedFiles[0]);
    // formData.append("number_of_files", 1);

    // formData.append("client_id", cost.for_client);
    // formData.append("case_id", cost.for_case);

    // try {
    //   const uploadResponse = await api.post(`/api/upload/doc/`, formData, {
    //     headers: {
    //       "Content-Type": "multipart/form-data",
    //     },
    //   });
    //   console.log("File uploaded successfully", uploadResponse.data);

    //   const attachData = {
    //     doc_id: uploadResponse.data?.docId || "",
    //     page_id: slotDetails?.page?.id || "",
    //     case_id: cost.for_case || "",
    //     document_type: documentType,
    //   };

    //   const attachResponse = await api.post(
    //     `/api/attach-document/${cost.id}/`,
    //     attachData,
    //     {
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //     }
    //   );
    //   console.log("Document attached successfully", attachResponse.data);
    // toggleTriggerUpdate();
    //   return attachResponse.data;
    // } catch (error) {
    //   console.error("Error in file upload or document attachment", error);
    //   throw error;
    // }
  };

  const uploadDoc = async (file, check_type) => {
    try {
      // const response = await api_without_cancellation.get(
      //   origin +
      //   `/api/documents/get-courtforms/?client_id=${getClientId()}&case_id=${getCaseId()}`
      // );

      const formData = new FormData();
      formData.append("file", file);
      formData.append("slotId", "");
      formData.append("panelId", "-1");
      formData.append("pageId", page_id_click_record);

      await api_without_cancellation
        .post(
          origin + `/api/upload_doc/${getClientId()}/${getCaseId()}/`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(percentCompleted);
            },
          }
        )
        .then((res) => {
          const docId = res.data.docId;
          attachCheckDoc(check_type, docId);
        })
        .catch((err) => {
          console.error("Failed to fetch Litigation Data:", err);
        });
    } catch (error) {
      console.error("Failed to fetch Litigation Data:", error);
    } finally {
      setFileUploadModal(false);
    }
  };

  const attachCheckDoc = async (document_type, docId) => {
    try {
      // const response = await api_without_cancellation.get(
      //   origin +
      //   `/api/documents/get-courtforms/?client_id=${getClientId()}&case_id=${getCaseId()}`
      // );

      const payload = {
        check_id: cost?.id,
        document_type: document_type,
        page_id: page_id_click_record,
        case_id: getCaseId(),
        panel_id: "-1",
        doc_id: docId,
        panels: "False",
      };

      const response = await api_without_cancellation.post(
        origin + `/api/accounting-page/attach-check-doc/`,
        payload
      );
      if (response.status == 200) {
        fetchAccountsData();
      }
    } catch (error) {
      console.error("Failed to fetch Litigation Data:", error);
    }
  };

  const onDropCheckSent = React.useCallback((acceptedFiles, e) => {
    uploadAndAttachDocument(
      acceptedFiles,
      cost,
      slotDetails,
      toggleTriggerUpdate,
      "check_as_sent"
    )
      .then((data) => {
        console.log("check data uploaded");
      })
      .catch((err) => console.error(err));
    e.stopPropagation();
  }, []);
  const onDropCheckCleared = React.useCallback((acceptedFiles, e) => {
    uploadAndAttachDocument(
      acceptedFiles,
      cost,
      slotDetails,
      toggleTriggerUpdate,
      "check_cleared"
    )
      .then((data) => {
        console.log("check data uploaded");
      })
      .catch((err) => console.error(err));
    e.stopPropagation();
  }, []);
  const onDropCheckVerify = React.useCallback((acceptedFiles, e) => {
    uploadAndAttachDocument(
      acceptedFiles,
      cost,
      slotDetails,
      toggleTriggerUpdate,
      "verify"
    )
      .then((data) => {
        console.log("check data uploaded");
      })
      .catch((err) => console.error(err));
    e.stopPropagation();
  }, []);
  const onDropInvoice = React.useCallback((acceptedFiles, e) => {
    uploadAndAttachDocument(
      acceptedFiles,
      cost,
      slotDetails,
      toggleTriggerUpdate,
      "invoice"
    )
      .then((data) => {
        console.log("check data uploaded");
      })
      .catch((err) => console.error(err));
    e.stopPropagation();
  }, []);

  const {
    getRootProps: getRootPropsCheckSent,
    getInputProps: getInputPropsCheckSent,
  } = useDropzone({
    onDrop: onDropCheckSent,
  });
  const {
    getRootProps: getRootPropsCheckCleared,
    getInputProps: getInputPropsCheckCleared,
  } = useDropzone({
    onDrop: onDropCheckCleared,
  });
  const {
    getRootProps: getRootPropsCheckVerify,
    getInputProps: getInputPropsCheckVerify,
  } = useDropzone({
    onDrop: onDropCheckVerify,
  });
  const {
    getRootProps: getRootPropsInvoice,
    getInputProps: getInputPropsInvoice,
  } = useDropzone({
    onDrop: onDropInvoice,
  });

  const renderUploadIconWithDropzone = (iconDetails, documentType) => {
    const { url, alt } = iconDetails;
    switch (documentType) {
      case "check_sent":
        return (
          <div {...getRootPropsCheckSent()} className="dropzone-wrapper">
            <input {...getInputPropsCheckSent()} />
            <img src={url} alt={alt} className="height-i-25 dz-clickable" />
          </div>
        );
      case "check_cleared":
        return (
          <div {...getRootPropsCheckCleared()} className="dropzone-wrapper">
            <input {...getInputPropsCheckCleared()} />
            <img src={url} alt={alt} className="height-i-25 dz-clickable" />
          </div>
        );
      case "verify":
        return (
          <div {...getRootPropsCheckVerify()} className="dropzone-wrapper">
            <input {...getInputPropsCheckVerify()} />
            <img
              src={url}
              alt={alt}
              className="height-i-25  gray-scale-1 dz-clickable"
            />
          </div>
        );
      case "invoice":
        return (
          <div {...getRootPropsInvoice()} className="dropzone-wrapper">
            <input {...getInputPropsInvoice()} />
            <img
              src={url}
              alt={alt}
              className="height-i-25 gray-scale-1 dz-clickable"
            />
          </div>
        );
    }
  };
  const calculateAge = (birthday) => {
    const birthDate = new Date(birthday); // Create a Date object for the birthdate
    const currentDate = new Date();
    let age = currentDate.getFullYear() - birthDate.getFullYear(); // Initial age difference

    // Adjust if birthday hasn't occurred yet this year
    const monthDiff = currentDate.getMonth() - birthDate.getMonth();
    const dayDiff = currentDate.getDate() - birthDate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--; // Subtract 1 if the birthday hasn't happened yet this year
    }

    return age;
  };

  const renderCheckIcon = (iconDetails, cost) => {
    const {
      checkIconType,
      checkNotRequestedIcon,
      checkUploadIcon,
      checkUploadedIcon,
    } = iconDetails;

    if (uploaded) {
      return (
        <img
          src={checkUploadedIcon.url}
          alt={checkUploadedIcon.alt}
          className="height-i-25"
        />
      );
    } else if (cost[checkIconType] === null) {
      return renderUploadIconWithDropzone(checkUploadIcon, checkIconType);
    } else {
      return (
        <img
          src={checkUploadedIcon.url}
          alt={checkUploadedIcon.alt}
          className="height-i-25"
          onClick={
            () =>
              showDocumentModal(
                "document",
                mediaRoute(cost[checkIconType].upload),
                cost[checkIconType]
              )
            // showDocumentModal(
            //   `${cost.checkID[checkIconType].upload}`,
            //   cost.checkID[checkIconType]
            // )
          }
        />
      );
    }
  };

  return (
    <>
      <tr
        style={{
          height: "25px",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          cursor: "default",
        }}
        className="cost-row"
        onClick={() => {
          showEditCostModal(true);
        }}
      >
        <StyledTableCell className={`td-autosize`}>{idx + 1}</StyledTableCell>
        <StyledTableCell
          style={{ fontWeight: 600 }}
          className={`td-autosize align-left  text-center p-x-10`}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: "0 20px",
              padding: "0 5px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                class="icon-container"
                style={{
                  display: "flex",
                  height: "19px",
                  width: "19px",
                  marginRight: "4px",
                }}
              >
                {cost?.for_case?.for_client?.profile_pic_29p ? (
                  <img
                    className="client_profile_image_63"
                    src={cost?.for_case?.for_client?.profile_pic_29p}
                    alt="John Doe"
                  />
                ) : (
                  <i className="ic ic-client-avatar h-100 w-100"></i>
                )}
                <div class="border-overlay"></div>
              </div>
              {cost?.for_case?.for_client?.first_name}{" "}
              {cost?.for_case?.for_client?.last_name}
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                style={{ height: "15px", width: "15px", marginRight: "4px" }}
                src={
                  isProduction
                    ? "/c73278d64b4a4810f874.svg"
                    : "/f71f109835fdf08954d4.svg"
                }
                alt={"Accepted date"}
              />
              {cost?.for_case?.for_client?.birthday} &nbsp;
              <span class="label text-primary-50 mr-1">Age</span>
              {calculateAge(cost?.for_case?.for_client?.birthday)}
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                style={{ height: "15px", width: "15px", marginRight: "4px" }}
                src={
                  "https://simplefirm-bucket.s3.amazonaws.com/static/images/car-accident-icon-color_Wgzt9S5.svg"
                }
                alt={"car accident"}
              />
              {cost?.for_case?.case_type?.name}
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                style={{ height: "15px", width: "15px", marginRight: "4px" }}
                src={
                  isProduction
                    ? "/b14998c1ad969183c291.svg"
                    : "/397c64fedf587e037f7f.svg"
                }
                alt={"Accepted date"}
              />
              {formatDateFromString(cost?.cheque_date)}
            </div>
          </div>
        </StyledTableCell>
        <StyledTableCell
          style={{ height: "auto" }}
          className={`td-autosize align-left p-x-10`}
        >
          <p style={{ paddingLeft: "23px", textAlign: "left" }}>
            {formatDateFromString(cost?.date_requested)}
          </p>
          {cost?.check_requested_by ? (
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                class="icon-container"
                style={{
                  display: "flex",
                  height: "19px",
                  width: "19px",
                  marginRight: "4px",
                }}
              >
                {cost?.check_requested_by?.profile_pic ? (
                  <img
                    className="client_profile_image_63"
                    src={cost?.check_requested_by?.profile_pic}
                    alt="John Doe"
                  />
                ) : (
                  <i className="ic ic-client-avatar h-100 w-100"></i>
                )}{" "}
                <div class="border-overlay"></div>
              </div>
              {`${cost?.check_requested_by?.first_name} ${cost?.check_requested_by?.last_name}`}
            </div>
          ) : null}
        </StyledTableCell>
        <StyledTableCell
          className={`td-autosize align-left  text-center p-x-10`}
        >
          {cost?.bank_account?.account_name}
        </StyledTableCell>
        <StyledTableCell
          className={`td-autosize align-left  text-center p-x-10`}
        >
          {cost.payee}
        </StyledTableCell>
        <StyledTableCell
          style={{ minWidth: "150px" }}
          className={`align-left text-center white-space-no p-x-10`}
        >
          -{cost.memo}
        </StyledTableCell>
        <StyledTableCell
          className={`monospace-font text-right td-autosize`}
        >
          <p
            style={{
              fontWeight: 600,
              color: cost.cost_data?.amount == 0 ? "var(--primary-40)" : "#000",
              width: "111.15px",
              minWidth: "111.15px",
            }}
          >
            {cost.cost_data?.amount && currencyFormat(cost.cost_data?.amount)}
          </p>
        </StyledTableCell>

        <StyledTableCell
          style={{ width: "59.9px", maxWidth: "59.9px", minWidth: "59.9px" }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {renderCheckIcon(checkVerifyIconDetails, cost)}
        </StyledTableCell>
        <StyledTableCell
          className={'td-autosize'}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <p
            className={`monospace-font text-right`}
            style={{
              fontWeight: 600,
              marginBottom: "6px",
              color: cost.amount == 0 ? "var(--primary-40)" : "#000",
            }}
            >
            {currencyFormat(cost.amount)}
          </p>
          <p
            style={{ fontSize: "14px", textAlign: "center", minHeight: "21px" }}
          >
            {cost?.cheque_number}
          </p>
        </StyledTableCell>
        <StyledTableCell
          className={"td-autosize"}
          style={{ textAlign: "center" }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <p
            style={{
              width: "87.82px",
              fontSize: "14px",
              margin: "0 auto 5px auto",
            }}
          >
            {formatDateFromString(cost?.cheque_date)}
          </p>
          {renderCheckIcon(checkSentIconDetails, cost)}
        </StyledTableCell>
        <StyledTableCell
          style={{ width: "87.82px", minWidth: "87.82px", textAlign: "center" }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <p
            style={{ width: "87.82px", fontSize: "14px", margin: "0 auto 5px" }}
          >
            {formatDateFromString(cost?.cleared_date)}
          </p>
          {renderCheckIcon(checkClearedIconDetails, cost)}
        </StyledTableCell>
      </tr>
      {showModal && (
        <EditCheckModal
          onHide={onHide}
          isVisible={showModal}
          check={cost}
          fetchAccountsData={fetchAccountsData}
        />
      )}
      {fileUploadModal && (
        <DocumentUploadModal
          uploadFile={uploadFile}
          uploadProgress={uploadProgress}
          show={fileUploadModal}
          onHide={() => setFileUploadModal(false)}
        />
      )}
    </>
  );
};

export default React.memo(AccountsTableRow);
