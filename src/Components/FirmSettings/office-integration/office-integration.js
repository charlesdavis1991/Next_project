import React, { useEffect, useState } from "react";
import CommonHeader from "../common/common-header";
import useGetOfficeIntegration, {
  usePostOfficeLogin,
} from "./hooks/useOfficeIntegration";

const OfficeIntegration = () => {
  const heading = "FIRM SETTINGS TITLE WITH CENTERED TEXT";
  const points = [
    "1. Firm settings panel instruction point one",
    "2. Firm settings panel instruction point two",
    "3. Firm settings panel instruction point three",
  ];

  const [selectedOption, setSelectedOption] = useState("");
  const { postOffice, success } = usePostOfficeLogin();
  const { data, refetch } = useGetOfficeIntegration();

  const handleOptionChange = async (e) => {
    setSelectedOption(e.target.value);
    await postOffice({
      active: e.target.value,
    });
  };

  useEffect(() => {
    if (success) {
      window.location.href = success.redirect_url
        ? success.redirect_url
        : success?.auth_url;
    }
  }, [success]);

  useEffect(() => {
    if (data) {
      setSelectedOption(
        data?.microsoft_365 === true
          ? "microsoft"
          : data?.google_workspace === true
            ? "google"
            : ""
      );
    }
  }, [data]);

  return (
    <div className="tab-pane fade firm-settings-user-perms-fs active show">
      <div>
        <CommonHeader heading={heading} points={points} />
      </div>
      {data?.office_integrated && (
        <div className="alert alert-success">
          The Microsoft Office account is currently signed in using a Microsoft
          personal account
        </div>
      )}

      <div className="col-lg-12 mt-5">
        <div className="row d-flex justify-content-between">
          <div className="form-check">
            <input
              className="form-check"
              type="radio"
              value="microsoft"
              id="microsoft"
              checked={selectedOption === "microsoft"}
              onChange={handleOptionChange}
            />
            <label className="form-check mb-0" htmlFor="microsoft">
              Microsoft
            </label>
          </div>
          <div className="form-check mx-3">
            <input
              className="form-check"
              type="radio"
              value="google"
              id="google"
              checked={selectedOption === "google"}
              onChange={handleOptionChange}
            />
            <label className="form-check mb-0" htmlFor="google">
              GoogleWorkSpace
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficeIntegration;
