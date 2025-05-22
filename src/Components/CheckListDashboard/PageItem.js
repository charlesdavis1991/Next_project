import React, { useState, useEffect } from "react";


const PageItem = ({pageItem}) => {
    let jsonData = JSON.parse(pageItem);
    return (
        <th scope="col" className="cas_t height-25 d-flex align-items-center justify-content-center text-lg">
            {jsonData[0].fields.name} {jsonData[0].fields.name === "Case" ? "Complete" : "Page"}
        </th>
    )
}


export default PageItem;