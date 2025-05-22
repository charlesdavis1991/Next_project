import React, { Fragment } from 'react'
import { useEffect,useState } from 'react';
import avatarImage from "./../../../assets/images/avatar.svg";
import {  mediaRoute } from "../../../Utils/helper";

export default function ClientSelection({case_users,case_users1,uniqueIdUsers,assignedUsers, setAssignedUsers,  setUniqueIdUsers}) {
  const [clickDates, setClickDates] = useState([]);
  const [successBtnFlag, setSuccessBtnFlag] = useState(false);
  useEffect(() => {

    setSuccessBtnFlag(assignedUsers.length === 0 ? false : true);
    if (clickDates.length === 0) {
      clickDatesAPI();
    }

  },[assignedUsers])
  async function clickDatesAPI() {
    try{const response = await api.get("api/click_dates/", {
      params: { case_id: currentCase?.id },
    });
    setClickDates(response.data);}
    catch(e){
      console.error(e)
    }
  }
  function fetchClickDate(id) {
    const clickObject = clickDates.find((element) => id === element?.user?.id);
  
    return clickObject?.created_at
      ? new Date(clickObject?.created_at).toISOString().split("T")[0]
      : "";
  }
  const toggleUserAssignment = (uniqueId,  isChecked) => {
    if (isChecked) {
      // Add the user to the assignedUsers and uniqueIdUsers arrays
      setUniqueIdUsers([...uniqueIdUsers, uniqueId]);
      setAssignedUsers([...assignedUsers, uniqueId]);
    } else {
      // Remove only the first occurrence of uniqueId from assignedUsers
      const updatedAssignedUsers = assignedUsers.filter((id, idx) => {
        return id !== uniqueId || assignedUsers.indexOf(uniqueId) !== idx;
      });
  
      // Remove only the first occurrence of uniqueId from uniqueIdUsers
      const updatedUniqueIdUsers = uniqueIdUsers.filter((id, idx) => {
        return id !== uniqueId || uniqueIdUsers.indexOf(uniqueId) !== idx;
      });
  
      setAssignedUsers(updatedAssignedUsers);
      setUniqueIdUsers(updatedUniqueIdUsers);
    }
  
    console.log("Unique IDs:", uniqueIdUsers);
    console.log("Assigned Users:", assignedUsers);
  };
  
  return (
    <div className='d-flex-column'>

    <div className=" background-main-10 height-25 w-full">
                <h4 className="client-contact-title text-center height-25 d-flex justify-content-center align-items-center">
                CASE WORKERS ASSIGNED TO CASE
                </h4>
              </div>
    
    <div className="d-flex background-main-2 f-gap-05 mb-3">
                <div className="table-responsive table--no-card rounded-0 border-0 position-relative">
                  <table className="table table-borderless table-striped table-earning has-height-25 has-table-sub-panel">
                    <tbody>
                      {case_users.map((user, index) => {
                        // const uniqueId = `${user?.id}-${index}-caseuser1`;
                        const uniqueId2 = `${user?.id}-${index}-caseuser1`;
                        const uniqueId = user?.id

                        return (
                          <tr key={uniqueId2}>
                            <td id="padding-l-15"></td>
                            <td className="td-autosize d-flex justify-content-between align-items-center w-100">
                              <div className="d-flex">
                                <button
                                  type="button"
                                  className="btn d-flex align-items-center justify-content-center padding-transform-visibility-margin p-0 flex-g"
                                >
                                  <div className="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
                                    <img
                                      id="output"
                                      src={
                                        user?.profile_pic
                                          ? mediaRoute(user?.profile_pic)
                                          : avatarImage
                                      }
                                      alt={user?.user?.first_name}
                                    />
                                  </div>
                                  <div className="ml-2 flex-g">
                                    {user?.user?.first_name}{" "}
                                    {user?.user?.last_name}
                                  </div>
                                </button>
                              </div>
                            </td>
                            <td className="text-end">
                              {fetchClickDate(user?.user?.id)}
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="custom-control custom-checkbox m-l-10">
                                  <input
                                    type="checkbox"
                                    className="custom-control-input todo_popup_checkbox"
                                    id={`todo_popup_checkbox${uniqueId}`}
                                    user_id={user?.id}
                                    onClick={(e) =>
                                      toggleUserAssignment(uniqueId,e.target.checked)
                                    }
                                  />
                                  <label
                                    className="custom-control-label"
                                    htmlFor={`todo_popup_checkbox${user?.id}`}
                                  ></label>
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="table-responsive table--no-card rounded-0 border-0 position-relative">
                  <table className="table table-borderless table-striped table-earning has-height-25 has-table-sub-panel">
                    <tbody>
                      {case_users1.map((user, index) => {
                        const uniqueId2 = `${user?.id}-${index}-caseuser2`;
                      // {case_users1.map((u2ser, index) => {
                        // const uniqueId = `${user?.id}-${index}-caseuser2`;
                        const uniqueId = user?.id;
                        return (
                          <tr key={uniqueId2}>
                            <td id="padding-l-15"></td>
                            <td className="td-autosize d-flex justify-content-between align-items-center w-100">
                              <div className="d-flex">
                                <button
                                  type="button"
                                  className="btn d-flex align-items-center justify-content-center padding-transform-visibility-margin p-0 flex-g"
                                >
                                  <div className="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
                                    <img
                                      id="output"
                                      src={
                                        user?.profile_pic
                                          ? mediaRoute(user?.profile_pic)
                                          : avatarImage
                                      }
                                      alt={user?.user?.first_name}
                                    />
                                  </div>
                                  <div className="ml-2 flex-g">
                                    {user?.user?.first_name}{" "}
                                    {user?.user?.last_name}
                                  </div>
                                </button>
                              </div>
                            </td>
                            <td className="text-end">
                              {fetchClickDate(user?.user?.id)}
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="custom-control custom-checkbox m-l-10">
                                  <input
                                    type="checkbox"
                                    className="custom-control-input todo_popup_checkbox"
                                    id={`todo_popup_checkbox${uniqueId}`}
                                    user_id={user?.id}
                                    onClick={(e) =>
                                      toggleUserAssignment(uniqueId, user?.id,e.target.checked)
                                    }
                                  />
                                  <label
                                    className="custom-control-label"
                                    htmlFor={`todo_popup_checkbox${user?.id}`}
                                  ></label>
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              </div>

  )
}
