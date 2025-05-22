import React from "react";
import './envelope-cost.css';
import { CostInfoItem } from "./CostInfoItem";

const EnvelopeCostComponent = ({ costTotalSummary }) => {

  const {
    totalAmount = 0,
    openNotRequested = 0,
    requested = 0,
    paid = 0,
    totalCreditCard = 0,
  } = costTotalSummary

  return (
    <React.Fragment>
      <div
        className='div-tilted-cost'
        style={{
          display: 'flex',
          alignItems: 'center',
          paddingLeft: '25px',
          height: "35px",
          transform: 'none',
          fontStyle: 'normal',
          fontSize: '24px',
          fontWeight: 600,
          color: 'white'
        }}
      >COSTS</div>
      <div
        className='div-tilted-cost'
        style={{
          height: "25px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transform: 'none',
          fontStyle: 'normal',
        }}
      >
        <ul
          className="m-b-0 info-list text-white d-flex list-unstyled no-wrap"
          style={{ zIndex: "1", fontWeight: "600px", gap: '5px' }}
        >
          <CostInfoItem label="Total" value={totalAmount} />
          <CostInfoItem
            label="Open Not Requested"
            value={openNotRequested}
          />
          <CostInfoItem label="Requested" value={requested} />
          <CostInfoItem label="Paid" value={paid} />
          <CostInfoItem label="CC" value={totalCreditCard} />
        </ul>
      </div>
    </React.Fragment>
  );
};

export default EnvelopeCostComponent;
