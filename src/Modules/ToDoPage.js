import React, { useEffect, useState } from "react";
import Sidebar from "../Components/Sidebars/main";
import NavBar from "../Components/Navbars/main";
import TodoDashboard from "../Components/TodoDashboard/main";

import { useDispatch, useSelector } from "react-redux";
import { fetchTodosPageData } from "../Redux/todos/actions";
import Footer from "../Components/common/footer";

const ToDoPage = () => {
  // Redux
  const dispatch = useDispatch();

  // State Hooks
  // State Hooks
  const todos = useSelector((state) => state.todos);

  useEffect(() => {
    fetchTodosPageData(dispatch);
  }, []);

  return (
    <>
    <div className="page-wrapper">
      <Sidebar />
      <div className="page-container">
        <div className="top-panel-wrapper"></div>
        <NavBar flaggedPageName="To Do" />
        <div class="main-content cost-tb">
          <TodoDashboard
            todos={todos?.todos?.todos_all_open}
            completed={todos?.todos?.todos_completed}
            todoTabs={todos?.todoTabs}
            atorneyStaff={todos?.todos?.all_attorney_staff}
          />
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default ToDoPage;
