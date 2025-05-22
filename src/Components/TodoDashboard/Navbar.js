import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentTab, setCurrentTodosTab } from "../../Redux/actions";
import "./todos.css";

const Navbar = ({ todoTabs }) => {
  const dispatch = useDispatch();
  const { currentTab, todosTab } = useSelector((state) => state.todos);
  const tabsResultCount = useSelector((state) => state.tabsResultCount);

  // Define "All Open" and "Completed" tabs
  const allOpenTab = {
    id: 0,
    todo_data: [],
    name: "All Open",
    order: 0,
    tab_name: "All Open",
  };

  const completedTab = {
    id: 8,
    todo_data: [],
    name: "Completed",
    order: 0,
    tab_name: "Completed",
  };

  console.log(currentTab, todosTab, "asafas");
  // Clone the todoTabs array to avoid mutating the original array
  const modifiedTabs = [allOpenTab, ...todoTabs, completedTab];

  const handleTabChange = (e, tabData) => {
    dispatch(setCurrentTab(e.target.dataset.tab));
    dispatch(setCurrentTodosTab(tabData));
  };

  return (
    <>
      <nav
        class="background-temp align-items-center"
        id="nav-tab"
        role="tablist"
        style={{ marginTop: "5px", marginLeft: "54px" }}
      >
        <div className="row">
          <div
            className="nav nav-tabs pr-4 nav-slide"
            id="nav-tab-costs"
            role="tablist"
          >
            {modifiedTabs?.map?.(({ id, tab_name }, index) => {
              console.log(tab_name, currentTab, "43deee");
              return (
                <>
                  <a
                    key={index}
                    style={{ width: "130.953px", marginInline: "5px" }}
                    onClick={(e) => handleTabChange(e, index)}
                    className={`nav-item custom-tab-cost-page nav-link font-weight-bold  tab-width font-size ${
                      currentTab === tab_name
                        ? "active font-weight-bold show"
                        : "font-weight-bold"
                    }`}
                    id={`custom-nav-1-${id}-tab`}
                    data-toggle="tab"
                    href={`#custom-nav-1-${id}`}
                    role="tab"
                    aria-controls={`custom-nav-1-${id}`}
                    aria-selected={currentTab === tab_name ? "true" : "false"}

                    // aria-selected="false"
                  >
                    {tab_name}
                  </a>

                  {/* <a aria-selected={currentTab === tab_name ? "true" : "false"}>
                {tab_name}
                {tabsResultCount?.[tab_name] > 0 && (
                  <div data-tab={tab_name} className="badge badge-primary ml-2">
                    {tabsResultCount?.[tab_name]}
                  </div>
                )}
              </a> */}
                </>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
