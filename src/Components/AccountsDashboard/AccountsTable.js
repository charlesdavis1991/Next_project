import { useSelector } from "react-redux";
import AccountsTableRow from "./AccountsTableRow";
import React, { useCallback, useEffect, useRef, useState } from "react";

const StyledTableHeader = ({ children, ...props }) => (
  <th
    style={{
      textTransform: "uppercase",
    }}
    {...props}
  >
    {children}
  </th>
);

const AccountsTable = ({ costs, slotDetails, fetchAccountsData }) => {
  const [additionalRows, setAdditionalRows] = useState(6);
  const tableRef = useRef();
  const [hasNoData, setHasNoData] = useState(false);
  
  // Check if there are any costs and set hasNoData accordingly
  useEffect(() => {
    setHasNoData(costs.length === 0);
  }, [costs]);

  const calculateAdditionalRows = useCallback(() => {
    if (hasNoData) {
      // No costs means we need to add additional rows
      const requiredRows = 6; // Maximum fake rows if no costs
      setAdditionalRows(requiredRows);
    } else {
      const costCount = costs.length;

      // Display additional rows based on the count of existing costs
      const rowsToShow = Math.max(0, 6 - costCount); // Calculate additional rows needed based on existing costs
      setAdditionalRows(rowsToShow);
    }
  }, [hasNoData, costs]);

  useEffect(() => {
    // Initial call to calculate additional rows
    calculateAdditionalRows();
    // Add resize event listener
    const handleResize = () => {
      calculateAdditionalRows();
    };
    window.addEventListener("resize", handleResize);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [calculateAdditionalRows]);


  return (
    <div className="table--no-card rounded-0 border-0 w-100 min-h-382P58">
      <table
        ref={tableRef}
        className="table table-borderless table-striped table-earning has-height-25 cost-table"
        style={{width:'100%'}}
      >
        <thead style={{position: 'sticky', top: '0', background: '#E8EBEF', zIndex: 2}}>
          <tr
            style={{
              height: "25px",
              textTransform: "uppercase",
              textAlign: "center",
              cursor: 'default'
            }}
            id="tb-header"
          >
            <StyledTableHeader></StyledTableHeader>
            <StyledTableHeader>Case</StyledTableHeader>
            <StyledTableHeader>Requested</StyledTableHeader>
            <StyledTableHeader>Account</StyledTableHeader>
            <StyledTableHeader>Payee</StyledTableHeader>
            <StyledTableHeader>Memo</StyledTableHeader>
            <StyledTableHeader>Amount</StyledTableHeader>
            <StyledTableHeader>Verify</StyledTableHeader>
            <StyledTableHeader></StyledTableHeader>
            <StyledTableHeader>Sent</StyledTableHeader>
            <StyledTableHeader>Cleared</StyledTableHeader>
          </tr>
        </thead>
        <tbody>
          {costs.map((cost, index) => (
            <AccountsTableRow
              idx={index}
              cost={cost}
              key={cost.id}
              slotDetails={slotDetails}
              fetchAccountsData={fetchAccountsData}
            />
          ))}
          {/* Render additional fake rows */}
          {<RenderAdditionalRows additionalRows={additionalRows}/>}
        </tbody>
      </table>
    </div>
  );
};

export default React.memo(AccountsTable);


export const RenderAdditionalRows = ({additionalRows}) => {
  return Array.from({ length: additionalRows }).map((_, rowIndex) => (
    <tr key={rowIndex} className="emptytestRows" style={{ height: '94px' }}>
      <td style={{ height: '94px', color: "transparent" }} colSpan={11}></td>
    </tr>
  ));
};