import React from "react";

function CounselInformation({
  counselTypeName,
  opposingCounselFileNumber,
  handleCounselEditModal,
}) {
  return (
    <>
      <div className="info-div">
        <div onClick={() => handleCounselEditModal("information")} className="h-100" >
          <p class="columnsTitle text-primary text-center font-weight-semibold text-uppercase">
            Counsel Information
          </p>
          <div class="row mb-0">
            <div class="col text-left">
              <span class="inline-row-h-21">Type</span>
            </div>
            <div class="col-auto text-left ">
              <p>{counselTypeName && counselTypeName}</p>
            </div>
          </div>
          <div class="row mb-0">
            <div class="col text-left">
              <span class="inline-row-h-21">File</span>
            </div>
            <div class="col-auto text-left ">
              <p class="inline-row-h-21">
                {opposingCounselFileNumber && opposingCounselFileNumber}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CounselInformation;
