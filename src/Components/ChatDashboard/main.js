import React, { useState, useEffect } from "react";
import ChatBox from "./ChatBox";
import SubjectBox from "./SubjectBox";
import EntitySection from "./EntitySection";
import { useDispatch, useSelector } from "react-redux";
import ActionBarComponent from "../common/ActionBarComponent";

const ChatDashboard = (props) => {
  const activeEntity = useSelector((state) => state.chat.activeEntity);
  const activeSubject = useSelector((state) => state.chat.activeSubject);
  const [newMessageCount, setNewMessageCount] = useState({});
  console.log(newMessageCount);
  const [profilePic, setProfilePic] = useState({});
  const header_name = useSelector((state) => state.header_name?.header_name);

  return (
    <>
      <div className="top-panel-wrapper"></div>
      <div className="main-content" id="padding-top-165">
        <ActionBarComponent
          src="/BP_resources/images/icon/chat-logo-icon.svg"
          page_name={"Chat"}
        />
        {/* <div className="action-bar client-BarAlign main-action-bar  d-flex m-b-5 m-t-5 vertical-align-middle">
              <span className="page-icon">
                <img src="/BP_resources/images/icon/chat-logo-icon.svg" />
              </span>
              <div className="text-wrapper text-white d-flex align-items-center p-l-5">
                <h2 className="text-white">Chat</h2>
              </div>
            </div> */}
        <div className="section__content section__content--p30">
          <div className="container-fluid has-full-height pr-0">
            <div className="row m-t-5 justify-content-center h-100">
              {!props.loader ? (
                <>
                  <EntitySection newMessageCount={newMessageCount} />
                  <SubjectBox
                    profilePic={profilePic}
                    setProfilePic={setProfilePic}
                    chatCount={props.chatCount}
                    setChatCount={props.setChatCount}
                    newMessageCount={newMessageCount}
                    setNewMessageCount={setNewMessageCount}
                    activeEntity={activeEntity}
                  />
                  <ChatBox
                    profilePic={profilePic}
                    chatCount={props.chatCount}
                    setChatCount={props.setChatCount}
                    newMessageCount={newMessageCount}
                    setNewMessageCount={setNewMessageCount}
                  />
                </>
              ) : (
                <div className="loader-container">
                  <div className="loader"></div>
                  <div
                    className=""
                    style={{ position: "absolute", marginTop: "100px" }}
                  >
                    Loading
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatDashboard;
