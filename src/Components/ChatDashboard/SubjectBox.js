import React, {useState, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchChatPage, fetchChatStaffThreads, updateNotificationChatAPI, getUserProfilePicChatAPI } from "../../Providers/main";
import { setActiveSubject, setUserProfile, setProviders, setStaffThreads, setCurrentUser, setClientThreads, setProviderClients, setThreads, setActiveEntity, setActiveEntityId } from '../../Redux/chat/actions';
import { getClientId, getCaseId } from "../../Utils/helper";

const SubjectBox = (props) => {
    const dispatch = useDispatch()
    const staffThreads = useSelector((state) => state.chat.staffThreads);
    const currentUser = useSelector((state) => state.chat.currentUser);
    const providerClients = useSelector((state) => state.chat.providerClients);
    const activeEntity = useSelector((state) => state.chat.activeEntity);
    const activeSubject = useSelector((state) => state.chat.activeSubject);
    const activeEntityId = useSelector((state) => state.chat.activeEntityId);
    
    const [searchSubject, setSearchSubject] = useState("")

    
    useEffect(() => {
        const fetchProfilePictures = async () => {
            console.log("Fetching profile pictures");
    
            // Iterate through staffThreads array
            for (let i = 0; i < staffThreads.length; i++) {
                const thread = staffThreads[i];
    
                // Check if first_person's profile pic needs fetching
                if (!(thread?.first_person?.id in props.profilePic)) {
                    try {
                        const user_id = thread?.first_person?.id;
                        const response = await getUserProfilePicChatAPI(user_id);
                        const profile_pic = response?.data?.profile_pic;
    
                        // Update profilePic state
                        props.setProfilePic(prevProfilePic => ({
                            ...prevProfilePic,
                            [user_id]: profile_pic
                        }));
                    } catch (error) {
                        console.error(`Error fetching profile picture for user ${thread}:`, error);
                    }
                }
    
                // Check if second_person's profile pic needs fetching
                if (!(thread?.second_person?.id in props.profilePic)) {
                    try {
                        const user_id = thread?.second_person?.id;
                        const response = await getUserProfilePicChatAPI(user_id);
                        const profile_pic = response?.data?.profile_pic;
    
                        // Update profilePic state
                        props.setProfilePic(prevProfilePic => ({
                            ...prevProfilePic,
                            [user_id]: profile_pic
                        }));
                    } catch (error) {
                        console.error(`Error fetching profile picture for user ${thread}:`, error);
                    }
                }
            }
        };
    
        fetchProfilePictures();
    }, [staffThreads]);

    console.log(props.profilePic)
    const activateChat = (obj) => {
        // let updatedMessageCount = props.newMessageCount;
        // props.setChatCount(props.chatCount-updatedMessageCount[obj?.thread?.id])
        // updatedMessageCount[obj?.thread?.id] = 0
        // props.setNewMessageCount(updatedMessageCount)
        dispatch(setActiveSubject(obj))
        updateNotificationChatAPI(obj?.thread?.id)
        fetchChatPage(dispatch, getClientId(), getCaseId(), setUserProfile, setProviders, setStaffThreads, setCurrentUser, setClientThreads, setProviderClients, setThreads)
        fetchChatStaffThreads(dispatch, getClientId(), getCaseId(),setStaffThreads)
    }
    
    useEffect(() => {
        console.log("Running staff thread change")
        console.log(activeSubject)
        if(!activeSubject?.thread) {
            if(activeEntity == 'CoWorker') {
                const thread = staffThreads?.filter((thread) => (!thread.is_provider_thread && (thread.first_person?.id != currentUser?.id || thread.second_person?.id != currentUser?.id)))[0]
                dispatch(setActiveSubject({"type": activeEntity, "thread": thread}))
                updateNotificationChatAPI(thread?.id)
            } else {
                if(providerClients) {
                    const first_provider_client = providerClients.filter((provider) => provider?.provider_id == activeEntityId)[0]
                    const thread = first_provider_client?.clients[0]
                    dispatch(setActiveSubject({"type": activeEntity, "thread": thread}))
                    updateNotificationChatAPI(thread?.id)
                }
            }
        }
    }, [staffThreads])


    useEffect(() => {    
        console.log("Updating New Message Count")
        let messageCount = Object.fromEntries(staffThreads?.map(thread => [thread.id, thread?.notification_count]))
        let clientNotificationDict = {};
        providerClients?.forEach(provider => {
            provider.clients?.forEach(client => {
                clientNotificationDict[client?.id] = client?.notification_count;
            });
        });
        const mergedDict = Object.assign({}, messageCount, clientNotificationDict);

        props.setNewMessageCount(mergedDict)
        
        const totalNotificationCount = (staffThreads?.reduce((sum, thread) => {
            return sum + (thread?.notification_count || 0);
        }, 0) || 0) + (providerClients?.reduce((sum, provider) => {
            return sum + provider.clients?.reduce((clientSum, client) => {
                return clientSum + (client?.notification_count || 0);
            }, 0) || 0;
        }, 0) || 0);
        props.setChatCount(totalNotificationCount)
                    
    }, [staffThreads])
    
    
    console.log(props.newMessageCount)
    console.log(staffThreads)
    
    useEffect(() => {
        
        console.log(providerClients)
        if(activeEntity == 'CoWorker') {
            const thread = staffThreads?.filter((thread) => (!thread.is_provider_thread && (thread.first_person?.id != currentUser?.id || thread.second_person?.id != currentUser?.id)))[0]
            dispatch(setActiveSubject({"type": activeEntity, "thread": thread}))
            updateNotificationChatAPI(thread?.id)
        } else {
            if(providerClients) {
                const first_provider_client = providerClients.filter((provider) => provider?.provider_id == activeEntityId)[0]
                const thread = first_provider_client?.clients[0]
                dispatch(setActiveSubject({"type": activeEntity, "thread": thread}))
                updateNotificationChatAPI(thread?.id)
            }
        }
        fetchChatPage(dispatch, getClientId(), getCaseId(), setUserProfile, setProviders, setStaffThreads, setCurrentUser, setClientThreads, setProviderClients, setThreads)
        fetchChatStaffThreads(dispatch, getClientId(), getCaseId(),setStaffThreads)
    
    }, [activeEntity])

    console.log("PROVIDER CLIENTS: ",providerClients)
    return (
    <>
        <div className="col-auto p-0 chat h-100 bg-primary-10 users-col m-r-5">
            <div className="p-l-5 background-main-10 height-25">
                <h4 className="client-contact-title text-center d-flex justify-content-center align-items-center h-100">Subject</h4>
            </div>

            <div className="card mb-sm-3 mb-md-0 firms-users-card contacts_card h-100">
                <div className="card-header" style={{ "height": "35px", padding: "5px" }}>
                    <div className="input-group" style={{ "height": "25px" }}>
                        <input style={{ "height": "100%" }} onChange={(e) => setSearchSubject(e.target.value)} type="text" placeholder="Search..." name="" className="form-control search-subject" />
                        <div style={{ "height": "100%" }} className="input-group-prepend" >
                            <span className="input-group-text search_btn_subject msgs-border-radius-0px"><i className="icon-search"></i></span>
                        </div>
                    </div>
                </div>

                <div className="card-body contacts_body">
                    <div className="card-bg-secondary position-relative overflow-hidden">
                        <div className="note-fake-rows w-100">
                            <div className="note-fake-row"></div>
                            <div className="note-fake-row"></div>
                            <div className="note-fake-row"></div>
                            <div className="note-fake-row"></div>
                            <div className="note-fake-row"></div>
                            <div className="note-fake-row"></div>
                            <div className="note-fake-row"></div>
                            <div className="note-fake-row"></div>
                            <div className="note-fake-row"></div>
                            <div className="note-fake-row"></div>
                            <div className="note-fake-row"></div>
                            <div className="note-fake-row"></div>
                            <div className="note-fake-row"></div>
                            <div className="note-fake-row"></div>
                            <div className="note-fake-row"></div>
                            <div className="note-fake-row"></div>
                            <div className="note-fake-row"></div>
                            <div className="note-fake-row"></div>
                            <div className="note-fake-row"></div>
                            <div className="note-fake-row"></div>
                            <div className="note-fake-row"></div>
                            <div className="note-fake-row"></div>
                            <div className="note-fake-row"></div>
                            <div className="note-fake-row"></div>
                            <div className="note-fake-row"></div>
                            <div className="note-fake-row"></div>
                            <div className="note-fake-row"></div>
                            <div className="note-fake-row"></div>
                            <div className="note-fake-row"></div>
                            <div className="note-fake-row"></div>
                            <div className="note-fake-row"></div>
                            <div className="note-fake-row"></div>
                            <div className="note-fake-row"></div>
                            <div className="note-fake-row"></div>
                            <div className="note-fake-row"></div>
                            <div className="note-fake-row"></div>
                            <div className="note-fake-row"></div>
                            <div className="note-fake-row"></div>
                            <div className="note-fake-row"></div>
                            <div className="note-fake-row"></div>
                            <div className="note-fake-row"></div>
                            <div className="note-fake-row"></div>
                            <div className="note-fake-row"></div>
                            <div className="note-fake-row"></div>
                            <div className="note-fake-row"></div>
                        </div>
                        <ul className="contacts contacts-list position-relative show" id="tab-firm">
                            {searchSubject ? 
                                staffThreads?.filter((thread) => (thread?.second_person?.first_name?.toLowerCase()?.includes(searchSubject) || thread?.second_person?.last_name?.toLowerCase()?.includes(searchSubject) || thread?.first_person?.first_name?.toLowerCase()?.includes(searchSubject) || thread?.first_person?.last_name?.toLowerCase()?.includes(searchSubject)))?.map((thread, index) => 
                                (!thread.is_provider_thread && (thread.first_person?.id != currentUser?.id || thread.second_person?.id != currentUser?.id)
                                    &&
                                    <li className={`${thread?.id == activeSubject?.thread?.id ? "active contact-li li-subject msgs-cursor-pointer" : "contact-li li-subject msgs-cursor-pointer" }`} 
                                    // onclick="updateNotification('{{thread.id}}','{{userprofile.id}}')" 
                                    onClick={() => activateChat({"type": activeEntity, "thread": thread})}
                                    chat-id="chat_{{ thread.id }}" >
                                        <div className="d-flex bd-highlight align-items-center">
                                            <div className="avatar-wrap position-relative ic-29">
                                                <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
                                                    {
                                                        thread.second_person?.id == currentUser?.id 
                                                        ?
                                                        <img src={props.profilePic[thread?.first_person?.id]}  />
                                                        :
                                                        <img src={props.profilePic[thread?.second_person?.id]}  />
                                                    }
                                                </span>
                                            </div>
                                            <div className="user_info">
                                                { thread?.first_person?.id == currentUser?.id ?
                                                    <span>
                                                        { thread?.second_person?.first_name } { thread?.second_person?.last_name }
                                                        { props.newMessageCount[thread?.id] > 0 ?
                                                        <span className="ml-1 badge badge-danger message-count-badge" id={`notification-count-${thread.id}`}>{ props.newMessageCount[thread?.id] }</span>
                                                        :
                                                        null
                                                        }
                                                    </span>
                                                    :
                                                    <span> 
                                                        { thread?.first_person?.first_name } { thread?.first_person?.last_name }
                                                        { props.newMessageCount[thread?.id] > 0 ?
                                                        <span className="ml-1 badge badge-danger message-count-badge" id={`notification-count-${thread.id}`}>{ props.newMessageCount[thread?.id] }</span>
                                                        :
                                                        null
                                                        }
                                                    </span>
                                                }
                                            </div>
                                        </div>
                                    </li>
                                )
                            )
                            :
                            staffThreads?.map((thread, index) => 
                                (!thread.is_provider_thread && (thread.first_person?.id != currentUser?.id || thread.second_person?.id != currentUser?.id)
                                    &&
                                    <li className={`${thread?.id == activeSubject?.thread?.id ? "active contact-li li-subject msgs-cursor-pointer" : "contact-li li-subject msgs-cursor-pointer" }`} 
                                    // onclick="updateNotification('{{thread.id}}','{{userprofile.id}}')" 
                                    onClick={() => activateChat({"type": activeEntity, "thread": thread})}
                                    chat-id="chat_{{ thread.id }}" >
                                        <div className="d-flex bd-highlight align-items-center">
                                            <div className="avatar-wrap position-relative ic-29">
                                                <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
                                                    {
                                                        thread.second_person?.id == currentUser?.id 
                                                        ?
                                                        <img src={props.profilePic[thread?.first_person?.id]}  />
                                                        :
                                                        <img src={props.profilePic[thread?.second_person?.id]}  />
                                                    }
                                                </span>
                                            </div>
                                            <div className="user_info">
                                                { thread?.first_person?.id == currentUser?.id ?
                                                    <span>
                                                        { thread?.second_person?.first_name } { thread?.second_person?.last_name }
                                                        { props.newMessageCount[thread?.id] > 0 ?
                                                        <span className="ml-1 badge badge-danger message-count-badge" id={`notification-count-${thread.id}`}>{ props.newMessageCount[thread?.id] }</span>
                                                        :
                                                        null
                                                        }
                                                    </span>
                                                    :
                                                    <span> 
                                                        { thread?.first_person?.first_name } { thread?.first_person?.last_name }
                                                        { props.newMessageCount[thread?.id] > 0 ?
                                                        <span className="ml-1 badge badge-danger message-count-badge" id={`notification-count-${thread.id}`}>{ props.newMessageCount[thread?.id] }</span>
                                                        :
                                                        null
                                                        }
                                                    </span>
                                                }
                                            </div>
                                        </div>
                                    </li>
                                )
                            )}
                        </ul>
                        
                        {
                           providerClients?.map((provider) => 
                           <ul className="contacts li-subject contacts-list position-relative" id={`tab-${provider?.provider_id}`}>
                               {searchSubject ? 
                               provider?.clients?.filter((client) => client?.chat_messages?.details?.length > 0)?.filter((thread) => (thread?.client?.first_name?.toLowerCase()?.includes(searchSubject) || thread?.client?.last_name?.toLowerCase()?.includes(searchSubject)))?.map((thread) => 
                               (<li className={`${thread?.id == activeSubject?.thread?.id ? "active contact-li li-subject msgs-cursor-pointer" : "contact-li li-subject msgs-cursor-pointer" }`}
                                   // onclick="updateNotification('{{thread.id}}','{{provider.provider_id}}')" 
                                   onClick={() => activateChat({"type": props.activeEntity, "thread": thread})}
                                   chat-id="chat_{{ thread.id }}">
                                   <div className="d-flex bd-highlight align-items-center">
                                       <div className="avatar-wrap position-relative ic-29">
                                           <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
                                               { thread?.client?.profile_pic && 
                                               <img src={thread?.client?.profile_pic}  />
                                               }
                                           </span>
                                       </div>
                                       <div className="user_info">
                                               <span> { thread?.client?.first_name } { thread?.client?.last_name }
                                                   {/* { thread?.notification_count > 0 ?
                                                   <span className="ml-1 badge badge-danger message-count-badge" id={`notification-count-${thread?.id}`}>{ thread?.notification_count}</span>
                                                   :
                                                   <span className="ml-1 badge badge-danger message-count-badge" id={`notification-count-${thread?.id}`}></span>
                                                   } */}
                                                    { props.newMessageCount[thread?.id] > 0 ?
                                                        <span className="ml-1 badge badge-danger message-count-badge" id={`notification-count-${thread.id}`}>{ props.newMessageCount[thread?.id] }</span>
                                                        :
                                                        null
                                                    }
                                               </span>
                                       </div>
                                   </div>
                               </li>)
                               )
                               :
                               provider?.clients?.filter((client) => client?.chat_messages?.details?.length > 0)?.map((thread) => 
                               (<li className={`${thread?.id == activeSubject?.thread?.id ? "active contact-li li-subject msgs-cursor-pointer" : "contact-li li-subject msgs-cursor-pointer" }`}
                                   // onclick="updateNotification('{{thread.id}}','{{provider.provider_id}}')" 
                                   onClick={() => activateChat({"type": props.activeEntity, "thread": thread})}
                                   chat-id="chat_{{ thread.id }}">
                                   <div className="d-flex bd-highlight align-items-center">
                                       <div className="avatar-wrap position-relative ic-29">
                                           <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
                                               { thread?.client?.profile_pic && 
                                               <img src={thread?.client?.profile_pic}  />
                                               }
                                           </span>
                                       </div>
                                       <div className="user_info">
                                               <span> { thread?.client?.first_name } { thread?.client?.last_name }
                                                   {/* { thread?.notification_count > 0 ?
                                                   <span className="ml-1 badge badge-danger message-count-badge" id={`notification-count-${thread?.id}`}>{ thread?.notification_count}</span>
                                                   :
                                                   <span className="ml-1 badge badge-danger message-count-badge" id={`notification-count-${thread?.id}`}></span>
                                                   } */}
                                                    { props.newMessageCount[thread?.id] > 0 ?
                                                        <span className="ml-1 badge badge-danger message-count-badge" id={`notification-count-${thread.id}`}>{ props.newMessageCount[thread?.id] }</span>
                                                        :
                                                        null
                                                    }
                                               </span>
                                       </div>
                                   </div>
                               </li>)
                               )}  
                           </ul>
                       )
                            
                        }
                       
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default SubjectBox;