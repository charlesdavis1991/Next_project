import React, { useEffect } from "react";
import { currencyFormat, formatChequeData } from "../../../../Utils/helper";

const CheckDetails = ({ check, isStacked }) => {
  const adjustCaseDetailsWidths = () => {
    const leftColumns = document.querySelectorAll(".check-details-inbox");

    let maxLeftWidth = 0;

    // Calculate maximum width for left and right columns
    leftColumns.forEach((column) => {
      const width = column.getBoundingClientRect().width;
      maxLeftWidth = Math.max(maxLeftWidth, width);
    });

    leftColumns.forEach((column) => {
      column.style.width = `${maxLeftWidth}px`;
    });
  };

  useEffect(() => {
    adjustCaseDetailsWidths();
    window.addEventListener("resize", adjustCaseDetailsWidths);
    return () => {
      window.removeEventListener("resize", adjustCaseDetailsWidths);
    };
  }, [check]);
  return (
    <div className="col-auto flex-grow-1 pl-0 pr-0">
      <div
        className="d-flex align-items-center flex-column justify-content-center check-details-inbox"
        style={{
          position: "relative",
          left: "8%",
        }}
      >
        <div
          className="align-items-center d-flex"
          style={{
            flexDirection: isStacked ? "column" : "row",
          }}
        >
          <div className="pb-0 mb-0 font-600 p-r-5">
            {check?.bank_account?.account_number
              ? "*" + check?.bank_account?.account_number?.slice(-4)
              : " - "}
          </div>{" "}
          <div className="font-600">
            {check?.cheque_number ? check?.cheque_number : " - "}
          </div>
        </div>

        <div
          className="align-items-center d-flex"
          style={{
            flexDirection: isStacked ? "column" : "row",
          }}
        >
          <div className="pb-0 mb-0 font-600 p-r-5">
            {check?.cheque_date
              ? formatChequeData(check?.cheque_date?.split("T")[0])
              : " - "}
          </div>{" "}
          <div className="font-600">
            {check?.amount ? currencyFormat(check?.amount) : " - "}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckDetails;
