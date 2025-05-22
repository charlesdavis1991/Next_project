import React, { useState, useEffect } from "react";

import {isCaseAndUserSelected,  defaultImagePath} from "./helpers"

const UserTypes = ({firmUser, userTypes, userTypeId = 0, caseID=1, randomID=0, checkedFunction, handleChange, data, row_index}) => {

    const [caseUserType, setCaseUserType] = useState(null)
    const [firmUserType, setFirmUserType] = useState(null)
    const [profilePic, setProfilePic] = useState(defaultImagePath)
    const [checkBox, setCheckBox] = useState(0)
    const [isChecked, setIsChecked] = useState(false)
    // const []

    const [newClass, setNewClass] = useState("checkbox-wrapper w-100")

    useEffect(() => {
        if(firmUser){
            setFirmUserType(firmUser)
            userTypes ? setCaseUserType(userTypes) : null    
            firmUser?.profile_pic_29p ? setProfilePic(firmUser?.profile_pic_29p) : null
        } else{
            setFirmUserType(null) 
        }
        setCheckBox(Math.floor(Math.random() * 500) + caseID)
        setIsChecked(checkedFunction(caseID,  caseUserType?.pk, row_index))
        // console.debug("usertypes -- : ", isCaseAndUserSelected(caseID, data), caseID)
        // console.debug("UserTypes -- isCaseSelected : ", isCaseSelected(caseID))
        // console.debug("UserTypes -- checkedFunction : ", checkedFunction(caseID,  caseUserType?.pk, row_index))
        // console.debug(caseID,  caseUserType?.pk, row_index)
        // if(isCaseAndUserSelected(caseID, data))
        const { caseSelected, userSelected } = isCaseAndUserSelected(caseID, data)
        if(caseSelected  ){
            if(userSelected){
                setNewClass("checkbox-wrapper w-100")
            } else{
                setNewClass("checkbox-wrapper w-100 text-danger")
            }
        } else{
            setNewClass("checkbox-wrapper w-100")
        }
    }, [data])


    const clickHandler = () => {
        console.debug("Single case worker select : ", {
            caseID : caseID,  
            userType : caseUserType?.pk,  
            row_index : row_index
        })
        handleChange(caseID,  caseUserType?.pk,  row_index)
    }


    return (
        firmUserType ? 
        (
            
            <div className={newClass}>
                <input 
                    data-usertype-id={caseUserType ? caseUserType?.pk : "" } 
                    data-user_id={firmUser?.id}
                    data-case-id={caseID}
                    className={`case-worker-checkbox-${caseID} case-worker-usertype-${caseUserType ? caseUserType?.pk : ''}`} 
                    type="checkbox" 
                    id={"case_worker_" + checkBox} 
                    checked={isChecked}
                    onClick={() => clickHandler()} 
                    
                />
                <label 
                    className={`ml-2 d-flex w-100 align-items-center text-left mb-0 case-worker-label-${caseID} case-worker-usertype-label-${caseUserType ? caseUserType?.pk : ''}`} 
                    for={"case_worker_" + checkBox}>
                        <span className = "fluid-width-50 min-w-145px"> {caseUserType ? caseUserType?.fields? caseUserType?.fields.name:'' : ""}</span> <div className = 'd-flex pl-2'> 
                            <span className="ic-avatar ic-19 has-avatar-icon has-cover-img mr-1"> 
                                <img className={`output-${userTypeId}  theme-ring`} src={profilePic} />	
                            </span> 
                            <span> {`${firmUserType?.user.first_name} ${firmUserType?.user.last_name}`} </span> 
                        </div>
                </label>
            </div>
    
        ) : (
            <div className={newClass}>
                <input 
                    type="checkbox" 
                    id={"case_worker_" + checkBox + "empty"} 
                    checked={isChecked}
                    onClick={() => clickHandler()} 
                />
            </div>
        )

    )
}

export default UserTypes;