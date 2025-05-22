import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import axios from "axios";

const Provider = forwardRef((props, ref) => {
  const {
    handleClose,
    location,
    setLocation,
    caseProvider,
    setcaseProvidersList,
    specialitie,
    setSpecialitiesList,
  } = props;
  const origin = process.env.REACT_APP_BACKEND_URL;
  const [locationID, setLocationID] = useState(location?.id);
  const [address, setAddress] = useState(location?.address);
  const [address2, setAddress2] = useState(location?.address2);
  const [city, setCity] = useState(location?.city);
  const [state, setState] = useState(location?.state);
  const [postCode, setPostCode] = useState(location?.post_code);
  const [phone, setPhone] = useState(location?.phone);
  const [fax, setFax] = useState(location?.fax);
  const [email, setEmail] = useState(location?.email);
  const [website, setWebsite] = useState(location?.website);
  const [providerName, setProviderName] = useState(
    caseProvider?.providerprofile_office_name
  );
  const [specialityId, setSpecialityId] = useState(caseProvider?.specialty);
  const [allSpecialitiesList, setAllSpecialitiesList] = useState([]);

  useEffect(() => {
    async function fetchAllSpecialitiesList() {
      const { data } = await axios.get(
        `${origin}/api/treatment/all-specialities/`
      );
      console.log(data);
      setAllSpecialitiesList(data);
    }
    fetchAllSpecialitiesList();
  }, []);

  async function fetchSpecialities() {
    const { data } = await axios.get(
      origin + "/api/treatment/specialities/" + caseProvider?.for_case + "/"
    );
    console.log(data);
    setSpecialitiesList(data);
  }

  async function fetchCaseProviders() {
    const { data } = await axios.get(
      origin + "/api/treatment/case-providers/" + caseProvider?.for_case + "/"
    );
    setcaseProvidersList(data);
  }

  useImperativeHandle(ref, () => ({
    save: async () => {
      if (!providerName.trim()) {
        alert("Required field cannot be blank.");
        return;
      }
      try {
        const response = await axios.post(
          `${origin}/api/treatment/edit-provider/`,
          {
            provider_name: providerName,
            provider_specialty: specialityId,
            location_id: locationID,
            location_address1: address,
            location_address2: address2,
            location_city: city,
            location_state: state,
            location_phone: phone,
            location_zip: postCode,
            location_fax: fax,
            location_email: email,
            location_website: website,
            case_provider_id: caseProvider?.id,
          }
        );
        console.log(response, "<<<<<<<<<<<<<");
        if (response.data) {
          setLocation(response.data);
        }

        setcaseProvidersList((prevProviders) =>
          prevProviders.map((provider) =>
            provider.id === caseProvider?.id
              ? {
                  ...provider,
                  providerprofile_office_name: providerName,
                  specialty: specialityId,
                }
              : provider
          )
        );

        if (specialitie?.id != specialityId) {
          await fetchSpecialities();
          await fetchCaseProviders();
        }

        handleClose();
      } catch (error) {
        console.error("Error:", error);
      }
    },
  }));

  return (
    <div
      className="tab-pane fade show active"
      id="provider-tab"
      role="tabpanel"
      aria-labelledby="provider-link"
    >
      <form id="editClientForm2_provider">
        <div className="row align-items-center form-group">
          <div className="col-md-2 text-left">
            <span className="d-inline-block text-grey">Provider Name*</span>
          </div>
          <div className="col-md-10">
            <input
              type="text"
              value={providerName}
              onChange={(e) => setProviderName(e.target.value)}
              placeholder="Enter name"
              className="form-control"
              id="provider_name"
            />
          </div>
        </div>
        <div className="row align-items-center form-group">
          <div className="col-md-2 text-left">
            <span className="d-inline-block text-grey">Specialty</span>
          </div>
          <div className="col-md-10">
            <select
              name="provider_specialty"
              onChange={(e) => setSpecialityId(e.target.value)}
              value={specialityId}
              id="provider_specialty"
              className="form-select form-control"
            >
              {allSpecialitiesList.map((sp) => (
                <option value={sp.id}>{sp.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="row align-items-center form-group">
          <div className="col-md-2 text-left">
            <span className="d-inline-block text-grey">
              <nobr>Addr. 1</nobr>
            </span>
          </div>
          <div className="col-md-10">
            <input
              type="text"
              placeholder="Enter Address 1"
              className="form-control"
              name="location_address1"
              id="location_address1"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
        </div>

        <div className="row align-items-center form-group">
          <div className="col-md-2 text-left">
            <span className="d-inline-block text-grey">
              <nobr>Addr. 2</nobr>
            </span>
          </div>
          <div className="col-md-10">
            <input
              type="text"
              placeholder="Enter Address 2"
              className="form-control"
              name="location_address2"
              id="location_address2"
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
            />
          </div>
        </div>

        <div className="row align-items-center form-group">
          <div className="col-md-2 text-left">
            <span className="d-inline-block white-space-no-wrapping text-grey align-self-center T-MR-40-Px">
              City
            </span>
          </div>

          <div className="col-md-2 text-left">
            <input
              type="text"
              placeholder="Enter City"
              className="form-control col-md-9"
              name="location_city"
              id="location_city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div className="col-md-2 text-left">
            <span className="d-inline-block white-space-nowrapping text-grey align-self-center p-0 pl-md-3 pr-md-3 col-md-3">
              State
            </span>
          </div>

          <div className="col-md-3 text-left">
            <select
              name="location_state"
              id="location_state"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="form-select form-control  col-md-9"
            >
              <option value="CA">California</option>
              <option value="IL">Illinois</option>
              <option value="TX">Texas</option>
              <option value="AZ">Arizona</option>
              <option value="FL">Florida</option>
              <option value="NY">New York</option>
              <option value="WA">Washington</option>
              <option value="NV">Nevada</option>
              <option value="MI">Michigan</option>
              <option value="MA">Massachusetts</option>
              <option value="PA">Pennsylvania</option>
              <option value="OH">Ohio</option>
              <option value="MN">Minnesota</option>
              <option value="VA">Virginia</option>
              <option value="UT">Utah</option>
              <option value="NC">North Carolina</option>
              <option value="MD">Maryland</option>
              <option value="GA">Georgia</option>
              <option value="MO">Missouri</option>
              <option value="HI">Hawaii</option>
              <option value="IN">Indiana</option>
              <option value="WI">Wisconsin</option>
              <option value="CT">Connecticut</option>
              <option value="TN">Tennessee</option>
              <option value="NJ">New Jersey</option>
              <option value="OR">Oregon</option>
              <option value="OK">Oklahoma</option>
              <option value="KY">Kentucky</option>
              <option value="CO">Colorado</option>
              <option value="DC">District of Columbia</option>
              <option value="NM">New Mexico</option>
              <option value="AL">Alabama</option>
              <option value="RI">Rhode Island</option>
              <option value="KS">Kansas</option>
              <option value="NE">Nebraska</option>
              <option value="DE">Delaware</option>
              <option value="SC">South Carolina</option>
              <option value="IA">Iowa</option>
              <option value="ID">Idaho</option>
              <option value="LA">Louisiana</option>
              <option value="NH">New Hampshire</option>
              <option value="AR">Arkansas</option>
              <option value="AK">Alaska</option>
              <option value="ME">Maine</option>
              <option value="MS">Mississippi</option>
              <option value="SD">South Dakota</option>
              <option value="WV">West Virginia</option>
              <option value="ND">North Dakota</option>
              <option value="VT">Vermont</option>
              <option value="MT">Montana</option>
              <option value="WY">Wyoming</option>
            </select>
          </div>
          <div className="col-md-1">
            <span className="d-inline-block white-space-nowrapping text-grey align-self-center p-0 pl-md-3 pr-md-3 col-md-3">
              Zip
            </span>
          </div>

          <div className="col-md-2">
            <input
              type="text"
              placeholder="Enter Zip"
              value={postCode}
              onChange={(e) => setPostCode(e.target.value)}
              className="form-control col-md-9"
              name="location_zip"
              id="location_zip"
            />
          </div>
        </div>

        <div className="row align-items-center form-group">
          <div className="col-md-2">
            <span className="d-inline-block white-space-no-wrapping text-grey align-self-center T-MR-25-Px">
              Phone
            </span>
          </div>
          <div className="col-md-2">
            <input
              type="text"
              placeholder="Enter Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="form-control"
              name="location_phone"
              id="location_phone"
            />
          </div>

          <div className="col-md-2">
            <span className="d-inline-block white-space-nowrapping text-grey align-self-center p-0 pl-md-3 pr-md-3 col-md-3">
              Fax
            </span>
          </div>
          <div className="col-md-3">
            <input
              type="text"
              placeholder="Enter fax"
              className="form-control col-md-9"
              name="location_fax"
              id="location_fax"
              value={fax}
              onChange={(e) => setFax(e.target.value)}
            />
          </div>

          <div className="col-md-1">
            <span className="d-inline-block white-space-nowrapping text-grey align-self-center p-0 pl-md-3 pr-md-3 col-md-3">
              Email
            </span>
          </div>
          <div className="col-md-2">
            <input
              type="text"
              placeholder="Enter Email"
              className="form-control"
              name="location_email"
              id="location_email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="row align-items-center form-group">
          <div className="col-md-2 text-left">
            <span className="d-inline-block text-grey">
              <nobr>Website</nobr>
            </span>
          </div>
          <div className="col-md-10">
            <input
              type="text"
              placeholder="Enter Website Url"
              className="form-control"
              name="location_website"
              id="location_website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>
        </div>

        <div className="col-md d-md-flex">* Cannot be Blank</div>
      </form>
    </div>
  );
});

export default Provider;
