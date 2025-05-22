
import React from "react"

import { uniqueByObject } from "./helpers"


const UniqueUserTypes = ({unique_user_types, handleSelectAllCaseWorkers, checked}) => {
    return (
        <div className="row flex-nowrap m-0 top-checkboxes">
            <div className="col-md-6 col-lg-6 pl-0">
                <>
                {
                        uniqueByObject(unique_user_types)?.map((objItem, index) => (
                            (index % 2 === 0) ? (
                                <div className={"checkbox-wrapper " + objItem?.pk}>
                                    <input data-usertype-id={objItem?.pk} data-user_id="" className="all-workers-types" type="checkbox"  onClick={() => handleSelectAllCaseWorkers("all", objItem?.pk)} 
                                    id={"case_worker_type_" + objItem?.pk} 
                                    checked={checked("all", objItem?.pk)}
                                    />
                                    <label className="ml-2 text-left mb-0" for={"case_worker_type_" + objItem?.pk}  >{objItem?.fields.name}</label>
                                </div>
                            ) : null
                        ))
                    }
                </>
            </div>
            <div className="col-md-6 col-lg-6 pl-0">
                <>
                    {
                        uniqueByObject(unique_user_types)?.map((objItem, index) => (
                            (index % 2 !== 0) ? (
                                <div className={"checkbox-wrapper " + objItem?.pk}>
                                    <input data-usertype-id={objItem?.pk} data-user_id="" className="all-workers-types" type="checkbox"  onClick={() => handleSelectAllCaseWorkers("all", objItem?.pk)} 
                                    id={"case_worker_type_" + objItem?.pk} 
                                    checked={checked("all", objItem?.pk)}
                                    />
                                    <label className="ml-2 text-left mb-0" for={"case_worker_type_" + objItem?.pk}  >{objItem?.fields.name}</label>
                                </div>
                            ) : null
                        ))
                    }
                </>
            </div>
        </div>
    )
}


export default UniqueUserTypes