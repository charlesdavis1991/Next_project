import React, { useEffect } from "react";

const AccountDetails = ({ account, isStacked }) => {
  const adjustCaseDetailsWidths = () => {
    const leftColumns = document.querySelectorAll(
      ".account-details-inbox-page"
    );

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
  }, [account]);
  return (
    <div className="col-auto flex-grow-1 pl-0 pr-0">
      <div
        className="d-flex align-items-center flex-column justify-content-center "
        style={{
          position: "relative",
          left: "8%",
        }}
      >
        <div
          className="align-items-center d-flex account-details-inbox-page"
          style={{
            flexDirection: isStacked ? "column" : "row",
          }}
        >
          <div className="pb-0 mb-0 font-600 p-r-5">
            {account?.payee ? account?.payee : " - "}
          </div>{" "}
          <div className="font-600">
            {account?.invoice_number ? account?.invoice_number : " - "}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDetails;
