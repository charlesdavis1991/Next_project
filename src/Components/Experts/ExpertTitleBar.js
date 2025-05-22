import React from "react";
import { useSelector } from "react-redux";
import PanelChecklist from "../common/PanelChecklist";

const ExpertTitleBar = ({ ...object }) => {
  const client = useSelector((state) => state.todos.client);
  return (
    <div
      className="border-box  has-checklist position-relative"
      style={{ zIndex: "2"}}
    >
      <div className=" d-flex flex-row has-title-bg skewed-primary-gradient-new">
        <PanelChecklist entity={"Experts"} entity_id={object?.id} />

        {/* title bar */}
        <div

          style={{ paddingLeft: "50px" }}
          className="top-header height-25 d-flex  responsive-width-of-title "
        >
          <div
            style={{
              fontWeight: "600",
            }}
            className="top-head-fixed custom-font-14px d-flex align-items-center"
          >
            <span className="d-flex align-items-center mr-1">
              {`${object?.first_name ? object?.first_name + " " + object?.last_name : "EXPERT"}`}
            </span>

            <span class="mr-1 custom-font-14px">For</span>

            <span className="d-flex align-items-center mr-1">
              {object?.retained_by_entity || "Party"}
            </span>
            

            <span className="d-flex align-items-center mr-1">
            {object?.retained_by_name}
            </span>

            <span className="d-flex align-items-center mr-1 custom-font-14px">
              {object?.expert_catagery_names}
            </span>
          </div>
        </div>

        <p
          className="d-flex align-items-center position-relative text-white custom-font-14px "
          style={{
            right: "0px",
            zIndex: "1",
            fontWeight: "600",
          }}
        >
          Experts Notes
        </p>
      </div>
    </div>

  );
};

export default React.memo(ExpertTitleBar);
