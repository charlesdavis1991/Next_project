import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import TableTabs from "./TableTabs";
import Table from "./table";
import TableLoader from "../Loaders/tableLoader";
import CompletedTable from "./CompletedTable";
import TabsTable from "./tabsTable";

import "./todos.css";
import { setCurrentTodosTab } from "../../Redux/actions";
import NotesSectionDashboard from "../NotesSectionDashboard/main";
import {
  getCaseId,
  getClientId,
  fetchShakespeareStatus,
} from "../../Utils/helper";
import ActionBarComponent from "../common/ActionBarComponent";

const TodoDashboard = ({
  todos,
  todoTabs,
  atorneyStaff,
  completed,
  workList,
}) => {
  const currentSearchStatus = useSelector((state) => state.currentSearchStatus);
  const location = useLocation();
  const dispatch = useDispatch();
  const { todosTab, loading } = useSelector((state) => state.todos);
  const clientId = getClientId();
  const caseId = getCaseId();
  console.log(todosTab, "currentTab");
  console.log(todoTabs, "todosTab");

  console.log(location, "location");

  const [columnWidths, setColumnWidths] = useState([]);
  useEffect(() => {
    dispatch(setCurrentTodosTab(0));
    fetchShakespeareStatus(caseId, clientId, "To Do", dispatch);
  }, []);

  console.log(columnWidths, "columnWidths");
  const buttonConfig = [
    {
      label: "New Task",
      icon: "+",
      className: "btn btn-primary rounded-0 height-25 p-b-0 p-t-0",
      dataToggle: "modal",
      dataTarget: "#addcase",
      onClick: () => null,
    },
  ];
  const header_name = useSelector((state) => state.header_name?.header_name);
  const open = useSelector((state) => state?.open?.open);

  return (
    <>
      {loading && <TableLoader />}

      {/* Main content with table */}
      <div className="">
        <ActionBarComponent
          src="https://simplefirm-bucket.s3.amazonaws.com/static/BP_resources/images/icon/to-do-icon-color.svg"
          page_name={workList ? "WORKLIST" : "To Do"}
          buttons={workList ? [] : buttonConfig}
        />
        {/* <div
          className="action-bar client-BarAlign anti-action-bar anti-client-BarAlign main-action-bar d-flex m-b-5  "
          style={{ left: 0 }}
        >
          <span className="page-icon">
            <img
              className="translate-note-icon"
              src="https://simplefirm-bucket.s3.amazonaws.com/static/BP_resources/images/icon/to-do-icon-color.svg"
              alt=""
            />
          </span>
          <div className="text-wrapper text-white d-flex align-items-center p-l-5">
            <h2 className="text-white my-auto">
              {workList ? "WORKLIST" : "To Do"}
            </h2>
          </div>
          <div className="btn-wrapper d-none">
            <div className="dropdown d-flex">
              <button
                className="btn btn-primary rounded-0 dropdown-toggle d-flex align-items-center justify-content-center w-100 text-white height-35"
                type="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <div className="d-flex align-items-center">
                  <span className="profile-pic">
                    <img
                      // src={require("./static/img/avatar.png")}
                      width="20"
                      alt=""
                    />
                  </span>
                  <span className="ml-2">Firm User First Name Last name</span>
                </div>
              </button>
              <div
                className="dropdown-menu w-100"
                aria-labelledby="dropdownMenuButton"
                x-placement="top-start"
              >
                <ul className="nav list-hover">
                  <li className="d-flex align-items-center">
                    <div className="d-flex align-items-center">
                      <span className="profile-pic">
                        <img
                          // src={require("./static/img/avatar.png")}
                          width="20"
                          alt=""
                        />
                      </span>
                      <span className="ml-2">all firm users</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {workList ? null : (
            <button
              type="submit"
              id="add-todo-btn"
              className="btn btn-primary height-25 rounded-0 p-b-0 p-t-0 d-flex align-items-center"
              data-toggle="modal"
              data-target="#addcase"
            >
              <span className="font-weight-bold pr-2 float-right  text-gold">
                +
              </span>
              New Task
            </button>
          )}
        </div> */}

        <div className="container-fluid  p-0 overflow-hidden">
          <div className="row m-b-15">
            <div className="col-lg-12 ">
              <div class="custom-tab to-do-tasks has-widest-tab">
                {todoTabs?.length > 0 && (
                  <Navbar todoTabs={todoTabs} selectedTab={todosTab} />
                )}
                {todos?.length > 0 && (
                  <div
                    class="tab-content"
                    id="nav-tabContent"
                    style={{ zIndex: open ? "0" : "" }}
                  >
                    {todosTab === 0 ? (
                      <Table
                        addNotesHandler={() => {}}
                        todos={todos}
                        todoTabs={todoTabs}
                        atorneyStaff={atorneyStaff}
                        setColumnWidths={setColumnWidths}
                      />
                    ) : todosTab === 8 ? (
                      <CompletedTable
                        addNotesHandler={() => {}}
                        todos={todos}
                        completed={completed}
                        todoTabs={todoTabs}
                        atorneyStaff={atorneyStaff}
                        columnWidths={columnWidths}
                      />
                    ) : (
                      <TableTabs
                        addNotesHandler={() => {}}
                        todoTypes={todoTabs}
                        selectdedTab={todosTab}
                        columnWidths={columnWidths}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          <NotesSectionDashboard />
        </div>
      </div>
    </>
  );
};

export default TodoDashboard;
