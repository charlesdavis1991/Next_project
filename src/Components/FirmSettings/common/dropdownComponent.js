import React, { useState, useEffect } from "react";
import { useGetUserRoles } from "../user-roles/hooks/useGetRolesPageApi";
import api from "../../../api/api";

const DropdownComponent = ({ getFirmUserType, getUserRoles }) => {
  const [selectedRole, setSelectedRole] = useState({});
  const { refetch } = useGetUserRoles();

  useEffect(() => {
    if (getUserRoles?.for_firmusertype) {
      setSelectedRole(getUserRoles.for_firmusertype);
    } else {
      setSelectedRole(getFirmUserType[0]);
    }
  }, [getFirmUserType, getUserRoles]);

  const handleChange = async (e) => {
    console.log(e.target.value);
    const selectedId = parseInt(e.target.value);
    const selected = getFirmUserType.find((role) => role.id === selectedId);
    setSelectedRole(selected);
    try {
      const response = await api.post(
        `/api/firmsetting-page/update-user-type/`,
        {
          user_id: getUserRoles?.id,
          user_type_id: selected?.id,
        }
      );
      console.log("User Type Changed successfully:", response.data);
      refetch();
    } catch (error) {
      console.error("Error uploading avatar:", error);
    }
  };

  return (
    <td className="">
      <select
        value={selectedRole?.id || getFirmUserType[0]?.id}
        onChange={handleChange}
        className="form-select line-height-in"
        style={{ height: "30px" }}
      >
        {getFirmUserType?.map((role) => (
          <option key={role.id} value={role.id}>
            {role.name}
          </option>
        ))}
      </select>
    </td>
  );
};

export default DropdownComponent;
