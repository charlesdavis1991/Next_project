import React from 'react';

function EmployeeBottom({ object }) {
  
  // Format phone number if it exists
  const formatPhoneNumber = (number) => {
    if (!number) return null;
    const areaCode = number.slice(0, 3);
    const firstPart = number.slice(3, 6);
    const secondPart = number.slice(6);
    return `(${areaCode}) ${firstPart}-${secondPart}`;
  };

  // Extract the necessary fields from the object
  const employerName = object?.employer_name;
  const title = object?.job_title;
  const description = object?.job_description;
  const wagesLost = object?.wages_lost;
  const disabilityLost = object?.disability_lost;
  const disabilityClaimNumber = object?.disability_claim_number;
  const disabilityLienFinal = object?.disability_lien ? `${object.disability_lien}/${object.disability_final}` : '';

  return (
    <div className="info-div employemnet-info mt-1" style={{ backgroundColor: "var(--primary-2)" }}>
      <div className="p-l-5">
        <div>
          <p className="columnsTitle text-center text-primary font-weight-semibold text-uppercase" style={{backgroundColor: "var(--primary-10)"}}>
          {employerName || 'Employer Name'}
          </p>
            

          <div>
            <div className="row mb-0 colFont">
              <div className="col text-left" style={{ backgroundColor: "var(--primary-2)" }}>
                <span className="d-inline-block fs-14">Title:</span>
              </div>
              <div className="col-auto text-left font-weight-semibold" style={{ backgroundColor: "var(--primary-2)" }}>
                <p className='fs-14'>{title}</p>
              </div>
            </div>

            <div className="row mb-0 colFont" style={{ backgroundColor: "var(--primary-4)" }}>
              <div className="col text-left">
                <span className="d-inline-block fs-14">Description:</span>
              </div>
              <div className="col-auto text-left font-weight-semibold">
                <p className='fs-14'>{description}</p>
              </div>
            </div>

            <div className="row mb-0 colFont" style={{ backgroundColor: "var(--primary-2)" }}>
              <div className="col text-left">
                <span className="d-inline-block fs-14">Wages Lost:</span>
              </div>
              <div className="col-auto text-left font-weight-semibold fs-14"><p>{wagesLost}</p>
              </div>
            </div>

            <div className="row mb-0 colFont" style={{ backgroundColor: "var(--primary-4)" }}>
              <div className="col text-left">
                <span className="d-inline-block fs-14 text-nowrap">Disability Lost:</span>
              </div>
              <div className="col-auto text-left font-weight-semibold">
                <p  className='fs-14'>{disabilityLost}</p>
              </div>
            </div>

            <div className="row mb-0 colFont" style={{ backgroundColor: "var(--primary-2)" }}>
              <div className="col text-left">
                <span className="d-inline-block fs-14">Disability Claim Number:</span>
              </div>
              <div className="col-auto text-left font-weight-semibold">
                <p  className='fs-14'>{disabilityClaimNumber}</p>
              </div>
            </div>

            <div className="row mb-0 colFont" style={{ backgroundColor: "var(--primary-4)" }}>
              <div className="col text-left">
                <span className="d-inline-block fs-14">Lien/Final:</span>
              </div>
              <div className="col-auto text-left font-weight-semibold">
                <p  className='fs-14'>{disabilityLienFinal}</p>
              </div>
            </div>

           </div>

        </div>
      </div>
      
    </div>
  );
}

export default EmployeeBottom