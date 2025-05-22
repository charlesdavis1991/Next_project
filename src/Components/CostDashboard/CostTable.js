import { useSelector } from "react-redux";
import CostTableRow from "./CostTableRow";
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

const CostTable = ({ costs, slotDetails }) => {
  const [additionalRows, setAdditionalRows] = useState(0);
  const tableRef = useRef();
  const [hasNoData, setHasNoData] = useState(false);
  
  // Check if there are any costs and set hasNoData accordingly
  useEffect(() => {
    setHasNoData(costs.length === 0);
  }, [costs]);

  const calculateAdditionalRows = useCallback(() => {
    if (hasNoData) {
      // No costs means we need to add additional rows
      const requiredRows = 8; // Maximum fake rows if no costs
      setAdditionalRows(requiredRows);
    } else {
      const costCount = costs.length;

      // Display additional rows based on the count of existing costs
      const rowsToShow = Math.max(0, 8 - costCount); // Calculate additional rows needed based on existing costs
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
        style={{width: '100%'}}
      >
        <thead>
          <tr
            style={{
              height: "25px",
              textTransform: "uppercase",
              textAlign: "center",
            }}
            id="tb-header"
          >
            <StyledTableHeader></StyledTableHeader>
            <StyledTableHeader>Category</StyledTableHeader>
            <StyledTableHeader colSpan="2">Requested</StyledTableHeader>
            <StyledTableHeader>Invoice #</StyledTableHeader>
            <StyledTableHeader>Invoice</StyledTableHeader>
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
            <CostTableRow
              idx={index}
              cost={cost}
              key={cost.id}
              slotDetails={slotDetails}
            />
          ))}
          {/* Render additional fake rows */}
          {<RenderAdditionalRows additionalRows={additionalRows} />}
        </tbody>
      </table>
    </div>
  );
};

export const RenderAdditionalRows = ({additionalRows}) => {
  return Array.from({ length: additionalRows }).map((_, rowIndex) => (
    <tr key={rowIndex} className="emptytestRows" style={{ height: '35px' }}>
      <td style={{ height: '35px', color: "transparent" }} colSpan={20}></td>
    </tr>
  ));
};

export default React.memo(CostTable);