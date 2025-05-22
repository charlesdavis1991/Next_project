import React from "react";

const InactivityModalBody = (props) => {
  return (
    <>
      <div class="modal-header text-center p-0 bg-primary popup-heading-color justify-content-center">
        <input
          type="hidden"
          id="logged-in-user"
          value="{{client.client_user.id}}"
        />
        <h5
          class="modal-title mx-auto font-size-24 height-35 font-weight-semibold text-uppercase popup-heading-color font-weight-500"
          id="avatarModalTitle"
        >
          Inactivity Warning!
        </h5>
      </div>
      <div class="modal-body">
        <div class="btn-group mt-2 ChatB4 justify-content-center" role="group">
        <p
        class="p-l-10 p-r-10 p-t-5 p-b-5 text-center"
        id=""
      >
        You're about to log out due to inactivity. If you intend to stay logged in, please click below.
      </p>
        </div>
        <p class="text-center"
        >{props.timeoutTime} seconds left</p>
      </div>

      <div style={{ marginTop: "0px", padding: "10px" }} class="modal-footer notification-padding-2rem">
        <button
          type="button"
          id=""
          class="btn btn-success input-group-text send_btn notification-position-relative-center-14px-background-color-218838-color-white-border-color-218838 save-btn-popup popup-heading-color"
          data-dismiss="modal"
          style={{ margin: "0 auto" }}
          onClick={props.hideModal}
        >
          Keep me logged in
        </button>
      </div>
    </>
  );
};

export default InactivityModalBody;
