import React from "react";
import ActionBarComponent from "../common/ActionBarComponent";
import { useSelector } from "react-redux";

const ActionBar = () => {
  const header_name = useSelector((state) => state.header_name?.header_name);

  const buttonsConfig = [
    {
      label: "New Post",
      icon: "+",
      className: "btn btn-primary rounded-0 height-25 p-b-0 p-t-0",
      dataToggle: "modal",
      dataTarget: "#addPost",
      onClick: () => null,
    },
  ];

  return <ActionBarComponent page_name={"Home"} buttons={buttonsConfig} />;
  // <div className="action-bar client-BarAlign d-flex m-b-5">
  // 				<span className="page-icon"><i className="ic ic-35 ic-home"></i></span>
  // 				<div className="text-wrapper text-white d-flex align-items-center p-l-5">
  // 					<h2 className="text-white">Home</h2>
  // 				</div>
  // 				<button
  //                     type="button"
  //                     style={{marginRight:"250px"}}
  //                     className="btn btn-primary rounded-0 case-client-btn btn btn-primary rounded-0 height-25 p-b-0 p-t-0 z-index-1 mr-10 ml-auto">
  //                     <span className="font-weight-bold pr-2 text-gold">+</span>New Post
  //                 </button>
  // 			</div>
};

export default ActionBar;
