import React from "react";
import "../../../../public/BP_resources/css/client-4.css";

const Button = (props) => {
  const containsEmail = (text) => /\S+@\S+\.\S+/.test(text);

  return (
    <div>
      {props.showButton ? (
        <button
        style={{backgroundColor:"var(--primary-10) !important"}}
          className={`mt-1 w-100 ${
            containsEmail(props.buttonText) ? "" : "text-capitalized"
          } btn btn-primary-lighter-2 btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center info_email font-weight-semibold border-button-client`}
        >
          {props.icon && <i className={props.icon}></i>}
          {props.buttonText || ""}
        </button>
      ) : (
        <div style={{backgroundColor:"var(--primary-10) !important"}} className="text-center">{props.text}</div>
      )}
    </div>
  );
};

export default Button;
