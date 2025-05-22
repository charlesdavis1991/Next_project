import React, { useEffect, useState } from "react";
import useGetCoPilotStates, {
  useUpdateCoPilotStates,
} from "../hooks/useCoPilotStates";

const CoPilotStates = () => {
  const { data: getCoPilotStatesData, refetch } = useGetCoPilotStates();
  const { updateCoPilotStates } = useUpdateCoPilotStates();

  const [checkedStates, setCheckedStates] = useState([]);
  const [prevCheckedStates, setPrevCheckedStates] = useState([]);

  useEffect(() => {
    if (getCoPilotStatesData) {
      const referenceStateIds =
        getCoPilotStatesData?.copilot_factors_reference_states.map(
          (state) => state.id
        );
      setCheckedStates(referenceStateIds || []);
    }
  }, [getCoPilotStatesData]);

  const handleCheckboxChange = async (stateId, isChecked) => {
    const updatedCheckedStates = isChecked
      ? [...checkedStates, stateId]
      : checkedStates.filter((id) => id !== stateId);

    setPrevCheckedStates(checkedStates);

    setCheckedStates(updatedCheckedStates);

    try {
      const status = isChecked;
      await updateCoPilotStates({
        state_id: stateId,
        status,
      });
      refetch();
    } catch (error) {
      console.error("API call failed, reverting to previous state", error);
      setCheckedStates(prevCheckedStates);
    }
  };
  return (
    <div className="col-lg-12">
      <div className="row">
        <div className="copilotstate-columns Nav-state-2-F">
          <ul>
            {getCoPilotStatesData &&
              getCoPilotStatesData?.states?.map((state) => (
                <li
                  key={state.id}
                  className="d-flex m-b-5"
                  style={{ gap: "5px" }}
                >
                  <input
                    className="form-check"
                    type="checkbox"
                    id={state.id}
                    value={state.id}
                    checked={checkedStates.includes(state.id)}
                    onChange={(e) =>
                      handleCheckboxChange(state.id, e.target.checked)
                    }
                  />
                  {state.name}
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CoPilotStates;
