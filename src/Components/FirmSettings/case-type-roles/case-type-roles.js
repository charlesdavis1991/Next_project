import React, { useEffect, useState } from "react";
import CommonHeader from "../common/common-header";
import TableFirmSettings from "../common/table-firm-settings";
import useGetCaseTypeRoles from "./hooks/useGetCaseTypeRoles";
import { useGetFirmUserTypes } from "../user-roles/hooks/useGetRolesPageApi";
import CaseWorkerRoleModal from "./Modals/edit-case-type-roles";
import useSaveCaseTypeRoles from "./hooks/useSaveCaseTypeRoles";

const CaseTypeRoles = () => {
  const heading = "FIRM SETTINGS TITLE WITH CENTERED TEXT";
  const points = [
    "1. Firm settings panel instruction point one",
    "2. Firm settings panel instruction point two",
    "3. Firm settings panel instruction point three",
  ];
  const [selectedCaseType, setSelectedCaseType] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [caseWorkerRoles, setCaseWorkerRoles] = useState([]);
  const [data, setData] = useState([]); // Stores fetched case types
  const {
    saveCaseTypeRoles,
    loading: saveLoading,
    error: saveError,
    success,
  } = useSaveCaseTypeRoles();

  const {
    data: caseTypeRolesData,
    error,
    loading,
    refetch,
  } = useGetCaseTypeRoles();
  const {
    data: firmUserTypes,
    loading: firmUserTypeLoading,
    error: firmUserTypeError,
  } = useGetFirmUserTypes();

  useEffect(() => {
    if (firmUserTypes) {
      setCaseWorkerRoles(firmUserTypes); // Populate roles from firm user types
    }
  }, [firmUserTypes]);

  useEffect(() => {
    if (caseTypeRolesData) {
      setData(caseTypeRolesData); // Store fetched case type roles data
    }
  }, [caseTypeRolesData]);

  const handleEditClick = (caseType) => {
    setSelectedCaseType(caseType);
    setShowEditModal(true);
  };

  const handleRoleChange = (updatedRoles) => {
    console.log(updatedRoles);
    console.log(selectedCaseType);
    // Update selected case type roles dynamically
    setSelectedCaseType((prev) => ({
      ...prev,
      user_case_type_1: updatedRoles[0],
      user_case_type_2: updatedRoles[1],
      user_case_type_3: updatedRoles[2],
      user_case_type_4: updatedRoles[3],
      user_case_type_5: updatedRoles[4],
      user_case_type_6: updatedRoles[5],
    }));
  };

  const handleSaveRoles = async (updatedData) => {
    console.log("Saving updated roles:", updatedData);
    const payload = {
      id: updatedData.id,
      user_case_type_1:
        updatedData.user_case_type_1.id !== 0
          ? updatedData.user_case_type_1.id
          : undefined,
      user_case_type_2:
        updatedData.user_case_type_2.id !== 0
          ? updatedData.user_case_type_2.id
          : undefined,
      user_case_type_3:
        updatedData.user_case_type_3.id !== 0
          ? updatedData.user_case_type_3.id
          : undefined,
      user_case_type_4:
        updatedData.user_case_type_4.id !== 0
          ? updatedData.user_case_type_4.id
          : undefined,
      user_case_type_5:
        updatedData.user_case_type_5.id !== 0
          ? updatedData.user_case_type_5.id
          : undefined,
      user_case_type_6:
        updatedData.user_case_type_6.id !== 0
          ? updatedData.user_case_type_6.id
          : undefined,
    };

    Object.keys(payload).forEach((key) => {
      if (payload[key] === undefined) {
        payload[key] = "";
      }
    });
    await saveCaseTypeRoles(payload);
    refetch();
    setShowEditModal(false);
  };

  return (
    <div className="tab-pane fade firm-settings-user-perms-fs active show">
      <div>
        <CommonHeader heading={heading} points={points} />
      </div>
      <TableFirmSettings>
        <thead>
          <tr id="tb-header">
            <th></th>
            <th>Default Case Type User Roles</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data &&
            data?.map((caseType) => (
              <tr key={caseType.id}>
                <td>{caseType.for_case_type.name}</td>
                <td className="td-autosize text-center white-space-inherit">
                  <table>
                    <tbody>
                      {Array.from({ length: 3 }).map((_, index) => (
                        <tr
                          className="transparent-background"
                          id="case-type-role"
                          style={{ height: "35px" }}
                        >
                          <>
                            <td className="transparent-background border-0 case-worker-role">{`Case Worker Role ${index + 1}`}</td>
                            <td className="transparent-background border-0">
                              <span className="badge badge-primary mx-2 padding-5 height-25">
                                {caseType[`user_case_type_${index + 1}`]?.name}
                              </span>
                            </td>
                            <td className="transparent-background border-0 case-worker-role">{`Case Worker Role ${index + 4}`}</td>
                            <td className="transparent-background border-0">
                              <span className="badge badge-primary mx-2 padding-5 height-25">
                                {caseType[`user_case_type_${index + 4}`]?.name}
                              </span>
                            </td>
                          </>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </td>
                <td
                  className="d-flex align-items-center justify-content-end "
                  style={{ height: "105px", marginRight: "10px" }}
                >
                  <button
                    className="btn btn-secondary height-25 d-flex justify-content-center align-items-center"
                    onClick={() => handleEditClick(caseType)}
                  >
                    Edit Case Type User Roles
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </TableFirmSettings>
      <CaseWorkerRoleModal
        show={showEditModal}
        handleClose={() => setShowEditModal(false)}
        caseType={selectedCaseType}
        caseWorkerRoles={caseWorkerRoles}
        onRoleChange={handleRoleChange}
        handleSave={handleSaveRoles}
        modalTitle="Select the Case Worker Roles for Case Workers 1-6 on each Case Type"
        saveButtonText="Save"
      />
    </div>
  );
};

export default CaseTypeRoles;
