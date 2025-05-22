import React, { useEffect, useState, useContext } from "react";
import { Form, Modal, ModalTitle } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentTab,
  setHasNoData,
  setIsSearchDisabled,
} from "../../Redux/Directory/directorySlice";
import FirstPageModal from "./Elements/FirstPageModal";
import NotificationsModal from "./Elements/NotificationsModal";
import SearchOptions from "./Elements/SearchOptions";
import DocPageTabModal from "./Elements/DocPageTabModal";
import PageViewModal from "./Elements/PageViewModal";
import CalendarViewModal from "./Elements/CalendarViewModal";
import "./home-page-37-forms.css";
import { getClientId, getCaseId } from "../../Utils/helper";
import { ClientDataContext } from "../ClientDashboard/shared/DataContext";
import { FormProvider, useForm } from "react-hook-form";
import axios from "axios";

const UserPreference = ({ handleClose, handleSave }) => {

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const dispatch = useDispatch();

  const handleTabChange = (tab) => {
    dispatch(setCurrentTab(tab));
    dispatch(setIsSearchDisabled(false));
    dispatch(setHasNoData(false));
  };

  useEffect(() => {
    dispatch(setCurrentTab("First Page"));
  }, []);

  // Default user preferences state
  const [userPreferences, setUserPreferences] = useState({
    homePage: true,
    includeIncidentDate: false,
    includeClientBirthday: false,
    includeClientPhone: false,
    includeClientEmail: false,
    includeCaseOpenDate: false,
    includeCaseClosedDate: false,
    includeLastAccessedDate: false,
    includeCaseStage: false,
    notifications: false,
  });

  const origin = process.env.REACT_APP_BACKEND_URL;
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const [firstTimeLitigationtData, setFirstTimeLitigationData] = useState(true);
  const [HomeData, setHomeData] = useState({});
  const {isLitigationDashboardDataUpdate, setLitigationDashboardDataUpdated} =useContext(ClientDataContext);


  const methods = useForm();
  const { reset, handleSubmit, register, watch, setValue  } = methods;
  
  console.log("HOME DATA", HomeData);
  const fetchHomeData = async () => {
    try {
      const response = await axios.get(
        origin +
          "/api/home/firmuser-preferences/",
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (response) {
        setHomeData(response.data);
        // setFirstTimeLitigationData(false);
      }
      // if (isLitigationDashboardDataUpdate) {
      //   setHomeData(response.data);
      //   setLitigationDashboardDataUpdated(false);
      // }
    } catch (error) {
      console.log("Failed to fetch Litigation Data:", error);
    }
  };

  useEffect(() => {
    fetchHomeData();
  }, [isLitigationDashboardDataUpdate]);


  useEffect(() => {
    if(HomeData){
       //notification tab
      setValue("home_login" , HomeData?.home_login)
      setValue("pinned_case_activity" , HomeData?.pinned_case_activity || false)
      //Search options  tab 
      setValue("srclientbday" , HomeData?.srclientbday || false) 
      setValue("srcasestage" , HomeData?.srcasestage || false) 
      setValue("srmainphone" , HomeData?.srmainphone || false) 
      setValue("srmainemail" , HomeData?.srmainemail || false) 
      setValue("SRincidentdate" , HomeData?.SRincidentdate || false) 
      setValue("sropendate" , HomeData?.sropendate || false) 
      setValue("srcloseddate" , HomeData?.srcloseddate || false) 
      setValue("srlastaccessed" , HomeData?.srlastaccessed || false) 

      //Doc tab 
      setValue("DocPageAll", HomeData?.DocPageAll);
      setValue("DocPageUnsorted", HomeData?.DocPageUnsorted);
      setValue("DocPagePrior", HomeData?.DocPagePrior);
      setValue("DocTabForPage", HomeData?.DocTabForPage);

      setValue('ProviderSimple', HomeData?.ProviderSimple);
      setValue('ProviderFull', HomeData?.ProviderFull);
      setValue('ProviderDates', HomeData?.ProviderDates);

      setValue('DefSummary',  HomeData?.DefSummary);
      setValue('DefFull',  HomeData?.DefFull);



      
    setValue('CalTimeline', HomeData?.CalTimeline);
    setValue('CalToday', HomeData?.CalToday);
    setValue('CalCurWeek',  HomeData?.CalCurWeek);
    setValue('CalCurMo', HomeData?.CalCurMo);
    setValue('CalLastView', HomeData?.CalLastView);
    }
  }, [isLitigationDashboardDataUpdate, HomeData]);

    



  // API call to save preferences with form data
  const savePrefrence = async (data) => {
    try {
        const response = await axios.post(`${origin}/api/home/firmuser-preferences/`, 
          data,
            {
                headers: {
                    Authorization: token,
                },
            }
        );
        if (response.status === 200 || response.status === 201) {
            setLitigationDashboardDataUpdated(!isLitigationDashboardDataUpdate);
            handleClose()
        }
    } catch (error) {
        console.log("At savePrefrence :: ", error)
    }
};

// Submit handler
const onSubmit = data => {
  console.log("Form Data:", data);
    savePrefrence(data);
};

  return (
    <FormProvider {...methods}>
      <Modal show={UserPreference ? true : false} onHide={handleClose} dialogClassName="modal-dialog-centered modal-dialog-2-max-width">
       <Form
          id="user-prefrence"
          onSubmit={handleSubmit(onSubmit)}
          >
          <div style={{ height: "540px" }}>
            <Modal.Body>
              <div>
                <h1 style={{ marginBottom: '15px', marginLeft: '2px', color: '#19395F', fontSize: '24px' }}>User Options</h1>
              </div>
              <div className="nav nav-tabs directory-tab-box h-25px" id="nav-tab" role="tablist" style={{ paddingRight: "16px" }}>
                <a
                  className="nav-item nav-link active PT9-LFD me-3"
                  id="custom-nav-A1-tab"
                  data-toggle="tab"
                  href="#custom-nav-A1"
                  role="tab"
                  aria-controls="custom-nav-A1"
                  aria-selected="true"
                  onClick={() => handleTabChange("A1")}
                  style={{
                    transition: "all -0.1s ease",
                    margin: "0",
                    border: "none",
                    boxSizing: "border-box",
                  }}
                  data-text="A1"
                >
                  First Page
                </a>
                <a
                  className="nav-item nav-link PT9-LFD"
                  id="custom-nav-A2-tab"
                  data-toggle="tab"
                  href="#custom-nav-A2"
                  role="tab"
                  aria-controls="custom-nav-A2"
                  aria-selected="false"
                  onClick={() => handleTabChange("A2")}
                  style={{
                    transition: "all -0.1s ease",
                    margin: "0",
                    border: "none",
                    boxSizing: "border-box",
                  }}
                  data-text="A2"
                >
                  Notifications
                </a>
                <a
                  className="nav-item nav-link PT9-LFD"
                  id="custom-nav-A3-tab"
                  data-toggle="tab"
                  href="#custom-nav-A3"
                  role="tab"
                  aria-controls="custom-nav-A3"
                  aria-selected="false"
                  onClick={() => handleTabChange("A3")}
                  style={{
                    transition: "all -0.1s ease",
                    margin: "0",
                    border: "none",
                    boxSizing: "border-box",
                  }}
                  data-text="A3"
                >
                  Search Options
                </a>
                <a
                  className="nav-item nav-link PT9-LFD"
                  id="custom-nav-A4-tab"
                  data-toggle="tab"
                  href="#custom-nav-A4"
                  role="tab"
                  aria-controls="custom-nav-A4"
                  aria-selected="false"
                  onClick={() => handleTabChange("A4")}
                  style={{
                    transition: "all -0.1s ease",
                    margin: "0",
                    border: "none",
                    boxSizing: "border-box",
                  }}
                  data-text="A4"
                >
                  Doc Tab Page
                </a>
                <a
                  className="nav-item nav-link PT9-LFD"
                  id="custom-nav-A5-tab"
                  data-toggle="tab"
                  href="#custom-nav-A5"
                  role="tab"
                  aria-controls="custom-nav-A5"
                  aria-selected="false"
                  onClick={() => handleTabChange("A5")}
                  style={{
                    transition: "all -0.1s ease",
                    margin: "0",
                    border: "none",
                    boxSizing: "border-box",
                  }}
                  data-text="A5"
                >
                  Page View
                </a>
                <a
                  className="nav-item nav-link PT9-LFD"
                  id="custom-nav-A6-tab"
                  data-toggle="tab"
                  href="#custom-nav-A6"
                  role="tab"
                  aria-controls="custom-nav-A6"
                  aria-selected="false"
                  onClick={() => handleTabChange("A6")}
                  style={{
                    transition: "all -0.1s ease",
                    margin: "0",
                    border: "none",
                    boxSizing: "border-box",
                  }}
                  data-text="A6"
                >
                  Calender View
                </a>
              </div>
            
                <div className="tab-content" id="nav-tabContent">
                  <div className="tab-pane fade show active" id="custom-nav-A1" role="tabpanel" aria-labelledby="custom-nav-A1-tab">
                    <FirstPageModal homePageCurrent={HomeData?.home_login} lastAccessedCurrent={HomeData?.srlastaccessed}/>
                  </div>

                  <div className="tab-pane fade" id="custom-nav-A2" role="tabpanel" aria-labelledby="custom-nav-A2-tab">
                    <NotificationsModal notificationCurrent={HomeData?.pinned_case_activity}/>
                  </div>

                  <div className="tab-pane fade" id="custom-nav-A3" role="tabpanel" aria-labelledby="custom-nav-A3-tab">
                    <SearchOptions/>
                  </div>
                  <div className="tab-pane fade" id="custom-nav-A4" role="tabpanel" aria-labelledby="custom-nav-A4-tab">
                    <DocPageTabModal allTabCurrent={HomeData?.DocPageAll} unsortedTabCurrent={HomeData?.DocPageUnsorted} associatedTabCurrent={HomeData?.DocPagePrior} lastTabCurrent={HomeData?.DocTabForPage}/>
                  </div>
                  <div className="tab-pane fade" id="custom-nav-A5" role="tabpanel" aria-labelledby="custom-nav-A5-tab">
                    <PageViewModal simpleViewCurrent={HomeData?.ProviderSimple} fullViewCurrent={HomeData?.ProviderFull} datesViewCurrent={HomeData?.ProviderDates} summaryViewCurrent={HomeData?.DefSummary} defFullViewCurrent={HomeData?.DefFull}/>
                  </div>
                  <div className="tab-pane fade" id="custom-nav-A6" role="tabpanel" aria-labelledby="custom-nav-A6-tab">
                    <CalendarViewModal />
                  </div>
                </div>
            </Modal.Body>
          </div>
          <Modal.Footer style={{ border: "none" }}>
            <button
              type="button"
              className="btn btn-secondary h-35px"
              onClick={handleClose}
              >
              Cancel
            </button>
            <button type="submit" class="btn btn-success" >Save</button>
          </Modal.Footer>
        </Form>
      </Modal>
    </FormProvider>
  );
}

export default UserPreference;
