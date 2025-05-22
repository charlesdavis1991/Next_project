import React from "react";
import { formatDate } from "../../../../../Utils/helper";

const RenameDeleteTemplateModalBody = ({
  data,
  templateName,
  setTemplateName,
  docName,
  setDocName,
}) => {
  return (
    <>
      <div className="row align-items-center form-group">
        <div className="col-md-3 text-left">
          <span
            style={{ fontSize: "14px" }}
            className="d-inline-block text-grey"
          >
            Template Name:{" "}
          </span>
        </div>
        <div className="col-md-9">
          <input
            type="text"
            className="form-control"
            placeholder="Template Name"
            value={templateName}
            onChange={setTemplateName}
          />
        </div>
      </div>
      <div className="row align-items-center form-group">
        <div className="col-md-3 text-left">
          <span
            style={{ fontSize: "14px" }}
            className="d-inline-block text-grey"
          >
            File Name:{" "}
          </span>
        </div>
        <div className="col-md-9">
        <input
            type="text"
            className="form-control"
            placeholder="Document Name"
            value={docName}
            onChange={setDocName}
          />
        </div>
      </div>
      <div className="row align-items-center form-group">
        <div className="col-md-3 text-left">
          <span
            style={{ fontSize: "14px" }}
            className="d-inline-block text-grey"
          >
            Date Uploaded:{" "}
          </span>
        </div>
        <div className="col-md-9">
          <input
            value={formatDate(data?.for_template?.template?.created)}
            disabled={true}
            type="text"
            className="form-control"
          />
        </div>
      </div>
      <div className="row align-items-center form-group">
        <div className="col-md-3 text-left">
          <span
            style={{ fontSize: "14px" }}
            className="d-inline-block text-grey"
          >
            Firm User:{" "}
          </span>
        </div>
        <div className="col-md-9">
          <div className="d-flex align-items-center form-control">
            {data?.profile_pic ? (
              <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
                <img
                  src={data?.profile_pic}
                  alt={`${data?.profile_pic} Firm User Img`}
                />
              </span>
            ) : (
              <span className="ic ic-29 ic-avatar"></span>
            )}

            <div className="ml-1 text-black">
              {data?.for_firm_user?.first_name} {data?.for_firm_user?.last_name}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RenameDeleteTemplateModalBody;
