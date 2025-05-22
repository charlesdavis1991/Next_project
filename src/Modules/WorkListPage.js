import React, { useEffect, useState } from "react";
import Sidebar from "../Components/Sidebars/main";
import NavBar from "../Components/Navbars/main";
import TodoDashboard from "../Components/TodoDashboard/main";

import { useDispatch, useSelector } from "react-redux";
import {
  fetchTodosPageData,
  fetchWorkListPageData,
} from "../Redux/todos/actions";
import { setToDoCount } from "../Redux/general/actions";
import { markReadToDoItemsAPI } from "../Providers/main";

import useWebSocket, { ReadyState } from "react-use-websocket";
import Footer from "../Components/common/footer";

const WorkListPage = () => {
  // Redux
  const dispatch = useDispatch();

  const webSocketLink = process.env.REACT_APP_BACKEND_URL.includes("http://")
    ? `ws://${process.env.REACT_APP_BACKEND_URL.replace("http://", "")}`
    : `wss://${process.env.REACT_APP_BACKEND_URL.replace("https://", "")}`;
  
    const [socketUrlToDo, setSocketUrlToDo] = useState(
    `wss://websockets.simplefirm.com/todo/?username=${localStorage.getItem("username")}`
  );

  const { lastMessage: lastMessageToDo, readyState: readyStateToDo } = useWebSocket(socketUrlToDo, {
    share: false,
    shouldReconnect: () => true,
  });
 
  const workListData = useSelector((state) => state.todos);
  
  useEffect(() => {
    fetchWorkListPageData(dispatch);
    markReadToDoItemsAPI(dispatch, setToDoCount)
  }, [lastMessageToDo]);

  return (
    <>
    <div className="page-wrapper">
      <Sidebar />
      <div className="page-container">
        <div className="top-panel-wrapper"></div>
        <NavBar flaggedPageName="Case" />
        <div class="main-content cost-tb">
          <TodoDashboard
            todos={workListData?.workListData?.todos_all_open}
            completed={workListData?.workListData?.todos_completed}
            todoTabs={workListData?.workListData?.todo_types}
            atorneyStaff={workListData?.workListData?.all_attorney_staff}
            workList
          />
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default WorkListPage;
