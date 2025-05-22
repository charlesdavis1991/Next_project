import React, { useState, useEffect } from "react";
import { Dropdown } from "react-bootstrap";
import { fetchPagePanels } from "../../Providers/main";
import { useDispatch, useSelector } from "react-redux";
// import { setUnsortedCase, setUnsortedPage, setTabsToShow } from '../../Redux/inbox/actions';

const NestedDropdown = (props) => {
  const dispatch = useDispatch();

  const [showNestedDropdown, setShowNestedDropdown] = useState(true);
  const [selectedItem, setSelectedItem] = useState({
    icon: null,
    name: "Select Page",
  });
  const [selectedPage, setSelectedPage] = useState(`Select Page First`);
  const [selectedPageName, setSelectedPageName] = useState();
  const [selectedPageId, setSelectedPageId] = useState();
  const [selectedPageHasPanels, setSelectedPageHasPanels] = useState(false);

  const [selectedPanelId, setSelectedPanelId] = useState("-1");
  const [selectedPanelName, setSelectedPanelName] = useState("");
  const [nestedDropdowns, setNestedDropdowns] = useState([]);

  // const [unsortedCase, setUnsortedCase] = useState(true)
  // const [unsortedPage, setUnsortedPage] = useState(true)
  const [tabsToShow, setTabsToShow] = useState({});

  // unsortedCase: true,
  // unsortedPage: true,
  // tabsToShow: {},
  // const unsortedCase = useSelector((state) => state.inbox.unsortedCase);
  // const unsortedPage = useSelector((state) => state.inbox.unsortedPage);
  // const tabsToShow = useSelector((state) => state.inbox.tabsToShow);

  // const nestedDropdowns = useSelector((state) => state.inbox.nestedDropdowns);
  // const selectedPanelId = useSelector((state) => state.inbox.selectedPanelId);
  // const selectedPanelName = useSelector((state) => state.inbox.selectedPanelName);

  const handlePanelClick = (panel_id, panel_name, unsorted = false) => {
    const dropdowns = [...document.querySelectorAll("#dropdown-2")];
    dropdowns.forEach((dropdown) => {
      dropdown.classList.remove("show");
    });
    console.log(panel_id, panel_name, unsorted);
    if (unsorted) {
      props.setUnsortedPage(true);
      setSelectedPanelId("-1");
      setSelectedPanelName("");
      setZeroPanelSelected(false);
    } else {
      props.setUnsortedPage(false);
      setSelectedPanelId(panel_id.toString());
      setSelectedPanelName(panel_name);
      setZeroPanelSelected(false);
      props.setSelectedData({
        page_id: selectedPageId,
        slot: 0,
        panel: panel_id,
      });
    }
  };

  const [zeroPanelSelected, setZeroPanelSelected] = useState(false);

  const handlePanelClic2 = (item, page_id, slot, unsorted = false) => {
    const dropdowns = [...document.querySelectorAll("#dropdown-2")];
    dropdowns.forEach((dropdown) => {
      dropdown.classList.remove("show");
    });
    if (unsorted) {
      props.setUnsortedPage(true);
      setSelectedPanelId("-1");
      setSelectedPanelName("");
    } else {
      props.setUnsortedPage(false);
      setSelectedPanelName(item);
      setZeroPanelSelected(true);
      props.setSelectedData({
        page_id: selectedPageId,
        slot: slot,
        panel: "-1",
      });
    }
  };

  const handleItemClick = (item, page_id, slot, unsorted = false) => {
    console.log(page_id);
    const dropdowns = [...document.querySelectorAll("#dropdown-3")];
    dropdowns.forEach((dropdown) => {
      dropdown.classList.remove("show");
    });
    if (unsorted) {
      props.setUnsortedPage(true);
    } else {
      props.setUnsortedPage(false);
      setSelectedPage(item);
      props.setSelectedData({
        page_id: page_id,
        slot: slot,
        panel: selectedPanelId,
      });
    }
  };

  const handlePageSelect = (
    page_icon,
    page_id,
    page_name,
    panels,
    unsorted = false
  ) => {
    console.log(unsorted);
    console.log(page_id);
    const dropdowns = [...document.querySelectorAll("#dropdown-1")];
    dropdowns.forEach((dropdown) => {
      dropdown.classList.remove("show");
    });
    if (unsorted) {
      props.setUnsortedCase(true);
      setTabsToShow({ page: true, panels: false, rows: false });
    } else {
      setTabsToShow({ page: true, panels: true, rows: true });
      props.setUnsortedCase(false);
      setSelectedPageHasPanels(panels);
      setSelectedPageId(page_id);
      setSelectedPageName(page_name);
      // setSelectedPage("Attach to "+page_name)
      setSelectedItem({ icon: page_icon, name: page_name });
      props.setSelectedData({ page_id: page_id, slot: 0, panel: "-1" });
      fetchPagePanels(props.case?.id, page_id, page_name, setNestedDropdowns);
    }
  };

  const dropdownAlignFunc = () => {
    const paragraphWidth = document.querySelector(".pdf-filename").offsetWidth;
    const dropdown1 = document.querySelector(".dropdown-1");
    dropdown1.style.width = paragraphWidth + "px !important";
  };
  useEffect(() => {
    document.addEventListener("DOMContentLoaded", dropdownAlignFunc);
  }, []);

  console.log(`Select Page: ${props.unsortedCase}`);
  console.log(`unsorted to Page: ${props.unsortedPage}`);
  console.log(`nested dropdown: ${JSON.stringify(nestedDropdowns)}`);
  console.log(`tabs to show: ${JSON.stringify(tabsToShow)}`);
  console.log(`panel name: ${selectedPanelName}`);
  console.log(`case ID: ${props.case?.id}`);

  console.log(nestedDropdowns?.data);

  return (
    <>
      <Dropdown
        id="dropdown-1"
        className="m-b-5 custom-dropdown-wrapper d-inline-block1"
      >
        <div
          style={{ width: "100%" }}
          className="position custom-dropdown-opener"
        >
          <Dropdown.Toggle
            id="dropdown-custom"
            className={`bg-white dropdown-toggle form-select has-no-bg text-left d-flex align-items-center height-25 btn btn-default hover-black-text`}
            variant="secondary"
            style={{ width: "100%", content: "none" }}
          >
            <b>
              {props.unsortedCase ? (
                "Select Page"
              ) : (
                <>
                  {selectedItem.icon && (
                    <img
                      src={selectedItem.icon}
                      alt="Page Icon"
                      className="mr-2 inbox-width-15px-height-15px"
                    />
                  )}
                  {selectedItem.name}
                </>
              )}
            </b>
            <span className="ic has-no-after ic-arrow text-white d-flex align-items-center justify-content-center ml-auto">
              <svg
                width="34"
                height="17"
                viewBox="0 0 34 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.00683594 0H9.20684L17.0069 7.85384L24.807 0H34.007L17.0069 17L0.00683594 0Z"
                  fill="#203f64"
                ></path>
              </svg>
            </span>
          </Dropdown.Toggle>
        </div>

        <Dropdown.Menu
          className="dropdown-menu w-100 p-0 add-menu"
          id="dropdown-custom-menu"
          style={{
            backgroundColor: "#fafbfc",
            top: "0",
            width: "253px !important",
            position: "fixed !important",
          }}
        >
          <div
            className="dropdown-parent neg-margin-0"
            style={{ width: "inherit" }}
          >
            <div
              className="inbox-dropdown-custom-col"
              style={{ backgroundColor: "#fafbfc" }}
            >
              <Dropdown
                show={showNestedDropdown}
                className="dropdown-submenu w-100"
                style={{ height: "30px", minWidth: "inherit" }}
              >
                <Dropdown.Toggle
                  className="dropdown-submenu dropdown-item w-100 pl-2"
                  variant="secondary"
                  style={{ width: "100%", height: "inherit" }}
                  as={"a"}
                  onClick={(event) => handlePageSelect(null, null, null, true)}
                >
                  <span
                    className="has-no-after text-primary right-0 pr-2"
                    style={{ display: "inline-block" }}
                  >
                    <svg
                      width="15"
                      className="vertical-align-mid remove-hover-effect Rot-270Deg"
                      height="15"
                      viewBox="0 0 34 17"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0.00683594 0H9.20684L17.0069 7.85384L24.807 0H34.007L17.0069 17L0.00683594 0Z"
                        fill="#203f64"
                      ></path>
                    </svg>
                  </span>
                  Select Page
                </Dropdown.Toggle>
              </Dropdown>
            </div>
            {props.case
              ? props.case?.selected_pages?.map((selected_page, index) => (
                  <div
                    key={index}
                    className="inbox-dropdown-custom-col"
                    style={{ backgroundColor: "#fafbfc" }}
                  >
                    <Dropdown
                      show={showNestedDropdown}
                      className="dropdown-submenu w-100"
                      style={{ height: "30px", minWidth: "inherit" }}
                    >
                      <Dropdown.Toggle
                        className="dropdown-submenu dropdown-item w-100 pl-2"
                        variant="secondary"
                        style={{ width: "100%", height: "inherit" }}
                        as={"a"}
                        onClick={(event) =>
                          handlePageSelect(
                            selected_page?.page_icon,
                            selected_page?.id,
                            selected_page?.name,
                            selected_page?.panels
                          )
                        }
                      >
                        <span
                          className="has-no-after text-primary right-0 m-r-5"
                          style={{ display: "inline-block" }}
                        >
                          <svg
                            width="15"
                            className="vertical-align-mid remove-hover-effect Rot-270Deg"
                            height="15"
                            viewBox="0 0 34 17"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M0.00683594 0H9.20684L17.0069 7.85384L24.807 0H34.007L17.0069 17L0.00683594 0Z"
                              fill="#203f64"
                            ></path>
                          </svg>
                        </span>
                        {selected_page?.page_icon && (
                          <img
                            src={selected_page?.page_icon}
                            alt="Page Icon"
                            className="mr-2 inbox-width-15px-height-15px"
                          />
                        )}
                        {selected_page?.name}
                      </Dropdown.Toggle>
                    </Dropdown>
                  </div>
                ))
              : null}
          </div>
        </Dropdown.Menu>

        {/* End Nested Dropdown */}
      </Dropdown>

      {nestedDropdowns?.data == undefined ||
      nestedDropdowns?.data?.length == 0 ? (
        <Dropdown
          id="dropdown-3"
          className="m-b-5 custom-dropdown-wrapper d-inline-block"
        >
          <div
            style={{ width: "100%" }}
            className="position custom-dropdown-opener"
          >
            <Dropdown.Toggle
              id="dropdown-custom"
              className={`${tabsToShow ? (tabsToShow["rows"] == true ? "bg-white" : "grey-out") : "grey-out"} dropdown-toggle form-select has-no-bg text-left d-flex align-items-center height-25 btn btn-default hover-black-text`}
              variant="secondary"
              style={{ width: "100%" }}
            >
              <p
                style={{ fontWeight: "700" }}
                className="d-flex align-items-center"
              >
                {nestedDropdowns?.data?.length == 0 && props.unsortedPage ? (
                  `Select Slot`
                ) : (
                  <>
                    {selectedPage &&
                      !selectedPage.startsWith("Unsorted") &&
                      selectedPage !== "Select Slot" && (
                        <span className="m-r-5">
                          <i className="d-inline-flex ic-19 ic-custom-icon-cloud-2 cursor-pointer img-19px"></i>
                        </span>
                      )}
                    <span>{selectedPage}</span>
                  </>
                )}
              </p>
              <span className="ic has-no-after ic-arrow text-white d-flex align-items-center justify-content-center ml-auto">
                <svg
                  width="34"
                  height="17"
                  viewBox="0 0 34 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0.00683594 0H9.20684L17.0069 7.85384L24.807 0H34.007L17.0069 17L0.00683594 0Z"
                    fill="#203f64"
                  ></path>
                </svg>
              </span>
            </Dropdown.Toggle>
          </div>

          <Dropdown.Menu
            className="dropdown-menu w-100 p-0 add-menu"
            id="dropdown-custom-menu"
            style={{ backgroundColor: "#fafbfc" }}
          >
            <div
              className="dropdown-parent neg-margin-0"
              style={{ width: "inherit" }}
            >
              {nestedDropdowns?.document_slots &&
              nestedDropdowns?.document_slots?.length > 0
                ? nestedDropdowns?.document_slots?.map((dropdown, index) =>
                    dropdown?.slot_number != 0 ? (
                      <div
                        key={index}
                        className="inbox-dropdown-custom-col"
                        style={{ backgroundColor: "#fafbfc" }}
                      >
                        <Dropdown
                          show={showNestedDropdown}
                          className="dropdown-submenu w-100"
                          style={{
                            height: "30px",
                            minWidth: "inherit",
                            backgroundColor: "#fafbfc",
                          }}
                        >
                          <Dropdown.Toggle
                            className="dropdown-submenu dropdown-item w-100 pl-2"
                            variant="secondary"
                            style={{ width: "100%", height: "inherit" }}
                            as={"a"}
                            onClick={() =>
                              handleItemClick(
                                `${dropdown?.slot_number}. ${dropdown?.slot_name ? dropdown?.slot_name : "Available"}`,
                                selectedPageId,
                                dropdown?.id
                              )
                            }
                          >
                            <span
                              className="has-no-after text-primary right-0 m-r-5 pr-2"
                              style={{ display: "inline-block" }}
                            >
                              <svg
                                width="15"
                                className="vertical-align-mid remove-hover-effect Rot-270Deg"
                                height="15"
                                viewBox="0 0 34 17"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M0.00683594 0H9.20684L17.0069 7.85384L24.807 0H34.007L17.0069 17L0.00683594 0Z"
                                  fill="#203f64"
                                ></path>
                              </svg>
                            </span>
                            {dropdown?.slot_number}.{" "}
                            {dropdown?.slot_name
                              ? dropdown?.slot_name
                              : "Available"}
                          </Dropdown.Toggle>
                        </Dropdown>
                      </div>
                    ) : dropdown?.slot_number === 0 ? (
                      <div
                        key={index}
                        className="inbox-dropdown-custom-col"
                        style={{ backgroundColor: "#fafbfc" }}
                      >
                        <Dropdown
                          show={showNestedDropdown}
                          className="dropdown-submenu w-100"
                          style={{
                            height: "30px",
                            minWidth: "inherit",
                            backgroundColor: "#fafbfc",
                          }}
                        >
                          <Dropdown.Toggle
                            className="dropdown-submenu dropdown-item w-100 pl-2"
                            variant="secondary"
                            style={{ width: "100%", height: "inherit" }}
                            as={"a"}
                            onClick={() =>
                              handleItemClick(
                                `${dropdown?.slot_number}. ${dropdown?.slot_name ? dropdown?.slot_name : "Available"}`,
                                selectedPageId,
                                dropdown?.id
                              )
                            }
                          >
                            <span
                              className="has-no-after text-primary right-0 m-r-5 pr-2"
                              style={{ display: "inline-block" }}
                            >
                              <svg
                                width="15"
                                className="vertical-align-mid remove-hover-effect Rot-270Deg"
                                height="15"
                                viewBox="0 0 34 17"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M0.00683594 0H9.20684L17.0069 7.85384L24.807 0H34.007L17.0069 17L0.00683594 0Z"
                                  fill="#203f64"
                                ></path>
                              </svg>
                            </span>
                            {dropdown?.slot_number}.{" "}
                            {dropdown?.slot_name
                              ? dropdown?.slot_name
                              : "Available"}
                          </Dropdown.Toggle>
                        </Dropdown>
                      </div>
                    ) : null
                  )
                : null}
            </div>
          </Dropdown.Menu>
        </Dropdown>
      ) : null}

      {nestedDropdowns?.data?.length > 0 && (
        <Dropdown
          id="dropdown-2"
          className="custom-dropdown-wrapper d-inline-block"
        >
          <div
            style={{ width: "100%" }}
            className="position custom-dropdown-opener"
          >
            <Dropdown.Toggle
              id="dropdown-custom"
              className={`${tabsToShow ? (tabsToShow["panels"] == true && nestedDropdowns?.data?.length > 0 ? "bg-white" : "grey-out") : "grey-out"} dropdown-toggle form-select has-no-bg text-left d-flex align-items-center height-25 btn btn-default hover-black-text`}
              variant="secondary"
              style={{ width: "100%" }}
            >
              <b>
                {props.unsortedPage
                  ? `Select Panel`
                  : !selectedPanelName?.includes("Select Panel")
                    ? "Selected Panel: " +
                      (selectedPanelName ? selectedPanelName : "")
                    : selectedPanelName}
              </b>
              <span className="ic has-no-after ic-arrow text-white d-flex align-items-center justify-content-center ml-auto">
                <svg
                  width="34"
                  height="17"
                  viewBox="0 0 34 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0.00683594 0H9.20684L17.0069 7.85384L24.807 0H34.007L17.0069 17L0.00683594 0Z"
                    fill="#203f64"
                  ></path>
                </svg>
              </span>
            </Dropdown.Toggle>
          </div>

          <Dropdown.Menu
            className="dropdown-menu w-100 p-0 add-menu"
            id="dropdown-custom-menu"
            style={{ backgroundColor: "#fafbfc" }}
          >
            <div
              className="dropdown-parent neg-margin-0"
              style={{ width: "inherit" }}
            >
              {nestedDropdowns?.document_slots &&
              nestedDropdowns?.document_slots?.length > 0
                ? nestedDropdowns?.document_slots?.map((dropdown, index) =>
                    dropdown?.slot_number === 0 ? (
                      <div
                        key={index}
                        className="inbox-dropdown-custom-col"
                        style={{ backgroundColor: "#fafbfc" }}
                      >
                        <Dropdown
                          show={showNestedDropdown}
                          className="dropdown-submenu w-100"
                          style={{
                            height: "30px",
                            minWidth: "inherit",
                            backgroundColor: "#fafbfc",
                          }}
                        >
                          <Dropdown.Toggle
                            className="dropdown-submenu dropdown-item w-100 pl-2"
                            variant="secondary"
                            style={{ width: "100%", height: "inherit" }}
                            as={"a"}
                            onClick={() =>
                              handlePanelClic2(
                                `${dropdown?.slot_number}. ${dropdown?.slot_name ? dropdown?.slot_name : "Available"}`,
                                selectedPageId,
                                dropdown?.id
                              )
                            }
                          >
                            <span
                              className="has-no-after text-primary  right-0 m-r-5 pr-2"
                              style={{ display: "inline-block" }}
                            >
                              <svg
                                width="15"
                                className="vertical-align-mid remove-hover-effect Rot-270Deg"
                                height="15"
                                viewBox="0 0 34 17"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M0.00683594 0H9.20684L17.0069 7.85384L24.807 0H34.007L17.0069 17L0.00683594 0Z"
                                  fill="#203f64"
                                ></path>
                              </svg>
                            </span>
                            {dropdown?.slot_number}.{" "}
                            {dropdown?.slot_name
                              ? dropdown?.slot_name
                              : "Available"}
                          </Dropdown.Toggle>
                        </Dropdown>
                      </div>
                    ) : null
                  )
                : null}
              {nestedDropdowns?.data
                ? nestedDropdowns?.data?.map((dropdown, index) =>
                    dropdown?.panel_name != "" ? (
                      <div
                        key={index}
                        className="inbox-dropdown-custom-col"
                        style={{ backgroundColor: "#fafbfc" }}
                      >
                        <Dropdown
                          show={showNestedDropdown}
                          className="dropdown-submenu w-100"
                          style={{
                            height: "30px",
                            minWidth: "inherit",
                            backgroundColor: "#fafbfc",
                          }}
                        >
                          <Dropdown.Toggle
                            className="dropdown-submenu dropdown-item w-100 pl-2"
                            variant="secondary"
                            style={{ width: "100%", height: "inherit" }}
                            as={"a"}
                            onClick={() =>
                              handlePanelClick(dropdown.id, dropdown.panel_name)
                            }
                          >
                            <span
                              className="has-no-after text-primary right-0 m-r-5 pr-2"
                              style={{ display: "inline-block" }}
                            >
                              <svg
                                width="15"
                                className="vertical-align-mid remove-hover-effect Rot-270Deg"
                                height="15"
                                viewBox="0 0 34 17"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M0.00683594 0H9.20684L17.0069 7.85384L24.807 0H34.007L17.0069 17L0.00683594 0Z"
                                  fill="#203f64"
                                ></path>
                              </svg>
                            </span>
                            {index + 1}. {dropdown?.panel_name}
                          </Dropdown.Toggle>
                        </Dropdown>
                      </div>
                    ) : null
                  )
                : null}
              <Dropdown
                show={showNestedDropdown}
                className="dropdown-submenu w-100"
                style={{
                  height: "30px",
                  minWidth: "inherit",
                  backgroundColor: "#fafbfc",
                }}
              >
                <Dropdown.Toggle
                  className="dropdown-submenu dropdown-item w-100 pl-2"
                  variant="secondary"
                  style={{ width: "100%" }}
                  as={"a"}
                  onClick={() => handlePanelClick("-1", "")}
                >
                  Select Panel
                </Dropdown.Toggle>
              </Dropdown>
            </div>
          </Dropdown.Menu>
        </Dropdown>
      )}

      {!zeroPanelSelected ? (
        <Dropdown
          id="dropdown-3"
          className="custom-dropdown-wrapper d-inline-block"
        >
          <div
            style={{ width: "100%" }}
            className="position custom-dropdown-opener"
          >
            <Dropdown.Toggle
              id="dropdown-custom"
              className={`${tabsToShow ? (tabsToShow["rows"] == true && selectedPanelName ? "bg-white" : "grey-out") : "grey-out"} dropdown-toggle form-select has-no-bg text-left d-flex align-items-center height-25 btn btn-default hover-black-text`}
              variant="secondary"
              style={{ width: "100%" }}
            >
              <p
                style={{ fontWeight: "700" }}
                className="d-flex align-items-center"
              >
                {nestedDropdowns?.data?.length == 0 && props.unsortedPage ? (
                  `Unsorted to ${selectedPageName}`
                ) : (
                  <>
                    {selectedPage &&
                      !selectedPage.startsWith("Unsorted") &&
                      selectedPage !== "Select Page First" && (
                        <span className="m-r-5">
                          <i className="d-inline-flex ic-19 ic-custom-icon-cloud-2 cursor-pointer img-19px"></i>
                        </span>
                      )}
                    <span>{selectedPage}</span>
                  </>
                )}
              </p>
              <span className="ic has-no-after ic-arrow text-white d-flex align-items-center justify-content-center ml-auto">
                <svg
                  width="34"
                  height="17"
                  viewBox="0 0 34 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0.00683594 0H9.20684L17.0069 7.85384L24.807 0H34.007L17.0069 17L0.00683594 0Z"
                    fill="#203f64"
                  ></path>
                </svg>
              </span>
            </Dropdown.Toggle>
          </div>

          <Dropdown.Menu
            className="dropdown-menu w-100 p-0 add-menu"
            id="dropdown-custom-menu"
            style={{ backgroundColor: "#fafbfc" }}
          >
            <div
              className="dropdown-parent neg-margin-0"
              style={{ width: "inherit" }}
            >
              {nestedDropdowns?.document_slots &&
              nestedDropdowns?.document_slots?.length > 0
                ? nestedDropdowns?.document_slots?.map((dropdown, index) =>
                    dropdown?.slot_number != 0 ? (
                      <div
                        key={index}
                        className="inbox-dropdown-custom-col"
                        style={{ backgroundColor: "#fafbfc" }}
                      >
                        <Dropdown
                          show={showNestedDropdown}
                          className="dropdown-submenu w-100"
                          style={{
                            height: "30px",
                            minWidth: "inherit",
                            backgroundColor: "#fafbfc",
                          }}
                        >
                          <Dropdown.Toggle
                            className="dropdown-submenu dropdown-item w-100 pl-2"
                            variant="secondary"
                            style={{ width: "100%", height: "inherit" }}
                            as={"a"}
                            onClick={() =>
                              handleItemClick(
                                `${dropdown?.slot_number}. ${dropdown?.slot_name ? dropdown?.slot_name : "Available"}`,
                                selectedPageId,
                                dropdown?.id
                              )
                            }
                          >
                            <span
                              className="has-no-after text-primary  right-0 m-r-5 pr-2"
                              style={{ display: "inline-block" }}
                            >
                              <svg
                                width="15"
                                className="vertical-align-mid remove-hover-effect Rot-270Deg"
                                height="15"
                                viewBox="0 0 34 17"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M0.00683594 0H9.20684L17.0069 7.85384L24.807 0H34.007L17.0069 17L0.00683594 0Z"
                                  fill="#203f64"
                                ></path>
                              </svg>
                            </span>
                            {dropdown?.slot_number}.{" "}
                            {dropdown?.slot_name
                              ? dropdown?.slot_name
                              : "Available"}
                          </Dropdown.Toggle>
                        </Dropdown>
                      </div>
                    ) : null
                  )
                : null}
              <Dropdown
                show={showNestedDropdown}
                className="dropdown-submenu w-100"
                style={{
                  height: "30px",
                  minWidth: "inherit",
                  backgroundColor: "#fafbfc",
                }}
              >
                <Dropdown.Toggle
                  className="dropdown-submenu dropdown-item w-30 pl-4 ml-2"
                  variant="secondary"
                  style={{ width: "30%", height: "50%" }}
                  as={"a"}
                  onClick={() =>
                    handleItemClick(
                      selectedItem.name?.replace(
                        "Save Document To",
                        "Attach to"
                      ),
                      selectedPageId,
                      ""
                    )
                  }
                >
                  <span
                    className="has-no-after text-primary right-0"
                    style={{ display: "inline-block" }}
                  >
                    <svg
                      width="15"
                      className="vertical-align-mid remove-hover-effect Rot-270Deg"
                      height="15"
                      viewBox="0 0 34 17"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0.00683594 0H9.20684L17.0069 7.85384L24.807 0H34.007L17.0069 17L0.00683594 0Z"
                        fill="#203f64"
                      ></path>
                    </svg>
                  </span>
                  {selectedItem.name?.replace("Save Document To", "Attach to")}
                </Dropdown.Toggle>
              </Dropdown>
            </div>
          </Dropdown.Menu>
        </Dropdown>
      ) : null}
    </>
  );
};

export default NestedDropdown;
