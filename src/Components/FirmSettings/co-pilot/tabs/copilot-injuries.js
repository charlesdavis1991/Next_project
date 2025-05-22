import React, { useEffect, useState } from "react";
import useGetCoPilotInjuries, {
  useUpdateCoPilotInjuries,
} from "../hooks/useCoPilotInjuries";

const CoPilotInjuries = () => {
  const { data: getCoPilotInjuries, refetch } = useGetCoPilotInjuries();
  const { updateCoPilotInjuries } = useUpdateCoPilotInjuries();

  const [checkedInjuries, setCheckedInjuries] = useState([]);
  const [prevCheckedInjuries, setPrevCheckedInjuries] = useState([]);

  useEffect(() => {
    if (getCoPilotInjuries) {
      const referenceIds =
        getCoPilotInjuries?.copilot_factors_reference_injuries.map(
          (state) => state.id
        );
      setCheckedInjuries(referenceIds || []);
    }
  }, [getCoPilotInjuries]);

  const handleCheckboxChange = async (injuryId, isChecked) => {
    const updateCheckedInjuries = isChecked
      ? [...checkedInjuries, injuryId]
      : checkedInjuries.filter((id) => id !== injuryId);

    setPrevCheckedInjuries(checkedInjuries);

    setCheckedInjuries(updateCheckedInjuries);

    try {
      const status = isChecked;
      await updateCoPilotInjuries({
        injury_id: injuryId,
        status,
      });
      refetch();
    } catch (error) {
      console.error("API call failed, reverting to previous state", error);
      setCheckedInjuries(prevCheckedInjuries);
    }
  };
  return (
    <div className="col-lg-12">
      <div className="row">
        <div className="copilotstate-columns Nav-state-2-F">
          <ul>
            {getCoPilotInjuries &&
              getCoPilotInjuries?.injuries?.map((injuries) => (
                <li
                  key={injuries.id}
                  className="d-flex m-b-5"
                  style={{ gap: "5px" }}
                >
                  <input
                    className="form-check"
                    type="checkbox"
                    id={injuries.id}
                    value={injuries.id}
                    checked={checkedInjuries.includes(injuries.id)}
                    onChange={(e) =>
                      handleCheckboxChange(injuries.id, e.target.checked)
                    }
                  />
                  {injuries.name}
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CoPilotInjuries;
