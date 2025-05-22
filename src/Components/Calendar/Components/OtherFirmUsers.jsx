import React, {useState } from 'react'
import { useSelector,useDispatch } from 'react-redux'; 
import avatarImage from "./../../../assets/images/avatar.svg";
import {  mediaRoute } from "../../../Utils/helper";
import api from "../../../api/api";



export default function OtherFirmUsers({notesFirmUsers,uniqueIdFirmUsers,assignedFirmUsers, setAssignedFirmUsers,  setUniqueIdFirmUsers}) {

  const [clickDates, setClickDates] = useState([]);

  async function clickDatesAPI() {
    try{const response = await api.get("api/click_dates/", {
      params: { case_id: currentCase?.id },
    });
    setClickDates(response.data);}
    catch(e){
      console.error(e)
    }
  }
  
    
       
      const toggleUserAssignment = (uniqueId, isChecked) => {
        if (isChecked) {
          // Add the user to the assignedFirmUsers and uniqueIdFirmUsers arrays
          setUniqueIdFirmUsers([...uniqueIdFirmUsers, uniqueId]);
          setAssignedFirmUsers([...assignedFirmUsers, uniqueId]);
        } else {
          // Remove only the first occurrence of uniqueId from assignedFirmUsers
          const updatedAssignedUsers = assignedFirmUsers.filter((id, idx) => {
            return id !== uniqueId || assignedFirmUsers.indexOf(uniqueId) !== idx;
          });
          // Remove only the first occurrence of uniqueId from uniqueIdFirmUsers
          const updatedUniqueIdUsers = uniqueIdFirmUsers.filter((id, idx) => {
            return id !== uniqueId || uniqueIdFirmUsers.indexOf(uniqueId) !== idx;
          });
      
          setAssignedFirmUsers(updatedAssignedUsers);
          setUniqueIdFirmUsers(updatedUniqueIdUsers);
        }
    }
  return (
    <>
 <div className=" background-main-10 height-25 w-full">
                <h4 className="client-contact-title text-center height-25 d-flex justify-content-center align-items-center">
                Other Firm users
                </h4>
              </div>
    
    <div className="d-flex">
                <div className="dis-grid f-gap-05 adjust-custom-bg height-">
                  {notesFirmUsers?.map((user, index) => {
                    let uniqueId = "Nfirm" + index;
                    return (
                      <div class="td-autosize d-flex justify-content-between align-items-center w-100 height-35">
                        <div class="d-flex align-items-center">
                          <span class="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
                            <img
                              src={
                                user?.profile_pic_29p
                                  ? mediaRoute(user?.profile_pic_29p)
                                  : avatarImage
                              }
                              alt=""
                            />
                          </span>
                          <span class="ml-2 color-black">
                            {user?.first_name} {user?.last_name}
                          </span>
                        </div>
                        <div className="custom-control custom-checkbox m-l-10">
                          <input
                            type="checkbox"
                            className="custom-control-input todo_popup_checkbox"
                            id={"3"}
                            onClick={(e) =>
                                toggleUserAssignment(user?.id,e.target.checked)
                            }
                          />
                          <label
                            className="custom-control-label"
                            htmlFor={"3"}
                          ></label>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
                            </>
  )
}
