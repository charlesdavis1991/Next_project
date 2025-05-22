import React, { useTransition } from "react";
import api from "../../api/api";
import { getCaseId, getClientId } from "../../Utils/helper";

export default function VerifyAction({ fieldName, tableName, recordId }) {
  const [pending, startTransition] = useTransition();
  const handleVerifyField = (e) => {
    startTransition(async () => {
      e.preventDefault();
      const data = {
        record_id: recordId,
        field_name: fieldName,
        table_name: tableName,
      };
      const clientId = getClientId();
      const caseId = getCaseId();
      await api
        .post(
          `/api/case-provider-verification/verify-field/${clientId}/${caseId}/`,
          data
        )
        .then((response) => {
          console.log("Response: ", response);
        })
        .catch((error) => {
          console.log("Error: ", error);
        });
    });
  };

  return (
    <>
      <div className="icon-wrap ic-25 m-l-5 m-r-5">
        <i className="ic ic-unverified ic-25" />
      </div>
      {pending ? (
        <div>
          <div className="d-flex justify-content-center align-items-center">
            <div
              className="loader"
              style={{
                width: "30px",
                height: "30px",
              }}
            />
          </div>
        </div>
      ) : (
        <a
          href="#"
          className="btn btn-primary rounded-0 height-35 d-flex align-items-center"
          data-field_name={fieldName}
          data-table_name={tableName}
          data-record_id={recordId}
          onClick={handleVerifyField}
        >
          Verify
        </a>
      )}
    </>
  );
}
