import React from "react";

const FlagModalBody = (props) => {
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
          Confirm Flagging
        </h5>
      </div>
      <div class="modal-body">
        <div class="btn-group mt-2 ChatB4 justify-content-center" role="group">
          <p class="p-l-10 p-r-10 p-t-5 p-b-5 text-center" id="">
            You will now be flagging the case. Everyone on the team will be
            notified of the page you are flagging.
          </p>
        </div>
      </div>

      <div class="modal-footer notification-padding-2rem">
        <button type="button" class="btn btn-secondary" data-dismiss="modal" onClick={props.hideModal}>
          Cancel
        </button>
        <button type="button" class="btn btn-success" onClick={props.flagPage}>
          Flag Case
        </button>
      </div>
    </>
  );
};

export default FlagModalBody;
