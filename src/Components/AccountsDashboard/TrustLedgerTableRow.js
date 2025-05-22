import React from "react";
import "./AccountsRow.css";
import { currencyFormat } from "../../Utils/helper";

const StyledTableCell = ({ children, className, ...props }) => (
  <td className={`cost-cell ${className || ""}`} {...props}>
    {children}
  </td>
);

const AccountsTableRow = ({ cost, slotDetails, idx = 0 }) => {
  return (
    <tr
      style={{
        height: "25px",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        fontWeight: 600,
        cursor: 'default',
        testTransform: 'uppercase'
      }}
      className="cost-row"
      onClick={() => {
        // showEditCostModal(cost, true);
      }}
    >
      <StyledTableCell className={``}>{idx + 1}</StyledTableCell>
      <StyledTableCell className={` align-left  text-center p-x-10`}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', flexWrap: 'wrap' }} >
          <div style={{ display: 'flex', alignItems: 'center' }} >
            <div class="icon-container" style={{ display: 'flex', height: '25px', width: '25px', marginRight: '4px' }}>
              <i class="height-i-25 ic ic-client-avatar"></i>
              <div class="border-overlay"></div></div>
            {cost.client.name}
          </div>
        </div>
      </StyledTableCell>
      <StyledTableCell className={` align-left  text-center p-x-10`}>
        {cost.doi}
      </StyledTableCell>
      <StyledTableCell style={{fontWeight: 400}} className={` align-left  text-center p-x-10`}>
        {cost.caseType}
      </StyledTableCell>
      <StyledTableCell style={{fontWeight: 400}} className={` align-left  text-center p-x-10`}>
        {cost.caseStatus}
      </StyledTableCell>
      <StyledTableCell style={{fontWeight: 400}} className={` align-left  text-center p-x-10`}>
        <p>Requested</p>
        <p>Issued</p>
        <p>Cleared</p>
      </StyledTableCell>
      <StyledTableCell className={`font-monospace text-right p-x-10`}>
        <p style={{color: cost.requested.deposits == 0 ? 'var(--primary-40)' : '#000'}}>{currencyFormat(cost.requested.deposits)}</p>
        <p style={{color: cost.issued.deposits == 0 ? 'var(--primary-40)' : '#000'}}>{currencyFormat(cost.issued.deposits)}</p>
        <p style={{color: cost.cleared.deposits == 0 ? 'var(--primary-40)' : '#000'}}>{currencyFormat(cost.cleared.deposits)}</p>
      </StyledTableCell>
      <StyledTableCell className={`font-monospace text-right p-x-10`}>
        <p style={{color: cost.requested.fees == 0 ? 'var(--primary-40)' : '#000'}}>{currencyFormat(cost.requested.fees)}</p>
        <p style={{color: cost.issued.fees == 0 ? 'var(--primary-40)' : '#000'}}>{currencyFormat(cost.issued.fees)}</p>
        <p style={{color: cost.cleared.fees == 0 ? 'var(--primary-40)' : '#000'}}>{currencyFormat(cost.cleared.fees)}</p>
      </StyledTableCell>
      <StyledTableCell className={`font-monospace text-right p-x-10`}>
        <p style={{color: cost.requested.reimbursements == 0 ? 'var(--primary-40)' : '#000'}}>{currencyFormat(cost.requested.reimbursements)}</p>
        <p style={{color: cost.issued.reimbursements == 0 ? 'var(--primary-40)' : '#000'}}>{currencyFormat(cost.issued.reimbursements)}</p>
        <p style={{color: cost.cleared.reimbursements == 0 ? 'var(--primary-40)' : '#000'}}>{currencyFormat(cost.cleared.reimbursements)}</p>
      </StyledTableCell>
      <StyledTableCell className={`font-monospace text-right p-x-10`}>
        <p style={{color: cost.requested.liens == 0 ? 'var(--primary-40)' : '#000'}}>{currencyFormat(cost.requested.liens)}</p>
        <p style={{color: cost.issued.liens == 0 ? 'var(--primary-40)' : '#000'}}>{currencyFormat(cost.issued.liens)}</p>
        <p style={{color: cost.cleared.liens == 0 ? 'var(--primary-40)' : '#000'}}>{currencyFormat(cost.cleared.liens)}</p>
      </StyledTableCell>
      <StyledTableCell className={`font-monospace text-right p-x-10`}>
        <p style={{color: cost.requested.balance == 0 ? 'var(--primary-40)' : '#000'}}>{currencyFormat(cost.requested.balance)}</p>
        <p style={{color: cost.issued.balance == 0 ? 'var(--primary-40)' : '#000'}}>{currencyFormat(cost.issued.balance)}</p>
        <p style={{color: cost.cleared.balance == 0 ? 'var(--primary-40)' : '#000'}}>{currencyFormat(cost.cleared.balance)}</p>
      </StyledTableCell>
      
    </tr>
  );
};

export default React.memo(AccountsTableRow);
