import React, { useState, useEffect } from "react";


const CasesList = ({casetype}) => {
    return (
        <li className={"d-flex align-items-center justify-content-center  " +  casetype?.name.replace(/ /g, '') + "_li"} >
            <span>
                <img src={casetype?.image} /> {casetype?.name}
            </span>
        </li>
    )
}

export default CasesList;