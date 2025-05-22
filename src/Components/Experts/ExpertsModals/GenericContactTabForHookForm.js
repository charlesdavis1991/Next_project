import React from "react";
import { useFormContext } from "react-hook-form";

const GenericContactTabForHookForm = ({ statesAbrs , selectedState }) => {

   //Rk20243005240
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const formatNumber = (value) => {
    if (!value) return value;

    const phoneNumber = value.replace(/[^\d]/g, "");
    const phoneNumberLength = phoneNumber.length;

    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };

  const handlePhoneInputChange = (event) => {
    const formattedValue = formatNumber(event.target.value);
    setValue("phone", formattedValue, { shouldValidate: true });
  };

  const handleFaxInputChange = (event) => {
    const formattedValue = formatNumber(event.target.value);
    setValue("fax", formattedValue, { shouldValidate: true });
  };

  const phoneValue = watch("phone");
  const faxValue = watch("fax")

  return (
    <>
      <div className="row align-items-center form-group">
        <div className="col-md-2 text-left">
          <span className="d-inline-block text-grey">Address 1:</span>
        </div>
        <div className="col-md-10">
          <input
            type="text"
            placeholder="Enter Address 1"
            className="form-control"
            {...register("address")
              
            }
          />
        </div>
      </div>

      <div className="row align-items-center form-group">
        <div className="col-md-2 text-left">
          <span className="d-inline-block text-grey">Address 2:</span>
        </div>
        <div className="col-md-10">
          <input
            type="text"
            placeholder="Enter Address 2"
            className="form-control"
            {...register("address1")}
          />
        </div>
      </div>

      <div className="row align-items-center form-group">
        <div className="col-md mb-md-3 d-md-flex">
          <span className="d-inline-block white-space-nowrapping text-grey align-self-center MR-63-Px">
            City:
          </span>
          <input
            type="text"
            placeholder="Enter City"
            className="form-control col-md-8"
            {...register("city")}
          />
        </div>
        <div className="col-md mb-md-3 d-md-flex ml-md-3">
          <span className="d-inline-block white-space-nowrapping text-grey align-self-center p-0 pl-md-3 pr-md-3 col-md-5">
            State:
          </span>
          <select
            name="state"
            className="form-select form-control col-md-9"
            {...register("state")}
          >
            {statesAbrs &&
              statesAbrs.map((state) => (
                <option key={state.id} selected={state.StateAbr ===selectedState} value={state.StateAbr}>
                  {state.name}
                </option>
              ))}
          </select>
        </div>
        <div className="col-md d-md-flex mb-3">
          <span className="d-inline-block white-space-nowrapping text-grey align-self-center p-0 pl-md-3 pr-md-3 col-md-4">
            Zip:
          </span>
          <input
            type="text"
            placeholder="Enter Zip"
            className="form-control col-md-8"
            {...register("zip_code")}
          />
        </div>
      </div>

      <div className="row align-items-center form-group">
        <div className="col-md-2 text-left">
          <span className="d-inline-block text-grey">Phone:</span>
        </div>
        <div className="col-md-10">
          {/* <input type="number" placeholder="(###) ###-####" className="form-control" {...register("phone")} /> */}
          <input
            type="text"
            placeholder="(###) ###-####"
            className="form-control"
            {...register("phone", {
             
              // pattern: {
              //   value: /^\(\d{3}\) \d{3}-\d{4}$/,
              //   message: "Invalid phone number format please correct the format",
              // },
            })}
            value={phoneValue || ""}
            onChange={handlePhoneInputChange}
          />
          {errors.phone && <p style={{color:"red"}}>{errors.phone.message}</p>}
        </div>
      </div>

      <div className="row align-items-center form-group">
        <div className="col-md-2 text-left">
          <span className="d-inline-block text-grey">Extension:</span>
        </div>
        <div className="col-md-10">
          <input
            type="number"
            placeholder="Extension"
            className="form-control"
            {...register("extension")}
          />
        </div>
      </div>

      <div className="row align-items-center form-group">
        <div className="col-md-2 text-left">
          <span className="d-inline-block text-grey">Fax:</span>
        </div>
        <div className="col-md-10">
          <input
            type="text"
            placeholder="(###) ###-####"
            className="form-control"
            {...register("fax", {
             
                // pattern: {
                //   value: /^\(\d{3}\) \d{3}-\d{4}$/,
                //   message: "Invalid Fax number format or correct the fax format",
                // },
              })}
              value={faxValue || ""}
              onChange={handleFaxInputChange}
          />
          {errors.fax && <p style={{color:"red"}} >{errors.fax.message}</p>}
        </div>
      </div>

      <div className="row align-items-center form-group">
        <div className="col-md-2 text-left">
          <span className="d-inline-block text-grey">Email:</span>
        </div>
        <div className="col-md-10">
          <input
            type="email"
            placeholder="Enter Email"
            className="form-control"
            {...register("email")}
          />
        </div>
      </div>
    </>
  );
};

export default GenericContactTabForHookForm;
