import { currencyFormat } from "../../Utils/helper";
import React from "react";

export const CostInfoItem = ({ label, value }) => (
  <li
    style={{
      minWidth: "max-content",
    }}
  >
    <span className="value mr-1">{label}</span>
    <span className="label text-grey">{currencyFormat(value)}</span>
  </li>
);
