import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../../api/api";

const NotesCategoryDropdown = () => {
  const currentCase = useSelector((state) => state?.caseData?.current);
  const client = useSelector((state) => state?.client?.current);
  const tabsPage = useSelector((state) => state.caseData?.pages);

  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const setNoteCategory = (name) => {
    console.log("Selected category:", name); // You can replace this with your desired functionality
  };
  const [selectedPage, setSelectedPage] = useState({
    id: 1,
    name: "Case",
    html_template_name: "Case-original.html",
    page_url: "bp-case",
    order: 1,
    page_icon: "images/case-icon-color_gIGzPMA.svg",
    panels: false,
    document_slots: 0,
    show_on_sidebar: true,
    is_notes_category: true,
    actual_page_id: 2,
    panel_name: "",
  });

  async function fetchNotes() {
    if (client && currentCase) {
      const notes = await api.get(
        `/30/notes_section_tabs_api/${client?.id}/${currentCase?.id}`
      );
      console.log("notes: ", notes);
      return notes;
    }
    return [];
  }

  useEffect(() => {
    if (currentCase && client) {
      fetchNotes();
      //   dispatch(fetchCasePageData(client.id, currentCase.id));
    }
  }, [currentCase, client]);
  return (
    <div className="dropdown notes-category-wrapper m-r-5 m-l-5">
      <a
        className="dropdown-toggle footer-select notes-category text-left d-flex align-items-center height-25"
        href="#"
        role="button"
        id="dropdownMenuLink"
        onClick={handleToggle}
        aria-haspopup="true"
        aria-expanded={isOpen ? "true" : "false"}
      >
        {selectedPage.is_notes_category ? (
          <span className="d-flex align-items-center text-truncate">
            {selectedPage.page_icon ? (
              <img
                src={`${process.env.REACT_APP_S3_URL}/static/${selectedPage.page_icon}`}
                className="mr-1 notes-sec-width-19px-height-19px"
              />
            ) : (
              <i className="ic ic-notes ic-19 m-r-5"></i>
            )}
            {selectedPage.name}
          </span>
        ) : (
          <span className="d-flex align-items-center text-truncate">
            {casePageNote.page_icon ? (
              <img
                src={`${process.env.REACT_APP_S3_URL}/static/${casePageNote.page_icon}`}
                className="mr-1 notes-sec-width-19px-height-19px"
              />
            ) : (
              <i className="ic ic-notes ic-19 m-r-5"></i>
            )}
            {casePageNote.name}
          </span>
        )}
        <span className="ic ic-17 height-100 has-no-after ic-arrow text-primary d-flex align-items-center justify-content-center ml-auto">
          <svg
            width="34"
            height="17"
            viewBox="0 0 34 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.00683594 0H9.20684L17.0069 7.85384L24.807 0H34.007L17.0069 17L0.00683594 0Z"
              fill="currentColor"
            ></path>
          </svg>
        </span>
      </a>
      {isOpen && (
        <div
          className="dropdown-menu w-100 p-0"
          aria-labelledby="dropdownMenuLink"
          id="note_category"
        >
          {selectedPage.is_notes_category ? (
            <input
              type="hidden"
              id="note_assign_category"
              value={selectedPage.name}
            />
          ) : (
            <input type="hidden" id="note_assign_category" value="Case" />
          )}
          {tabsPage.map(
            (pageNote) =>
              pageNote.is_notes_category && (
                <a
                  key={pageNote.name}
                  className="dropdown-item height-25"
                  onClick={() => setNoteCategory(pageNote.name)}
                >
                  {pageNote.page_icon ? (
                    <img
                      src={pageNote.page_icon.url}
                      className="mr-1 notes-sec-width-19px-height-19px"
                    />
                  ) : (
                    <i className="ic ic-notes ic-19 m-r-5"></i>
                  )}
                  {pageNote.name}
                </a>
              )
          )}
        </div>
      )}
    </div>
  );
};

