import React, { useState, useRef, useEffect } from "react";
import "./CustomDocumentSidebar.css";
import PropTypes from "prop-types";
import "./CustomModalBottomContentSidebar.css";
import { mediaRoute } from "../../../../Utils/helper";

export function UserProfile({ clientInfo }) {
  return (
    <>
      <div className="user-profile-document-popup-img m-r-5">
        {clientInfo?.profile_pic_29p ? (
          <img
            src={clientInfo.profile_pic_29p}
            alt="Profile avatar"
            className=""
          />
        ) : (
          <i className="ic ic-avatar ic-29 has-avatar-icon"></i>
        )}
      </div>
      {/* <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
          {clientInfo?.profile_pic_29p && (
            <img
              src={clientInfo.profile_pic_29p}
              alt="Profile avatar"
              className="invisible"
            />
          )}
        </span> */}
      <span className="text-black user_name">
        <span className="clientTabFont d-block">
          {clientInfo
            ? `${clientInfo.last_name}, ${clientInfo.first_name}`
            : "Client Info"}
        </span>
      </span>
    </>
  );
}

UserProfile.propTypes = {
  clientInfo: PropTypes.shape({
    profile_pic_29p: PropTypes.string,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
  }),
};

export function PageInfo({ page }) {
  const { page_icon = "", name = "" } = page || {};

  return (
    <div className="d-flex align-items-center m-l-25">
      {page_icon && (
        <img src={mediaRoute(page_icon)} width="20" hight="19" alt="" />
      )}
      <p className="ml-1">{name}</p>
    </div>
  );
}

PageInfo.propTypes = {
  page: PropTypes.shape({
    page_icon: PropTypes.string,
    name: PropTypes.string,
  }),
};
