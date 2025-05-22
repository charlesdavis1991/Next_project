import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "./treatmentFooter.css";
import { useFooter } from "../../common/shared/FooterContext";

const TreatmentFooter = ({ reload }) => {
  const origin = process.env.REACT_APP_BACKEND_URL;
  const token = localStorage.getItem("token");

  const { footerState, setFooterState } = useFooter();

  const location = useLocation();

  const fetchEditDocs = async () => {
    try {
      const response = await axios.get(`${origin}/api/create-edit-doc/`, {
        headers: { Authorization: token },
      });

      if (response.status === 200) {
        var data = response.data;
        console.log("fetchEditDocs", data);
        setFooterState(data);
      }
    } catch (error) {
      console.error("Error fetching case types:", error);
    }
  };

  useEffect(() => {
    fetchEditDocs();
  }, [reload]);

  function updateDocId(url, newDocId) {
    const newUrl = url + `&updatedDocId=${newDocId}`;
    return newUrl;
  }

  function openDoc(doc) {
    if (doc.updated_doc) {
      const new_url = updateDocId(doc.url, doc.updated_doc);
      window.location.href = new_url;
    } else {
      window.location.href = doc.url;
    }
  }

  const [maxWidth, setMaxWidth] = useState(0);
  const [maxLabelWidth, setMaxLabelWidth] = useState(0);
  const [maxDocWidth, setMaxDocWidth] = useState(0);

  useEffect(() => {
    if (footerState?.length) {
      const nameLengths = footerState.map((doc) => {
        const firstName = doc.for_client?.first_name || "";
        const lastName = doc.for_client?.last_name || "";
        return `${lastName}, ${firstName}`.length;
      });
      const labelWidth = footerState.map((doc) => {
        return doc?.court_form?.court_form_code.length;
      });
      console.log(labelWidth);
      const validLabelWidths = labelWidth.filter(
        (width) => width !== undefined
      );

      const docName = footerState.map((doc) => {
        return doc?.name.length;
      });
      console.log(docName);
      const validName = docName.filter((width) => width !== undefined);

      const charWidth = 10;
      const iconWidth = 19;
      const marginRight = 5;

      const calculatedWidth =
        Math.max(...nameLengths) * charWidth + iconWidth + marginRight;
      setMaxWidth(calculatedWidth);

      const labelCalculatedWidth =
        Math.max(...validLabelWidths) * charWidth + iconWidth + marginRight;
      setMaxLabelWidth(labelCalculatedWidth);

      console.log(labelCalculatedWidth);
      console.log(calculatedWidth);

      const docCalculatedWidth =
        Math.min(...validName) * charWidth + iconWidth + marginRight;
      setMaxDocWidth(docCalculatedWidth);
      console.log(docCalculatedWidth);
    }
  }, [footerState]);
  const HeaderLabel = ({ label, name, isActive }) => {
    const leftPosition = maxWidth ? (maxWidth - maxLabelWidth) / 2 : 21;
    return (
      <div
        className="position-absolute border-bottom-footer-floaating-tab  font-weight-semibold px-2 icon-text-boxes icon-text-box-custom d-flex align-items-center height-21"
        style={{
          zIndex: 1,
          fontSize: "14px",
          minWidth: maxLabelWidth ? `${maxLabelWidth}px` : "auto",
          maxWidth: maxLabelWidth ? `${maxLabelWidth}px` : "auto",
          top: "-21px",
          left: `${leftPosition}px`,
          backgroundColor: isActive ? "white" : "var(--primary-15)",
          transition: "background-color 0.3s ease",
          border: "3px solid var(--primary)",
          color: "var(--primary)",
        }}
      >
        <span className="icon-wrap m-r-5" style={{ flexBasis: "0" }}>
          <i className="ic ic-19 cursor-pointer img-19px ic-court-form"></i>
        </span>
        {label}
      </div>
    );
  };

  const FooterItem = ({ doc }) => {
    const [isHovered, setIsHovered] = useState(false);
    const currentPath = `${location.pathname}${location.search}${location.hash}`;
    const isActive = currentPath === doc.url;

    return (
      <div
        className={`col-md-2 icon-text-box-custom text-center overflow-visible font-weight-semibold cursor-pointer d-block ${
          isActive ? "" : ""
        }`}
        id="no-vertical-border"
        onClick={() => openDoc(doc)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          minWidth: maxWidth ? `${maxWidth}px` : "auto",
          maxWidth: maxWidth ? `${maxWidth}px` : "auto",
          backgroundColor: isHovered ? "white" : "var(--primary-15)",
          transition: "background-color 0.3s ease",
          position: "relative",
          border: "3px solid var(--primary)",
          color: "var(--primary)",
        }}
      >
        <HeaderLabel
          label={doc?.court_form?.court_form_code}
          isActive={isHovered}
        />
        <div className="d-flex height-21 align-items-center justify-content-center">
          <span className="ic ic-19 m-r-5 d-flex align-items-center justify-content-center">
            <img
              src={
                doc?.for_client?.profile_pic_19p ??
                "https://simplefirm-bucket.s3.amazonaws.com/static/bp_assets/img/avatar.svg"
              }
              alt={`${doc?.for_client?.first_name} ${doc?.for_client?.last_name}`}
              style={{
                borderRadius: "50%",
                width: "19px",
                height: "19px",
                border: "1px solid var(--primary-50)",
              }}
            />
          </span>
          <p className="">{`${doc?.for_client?.last_name}, ${doc?.for_client?.first_name}`}</p>
        </div>
      </div>
    );
  };

  const HeaderLabelDoc = ({ label, name, isActive }) => {
    const leftPosition = maxWidth ? (maxWidth - maxDocWidth) / 2 : 21;
    return (
      <div
        className="position-absolute border-bottom-footer-floaating-tab  font-weight-semibold px-2 icon-text-boxes icon-text-box-custom d-flex align-items-center height-21"
        style={{
          zIndex: 1,
          fontSize: "14px",
          minWidth: maxDocWidth ? `${maxDocWidth}px` : "auto",
          maxWidth: maxDocWidth ? `${maxDocWidth}px` : "auto",
          top: "-21px",
          left: `${leftPosition}px`,
          backgroundColor: isActive ? "white" : "var(--primary-15)",
          transition: "background-color 0.3s ease",
          border: "3px solid var(--primary)",
          color: "var(--primary)",
        }}
      >
        <span className="icon-wrap m-r-5" style={{ flexBasis: "0" }}>
          <i className="ic ic-19 cursor-pointer img-19px ic-file-colored"></i>
        </span>
        {label}
      </div>
    );
  };

  const FooterItemDoc = ({ doc }) => {
    const [isHovered, setIsHovered] = useState(false);
    const currentPath = `${location.pathname}${location.search}${location.hash}`;
    const isActive = currentPath === doc.url;

    return (
      <div
        className={`col-md-2 icon-text-box-custom text-center overflow-visible font-weight-semibold cursor-pointer d-block ${
          isActive ? "" : ""
        }`}
        id="no-vertical-border"
        onClick={() => openDoc(doc)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          minWidth: maxWidth ? `${maxWidth}px` : "auto",
          maxWidth: maxWidth ? `${maxWidth}px` : "auto",
          backgroundColor: isHovered ? "white" : "var(--primary-15)",
          transition: "background-color 0.3s ease",
          position: "relative",
          border: "3px solid var(--primary)",
          color: "var(--primary)",
        }}
      >
        <HeaderLabelDoc label={doc?.name} isActive={isHovered} />
        <div className="d-flex height-21 align-items-center justify-content-center">
          <span className="ic ic-19 m-r-5 d-flex align-items-center justify-content-center">
            <img
              src={
                doc?.for_client?.profile_pic_19p ??
                "https://simplefirm-bucket.s3.amazonaws.com/static/bp_assets/img/avatar.svg"
              }
              alt={`${doc?.for_client?.first_name} ${doc?.for_client?.last_name}`}
              style={{
                borderRadius: "50%",
                width: "19px",
                height: "19px",
                border: "1px solid var(--primary-50)",
              }}
            />
          </span>
          <p className="">{`${doc?.for_client?.last_name}, ${doc?.for_client?.first_name}`}</p>
        </div>
      </div>
    );
  };

  return (
    <footer
      style={{
        width: "100%",
        position: "fixed",
        zIndex: "100000",
        bottom: "0px",
      }}
    >
      <div
        style={{ height: "25px", background: "var(--primary)", width: "100%" }}
      >
        <div class="icon-text-boxes d-flex flex-wrap w-100 m-t-5">
          <div className="mx-auto d-flex align-items-end">
            {/* <FooterItem /> */}
            {footerState?.map((doc, index) => {
              return (
                <>
                  {doc?.url.includes("CourtForm") ? (
                    <FooterItem doc={doc} />
                  ) : !doc?.url.includes("LetterTemplate") ? (
                    <FooterItemDoc doc={doc} />
                  ) : (
                    <div
                      className={`col-md-2 icon-text-box-custom text-center font-weight-semibold btn-white-hover cursor-pointer d-block ${
                        `${location.pathname}${location.search}${location.hash}` ===
                        doc.url
                          ? "btn-primary-white"
                          : "btn-primary-lighter-2"
                      }`}
                      id="no-vertical-border"
                      onClick={() => openDoc(doc)}
                    >
                      <div className="d-flex align-items-center justify-content-center">
                        <span
                          className="icon-wrap m-r-5 d-flex align-items-center justify-content-center"
                          style={{ flexBasis: "0" }}
                        >
                          <i
                            className={`ic ic-19 cursor-pointer img-19px
                    ${doc.url.includes("CourtForm") ? "ic-court-form" : !doc.url.includes("LetterTemplate") ? "ic-file-colored" : "edit-template-icon"}
                  `}
                          ></i>
                        </span>
                        <p className="name">
                          {doc.url.includes("CourtForm")
                            ? "Court Form"
                            : !doc.url.includes("LetterTemplate")
                              ? "Document"
                              : "Template Edit"}
                        </p>
                      </div>
                    </div>
                  )}
                </>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default TreatmentFooter;
