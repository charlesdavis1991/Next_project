import React from "react";
import PanelChecklist from "../../common/PanelChecklist";

function WitnessTitleBar({
  object,
  setAddCounselModalShow,
  setAddInsuranceModalShow,
}) {
  return (
    <div
      className="border-box  has-checklist position-relative"
      style={{ zIndex: "2" }}
    >
      <div className="d-flex flex-row has-title-bg skewed-primary-gradient-new">
        <PanelChecklist entity={"Witnesses"} entity_id={object?.id} />
        <div
          style={{ paddingLeft: "50px" }}
          className="top-header height-25 d-flex  responsive-width-of-title "
        >
          <div className="top-head-fixed d-flex align-items-center">
            <h2 className="d-flex align-items-center mr-1">
            <small className="font-weight-600 custom-font-14px">
              {object?.witness_title}</small>
            </h2>
            <h2 className="d-flex align-items-center mr-1">
            <small className="font-weight-600 custom-font-14px">
                {object?.witness_first_name} {object?.witness_last_name}
              </small>
            </h2>
          </div>
        </div>
        {/* <div
          class="btn-wrapper justify-content-end align-items-center"
          style={{ marginRight: "13rem" }}
        >
          <p 
           className="custom-font-14px dynamic-margin-class"
           style={{ color: 'white' , fontWeight: '600' }}
           >
            Witness Notes</p>
          <button
            type="submit"
            class="btn btn-primary rounded-0"
            data-id="5"
            onClick={() => {
              setAddInsuranceModalShow(true);
            }}
          >
            <span class="font-weight-bold pr-2 text-gold">+</span>Insurance
          </button>
          <button
            type="submit"
            class="btn btn-primary rounded-0"
            onClick={() => {
              setAddCounselModalShow(true);
            }}
          >
            <span class="font-weight-bold pr-2 text-gold">+</span>Counsel
          </button>
        </div> */}
        <p 
           className="custom-font-14px dynamic-margin-class align-items-center justify-content-center d-flex"
           style={{ color: 'white' , fontWeight: '600' }}
           >
            Witness Notes</p>
      </div>
    </div>
  );
}

export default WitnessTitleBar;
