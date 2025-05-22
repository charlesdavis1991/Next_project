import React, { useState } from "react";
import CommonHeader from "../common/common-header";
import useGetCloudStorage, { usePostCloudStorageCredentials } from "./hooks/useCloudStorage";

const CloudStorage = () => {
  const heading = "FIRM SETTINGS TITLE WITH CENTERED TEXT";
  const points = [
    "1. Firm settings panel instruction point one",
    "2. Firm settings panel instruction point two",
    "3. Firm settings panel instruction point three",
  ];

  const { data } = useGetCloudStorage();
  const { saveCloudStorageCreds } = usePostCloudStorageCredentials();
  const authUrls = {
    "DropBox": data?.dropbox_auth_url || "",
    "Box": data?.box_auth_url || "",
    "Google Drive": data?.google_auth_url || "",
    "One Drive": data?.onedrive_auth_url || "",
  };

  const [selectedOption, setSelectedOption] = useState(
    data?.type ? data?.type : "Inactive"
  
  );

  const [scan_doc, setScanDoc] = useState(
    data?.scanned_doc ? data?.scanned_doc : ""
  );
  const [process_doc, setProcessDoc] = useState(
    data?.processed_doc ? data?.processed_doc : ""
  );

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const inputBoxes = [
    {
      label: "New Scanned Documents",
      for: "scanned_doc",
      placeholder: "New Scanned Documents Folder Name",
      value: scan_doc,
      onChange: (e) => setScanDoc(e.target.value),
    },
    {
      label: "Process Documents",
      for: "process_doc",
      placeholder: "Processed Documents Folder Name",
      value: process_doc,
      onChange: (e) => setProcessDoc(e.target.value),
    },
  ];

  const handleFormSubmit = () => {
    console.log(authUrls)
    if (selectedOption !== "Inactive" && authUrls[selectedOption]) {
      saveCloudStorageCreds({
        "scanned_doc":scan_doc,
        "processed_doc":process_doc,
        "type":selectedOption
      })
      window.location.href = authUrls[selectedOption];
    } else {
      alert("Please select a valid storage option.");
    }
  };

  return (
    <div className="tab-pane fade firm-settings-user-perms-fs active show">
      <div>
        <CommonHeader heading={heading} points={points} />
      </div>
      <div className="col-lg-12" style={{ marginTop: "20px" }}>
        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="selectType" style={{ fontSize: "14px" }}>
            Data Integration Type
          </label>
          <div className="form-group">
            <div className="form-check m-b-5">
              <input
                type="radio"
                className="form-check-input"
                id="inactive"
                value="Inactive"
                checked={selectedOption === "Inactive"}
                onChange={handleOptionChange}
              />
              <label
                className="form-check-label"
                htmlFor="inactive"
                style={{ fontSize: "14px" }}
              >
                Inactive
              </label>
            </div>
            <div className="form-check m-b-5">
              <input
                type="radio"
                className="form-check-input"
                id="dropbox"
                value="DropBox"
                checked={selectedOption === "DropBox"}
                onChange={handleOptionChange}
              />
              <label
                className="form-check-label"
                htmlFor="dropbox"
                style={{ fontSize: "14px" }}
              >
                Dropbox
              </label>
            </div>
            <div className="form-check m-b-5">
              <input
                type="radio"
                className="form-check-input"
                id="box"
                value="Box"
                checked={selectedOption === "Box"}
                onChange={handleOptionChange}
              />
              <label
                className="form-check-label"
                htmlFor="box"
                style={{ fontSize: "14px" }}
              >
                Box
              </label>
            </div>
            <div className="form-check m-b-5">
              <input
                type="radio"
                className="form-check-input"
                id="googleDrive"
                value="Google Drive"
                checked={selectedOption === "Google Drive"}
                onChange={handleOptionChange}
              />
              <label
                className="form-check-label"
                htmlFor="googleDrive"
                style={{ fontSize: "14px" }}
              >
                Google Drive
              </label>
            </div>
            <div className="form-check m-b-5">
              <input
                type="radio"
                className="form-check-input"
                id="oneDrive"
                value="One Drive"
                checked={selectedOption === "One Drive"}
                onChange={handleOptionChange}
              />
              <label
                className="form-check-label"
                htmlFor="oneDrive"
                style={{ fontSize: "14px" }}
              >
                One Drive
              </label>
            </div>
          </div>
        </div>
        {inputBoxes.map((item, idx) => (
          <div className="row m-b-5" key={idx}>
            <label
              htmlFor={item.for}
              className="col-sm-8 col-form-label fw-bold"
            >
              {item.label}
            </label>
            <input
              type="text"
              placeholder={item.placeholder}
              className="form-control"
              name={item.for}
              id={item.for}
              value={item.value}
              onChange={item.onChange}
            />
          </div>
        ))}

        <div>
          <button className="btn btn-primary" onClick={handleFormSubmit}>
            Connect & Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default CloudStorage;
