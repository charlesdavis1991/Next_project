import React from 'react';
import avatarImage from './../../assets/images/avatar.svg';

export default function NotesEventRow({ eventLog, index, handleRowClick }) {
  const node_env = process.env.NODE_ENV;
  const media_origin = node_env === 'production'
    ? ""
    : process.env.REACT_APP_BACKEND_URL;

  const handleProfilePic = (item) => {
    try {
      let profilePicUrl = item?.user?.bp_attorneystaff_userprofile?.profile_pic_29p
        ? media_origin + item.user.bp_attorneystaff_userprofile.profile_pic_29p
        : avatarImage;

      return profilePicUrl;
    } catch (error) {
      console.log('ERROR PROFILE PIC', error);
      return avatarImage;
    }
  };

  const clickRecord = eventLog.click_record || {};
  const clickKey = eventLog.click_key || {};
  const note = eventLog.note?.[0] || {};
  const clickKeyAbautBMS = eventLog.click_key_abautbms || {};
  
  const profilePicUrl = handleProfilePic(clickRecord);
  // const noteProfilePicUrl = handleProfilePic(note);

  const formatDate = (date) => date ? new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/^0+/, '') : '';
  const formatTime = (time) => time ? new Date(time).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }) : '';

  const noteDate = formatDate(note.created_at);
  const noteTime = formatTime(note.created_at);

  return (
    <tr onClick={eventLog.click_key ? () => handleRowClick(eventLog) : undefined}>
      <td scope="row">{index + 1}</td>
      <td className="hover-button-td">{formatDate(clickRecord.created_at)}</td>
      <td className="hover-button-td text-lowercase time_table">{formatTime(clickRecord.created_at)}</td>
      <td className="td-autosize hover-button-td">
        <span
          className="d-flex align-items-center"
          onClick={() => openNoteMessageModal(event, 'Aqeel Dev', 'null', '651', 'no', '')}
        >
          <span className="ic-avatar ic-29 has-avatar-icon has-cover-img">
            <img className={`output-${clickRecord.user?.id} theme-ring`} src={profilePicUrl} alt="profile" />
          </span>
          <div id="previewProfilePic" />
          <span className="ml-2 text-black">{clickRecord.user ? `${clickRecord.user.first_name} ${clickRecord.user.last_name}` : ''}</span>
        </span>
      </td>

      <td className="hover-button-td">{clickKey.click_short_description || ""}</td>
      <td className="hover-button-td">{clickKeyAbautBMS.bill_code_category || ""}</td>
      <td className="">{clickKeyAbautBMS.bill_code_category_name || ""}</td>
      <td className="hover-button-td">{clickKeyAbautBMS.bill_code || ""}</td>
      <td className="hover-button-td">{clickKeyAbautBMS.bill_code_name || ""}</td>
      <td className="hover-button-td white-space-wrap-ns" style={{textWrap:"wrap"}}>{clickKeyAbautBMS.bill_code_definition || ""}</td>
      <td className="hover-button-td">{clickRecord.for_page ? clickRecord.for_page.name : ""}</td>
      <td className="hover-button-td">{note.note || ""}</td>
      <td className="hover-button-td">
        {note && (
          <div className="d-flex align-items-center">
            {
              note.user?<span className="ic-avatar ic-29 has-avatar-icon has-cover-img">
              <img className={`output-${note.user?.id} theme-ring`} src={profilePicUrl} alt="note profile" />
            </span>:''
            }
            
            <span className="ml-2 text-black">{note.user ? `${note.user.first_name} ${note.user.last_name}` : ''}</span>
          </div>
        )}
      </td>
      <td className="hover-button-td">{noteDate} {noteTime}</td>
    </tr>
  );
}
