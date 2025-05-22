import React, { useEffect, useState } from "react";
import useGetLoginTimeout, {
  useSaveLoginTimeout,
} from "../hooks/useLoginTimeOut";
import Button from "../../common/button";

const LoginTimeOutTabTwo = () => {
  const [loginTimeOutValue, setLoginTimeOutValue] = useState();
  const { data, refetch } = useGetLoginTimeout();
  const { saveLoginTimeout } = useSaveLoginTimeout();

  useEffect(() => {
    if (data) {
      setLoginTimeOutValue(data.logout_time);
    }
  }, [data]);
  return (
    <div className="col-lg-12">
      <div className="form-group">
        <div class="col-sm-2">
          <label for="login_timeout_input">Login Timeout:</label>
          <input
            class="form-control"
            type="text"
            name="user_login_timeout"
            id="user_login_timeout"
            value={loginTimeOutValue}
            onChange={(e) => setLoginTimeOutValue(e.target.value)}
          />
          <Button
            text={"Save"}
            className={"btn-success mt-5"}
            onClick={async () => {
              await saveLoginTimeout({
                logout_time: loginTimeOutValue,
              });
              refetch();
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default LoginTimeOutTabTwo;
