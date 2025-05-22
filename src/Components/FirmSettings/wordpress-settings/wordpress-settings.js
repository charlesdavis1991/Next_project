import React, { useState } from "react";
import CommonHeader from "../common/common-header";
import useWordPressSettings from "./hooks/useWordpressSettings";
import api from "../../../api/api";

const GenerateWordpressSettings = () => {
  const heading = "FIRM SETTINGS TITLE WITH CENTERED TEXT";
  const points = [
    "1. Firm settings panel instruction point one",
    "2. Firm settings panel instruction point two",
    "3. Firm settings panel instruction point three",
  ];

  const { data: WordpressCreds, refetch } = useWordPressSettings();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSecret, setShowSecret] = useState(false);

  const maskSecret = (secret) => {
    if (!secret) return "";
    return secret.slice(0, 22) + "***********";
  };
  const generateCreds = async () => {
    try {
      const response = await api.get(
        `/api/firmsetting-page/generate-wordpress-creds/`
      );
      setData(response.data);
      refetch();
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tab-pane fade firm-settings-user-perms-fs active show">
      <div>
        <CommonHeader heading={heading} points={points} />
      </div>
      <h2 className="font-weight-bold">WordPress Settings</h2>
      <div className="mt-3 col-lg-6">
        {!WordpressCreds?.client_id ? (
          <button onClick={generateCreds} className="btn btn-primary">
            Generate Client ID and Secret
          </button>
        ) : (
          <div className="client-info">
            <div className="mb-3">
              <strong>Client ID:</strong> {WordpressCreds.client_id}
            </div>
            <div className="mb-3 d-flex align-items-center">
              <div className="me-2">
                <strong>Client Secret:</strong>{" "}
                {showSecret
                  ? WordpressCreds.client_secret
                  : maskSecret(WordpressCreds.client_secret)}
              </div>
            </div>
            <button
              className="btn btn-primary col-sm-2"
              onClick={() => setShowSecret(!showSecret)}
            >
              {showSecret ? "Hide" : "Show"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateWordpressSettings;
