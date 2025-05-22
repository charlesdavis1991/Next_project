import React from "react";
import { useSelector } from "react-redux";

export const Stages = ({ stages, stageCase }) => {
  const dynamicWidth = useSelector((state) => state.dynamicWidth.dynamicWidth);

  return (
    <nav
      className="nav nav-tabs flex-nowrap d-block tabs-diagonal-reversed d-flex-lg-1 all-stages text-uppercase bg-nav-color"
      style={{ marginLeft: `${dynamicWidth - 310 ?? 0}px` }}
      id="nav-main"
    >
      {stages &&
        stages.map((stage, index) => {
          const selected_entry = stageCase?.auto_case_stage[0];
          return (
            <>
              {stageCase && stageCase?.auto_case_stage.length > 0 ? (
                <>
                  {stage.order < selected_entry.order ? (
                    <a className="nav-item nav-link header-diagnoal stage-links btn-primary-lighter text-grey font-weight-normal past-case">
                      {stage.name}
                    </a>
                  ) : selected_entry.id == stage.id ? (
                    <a className="nav-item nav-link active font-weight-semibold text-uppercase current-case z-index-9 header-diagnoal">
                      {stage.name}
                    </a>
                  ) : stage.order > selected_entry.order ? (
                    <a className="nav-item nav-link stage-links btn-primary-lighter text-white font-weight-normal future-case header-diagnoal">
                      {stage.name}
                    </a>
                  ) : (
                    <></>
                  )}
                </>
              ) : (
                <a class="nav-item nav-link header-diagnoal">{stage.name}</a>
              )}
            </>
          );
        })}
      <div className="more hidden" data-width="80">
        <a href="#">More</a>
        <div className="hidden-items"></div>
      </div>
    </nav>
  );
};
