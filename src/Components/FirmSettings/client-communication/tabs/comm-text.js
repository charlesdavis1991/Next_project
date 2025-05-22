import React, { useEffect, useState } from "react";
import useClientCommuincation from "../hooks/useClientCommunication";
import {
  useFetchNumbers,
  usePurchaseNumber
} from "../hooks/useFetchNumbers";
import {
  AREA_CODES,
  REGIONS,
  US_CITIES
} from "./text-constants.js";

const CommunicationText = () => {
  const [areaCode, setAreaCode] = useState(null);
  const [region, setRegion] = useState(null);
  const [city, setCity] = useState(null);
  const [numberFilter, setNumberFilter] = useState({
    startsWith: "",
    contains: "",
    endsWith: "",
  });

  const [selectedNumber, setSelectedNumber] = useState("");
  const [changeNumber, setChangeNumber] = useState(false);

  const {
    data,
    loading,
    refetch
  } = useClientCommuincation();

  const {
    fetchNumbers,
    loading: fetchNumbersLoading,
    data: numbers,
    error: fetchNumbersError,
  } = useFetchNumbers();

  const { savePhoneNumber } = usePurchaseNumber();

  useEffect(() => {
    if (fetchNumbersError) {
      alert(fetchNumbersError?.detail);
    }
  }, [fetchNumbersError]);

  useEffect(() => {
    if (areaCode || (region && city)) {
      handleFetchNumbers();
    }
  }, [areaCode, region, city, numberFilter]);

  useEffect(() => {
    if (numbers?.data?.length == 0) {
      alert("No numbers available for the selected criteria.");
      if (areaCode) {
        setAreaCode("");
      } else {
        setRegion("");
        setCity("");
      }
      setNumberFilter({
        startsWith: "",
        contains: "",
        endsWith: "",
      });
    }
  }, [numbers]);

  const handleFetchNumbers = async () => {
    var search_type = "";
    var search_value = "";
    var filter;

    if (areaCode) {
      search_type = "area_code";
      search_value = areaCode;
    } else if (region && city) {
      search_type = "region";
      search_value = `${region},${city}`;
    } else {
      alert("Please select an area code or region and city.");
      return;
    }

    if (numberFilter.startsWith.length >= 3) {
      filter = {
        startsWith: numberFilter.startsWith
      }
    } else if (numberFilter.contains.length >= 3) {
      filter = {
        contains: numberFilter.contains
      }
    } else if (numberFilter.endsWith.length >= 3) {
      filter = {
        endsWith: numberFilter.endsWith
      }
    }

    await fetchNumbers(search_type, search_value, filter);
  }

  const handlePurchaseNumber = async () => {
    await savePhoneNumber({
      selectNum: selectedNumber,
    });

    if (changeNumber) {
      setChangeNumber(false);
    }

    setSelectedNumber("");
    setAreaCode("");
  };

  return (
    <div className="col-lg-12">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {data && data?.existing_num && (
            <>
              <h3 className="mb-1">Firm Texting Phone Number</h3>
              <div id="existing-db" className="col-sm-6 top-head">
                <div className="d-flex align-items-center">
                  <label className="mr-2  m-b-0">Number: </label>
                  <input
                    type="text"
                    value={data?.existing_num?.number}
                    readOnly
                    style={{ border: "none" }}
                  ></input>
                </div>
                <div className="d-flex align-items-center">
                  <label className="mr-2 m-b-0">Country Code: </label>
                  <input
                    type="text"
                    value={data?.existing_num?.country_code}
                    readOnly
                    style={{ border: "none" }}
                  ></input>
                </div>
              </div>
              {!changeNumber && (
                <div className="d-flex align-items-center">
                  <button
                    className="btn btn-danger m-t-5"
                    onClick={() => setChangeNumber(!changeNumber)}
                  >
                    Change Number
                  </button>
                </div>
              )}
            </>
          )}
          {((data && !data?.existing_num) || changeNumber) && (
            <>
              <h3 className={`mb-1 ${changeNumber && "m-t-10"}`}>Purchase Phone Numbers</h3>
              <div className="row">
                <div className="col-sm-4">
                  <label>Enter Area Code:</label>
                  <select
                    className="form-control m-r-5 m-b-2"
                    value={areaCode}
                    onChange={(e) => {
                      setAreaCode(e.target.value)
                      setRegion("");
                      setCity("");
                      setSelectedNumber("");
                    }}
                  >
                    <option value="">Select area code</option>
                    {AREA_CODES.map((code, index) => (
                      <option key={index} value={code}>
                        {code}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-sm-4">
                  <label>State:</label>
                  <select
                    className="form-control m-r-5 m-b-2"
                    value={region}
                    onChange={(e) => {
                      setCity("");
                      setRegion(e.target.value);
                      setAreaCode("");
                      setSelectedNumber("");
                    }}
                  >
                    <option value="">Select state</option>
                    {REGIONS.map((region, index) => (
                      <option key={index} value={region.code}>
                        {region.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-sm-4">
                  <label>City:</label>
                  <select
                    className="form-control m-r-5 m-b-2"
                    value={city}
                    onChange={(e) => {
                      setAreaCode("");
                      setCity(e.target.value);
                    }}
                  >
                    <option value="">Select city</option>
                    {region &&
                      US_CITIES.filter((city) => city.state === region).map((city, index) => (
                        <option key={index} value={city.name}>
                          {city.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <div className="row pt-2">
                <div className="col-sm-4">
                  <label>Starts With:</label>
                  <input
                    type="text"
                    className="form-control m-r-5 m-b-2"
                    value={numberFilter.startsWith}
                    onChange={(e) => {
                      if (e.target.value.length > 7) {
                        alert("Please enter a maximum of 7 digits");
                        return;
                      }
                      setNumberFilter({
                        startsWith: e.target.value,
                        contains: "",
                        endsWith: "",
                      });
                    }}
                  placeholder="Enter Starting Digits min 3"
                  />
                </div>
                <div className="col-sm-4">
                  <label>Contains:</label>
                  <input
                    type="text"
                    className="form-control m-r-5 m-b-2"
                    value={numberFilter.contains}
                    onChange={(e) => {
                      if (e.target.value.length > 7) {
                        alert("Please enter a maximum of 7 digits");
                        return;
                      }
                      setNumberFilter({
                        startsWith: "",
                        contains: e.target.value,
                        endsWith: "",
                      });
                    }}
                    placeholder="Enter Containing Digits min 3"
                  />
                </div>
                <div className="col-sm-4">
                  <label>Ends With:</label>
                  <input
                    type="text"
                    className="form-control m-r-5 m-b-2"
                    value={numberFilter.endsWith}
                    onChange={(e) => {
                      if (e.target.value.length > 7) {
                        alert("Please enter a maximum of 7 digits");
                        return;
                      }
                      setNumberFilter({
                        startsWith: "",
                        contains: "",
                        endsWith: e.target.value,
                      });
                    }}
                    placeholder="Enter Ending Digits min 3"
                  />
                </div>
              </div>
              <div className="col p-0">
                {numbers && (areaCode || (region && city)) && (
                  <div id="existing-db" className="top-head m-b-5 m-t-5">
                    <div className="d-flex flex-wrap">
                      {numbers.data.map((num) => (
                        <div
                          key={num.id}
                          className="d-flex align-items-center mb-2 col-sm-3"
                        >
                          <input
                            type="radio"
                            id={num.id}
                            name="phoneNumber"
                            value={num.e164}
                            checked={selectedNumber === num.e164}
                            onChange={(e) => setSelectedNumber(e.target.value)}
                          />
                          <label htmlFor={num.id} className="ml-2 m-b-0">
                            {num.international_number_formatted} - {num.country_code}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="pt-2">
                {changeNumber && (
                  <button className="btn btn-secondary" onClick={() => {
                    setChangeNumber(false)
                    setSelectedNumber("")
                    setAreaCode("")
                    setRegion("")
                    setCity("")
                  }}>
                    Cancel
                  </button>
                )}
                {numbers?.data?.length > 0 && (
                  <button
                    className="btn btn-success m-t-3 float-right"
                    onClick={handlePurchaseNumber}
                    disabled={!selectedNumber || fetchNumbersLoading}
                  >
                    {fetchNumbersLoading ? "Loading..." : "Purchase Number"}
                  </button>
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default CommunicationText;
