import React, { useEffect, useState } from "react";
import avatarImage from "./../../assets/images/avatar.svg";
import { mediaRoute } from "../../Utils/helper";
import CaseWorkerChatModal from "../Modals/CaseWorkerChatModal";

import "./NotesTable.css";
export default function NoteTableContent({ index, data ,notesRef}) {
  const node_env = process.env.NODE_ENV;
  const media_origin =
    node_env === "production" ? "" : process.env.REACT_APP_BACKEND_URL;
  // process.env.NODE_ENV !== "production"
  const [profilePic, setProfilePic] = useState("");
  const [chatData, setChatData] = useState(null);
  const [chatModal, setChatModal] = useState(false);


  const openChatModel = (event, data) => {
    setChatData(data);
    setChatModal(!chatModal);
    event.stopPropagation();
  };

  const handleProfilePic = () => {
    let profilePicUrl;

    try {
      profilePicUrl = data?.note_data?.created_by?.bp_attorneystaff_userprofile
        ? media_origin +
          data?.note_data?.created_by?.bp_attorneystaff_userprofile?.profile_pic_29p
        : avatarImage;
    } catch (error) {
      console.log("ERROR PROFILE PIC", error);
      profilePicUrl = avatarImage;
    }
    setProfilePic(profilePicUrl);
  };

  useEffect(() => {
    handleProfilePic();
  }, [data]);

  return (
    <>
      <tr className=""  ref={el => notesRef.current[data.note_data.id] = el} >
        <td className="width-36" scope="row">
          {index + 1}
        </td>
        <td className="td-autosize hover-button-td">
          <div className="d-flex align-items-center">
            {data?.note_data?.created_at
              ? new Date(data?.note_data?.created_at).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  }
                )
              : ""}
          </div>
        </td>
        <td className="td-autosize hover-button-td">
          <div className="d-flex align-items-center text-lowercase">
            {data?.note_data?.created_at
              ? new Date(data?.note_data?.created_at).toLocaleTimeString(
                  "en-US",
                  {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  }
                )
              : ""}
          </div>
        </td>
        <td className="td-autosize hover-button-td">
          <span
            className="d-flex align-items-center"
            onClick={(e) =>
              // openNoteMessageModal(event, "Aqeel Dev", "null", "651", "no", "")
              openChatModel(e, data)
            }
          >
            <span className="ic-avatar ic-29 has-avatar-icon has-cover-img">
              <img
                className="output-651 theme-ring"
                src={profilePic}
                style={{ borderColor: "#009900 !important" }}
                id="notes-case-worker-avatar-border"
                alt="Profile"
              />
            </span>
            <div id="previewProfilePic" />
            <span className="ml-2 text-black">
              {data?.note_data?.created_by
                ? `${data?.note_data?.created_by?.first_name} ${data?.note_data?.created_by?.last_name}`
                : ""}
            </span>
          </span>
        </td>
        <td className="client_page_note_row hover-button-td notes-sec-color-black">
          <div className="d-flex align-items-center text-capital">
            {data?.note_data?.entity_type && data?.note_data?.record_id
              ? `${data?.additional_desc} Note: `
              : ""}
            {data?.note_data?.description}
          </div>
        </td>
        <td className="td-autosize hover-button-td">
          <div style={{ marginRight: "15px" }}>
            <div className="d-flex align-items-center">
              <span
                class="ic-avatar ic-19 mr-1"
                style={{ marginBottom: "7px" }}
              >
                <img src={mediaRoute(data?.note_data?.category?.page_icon)} />
              </span>
              <span>
                {data?.note_data?.category ? data?.note_data?.category?.name : ""}
              </span>
            </div>
          </div>
        </td>
      </tr>
      <CaseWorkerChatModal
        data={chatData}
        isOpen={chatModal}
        handleOpen={openChatModel}
      />
    </>
  );
}
