import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import api from '../../../api/api';
import { getCaseId, getClientId } from '../../../Utils/helper';
import { parseISO,format } from 'date-fns';





const ModalBodyChat = () => {
    const { register, handleSubmit,setValue } = useForm();
    const[messages,setMessages] =useState(null)
    const client_id = getClientId()
    const case_id = getCaseId()

    const formatDate = (dateString) => {
      const date = parseISO(dateString);
      return format(date, "EEEE M/d/yyyy, h:mm a");
    };


    const fetchData = async () => {
      try {
        const response = await api.get(`/api/client/client-chat-messages/${client_id}/case/${case_id}/`);
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
   
    useEffect(()=>{
      fetchData();
    },[])

    useEffect(()=>{
      console.log("Messages from client = ",messages)
    },[messages])


    const onSubmit = async(data) => {
      try {
        console.log("Counsel data = ", data);
        // Perform the PUT request
        const response = await api.post(`/api/client/client-chat-send-message/${client_id}/case/${case_id}/`, data);
        console.log("Response:", response.data);
        setValue('content','')
        fetchData()
           
        } catch (error) {
            // Handle errors
            console.error("Error submitting data:", error);
        }
    };



    return (
        <div className="w-100 h-100 mt-0 flex-container p-0 chat-page" id="client-chat" style={{ display: 'flex'}}>
        {/* <h1 style={{ textAlign: 'end', paddingRight: '10px' }}>Logged in as : UsamaNawaz</h1> */}
        <input type="hidden" id="logged-in-user" value="18" />
        
        <div className="w-100 chat-container bg-white">
          <div className="row justify-content-center" style={{width:"69vw"}}>
            <div className="col-xl-12 chat">
              <div className="card-custom">




                <div className="messages-wrapper is_active client-portal-display-flex-flex-direction-column-height-100P-overflow-hidden">
                  <div className="card-header msg_head d-flex">
                    <div className="d-flex bd-highlight">
                      <div className="img_cont">
                        <span className="online_icon"></span>
                      </div>
                      <div className="user_info">
                        <span className="client-portal-color-black-font-weight-bold">Chat with Ali Usama Associates</span>
                      </div>
                    </div>
                    {/* <span id="action_menu_btn" style={{ float: 'right !important' }}><i className="fas fa-ellipsis-v"></i></span> */}
                    {/* <div className="action_menu">
                      <ul>
                        <li><i className="fas fa-user-circle"></i> View profile</li>
                        <li><i className="fas fa-users"></i> Add to close friends</li>
                        <li><i className="fas fa-plus"></i> Add to group</li>
                        <li><i className="fas fa-ban"></i> Block</li>
                      </ul>
                    </div> */}
                  </div>
                  {messages && messages.public_chat_messages && messages.public_chat_messages.length > 0 ? (
                      <div className="card-body msg-card-body-portal client-portal-flex-1-overflow-y-auto" id="client-chat-body">
                      {messages.public_chat_messages.map((message, index) => (
                          <div className="d-flex mb-4 replied" key={index}>
                            <div className="msg_cotainer p-0 cp-bg-width-100">
                              <div className="d-flex justify-content-end align-items-center p-2 cp-bg-f-margin-0px">
                                <span className="m-2 cp-color-d6">{formatDate(message.timestamp)}</span>
                                <div className="avatar-wrap position-relative ic-29">
                                  <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
                                    <img src={message.profile_pic_url || '/media/images/profile_pic.jpeg'} alt="Profile" />
                                  </span>
                                </div>
                                <p className="text-right font-weight-semibold ml-2">  {message.user && message.user.trim() !== '' ? message.user.trim() : "Anonymous User"}</p>
                              </div>
                              <div className="d-flex justify-content-end align-items-center message message-body-bg">
                                {message.content}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                ) : (
                  ''
                )}
                 
                  
                 






                </div>

                
  
                <div className="card-footer-custom client-portal-flex-shrink-0" style={{marginTop:"5px"}}>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="input-group">
                      <div className="input-group-append">
                        <span className="input-group-text attach_btn"><i className="fas fa-paperclip"></i></span>
                      </div>
                      <input
                        type="text"
                        id="id_chat_message_input"
                        className="form-control type_msg"
                        placeholder="Type your message..."
                        {...register('content')}
                      />
                      <div className="input-group-append">
                        <button className="btn btn-secondary" id="id_chat_message_submit">
                          <span className="input-group-text send_btn">
                            <i className="fas fa-location-arrow"></i>
                          </span>
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}

export default ModalBodyChat;


