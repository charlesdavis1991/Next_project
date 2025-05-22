import React, { useState, useEffect } from "react";

const WelcomeMessageBlock = () => {
    return (
        <p className=" text-center m-t-5 m-b-5 bg-primary-4">Welcome to the Checklist page.  This page allows you to quickly assess the cases within your firm with the lowest checklist completion percentages across all case types and page checklists.  Simply click a gauge and you will be presented with a control showing up to 10 of the cases within your firm that have the lowest checklist completion percentage for that combination of case type and page.  You can then send tasks to the people assigned to that cases either in a group or as individual cases.  The “Cases Older Than:” selection tool above will allow you to determine the age of the cases you want to assess and by selecting a number of days you will limit the control to cases older than the selected number of days.</p>
    )
}


export default WelcomeMessageBlock;