import React, {useState, useEffect, useRef, useCallback} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getClientId, getCaseId } from "../../Utils/helper";
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { createVideoChatAPI } from "../../Providers/main";
import { getToken } from '../../Utils/helper';
import { fetchChatPage,fetchChatStaffThreads, updateNotificationChatAPI } from "../../Providers/main";
import { setActiveSubject, setUserProfile, setProviders, setStaffThreads, setCurrentUser, setClientThreads, setProviderClients, setThreads } from '../../Redux/chat/actions';

const ChatBox = (props) => {
    const dispatch = useDispatch()
    const activeSubject = useSelector((state) => state.chat.activeSubject);
    const currentUser = useSelector((state) => state.chat.currentUser);
    const staffThreads = useSelector((state) => state.chat.staffThreads);
    
    const [message, setMessage] = useState("");
    const [refreshState, setRefreshState] = useState(false);
    const webSocketLink = "https://chat-ecs.simplefirm.com".includes("http://") ? `ws://${"https://chat-ecs.simplefirm.com".replace("http://", "")}` : `wss://${"https://chat-ecs.simplefirm.com".replace("https://", "")}`
    const [socketUrl, setSocketUrl] = useState(`${webSocketLink}/30/32/${getClientId()}/${getCaseId()}/?chat_token=12345&username=${currentUser?.username}`);
    const [messageHistory, setMessageHistory] = useState([]);
    const { sendMessage, lastMessage, readyState } = useWebSocket(
        socketUrl,
        {
          share: false,
          shouldReconnect: () => true,
        },
    );

    useEffect(() => {
        updateNotificationChatAPI(activeSubject?.thread?.id)
        if(lastMessage) {
            const message = JSON.parse(lastMessage?.data)
            let newMessage = {}
            if(message?.thread_id == activeSubject?.thread?.id) {
                if(message?.sent_by == activeSubject?.thread?.first_person?.id) {
                    newMessage = {
                        id: message?.id,
                        user: {
                          id: message?.sent_by,
                          first_name: message?.sent_by_user?.first_name,
                          last_name: message?.sent_by_user?.last_name,
                          username: message?.user_name
                        },
                        sender_name: "",
                        message: message?.message,
                        timestamp: new Date().toISOString(),
                        thread: message?.thread_id
                    };
                } else {
                    newMessage = {
                        id: message?.id,
                        user: {
                          id: message?.sent_by,
                          first_name: message?.sent_by_user?.first_name,
                          last_name: message?.sent_by_user?.last_name,
                          username: message?.user_name
                        },
                        sender_name: "",
                        message: message?.message,
                        timestamp: new Date().toISOString(),
                        thread: message?.thread_id
                    };
                }
                let newChatMessagesThread = activeSubject
                if (newChatMessagesThread?.thread?.chat_messages?.details.filter((msg) => msg?.id == newMessage?.id)?.length > 0){
                    return
                }
                
                newChatMessagesThread?.thread?.chat_messages?.details.push(newMessage);
                dispatch(setActiveSubject(newChatMessagesThread))
            } else {
                let updatedNewMessageCount = props.newMessageCount;
                updatedNewMessageCount[message?.thread_id] +=1
                props.setNewMessageCount(updatedNewMessageCount)
                props.setChatCount(props.chatCount+1)
            }
        }
        fetchChatPage(dispatch, getClientId(), getCaseId(), setUserProfile, setProviders, setStaffThreads, setCurrentUser, setClientThreads, setProviderClients, setThreads)
        fetchChatStaffThreads(dispatch, getClientId(), getCaseId(),setStaffThreads)
        setRefreshState(!refreshState)
        console.log(`Got a new message`)
    }, [lastMessage])
    
    console.log(activeSubject)

    const handleClickSendMessage = (e, messageLink) => {
        e.preventDefault();
        let sendTo = activeSubject?.thread?.first_person?.id;
        let username = activeSubject?.thread?.first_person?.username;
        let profile_pic = props.profilePic[activeSubject?.thread?.first_person?.id];
        
        if(activeSubject?.thread?.first_person?.id == currentUser?.id) {
            sendTo = activeSubject?.thread?.second_person?.id;
            username = activeSubject?.thread?.second_person?.username;
            profile_pic = props.profilePic[activeSubject?.thread?.second_person?.id]
        }
        
        let data = {
            message: message,
            sent_by: currentUser?.id,
            send_to: sendTo,
            thread_id: activeSubject?.thread?.id,
            user_name: username,
            profile_pic: profile_pic
        };
        if(messageLink) {
            data['message'] = messageLink
        }
        sendMessage(JSON.stringify(data))
        console.log(JSON.stringify(data))
        setMessage("")
        const inputField = window.document && window.document.getElementById("input-field");
        if (inputField) {
          inputField.value = "";
        }
        fetchChatPage(dispatch, getClientId(), getCaseId(), setUserProfile, setProviders, setStaffThreads, setCurrentUser, setClientThreads, setProviderClients, setThreads)
        fetchChatStaffThreads(dispatch, getClientId(), getCaseId(),setStaffThreads)
    };
    
    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
      }[readyState];
    
    console.log(connectionStatus)
    
    const handleClickOnVideoLink = (e) => {
        e.preventDefault()
        if (e.target.tagName.toLowerCase() === 'a') {
            let linkText = e.target.textContent?.split("videochat/room/")[1]
            const link = `https://chat-ecs.simplefirm.com/api/redirect/videochat/?link=${linkText}&token=${getToken()}`
            window.open(link, "_blank");
        }
    }

    const createVideoChat = (e) => {
        e.preventDefault()
        const user_id = activeSubject?.thread?.first_person?.id != currentUser?.id ? activeSubject?.thread?.first_person?.id : activeSubject?.thread?.second_person?.id
        createVideoChatAPI(user_id).then((videoCallLink) => {
            const link = `https://chat-ecs.simplefirm.com/api/redirect/videochat/?link=${videoCallLink}&token=${getToken()}`
            window.open(link, "_blank", 'width=600,height=400');
            const messageLink = `Join video call: <a class="msg-margin-left-10px" href="${link}" target="_blank">https://chat-ecs.simplefirm.com/videochat/room/${videoCallLink}</a>`
            setMessage(messageLink)
            handleClickSendMessage(e, messageLink)
        })


    }
    // Function to get the day of the week
    const getDayOfWeek = (timestampString) => {
        const timestamp = new Date(timestampString);
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[timestamp.getDay()];
    };

    // Function to format the date as MM/DD/YYYY
    const formatDate = (timestampString) => {
        const timestamp = new Date(timestampString);
        const month = timestamp.getMonth() + 1; 
        const day = timestamp.getDate();
        const year = timestamp.getFullYear();
        return `${month}/${day}/${year}`;
    };
    
    // Function to format the time as hh:mm am/pm
    // const formatTime = (timestampString) => {
    //     const timestamp = new Date(timestampString);
    //     let hours = timestamp.getUTCHours();
    //     const minutes = timestamp.getUTCMinutes();
    //     const ampm = hours >= 12 ? 'pm' : 'am';
    //     hours = hours % 12;
    //     hours = hours ? hours : 12; // Handle midnight (0 hours)
    //     return `${hours}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;
    // };
    const formatTime = (timestampString) => {
        const timestamp = new Date(timestampString);
        const now = new Date();
        const diff = Math.floor((now - timestamp) / (1000 * 60 * 60)); // Difference in hours
    
        let hours = timestamp.getUTCHours();
        const minutes = timestamp.getUTCMinutes();
        const ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // Handle midnight (0 hours)
    
        return `${hours}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}, ${diff} hours ago`;
    };
    
    

    return (
    <>
        <div className="d-flex-1 h-100 p-0" style={{ marginRight: "20px" }}>
            <div className="p-l-5 background-main-10 height-25">
                <h4 className="client-contact-title text-center d-flex justify-content-center align-items-center h-100">Chat</h4>
            </div>
            {connectionStatus != "Open" ?
                <>
                    <div className="loader-container">
                        <div className="loader"></div>
                        <div className="" style={{ position: "absolute", marginTop: "100px" }}>Connecting</div>
                    </div>
                    
                </>
                :
                (activeSubject?.thread &&
                    <div className="card bg-white h-100">
                        <div className="messages-wrapper hide is_active" id="chat_panel_{{ thread.id }}" user-id="{{request.user.id}}" chat-id="chat_{{ thread.id }}" other-user-id="
                                {% if thread.first_person == user %}
                                    {{ thread.second_person.id }}
                                {% else %}
                                    {{ thread.first_person.id }}
                                {% endif %}
                            ">
                            <div style={{ height: "35px", padding: "5px" }} className="card-header msg_head">
                                <div style={{ height: "25px" }} className="d-flex bd-highlight ">
                                    <div style={{ height: "25px" }} className="avatar-wrap position-relative ic-29">
                                        <span style={{ height: "25px", width: "25px" }} className="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
                                        
                                        {
                                        activeSubject?.type == 'CoWorker' ? 
                                            (activeSubject?.thread?.first_person?.id != currentUser?.id ? 
                                            <img src={props.profilePic[activeSubject?.thread?.first_person?.id]} />
                                            : 
                                            <img src={props.profilePic[activeSubject?.thread?.second_person?.id]} />
                                            )
                                        :
                                            <img src={activeSubject?.thread?.client?.profile_pic} />
                                        }
                                        </span>
                                    </div>
                                    <div style={{marginLeft: "3px"}} className="user_info">
                                        {activeSubject?.type == 'CoWorker' ?
                                            <span className="text-black user-name"><span className="font-weight-semibold">{activeSubject?.thread?.first_person?.id != currentUser?.id ? (activeSubject?.thread?.first_person?.first_name +" "+ activeSubject?.thread?.first_person?.last_name) : (activeSubject?.thread?.second_person?.first_name +" "+ activeSubject?.thread?.second_person?.last_name)}</span></span>
                                            :
                                            <span className="text-black user-name font-weight-semibold">Chat with {activeSubject?.type} About {activeSubject?.thread?.client?.first_name +" "+ activeSubject?.thread?.client?.last_name}</span>
                                        
                                        }
                                    </div>
                                    
                                    
                                    <button onClick={createVideoChat} className="videochat-button"
                                        style={{
                                            background: "url('https://simplefirm-bucket.s3.amazonaws.com/static/videochat/images/video-call-green.png') no-repeat center center",
                                            height: "25px",
                                            marginRight: "5px"
                                        }}
                                    >
                                    </button>     
                                    
                                </div>
                            </div>
                            {/* Message Card Body */}
                                    
                            <div className="msg_card_body-wrapper">
                                <div className="card-body msg_card_body">
                                    {
                                        activeSubject?.thread?.chat_messages?.details?.map((message, index) => 
                                        message?.user?.id != currentUser?.id ?
                                        <>
                                            {activeSubject?.thread?.chat_messages?.details[index-1]?.user?.id != message?.user?.id 
                                            ?
                                                <div style={{height: "35px"}} className="d-flex justify-content-start align-items-center chat-receiver-row">
                                                    <div style={{marginLeft: "10px"}} className="avatar-wrap position-relative ic-29">
                                                        <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
                                                            {
                                                                props.profilePic[message?.user?.id] ? 
                                                                <img src={props.profilePic[message?.user?.id]} alt="Profile Pic" /> 
                                                                : null
                                                            }
                                                        </span>
                                                    </div>
                                                    <p className="text-right font-weight-semibold ml-2 mb-0">{message?.user?.first_name} {message?.user?.last_name}</p>
                                                    <span style={{display: "flex"}} className="msg_time_send text-grey position-static p-l-10"><span className="p-r-5">{getDayOfWeek(message?.timestamp)}</span><span className="p-r-5">{formatDate(message?.timestamp)}</span>{formatTime(message?.timestamp)}</span>
                                                </div> 
                                            : 
                                            ((((new Date(message.timestamp) - new Date(activeSubject?.thread?.chat_messages?.details[index-1]?.timestamp))/60000) > 10) 
                                            ? 
                                                <div style={{height: "35px"}} className="d-flex justify-content-start align-items-center chat-receiver-row">
                                                    <span style={{display: "flex"}} className="msg_time_send text-grey position-static p-l-10"><span className="p-r-5">{getDayOfWeek(message?.timestamp)}</span><span className="p-r-5">{formatDate(message?.timestamp)}</span>{formatTime(message?.timestamp)}</span>
                                                </div> 
                                            : null )
                                            }
                                            <div className="text-left received">
                                                <div className="msg_cotainer d-inline-block m-0">
                                                <div onClick={handleClickOnVideoLink} dangerouslySetInnerHTML={{ __html: message?.message }} />
                                                
                                                </div>
                                            </div> 
                                        </>
                                        :
                                        <>
                                        {activeSubject?.thread?.chat_messages?.details[index-1]?.user?.id != message?.user?.id ? 
                                            <div style={{height: "35px"}} className="d-flex align-items-center justify-content-end chat-sender-row">
                                                <div style={{marginRight: "10px"}} className="d-flex justify-content-end align-items-center">
                                                    <div className="avatar-wrap  position-relative ic-29">
                                                        <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
                                                            {
                                                                props.profilePic[message?.user?.id] ? 
                                                                <img src={props.profilePic[message?.user?.id]} alt="Profile Pic" /> 
                                                                : null
                                                            }
                                                            </span>
                                                    </div>
                                                    <p className="text-right font-weight-semibold ml-2 mb-0">{message?.user?.first_name} {message?.user?.last_name}</p>
                                                </div> 
                                                <span  style={{display: "flex"}} className="msg_time_send text-grey position-static p-r-15 d-flex align-items-center"><span className="p-r-5">{getDayOfWeek(message?.timestamp)}</span><span className="p-r-5">{formatDate(message?.timestamp)}</span>{formatTime(message?.timestamp)}</span>
                                                
                                            </div>
                                        : 
                                            ((((new Date(message.timestamp) - new Date(activeSubject?.thread?.chat_messages?.details[index-1]?.timestamp))/60000) > 10) 
                                            ? 
                                            <div style={{height: "35px"}} className="d-flex align-items-center justify-content-end chat-sender-row">
                                                <span  style={{display: "flex"}} className="msg_time_send text-grey position-static p-r-15 d-flex align-items-center"><span className="p-r-5">{getDayOfWeek(message?.timestamp)}</span><span className="p-r-5">{formatDate(message?.timestamp)}</span>{formatTime(message?.timestamp)}</span>
                                            </div>
                                            : null )
                                        }
                                         
                                        <div className="text-left replied">
                                            <div className="msg_cotainer_send d-flex justify-content-end">
                                                <div dangerouslySetInnerHTML={{ __html: message?.message }} />
                                                    
                                            </div>
                                        </div>
                                        </>
                                        )
                                    }
                                    
                                    
                                
                                    
                                </div>
                            </div>
                        </div>
                                
                        <div className="card-footer send-message-wrapper">
                            <div className="send-message-inner">
                                <form onSubmit={handleClickSendMessage} id="send-message-form">
                                    <div className="input-group">
                                        <input id="input-field" onChange={(e) => setMessage(e.target.value)} value={message} type="text" className="form-control type_msg mr-2" autocomplete="off" placeholder="Type your message..." />
                                        <div className="send-btn-wrap">
                                            <button  id='send-btn' className="btn btn-primary bg-success send_btn height-35" type="submit">
                                                Send
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div> 
                        </div>
                    </div>
                )
            }
            
        </div>
    </>
  )
}

export default ChatBox;