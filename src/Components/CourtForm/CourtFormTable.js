import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Button, Nav, Tab, Table } from "react-bootstrap";
import api, { api_without_cancellation } from "../../api/api";
import axios from "axios";
import { getCaseId, getClientId, getLoggedInUserId } from "../../Utils/helper";
import GenericModalComponent from "../common/Modal/Modal";
import { useFooter } from "../common/shared/FooterContext";
import "./CourtFormTable.css";


function CourtFormTable({
  courtFormId,
  formDataContext,
  setFormDataContext,
  setValidationPopUp,
  setValidationText,
  courtFormPdfImages,
  showPdf
}) {
  const origin = process.env.REACT_APP_BACKEND_URL;

  const [variables, setVariables] = useState([]);

  const handleRemoveSpaces = (value) => {
    // Remove extra spaces and trim leading/trailing spaces
    if (value) {
      const cleanedText = value.replace(/\s+/g, " ").trim();
      return cleanedText;
    }

  };

  const fetchVariables = async () => {
    try {
      const response = await api_without_cancellation.get(
        `${origin}/api/documents/read-courtform-key/?court_form_id=${courtFormId}&case_id=${getCaseId()}&client_id=${getClientId()}`
      );

      if (response.status === 200) {
        const variablesData = response.data.data;
        setVariables(variablesData);

        console.log("variables data", variablesData)

        // Loop through the data and update the context for "variable"
        variablesData.forEach(page => {
          const pageData = page.data
          pageData.forEach(row => {
            row.forEach(item => {
              if (item.includes("\nvalue")) {
                const lines = item.split("\n");
                let text_value = "";
                let item_data = []
                let key = null, value = null;
                lines.forEach(line => {

                  if (line.startsWith("value:/")) {
                    text_value = line.split(":/")[1];

                  } else if (line.startsWith("input:/")) {
                    item_data = line.split(":/");
                    key = handleRemoveSpaces(item_data[0])
                    value = handleRemoveSpaces(item_data[1])
                  }


                  setFormDataContext(prevState => ({
                    ...prevState,
                    [value]: text_value
                  }));
                })
              }
            });
          });
        });

      }
    } catch (error) {
      console.log("Failed to fetch court form data:", error);

      let error_text = 'Court Form Key is not attached'
      setValidationText(error_text)
      setValidationPopUp(true)
      console.error("Failed to fetch client data:", error);
    }
  };

  useEffect(() => {
    fetchVariables();
  }, []);



  const handleInputChange = (dataVariable, event) => {

    const { type, checked, value } = event.target;

    setFormDataContext(prevState => ({
      ...prevState,
      [dataVariable]: type === "checkbox" ? (checked ? "X" : "") : value
    }));

  };

  return (

    <div className="w-100 ml-3 m-t-5">
  {variables &&
    variables.map((page, pageIndex) => (
      <>
      <div className="row">
        <div className={showPdf ? "col-9" : "col-12"}
          style={showPdf ? { height: "700px", overflowY: "scroll" } : {}}

        >
          {
            page?.data?.map((row, rowIndex) => (
              <div className="row cf-row" key={rowIndex}>
                {row.map((item, colIndex) => {
                  const lines = item.split("\n");

                  let width = "auto",
                    input_row = null,
                    text_value = "",
                    placeholder = "",
                    fontSize = "14",
                    textAlign = "center",
                    fontWeight = "normal",
                    fontStyle = "normal";
                  let height = "auto";
                  let backgroundColor = "transparent";
                  let textColor = "black";
                  let colspan = 1;
                  let item_data = [];
                  let key = null,
                    value = null;
                  lines.forEach((line) => {
                    if (line.startsWith("width:/")) {
                      width = line.split(":/")[1];
                    } else if (line.startsWith("rows:/")) {
                      input_row = parseInt(line.split(":/")[1], 10);
                    } else if (line.startsWith("value:/")) {
                      text_value = line.split(":/")[1];
                    } else if (line.startsWith("placeholder:/")) {
                      placeholder = line.split(":/")[1];
                    } else if (line.startsWith("fs:/")) {
                      fontSize = line.split(":/")[1];
                    } else if (line.startsWith("ta:/")) {
                      textAlign = line.split(":/")[1];
                    } else if (line.startsWith("fw:/")) {
                      fontWeight = line.split(":/")[1];
                    } else if (line.startsWith("col:/")) {
                      colspan = line.split(":/")[1];
                    } else if (line.startsWith("fst:/")) {
                      fontStyle = line.split(":/")[1];
                    } else if (line.startsWith("height:/")) {
                      height = line.split(":/")[1];
                    } else if (line.startsWith("bgc:/")) {
                      backgroundColor = line.split(":/")[1];
                    } else if (line.startsWith("tc:/")) {
                      textColor = line.split(":/")[1];
                    }  else {
                      item_data = line.split(":/");
                      if (item_data.length > 0) {
                        key = handleRemoveSpaces(item_data[0]);
                        value = handleRemoveSpaces(item_data[1]);
                      } else {
                        key = "";
                        value = "";
                      }
                    }
                  });

                  return (
                    <div
                      key={colIndex}
                      style={{
                        verticalAlign: "middle",
                        maxWidth: `${width}`,
                        width: `${width}`,
                        height: `${height}`,
                        backgroundColor: `${backgroundColor}`,
                        color: `${textColor}`,
                      }}
                      className="col cf-col align-items-center d-flex"
                    >
                      {key === "checkbox" ? (
                        <input
                          className="form-check-input"
                          type="checkbox"
                          onChange={(e) => handleInputChange(value, e)}
                        />
                      ) : key === "input" ? (
                        <textarea
                          className="form-control court-form-textbox"
                          style={{ height: "auto" }}
                          rows={input_row ? input_row : 1}
                          value={formDataContext[value] ? formDataContext[value] : ""}
                          placeholder={placeholder}
                          onChange={(e) => {
                            handleInputChange(value, e); // Ensure changes are propagated
                          }}
                        />
                      ) : (
                        <div
                          className="w-100 px-2"
                          style={{
                            textAlign: textAlign,
                            fontSize: `${fontSize}px`,
                            fontWeight: fontWeight,
                            fontStyle: fontStyle,
                            verticalAlign: "middle",
                          }}
                        >
                          {value || ""}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))
          }
        </div>

        {showPdf && (
          <div className="col-3" style={{height: "700px", overflowY: "auto"}}>
            {courtFormPdfImages.length > 0 && (
              <img src={courtFormPdfImages[pageIndex]} alt="PDF Image" />
            )}
          </div>
        )}
      </div>
      {
        variables.length > 1 ? (
      
          <div className="row" style={{
            backgroundColor: page?.attributes?.bgc || '#fff',  // Default to white if not defined
            height: page?.attributes?.height || '70px'  // Default to 70px if not defined
          }}></div>
        ):(null)
      }
      </>
    ))
  }
</div>

  );
};

export default CourtFormTable;
