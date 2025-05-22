import React from "react";
import { CostIcon } from "./CostIcon";
import { CostInfoItem } from "./CostInfoItem";
import { useCostManagement } from "./CostManagementContext";
import ActionBarComponent from "../common/ActionBarComponent";
import { useSelector } from "react-redux";

const CostActionBar = ({
  totalAmount = 0,
  openNotRequested = 0,
  requested = 0,
  paid = 0,
  totalCreditCard = 0,
}) => {
  console.log(
    "Total Amount ===.",
    totalAmount,
    openNotRequested,
    requested,
    paid,
    totalCreditCard
  );
  const costsInfo = {
    totalAmount,
    openNotRequested,
    requested,
    paid,
    totalCreditCard,
  };
  const header_name = useSelector((state) => state.header_name?.header_name);

  return (
    <ActionBarComponent
      src="/BP_resources/images/icon/costs-icon-color.svg"
      page_name={"Costs"}
      isChecklist={false}
      costInfo={costsInfo}
    />
    // <div className="align-items-center action-bar client-BarAlign main-action-bar  d-flex m-b-5 m-t-5 margin-left-12">
    //   <CostIcon />
    //   <div className="text-wrapper text-white d-flex align-items-center p-l-5">
    //     <h2 className="text-white m-b-0">Costs</h2>
    //     <span className="mx-2 text-white">|</span>
    //     <ul className="m-l-150 m-b-0 info-list text-white d-flex list-unstyled no-wrap">
    //       <CostInfoItem label="Total" value={totalAmount} />
    //       <CostInfoItem label="Open Not Requested" value={openNotRequested} />
    //       <CostInfoItem label="Requested" value={requested} />
    //       <CostInfoItem label="Paid" value={paid} />
    //       <CostInfoItem label="CC" value={totalCreditCard} />
    //     </ul>
    //     <div className="btn-wrapper">
    //       <button
    //         onClick={() => {
    //           showModal({}, false);
    //         }}
    //         className="m-l-5 btn btn-primary rounded-0 m-r-0"
    //         data-toggle="modal"
    //         data-target="#addCostModal"
    //       >
    //         <span className="font-weight-bold pr-2 text-gold">+</span> Add New
    //         Cost
    //       </button>
    //     </div>
    //   </div>
    // </div>
  );
};

export default React.memo(CostActionBar);
