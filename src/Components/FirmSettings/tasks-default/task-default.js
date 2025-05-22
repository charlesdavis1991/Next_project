import React, { useEffect, useState } from "react";
import CommonHeader from "../common/common-header";
import useGetTaskDefault from "./hooks/useTaskDefault";
import api from "../../../api/api";

const TaskDefault = () => {
  const heading =
    "TASK GENERATION DEFAULTS FOR CASE NAVIGATION TOOLS AND SEARCH RESULTS";
  const points = [
    "1. Firm settings panel instruction point one",
    "2. Firm settings panel instruction point two",
    "3. Firm settings panel instruction point three",
  ];
  const { data, refetch } = useGetTaskDefault();
  const [taskDefault, setTaskDefault] = useState(null);
  useEffect(() => {
    if (data) {
      setTaskDefault(data);
    }
  }, [data]);

  const handleCheckBoxChange = async (id, value, page) => {
    console.log(id, value, page);

    const updatedTaskDefault = JSON.parse(JSON.stringify(taskDefault));

    let dataKey;
    switch (page) {
      case "Inbox":
        dataKey = "inbox_data";
        break;
      case "Case_Navigator":
        dataKey = "cn_data";
        break;
      case "Checklist_Page":
        dataKey = "checklist_data";
        break;
      case "Search_Page":
        dataKey = "search_data";
        break;
      default:
        return;
    }
    const itemIndex = updatedTaskDefault[dataKey].findIndex(
      (item) => item.id === id
    );
    if (itemIndex !== -1) {
      updatedTaskDefault[dataKey][itemIndex].doc_review = value;
    }
    setTaskDefault(updatedTaskDefault);

    try {
      const response = await api.post(
        `/api/firmsetting-page/edit-task-defaults/`,
        {
          id: id,
          check: value,
        }
      );
      if (response.status === 200) {
        refetch();
      }
    } catch (error) {
      setTaskDefault(taskDefault);
      console.error("Failed to update task default:", error);
    }
  };

  return (
    <div className="tab-pane fade firm-settings-user-perms-fs active show">
      <div>
        <CommonHeader heading={heading} points={points} />
      </div>
      <div style={{ marginTop: "20px" }}>
        <div className="row">
          <div className="col-md-3" style={{ paddingLeft: "30px" }}>
            <h5 className="font-weight-bold m-b-5">
              Inbox default for sending <br /> Document Review Tasks
            </h5>
            {taskDefault?.inbox_data?.map((item, index) => (
              <div
                className="d-flex align-items-center "
                style={{ gap: "10px", marginBottom: "10px" }}
                key={index}
              >
                <input
                  type="checkbox"
                  checked={item?.doc_review === true}
                  onChange={(e) =>
                    handleCheckBoxChange(item.id, e.target.checked, "Inbox")
                  }
                />
                <label className="mb-0" htmlFor={item.id}>
                  {item?.for_firm_user_type?.name}
                </label>
              </div>
            ))}
          </div>
          <div className="col-md-3">
            <h5 className="font-weight-bold m-b-5">
              Case Navigator default for sending <br /> General tasks
            </h5>
            {taskDefault?.cn_data?.map((item, index) => (
              <div
                className="d-flex align-items-center "
                style={{ gap: "10px", marginBottom: "10px" }}
                key={index}
              >
                <input
                  type="checkbox"
                  checked={item?.doc_review === true}
                  onChange={(e) =>
                    handleCheckBoxChange(
                      item.id,
                      e.target.checked,
                      "Case_Navigator"
                    )
                  }
                />
                <label className="mb-0" htmlFor={item.id}>
                  {item?.for_firm_user_type?.name}
                </label>
              </div>
            ))}
          </div>
          <div className="col-md-3">
            <h5 className="font-weight-bold m-b-5">
              Checklist default for sending <br /> General tasks
            </h5>
            {taskDefault?.checklist_data?.map((item, index) => (
              <div
                className="d-flex align-items-center "
                style={{ gap: "10px", marginBottom: "10px" }}
                key={index}
              >
                <input
                  type="checkbox"
                  checked={item?.doc_review === true}
                  onChange={(e) =>
                    handleCheckBoxChange(
                      item.id,
                      e.target.checked,
                      "Checklist_Page"
                    )
                  }
                />
                <label className="mb-0" htmlFor={item.id}>
                  {item?.for_firm_user_type?.name}
                </label>
              </div>
            ))}
          </div>
          <div className="col-md-3">
            <h5 className="font-weight-bold m-b-5">
              Search Results default for sending Tasks <br /> General tasks
            </h5>
            {taskDefault?.search_data?.map((item, index) => (
              <div
                className="d-flex align-items-center "
                style={{ gap: "10px", marginBottom: "10px" }}
                key={index}
              >
                <input
                  type="checkbox"
                  checked={item?.doc_review === true}
                  onChange={(e) =>
                    handleCheckBoxChange(
                      item.id,
                      e.target.checked,
                      "Search_Page"
                    )
                  }
                />
                <label className="mb-0" htmlFor={item.id}>
                  {item?.for_firm_user_type?.name}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDefault;
