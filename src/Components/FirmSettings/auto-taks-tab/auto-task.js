import React, { useEffect, useState } from "react";
import CommonHeader from "../common/common-header";
import Button from "../common/button";
import AddAutoTaskModal from "./modals/add-auto-task";
import TableFirmSettings from "../common/table-firm-settings";
import api from "../../../api/api";
import useGetAutoTaskDetails from "./hooks/useAutoTaskTabApi";
import EditAutoTaskModal from "./modals/edit-auto-task";

const AutoTasks = () => {
  const heading = "FIRM SETTINGS TITLE WITH CENTERED TEXT";
  const points = [
    "1. Firm settings panel instruction point one",
    "2. Firm settings panel instruction point two",
    "3. Firm settings panel instruction point three",
  ];

  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [editData, setEditData] = useState();

  const handleShowModal = () => setShowAddTaskModal(true);
  const handleCloseModal = () => setShowAddTaskModal(false);
  const handleShowEditModal = async (taskId) => {
    try {
      const response = await api.get(`/api/firmsetting-page/edit-auto-task/`, {
        params: {
          auto_task_id: taskId,
        },
      });
      setEditData(response.data.data);
    } catch (error) {
      console.error(error);
    }
    setShowEditTaskModal(true);
  };
  const handleCloseEditModal = () => setShowEditTaskModal(false);

  const [getPageSlots, setGetPageSlots] = useState();

  const { data, loading, error, refetch } = useGetAutoTaskDetails();

  const getPageSlotsFunction = async (pageId) => {
    try {
      const response = await api.get(`/api/firmsetting-page/get-page-slots/`, {
        params: {
          page_id: pageId,
        },
      });
      setGetPageSlots(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (taskId) => {
    console.log(taskId);
    try {
      await api.get(`/api/firmsetting-page/delete-auto-task/`, {
        params: {
          auto_task_id: taskId,
        },
      });
      refetch();
    } catch (error) {
      console.error(error);
    }
  };
  const handlePageIdChange = (pageId) => {
    getPageSlotsFunction(pageId);
  };

  return (
    <div className="tab-pane fade firm-settings-user-perms-fs active show">
      <div>
        <CommonHeader heading={heading} points={points} />
      </div>
      <div className="d-flex align-items-center justify-content-end m-r-5">
        <Button
          text={"Add Auto Task"}
          className="btn-primary"
          onClick={handleShowModal}
        />
      </div>
      <TableFirmSettings>
        <thead>
          <tr id="tb-header">
            <th></th>
            <th>For</th>
            <th>Case Types</th>
            <th>Repeat</th>
            <th>Description</th>
            <th>Repeat By</th>
            <th>Blocked By</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data &&
            data?.auto_tasks?.map((autoTask, idx) => (
              <tr
                key={autoTask.id}
                id={`row_${idx + 1}`}
                style={{ height: "45px" }}
              >
                <td onClick={() => handleShowEditModal(autoTask.id)}>
                  {idx + 1}
                </td>
                <td onClick={() => handleShowEditModal(autoTask.id)}>
                  <span className="badge badge-primary ml-2 padding-5 height-25">
                    {autoTask?.usertype?.name}
                  </span>
                </td>
                <td onClick={() => handleShowEditModal(autoTask.id)}>
                  {autoTask?.case_types?.map((casetype, idx) => (
                    <span
                      key={idx}
                      className="badge badge-primary ml-2 padding-5 height-25"
                    >
                      {casetype.name}
                    </span>
                  ))}
                </td>
                <td onClick={() => handleShowEditModal(autoTask.id)}>
                  {autoTask?.days_to_repeat}
                </td>
                <td onClick={() => handleShowEditModal(autoTask.id)}>
                  {autoTask?.description}
                </td>
                <td onClick={() => handleShowEditModal(autoTask.id)}>
                  <span className="badge badge-primary ml-2 padding-5 height-25">
                    {autoTask?.stage?.name}
                  </span>
                </td>
                <td onClick={() => handleShowEditModal(autoTask.id)}>
                  <span className="badge badge-primary ml-2 padding-5 height-25">
                    {autoTask?.block_by_stage?.name}
                  </span>
                </td>
                <td>
                  <Button
                    text={"Delete Task"}
                    className={"btn-danger"}
                    onClick={() => handleDelete(autoTask.id)}
                  />
                </td>
              </tr>
            ))}
        </tbody>
      </TableFirmSettings>

      <EditAutoTaskModal
        show={showEditTaskModal}
        handleClose={handleCloseEditModal}
        editData={editData}
        data={data}
        pageSlots={getPageSlots}
        onPageIdChange={handlePageIdChange}
        refetch={refetch}
      />

      <AddAutoTaskModal
        show={showAddTaskModal}
        handleClose={handleCloseModal}
        data={data}
        pageSlots={getPageSlots}
        onPageIdChange={handlePageIdChange}
        refetch={refetch}
      />
    </div>
  );
};

export default AutoTasks;
