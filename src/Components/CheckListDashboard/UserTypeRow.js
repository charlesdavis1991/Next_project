
import React from "react"
import { uniqueByObject, parseJSON } from "./helpers"
import UserTypes from "./UserTypes"

const UserTypeRow = ({caseItem, case_type_name, cases_by_case_type, checked, handleChange, data}) => {
    return (
        <>
        {
            case_type_name?.toLowerCase() === "all" ? (
                <div className="row flex-nowrap m-0 main-checkboxes">
                    <div className="col-md-6 col-lg-6 pl-0">
                        <UserTypes 
                            firmUser={caseItem?.case?.firm_user1}  
                            userTypes={caseItem?.sorted_user_types?.[0] || null}
                            userTypeId={0}
                            caseID={caseItem?.case?.id}
                            randomID={Math.floor(Math.random() * 50)}
                            checkedFunction={checked}
                            handleChange={handleChange}
                            data={data}
                            row_index={0}
                            
                        />
                        <UserTypes 
                            firmUser={caseItem?.case?.firm_user2}  
                            userTypes={caseItem?.sorted_user_types?.[1] || null}
                            userTypeId={1}
                            caseID={caseItem?.case?.id}
                            randomID={Math.floor(Math.random() * 50)}
                            checkedFunction={checked}
                            handleChange={handleChange}
                            data={data}
                            row_index={1}
                            
                        />
                        <UserTypes 
                            firmUser={caseItem?.case?.firm_user3}  
                            userTypes={caseItem?.sorted_user_types?.[2] || null}
                            userTypeId={2}
                            caseID={caseItem?.case?.id}
                            randomID={Math.floor(Math.random() * 50)}
                            checkedFunction={checked}
                            handleChange={handleChange}
                            data={data}
                            row_index={2}
                            
                        />
                    </div>
                    <div className="col-md-6 col-lg-6 pl-0">
                        <UserTypes 
                                firmUser={caseItem?.case?.firm_user4}  
                                userTypes={caseItem?.sorted_user_types?.[3] || null}
                                userTypeId={3}
                                caseID={caseItem?.case?.id}
                                randomID={Math.floor(Math.random() * 50)}
                                checkedFunction={checked}
                                handleChange={handleChange}
                                data={data}
                                row_index={3}
                                
                            />
                            <UserTypes 
                                firmUser={caseItem?.case?.firm_user5}  
                                userTypes={caseItem?.sorted_user_types?.[4] || null}
                                userTypeId={4}
                                caseID={caseItem?.case?.id}
                                randomID={Math.floor(Math.random() * 50)}
                                checkedFunction={checked}
                                handleChange={handleChange}
                                data={data}
                                row_index={4}
                                
                            />
                            <UserTypes 
                                firmUser={caseItem?.case?.firm_user6}  
                                userTypes={caseItem?.sorted_user_types?.[5] || null}
                                userTypeId={5}
                                caseID={caseItem?.case?.id}
                                randomID={Math.floor(Math.random() * 50)}
                                checkedFunction={checked}
                                handleChange={handleChange}
                                data={data}
                                row_index={5}
                                
                            />
                    </div>
                </div>
            ) : (
                <div className="row flex-nowrap m-0 main-checkboxes">
                    <div className="col-md-6 col-lg-6 pl-0">
                        <UserTypes 
                            firmUser={caseItem?.case?.firm_user1}  
                            userTypes={parseJSON(cases_by_case_type?.unique_user_types)?.[0] ? parseJSON(cases_by_case_type?.unique_user_types)?.[0][0]  : null || null}
                            userTypeId={0}
                            caseID={caseItem?.case?.id}
                            randomID={Math.floor(Math.random() * 50)}
                            checkedFunction={checked}
                            row_index={0}
                            handleChange={handleChange}
                            data={data}
                        />
                        <UserTypes 
                            firmUser={caseItem?.case?.firm_user2}  
                            userTypes={parseJSON(cases_by_case_type?.unique_user_types)?.[0] ? parseJSON(cases_by_case_type?.unique_user_types)?.[1][0]  : null || null}
                            userTypeId={1}
                            caseID={caseItem?.case?.id}
                            randomID={Math.floor(Math.random() * 50)}
                            checkedFunction={checked}
                            row_index={1}
                            handleChange={handleChange}
                                data={data}
                        />
                        <UserTypes 
                            firmUser={caseItem?.case?.firm_user3}  
                            userTypes={parseJSON(cases_by_case_type?.unique_user_types)?.[0] ? parseJSON(cases_by_case_type?.unique_user_types)?.[2][0]  : null || null}
                            userTypeId={2}
                            caseID={caseItem?.case?.id}
                            randomID={Math.floor(Math.random() * 50)}
                            checkedFunction={checked}
                            row_index={2}
                            handleChange={handleChange}
                                data={data}
                        />
                    </div>
                    <div className="col-md-6 col-lg-6 pl-0">
                        <UserTypes 
                            firmUser={caseItem?.case?.firm_user4}  
                            userTypes={parseJSON(cases_by_case_type?.unique_user_types)?.[0] ? parseJSON(cases_by_case_type?.unique_user_types)?.[3][0]  : null || null}
                            userTypeId={3}
                            caseID={caseItem?.case?.id}
                            randomID={Math.floor(Math.random() * 50)}
                            checkedFunction={checked}
                            row_index={3}
                            handleChange={handleChange}
                                data={data}
                        />
                        <UserTypes 
                            firmUser={caseItem?.case?.firm_user5}  
                            userTypes={parseJSON(cases_by_case_type?.unique_user_types)?.[0] ? parseJSON(cases_by_case_type?.unique_user_types)?.[4][0]  : null || null}
                            userTypeId={4}
                            caseID={caseItem?.case?.id}
                            randomID={Math.floor(Math.random() * 50)}
                            checkedFunction={checked}
                            row_index={4}
                            handleChange={handleChange}
                                data={data}
                        />
                        <UserTypes 
                            firmUser={caseItem?.case?.firm_user6}  
                            userTypes={parseJSON(cases_by_case_type?.unique_user_types)?.[0] ? parseJSON(cases_by_case_type?.unique_user_types)?.[5][0]  : null || null}
                            userTypeId={5}
                            caseID={caseItem?.case?.id}
                            randomID={Math.floor(Math.random() * 50)}
                            checkedFunction={checked}
                            row_index={5}
                            handleChange={handleChange}
                                data={data}
                        />
                    </div>
                </div>   
            )

        }
        </>
        
    )
}

export default UserTypeRow;