import React, { useEffect, useState } from "react";
import CommonHeader from "../common/common-header";
import useGetTeams from "./hooks/useTeamTabApi";
import Button from "../common/button";
import TableFirmSettings from "../common/table-firm-settings";
import "./add-team.css";
import AddEditTeamModal from "./modals/add-edit-modal";
import api from "../../../api/api";

const AddTeams = () => {
  const heading = "FIRM SETTINGS TITLE WITH CENTERED TEXT";
  const points = [
    "1. Firm settings panel instruction point one",
    "2. Firm settings panel instruction point two",
    "3. Firm settings panel instruction point three",
  ];

  const { data: getTeams, refetch } = useGetTeams();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editData, setEditData] = useState();
  const [showEditModal, setShowEditModal] = useState(false);

  const handleShowModal = () => {
    setShowAddModal(true);
  };

  const handleEditData = async (id) => {
    try {
      const response = await api.get(`/api/firmsetting-page/edit-team/`, {
        params: {
          team_id: id,
        },
      });
      setEditData(response.data);
    } catch (error) {
      console.error();
    } finally {
      setShowEditModal(true);
    }
  };

  return (
    <div className="tab-pane fade firm-settings-user-perms-fs active show">
      <div>
        <CommonHeader heading={heading} points={points} />
      </div>
      <div className="row m-b-5 drop-down col-lg-12 d-flex align-items-center f-gap-05 MB5PX-F">
        <label className="m-b-0">
          Default Firm User to Fill Missing Users:
        </label>
        <div className="team-select-field-holder col-sm-3">
          <select className="form-select custom-select">
            <option value="">Select a Default Firm User</option>
            {getTeams?.dropdown_users_data?.map((user_data) => (
              <option key={user_data.id} value={user_data.id}>
                {user_data?.user?.first_name} {user_data?.user?.last_name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-sm-2">
          <Button
            text={"Add Team"}
            className={"btn-success"}
            onClick={handleShowModal}
          />
        </div>
      </div>
      {getTeams?.teams_data?.map((team, idx) => {
        const teamMembers = Object.keys(team)
          .filter((key) => key.startsWith("firm_user"))
          .map((key) => team[key]);
        const teamArray1 = teamMembers.slice(0, 3);
        const teamArray2 = teamMembers.slice(3, 6);

        return (
          <>
            <div className="row col-lg-12 m-b-5">
              <div className="p-l-5 background-main-10 height-25 d-flex align-items-center w-100">
                <label className="firm-heading-label m-b-0 text-nowrap">
                  <input
                    type="radio"
                    checked={team?.default_cocounsel_team}
                    className="cocounselling-radio m-r-5"
                    id={`cocounselling-${team.id}`}
                  />
                  Default for Co-Counseling
                </label>
                <h4 className="client-contact-title text-center d-flex justify-content-center align-items-center h-100 custom-team-panel-heading w-100">
                  Team: {team?.team_name}
                </h4>
              </div>
            </div>
            <div className="row col-lg-12 m-b-5">
              <div
                className="team-row d-flex f-gap-05 w-100"
                id={`team-row-${team?.id}`}
                onClick={() => handleEditData(team?.id)}
              >
                <div className="table-responsive border-0 table--no-card m-b-5 table-img">
                  <TableFirmSettings>
                    <tbody>
                      {teamArray1?.map((team_data, idx) => (
                        <tr style={{ height: "35px" }} key={team_data.id}>
                          <td
                            className="color-black p-0"
                            id="table-add-team-css"
                            style={{ width: "162px" }}
                          >{`Position ${idx + 1}`}</td>
                          <td
                            className="d-flex justify-content-between align-items-center w-100 color-black p-0"
                            id="table-add-team-css"
                          >
                            <button
                              type="button"
                              className="btn d-flex align-items-center justify-content-start padding-transform-visibility-margin flex-g-1"
                            >
                              <div
                                className="ic ic-avatar ic-29 has-avatar-icon has-cover-img"
                                id={`case-profile-${idx + 1}`}
                              >
                                {team_data?.profile_pic_29p ? (
                                  <img
                                    id="output"
                                    src={team_data?.profile_pic_29p}
                                  />
                                ) : (
                                  <span className="ic ic-29 ic-avatar"></span>
                                )}
                              </div>
                              <div
                                className="ml-2"
                                id={`case-username-${idx + 1}`}
                              >
                                {team_data?.user?.first_name}
                                {team_data?.user?.lasT_name}
                              </div>
                            </button>
                          </td>
                          <td className="p-0" id="table-add-team-css"></td>
                        </tr>
                      ))}
                    </tbody>
                  </TableFirmSettings>
                </div>
                <div className="table-responsive border-0 table--no-card m-b-5 table-img">
                  <TableFirmSettings>
                    <tbody>
                      {teamArray2?.map((team_data, idx) => (
                        <tr style={{ height: "35px" }} key={team_data.id}>
                          <td
                            className="color-black p-0"
                            id="table-add-team-css"
                            style={{ width: "162px" }}
                          >{`Position ${idx + 1}`}</td>
                          <td
                            className="d-flex justify-content-between align-items-center w-100 color-black p-0"
                            id="table-add-team-css"
                          >
                            <button
                              type="button"
                              className="btn d-flex align-items-center justify-content-start padding-transform-visibility-margin flex-g-1"
                            >
                              <div
                                className="ic ic-avatar ic-29 has-avatar-icon has-cover-img"
                                id={`case-profile-${idx + 1}`}
                              >
                                {team_data?.profile_pic_29p ? (
                                  <img
                                    id="output"
                                    src={team_data?.profile_pic_29p}
                                  />
                                ) : (
                                  <span className="ic ic-29 ic-avatar"></span>
                                )}
                              </div>
                              <div
                                className="ml-2"
                                id={`case-username-${idx + 1}`}
                              >
                                {team_data?.user?.first_name}
                                {team_data?.user?.lasT_name}
                              </div>
                            </button>
                          </td>
                          <td className="p-0" id="table-add-team-css"></td>
                        </tr>
                      ))}
                    </tbody>
                  </TableFirmSettings>
                </div>
              </div>
            </div>
          </>
        );
      })}
      <AddEditTeamModal
        show={showEditModal}
        handleClose={() => setShowEditModal(false)}
        refetch={refetch}
        dropdownData={getTeams?.dropdown_users_data}
        editData={editData}
        isEdit={true}
      />

      <AddEditTeamModal
        show={showAddModal}
        handleClose={() => setShowAddModal(false)}
        refetch={refetch}
        dropdownData={getTeams?.dropdown_users_data}
      />
    </div>
  );
};

export default AddTeams;
