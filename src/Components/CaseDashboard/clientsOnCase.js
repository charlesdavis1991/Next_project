import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchClientsOnCase } from "../../Redux/case/actions";

const ClientsOnCase = () => {
  const dispatch = useDispatch();
  const clientsOncase = useSelector((state) => state.case.clientsOnCase);
  const currentCase = useSelector((state) => state?.caseData?.current);
  useEffect(() => {
    if (currentCase && currentCase.id) {
      dispatch(fetchClientsOnCase(currentCase.id));
    }
  }, [dispatch, currentCase]);

  useEffect(() => {
    console.log("clientsOncase", clientsOncase?.clients_on_case);
  }, [clientsOncase]);

  console.log("clientsOncase", clientsOncase)

  return (
    <>
      <div>
        <p
          className="font-weight-bold text-uppercase pr-5 pt-2"
          style={{ color: "#19395F" }}
        >
          Clients On Case
        </p>

        {clientsOncase &&
          clientsOncase.clients_on_case &&
          clientsOncase.clients_on_case.length > 0 &&
          clientsOncase.clients_on_case.map((x, index) => {
            return (
              <div key={index} className="row mb-0 colFont">
                <div className="col text-left d-flex align-items-center justify-content-between">
                  <div className="left-area d-flex align-items-center">
                    {x.new_client.profile_pic_19p ? (
                      <span className="ic ic-avatar ic-19 has-avatar-icon has-cover-img ">
                        <img
                          className="w-100 h-100"
                          src={x.new_client.profile_pic_19p}
                          alt=""
                        />
                      </span>
                    ) : (
                      <span className="ic ic-avatar ic-19 has-avatar-icon has-cover-img" />
                    )}
                    <span className="ml-2 mr-2 font-weight-semibold">
                      {x.new_client.first_name} {x.new_client.last_name}
                    </span>
                  </div>
                  <span className="padding-left35">
                    Age &nbsp;
                    <span className="font-weight-semibold">
                      {x.new_client.age}
                    </span>
                  </span>
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default ClientsOnCase;
