import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import api from "../../api/api";
import { getCaseId, getClientId } from "../../Utils/helper";
import { VehicleNotesTableEdit } from "./VehicleNotesTable";
import { fetchAccidentData } from "../../Redux/accident/accidentSlice";

const VehicleNotes = ({ handleClose }) => {
  const accidentId = useSelector((state) => state.accident?.current?.id);
  const dispatch = useDispatch();
  const clientId = getClientId();
  const caseId = getCaseId();

  const { handleSubmit, handleChange, setFieldValue, values } = useFormik({
    initialValues: {
      description: "",
      category: "",
      due_date: "2 days",
    },
    onSubmit: async (values) => {
      const data = {
        description: values.description,
        category: values.category,
        due_date: values.due_date,
        entity_type: "CarAccident",
        record_id: accidentId,
        // user_type: document.getElementById("hidden-select").value,
      };
      if (accidentId) {
        const responseData = await api.post(
          `/api/notes/${getClientId()}/${getCaseId()}/`,
          data
        );
        console.log(responseData);
        // clear description field
        setFieldValue("description", "");
        document.getElementById("individual_notes_modal_close").click();
        dispatch(fetchAccidentData(clientId, caseId));
      } else {
        console.log("Accident ID not found");
      }
    },
  });

  let location = useLocation();
  const selectedPagePath = location.pathname.split("/")[1];

  const pages = useSelector((state) => state.caseData?.pages);
  const currentCase = useSelector((state) => state.caseData?.current);
  const caseSummary = useSelector((state) => state.caseData?.summary);
  const [firmUsers, setFirmUsers] = useState([]);

  useEffect(() => {
    if (currentCase && caseSummary && caseSummary?.workers) {
      setFirmUsers([
        {
          firm_user: currentCase?.firm_user1,
          user_type: caseSummary?.workers[0],
        },
        {
          firm_user: currentCase?.firm_user2,
          user_type: caseSummary?.workers[1],
        },
        {
          firm_user: currentCase?.firm_user3,
          user_type: caseSummary?.workers[2],
        },
        {
          firm_user: currentCase?.firm_user4,
          user_type: caseSummary?.workers[3],
        },
        {
          firm_user: currentCase?.firm_user5,
          user_type: caseSummary?.workers[4],
        },
        {
          firm_user: currentCase?.firm_user6,
          user_type: caseSummary?.workers[5],
        },
      ]);
    }
  }, [currentCase, caseSummary?.workers]);

  return (
    <>
      <div className="modal-header text-center">
        <h5 className="modal-title mx-auto">Accident Notes</h5>
      </div>
      <div className="modal-body panel-popups-body">
        <div className="col-lg-12 p-0 notes-section">
          <form
            className="d-flex justify-content-start"
            onSubmit={handleSubmit}
          >
            <div className="footer-line mr-2">
              <button
                className="ml-0 rounded-0"
                type="submit"
                value={values.category}
                onClick={() => setFieldValue("category", "Critical")}
              >
                New <br />
                Critical
                <br />
                Note
              </button>
            </div>
            <textarea
              id="note_description_panel"
              name="description"
              placeholder="Accident Note:.."
              value={values.description}
              onChange={handleChange}
            ></textarea>
            <div className="footer-line">
              <button
                className="ml-2 rounded-0"
                type="submit"
                value={values.category}
                onClick={() => setFieldValue("category", "Update Case Status")}
              >
                Update
                <br />
                Case
                <br />
                Status
              </button>
            </div>
          </form>

          <form onSubmit={handleSubmit}>
            <div className="footer-line">
              <div className="row align-items-center">
                <div className="col-lg-8 col-md-6 col-sm-12 d-flex align-items-center">
                  {" "}
                  To-Do for{" "}
                  <select
                    id="hidden-select"
                    name="user_type"
                    className="vodiapicker"
                  >
                    {firmUsers &&
                      firmUsers.length > 0 &&
                      firmUsers?.map(({ user_type, firm_user }) =>
                        firm_user?.profile_pic ? (
                          <option
                            value={user_type?.id}
                            data-thumbnail={firm_user?.profile_pic}
                            data-value={firm_user?.user.id}
                          >
                            {firm_user?.user?.first_name}
                            {firm_user?.user?.last_name}
                          </option>
                        ) : (
                          <option
                            value={user_type?.id}
                            data-thumbnail="img/avatar.png"
                          >
                            {firm_user?.user?.first_name}
                            {firm_user?.user?.last_name}
                          </option>
                        )
                      )}
                  </select>
                  <div className="lang-select">
                    <button
                      id="todo-user"
                      className="btn-select-custom"
                      type="button"
                      value="{{case_users.0.id}}"
                    ></button>
                    <div className="b">
                      <ul id="outer-div"></ul>
                    </div>
                  </div>
                  due in
                  <select
                    className="right footer-select w-50 m-r-5 form-select"
                    name="due_date"
                    id="cars"
                    value={values.due_date}
                    onChange={(e) => setFieldValue("due_date", e.target.value)}
                  >
                    <option value="Now">Now</option>
                    <option value="1 day">1 day</option>
                    <option value="2 days" selected>
                      2 days
                    </option>
                    <option value="3 days">3 days</option>
                    <option value="4 days">4 days</option>
                    <option value="5 days">5 days</option>
                    <option value="6 days">6 days</option>
                    <option value="1 week">1 week</option>
                    <option value="2 weeks">2 weeks</option>
                    <option value="1 month">1 month</option>
                    <option value="2 months">2 months</option>
                    <option value="6 months">6 months</option>
                  </select>
                  <button
                    className="btn btn-primary rounded-0"
                    type="button"
                    value={values.category}
                    onClick={() => console.log(values)}
                  >
                    <span className="font-weight-bold pr-2 text-gold">+</span>
                    To-Do
                  </button>
                </div>
                <div className="col-lg-4 col-md-6 col-sm-12 d-flex align-items-center justify-content-end">
                  <select
                    name="category"
                    id="note_category_panel"
                    className={`right  w-50 m-r-5 form-select Centre-Accident1 ${
                      pages &&
                      pages?.map((page) =>
                        page.page_url === selectedPagePath ? page.name : null
                      )
                    }`}
                    value={values.category}
                    onChange={handleChange}
                  >
                    {pages?.map((page) =>
                      page.name === "Accident" ? (
                        <option selected value={page.name}>
                          {page.name}
                        </option>
                      ) : (
                        <option value={page.name} disabled>
                          {page.name}
                        </option>
                      )
                    )}
                  </select>
                  <button
                    className="btn btn-primary rounded-0"
                    type="submit"
                    onClick={() => {
                      setFieldValue(
                        "category",
                        document.getElementById("note_category_panel").value
                      );
                    }}
                  >
                    <span className="font-weight-bold pr-2 text-gold">+</span>
                    Note
                  </button>
                </div>
              </div>
            </div>
          </form>

          <nav className="row">
            <div className="col-lg-12 notetable">
              <div className="custom-tab">
                <div>
                  <div
                    className="tab-pane"
                    id="custom-nav-todo"
                    role="tabpanel"
                    aria-labelledby="custom-nav-todo-tab"
                  >
                    <div className="col-lg-12">
                      <div className="row">
                        <div className="table-responsive table--no-card">
                          <VehicleNotesTableEdit />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </div>
      <div className="modal-footer">
        <button
          type="button"
          className="btn btn-secondary"
          id="individual_notes_modal_close"
          // onClick={handleClose}
          data-dismiss="modal"
        >
          Close Accident Notes Panel
        </button>
      </div>
    </>
  );
};

export default VehicleNotes;
