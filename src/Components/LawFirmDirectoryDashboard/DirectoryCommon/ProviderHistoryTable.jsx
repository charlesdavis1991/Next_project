import React, { useMemo } from "react";
import "../../../../public/BP_resources/css/notes-section.css";
import "../../../../public/BP_resources/css/case.css";
import "../../CaseDashboard/MedicalProvidersTable/MedicalProviders.css";
import { formatDate } from "../../../Utils/helper";
import { formatNum } from "../../../Utils/date";
import ClientProvidersStyles from "../../CaseDashboard/ClientProvidersStyles";
import { Table } from "react-bootstrap";

const ProviderHistoryTable = ({ stats }) => {

  const emptyRowsCount = useMemo(() => {
    const actualRows = stats?.length || 0;
    if (actualRows >= 11) return 0;
    return 11 - actualRows;
  }, [stats]);

  const emptyRows = useMemo(() => {
    return Array(emptyRowsCount).fill(0).map((_, index) => index);
  }, [emptyRowsCount]);

  return (
      <Table
        className="text-start custom-table-directory font-weight-600"
        striped
        responsive
        bordered
        hover
      >
        <thead>
          <tr>
            <th>Year</th>
            <th>Total</th>
            <th>Open</th>
            <th>Close</th>
            <th>Original</th>
            <th>Liens</th>
            <th>Final Payments</th>
            <th>Visits</th>
            <th>Original / Visit</th>
            <th>Final / Visit</th>
          </tr>
        </thead>
        <tbody className="font-weight-600">
          <ClientProvidersStyles clientProviders={stats} />
          {stats?.map((provider, index) => (
            <tr key={index}>
              <td>{provider?.year}</td>
              <td>{provider?.total_cases}</td>
              <td>{provider?.open_cases}</td>
              <td>{provider?.closed_cases}</td>
              <td>{provider?.original_billing}</td>
              <td>{provider?.liens}</td>
              <td>{provider?.final_payments}</td>
              <td>{provider?.visits}</td>
              <td>{provider?.original_per_visit}</td>
              <td>{provider?.final_per_visit}</td>
            </tr>
          ))}
          {emptyRows.map((index) => (
            <tr key={`empty-${index}`} className="height-25">
              <td colSpan={10}></td>
            </tr>
        ))}
        </tbody>
      </Table>
  );
};

export default React.memo(ProviderHistoryTable);
