import React, { useEffect, useRef, useState } from "react";
import { fetchAttorneylist } from "../../Redux/search/actions";
import { useDispatch, useSelector } from "react-redux";
import { addCoCounselingFirm } from "../../Redux/case/actions";
import api from "../../api/api";

const CounsellingModal = ({ setOpen, open, close }) => {
  const [query, setQuery] = useState("");
  const currentCase = useSelector((state) => state?.caseData?.current);
  const client = useSelector((state) => state?.client?.current);
  const coCounselingDataSuccess = useSelector(
    (state) => state?.case.coCounselingData
  );
  const searchAttorneyData = useSelector(
    (state) => state?.search.searchAttorneyData
  );
  const states = useSelector((state) => state?.clientProvider?.states);
  const [searchResults, setSearchResults] = useState([]);
  const [selectItem, setSelectItem] = useState(false);
  const [keysWithoutValues, setKeysWithoutValues] = useState([]);
  const initialFormData = {
    staff_team_id: "",
    attorney_id: "",
    firm_name: "",
    phone: "",
    address_1: "",
    fax: "",
    address_2: "",
    email: "",
    city: "",
    zip: "",
    state: "",
    website_url: "",
    team_data: [],
  };

  const [formData, setFormData] = useState(initialFormData);
  const [selectedAttorney, setSelectedAttorney] = useState(null);
  const dispatch = useDispatch();
  const handleTeamData = (teamData) => {
    const formattedData = [];
    teamData.forEach((team, index) => {
      for (let itm in team) {
        if (typeof team[itm] == "object") {
          const { user } = team[itm];
          formattedData.push({
            staff_team_id: itm?.id,
            ...user,
          });
        }
      }
    });

    return formattedData;
  };

  useEffect(() => {
    if (open) {
      const newDiv = document.createElement("div");
      newDiv.className = "modal-backdrop show";
      document.body.classList.add("modal-open", "has-blurred-bg");
      document.body.appendChild(newDiv);
    }
    return () => {
      const divToRemove = document.querySelector(".modal-backdrop.show");
      document.body.classList.remove("modal-open", "has-blurred-bg");
      if (divToRemove) {
        document.body.removeChild(divToRemove);
      }
    };
  }, [open]);
  // useEffect(() => {
  //   if (attorneyData && attorneyData?.data) {
  //     const { data, attorney_address, team_data } = attorneyData;
  //     setFormData((prev) => ({
  //       ...prev,
  //       staff_team_id: "",
  //       attorney_id: data?.attorneyprofile?.id || "",
  //       firm_name: data?.attorneyprofile?.first_name || "",
  //       phone: attorney_address[0]?.phone || "",
  //       address_1: attorney_address[0]?.address || "",
  //       fax: attorney_address[0]?.fax || "",
  //       address_2: attorney_address[0]?.address2 || "",
  //       email: attorney_address[0]?.email || "",
  //       city: attorney_address[0]?.city || "",
  //       zip: attorney_address[0]?.post_code || "",
  //       state: attorney_address[0]?.state || "",
  //       website_url: "",
  //       team_data: handleTeamData(team_data),
  //     }));
  //   }

  //   if (!selectItem && result) {
  //     setSearchResults(result);
  //   }
  // }, [result, attorneyData]);

  const handleChange = (event) => {
    const { value } = event.target;
    setFormData(initialFormData);
    setQuery(value);
    if (value.length > 0) {
      dispatch(fetchAttorneylist(value, ""));
      setSearchResults(searchAttorneyData);
    } else {
      setSearchResults([]);
    }
    setSelectItem(false);
  };

  const handleSelectAttorney = async (attorney) => {
    setSelectedAttorney(attorney);
    setSearchResults([]);
    setQuery(attorney.attorneyprofile.office_name);
    setSelectItem(true);
    await api
      .get(`/api/SearchAttorney/?query=&attorney_id=${attorney.id}`)
      .then((response) => {
        const res = response.data;
        console.log("res data", res);
        const newData = {
          firm_name: res?.data.attorneyprofile.office_name || "",
          phone: res?.attorney_address[0].phone || "",
          phone: res?.attorney_address[0].phone || "",
          address_1: res?.attorney_address[0].address || "",
          fax: res?.attorney_address[0].fax || "",
          address_2: res?.attorney_address[0].address2 || "",
          email: res?.attorney_address[0].email || "",
          city: res?.attorney_address[0].city || "",
          zip: res?.attorney_address[0].post_code || "",
          state: res?.attorney_address[0].state || "",
          website_url: res?.website_url || "",
          team_data: [],
        };

        if (res?.team_data[0]) {
          Object.entries(res?.team_data[0]).map(([key, value]) => {
            if (key.includes("firm_user") && value) {
              // console.log(key, value);
              const tempUser = {
                first_name: value?.user.first_name,
                last_name: value?.user.last_name,
                email: value?.user.email,
              };
              newData.team_data.push(tempUser);
            }
          });
        }
        setFormData(newData);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleTeamInputChange = (index, event) => {
    const { name, value } = event.target;
    const newTeamData = [...formData.team_data];
    newTeamData[index] = { ...newTeamData[index], [name]: value };
    setFormData({ ...formData, team_data: newTeamData });
  };

  const handleSubmit = () => {
    const state_id = formData?.state?.id;
    const requiredFields = [
      "firm_name",
      "address_1",
      "city",
      "state",
      "zip",
      "phone",
      "fax",
      "email",
    ];

    const keys = Object.keys(formData);
    const keysWithoutVal = keys.filter((key) => {
      const value = formData[key];
      return value === undefined || value === null || value === "";
    });
    setKeysWithoutValues(keysWithoutVal);

    if (
      requiredFields.every(
        (field) => formData[field] && formData.team_data.length >= 1
      )
    ) {
      const new_payload = {
        firm_name: formData?.firm_name || "",
        address_1: formData?.address_1 || "",
        address_2: formData?.address_2 || "",
        city: formData?.city || "",
        state: state_id || "", // Ensure state_id is also handled
        zip: formData?.zip || "",
        phone: formData?.phone || "",
        fax: formData?.fax || "",
        email: formData?.email || "",
        website_url: formData?.website_url || "",
        attorney_id: formData?.attorney_id?.toString() || "",
        staff_team_id:
          formData?.staff_team_id ||
          formData?.team_data[0]?.staff_team_id ||
          "",
      };
      formData.team_data.forEach((team_member, index) => {
        const i = index + 1;
        new_payload[`user_first_name_${i}`] = team_member?.first_name || "";
        new_payload[`user_last_name_${i}`] = team_member?.last_name || "";
        new_payload[`user_email_${i}`] = team_member?.email || "";
      });

      // for (
      //   let i = formData.team_data?.length ? formData.team_data.length + 1 : 1;
      //   i <= 6;
      //   i++
      // ) {
      //   new_payload[`user_first_name_${i}`] = `User${i}FirstName`;
      //   new_payload[`user_last_name_${i}`] = `User${i}LastName`;
      //   new_payload[`user_email_${i}`] = `user${i}@example.com`;
      // }

      if (currentCase && client) {
      }
      // console.log(new_payload, client?.id, currentCase?.id);
      dispatch(
        addCoCounselingFirm({
          ...new_payload,
          client_id: client?.id || 3,
          case_id: currentCase?.id || 2,
        })
      );
      if (coCounselingDataSuccess.Success && close) {
        close("counsellingOpen");
      }
    } else {
      console.log(
        "missing fields",
        requiredFields.filter((field) => !formData[field])
      );
      alert("Please fill all the required fields");
    }
  };

  // useEffect(() => {
  //   console.log("formData ", formData);
  // }, [formData]);

  return (
    <div
      className={`modal ${open ? "d-block" : "d-none"}`}
      tabIndex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden={!open}
    >
      <div
        className="modal-dialog modal-lg modal-dialog-centered modal-dialog-1 modal-dialog-4-max-width"
        role="document"
      >
        <div className="modal-content ">
          <div
            className="modal-header text-center p-0 bg-primary--1 popup-heading-color justify-content-center"
            style={{ backgroundColor: "#19395f" }}
          >
            <h5
              className="modal-title mx-auto font-size-24 height-35 font-weight-semibold text-uppercase font-weight-500 d-flex align-items-center ACF-bg"
              id="exampleModalLabel"
            >
              Add Co-counselling Firm
            </h5>
          </div>
          {/* {keysWithoutValues.length > 0 && (
            <div className={show ? "px-3 py-2" : ""}>
              <Alert
                variant="danger"
                onClose={() => setShow(false)}
                dismissible
              >
                <Alert.Heading>Following Field are required</Alert.Heading>
                <ul className="list-style-disc pl-3">
                  {keysWithoutValues.map((item, index) => {
                    return <li key={index}>{item}</li>;
                  })}
                </ul>
              </Alert>
            </div>
          )} */}
          <form>
            <div className="modal-body">
              <div className="row align-items-center row-gap mb-3">
                <div className="col-md-12">
                  <div className="d-flex align-items-center">
                    <label className="custom-Gap">Type to Search: &nbsp;</label>
                    <div className="w-100">
                      <input
                        type="text"
                        id="cascade"
                        className="form-control no-bootstrap-focus no-bootstrap-effect"
                        value={query}
                        onChange={handleChange}
                        autoComplete="off"
                      />
                      <div
                        className="w-50"
                        style={{ position: "absolute", zIndex: 111 }}
                      >
                        {searchResults && (
                          <ul
                            className={`w-100 list-group ${
                              searchResults.length > 0 ? "has-suggestions" : ""
                            }`}
                          >
                            {searchResults.map((attorney) => (
                              <li
                                key={attorney.id}
                                className="list-group-item"
                                onClick={() => handleSelectAttorney(attorney)}
                              >
                                {attorney.attorneyprofile.office_name}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="row align-items-center row-gap">
                  <input
                    type="hidden"
                    name="staff_team_id"
                    value={formData?.staff_team_id}
                    id="staff_team_id"
                    className="form-control no-bootstrap-focus no-bootstrap-effect"
                    onChange={handleInputChange}
                  />
                  <input
                    type="hidden"
                    name="attorney_id"
                    value={formData?.attorney_id}
                    id="attorney_id"
                    className="form-control no-bootstrap-focus no-bootstrap-effect"
                    onChange={handleInputChange}
                  />
                  <div className="col-md-8 Co-Cons-MB_3">
                    <div className=" d-flex align-items-center">
                      <label for="l-name" className="custom-Gap-2F">
                        Firm Name:&nbsp;
                      </label>
                      <input
                        required
                        name="firm_name"
                        value={formData.firm_name || ""}
                        id="l-name"
                        className="form-control no-bootstrap-focus no-bootstrap-effect autofill col-md-8"
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-4 Co-Cons-MB_3">
                    <div className="d-flex justify-content-end align-items-center">
                      <label for="phone" className="custom-Gap">
                        Phone:&nbsp;
                      </label>
                      <input
                        required
                        id="phone"
                        name="phone"
                        value={formData?.phone}
                        className="form-control no-bootstrap-focus no-bootstrap-effect autofill col-md-10"
                        type="text"
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-8 Co-Cons-MB_3 ">
                    <div className="d-flex align-items-center">
                      <label for="address" className="custom-Gap">
                        Address 1:&nbsp;
                      </label>
                      <input
                        required
                        name="address_1"
                        value={formData?.address_1}
                        id="address"
                        className="form-control no-bootstrap-focus no-bootstrap-effect autofill col-md-8"
                        type="text"
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-4 Co-Cons-MB_3 ">
                    <div className="d-flex justify-content-end align-items-center">
                      <label for="fax" className="custom-Gap">
                        Fax:&nbsp;
                      </label>
                      <input
                        required
                        name="fax"
                        value={formData?.fax}
                        id="fax"
                        className="form-control no-bootstrap-focus no-bootstrap-effect autofill col-md-10"
                        type="text"
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-8 Co-Cons-MB_3 ">
                    <div className=" d-flex align-items-center">
                      <label for="address2" className="custom-Gap-3A">
                        Address 2:&nbsp;
                      </label>
                      <input
                        required
                        name="address_2"
                        value={formData?.address_2}
                        id="address2"
                        className="form-control no-bootstrap-focus no-bootstrap-effect autofill col-md-8"
                        type="text"
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-4 Co-Cons-MB_3 ">
                    <div className="d-flex justify-content-end align-items-center">
                      <label for="email" className="custom-Gap">
                        Email:&nbsp;
                      </label>
                      <input
                        required
                        name="email"
                        value={formData?.email}
                        id="email"
                        className="form-control no-bootstrap-focus no-bootstrap-effect autofill col-md-10"
                        type="email"
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-3 Co-Cons-MB_3">
                    <div className=" d-flex align-items-center">
                      <label for="city" className="custom-Gap-4C">
                        City:&nbsp;
                      </label>
                      <input
                        required
                        name="city"
                        value={formData?.city}
                        id="city"
                        className="form-control no-bootstrap-focus no-bootstrap-effect autofill"
                        type="text"
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-2 zip-pos Co-Cons-MB_3 ">
                    <div className="custom-form-field d-flex align-items-center">
                      <label for="zip" className="zip-align-2">
                        Zip: &nbsp;
                      </label>
                      <input
                        required
                        name="zip"
                        value={formData?.zip}
                        id="zip"
                        className="zip-align-1 form-control no-bootstrap-focus no-bootstrap-effect autofill"
                        type="text"
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-2 state-pos Co-Cons-MB_3 ">
                    <div className=" d-flex align-items-center">
                      <label for="state" className="state-text">
                        State:
                      </label>
                      <select
                        required
                        className="form-select autofill state-dd no-bootstrap-focus no-bootstrap-effect"
                        name="state"
                        id="state"
                        onChange={handleInputChange}
                      >
                        {states?.map((state) => (
                          <option
                            value={state?.id}
                            selected={state?.id === formData?.state?.id}
                          >
                            {state?.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-12 ">
                    <div className=" d-flex align-items-center">
                      <label for="website_url" className="custom-Gap">
                        Website URL:
                      </label>
                      <input
                        name="website_url"
                        value={formData?.website_url}
                        id="web"
                        className="form-control no-bootstrap-focus no-bootstrap-effect autofill"
                        type="text"
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="modal-content">
                    <div className="Firm-info ">
                      <h3
                        className="bg-clr-Input-User mt-1"
                        style={{
                          textAlign: "center",
                          color: "#19395f",
                          fontWeight: "600",
                        }}
                      >
                        Input User Information for the Firm:
                      </h3>
                      <p className="col-md-12 Co-Cons-MB_15">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Vestibulum vehicula, tortor in condimentum volutpat,
                        felis lorem tincidunt est, et ultrices metus neque at
                        nisl. Proin luctus nec justo ac interdum. Phasellus
                        laoreet ipsum vel dui blandit, in vulputate urna semper.
                        Sed auctor facilisis libero, ac ultrices metus gravida
                        sit amet. Integer id odio nec eros pellentesque
                        ultrices.
                      </p>
                      <p>
                        <br />
                      </p>
                    </div>
                  </div>
                  {[1, 2, 3, 4, 5, 6].map((itm, index) => {
                    const team = formData?.team_data[index];
                    return (
                      <div key={index} style={{ display: "flex" }}>
                        <div className="col-md-4 Co-Cons-MB_3">
                          <div className="d-flex align-items-center">
                            <label
                              htmlFor={`u-f-name-${index}`}
                              className="custom-Gap"
                            >
                              First Name: &nbsp; &nbsp;
                            </label>
                            <input
                              required
                              name="first_name"
                              value={team?.first_name || ""}
                              id={`u-f-name-${index}`}
                              className="col-md-4 form-control no-bootstrap-focus no-bootstrap-effect autofill-team"
                              type="text"
                              onChange={(e) => handleTeamInputChange(index, e)}
                            />
                          </div>
                        </div>
                        <div className="col-md-4 Co-Cons-MB_3">
                          <div className="d-flex align-items-center">
                            <label
                              htmlFor={`u-l-name-${index}`}
                              className="custom-Gap"
                            >
                              Last Name:&nbsp; &nbsp;
                            </label>
                            <input
                              required
                              name="last_name"
                              value={team?.last_name || ""}
                              id={`u-l-name-${index}`}
                              className="col-md-4 form-control no-bootstrap-focus no-bootstrap-effect autofill-team"
                              type="text"
                              onChange={(e) => handleTeamInputChange(index, e)}
                            />
                          </div>
                        </div>
                        <div className="col-md-4 Co-Cons-MB_3">
                          <div className="d-flex align-items-center">
                            <label
                              htmlFor={`u-email-${index}`}
                              className="custom-Gap"
                            >
                              Email: &nbsp; &nbsp;
                            </label>
                            <input
                              required
                              name="email"
                              value={team?.email || ""}
                              id={`u-email-${index}`}
                              className="form-control no-bootstrap-focus no-bootstrap-effect autofill-team"
                              type="email"
                              onChange={(e) => handleTeamInputChange(index, e)}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}{" "}
                </div>
              </div>
            </div>
            <div className="modal-footer border-0 justify-content-between">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setOpen(false)}
                data-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-success"
                onClick={handleSubmit}
              >
                Add Co-Counselling Firm
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CounsellingModal;
