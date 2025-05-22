import { currencyFormat } from "../../Utils/helper";
import React from "react";

export const AccountsInfoItem = ({ label, value }) => (
  <li
    style={{
      minWidth: "max-content",
    }}
  >
    <span className="label text-primary-50 mr-1">{label}</span>
    <span className="value">{currencyFormat(value)}</span>
  </li>
);
