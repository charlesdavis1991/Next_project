import React, { useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import birthdayIcon from "../../assets/images/birthdayicon.svg";
import telephoneIcon from "../../assets/images/telephone.svg";
import incidentIcon from "../../assets/images/incident.svg";
import { calculateAge, formatDate, formatDateUTC } from "../../Utils/helper";
import { Link } from "react-router-dom";
import "./LastAccessedCasesModal.css";
import PulseLoader from "react-spinners/PulseLoader";

const LastAccessedCasesModal = ({
  isOpen,
  onClose,
  lastAccessedCases,
  extractDigits,
  page,
  onCaseClick,
  isLoading,
  setIsLoading,
}) => {
  const gridRef = useRef(null);
  const [gridLayout, setGridLayout] = useState({ columns: 0, rows: 0 });
  const CARD_WIDTH = 320; // Fixed card width

  useEffect(() => {
    setIsLoading(true);
    const calculateGridLayout = () => {
      if (!gridRef.current) return setIsLoading(false);

      // Calculate number of columns based on window width
      const availableWidth = window.innerWidth - 48; // 48px for margins
      const columns = Math.floor(availableWidth / CARD_WIDTH); // Cap at 7 columns

      // Calculate number of rows to maintain grid appearance
      const rows = Math.floor((window.innerHeight - 200) / 102); // 102px is the height of each card

      // Calculate modal width based on number of columns

      const modalWidth = columns * CARD_WIDTH;

      setGridLayout({
        columns,
        rows,
        modalWidth,
        totalSlots: columns * rows,
      });

      // Apply grid styles
      gridRef.current.style.gridTemplateColumns = `repeat(${columns}, ${CARD_WIDTH}px)`;
      setIsLoading(false);
    };

    if (isOpen) {
      calculateGridLayout();
      window.addEventListener("resize", calculateGridLayout);
    }

    return () => window.removeEventListener("resize", calculateGridLayout);
  }, [isOpen]);

  const { columns, rows, totalSlots, modalWidth } = gridLayout;
  const filledSlots = lastAccessedCases?.length || 0;
  const emptySlots = Math.max(totalSlots - filledSlots, 0);

  return (
    <Modal show={isOpen} onHide={onClose} dialogClassName="modal-90w">
      <Modal.Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        closeButton
      >
        <Modal.Title
          style={{
            fontSize: "15px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Previously Accessed Cases
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-0">
        <div
          ref={gridRef}
          className="gap-0 overflow-auto"
          style={{
            display: "grid",
            width: `${modalWidth}px`,
            maxHeight: "calc(100vh - 200px)",
            minHeight: "0",
          }}
        >
          {isLoading && (
            <PulseLoader
              loading={isLoading}
              size={16}
              aria-label="Loading Spinner"
              data-testid="loader"
              color="#19395F"
              style={{
                display: "flex",
                flexDirection: "row",
                height: "calc(100vh-119px)",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
              }}
            />
          )}

          {!isLoading &&
            lastAccessedCases?.map((caseData, index) => {
              const rowIndex = Math.floor(index / columns);
              const colIndex = index % columns;
              const isEven = (rowIndex + colIndex) % 2 === 0;

              return (
                <div
                  key={caseData.id}
                  className={`${isEven ? "bg-checkerboard-primary" : "bg-checkerboard-secondary"} cursor-pointer p-t-5 p-b-5`}
                  style={{ height: "102px" }}
                  onClick={(e) => onCaseClick(e, caseData)}
                >
                  {/* Row 1 - Client Info */}
                  <div
                    className="d-flex align-items-center p-r-5 p-l-5"
                    style={{ height: "29px" }}
                  >
                    <Link
                      href={
                        page
                          ? `/bp-switch_client/${caseData.for_client.id}/${caseData.id}/${page.name}`
                          : `/bp-switch_client/${caseData.for_client.id}/${caseData.id}/Case`
                      }
                    >
                      <div
                        className="header-client-image"
                        style={{ marginLeft: "0px", marginRight: "5px" }}
                      >
                        {caseData?.for_client.profile_pic_29p ? (
                          <div className="image-container-modal">
                            <img
                              src={caseData?.for_client.profile_pic_29p}
                              alt={caseData?.for_client.first_name}
                            />
                            <div className="border-overlay-modal"></div>
                          </div>
                        ) : (
                          <div className="icon-container-modal">
                            <i className="ic ic-client-avatar"></i>
                            <div className="border-overlay-modal"></div>
                          </div>
                        )}
                      </div>
                    </Link>

                    <a
                      href={
                        page
                          ? `/bp-switch_client/${caseData.for_client.id}/${caseData.id}/${page.name}`
                          : `/bp-switch_client/${caseData.for_client.id}/${caseData.id}/Case`
                      }
                      className="clientTabFont text-black d-block text-nowrap text-decoration-none"
                      style={{ fontSize: "14px", fontWeight: "600" }}
                    >
                      {caseData.for_client.last_name}
                      <span className="text-dark-grey">,</span>&nbsp;
                      {caseData.for_client.first_name}
                    </a>
                  </div>

                  {/* Row 2 - Phone & Birthday */}
                  <div
                    className="d-flex align-items-center justify-content-between p-r-5 p-l-5"
                    style={{ height: "21px" }}
                  >
                    <div className="d-flex align-items-center">
                      <span className="ic-avatar ic-19 m-0 d-flex align-items-center m-r-5">
                        <i className="ic ic-19 ic-sms-3d"></i>
                      </span>
                      <a className="text-nowrap text-black text-decoration-none">
                        {caseData.for_client.primary_phone.phone_number && (
                          <span className="font-weight-semibold">
                            (
                            {extractDigits(
                              caseData.for_client.primary_phone.phone_number
                            ).slice(0, 3)}
                            )&nbsp;
                            {extractDigits(
                              caseData.for_client.primary_phone.phone_number
                            ).slice(3, 6)}
                            -
                            {extractDigits(
                              caseData.for_client.primary_phone.phone_number
                            ).slice(6)}
                          </span>
                        )}
                      </a>
                    </div>
                    <div className="d-flex align-items-center">
                      <span className="ic-avatar ic-19 m-0 d-flex align-items-center m-r-5">
                        <img
                          src={birthdayIcon}
                          style={{ width: "19px", height: "19px" }}
                        />
                      </span>
                      <p className="font-weight-semibold m-r-5">
                        {caseData.for_client?.birthday
                          ? formatDate(caseData.for_client?.birthday)
                          : ""}
                      </p>
                      <div className="d-flex align-items-center">
                        <span
                          className="text-grey"
                          style={{ fontWeight: "600" }}
                        >
                          Age
                        </span>
                        <span className="text-black m-l-5 font-weight-semibold">
                          {calculateAge(new Date(caseData.for_client.birthday))}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Row 3 & 4 - Case Info */}
                  <div style={{ height: "42px" }}>
                    <div
                      className="d-flex justify-content-between align-items-center w-100 p-r-5 p-l-5"
                      style={{ height: "21px" }}
                    >
                      <div className="d-flex align-items-center">
                        {caseData?.case_type?.casetype_icon && (
                          <span className="ic-avatar ic-19 m-r-5 d-flex align-items-center">
                            <img
                              style={{ width: "19px", height: "19px" }}
                              src={caseData?.case_type?.casetype_icon}
                              alt="icon"
                            />
                          </span>
                        )}
                        <p className="font-weight-semibold">
                          {caseData.case_type?.name}
                        </p>
                      </div>
                      <div className="d-flex align-items-center">
                        <div className="text-label color-green font-weight-bold m-r-5">
                          OPEN
                        </div>
                        <p className="font-weight-semibold">
                          {caseData.date_open &&
                            formatDateUTC(caseData.date_open)}
                        </p>
                      </div>
                    </div>
                    <div
                      className="d-flex justify-content-between align-items-center w-100 p-r-5 p-l-5"
                      style={{ height: "21px" }}
                    >
                      <div className="d-flex align-items-center">
                        <span className="ic-avatar ic-19 m-r-5 d-flex align-items-center">
                          <img
                            src={incidentIcon}
                            style={{ width: "19px", height: "19px" }}
                          />
                        </span>
                        <p className="font-weight-semibold">
                          {caseData.incident_date &&
                            formatDate(caseData.incident_date)}
                        </p>
                      </div>
                      <div className="d-flex align-items-center">
                        <div className="text-label m-r-5 color-grey-2 font-weight-bold">
                          LA
                        </div>
                        <p className="font-weight-semibold">
                          {formatDate(caseData?.last_accessed_date) ||
                            "12/12/2024"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

          {/* Empty slots to maintain grid */}
          {Array.from({ length: emptySlots }).map((_, index) => {
            const totalIndex = filledSlots + index;
            const rowIndex = Math.floor(totalIndex / columns);
            const colIndex = totalIndex % columns;
            const isEven = (rowIndex + colIndex) % 2 === 0;

            return (
              <div
                key={`empty-${index}`}
                className={`${isEven ? "bg-checkerboard-primary" : "bg-checkerboard-secondary"}`}
                style={{ height: "102px" }}
              />
            );
          })}
        </div>
      </Modal.Body>
      <style jsx>{`
        .modal-90w {
          max-width: ${modalWidth + 2}px !important;
          margin: 1.75rem auto;
        }

        @media (max-width: ${modalWidth + 2}px) {
          .modal-90w {
            margin: 0;
            max-width: 100% !important;
          }
        }
      `}</style>
    </Modal>
  );
};

export default LastAccessedCasesModal;
