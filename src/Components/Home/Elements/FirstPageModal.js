import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

function FirstPageModal({ homePageCurrent, lastAccessedCurrent }) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const home_login = watch("home_login");
  const [selected , setSelected] = useState(null)

  useEffect(()=> {
    home_login ? setSelected(1) : setSelected(2)
  },[home_login])


  return (
    <>
      <div className="home-form-container">
       
        <div
          className={`radio-option ${selected ===1 ? "selected" : ""}`}
          onClick={() => {
            setValue("home_login", true);
            setSelected(1)
          }}
        >
          <input
            type="radio"
            {...register("home_login")}
            className="radio-input"

            readOnly
          />
          <div className={`radio-circle ${selected ===1 ? "checked" : ""}`}></div>
          <span>Home Page</span>
        </div>

        <div
          className={`radio-option ${selected ===2 ? "selected" : ""}`}
          onClick={() => {
            setValue("home_login", false);
            setSelected(2)
          }}
        >
          <input
            type="radio"
            className="radio-input"
            readOnly
          />
          <div
            className={`radio-circle ${selected ===2 ? "checked" : ""}`}
          ></div>
          <span>Last Accessed Page</span>
        </div>

      </div>
    </>
  );
}

export default FirstPageModal;
