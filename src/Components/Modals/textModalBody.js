import React from "react";

const TextModalBody = (props) => {
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
          Send Chat Message to &nbsp;
          <div class="ic ic-29 chat-popup">
            <img
              class="output-3 theme-ring"
              src="/bp_assets/img/avatar_new.svg"
            />
          </div>
          &nbsp; Client Name
        </h5>
      </div>
      <p
        class="p-l-10 p-r-10 p-t-5 p-b-5 client-popup-border text-center"
        id=""
      >
        Your Chat Message for this poup goes here.
      </p>
      <div class="modal-body">
        <div class="btn-group mt-2 ChatB4 justify-content-center" role="group">
          <button
            type="button"
            class="btn btn-primary-lighter btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center p-l-6 p-r-5"
            onclick="updateChatBoxPopUp(this)"
          >
            Testing 1
          </button>
          <button
            type="button"
            class="btn btn-primary-lighter btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center p-l-6 p-r-5 ml-2"
            onclick="updateChatBoxPopUp(this)"
          >
            Testing 2
          </button>
          <button
            type="button"
            class="btn btn-primary-lighter btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center p-l-6 p-r-5 ml-2"
            onclick="updateChatBoxPopUp(this)"
          >
            Testing 3
          </button>
          <button
            type="button"
            class="btn btn-primary-lighter btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center p-l-6 p-r-5 ml-2"
            onclick="updateChatBoxPopUp(this)"
          >
            Testing 4
          </button>
        </div>
        <div class="form-check notification-float-right">
          <input
            class="form-check-input example-checkbox"
            type="checkbox"
            value=""
            id="exampleCheckbox-{{client.client_user.id}}"
            data-firstname="{{client.first_name}} {{client.last_name}}"
            checked
          />
          <label
            class="form-check-label"
            for="exampleCheckbox-{{client.client_user.id}}"
          >
            Include chat subject greeting
          </label>
        </div>
        <label for="w3review mt-3">Chat Subject Greeting:</label>
        <input
          class="custom-text-input notification-border-solid-1px-grey-width-100P-padding-10px"
          type="text"
          value="From the Search Page regarding Kamran Hassan:"
          disabled
        />
        <div>
          <label for="w3review" class="mt-3">
            Type Message:
          </label>
          <textarea
            type="text"
            class="chatMessage notification-border-solid-1px-grey-width-100P-padding-10px"
            name="chatMessage"
            rows="4"
            cols="50"
          ></textarea>
        </div>
      </div>

      <div class="modal-footer notification-padding-2rem">
        <button
          type="button"
          id=""
          class="btn btn-success input-group-text send_btn notification-position-absolute-right-14px-background-color-218838-color-white-border-color-218838 save-btn-popup popup-heading-color"
          data-dismiss="modal"
          onclick="sendMessageClient()"
        >
          Send Chat Message
        </button>
        <button
          type="button"
          class="btn btn-danger  notification-background-color-grey-border-color-grey-position-absolute-left-14px"
          onClick={props.hideModal}
        >
          Close
        </button>
      </div>
    </>
  );
};

export default TextModalBody;
