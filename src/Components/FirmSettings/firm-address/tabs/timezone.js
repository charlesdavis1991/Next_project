import React from "react";

const TimeZoneTabThree = () => {
  return (
    <div className="col-lg-12">
      <div className="form-group">
        <div class="col-sm-2">
          <label for="login_timeout_input">Timezone:</label>
          <input
            class="form-control"
            type="text"
            name="user_timezone"
            disabled={true}
            id="user_timezone"
            value={"(HST)"}
          />
        </div>
      </div>
    </div>
  );
};

export default TimeZoneTabThree;
