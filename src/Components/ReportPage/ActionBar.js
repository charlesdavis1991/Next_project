import React, { useEffect, useState } from "react";
import ActionBarImg from "../../assets/images/incident-folder-icon-color.svg";
import Button from "react-bootstrap/Button";
import { useSelector } from "react-redux";
import NewReportModal from "./ReportModals/NewReportModal";
import PageChecklist from "../common/PageChecklist";
import { Message } from "@mui/icons-material";
import { Modal } from "react-bootstrap";
import ActionBarComponent from "../common/ActionBarComponent";

const ActionBar = ({
  onFetchReports,
  isDummy,
  onUpdateState,
  onUpdate,
  setDummyReport,
  isReoportTaken,
  showReportTakenField,
  reports,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [checkedItems, setCheckedItems] = useState(new Array(10).fill(true)); // Assuming 10 checklist items initially checked
  const client = useSelector((state) => state.todos.client);
  const [updateState, setUpdateState] = useState(0);
  // const pages = useSelector((state) => state.todos.pages);
  // const currentCase = useSelector((state) => state.todos.currentCase);

  const [showReportModal, setShowReportModal] = useState(false);
  const [showMesaagePopup, setShowMesaagePopup] = useState(false);
  const header_name = useSelector((state) => state.header_name?.header_name);

  console.log("heaeder name ===>", header_name);

  const handeleShowModal = () =>
    isReoportTaken && reports.length === 1
      ? setShowMesaagePopup(true)
      : setShowReportModal(true);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleCheck = (index) => {
    setCheckedItems((prevCheckedItems) => {
      const newCheckedItems = [...prevCheckedItems];
      newCheckedItems[index] = !newCheckedItems[index];
      return newCheckedItems;
    });
  };
  useEffect(() => {}, []);

  const checklistItems = [
    "example 1",
    "example 2",
    "example 3",
    "example 4",
    "example 5",
    "example 6",
    "example 7",
    "example 8",
    "example 9",
    "example 10",
  ];
  const buttonsConfig = [
    {
      label: "Report",
      icon: "+",
      className: "btn btn-primary rounded-0 height-25 p-b-0 p-t-0",
      dataToggle: "modal",
      dataTarget: "#addparty",
      onClick: () => handeleShowModal(),
    },
  ];

  return (
    <div>
      <ActionBarComponent
        src={ActionBarImg}
        page_name={"Incident Report"}
        buttons={buttonsConfig}
        isChecklist={true}
        isDummy={isDummy}
        page_checklist_state={onUpdateState}
      />
      {/* <div className="action-bar client-BarAlign main-action-bar has-checklist d-flex m-b-5 margin-left-11 overflow-visible">
        <span className="page-icon">
          <img
            className="m-l-2"
            src={ActionBarImg}
            alt="Incident Folder Icon"
          />
        </span>
        <div className="text-wrapper text-white d-flex align-items-center p-l-5">
          <h2 className="text-white">
            <nobr>Incident Report</nobr>
          </h2>
        </div>
        <PageChecklist entity={"Reports"} updateState={onUpdateState} />
        <div className="mobile-action-btns ml-auto">
          <button
            className="btn btn-primary rounded-0 position-relative z-index-1 ml-auto height-25 d-flex align-items-center mr-1"
            id="actionbarToggleBtn"
          >
            <span className="font-weight-bold pr-2 text-gold">+</span>Actions
          </button>
        </div>
        { isDummy ? <></>: <div className="btn-wrapper d-flex justify-content-end px-0">
                    <Button className="btn btn-primary rounded-0 p-b-0 p-t-0 height-25" onClick={handeleShowModal}>
                        <span className="font-weight-bold pr-2 text-gold">+</span>Report
                    </Button>
                </div>} */}
      {/* <div className="btn-wrapper d-flex justify-content-end px-0">
          <Button
            className="btn btn-primary rounded-0 p-b-0 p-t-0 height-25"
            onClick={handeleShowModal}
          >
            <span className="font-weight-bold pr-2 text-gold">+</span>Report
          </Button>
        </div> */}
      {/* </div> */}

      {showReportModal && (
        <NewReportModal
          show={true}
          handleClose={() => setShowReportModal(false)}
          isReoportTaken={isReoportTaken}
          onUpdate={onUpdate}
          setDummyReport={setDummyReport}
          fetchReports={onFetchReports}
          showReportTakenField={showReportTakenField}
        />
      )}

      {showMesaagePopup && (
        <MesageComponent handleClose={() => setShowMesaagePopup(false)} />
      )}
    </div>
  );
};

export default ActionBar;

function MesageComponent({ handleClose }) {
  return (
    <Modal
      show={true}
      onHide={handleClose}
      dialogClassName="modal-dialog-centered max-800p custom-insurance-dialog"
    >
      <div className="" style={{ padding: "15px" }}>
        <Modal.Header className="text-center p-0 bg-primary-fixed popup-heading-color justify-content-center">
          <Modal.Title
            className="mx-auto font-size-24 height-35 font-weight-semibold text-uppercase popup-heading-color font-weight-500"
            id="modal_title"
          >
            INCIDENT REPORT
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p className="msg-text">
            The Case Has Been Marked As No Report Taken
          </p>
          <div className="d-flex justify-content-between mt-3">
            <Button variant="secondary" onClick={handleClose} className="ml-2">
              Close
            </Button>
          </div>
        </Modal.Body>
      </div>
    </Modal>
  );
}
