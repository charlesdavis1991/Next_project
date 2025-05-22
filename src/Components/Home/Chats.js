import React, { useEffect, useRef, useState } from "react";
import "../../../public/BP_resources/css/home_component.css";
import UserPreference from "./UserPrefrence";
import settingsIcon from "../../assets/images/settings_icon.png";
import axios from "axios";
import { formatDateForPanelDisplay } from "../../Utils/helper";

const CHAR_WIDTH = 7.5;
const AVATAR_WIDTH = 35;
const ICON_WIDTH = 19;
const PADDING = 10;

const Chats = ({ onHeightChange }) => {
  const origin = process.env.REACT_APP_BACKEND_URL;
  const token = localStorage.getItem("token");
  const [pinnedCases, setPinnedCases] = useState([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const containerRef = useRef(null);
  const [layout, setLayout] = useState({
    rows: [[]],
    maxWidths: { name: 0, caseType: 0 },
  });
  const resizeObserver = useRef(null);

  // Calculate width for a single case item's sections
  const calculateItemWidth = (pinnedCase) => {
    if (!pinnedCase) return { nameWidth: 0, caseTypeWidth: 0 };

    const fullName = pinnedCase?.for_client
      ? `${pinnedCase.for_client.last_name}, ${pinnedCase.for_client.first_name}`
      : "";
    const nameWidth = fullName.length * CHAR_WIDTH + AVATAR_WIDTH + PADDING;

    const caseTypeName = pinnedCase?.case_type?.name || "";
    const caseTypeWidth =
      caseTypeName.length * CHAR_WIDTH + ICON_WIDTH + PADDING;

    const dateString = pinnedCase?.incident_date || "";
    const dateWidth = dateString.length * CHAR_WIDTH + ICON_WIDTH + PADDING;

    return {
      nameWidth,
      caseTypeWidth: Math.max(caseTypeWidth, dateWidth),
    };
  };

  const calculateLayout = () => {
    if (!containerRef.current || !pinnedCases.length) return;

    // First, calculate all widths and find maximum
    const allWidths = pinnedCases.map(calculateItemWidth);
    const maxWidths = {
      name: Math.max(...allWidths.map((w) => w.nameWidth)),
      caseType: Math.max(...allWidths.map((w) => w.caseTypeWidth)),
    };

    const totalItemWidth = maxWidths.name + maxWidths.caseType + PADDING;
    const containerWidth = containerRef.current.offsetWidth - 50;
    const maxItemsPerRow = Math.floor(containerWidth / totalItemWidth);

    // Organize into rows
    const rows = [];
    let currentRow = [];

    pinnedCases.forEach((pinnedCase) => {
      if (currentRow.length >= maxItemsPerRow) {
        rows.push(currentRow);
        currentRow = [];
      }
      currentRow.push(pinnedCase);
    });

    if (currentRow.length > 0) {
      rows.push(currentRow);
    }

    setLayout({ rows, maxWidths });
  };

  useEffect(() => {
    const fetchPinnedCases = async () => {
      try {
        const response = await axios.get(`${origin}/api/home/pinned-cases/`, {
          headers: { Authorization: token },
        });

        const pinnedArr = [
          response.data?.p1,
          response.data?.p2,
          response.data?.p3,
          response.data?.p4,
          response.data?.p5,
          response.data?.p6,
        ].filter(Boolean);
        setPinnedCases(pinnedArr);
      } catch (error) {
        console.log("Failed to fetch Pinned Data:", error);
      }
    };

    fetchPinnedCases();
  }, [origin, token]);

  useEffect(() => {
    if (!containerRef.current) return;

    calculateLayout();

    resizeObserver.current = new ResizeObserver(() => {
      requestAnimationFrame(() => {
        calculateLayout();
        const totalHeight =
          layout?.rows?.length * 42 + 5 * layout?.rows?.length;
        onHeightChange?.(totalHeight);
      });
    });

    resizeObserver.current.observe(containerRef.current);

    return () => {
      if (resizeObserver.current) {
        resizeObserver.current.disconnect();
      }
    };
  }, [pinnedCases, layout?.rows?.length]);

  useEffect(() => {
    const totalHeight = layout?.rows?.length * 42 + 5 * layout?.rows?.length;
    onHeightChange?.(totalHeight);
  }, [layout.rows.length]);

  return (
    <div
      className="content-top"
      style={{
        marginTop: "5px",
        maxHeight: `${layout?.rows?.length * 42 + 20}px`,
      }}
    >
      <div className="top-row">
        <div
          className="client-communication-wrapper w-100 custom-gutter"
          style={{
            marginLeft: "0px",
            height: `${
              layout?.rows?.length <= 1
                ? 42
                : layout?.rows?.length <= 2
                  ? 89
                  : layout?.rows?.length <= 3
                    ? 136
                    : layout?.rows?.length <= 4
                      ? 183
                      : layout?.rows?.length <= 5
                        ? 230
                        : 277
            }px`,
          }}
        >
          <div
            ref={containerRef}
            className="w-100"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "5px",
            }}
          >
            {layout.rows.map((row, rowIndex) => (
              <div key={rowIndex} className="d-flex" style={{ gap: "5px" }}>
                {row.map((pinnedCase, colIndex) => (
                  <div
                    key={colIndex}
                    className="d-flex justify-content-between align-items-center"
                    style={{
                      flex: "0 0 1",
                      minHeight: "42px",
                      flexGrow: 1,
                      backgroundColor:
                        (rowIndex + colIndex) % 2 === 0
                          ? "var(--primary-10)"
                          : "var(--primary-4)",
                    }}
                  >
                    <div
                      className="d-flex align-items-center content-section"
                      style={{
                        minWidth: `${layout.maxWidths.name}px`,
                        marginRight: "5px",
                        marginLeft: "5px",
                      }}
                    >
                      <span
                        className="ic ic-avatar ic-35 has-avatar-icon has-cover-img"
                        style={{
                          minWidth: "35px",
                          width: "35px",
                          flexShrink: 0,
                          border: "1px solid var(--primary-50)",
                        }}
                      >
                        {pinnedCase?.for_client?.profile_pic_29p && (
                          <img
                            className="output-3 theme-ring"
                            src={pinnedCase.for_client.profile_pic_29p}
                            alt="Client Profile"
                          />
                        )}
                      </span>
                      <span
                        className="m-l-5 text-black text-black-2 whitespace-nowrap"
                        style={{ fontWeight: "600" }}
                      >
                        {pinnedCase?.for_client
                          ? `${pinnedCase.for_client.last_name}, ${pinnedCase.for_client.first_name}`
                          : ""}
                      </span>
                    </div>
                    <div
                      className="d-flex flex-column"
                      style={{ width: `${layout.maxWidths.caseType}px` }}
                    >
                      <div className="d-flex align-items-center content-section">
                        <span
                          className="ic ic-19 d-flex align-items-center"
                          style={{
                            minWidth: "19px",
                            width: "19px",
                            flexShrink: 0,
                          }}
                        >
                          {pinnedCase?.case_type?.casetype_icon && (
                            <img
                              src={pinnedCase.case_type.casetype_icon}
                              alt="Case Type Icon"
                              style={{ width: "19px", height: "19px" }}
                            />
                          )}
                        </span>
                        <span
                          className="m-l-5 text-black text-black-2 whitespace-nowrap"
                          style={{ fontWeight: "600" }}
                        >
                          {pinnedCase?.case_type
                            ? pinnedCase.case_type.name
                            : ""}
                        </span>
                      </div>
                      <div className="d-flex align-items-center content-section">
                        <span
                          className="ic ic-19 ic-incident d-flex align-items-center"
                          style={{
                            minWidth: "19px",
                            width: "19px",
                            flexShrink: 0,
                          }}
                        ></span>
                        <span
                          className="text-black m-l-5"
                          style={{ fontWeight: "600" }}
                        >
                          {formatDateForPanelDisplay(
                            pinnedCase?.incident_date
                          ) || ""}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div>
            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              className="background-main-10 p-0 mr-0 pinned-casse-btn"
            >
              <img
                src={settingsIcon}
                alt="Settings Icon"
                style={{ width: "32px", height: "32px" }}
              />
              User <br /> Options
            </button>
          </div>
        </div>
      </div>

      {isSettingsOpen && (
        <UserPreference
          UserPreference={isSettingsOpen}
          handleClose={() => setIsSettingsOpen(false)}
        />
      )}
    </div>
  );
};

export default Chats;
