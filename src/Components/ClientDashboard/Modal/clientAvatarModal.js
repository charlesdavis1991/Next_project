import React, {
  useEffect,
  useState,
  useContext,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Col, Modal, Row, Form } from "react-bootstrap";

import { mediaRoute, getToken, getClientId } from "../../../Utils/helper";
import axios from "axios"; // Assuming you're using axios for API calls
import { useSelector } from "react-redux";
import api from "../../../api/api";
import { ClientDataContext } from "../shared/DataContext";
import "../../../../public/BP_resources/css/client-4.css";
import defaultAvatar from "../../../../public/bp_assets/img/avatar_new.svg";
import { useDispatch } from "react-redux";
import { updateClientProfilePic } from "../../../Redux/caseData/caseDataSlice";

const ClientAvatarModal = forwardRef(
  (
    {
      show,
      handleClose,
      Avatars,
      photos,
      last_name,
      first_name,
      hideModal,
      middle_name,
    },
    ref
  ) => {
    const clientId = getClientId();
    const dispatch = useDispatch();
    const token = getToken();
    const enviroment = process.env.NODE_ENV;
    const [signal, setSignal] = useState(false);

    const sendSignal = () => {
      setSignal(true);
    };

    // Function to reset the signal
    const resetSignal = () => {
      setSignal(false);
    };

    const [loading, setloading] = useState(false);
    const origin = process.env.REACT_APP_BACKEND_URL;
    const { setIsClientDataUpdated } = useContext(ClientDataContext);

    const [avatars, setAvatars] = useState({
      avatar1: Avatars?.avatar1,
      avatar2: Avatars?.avatar2,
      avatar3: Avatars?.avatar3,
    });
    const handleAvatarChange = (photo) => {
      setAvatars({
        avatar1: mediaRoute(photo.image),
        avatar2: mediaRoute(photo.image),
        avatar3: mediaRoute(photo.image),
      });
    };
    const saveAvatar = () => {
      setloading(true);
      const selectedAvatarSrc = avatars.avatar1; // Assuming the main avatar is the one to be saved
      // Determine the MIME type based on the file extension
      let mimeType = "";
      if (selectedAvatarSrc.endsWith(".png")) {
        mimeType = "image/png";
      } else if (
        selectedAvatarSrc.endsWith(".jpg") ||
        selectedAvatarSrc.endsWith(".jpeg")
      ) {
        mimeType = "image/jpeg";
      } else if (selectedAvatarSrc.endsWith(".gif")) {
        mimeType = "image/gif";
      } else {
        mimeType = "application/octet-stream";
      }
      console.log("AvatarModal MIME type:", mimeType);
      // Fetch the image file from the URL
      console.log("bye1", avatars?.avatar1);
      console.log("bye2", mediaRoute(avatars?.avatar1));
      try {
        const func = async () => {
          const response = await axios.get(
            `${avatars?.avatar1}?timestamp=${new Date()}`,
            {
              responseType: "blob",
              withCredentials: false,
            }
          );

          const imageBlob = new Blob([response.data], { type: mimeType });
          const formData = new FormData();
          formData.append(
            "profile_pic",
            imageBlob,
            `profile_pic.${mimeType.split("/")[1]}`
          );
          formData.append("client_id", clientId);
          formData.append("image_path", selectedAvatarSrc);

          await axios.post(
            `${origin}/api/client-page/update-profile/`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: token,
              },
            }
          );

          setAvatars({
            avatar1: mediaRoute(response?.data?.image_urls?.profile_pic_63p),
            avatar2: mediaRoute(response?.data?.image_urls?.profile_pic_29p),
            avatar3: mediaRoute(response?.data?.image_urls?.profile_pic_19p),
          });

          setIsClientDataUpdated(true);
          hideModal();
          setloading(false);
        };
        func();
      } catch (e) {
        console.error("Error:", e);
      }
    };

    useImperativeHandle(ref, () => ({
      submit: saveAvatar,
    }));

    const saveAvatarDefault = () => {
      setloading(true);
      const selectedAvatarSrc = "/bp_assets/img/avatar_new.png";

      let mimeType = "";
      if (selectedAvatarSrc.endsWith(".png")) {
        mimeType = "image/png";
      } else if (
        selectedAvatarSrc.endsWith(".jpg") ||
        selectedAvatarSrc.endsWith(".jpeg")
      ) {
        mimeType = "image/jpeg";
      } else if (selectedAvatarSrc.endsWith(".gif")) {
        mimeType = "image/gif";
      } else if (selectedAvatarSrc.endsWith(".svg")) {
        mimeType = "image/svg+xml";
      } else {
        mimeType = "application/octet-stream";
      }
      console.log("AvatarModal MIME type:", mimeType);

      try {
        const func = async () => {
          const response = await axios.get(selectedAvatarSrc, {
            responseType: "blob",
            withCredentials: false,
          });

          const imageBlob = new Blob([response.data], { type: mimeType });
          const formData = new FormData();
          formData.append(
            "profile_pic",
            imageBlob,
            `profile_pic.${mimeType.split("/")[1]}`
          );
          formData.append("client_id", clientId);
          formData.append(
            "image_path",
            enviroment !== "development"
              ? `https://react-dev.simplefirm.com/${selectedAvatarSrc}`
              : "http://localhost:3000/bp_assets/img/avatar_new.png"
          );

          const profileupdate = await axios.post(
            `${origin}/api/client-page/update-profile/`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: token,
              },
            }
          );
          if (profileupdate) {
            dispatch(
              updateClientProfilePic(
                profileupdate?.data?.image_urls?.profile_pic_63p
              )
            );
          }

          setAvatars({
            avatar1: mediaRoute(
              profileupdate?.data?.image_urls?.profile_pic_63p
            ),
            avatar2: mediaRoute(
              profileupdate?.data?.image_urls?.profile_pic_29p
            ),
            avatar3: mediaRoute(
              profileupdate?.data?.image_urls?.profile_pic_19p
            ),
          });

          setIsClientDataUpdated(true);
          hideModal();
          setloading(false);
        };
        func();
      } catch (e) {
        console.error("Error:", e);
        setloading(false);
      }
    };

    useEffect(() => {
      if (signal) {
        console.log("Signal received in child, executing function...");
        saveAvatarDefault();
        resetSignal();
      }
    }, [signal, resetSignal]);

    return (
      <>
        <Modal show={show} onHide={handleClose} size="lg">
          <Modal.Header className="modal-header text-center" closeButton>
            <h5 className="modal-title mx-auto">Edit Avatar</h5>
          </Modal.Header>
          <div
            className="m-t-5 overflow-scroll justify-content-center"
            style={{
              height: "12rem",
              display: "flex",
              flexDirection: "column",
              scrollbarWidth: "none",
            }}
          >
            <div
              className="d-flex align-items-center justify-content-center w-100"
              style={{ marginBottom: "10px" }}
            >
              <div className="client-image ic-63 position-relative">
                <img
                  src={avatars?.avatar1}
                  data-photo=""
                  id="selectedAvatar"
                  alt="John Doe "
                />
              </div>
              <div className="client-image ic-29 position-relative w-h-29">
                <img
                  src={avatars?.avatar2}
                  id="selectedAvatar_29"
                  alt="John Doe"
                />
              </div>
              <div className="client-image ic-19 position-relative w-h-19">
                <img
                  src={avatars?.avatar3}
                  id="selectedAvatar_19"
                  alt="John Doe "
                />
              </div>
              <div className="list-item-content">
                <h4>
                  {first_name + " "}
                  {middle_name + " "}
                  {last_name}
                </h4>
              </div>
            </div>
            <ul className="list">
              {photos?.map((photo, index) => (
                <li
                  className="list-item"
                  key={index}
                  onClick={() => handleAvatarChange(photo)}
                >
                  <div className="client-image position-relative">
                    <img
                      src={mediaRoute(photo?.image)}
                      data-photo={photo?.title}
                      alt="John Doe"
                      className="avatarPhoto"
                    />
                  </div>
                </li>
              ))}
              {/* <li class="list-item" onClick={() => handleAvatarChange({ image: "https://simplefirm-bucket.s3.amazonaws.com/static/bp_assets/img/avatar_new.svg" })}>
                        <div class="client-image position-relative">
                            <img src="https://simplefirm-bucket.s3.amazonaws.com/static/bp_assets/img/avatar_new.svg" alt="John Doe" class="avatarPhoto" />
                        </div>
                    </li> */}
            </ul>
          </div>
          <Modal.Footer className="modal-footer border-0 justify-content-between pt-0">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                sendSignal();
              }}
              className="btn btn-danger"
            >
              {"Reset Client Avatar"}
            </button>
            <button
              type="button"
              className="btn btn-success"
              onClick={() => {
                saveAvatar();
              }}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
);
export default ClientAvatarModal;
