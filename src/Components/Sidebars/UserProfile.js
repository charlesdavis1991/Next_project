import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { formatDate } from "../../Utils/helper";
import { useDispatch } from "react-redux";
import { setAttorneyBranding } from "../../Redux/settings/settingsSlice";

const UserProfile = () => {
  const dispatch = useDispatch();
  const [loginInfo, setLoginInfo] = useState({
    id: 0,
    ip_address: "",
    logged_in_at: "",
    user: {
      id: 0,
      first_name: "",
      last_name: "",
      username: "",
      profile_pic: "",
    },
  });

  useEffect(() => {
    api
      .get(`/api/login-info/`)
      .then((response) => {
        setLoginInfo(response.data);
        if (response?.data?.attorney_branding_logo) {
          dispatch(
            setAttorneyBranding({
              logo: response?.data?.attorney_branding_logo,
            })
          );
        }
        localStorage.setItem("loggedInUser", response?.data?.user?.id);
        localStorage.setItem(
          "loggedInUserName",
          response?.data?.user?.first_name +
            " " +
            response?.data?.user?.last_name
        );
        localStorage.setItem(
          "loggedInUserPf",
          response?.data?.user?.profile_pic
        );
      })
      .catch((error) => {
        console.log("error", error);
      });
    return () => {};
  }, []);
  return (
    <ul className="list-unstyled navbar__list user-information m-t-35">
      <li className="has-firm-user">
        {loginInfo?.user?.profile_pic ? (
          <span className="ic-avatar ic-29 has-cover-img sidebar-pic">
            <img
              src={loginInfo?.user?.profile_pic}
              alt={loginInfo?.user?.first_name}
            />
          </span>
        ) : (
          <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img sidebar-pic"></span>
        )}
        <span className="text">{loginInfo?.user?.first_name} </span>
        <span className="text">{loginInfo?.user?.last_name}</span>
      </li>
      <li className="text-lg">
        <span className="d-flex-1">
          <span className="date d-block">
            {formatDate(loginInfo.logged_in_at)}
          </span>
          <span className="time d-block">
            {new Date(loginInfo.logged_in_at).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
            })}
          </span>
        </span>
      </li>
      <li className="text-lg">
        <span className="d-flex-1">{loginInfo.ip_address}</span>
      </li>
      <li className="text-lg">
        <span
          className="d-flex-1"
          id="sidebar_timezone"
          data-toggle="modal"
          data-target="#update_timezone-modal"
        ></span>
      </li>
    </ul>
  );
};

export default UserProfile;
