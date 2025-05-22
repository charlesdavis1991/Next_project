import React, {useState, useEffect} from "react";
import NavBar from "../Components/Navbars/main";
import Sidebar from "../Components/Sidebars/main";
import ChatDashboard from "../Components/ChatDashboard/main";
import { useDispatch, useSelector } from 'react-redux';
import { getClientId, getCaseId } from "../Utils/helper";
import { setUserProfile, setProviders, setStaffThreads, setCurrentUser, setClientThreads, setProviderClients, setThreads } from '../Redux/chat/actions';
import { fetchChatPage, fetchChatStaffThreads } from "../Providers/main";
import { setActiveSubject, setTotalChatCount, setActiveEntity, setActiveEntityId } from '../Redux/chat/actions';
import Footer from "../Components/common/footer";

const ChatPage = () => { 
    const dispatch = useDispatch()
    const staffThreads = useSelector((state) => state.chat.staffThreads);
    const providerClients = useSelector((state) => state.chat.providerClients);
    const providers = useSelector((state) => state.chat.providers);
    const currentUser = useSelector((state) => state.chat.currentUser);
    const activeEntity = useSelector((state) => state.chat.activeEntity);
    const [loader, setLoader] = useState(true)
    const [chatCount, setChatCount] = useState(0)
    console.log("Active entity", activeEntity)

    useEffect(() => {
        fetchChatPage(dispatch, getClientId(), getCaseId(), setUserProfile, setProviders, setStaffThreads, setCurrentUser, setClientThreads, setProviderClients, setThreads, setLoader)
        fetchChatStaffThreads(dispatch, getClientId(), getCaseId(),setStaffThreads)
        
        const oldestStaffThread = staffThreads
                ?.filter(thread => thread?.notification_count > 0)
                ?.sort((a, b) => new Date(a.last_updated) - new Date(b?.last_updated))[0];
            
                const allClients = providerClients?.flatMap(provider => provider?.clients);
                const clientsWithNotifications = allClients?.filter(client => client?.notification_count > 0);
                const oldestClient = clientsWithNotifications?.sort((a, b) => new Date(a?.last_updated) - new Date(b.last_updated))[0];
            
            console.log("OLDEST STAFF THREAD: ", oldestStaffThread)
            console.log("OLDEST PROVIDER THREAD: ", oldestClient)
            
            let oldest = oldestStaffThread
            if(oldestStaffThread && !oldestClient) {
                oldest = oldestStaffThread
            } else if (!oldestStaffThread && oldestClient) {
                oldest = oldestClient
            } else {
                oldest = new Date(oldestStaffThread?.last_updated) < new Date(oldestClient?.last_updated) ? oldestStaffThread : oldestClient
            }
            console.log("FINAL OLDEST THREAD: ", oldest)
            
            if (oldest?.provider) {
                const name = providers?.filter(pro => pro?.id == oldest?.provider)[0]?.providerprofile?.office_name
                dispatch(setActiveSubject({"type": name, "thread": oldest}))
                dispatch(setActiveEntity(name))
                dispatch(setActiveEntityId(oldest?.provider))
                setTimeout(() => {
                    console.log("RUNNING ENTITY LOGIC")
                    // show active tab relevant subject entries
                    window.document?.querySelectorAll(".contacts-list")?.forEach(function(item) {
                        item?.classList?.remove("show");
                    });
                    window.document?.getElementById(`tab-${oldest?.provider}`)?.classList?.add("show");
    
                    // highlight the active tab
                    window.document.querySelectorAll('[id^="entity-"]').forEach(function(item) {
                        item.classList.remove("active");
                    });
                    window.document?.getElementById(`entity-${oldest?.provider}`)?.classList?.add("active");
            
                }, 2000)
                
            } else {
                dispatch(setActiveEntity("CoWorker"))
                dispatch(setActiveSubject({"type": "CoWorker", "thread": oldest}))
            }
        
    }, [])
    
    useEffect(() => {
        dispatch(setTotalChatCount(chatCount))
    }, [chatCount])

    return (
        <>
            <div style={{ height: "100vh" }} className='photos-page client-page chat-page'>
                <div className="page-wrapper">
                    <Sidebar />
                    <div className="page-container">
                        <NavBar flaggedPageName="Case" chatCount={chatCount} setChatCount={setChatCount} />
                        <ChatDashboard chatCount={chatCount} setChatCount={setChatCount} loader={loader} />
                    </div>
                </div>
                <Footer/>
            </div>
        </>
    );
}

export default ChatPage;