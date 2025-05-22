import React, {useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setActiveEntity, setActiveEntityId } from '../../Redux/chat/actions';

const EntitySection = (props) => {
    const dispatch = useDispatch()
    const userProfile = useSelector((state) => state.chat.userProfile);
    const providers = useSelector((state) => state.chat.providers);
    const staffThreads = useSelector((state) => state.chat.staffThreads);
    const currentUser = useSelector((state) => state.chat.currentUser);
    const providerClients = useSelector((state) => state.chat.providerClients);
    const [staffEntityNotificationCount, setStaffEntityNotificationCount] = useState(0)
    
    const activateTab = (id) => {
        // show active tab relevant subject entries
        window.document?.querySelectorAll(".contacts-list")?.forEach(function(item) {
            item?.classList?.remove("show");
        });
        window.document?.getElementById(`tab-${id}`)?.classList?.add("show");
        
        // highlight the active tab
        window.document.querySelectorAll('[id^="entity-"]').forEach(function(item) {
            item.classList.remove("active");
        });
        window.document?.getElementById(`entity-${id}`)?.classList?.add("active");
        
        if (id=='firm') {
            dispatch(setActiveEntity("CoWorker"))
        } else {
            const name = providers.filter((obj) => obj.id == id)[0]?.providerprofile?.office_name
            dispatch(setActiveEntity(name))
            dispatch(setActiveEntityId(id))
        }
    }

    useEffect(() => {
        const totalNotificationCount = staffThreads?.reduce((sum, thread) => {
            return sum + (thread?.notification_count || 0);
        }, 0);
        setStaffEntityNotificationCount(totalNotificationCount)
    }, [staffThreads])


    const [searchEntity, setSearchEntity] = useState("")
    
    return (
    <>
        <div className="col-auto p-0 chat ml-50 h-100 m-r-5">
            <div className="p-l-5 background-main-10 height-25">
                <h4 className="client-contact-title text-center d-flex justify-content-center align-items-center h-100">Entity</h4>
            </div>

            {/* Card Contacts */}
            <div className="card mb-sm-3 mb-md-0 firms-users-card contacts_card h-100">
                <div className="card-header" style={{ height: "35px", padding: "5px" }}>
                    <div className="input-group" style={{ "height": "25px" }}>
                        <input style={{ "height": "100%" }} onChange={(e) => setSearchEntity(e.target.value)} type="text" placeholder="Search..."  name="" className="form-control search-entity"/>
                        <div style={{ "height": "100%" }} className="input-group-prepend" >
                            <span className="input-group-text search_btn_entity msgs-border-radius-0px"><i className="icon-search"></i></span>
                        </div>
                    </div>
                </div>


                <div className="card-body contacts_body msgs-white-space-inherit-height-65P">
                    <div className="card-bg-primary position-relative overflow-hidden">
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
                        <ul className="contacts position-relative">
                            {searchEntity ? (userProfile?.attorneyprofile?.office_name?.toLowerCase()?.includes(searchEntity) || "staff".includes(searchEntity) ? 
                            <li className="active contact-li li-entity msgs-cursor-pointer" id="entity-firm" chat-id="chat_{{ thread.id }}" onClick={() => activateTab('firm')}>
                                <div className='d-flex bd-highlight align-items-center'>
                                    <div className="avatar-wrap position-relative ic-29">
                                        <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
                                            {userProfile?.profile_pic && 
                                            <img src={userProfile?.profile_pic?.url}  />
                                            }
                                        </span>
                                    </div>
                                    <div className="user_info">
                                        <span>
                                            { userProfile?.attorneyprofile?.office_name } {staffThreads && "Staff"}
                                        {
                                            staffEntityNotificationCount > 0 ?
                                            <span class="badge badge-danger ml-1" id={`notification-count-entity-${userProfile.id}`}>{ staffEntityNotificationCount }</span>
                                            :
                                            <span class="badge badge-danger ml-1" id={`notification-count-entity-${userProfile.id}`}></span>
                                        }
                                        </span>
                                    </div>
                                </div>
                            </li>
                            : null)
                            :
                            <li className="active contact-li li-entity msgs-cursor-pointer" id="entity-firm" chat-id="chat_{{ thread.id }}" onClick={() => activateTab('firm')}>
                                <div className='d-flex bd-highlight align-items-center'>
                                    <div className="avatar-wrap position-relative ic-29">
                                        <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
                                            {userProfile?.profile_pic && 
                                            <img src={userProfile?.profile_pic?.url}  />
                                            }
                                        </span>
                                    </div>
                                    <div className="user_info">
                                        <span>
                                            { userProfile?.attorneyprofile?.office_name } {staffThreads && "Staff"}
                                        {
                                            staffEntityNotificationCount > 0 ?
                                            <span class="badge badge-danger ml-1" id={`notification-count-entity-${userProfile.id}`}>{ staffEntityNotificationCount }</span>
                                            :
                                            <span class="badge badge-danger ml-1" id={`notification-count-entity-${userProfile.id}`}></span>
                                        }
                                        </span>
                                    </div>
                                </div>
                            </li>
                            }
                            
                            
                            {searchEntity ? 
                            providers?.filter((pro) => providerClients
                            ?.filter(provider => 
                                provider?.clients.some(client => client?.chat_messages?.details?.length > 0)
                            )
                            ?.map(provider => provider?.provider_id).includes(pro?.id))?.filter((provider) => provider?.providerprofile?.office_name?.toLowerCase()?.includes(searchEntity))?.map((provider) => 
                            <li class="contact-li li-entity msgs-cursor-pointer" id={`entity-${provider.id}`} chat-id="chat_{{ thread.id }}" onClick={() => activateTab(provider.id)}>
                                <div class="d-flex bd-highlight align-items-center">
                                    <div class="avatar-wrap position-relative ic-29">
                                        <span class="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
                                            {provider?.profile_pic &&
                                            <img src={provider?.profile_pic?.url}  />
                                            }
                                        </span>
                                    </div>
                                    <div class="user_info">
                                            <span>{ provider?.providerprofile?.office_name }
                                                
                                                { provider.notification_count > 0 ?
                                                    <span class="badge badge-danger ml-1" id={`notification-count-entity-${provider.id}`}>{ provider?.notification_count}</span>
                                                    :
                                                    <span class="badge badge-danger ml-1" id={`notification-count-entity-${provider.id}`}></span>
                                                }
                                            </span>
                                    </div>
                                </div>
                            </li>
                            )
                            : 
                            
                            providers?.filter((pro) => providerClients
                            ?.filter(provider => 
                                provider?.clients.some(client => client?.chat_messages?.details?.length > 0)
                            )
                            ?.map(provider => provider?.provider_id).includes(pro?.id))?.map((provider) => 
                            <li class="contact-li li-entity msgs-cursor-pointer" id={`entity-${provider?.id}`} chat-id="chat_{{ thread.id }}" onClick={() => activateTab(provider.id)}>
                                <div class="d-flex bd-highlight align-items-center">
                                    <div class="avatar-wrap position-relative ic-29">
                                        <span class="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
                                            {provider?.profile_pic &&
                                            <img src={provider?.profile_pic?.url}  />
                                            }
                                        </span>
                                    </div>
                                    <div class="user_info">
                                            <span>{ provider?.providerprofile?.office_name }
                                                
                                                { provider.notification_count > 0 ?
                                                    <span class="badge badge-danger ml-1" id={`notification-count-entity-${provider.id}`}>{ provider?.notification_count}</span>
                                                    :
                                                    <span class="badge badge-danger ml-1" id={`notification-count-entity-${provider.id}`}></span>
                                                }
                                            </span>
                                    </div>
                                </div>
                            </li>
                            )}
                        </ul>
                    </div>
                </div>

                
            </div>


        </div>
    </>
  )
}

export default EntitySection;