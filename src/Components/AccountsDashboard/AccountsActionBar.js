import React from "react";
import ActionBarComponent from "../common/ActionBarComponent";

const AccountsActionBar = ({
  isTrustLedgerOpen
}) => (
  <ActionBarComponent
    page_name={isTrustLedgerOpen ? "Accounting Trust Ledger" : "Accounting"}
  />
);

export default React.memo(AccountsActionBar);
