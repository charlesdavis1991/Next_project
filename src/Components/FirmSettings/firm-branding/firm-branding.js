import React, { useEffect, useRef, useState } from "react";
import CommonHeader from "../common/common-header";
import useGetFirmLogo, {
  useDeleteFirmLogo,
  useDeletePrintLogo,
  useEditFirmLogo,
  useEditPrintLogo,
  useGetPrintLogo,
  useRestoreDefaultBrandSettings,
} from "./hooks/useGetFirmBranding";
import { Button } from "react-bootstrap";

const FirmBranding = () => {
  const heading = "FIRM SETTINGS TITLE WITH CENTERED TEXT";
  const points = [
    "1. Firm settings panel instruction point one",
    "2. Firm settings panel instruction point two",
    "3. Firm settings panel instruction point three",
  ];
  const { data: getFirmLogo, refetch: firmLogoRefetch } = useGetFirmLogo();
  const { data: getPrintLogo, refetch: printLogoRefetch } = useGetPrintLogo();
  const { deletePrintLogo } = useDeletePrintLogo();
  const { editPrintLogo } = useEditPrintLogo();
  const { editFirmLogo } = useEditFirmLogo();
  const { deleteFirmLogo } = useDeleteFirmLogo();
  const { restoreBrandSettings } = useRestoreDefaultBrandSettings();
  const fileRef = useRef();
  const printLogoFileRef = useRef();

  const handleDeletePrintLogo = async () => {
    await deletePrintLogo();
    printLogoRefetch();
  };

  const handleDeleteFirmLogo = async () => {
    await deleteFirmLogo();
    firmLogoRefetch();
  };

  const handleEditPrintLogo = async () => {
    const printFile = printLogoFileRef.current.files[0];
    console.log(printFile);
    const formData = new FormData();
    formData.append("file", printFile);
    await editPrintLogo(formData);
    printLogoRefetch();
  };

  const handleEditFirmLogo = async () => {
    const firmFile = fileRef.current.files[0];
    const formData = new FormData();
    formData.append("logo", firmFile);
    formData.append("brand_color", getFirmLogo?.brand_color);
    formData.append("logo_background", getFirmLogo?.logo_background);
    formData.append("background_color", getFirmLogo?.logo_background);

    await editFirmLogo(formData);
    firmLogoRefetch();
  };

  return (
    <div className="tab-pane fade firm-settings-user-perms-fs active show">
      <div>
        <CommonHeader heading={heading} points={points} />
      </div>
      <div className="col-lg-12">
        <h2 className="font-weight-bold m-t-5 m-b-5">Firm Logo and Branding</h2>
        <p className="colors-intro margin-bottom-30 m-b-5">
          The five most prevalent colors in your firm's logo are below.
          <br />
          Check a color box to change the color scheme of the program layout to
          match your firm branding:
        </p>
      </div>
      <div className="row">
        <div className="col-md-4 " style={{ paddingLeft: " 30px" }}>
          {getFirmLogo?.logo ? (
            <img
              src={getFirmLogo?.logo}
              className="logoss logo-image-class"
              alt="firm-logo"
              style={{ backgroundColor: "var(--primary)" }}
              width={380}
              height={380}
            />
          ) : (
            <img
              className="logoss logo-image-class"
              src="https://simplefirm-bucket.s3.amazonaws.com/static/BP_resources/images/default-branding-logo.png"
              style={{ backgroundColor: "var(--primary)" }}
              width={380}
              height={380}
            />
          )}
        </div>
      </div>
      <div
        className="row d-flex align-items-center justify-content-between"
        style={{ marginTop: "10px" }}
      >
        <div className="col-md-9  d-flex align-items-center">
          {!getFirmLogo?.logo && (
            <div
              className="form-group col-md-3 mb-0 d-flex align-items-center"
              style={{ marginRight: "15px" }}
            >
              <input
                type="file"
                className="form-control pl-0"
                id="firmLogo"
                name="firmLogo"
                ref={fileRef}
                style={{ border: "none" }}
              />
            </div>
          )}

          <button
            className="btn btn-primary"
            style={{
              marginRight: "15px",
              marginLeft: getFirmLogo?.logo ? "15px" : "",
            }}
          >
            Restore Default Color
          </button>
          <button
            className="btn btn-primary"
            onClick={async () => {
              await restoreBrandSettings();
              firmLogoRefetch();
            }}
            style={{ marginRight: "15px" }}
          >
            Restore Default Settings
          </button>
          {getFirmLogo?.logo && (
            <button
              className="btn btn-danger"
              onClick={handleDeleteFirmLogo}
              style={{ marginRight: "15px" }}
            >
              Delete
            </button>
          )}
        </div>
        <div className="col-md-3">
          <button
            className="btn btn-primary"
            disabled={!fileRef}
            onClick={handleEditFirmLogo}
          >
            Save Changes
          </button>
        </div>
      </div>
      <div className="col-lg-12">
        <h3 className="font-weight-bold mt-2 m-b-5">Print Logo</h3>
      </div>
      <div className="row" style={{ marginTop: "20px" }}>
        <div className="col-md-12 d-flex align-items-center justify-content-between">
          {!getPrintLogo?.print_logo && (
            <>
              <div className="col-md-9">
                <div
                  className="form-group pl-0 col-md-3 mb-0 d-flex align-items-center"
                  style={{ marginRight: "15px" }}
                >
                  <input
                    type="file"
                    className="form-control pl-0"
                    id="firmLogo"
                    name="firmLogo"
                    ref={printLogoFileRef}
                    style={{ border: "none" }}
                  />
                </div>
              </div>
              <div className="col-md-3" style={{ paddingLeft: "21px" }}>
                <button
                  className="btn btn-primary"
                  disabled={!printLogoFileRef}
                  onClick={handleEditPrintLogo}
                >
                  Save Changes
                </button>
              </div>
            </>
          )}
          {getPrintLogo?.print_logo && (
            <>
              <div className="col-md-9">
                <img
                  src={getPrintLogo?.print_logo}
                  className="logoss logo-image-class"
                  alt="firm-logo"
                  width={380}
                  height={380}
                  style={{
                    backgroundColor: "var(--primary)",
                  }}
                />
              </div>
              <div className="col-md-3">
                <button
                  className="btn btn-danger"
                  onClick={handleDeletePrintLogo}
                >
                  Delete Logo
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FirmBranding;
