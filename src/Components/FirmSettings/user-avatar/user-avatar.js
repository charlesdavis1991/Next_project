import React, { useState } from "react";
import "./user-avatar.css";
import CommonHeader from "../common/common-header";
import useGetUserAvatar from "./hooks/useGetUserAvatar";
import api from "../../../api/api";
import ImagePreviewModal from "./modals/image-preview-modal";

const UserAvatar = () => {
  const heading = "Give each user an avatar to recognize them in the program";
  const points = [
    "1. Upload a new photo to be used as an avatar for each firm user in all the possible sizes throughout the program. The photo uploaded should be a square and will center and rescale the image to the correct resolution and size.",
  ];
  const { data, loading, error, refetch } = useGetUserAvatar();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  console.log(data);
  const handleFileChange = (e, userId, fn) => {
    const file = e.target.files[0];
    console.log(userId, fn);
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
      setSelectedUserId(userId);
      setIsModalOpen(true);
    }
  };

  const handleSaveAvatar = async () => {
    console.log("hio");
    if (selectedFile && selectedUserId) {
      const formData = new FormData();
      formData.append("user_id", selectedUserId);
      formData.append("file", selectedFile);

      try {
        const response = await api.post(
          `/api/firmsetting-page/upload-user-avatar/`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("Avatar uploaded successfully:", response.data);
        refetch();
        setIsModalOpen(false);
      } catch (error) {
        console.error("Error uploading avatar:", error);
      }
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setPreviewImage(null);
    setSelectedUserId(null);
    setIsModalOpen(false);
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
              <th className="text-uppercase">User Name</th>
              <th className="text-uppercase"></th>
            </tr>
          </thead>
          <tbody>
            {data &&
              data.map((userAvatars, idx) => (
                <tr style={{ height: "70px" }}>
                  <td
                    key={userAvatars?.user.id}
                    className="text-center m-r-5 m-l-5 td-autosize"
                    style={{ color: "gray" }}
                  >
                    {idx + 1}
                  </td>
                  <td className="text-center" style={{ width: "20%" }}>
                    <button className="mb-1 btn user-profile-class give-white-space d-flex justify-content-between align-items-center">
                      <>
                        {userAvatars?.profile_pic_63p ? (
                          <img
                            src={userAvatars?.profile_pic_63p}
                            className="client-image ic-63 position-relative"
                            alt=""
                          />
                        ) : (
                          <span
                            className="ic ic-avatar ic-63 has-avatar-icon has-cover-img position-relative"
                            style={{ marginRight: "8px" }}
                          ></span>
                        )}
                      </>
                      <>
                        {userAvatars?.profile_pic_29p ? (
                          <img
                            src={userAvatars?.profile_pic_29p}
                            className="client-image ic-29 position-relative"
                            alt=""
                          />
                        ) : (
                          <span
                            className="ic ic-avatar ic-29 has-avatar-icon has-cover-img position-relative"
                            style={{ marginRight: "8px" }}
                          ></span>
                        )}
                      </>
                      <>
                        {userAvatars?.profile_pic_19p ? (
                          <img
                            src={userAvatars?.profile_pic_19p}
                            className="client-image ic-19 position-relative"
                            alt=""
                          />
                        ) : (
                          <span
                            className="ic ic-avatar ic-19 has-avatar-icon has-cover-img position-relative"
                            style={{ marginRight: "8px" }}
                          ></span>
                        )}
                        <span className="m-l-2">
                          {userAvatars?.user?.first_name}{" "}
                          {userAvatars?.user?.last_name}
                        </span>
                      </>
                    </button>
                  </td>
                  <td className="td-autosize text-center">
                    {userAvatars?.user?.username}
                  </td>
                  <td class="text-right">
                    <button className="custom-button-container">
                      <label
                        htmlFor={`custom-upload-button-${userAvatars?.user?.id}`}
                        className="user-upload-class"
                        style={{ cursor: "pointer" }}
                      >
                        Upload New Firm User Avatar
                      </label>
                      <input
                        type="file"
                        id={`custom-upload-button-${userAvatars?.user?.id}`}
                        className="custom-file-input"
                        style={{ display: "none" }}
                        onChange={(e) => handleFileChange(e, userAvatars?.id)}
                      />
                    </button>

                    <button className="custom-button-container d-none">
                      <label
                        for="custom-delete-button-8"
                        className="custom-delete-button-8"
                      >
                        Remove
                      </label>
                      <input type="hidden" className="staffID" value="8" />
                      <input
                        type="file"
                        id="custom-delete-button-8"
                        className="custom-file-input"
                      />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <ImagePreviewModal
        show={isModalOpen}
        handleClose={handleCancel}
        handleSave={handleSaveAvatar}
        previewImage={previewImage}
      />
    </div>
  );
};

export default UserAvatar;
