import React, { useState, useEffect } from "react";
import "./user-account.css";
import CommonHeader from "../common/common-header";
import useUserAccounts from "./hooks/useUserAccount";
import ResetPasswordModal from "./Modals/reset-password-modal";
import api from "../../../api/api";
import { Toast } from "react-bootstrap";
import useCheckAttorneyUser from "./hooks/useCheckAttorneyUser";
import EditUserModal from "./Modals/edit-user-modal";

const UserAccounts = () => {
  const heading = "Enable high-level permissions for each user account";
  const points = [
    "1. Accounting: User can access the accounting functions.",
    "2. Admin: User can access administrative functions in firm settings.",
    "3. Intake: User can add new cases to the firm.",
    "4. Active: User account is active or not.",
    "5. Reset Password: User can reset password from login screen.",
  ];
  const [activeTab, setActiveTab] = useState("all");
  const sidebarItems = [
    { id: "all", name: "All" },
    { id: "active", name: "Active" },
    { id: "in-active", name: "InActive" },
  ];

  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const { data, loading, error, refetch } = useUserAccounts(activeTab);
  const {
    data: userExists,
    loading: checkUser,
    error: checkUserError,
  } = useCheckAttorneyUser();

  const [permissions, setPermissions] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    if (data) {
      setPermissions(data);
    }
  }, [data]);
  const handleTabChange = (id) => {
    setActiveTab(id);
  };

  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const handleSavePassword = async (newPassword) => {
    try {
      const response = await api.get(
        "/api/firmsetting-page/reset-user-password/",
        {
          user_id: selectedUser?.user?.id,
          password: newPassword,
        }
      );
      if (response.ok) {
        Toast({
          message: "Password reset successfully",
        });
      }
    } catch (error) {
      console.error(error);
      Toast({
        message: "Something went wrong",
      });
    }
    handleCloseModal();
  };
  const handlePermissionChange = async (userId, permissionKey, value) => {
    console.log(userId);
    const userIndex = permissions.findIndex((user) => user.user.id === userId);
    const user = permissions[userIndex];
    console.log(user);
    const previousValue =
      permissionKey === "is_active" ? user.user.is_active : user[permissionKey];

    let newValue;
    if (
      permissionKey === "accounting_permission" ||
      permissionKey === "accounting_admin_permission" ||
      permissionKey === "reset_password_permission" ||
      permissionKey === "isIntake" ||
      permissionKey === "is_active"
    ) {
      newValue = value ? "True" : "False";
    } else {
      newValue = value;
    }

    const updatedPermissions = [...permissions];

    if (permissionKey === "is_active") {
      updatedPermissions[userIndex] = {
        ...user,
        user: {
          ...user.user,
          is_active: newValue === "True" ? true : false,
        },
      };
    } else if (permissionKey === "isIntake") {
      updatedPermissions[userIndex] = {
        ...user,
        isIntake: newValue === "True" ? true : false,
      };
    } else {
      updatedPermissions[userIndex] = {
        ...user,
        [permissionKey]: newValue,
      };
    }
    setPermissions(updatedPermissions);

    try {
      const payload = {
        user_id: userId,
        is_accounting:
          permissionKey === "accounting_permission"
            ? newValue
            : user.accounting_permission === "True"
              ? "True"
              : "False",
        is_admin:
          permissionKey === "accounting_admin_permission"
            ? newValue
            : user.accounting_admin_permission === "True"
              ? "True"
              : "False",
        is_intake:
          permissionKey === "isIntake"
            ? newValue
            : user.isIntake === true
              ? "True"
              : "False",
        is_active:
          permissionKey === "is_active"
            ? newValue
            : user.user.is_active === true
              ? "True"
              : "False",
        reset_password:
          permissionKey === "reset_password_permission"
            ? newValue
            : user.reset_password_permission === "True"
              ? "True"
              : "False",
      };

      const response = await api.post(
        "/api/firmsetting-page/update-useraccount-permissions/",
        payload
      );
      if (response.ok) {
        Toast({
          message: "Permissions updated successfully",
        });
      }
    } catch (error) {
      console.error("Error updating permissions:", error);

      const revertedPermissions = [...permissions];
      revertedPermissions[userIndex] = {
        ...user,
        [permissionKey]: previousValue,
      };
      setPermissions(revertedPermissions);
    }
  };

  const handleModalShow = (e, userData) => {
    e.preventDefault();
    if (userExists?.attorney_user) {
      setShowEditModal(true);
      setUserData(userData);
    }
  };
  return (
    <div className="tab-pane fade firm-settings-user-perms-fs active show">
      <div>
        <CommonHeader heading={heading} points={points} />
      </div>
      <nav className="nav nav-tabs custom-nav-tabs d-flex align-items-center justify-content-around">
        {sidebarItems.map((item) => (
          <a
            key={item.id}
            className={`nav-item nav-link custom-tab-item ${activeTab === item.id ? "active custom-tab-active" : ""}`}
            onClick={() => handleTabChange(item.id)}
            role="tab"
            aria-selected={activeTab === item.id}
          >
            {item.name}
          </a>
        ))}
      </nav>
      <div className="tab-content">
        <table
          className={`table table-borderless table-striped table-treatment has-specialty-icon has-height-25 block-table m-r-5`}
          id="treatment-summary-table"
        >
          <thead>
            <tr id="tb-header">
              <th></th>
              <th className="text-uppercase">Firm User</th>
              <th className="text-uppercase">Username</th>
              <th className="text-uppercase">email</th>
              {userExists?.attorney_user && (
                <>
                  {activeTab === "all" && <th className="text-uppercase"></th>}
                  <th className="text-uppercase">Accounting</th>
                  <th className="text-uppercase">Admin</th>
                  <th className="text-uppercase">Intake</th>
                  <th className="text-uppercase">Active</th>
                  <th className="text-uppercase">Reset Password</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {permissions.length > 0 &&
              permissions.map((userData, idx) => (
                <tr
                  onClick={(e) => handleModalShow(e, userData)}
                  key={idx}
                  style={{
                    height: "40px",
                    cursor: userExists?.attorney_user ? "pointer" : "normal",
                  }}
                >
                  <td
                    className="td-autosize text-center"
                    style={{ color: "gray" }}
                  >
                    {idx + 1}
                  </td>
                  <td className="text-center" style={{ width: "4%" }}>
                    <span className="d-flex align-items-center">
                      <>
                        {userData?.profile_pic_29p ? (
                          <img
                            src={userData?.profile_pic_29p}
                            className="ic ic-avatar ic-29 has-avatar-icon has-cover-img m-r-5"
                            alt=""
                          />
                        ) : (
                          <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img m-r-5"></span>
                        )}
                        <span
                          className="font-weight-semibold"
                          style={{ fontSize: "13px" }}
                        >
                          {userData?.user?.first_name}{" "}
                          {userData?.user?.last_name}
                        </span>
                      </>
                    </span>
                  </td>
                  <td
                    className="td-autosize text-center"
                    style={{ fontSize: "13px" }}
                  >
                    {userData?.user?.username}
                  </td>
                  <td
                    className="text-center"
                    style={{ fontSize: "13px", width: "5%" }}
                  >
                    {userData?.user?.email}
                  </td>
                  {userExists?.attorney_user && (
                    <>
                      {activeTab === "all" && (
                        <td className="td-autosize text-center">
                          <button
                            className="btn btn-primary"
                            onClick={() => handleOpenModal(userData)}
                          >
                            Reset Password
                          </button>
                        </td>
                      )}
                      <td className="text-center">
                        <input
                          type="checkbox"
                          checked={userData?.accounting_permission === "True"}
                          onChange={(e) =>
                            handlePermissionChange(
                              userData.user.id,
                              "accounting_permission",
                              e.target.checked
                            )
                          }
                        />
                      </td>
                      <td className="text-center">
                        <input
                          type="checkbox"
                          checked={
                            userData?.accounting_admin_permission === "True"
                          }
                          onChange={(e) =>
                            handlePermissionChange(
                              userData.user.id,
                              "accounting_admin_permission",
                              e.target.checked
                            )
                          }
                        />
                      </td>
                      <td className="text-center">
                        <input
                          type="checkbox"
                          checked={userData?.isIntake === true}
                          onChange={(e) =>
                            handlePermissionChange(
                              userData.user.id,
                              "isIntake",
                              e.target.checked
                            )
                          }
                        />
                      </td>
                      <td className="text-center">
                        <input
                          type="checkbox"
                          checked={userData?.user?.is_active === true}
                          onChange={(e) =>
                            handlePermissionChange(
                              userData.user.id,
                              "is_active",
                              e.target.checked
                            )
                          }
                        />
                      </td>
                      <td className="text-center">
                        <input
                          type="checkbox"
                          checked={
                            userData?.reset_password_permission === "True"
                          }
                          onChange={(e) =>
                            handlePermissionChange(
                              userData.user.id,
                              "reset_password_permission",
                              e.target.checked
                            )
                          }
                        />
                      </td>
                    </>
                  )}
                </tr>
              ))}
          </tbody>
        </table>

        <ResetPasswordModal
          show={showModal}
          handleClose={handleCloseModal}
          handleSave={handleSavePassword}
        />
        <EditUserModal
          show={showEditModal}
          handleClose={() => setShowEditModal(false)}
          userData={userData}
          refetch={refetch}
        />
      </div>
    </div>
  );
};

export default UserAccounts;
