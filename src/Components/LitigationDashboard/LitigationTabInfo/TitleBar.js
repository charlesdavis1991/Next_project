import React from "react";
import { useSelector } from "react-redux";
import PanelChecklist from "../../common/PanelChecklist";
import zIndex from "@mui/material/styles/zIndex";

function TitleBar({ object, name, letterTemps = [] , type}) {
  const client = useSelector((state) => state.todos.client);
  return (
    <div
      className="border-box  has-checklist position-relative"
      style={{ zIndex: "2", }}
    >
      <div 
        className={`d-flex flex-row ${type === "sol" ? "has-title-sol-bg" : "has-title-bg"}`}
        id="lit-act-before"
        >
        <PanelChecklist entity={"Litigation"} entity_id={object?.id} type={type==="sol" ? "sol" : ""}/>
        <div style={{ position: "absolute", left: "0px", zIndex: "2",width:"19px",height:"19px",top:"3px" }}>
          <i className={`ic ic-19 w-100 h-100 ${type === "sol" ? `ic-SOL` : `ic-${name}`}`}></i>
        </div>

        {/* <div class="panel-icon">
          <i class="ic ic-{{litigation_act.event_type_id.litigation_event_type}} ic-25"></i>
        </div> */}

        <div
          style={{ paddingLeft: "34px" }}
          className="top-header height-25  responsive-width-of-title "
        >
          <div
            style={{
              fontWeight: "600",
            }}
            className="top-head-fixed custom-font-14px p-t-5 p-b-5 height-25"
          >
            <div className="d-flex">
              {/* {object?.date_name ? (
                <h2 className="d-flex align-items-center">
                  <small className="font-weight-bold">
                    {object?.date_name}
                  </small>
                </h2>
              ) : ( */}
                <h2 style={{ zIndex: "1" }}>
                  <small className={type==="sol" ? "text-white font-weight-bold" : "font-weight-bold"}>
                    {object.event_id?.event_name}{object?.for_defendant?.entity_name && `: ${object.for_defendant.entity_name}`}
                  </small>
                </h2>
              {/* )} */}
              <p className="m-l-5 m-r-5 textWrap-NW">{object?.name}</p>

              {letterTemps && (
                <div className="btn-wrapper ml-2">
                  {letterTemps?.map(
                    (temp) =>
                      temp.litigation_event === object.event_id && (
                        <>
                          {temp.template_type === "Question" && (
                            <button
                              className="btn btn-primary rounded-0"
                              onClick={() =>
                                selectTemplate(
                                  event,
                                  temp.question_template.id,
                                  "letter_template_hearing",
                                  "Question",
                                  object.documents
                                    .filter(
                                      (doc) =>
                                        doc.document_slot.slot_number === 1
                                    )
                                    .map((doc) => doc.id)
                                    .join(","),
                                  temp.litigation_event.id,
                                  temp.letter_template.id,
                                  object.id
                                )
                              }
                            >
                              Generate Question
                            </button>
                          )}
                          {temp.template_type === "Answer" && (
                            <button
                              className="btn btn-primary rounded-0"
                              onClick={() =>
                                selectTemplate(
                                  event,
                                  temp.question_template.id,
                                  "letter_template_hearing",
                                  "Answer",
                                  object.documents
                                    .filter(
                                      (doc) =>
                                        doc.document_slot.slot_number === 1
                                    )
                                    .map((doc) => doc.id)
                                    .join(","),
                                  temp.litigation_event.id,
                                  temp.letter_template.id,
                                  object.id
                                )
                              }
                            >
                              Generate Answer
                            </button>
                          )}
                        </>
                      )
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* <p
          className="d-flex align-items-center position-relative text-white custom-font-14px"
          style={{
            right: "0px",
            zIndex: "1",
            fontWeight: "600",
          }}
        >
          {name} Notes
        </p> */}
      </div>
    </div>
  );
}

export default TitleBar;
