import React from "react";
import { useSelector } from "react-redux";
import PanelChecklist from "../common/PanelChecklist";

function DefendantsTitleBar({
  setAddInsuranceModalShow,
  setCurrentDefendantId,
  setAddCounselModalShow,
  ...object
}) {
  // const client = useSelector((state) => state.todos.client);

  return (
    <div
      className="border-box  has-checklist position-relative"
      style={{ zIndex: "2"}}
    >
      <div
        className=" title-bar-main-div d-flex flex-row has-title-bg skewed-primary-gradient-new"
        style={{ width: "100%" }}
      >
        <PanelChecklist entity={"Defendants"} entity_id={object?.id} />

        <div
          style={{ paddingLeft: "50px" }}
          className="top-header height-25 d-flex  responsive-width-of-title "
        >
          <div className="top-head-fixed d-flex align-items-center">
            <h2 className="d-flex align-items-center mr-1 ">
              <small className="font-weight-600 custom-font-14px">
                {object.title}
              </small>
            </h2>
            <h2 className="d-flex align-items-center mr-1">
            <small className="font-weight-600 custom-font-14px">
              {object?.defendantType_name === 'Private Individual' 
                ? (`${object?.first_name} ${object?.last_name}` )
                :( object?.entity_name)
              }
            </small>
          </h2>
          </div>
        </div>
        <div
          class="btn-wrapper justify-content-end align-items-center"
          style={{ marginRight: "13rem" }}
        >
          <p
            className="custom-font-14px dynamic-margin-class-2"
            style={{ color: "white", fontWeight: "600" }}
          >
            Defendant Notes
          </p>
          <button
            type="submit"
            class="btn btn-primary rounded-0"
            data-id="5"
            onClick={() => {
              setAddInsuranceModalShow(true);
              setCurrentDefendantId(object.id);
            }}
          >
            <span class="font-weight-bold pr-2 text-gold">+</span>Insurance
          </button>
          <button
            type="submit"
            class="btn btn-primary rounded-0"
            onClick={() => {
              setAddCounselModalShow(true);
              setCurrentDefendantId(object.id);
            }}
          >
            <span class="font-weight-bold pr-2 text-gold">+</span>Counsel
          </button>
        </div>
        {/* <h2 className="d-flex align-items-center position-relative " style={{right: "0px" , fontSize: "larger" , zIndex: "1"}} >
                  <small className="font-weight-bold">
                   Client Notes
                  </small>
                </h2> */}
      </div>
    </div>
  );
}

export default DefendantsTitleBar;
