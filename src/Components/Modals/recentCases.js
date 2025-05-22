import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCommulativeChecklist } from "../../Redux/search/actions";
import { calculateAge } from "../../Utils/helper";
import { Stages } from "../common/CaseStage";
import { CustomDropdown } from "../common/Dropdown";

const RecentCases = ({ show }) => {
  return (
    <>
      {show && (
        <>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "var(--primary-2)",
              zIndex: 999, // Ensure the backdrop is below the sheet
              pointerEvents: "none", // Allows clicks to pass through
            }}
          ></div>

          <div
            style={{
              position: "absolute",
              top: 85, // Position directly below the button
              width: "90%",
              padding: "10px",
              left: 140,
              border: "1px solid #ccc",
              boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
              backgroundColor: "#fff",
              zIndex: 1000, // Ensure it appears above the backdrop
              pointerEvents: "auto", // Ensure the sheet is interactive
              overflowY: "scroll", // Enable vertical scrolling
              maxHeight: "90vh", // Example max-height, adjust based on your needs
            }}
          >
            <PreviousClients />
          </div>
        </>
      )}
    </>
  );
};

const PreviousClients = ({ page }) => {
  const dispatch = useDispatch();
  const currentCase = useSelector((state) => state?.caseData?.current);
  const client = useSelector((state) => state?.client?.current);
  const commutativeChecklist = useSelector(
    (state) => state?.caseData?.commutativeChecklist
  );
  const lastAccessedCases = useSelector(
    (state) => state?.caseData?.lastAccessedCases
  );

  const [dropdownItems, setDropdownItems] = useState([]);

  useEffect(() => {
    if (client && currentCase) {
      dispatch(fetchCommulativeChecklist(client.id, currentCase.id));
    }
  }, [dispatch, client, currentCase]);

  useEffect(() => {
    if (commutativeChecklist && commutativeChecklist.all_checklists) {
      let items = [];

      const titlesOfInterest = [
        "client",
        "treatment",
        "defendants",
        "insurance",
        "loans",
        "costs",
      ];
      let index = 0;
      let colors = [
        "#009900",
        "#646464",
        "#0EA5E9",
        "#D4D4D4",
        "#646464",
        "#007bff",
      ];
      Object.keys(commutativeChecklist.all_checklists).forEach((key) => {
        const checklist = commutativeChecklist.all_checklists[key];
        const normalizedKey = key.toLowerCase();

        if (titlesOfInterest.includes(normalizedKey)) {
          let icon = "/bp_assets/img/check-icon.png"; // Default icon
          let progress;

          if (Array.isArray(checklist)) {
            const iconItem = checklist.find(
              (item) => item.page && item.page.page_icon
            );
            icon = iconItem ? iconItem.page.page_icon : icon; // Use the found icon or default
            progress =
              typeof checklist[checklist.length - 1] === "number"
                ? checklist[checklist.length - 1]
                : undefined;
          }

          items.push({
            progress: progress,
            icon: icon,
            title: key + " Page",
            color: colors[index],
          });
          index++;
        }
      });

      setDropdownItems(items);
    }
  }, [commutativeChecklist]);

  return (
    <div>
      {lastAccessedCases &&
        lastAccessedCases &&
        lastAccessedCases.map((temp, index) => (
          <div key={index} className="d-flex flex-column users-incident-popup">
            <div>
              <div className="client-details-wrap-area d-flex align-items-center">
                <div
                  className="d-flex align-items-center"
                  style={{ minWidth: "400px", gap: "10px" }}
                >
                  <div className="client-image position-relative">
                    <a
                      href={
                        page
                          ? `/bp-switch_client/${temp.for_client.id}/${temp.id}/${page.name}`
                          : `/bp-switch_client/${temp.for_client.id}/${temp.id}/Case`
                      }
                    >
                      {temp.for_client.profile_pic_63p ? (
                        <img
                          src={temp.for_client.profile_pic_63p}
                          alt={`${temp.for_client.first_name} ${temp.for_client.last_name}`}
                        />
                      ) : (
                        <i className="ic ic-client-avatar h-100 w-100"></i>
                      )}
                    </a>
                  </div>
                  <div className="client-info col p-0">
                    <div className="client-name d-flex align-items-center">
                      <a
                        href={
                          page
                            ? `/bp-switch_client/${temp.for_client.id}/${temp.id}/${page.name}`
                            : `/bp-switch_client/${temp.for_client.id}/${temp.id}/Case`
                        }
                        className="clientTabFont d-block"
                      >
                        {temp.for_client.last_name}
                        <span className="Header-color-grey">,</span>
                        {temp.for_client.first_name}
                      </a>
                    </div>

                    <div className="d-flex align-items-center">
                      <a
                        href={
                          page
                            ? `/bp-switch_client/${temp.for_client.id}/${temp.id}/${page.name}`
                            : `/bp-switch_client/${temp.for_client.id}/${temp.id}/Case`
                        }
                        className="js-acc-btn text-black accident-type d-flex align-items-center"
                        style={{ textDecoration: "none" }}
                      >
                        {temp.for_client.primary_phone &&
                          temp.for_client.primary_phone.phone_number && (
                            <span className="text-black font-weight-normal">
                              (
                              {temp.for_client.primary_phone.phone_number.slice(
                                0,
                                3
                              )}
                              )
                              {temp.for_client.primary_phone.phone_number.slice(
                                3,
                                6
                              )}
                              -
                              {temp.for_client.primary_phone.phone_number.slice(
                                6
                              )}
                            </span>
                          )}
                      </a>
                      <a
                        href={
                          page
                            ? `/bp-switch_client/${temp.for_client.id}/${temp.id}/${page.name}`
                            : `/bp-switch_client/${temp.for_client.id}/${temp.id}/Case`
                        }
                        className="js-acc-btn text-black accident-date ml-auto text-decoration-none"
                      >
                        <span className="client-age d-flex ml-auto">
                          <span className="text-grey">Age</span>
                          <span className="text-black ml-1 font-weight-semibold">
                            {calculateAge(new Date(temp.for_client.birthday))}
                          </span>
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
                {/* Pages */}

                <ul className="previous-clients-nav">
                  {lastAccessedCases.pages &&
                    lastAccessedCases.pages.map((item, index) => {
                      return (
                        <>
                          {item.show_on_sidebar && (
                            <li key={index}>
                              <a>
                                <img
                                  src={
                                    process.env.REACT_APP_S3_URL +
                                    "/" +
                                    item.page_icon
                                  }
                                  alt={item.name}
                                />
                                {item.name}
                              </a>
                            </li>
                          )}
                        </>
                      );
                    })}
                </ul>
              </div>
              <div className="d-flex check-detail-items">
                <div
                  style={{
                    display: "flex",
                    minWidth: "400px",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <div className="d-flex justify-content-between">
                      <p className="font-weight-semibold ml-m7-px-PH">
                        {temp?.case_type?.name}
                      </p>
                    </div>
                    <p className="font-weight-semibold m-">
                      <span class="text-dark-grey">DOI:</span>{" "}
                      {temp.date_open &&
                        new Date(temp.incident_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <div className="d-flex justify-content-between">
                      <p className="font-weight-semibold ml-m7-px-PH">
                        <span class="text-dark-grey">OPEN:</span>{" "}
                        {temp.date_open &&
                          new Date(temp.date_open).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="font-weight-semibold m-">
                      <span class="text-dark-grey">CLOSED:</span>{" "}
                      {temp.date_closed &&
                        new Date(temp.date_closed).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <Stages
                  stages={lastAccessedCases.stages}
                  stageCase={lastAccessedCases.case}
                />

                <div class="to-do-flag-wrapper pb-0 col-auto">
                  <small class="pr-2 pr-lg-5 text-center">
                    <div class="text-label">To-Dos</div>
                    <h3>{currentCase?.current_todos}</h3>
                  </small>
                  <div
                    class="flagged-icon-wrap text-right"
                    id="flagged_icon_div"
                  >
                    {lastAccessedCases.flag_page ? (
                      <div
                        class="d-flex align-items-center"
                        onclick="remove_flag('{{flagPage.id }}')"
                      >
                        <i class="ic ic-45 ic-flag-red cursor-pointer"></i>
                      </div>
                    ) : (
                      <div
                        class="d-flex align-items-center"
                        onclick="flag_page()"
                      >
                        <i class="ic ic-45 ic-flag-grey d-flex cursor-pointer"></i>
                      </div>
                    )}
                  </div>
                </div>
                <CustomDropdown items={dropdownItems} />
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default RecentCases;
