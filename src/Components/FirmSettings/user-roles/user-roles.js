import React, { useState } from "react";
import "./user-roles.css";
import CommonHeader from "../common/common-header";
import {
  useGetFirmUserTypes,
  useGetUserRoles,
} from "./hooks/useGetRolesPageApi";
import DropdownComponent from "../common/dropdownComponent";
import RoleSelectionModal from "./modals/role-selection-modal";
import api from "../../../api/api";

const UserRoles = () => {
  const heading =
    "Set the main and possible user roles for each user along with their hourly billing rate";
  const points = [
    "1. Default User Role is the default role the user is assigned if the user is assigned to a case automatically without setting a specific role for that case and represents the main role that user holds at the firm.",
    "2. Hourly Billing Rate is the billing rate used to automatically calculate the billing value for that user on a case based on the time spent on the case.",
    "3. Firm User Roles are the possible roles the user can be selected for on a case.",
    "4. Edit button allows for the editing of these values.",
  ];

  const {
    data: getUserRoles,
    loading: userRolesLoading,
    error: userRolesError,
    refetch,
  } = useGetUserRoles();
  const {
    data: getFirmUserType,
    loading: firmUserTypeLoading,
    error: firmUserTypeError,
  } = useGetFirmUserTypes();

  const [showModal, setShowModal] = useState(false);

  const [selectedUserId, setSelectedUserId] = useState(null);
  const handleSave = async (selectedRoles) => {
    try {
      console.log("Selected Roles:", selectedRoles);

      const response = await api.post(
        "/api/firmsetting-page/update-user-role-rate/",
        selectedRoles
      );

      refetch();
      setShowModal(false);
      console.log("API responses:", response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="tab-pane fade firm-settings-user-perms-fs active show">
      <div>
        <CommonHeader heading={heading} points={points} />
      </div>
      <div className="tab-content">
        <table
          className={`table table-borderless table-striped table-treatment has-specialty-icon has-height-25 block-table m-r-5`}
          id="treatment-summary-table"
        >
          <thead>
            <tr id="tb-header">
              <th></th>
              <th className="text-uppercase">Firm User</th>
              <th className="text-uppercase">User Role</th>
              <th className="text-uppercase">Firm User Roles</th>
              <th className="text-uppercase">Edit Firm Roles</th>
            </tr>
          </thead>
          <tbody>
            {getUserRoles &&
              getUserRoles?.map((userRole, idx) => (
                <tr key={userRole.id} style={{ height: "40px" }}>
                  <td
                    className="text-center m-r-5 m-l-5"
                    style={{ color: "gray" }}
                  >
                    {idx + 1}
                  </td>
                  <td className=" text-center">
                    <span className="d-flex align-items-center">
                      <>
                        {userRole?.profile_pic_29p ? (
                          <img
                            src={userRole?.profile_pic_29p}
                            className="ic ic-avatar ic-29 has-avatar-icon has-cover-img m-r-5"
                            alt=""
                          />
                        ) : (
                          <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img m-r-5"></span>
                        )}
                        <span className="font-weight-semibold">
                          {userRole?.user?.first_name}{" "}
                          {userRole?.user?.last_name}
                        </span>
                      </>
                    </span>
                  </td>
                  <DropdownComponent
                    getFirmUserType={getFirmUserType ?? []}
                    getUserRoles={userRole}
                  />
                  <td className="">
                    <span className="d-flex justify-content-center align-items-center text-center flex-wrap btn-gaps">
                      {userRole?.firm_roles[0]?.for_firm_usertype.map(
                        (firmUserType, idx) => (
                          <div
                            className="d-flex flex-row text-nowrap"
                            key={firmUserType.id}
                          >
                            <span className="badge badge-primary ml-2 padding-5 height-25">
                              {firmUserType.name}
                            </span>
                          </div>
                        )
                      )}
                    </span>
                  </td>
                  <td className="text-center">
                    <span className="d-flex justify-content-center align-items-center">
                      <button
                        className="btn btn-secondary height-25 d-flex justify-content-center align-items-center"
                        onClick={() => {
                          setSelectedUserId(userRole?.id);
                          setShowModal(true);
                        }}
                      >
                        Edit
                      </button>
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <RoleSelectionModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        handleSave={handleSave}
        userRoles={getFirmUserType}
        userId={selectedUserId}
        refetch={refetch}
        userDefinedRoles={getUserRoles}
      />
    </div>
  );
};

export default UserRoles;
