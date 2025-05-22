import React, { useEffect, useState } from "react";
import useGetCoPilot, {
  useGetCoPilotUserControls,
  useUpdateCoPilot,
  useUpdateUserControl,
} from "../hooks/useCoPilotSettings";
import TableFirmSettings from "../../common/table-firm-settings";

const CoPilotSettings = () => {
  const { data: getCoPilot, refetch } = useGetCoPilot();
  const { updateCoPilot } = useUpdateCoPilot();
  const { data: getCoPilotUserControls, refetch: refetchUserControls } =
    useGetCoPilotUserControls();
  const { updateUserControl } = useUpdateUserControl();

  const [coPilotEnable, setCoPilotEnable] = useState(false);
  const [doCoPilot, setDoCoPilot] = useState(false);
  const [userControlState, setUserControlState] = useState([]);

  useEffect(() => {
    if (getCoPilot) {
      setCoPilotEnable(getCoPilot.co_pilot_enable);
      setDoCoPilot(getCoPilot.do_copilot);
    }
  }, [getCoPilot]);

  useEffect(() => {
    if (getCoPilotUserControls) {
      setUserControlState(getCoPilotUserControls);
    }
  }, [getCoPilotUserControls]);

  const handleCoPilotEnableChange = async (e) => {
    const value = e.target.value === "enable";
    setCoPilotEnable(value);

    await updateCoPilot({
      co_pilot_enable: value,
      do_copilot: doCoPilot,
    });
    refetch();
  };

  const handleDoCoPilotChange = async (e) => {
    const checked = e.target.checked;
    console.log(checked);
    setDoCoPilot(checked);

    await updateCoPilot({
      co_pilot_enable: coPilotEnable,
      do_copilot: checked,
    });
    refetch();
  };

  const handleUserControlChange = async (staffId, field, value) => {
    const updatedUserControlState = userControlState?.map((userControl) =>
      userControl?.user?.id === staffId
        ? {
            ...userControl,
            for_copilot: {
              ...(userControl.for_copilot || {}),
              [field]: value,
            },
          }
        : userControl
    );

    setUserControlState(updatedUserControlState);
    const currentUserControl = updatedUserControlState?.find(
      (userControl) => userControl?.user?.id === staffId
    );
    const chat_contact = currentUserControl?.for_copilot?.chat_contact || false;
    const approve_firm = currentUserControl?.for_copilot?.approve_firm || false;

    const payload = {
      staff_id: staffId,
      chat_contact,
      approve_firm,
    };

    await updateUserControl(payload);

    refetchUserControls();
  };

  return (
    <div className="col-lg-12">
      <h3 className="margin-left_-15 m-b-5">Co Pilot</h3>
      <div className="row">
        <div className="d-flex align-items-center justify-content-between col-lg-12">
          <div className="form-check mb-2 ml-2">
            <input
              className="form-check"
              type="radio"
              name="coPilotEnable"
              value="enable"
              checked={coPilotEnable}
              onChange={handleCoPilotEnableChange}
            />
            <label className="form-check mb-0" htmlFor="enable">
              Enable
            </label>
          </div>
          <div className="form-check mb-2 ml-2">
            <input
              className="form-check"
              type="radio"
              name="coPilotEnable"
              value="disable"
              checked={!coPilotEnable}
              onChange={handleCoPilotEnableChange}
            />
            <label className="form-check mb-0" htmlFor="disable">
              Disable
            </label>
          </div>
          <div className="form-check mb-2 ml-2">
            <input
              className="form-check"
              type="checkbox"
              id="doCoPilot"
              checked={doCoPilot}
              onChange={handleDoCoPilotChange}
            />
            <label className="form-check mb-0" htmlFor="doCoPilot">
              Do CoPilot
            </label>
          </div>
        </div>
        <div className="col-lg-12">
          <TableFirmSettings>
            <thead>
              <tr id="copilot-h">
                <th></th>
                <th>Firm User</th>
                <th>Chat Contact</th>
                <th>Approve Firm</th>
              </tr>
            </thead>
            <tbody>
              {userControlState &&
                userControlState?.map((user_controls, idx) => (
                  <tr style={{ height: "35px" }}>
                    <td className="td-autosize text-center m-r-5 m-l-5">
                      {idx + 1}
                    </td>
                    <td className="td-autosize">
                      <span className="d-flex align-items-center ml-3">
                        {user_controls?.profile_pic_29p ? (
                          <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img ">
                            <img
                              id="output"
                              className="output-8 output-3 theme-ring border-color-primary-50"
                              src={user_controls?.profile_pic_29p}
                            />
                          </span>
                        ) : (
                          <span className="ic ic-29 ic-avatar"></span>
                        )}
                        <span className="m-l-5" style={{ fontSize: "14px" }}>
                          {user_controls?.user?.first_name}{" "}
                          {user_controls?.user?.last_name}
                        </span>
                      </span>
                    </td>
                    <td
                      style={{ height: "35px" }}
                      className="d-flex align-items-center justify-content-center"
                    >
                      <input
                        checked={user_controls?.for_copilot?.chat_contact}
                        className="form-check"
                        type="checkbox"
                        onChange={(e) =>
                          handleUserControlChange(
                            user_controls?.user?.id,
                            "chat_contact",
                            e.target.checked
                          )
                        }
                      />
                    </td>
                    <td>
                      <input
                        checked={user_controls?.for_copilot?.approve_firm}
                        className="form-check"
                        type="checkbox"
                        style={{
                          marginLeft: "50%",
                          transform: "translateX(-50%)",
                        }}
                        onChange={(e) =>
                          handleUserControlChange(
                            user_controls?.user?.id,
                            "approve_firm",
                            e.target.checked
                          )
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

export default CoPilotSettings;
