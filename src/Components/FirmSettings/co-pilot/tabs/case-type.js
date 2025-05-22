import React, { useEffect, useState } from "react";
import useGetCoPilotCaseTypes, {
  useUpdateCoPilotCaseTypes,
} from "../hooks/useCoPilotCaseTypes";
import TableFirmSettings from "../../common/table-firm-settings";
import "./case-type.css";

const CaseTypes = () => {
  const { data: getCoPilotCaseTypes, refetch } = useGetCoPilotCaseTypes();
  const { updateCoPilotCaseType } = useUpdateCoPilotCaseTypes();

  const [checkedCaseType, setCheckCaseTypes] = useState([]);
  const [prevCheckedCaseTypes, setPrevCheckedCaseTypes] = useState([]);

  useEffect(() => {
    if (getCoPilotCaseTypes) {
      const referenceIds =
        getCoPilotCaseTypes?.copilot_factors_reference_case_type.map(
          (state) => state.id
        );
      setCheckCaseTypes(referenceIds || []);
    }
  }, [getCoPilotCaseTypes]);

  const handleCheckboxChange = async (case_id, isChecked) => {
    const updateCheckCaseType = isChecked
      ? [...checkedCaseType, case_id]
      : checkedCaseType.filter((id) => id !== case_id);

    setPrevCheckedCaseTypes(checkedCaseType);

    setCheckCaseTypes(updateCheckCaseType);

    try {
      const status = isChecked;
      await updateCoPilotCaseType({
        case_type_id: case_id,
        status,
      });
      refetch();
    } catch (error) {
      console.error("API call failed, reverting to previous state", error);
      setCheckCaseTypes(prevCheckedCaseTypes);
    }
  };
  return (
    <div className="col-lg-12">
      <div className="row">
        <div className="Dog-bite-T-F table-responsive table--no-card m-b-20 table-img">
          <TableFirmSettings>
            <thead>
              <tr></tr>
            </thead>
            <tbody>
              {getCoPilotCaseTypes &&
                getCoPilotCaseTypes?.case_types?.map((case_type) => (
                  <tr
                    className="d-flex align-items-center"
                    style={{ height: "35px" }}
                    key={case_type.id}
                  >
                    <td className="w-100" id="table-case-type-css">
                      {case_type.name}
                    </td>
                    <td
                      className="d-flex align-items-center"
                      id="table-case-type-css"
                    >
                      <input
                        className="form-check"
                        type="checkbox"
                        id={case_type.id}
                        value={case_type.id}
                        checked={checkedCaseType.includes(case_type.id)}
                        onChange={(e) =>
                          handleCheckboxChange(case_type.id, e.target.checked)
                        }
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </TableFirmSettings>
        </div>
      </div>
    </div>
  );
};

export default CaseTypes;
