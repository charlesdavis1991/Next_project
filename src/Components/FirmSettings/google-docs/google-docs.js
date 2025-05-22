import React, { useRef } from "react";
import CommonHeader from "../common/common-header";
import useGetGoogleDocsCredentials, {
  usePostGoogleDocsCreds,
} from "./hooks/useGetGoogleDocsCredentials";

const GoogleDocs = () => {
  const heading = "FIRM SETTINGS TITLE WITH CENTERED TEXT";
  const points = [
    "1. Firm settings panel instruction point one",
    "2. Firm settings panel instruction point two",
    "3. Firm settings panel instruction point three",
  ];
  const { data, refetch } = useGetGoogleDocsCredentials();
  const { saveGoogleDocsCreds } = usePostGoogleDocsCreds();
  const googleFileRef = useRef();

  const handleFileUpload = async () => {
    const googleFile = googleFileRef.current.files[0];
    const formData = new FormData();
    formData.append("file", googleFile);
    await saveGoogleDocsCreds(formData);
    refetch();
  };

  return (
    <div className="tab-pane fade firm-settings-user-perms-fs active show">
      <div>
        <CommonHeader heading={heading} points={points} />
      </div>
      <div className="col-lg-12">
        <h3 className="m-t-5" style={{ marginTop: "20px" }}>
          WorkSpace Credentials
        </h3>
        {data && data?.google_workspace && (
          <p
            className="credential-popup m-t-5"
            style={{ fontSize: "20px", color: "#00ff62" }}
          >
            Credentials Already Exists
          </p>
        )}
        <div style={{ marginBottom: "20px" }} className="m-t-5 col-sm-3">
          <label>Select File</label>
          <input
            type="file"
            className="form-control pl-0"
            id="gogle-creds"
            name="gogle-creds"
            ref={googleFileRef}
            style={{ border: "none" }}
          />
        </div>
        <button
          onClick={handleFileUpload}
          disabled={!googleFileRef.current}
          className="btn btn-primary"
          style={{ marginBottom: "10px" }}
        >
          {data?.google_workspace ? "Replace File" : "Upload File"}
        </button>
        <h4>Instruction To Get Credential File From Google Work Space</h4>
        <ol>
          <li>Open the Service accounts page.</li>
          <li>If prompted, select a project, or create a new one.</li>
          <li>
            Click <strong>+Create service account</strong>.
          </li>
          <li>
            Under Service account details, type a name, ID, and description for
            the service account, then click <strong>Create and continue</strong>
            .
          </li>
          <li>
            Optional: Under{" "}
            <strong>Grant this service account access to project</strong>,
            select the IAM roles to grant to the service account.
          </li>
          <li>
            Click <strong>Continue</strong>.
          </li>
          <li>
            Optional: Under{" "}
            <strong>Grant users access to this service account</strong>, add the
            users or groups that are allowed to use and manage the service
            account.
          </li>
          <li>
            Click <strong>Done</strong>.
          </li>
        </ol>

        <p>
          <strong>Next, create a service account key:</strong>
          <br />
          <br />
        </p>

        <ol start="1">
          <li>Click the email address for the service account you created.</li>
          <li>
            Click the <strong>Keys</strong> tab.
          </li>
          <li>
            In the <strong>Add key</strong> drop-down list, select{" "}
            <strong>Create new key</strong>.
          </li>
          <li>
            Click <strong>Create</strong>.
          </li>
        </ol>

        <p>
          Your new public/private key pair is generated and downloaded to your
          machine; it serves as the only copy of the private key. You are <br />
          responsible for storing it securely. If you lose this key pair, you
          will need to generate a new one.
        </p>
      </div>
    </div>
  );
};

export default GoogleDocs;
