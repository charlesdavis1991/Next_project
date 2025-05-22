import axios from "axios";
import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import RenderProgress from "./RenderProgress";
import { MyVerticallyCenteredModal } from "./EditCheckListModal";
import ProgressCircle from "../CheckListDashboard/ProgressCircle";

const CheckListTable = ({ duration }) => {
  const origin = process.env.REACT_APP_BACKEND_URL;
  const [allFirmCaseTypes, setAllFirmCaseTypes] = useState([]);
  const [pagesList, setPagesList] = useState([]);
  const [allFirmCasetypeImageList, setAllFirmCasetypeImageList] = useState([]);
  const tokenBearer = localStorage.getItem("token");
  const [modalShow, setModalShow] = useState(false);
  const [selectedCheck, setSelectedCheck] = useState();
  const [pagePercentages, setPagePercentages] = useState([]);

  const handleClose = () => setModalShow(false);
  const handleShow = () => setModalShow(true);

  useEffect(() => {
    fetchCaseTypeData();
  }, []);

  const fetchCaseTypeData = async () => {
    try {
      const response = await axios.get(
        `${origin}/api/checklists/get/casename/`,
        {
          headers: {
            Authorization: tokenBearer,
          },
        }
      );

      const { all_firm_cases, all_firm_casetype_image_list, pages_list } =
        response.data;
      setAllFirmCaseTypes(all_firm_cases);
      setAllFirmCasetypeImageList(all_firm_casetype_image_list);
      setPagesList(pages_list);

      // Call percentages for both individual case types and case_type "all"
      fetchAllPercentages(pages_list, all_firm_cases);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPercentages = async (pageName, firmCase) => {
    try {
      const data = {
        case_type: firmCase,
        duration,
        page_name: pageName,
      };

      const response = await axios.post(
        `${origin}/api/checklists/get/percentage/`,
        data,
        {
          headers: {
            Authorization: tokenBearer,
          },
        }
      );

      return response.data.percentage;
    } catch (error) {
      return null;
    }
  };

  const fetchAllPercentages = async (pages, allFirmCases) => {
    // Fetch percentages for all case types including "all"
    const percentages = await Promise.all(
      allFirmCases.map(async (firmCase) => {
        return Promise.all(
          pages.map(async (page) => {
            const pageName = page.name;
            const percentage = await fetchPercentages(pageName, firmCase);
            return {
              pageName,
              percentage,
            };
          })
        );
      })
    );

    // Fetch the percentage for case_type "all"
    const allPercentages = await Promise.all(
      pages.map(async (page) => {
        const pageName = page.name;
        const percentage = await fetchPercentages(pageName, "All");
        return {
          pageName,
          percentage,
          caseType: "All",
        };
      })
    );

    // Set the result with the "all" case type included
    setPagePercentages([...percentages, allPercentages]);
  };

  return (
    <div>
      <Table
        id="check-list-table"
        className="text-start custom-table-directory "
        striped
        responsive
        bordered
        hover
      >
        <thead id="check-list-table-head">
          <tr id="check-list-table-row">
            <th style={{ backgroundColor: "#1D4773", textAlign: "center" }}>
              All Case Type
            </th>
            {pagesList.map((page, index) => (
              <th
                key={index}
                scope="col"
                className="text-align-center bg-danger"
              >
                <span className="mx-auto text-align-center">
                  {page.name} {page.name === "Case" ? "Complete" : ""}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Render the "all" case type */}
          {pagePercentages.length >= 1 && (
            <tr>
              <td
                style={{ backgroundColor: "#1D4773" }}
                className="text-nowrap"
              >
                <span className="d-inline-block ms-2 text-white">
                  All Case Types
                </span>
              </td>

              {pagePercentages[pagePercentages.length - 1].map(
                (pageData, idx) => (
                  <td
                    key={idx}
                    onClick={() => {
                      setSelectedCheck({
                        ...pageData,
                        caseType: "All",
                      });
                      handleShow();
                    }}
                  >
                    <div className="avg-checklist-div text-align-center mx-auto">
                      {pageData.percentage !== null ? (
                        <ProgressCircle case_percentage={pageData.percentage} />
                      ) : (
                        "Loading..."
                      )}
                    </div>
                  </td>
                )
              )}
            </tr>
          )}

          {/* Render individual case types */}
          {allFirmCasetypeImageList?.map((caseItem, index) => (
            <tr key={index}>
              <td
                style={{ backgroundColor: "#1D4773" }}
                className="text-nowrap text-align-center check-list-center"
              >
                <div className="d-flex">
                  <img src={`http://127.0.0.1:8000${caseItem.image}`} alt="" />
                  <span className="d-inline-block ms-2 text-white">
                    {caseItem.name}
                  </span>
                </div>
              </td>

              {/* Render percentage for each page */}
              {pagePercentages.length >= 1 &&
                pagePercentages[index].map((pageData, idx) => (
                  <td
                    key={idx}
                    onClick={() => {
                      setSelectedCheck({
                        ...pageData,
                        caseType: caseItem.name,
                      });
                      handleShow();
                    }}
                  >
                    <div className="avg-checklist-div  text-align-center ">
                      {pageData.percentage !== null ? (
                        <ProgressCircle case_percentage={pageData.percentage} />
                      ) : (
                        "Loading..."
                      )}
                    </div>
                  </td>
                ))}
            </tr>
          ))}
        </tbody>
      </Table>
      <MyVerticallyCenteredModal
        selectedCheck={selectedCheck}
        show={modalShow}
        handleClose={handleClose}
        duration={duration}
      />
    </div>
  );
};

export default CheckListTable;
