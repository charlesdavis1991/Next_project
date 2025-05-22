import React, { useEffect, useState } from "react";
import api from "../../../api/api";

const PendingTasks = (chats) => {
  const origin = process.env.REACT_APP_BACKEND_URL;
  const [pendingTasks, setPendingTasks] = useState({});
  const fetchPendingTasks = async () => {
    try {
      const response = await api.get(`${origin}/api/homepage/pending-tasks/`);
      if (response.status === 200) {
        var data = response.data;
        setPendingTasks(data);
      }
    } catch (error) {
      console.error("Error fetching case types:", error);
    }
  };

  useEffect(() => {
    fetchPendingTasks();
  }, []);

  return (
    <>
      <div className="pending-tasks mt-0 m-b-5" style={{ zIndex: "1" }}>
        <div className="background-main-10 height-25">
          <h4 className="client-contact-title text-center height-25 d-flex justify-content-center align-items-center h-100">
            Pending tasks
          </h4>
        </div>
        <div className="pending-tasks-col-wrapper row no-gutters">
          {Object.entries(pendingTasks).map(([key, value], index) => {
            // Define an array of the color classes you want to cycle through
            const colorClasses = [
              "text-vivid-cerulean",
              "text-violet",
              "text-amethyst",
              "text-carmin-pink",
            ];

            // Use the modulus operator to select the class based on the index
            const colorClass = colorClasses[index % colorClasses.length];

            return (
              <div className="task p-t-5 p-r-5 p-b-5 p-l-5" key={index}>
                <div
                  className="d-flex flex-column align-items-center"
                  style={{ maxWidth: "fit-content" }}
                >
                  <div className="task-count">
                    <h2 className={`text-lg ${colorClass}`}>{value}</h2>
                  </div>
                  <p>{key}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default PendingTasks;