export default function NotesSection() {
  return (
    <div className="row">
      <div className="col-12">
        <div className="notes-section-wrapper">
          <div className="action-bar-wrapper heigh-35 position-relative mr-0 ">
            <div
              className="action-bar client-BarAlign d-flex m-b-5 m-t-5"
              style={{ left: 148 }}
            >
              <span className="page-icon">
                <img
                  className="translate-note-icon"
                  src="https://simplefirm-bucket.s3.amazonaws.com/static/BP_resources/images/icon/notes-icon-color.svg"
                />
              </span>
              <div className="text-wrapper text-white d-flex align-items-center ">
                <h2 className="text-white">Notes</h2>
              </div>
              <div className="btn-wrapper">
                <button
                  className="btn btn-primary rounded-0"
                  data-toggle="modal"
                  data-target="#import_csv-modal"
                >
                  <span className="font-weight-bold pr-2 text-gold">+</span>
                  Import
                </button>
              </div>
            </div>
          </div>
          <div
            className="col-lg-12 notes-section bg-primary-5 h-100 pl-0  p-r-15"
            id="notes_section_main_div"
          >
            <form
              method="POST"
              className="p-t-5 "
              id="notes-form"
              action="/30/addNotes/3/4/"
            >
              <div className="footer-line mr-2">
                <button
                  form="notes-form"
                  type="button"
                  onclick="addNotes('critical');addClickRecord(41, '1', false)"
                  className="ml-0 rounded-0 text-capital"
                >
                  <span className="btn-text-holder">Critical Case Note</span>
                </button>
              </div>
              <div className="notes-text-area">
                <textarea
                  onfocus="AddNoteInputRecord()"
                  onclick="addClickRecord(40, '1', false)"
                  onchange="$('.assign_todo_textarea').val($(this).val())"
                  id="w3review"
                  className="note_assign_text"
                  required=""
                  name="description"
                  placeholder="Input a Case Note, New To-Do, or Update the Case Status…"
                  defaultValue={""}
                />
              </div>
              <div className="footer-line">
                <button
                  form="notes-form"
                  type="button"
                  className="ml-2 rounded-0"
                  onclick="addNotes('update_case_status');addClickRecord(44, '1', false)"
                >
                  <span className="btn-text-holder">Update Case Status</span>
                </button>
              </div>
            </form>
            <form
              method="POST"
              id="todo-form"
              // action="/30/addTodo/3/4/"
            >
              {/* <textarea id="todo-note" hidden="" name="note"></textarea> */}
              <div className="footer-line">
                <div className="container-fluid">
                  <div className="row flex-wrap align-items-center justify-content-between dropdown-btn-row m-b-5">
                    <div className="col-12 col-md-auto d-flex align-items-center justify-content-end justify-content-xl-end col-left mb-0">
                      <button
                        className="btn btn-primary rounded-0 control-btn"
                        data-toggle="modal"
                        onclick="enable_assign_todo_btn();addClickRecord(42, '1', false)"
                        data-target="#assign_todo-modal"
                        type="button"
                      >
                        <span className="font-weight-bold pr-2 text-gold margin-b-08">
                          +
                        </span>
                        Assign Task
                      </button>
                    </div>
                    <div className="col-12 col-md-auto d-md-flex align-items-center justify-content-center justify-content-xl-end col-right mb-0">
                      <div className="d-flex align-items-center justify-content-center">
                        <span className="notes-category-label">
                          Note Category:
                        </span>
                        {/* <NotesCategoryDropdown /> */}
                        <div className="dropdown notes-category-wrapper m-r-5 m-l-5">
                          <button
                            className="dropdown-toggle footer-select notes-category text-left d-flex align-items-center height-25"
                            type="button"
                            data-toggle="dropdown"
                            aria-expanded="false"
                            id="dropdownMenuLink"
                            aria-haspopup="true"
                          >
                            <span className="d-flex align-items-center text-truncate">
                              <img
                                src="https://simplefirm-bucket.s3.amazonaws.com/static/images/case-icon-color_gIGzPMA.svg"
                                className="mr-1 notes-sec-width-19px-height-19px"
                              />
                              Case
                            </span>
                            <span className="ic ic-17 height-100 has-no-after ic-arrow text-primary d-flex align-items-center justify-content-center ml-auto">
                              <svg
                                width={34}
                                height={17}
                                viewBox="0 0 34 17"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M0.00683594 0H9.20684L17.0069 7.85384L24.807 0H34.007L17.0069 17L0.00683594 0Z"
                                  fill="currentColor"
                                />
                              </svg>
                            </span>
                          </button>
                          <div
                            className="dropdown-menu w-100 p-0"
                            aria-labelledby="dropdownMenuLink"
                            id="note_category"
                          >
                            <input
                              type="hidden"
                              id="note_assign_category"
                              defaultValue="Case"
                            />
                            <a
                              className="dropdown-item height-25"
                              onclick="setNoteCategory('Case')"
                            >
                              <img
                                src="https://simplefirm-bucket.s3.amazonaws.com/static/images/case-icon-color_gIGzPMA.svg"
                                className="mr-1 notes-sec-width-19px-height-19px"
                              />
                              Case
                            </a>
                            <a
                              className="dropdown-item height-25"
                              onclick="setNoteCategory('Client')"
                            >
                              <img
                                src="https://simplefirm-bucket.s3.amazonaws.com/static/images/client-icon-color_KismKtn.svg"
                                className="mr-1 notes-sec-width-19px-height-19px"
                              />
                              Client
                            </a>
                            <a
                              className="dropdown-item height-25"
                              onclick="setNoteCategory('Employment')"
                            >
                              <img
                                src="https://simplefirm-bucket.s3.amazonaws.com/static/images/employment-icon-color_wIVTQUO.svg"
                                className="mr-1 notes-sec-width-19px-height-19px"
                              />
                              Employment
                            </a>
                            <a
                              className="dropdown-item height-25"
                              onclick="setNoteCategory('Accident')"
                            >
                              <img
                                src="https://simplefirm-bucket.s3.amazonaws.com/static/images/car-accident-icon-color_w060Q2v.svg"
                                className="mr-1 notes-sec-width-19px-height-19px"
                              />
                              Accident
                            </a>
                            <a
                              className="dropdown-item height-25"
                              onclick="setNoteCategory('Reports')"
                            >
                              <img
                                src="https://simplefirm-bucket.s3.amazonaws.com/static/images/incident-folder-icon-color_ISjV4RF.svg"
                                className="mr-1 notes-sec-width-19px-height-19px"
                              />
                              Reports
                            </a>
                            <a
                              className="dropdown-item height-25"
                              onclick="setNoteCategory('Treatment')"
                            >
                              <img
                                src="https://simplefirm-bucket.s3.amazonaws.com/static/images/medical-treatment-icon-color_c8vboXY.svg"
                                className="mr-1 notes-sec-width-19px-height-19px"
                              />
                              Treatment
                            </a>
                            <a
                              className="dropdown-item height-25"
                              onclick="setNoteCategory('Injury')"
                            >
                              <img
                                src="https://simplefirm-bucket.s3.amazonaws.com/static/images/injuries-icon-color_V7G2kdz.svg"
                                className="mr-1 notes-sec-width-19px-height-19px"
                              />
                              Injury
                            </a>
                            <a
                              className="dropdown-item height-25"
                              onclick="setNoteCategory('To Do')"
                            >
                              <img
                                src="https://simplefirm-bucket.s3.amazonaws.com/static/images/to-do-icon-color_PyU3ldW.svg"
                                className="mr-1 notes-sec-width-19px-height-19px"
                              />
                              To Do
                            </a>
                            <a
                              className="dropdown-item height-25"
                              onclick="setNoteCategory('Defendants')"
                            >
                              <img
                                src="https://simplefirm-bucket.s3.amazonaws.com/static/images/defendants-icon-color-final.svg"
                                className="mr-1 notes-sec-width-19px-height-19px"
                              />
                              Defendants
                            </a>
                            <a
                              className="dropdown-item height-25"
                              onclick="setNoteCategory('Witnesses')"
                            >
                              <img
                                src="https://simplefirm-bucket.s3.amazonaws.com/static/images/witnesses-icon-color_iYKDd0f.svg"
                                className="mr-1 notes-sec-width-19px-height-19px"
                              />
                              Witnesses
                            </a>
                            <a
                              className="dropdown-item height-25"
                              onclick="setNoteCategory('Parties')"
                            >
                              <img
                                src="https://simplefirm-bucket.s3.amazonaws.com/static/images/other-parties-icon-color_i60nUMt.svg"
                                className="mr-1 notes-sec-width-19px-height-19px"
                              />
                              Parties
                            </a>
                            <a
                              className="dropdown-item height-25"
                              onclick="setNoteCategory('Insurance')"
                            >
                              <img
                                src="https://simplefirm-bucket.s3.amazonaws.com/static/images/insurance-icon-color_2pFtjE8.svg"
                                className="mr-1 notes-sec-width-19px-height-19px"
                              />
                              Insurance
                            </a>
                            <a
                              className="dropdown-item height-25"
                              onclick="setNoteCategory('Loans')"
                            >
                              <img
                                src="https://simplefirm-bucket.s3.amazonaws.com/static/images/case-loans-icon-color.svg"
                                className="mr-1 notes-sec-width-19px-height-19px"
                              />
                              Loans
                            </a>
                            <a
                              className="dropdown-item height-25"
                              onclick="setNoteCategory('Costs')"
                            >
                              <img
                                src="https://simplefirm-bucket.s3.amazonaws.com/static/images/costs-icon-color_Iw0rjvm.svg"
                                className="mr-1 notes-sec-width-19px-height-19px"
                              />
                              Costs
                            </a>
                            <a
                              className="dropdown-item height-25"
                              onclick="setNoteCategory('Settle')"
                            >
                              <img
                                src="https://simplefirm-bucket.s3.amazonaws.com/static/images/settlement-icon-color_lfIgUlF.svg"
                                className="mr-1 notes-sec-width-19px-height-19px"
                              />
                              Settle
                            </a>
                            <a
                              className="dropdown-item height-25"
                              onclick="setNoteCategory('Litigation')"
                            >
                              <img
                                src="https://simplefirm-bucket.s3.amazonaws.com/static/images/litigation-icon-color_5xPGzjY.svg"
                                className="mr-1 notes-sec-width-19px-height-19px"
                              />
                              Litigation
                            </a>
                            <a
                              className="dropdown-item height-25"
                              onclick="setNoteCategory('Discovery')"
                            >
                              <img
                                src="https://simplefirm-bucket.s3.amazonaws.com/static/images/discovery-icon-color_97Wb0rd.svg"
                                className="mr-1 notes-sec-width-19px-height-19px"
                              />
                              Discovery
                            </a>
                            <a
                              className="dropdown-item height-25"
                              onclick="setNoteCategory('Depos')"
                            >
                              <img
                                src="https://simplefirm-bucket.s3.amazonaws.com/static/images/depositions-icon-color_cSDmNUF.svg"
                                className="mr-1 notes-sec-width-19px-height-19px"
                              />
                              Depos
                            </a>
                            <a
                              className="dropdown-item height-25"
                              onclick="setNoteCategory('Experts')"
                            >
                              <img
                                src="https://simplefirm-bucket.s3.amazonaws.com/static/images/experts-icon-color_10hcaau.svg"
                                className="mr-1 notes-sec-width-19px-height-19px"
                              />
                              Experts
                            </a>
                            <a
                              className="dropdown-item height-25"
                              onclick="setNoteCategory('Time Page')"
                            >
                              <img
                                src="https://simplefirm-bucket.s3.amazonaws.com/static/images/time-a-clock-icon.svg"
                                className="mr-1 notes-sec-width-19px-height-19px"
                              />
                              Time Page
                            </a>
                          </div>
                        </div>
                      </div>
                      <button
                        className="btn btn-primary rounded-0 control-btn"
                        form="notes-form"
                        onclick="addNotes('note');addClickRecord(43, '1', false)"
                        type="button"
                      >
                        <span className="font-weight-bold pr-2 text-gold  margin-b-08">
                          +
                        </span>
                        Save Note
                      </button>
                    </div>
                  </div>
                </div>
                <nav className="row" id="other-parties-page">
                  <div className="col-lg-12 notetable px-0">
                    <div className="custom-tab">
                      <nav className="notes-nav-tabs">
                        <div
                          className="nav nav-tabs"
                          id="nav-tab-account-checks"
                          role="tablist"
                        >
                          <a
                            className="nav-item nav-link Pad8 tab-item active show"
                            id="custom-nav-all-tab"
                            data-toggle="tab"
                            href="#custom-nav-all"
                            role="tab"
                            aria-controls="custom-nav-all"
                            aria-selected="true"
                          >
                            All
                          </a>
                          <a
                            href="#event-log"
                            onclick="addClickRecord('1', false)"
                            id="event-log-tab"
                            role="tab"
                            aria-controls="event-log"
                            aria-selected="true"
                            data-toggle="tab"
                            className="custom-event-tab"
                          >
                            Event Log
                          </a>
                          <a
                            className="nav-item nav-link Pad8 tab-item"
                            id="custom-nav-12-tab"
                            data-toggle="tab"
                            href="#custom-nav-12"
                            role="tab"
                            aria-controls="custom-nav-12"
                            aria-selected="false"
                          >
                            Employment
                          </a>
                          <a
                            className="nav-item nav-link Pad8 tab-item"
                            id="custom-nav-5-tab"
                            data-toggle="tab"
                            href="#custom-nav-5"
                            role="tab"
                            aria-controls="custom-nav-5"
                            aria-selected="false"
                          >
                            Accident
                          </a>
                          <a
                            className="nav-item nav-link Pad8 tab-item"
                            id="custom-nav-14-tab"
                            data-toggle="tab"
                            href="#custom-nav-14"
                            role="tab"
                            aria-controls="custom-nav-14"
                            aria-selected="false"
                          >
                            Reports
                          </a>
                          <a
                            className="nav-item nav-link Pad8 tab-item"
                            id="custom-nav-2-tab"
                            data-toggle="tab"
                            href="#custom-nav-2"
                            role="tab"
                            aria-controls="custom-nav-2"
                            aria-selected="false"
                          >
                            Client
                          </a>
                          <a
                            className="nav-item nav-link Pad8 tab-item "
                            id="custom-nav-7-tab"
                            data-toggle="tab"
                            href="#custom-nav-7"
                            role="tab"
                            aria-controls="custom-nav-7"
                            aria-selected="false"
                          >
                            Injury
                          </a>
                          <a
                            className="nav-item nav-link Pad8 tab-item "
                            id="custom-nav-3-tab"
                            data-toggle="tab"
                            href="#custom-nav-3"
                            role="tab"
                            aria-controls="custom-nav-3"
                            aria-selected="false"
                          >
                            To Do
                          </a>
                          <a
                            className="nav-item nav-link Pad8 tab-item "
                            id="custom-nav-4-tab"
                            data-toggle="tab"
                            href="#custom-nav-4"
                            role="tab"
                            aria-controls="custom-nav-4"
                            aria-selected="false"
                          >
                            Defendants
                          </a>
                          <a
                            className="nav-item nav-link Pad8 tab-item "
                            id="custom-nav-10-tab"
                            data-toggle="tab"
                            href="#custom-nav-10"
                            role="tab"
                            aria-controls="custom-nav-10"
                            aria-selected="false"
                          >
                            Witnesses
                          </a>
                          <a
                            className="nav-item nav-link Pad8 tab-item "
                            id="custom-nav-9-tab"
                            data-toggle="tab"
                            href="#custom-nav-9"
                            role="tab"
                            aria-controls="custom-nav-9"
                            aria-selected="false"
                          >
                            Parties
                          </a>
                          <a
                            className="nav-item nav-link Pad8 tab-item "
                            id="custom-nav-11-tab"
                            data-toggle="tab"
                            href="#custom-nav-11"
                            role="tab"
                            aria-controls="custom-nav-11"
                            aria-selected="false"
                          >
                            Insurance
                          </a>
                          <a
                            className="nav-item nav-link Pad8 tab-item "
                            id="custom-nav-17-tab"
                            data-toggle="tab"
                            href="#custom-nav-17"
                            role="tab"
                            aria-controls="custom-nav-17"
                            aria-selected="false"
                          >
                            Loans
                          </a>
                          <a
                            className="nav-item nav-link Pad8 tab-item "
                            id="custom-nav-16-tab"
                            data-toggle="tab"
                            href="#custom-nav-16"
                            role="tab"
                            aria-controls="custom-nav-16"
                            aria-selected="false"
                          >
                            Costs
                          </a>
                          <a
                            className="nav-item nav-link Pad8 tab-item "
                            id="custom-nav-19-tab"
                            data-toggle="tab"
                            href="#custom-nav-19"
                            role="tab"
                            aria-controls="custom-nav-19"
                            aria-selected="false"
                          >
                            Litigation
                          </a>
                          <a
                            className="nav-item nav-link Pad8 tab-item "
                            id="custom-nav-20-tab"
                            data-toggle="tab"
                            href="#custom-nav-20"
                            role="tab"
                            aria-controls="custom-nav-20"
                            aria-selected="false"
                          >
                            Discovery
                          </a>
                          <a
                            className="nav-item nav-link Pad8 tab-item "
                            id="custom-nav-65-tab"
                            data-toggle="tab"
                            href="#custom-nav-65"
                            role="tab"
                            aria-controls="custom-nav-65"
                            aria-selected="false"
                          >
                            Experts
                          </a>
                          <a
                            className="nav-item nav-link Pad8 tab-item "
                            id="custom-nav-27-tab"
                            data-toggle="tab"
                            href="#custom-nav-27"
                            role="tab"
                            aria-controls="custom-nav-27"
                            aria-selected="false"
                          >
                            Critical
                          </a>
                          <a
                            className="nav-item nav-link Pad8 tab-item "
                            id="custom-nav-1-tab"
                            data-toggle="tab"
                            href="#custom-nav-1"
                            role="tab"
                            aria-controls="custom-nav-1"
                            aria-selected="false"
                          >
                            Case
                          </a>
                        </div>
                      </nav>
                      <div
                        className="tab-content notes-nav-tabContent"
                        id="nav-tabContent"
                      >
                        <div
                          className="tab-pane active show"
                          id="custom-nav-all"
                          role="tabpanel"
                          aria-labelledby="custom-nav-all-tab"
                        >
                          <div className="col-lg-12 px-0">
                            <div className="row">
                              <div
                                className="table--no-card rounded-0 border-0 w-100"
                                id="table-height"
                              >
                                <table
                                  className="table table-borderless table-striped table-earning has-height-25 fixed-table-header-notes-page"
                                  id="table-x"
                                >
                                  <thead className="toolbar-fonts">
                                    <tr
                                      id="tb-header"
                                      style={{
                                        backgroundColor: "rgba(225,57,95)",
                                        color: "white",
                                        textTransform: "uppercase",
                                      }}
                                    >
                                      <th
                                        className="table-col-1 note-col-1 x1"
                                        scope="col"
                                      />
                                      <th className="note-col-2 x2">Date</th>
                                      <th className="note-col-3 x3">Time</th>
                                      <th className="pl-42 td-autosize note-col-4 x4">
                                        User
                                      </th>
                                      <th className="notes-col note-col-5 x5">
                                        Note
                                      </th>
                                      <th className="note-col-6 x6">
                                        Category
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody
                                    id="table-body-cat"
                                    className="all_notes_tab fixed_column_width"
                                  >
                                    {Array.from({ length: 2 }).map((item) => (
                                      <tr className="" key={item}>
                                        <td className="td-autosize width-36" scope="row">
                                          1
                                        </td>
                                        <td className="td-autosize hover-button-td">
                                          <div className="d-flex align-items-center">
                                            Mar 27, 2024
                                          </div>
                                        </td>
                                        <td className="td-autosize hover-button-td">
                                          <div className="d-flex align-items-center text-lowercase">
                                            9:00 PM
                                          </div>
                                        </td>
                                        <td className="td-autosize hover-button-td">
                                          <span
                                            className="d-flex align-items-center"
                                            onclick="openNoteMessageModal(event, 'Aqeel Dev', 'null', '651', 'no', '')"
                                          >
                                            <span className="ic-avatar ic-29 has-avatar-icon has-cover-img">
                                              <img
                                                className="output-651 theme-ring"
                                                src="https://simplefirm-bucket.s3.amazonaws.com/static/bp_assets/img/avatar.svg"
                                              />
                                            </span>
                                            <div id="previewProfilePic" />
                                            <span className="ml-2 text-black">
                                              Aqeel Dev
                                            </span>
                                          </span>
                                        </td>
                                        <td className="client_page_note_row hover-button-td notes-sec-color-black">
                                          <div className="d-flex align-items-center text-capital"></div>
                                        </td>
                                        <td className="td-autosize hover-button-td">
                                          <div className="d-flex align-items-center">
                                            Critical
                                          </div>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </nav>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
