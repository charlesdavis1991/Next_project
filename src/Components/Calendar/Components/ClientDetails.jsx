import React from 'react';
import DatePicker from 'react-datepicker'; // Assuming you're using react-datepicker

const ClientDetails = ({ client, caseSummary, parseDate, errorMsg, selectedTab }) => {
  if (selectedTab !== "search") {
    return (
      <p className="d-flex justify-content-center text-danger display-6 mb-4">
        {errorMsg}
      </p>
    );
  }


  return (
    <div className="container-fluid pb-2" style={{ marginLeft: "18px" }}>
      <div className="row" style={{ paddingTop: "2%" }}>
        <Detail
          label="First Name"
          id="firstName"
          value={client?.first_name}
        />
        <Detail
          label="Last Name"
          id="lastName"
          value={client?.last_name}
        />
        <Detail
          label="Case Type"
          id="caseType"
          value={caseSummary?.case_type?.name}
        />
        
        <Detail
          label="Incident Date"
          id="IncidentDate"
          value={parseDate(caseSummary?.incident_date)}

        />
        
      </div>
    </div>
  );
};

// Reusable input detail component
const Detail = ({ label, id, value }) => (
  <div className="col-md-6 d-flex align-items-center mb-3 pl-0 ml-0 mr-2">
    <div className="d-flex w-100 align-items-baseline mr-2">
      
    <h6 className="mr-2 text-muted" style={{  fontSize: "20px",width:"131px" }}>
      {label}
    </h6>
    <h6 className="text-muted mr-2" style={{  fontSize: "20px"}}>
      :
    </h6>
      <h6 className="mb-0" id={id} style={{ fontSize: "20px" }}>
      {value || "N/A"}
    </h6>
    </div>
  </div>
);

export default ClientDetails;
