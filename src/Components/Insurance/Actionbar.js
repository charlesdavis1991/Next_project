import React, { useEffect, useState } from "react";
import ActionBarImg from "../../../public/BP_resources/images/icon/insurance-icon-color.svg";
import Button from "react-bootstrap/Button";
import { useDispatch, useSelector } from "react-redux";
import AddInsuranceModal from "./AddInsuranceModal ";
import {
  fetchCreateInsuranceModalData,
  createInsurance,
} from "../../Redux/insurance/insuranceSlice";
import { useLocation } from "react-router-dom";
import { Mode } from "@mui/icons-material";
import PageChecklist from "../common/PageChecklist";
import ActionBarComponent from "../common/ActionBarComponent";

const ActionBar = ({ onInsuranceCreation, modalData }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [checkedItems, setCheckedItems] = useState(new Array(10).fill(true)); // Assuming 10 checklist items initially checked
  const client = useSelector((state) => state.todos.client);

  //   Extracting the client_id and case_id from URL which is expected to /some/client_id/case_id
  const regex = /\d+/g;
  const { pathname } = useLocation();
  // Use match method to find all numbers
  const numbers = pathname.match(regex);
  // Convert the array of string numbers to an array of integers
  const URLParams = numbers.map(Number);

  const dispatch = useDispatch();

  const handleSubmit = async (data) => {
    await dispatch(
      createInsurance({
        client_id: URLParams[0],
        case_id: URLParams[1],
        data: data,
      })
    );
    handleClose();
    onInsuranceCreation();
  };

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

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const buttonsConfig = [
    {
      label: "Insurance",
      icon: "+",
      className: "btn btn-primary rounded-0 height-25 p-b-0 p-t-0",
      dataToggle: "modal",
      dataTarget: "#addInsurance",
      onClick: () => handleShow(),
    },
  ];
  const header_name = useSelector((state) => state.header_name?.header_name);

  return (
    <div>
      <ActionBarComponent
        src={ActionBarImg}
        page_name={"Insurance"}
        buttons={buttonsConfig}
        isChecklist={true}
      />
      {/* <div className="action-bar client-BarAlign anti-action-bar anti-client-BarAlign main-action-bar has-checklist d-flex m-b-5 m-t-5 m-l-5">
                <span className="page-icon">
                    <img className="m-l-2" src={ActionBarImg} alt="Incident Folder Icon" />
                </span>
                <div className="text-wrapper text-white d-flex align-items-center p-l-5">
                   <h2 className="text-white"><nobr>Insurance</nobr></h2>
                </div>
                <PageChecklist entity={"Insurance"}/>
                
                <div className="mobile-action-btns ml-auto">
                    <button className="btn btn-primary rounded-0 position-relative z-index-1 ml-auto height-25 d-flex align-items-center mr-1" id="actionbarToggleBtn"><span className="font-weight-bold pr-2 text-gold">+</span>Actions</button>
                </div>
                <div className="btn-wrapper d-flex justify-content-end px-0"> */}
      {/* <h2 class="text-white">Insurance</h2> */}
      {/* <button type="button" id="add-report-btn" className="btn btn-primary rounded-0 p-b-0 p-t-0 height-25" data-bs-toggle="modal" data-bs-target="#addreport"><span className="font-weight-bold pr-2 text-gold">+</span>Report</button> */}
      {/* <Button className="btn btn-primary rounded-0 p-b-0 p-t-0 height-25 m-r-5" onClick={handleShow}>
                        <span className="font-weight-bold pr-2 text-gold">+</span>Insurance
                    </Button>
                </div>
            </div> */}

      {/* <!-- Add a New Report to Popup Starts --> */}
      <AddInsuranceModal
        show={show}
        handleClose={handleClose}
        handleInsuranceSubmit={handleSubmit}
        client={modalData?.client}
        otherParties={modalData?.other_parties}
        defendants={modalData?.defendants}
        insuranceTypes={modalData?.insurance_types}
        states={modalData?.states}
        litigation={modalData?.litigation}
      />
      {/* <!-- Add a New Report to Popup Ends --> */}
    </div>
  );
};

export default ActionBar;
