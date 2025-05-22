import React, { useEffect, useState } from "react";
import CommonHeader from "../common/common-header";
import InputWithOutLabels from "../common/InputWithoutLabel";
import useGetUserTypes, { useAddUser } from "./hooks/useAddUserApi";
import Button from "../common/button";

const AddUsers = () => {
  const heading = "FIRM SETTINGS TITLE WITH CENTERED TEXT";
  const points = [
    "1. Firm settings panel instruction point one",
    "2. Firm settings panel instruction point two",
    "3. Firm settings panel instruction point three",
  ];
  const [userName, setUserName] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone_ext, setPhoneExt] = useState("");
  const [add_user_type, setAddUserType] = useState([]);
  const [selectedUserTypes, setSelectedUserTypes] = useState([]);
  const [sBN, setSBN] = useState("");

  const addUserData = [
    {
      label: "Username",
      value: userName,
      onChange: (e) => setUserName(e.target.value),
      for: "username",
    },
    {
      label: "First Name",
      value: first_name,
      onChange: (e) => setFirstName(e.target.value),
      for: "first_name",
    },
    {
      label: "Last Name",
      value: last_name,
      onChange: (e) => setLastName(e.target.value),
      for: "last_name",
    },
    {
      label: "Email",
      value: email,
      onChange: (e) => setEmail(e.target.value),
      for: "email",
    },
    {
      label: "Password",
      value: password,
      onChange: (e) => setPassword(e.target.value),
      for: "password",
    },
    {
      label: "Phone Extension",
      value: phone_ext,
      onChange: (e) => setPhoneExt(e.target.value),
      for: "phone_ext",
    },
    {
      label: "SBN",
      value: sBN,
      onChange: (e) => setSBN(e.target.value),
      for: "sBN",
    },
  ];

  const { data, refetch } = useGetUserTypes();
  const { saveAddUser } = useAddUser();

  useEffect(() => {
    if (data) {
      setAddUserType(data);
    }
  }, [data]);

  const handleCheckboxChange = (userTypeId) => {
    setSelectedUserTypes((prevSelectedUserTypes) => {
      if (prevSelectedUserTypes.includes(userTypeId)) {
        return prevSelectedUserTypes.filter((id) => id !== userTypeId);
      } else {
        return [...prevSelectedUserTypes, userTypeId];
      }
    });
  };

  const handleSave = async () => {
    const payload = {
      username: userName,
      first_name,
      last_name,
      email,
      password,
      phone_extension: phone_ext,
      user_types: selectedUserTypes,
      statebarnumber: sBN,
    };

    await saveAddUser(payload);

    setUserName("");
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setPhoneExt("");
    setSelectedUserTypes([]);
    setSBN("");
  };

  return (
    <div className="tab-pane fade firm-settings-user-perms-fs active show">
      <div>
        <CommonHeader heading={heading} points={points} />
      </div>
      {addUserData.map((user_data, idx) => (
        <div className="mb-3 row col-lg-12" key={idx}>
          <label
            className="col-sm-2 col-form-label fw-bold"
            for={user_data.for}
          >
            {user_data.label}
          </label>
          <div className="col-sm-10">
            <InputWithOutLabels
              type={
                user_data.for === "phone_ext"
                  ? "number"
                  : user_data.for === "password"
                    ? "password"
                    : "text"
              }
              placeholder={`Enter ${user_data.label}`}
              value={user_data.value}
              onChange={user_data.onChange}
            />
          </div>
        </div>
      ))}
      <div className="mb-3 row col-lg-12">
        <label
          className="col-sm-2 col-form-label fw-bold d-flex align-items-center"
          for="user_types"
        >
          Attach User Types
        </label>
        <div className="Attach-User-Typre-F">
          <div className="col-sm-10">
            {add_user_type &&
              add_user_type?.map((userType, idx) => (
                <div key={idx} className="form-check">
                  <input
                    className="form-check "
                    type="checkbox"
                    id={userType.id}
                    value={userType.id}
                    onChange={() => handleCheckboxChange(userType.id)}
                    checked={selectedUserTypes.includes(userType.id)}
                  />
                  <label
                    className="form-check text-nowrap m-b-0"
                    for={userType.id}
                  >
                    {userType.name}
                  </label>
                </div>
              ))}
          </div>
        </div>
      </div>
      <div className="row col-lg-12">
        <div className="col-sm-2">
          <Button
            text={"Add User"}
            onClick={handleSave}
            className={"btn-success"}
          />
        </div>
      </div>
    </div>
  );
};

export default AddUsers;
