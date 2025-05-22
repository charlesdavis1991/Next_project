import React from "react";
import { currencyFormat, formatDate } from "../../Utils/helper";
import "./CostRow.css";
import { useCheckRequestModal } from "./CheckRequestModalContext";
import { useAlertCheckNotRequestedModal } from "./AlertCheckNotRequestedModalContext";
import { useDropzone } from "react-dropzone";
import { mediaRoute } from "../../Utils/helper";
import api from "../../api/api";
import { useCostManagement } from "./CostManagementContext";
import { useDocumentModal } from "../common/CustomModal/CustomModalContext";
import { useUpdateTrigger } from "./TriggerUpdateContext";
import {
  checkClearedIconDetails,
  checkSentIconDetails,
  checkVerifyIconDetails,
  invoiceIconDetails,
} from "./IconDetails";
// import avatarImage from "./../../../assets/images/avatar.svg";
import avatarImage from "./../../assets/images/avatar.svg";

const RequestCheckButton = ({ cost, showModal }) => (
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

async function uploadAndAttachDocument(
  acceptedFiles,
  cost,
  slotDetails,
  toggleTriggerUpdate,
  documentType = "check_sent"
) {
  if (!acceptedFiles.length) return; // Ensure there's at least one file to upload

  const formData = new FormData();
  formData.append("file0", acceptedFiles[0]);
  formData.append("number_of_files", 1);

  formData.append("client_id", cost.for_client);
  formData.append("case_id", cost.for_case);

  try {
    const uploadResponse = await api.post(`/api/upload/doc/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("File uploaded successfully", uploadResponse.data);

    const attachData = {
      doc_id: uploadResponse.data?.docId || "",
      page_id: slotDetails?.page?.id || "",
      case_id: cost.for_case || "",
      document_type: documentType,
    };

    const attachResponse = await api.post(
      `/api/attach-document/${cost.id}/`,
      attachData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Document attached successfully", attachResponse.data);
    toggleTriggerUpdate();
    return attachResponse.data;
  } catch (error) {
    console.error("Error in file upload or document attachment", error);
    throw error;
  }
}

const CostTableRow = ({ cost, slotDetails, idx = 0 }) => {

  const origin = process.env.REACT_APP_BACKEND_URL || "https://dev.simplefirm.com";
  const node_env = process.env.NODE_ENV;
  const media_origin =
    node_env === "production" ? "" : process.env.REACT_APP_BACKEND_URL;
  const { showDocumentModal } = useDocumentModal();
  const { toggleTriggerUpdate } = useUpdateTrigger();
  const { showModal: showCheckRequestModal } = useCheckRequestModal();
  const { showModal: showAlertCheckNotRequestedModal } =
    useAlertCheckNotRequestedModal();
  const { showModal: showEditCostModal } = useCostManagement();
  const onDropCheckSent = React.useCallback((acceptedFiles, e) => {
    uploadAndAttachDocument(
      acceptedFiles,
      cost,
      slotDetails,
      toggleTriggerUpdate,
      "check_sent"
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
  const renderCheckIcon = (iconDetails, cost) => {
    const {
      checkIconType,
      checkNotRequestedIcon,
      checkUploadIcon,
      checkUploadedIcon,
    } = iconDetails;

    if (!cost.checkID || Object.keys(cost.checkID).length === 0) {
      return (
        <img
          src={checkNotRequestedIcon.url}
          alt={checkNotRequestedIcon.alt}
          className="height-i-25 gray-scale-1"
          onClick={(e) => {
            e.stopPropagation();
            showAlertCheckNotRequestedModal();
          }}
        />
      );
    } else if (cost.checkID[checkIconType] === null) {
      return renderUploadIconWithDropzone(checkUploadIcon, checkIconType);
    } else {
      return (
        <img
          src={checkUploadedIcon.url}
          alt={checkUploadedIcon.alt}
          className="height-i-25"
          onClick={() =>
            showDocumentModal("document", mediaRoute(cost.checkID[checkIconType].upload), cost.checkID[checkIconType])
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
    <tr
      style={{
        height: "25px",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
      }}
      className="cost-row"
      onClick={() => {
        showEditCostModal(cost, true);
      }}
    >
      <StyledTableCell className={`td-autosize`}>{idx + 1}</StyledTableCell>
      <StyledTableCell className={`td-autosize align-left  text-center p-x-10`}>
        {cost.cost_type}
      </StyledTableCell>
      {cost.paid_by === "Credit Card" ? (
        <StyledTableCell
          className={`td-autosize text-center no-wrap`}
          colSpan={2}
        >
          <span>Credit Card</span>
        </StyledTableCell>
      ) : cost.checkID ? (
        <>
          <StyledTableCell>
            <p style={{ paddingLeft: '27px', textAlign: 'left' }}>{formatDate(cost.checkID.date_requested)}</p>
            <div className="td-autosize hover-button-td">
              <span className="d-flex align-items-center">
                <span className="ic-avatar ic-19 has-avatar-icon has-cover-img">
                  <img
                    className={`output-{{user.id}} theme-ring border-color-primary-50`}
                    src={
                      cost.checkID?.created_by?.profile_pic
                        ? mediaRoute(cost?.checkID?.created_by?.profile_pic) // Use mediaRoute to get the correct URL
                        : avatarImage // Fallback image
                    }
                    alt="profile-pic"
                  />

                </span>
                <span className="ml-2 text-black">
                  {cost.checkID?.check_requested_by?.first_name || ""}{" "}
                  {cost.checkID?.check_requested_by?.last_name || ""}
                </span>
              </span>
            </div>
          </StyledTableCell>
          <StyledTableCell>
          </StyledTableCell>
        </>
      ) : (
        <StyledTableCell colSpan="2">
          <div className="flex justify-content-center align-items-center">
            <RequestCheckButton cost={cost} showModal={showCheckRequestModal} />
          </div>
        </StyledTableCell>
      )}
      <StyledTableCell className={`td-autosize align-left  text-center p-x-10`}>
        {cost.invoice_number}
      </StyledTableCell>
      <StyledTableCell
        className={`td-autosize  p-x-10`}
        onClick={(e) => e.stopPropagation()}
      >
        {cost.document ? (
          <img
            src={invoiceIconDetails.checkUploadedIcon.url}
            alt={invoiceIconDetails.checkUploadedIcon.alt}
            className="height-i-25"
            onClick={() =>
              showDocumentModal("document", mediaRoute(cost.document.upload), cost.document)
            }
          />
        ) : (
          renderUploadIconWithDropzone(
            invoiceIconDetails.checkUploadIcon,
            invoiceIconDetails.checkIconType
          )
        )}
      </StyledTableCell>
      <StyledTableCell className={`td-autosize align-left  p-x-10`}>
        {cost.bank_account
          ? `Bank Account: ***${cost.bank_account}`
          : cost.credit_card
            ? `CC: ***${cost.credit_card}`
            : ""}
      </StyledTableCell>
      <StyledTableCell className={`td-autosize align-left text-center  p-x-10`}>
        {cost.payee}
      </StyledTableCell>
      <StyledTableCell
        className={`align-left text-center white-space-no w-100  p-x-10`}
      >
        {cost.memo}
      </StyledTableCell>
      <StyledTableCell
        className={`monospace-font text-right td-autosize align-left `}
      >
        <p style={{ fontWeight: 600, color: cost.amount == 0 ? 'var(--primary-40)' : '#000', width: '111.15px', minWidth: '111.15px' }}>{currencyFormat(cost.amount)}</p>
      </StyledTableCell>
      <StyledTableCell
        className={`td-autosize`}
        onClick={(e) => e.stopPropagation()}
      >
        {renderCheckIcon(checkVerifyIconDetails, cost)}
      </StyledTableCell>
      <StyledTableCell className={'td-autosize'} style={{ textAlign: 'center', height: '61px', minHeight: '61px' }} onClick={(e) => { e.stopPropagation(); }}>
        <p className={`monospace-font text-right`} style={{ fontWeight: 600, marginBottom: '6px', color: cost.amount == 0 ? 'var(--primary-40)' : '#000' }}>{cost.checkID?.amount && (currencyFormat(cost.checkID?.amount))}</p>
        <p style={{ fontSize: '14px', textAlign: 'center' }}>{cost.checkID?.cheque_number || ""}</p>
      </StyledTableCell>
      <StyledTableCell className={'td-autosize'} style={{ textAlign: 'center' }} onClick={(e) => { e.stopPropagation(); }}>
        <p style={{ width: '87.82px', fontSize: '14px', margin: '0 auto 5px auto' }}>{formatDate(cost.checkID?.cheque_date || "")}</p>
        {renderCheckIcon(checkSentIconDetails, cost)}
      </StyledTableCell>
      <StyledTableCell onClick={(e) => e.stopPropagation()} style={{ width: '87.82px', minWidth: '87.82px', textAlign: 'center' }}>
        <p style={{ width: '87.82px', minHeight: cost.checkID?.cheque_date ? '21px' : '0', fontSize: '14px', margin: '0 auto 5px' }}>
          {formatDate(cost.checkID?.cleared_date || "")}
        </p>
        {renderCheckIcon(checkClearedIconDetails, cost)}
      </StyledTableCell>
    </tr>
  );
};

export default React.memo(CostTableRow);
