import React, { useEffect, useState } from "react";
import useGetShakespare, {
  useSaveShakespareStatus,
} from "./hooks/useGetShakespareStatus";
import Button from "../common/button";
import CommonHeader from "../common/common-header";

const Shakespare = () => {
  const heading = "FIRM SETTINGS TITLE WITH CENTERED TEXT";
  const points = [
    "1. Firm settings panel instruction point one",
    "2. Firm settings panel instruction point two",
    "3. Firm settings panel instruction point three",
  ];
  const [shakespareState, setShakespareState] = useState();

  const handleShakespareState = (e) => {
    setShakespareState(e.target.value);
  };

  const { data, refetch } = useGetShakespare();
  const { saveShakespareStatus } = useSaveShakespareStatus();
  const shakespareVal = [
    { value: "On", name: "On" },
    { value: "Off", name: "Off" },
  ];

  useEffect(() => {
    if (data && data?.shakespeare_status) {
      setShakespareState("On");
    } else {
      setShakespareState("Off");
    }
  }, [data]);
  return (
    <div className="tab-pane fade firm-settings-user-perms-fs active show">
      <div>
        <CommonHeader heading={heading} points={points} />
      </div>
      <div className="col-lg-12">
        <h3 className="mt-5 mb-3">Shakespare Settings</h3>
        <div className="form-group">
          <div className="col-sm-2">
            <label>Shakespare Status: </label>
            <select
              className="form-control m-r-5"
              value={shakespareState}
              onChange={handleShakespareState}
            >
              <option value="">Select Shakespare Status</option>
              {shakespareVal.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.name}
                </option>
              ))}
            </select>
            <Button
              text={"Save"}
              className={"btn-success mt-5"}
              onClick={async () => {
                await saveShakespareStatus({
                  shakespeare_status: shakespareState,
                });
                refetch();
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shakespare;
