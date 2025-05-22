import React from "react";
import ActionBarComponent from "../common/ActionBarComponent";
import ActionBarImg from "../../../public/BP_resources/images/icon/inbox-icon-color.svg";

const InboxActionBar = (props) => {    
    return (
        <ActionBarComponent
        src={ActionBarImg}
        page_name={"Inbox"}
        />
    );
}

export default InboxActionBar;