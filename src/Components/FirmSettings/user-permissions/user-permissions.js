import React, { useEffect, useState } from "react";
import "./user-permission.css";
import CommonHeader from "../common/common-header";
import useGetUserPermission from "./hooks/useGetUserPermission";
import useUpdateUserPermission from "./hooks/useUpdateUserPermission";

const UserPermissions = () => {
  const heading = "Enable functionality for each user account";
  const points = [
    "1. Edit Case Workers: User can edit firm user names and email addresses.",
    "2. View All Cases: User can view all cases in the firm.",
    "3. View Only Team: User can only access cases they are attached to but still view all cases in search results.",
    "4. Email Clients: User can email clients from client page.",
    "5. Chat with Client: User can chat with clients through client page.",
    "6. Text Client: User can send texts to client from client page.",
    "7. Edit Firm Branding: User can modify the look of the program through the Firm Branding settings panel.",
    "8. Edit User Avatars: User can modify the avatars for each user in the firm.",
    "9. Edit Client Notes: User can edit notes on a case file.",
    "10. Edit S.O.L.: User can edit the statute of limitations on a case file.",
    "11. Edit Lit. Events: User can edit litigation events on a case file.",
    "12. View Non-Case Docs: User can view case documents not associated with a case file in firm management.",
    "13. Edit Doc Templates: User can modify document templates accessible via the generate document button.",
    "14. Edit Objections: User can edit the objections that are selectable to apply to discovery responses.",
    "15. Add Case To Client: User can add a new case to an existing client. (Waleed- edit the title from + Case or Client.",
  ];

  const headerData = [
    "Edit Case Workers",
    "View All Cases",
    "View Only Team",
    "Email Clients",
    "Chat with Client",
    "Text Client",
    "Edit Firm Branding",
    "Edit User Avatars",
    "Edit Client Notes",
    "Edit S.O.L.",
    "Edit Lit. Events",
    "View Non-Case Docs",
    "Edit Doc Templates",
    "Edit Objections",
    "+ Case or Client",
  ];
  const { data: getUserPermission, loading, error } = useGetUserPermission();
  const { updateFirmSetting } = useUpdateUserPermission();

  const [userPermissionState, setUserPermissionState] = useState([]);
  useEffect(() => {
    if (getUserPermission) {
      setUserPermissionState(getUserPermission);
    }
  }, [getUserPermission]);

  const handleCheckboxChange = async (
    userId,
    settingKey,
    currentValue,
    fullFirmSettings
  ) => {
    const updatedPermissions = getUserPermission?.map((user) => {
      if (user?.user.id === userId) {
        return {
          ...user,
          for_firmsetting: {
            ...user.for_firmsetting,
            [settingKey]: !currentValue,
          },
        };
      }
      return user;
    });

    setUserPermissionState(updatedPermissions);

    const updatedSettings = {
      ...fullFirmSettings,
      [settingKey]: !currentValue,
    };

    const result = await updateFirmSetting(userId, updatedSettings);

    if (!result) {
      const revertedPermissions = getUserPermission.map((user) => {
        if (user?.user.id === userId) {
          return {
            ...user,
            for_firmsetting: {
              ...user.for_firmsetting,
              [settingKey]: currentValue,
            },
          };
        }
        return user;
      });
      setUserPermissionState(revertedPermissions);
    }
  };
  return (
    <div className="tab-pane fade firm-settings-user-perms-fs active show">
      <div>
        <CommonHeader heading={heading} points={points} />
        <div className="col-lg-12">
          <div className="row">
            <div className="table-responsive border-0 table--no-card m-b-20 table-img">
              <table
                className="table table-borderless table-striped table-earning margin-top-160"
                style={{ marginTop: "140px" }}
              >
                <thead>
                  <tr id="user-perm">
                    <th
                      className="text-center user-info-class td-autosize text-uppercase"
                      style={{ backgroundColor: "white" }}
                    ></th>
                    <th
                      className="text-center p-0 td-autosize user-info-class text-uppercase"
                      style={{ backgroundColor: "white" }}
                    >
                      <div>
                        <span>Firm User</span>
                      </div>
                    </th>
                    {headerData.map((header, index) => (
                      <th
                        style={{ textAlign: "start", backgroundColor: "white" }}
                        key={index}
                        className="text-uppercase"
                      >
                        <div className="row-rotation-firm-settings">
                          <span>{header}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {userPermissionState?.length > 0 &&
                    userPermissionState
                      ?.filter((userData) => userData.for_firmsetting !== null)
                      .map((userData, index) => (
                        <tr key={userData.id}>
                          <td className="td-autosize text-center">
                            {index + 1}
                          </td>

                          <td className="td-autosize text-center">
                            <span className="d-flex align-items-center">
                              {userData?.profile_pic_29p ? (
                                <img
                                  src={userData?.profile_pic_29p}
                                  className="ic ic-avatar ic-29 has-avatar-icon has-cover-img m-r-5"
                                  alt=""
                                />
                              ) : (
                                <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img m-r-5"></span>
                              )}
                              <span className="font-weight-semibold">
                                {userData?.user?.first_name}{" "}
                                {userData?.user?.last_name}
                              </span>
                            </span>
                          </td>

                          {Object.keys(userData.for_firmsetting).map(
                            (settingKey) => {
                              if (settingKey === "id") return null;

                              return (
                                <td
                                  className="td-autosize text-center"
                                  key={settingKey}
                                  style={{
                                    transform:
                                      window.innerWidth > 2500
                                        ? "translateX(-85px)"
                                        : "",
                                  }}
                                >
                                  <input
                                    type="checkbox"
                                    checked={
                                      userData.for_firmsetting[settingKey] ===
                                        true || false
                                    }
                                    onChange={() =>
                                      handleCheckboxChange(
                                        userData.user?.id,
                                        settingKey,
                                        userData.for_firmsetting[settingKey],
                                        userData.for_firmsetting
                                      )
                                    }
                                  />
                                </td>
                              );
                            }
                          )}
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPermissions;
