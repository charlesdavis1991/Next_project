import React, { useEffect, useState, lazy, Suspense, useRef, useContext, useReducer } from "react";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../Components/Sidebars/main";
import NavBar from "../Components/Navbars/main";
import WitnessesActionBar from "../Components/Witnesses/WitnessesActionBar";
import WitnessesMain from "../Components/Witnesses/WitnessesMain";
import { ClientDataContext } from "../Components/ClientDashboard/shared/DataContext";
import { getCaseId, getClientId, fetchShakespeareStatus } from "../Utils/helper";
import { fetchCreateInsuranceModalData } from "../Redux/insurance/insuranceSlice";
import { setSearchRecordId } from "../Redux/search/searchSlice";
import { getToken } from "../Utils/helper";
import axios from "axios";
import Footer from "../Components/common/footer";
// import api from "../api/api";

const NotesHeavy = lazy(() => import("../Components/NotesSectionDashboard/main"));

function WitnessesPage2() {
  const dispatch = useDispatch();
  
  const client = useSelector((state) => state.todos.client);
  const pages = useSelector((state) => state.todos.pages);
  const currentCase = useSelector((state) => state.todos.currentCase);
  const searchRecordId = useSelector((state) => state.searchS.searchRecordId);
  const modalData = useSelector((state) => state.insurances.modalData);
  const accessToken = getToken()
  const origin = process.env.REACT_APP_BACKEND_URL || "https://dev.simplefirm.com";
  const [reducerValue, setReducer] = useReducer(x=>x+1, 0)
  const [isBlurred, setIsBlurred] = useState(false);
  const currentCaseId = getCaseId();
  const clientId = getClientId();
  
  const { isClientDataUpdated } = useContext(ClientDataContext);

  const [isDummy, setIsDummy] = useState(true);
  const [handleFetchWitnesses, setHandleFetchWitnesses] = useState(false);
  const [witnessData, setWitnessData] = useState(null);
  const [witnessDataArr, setWitnessDataArr] = useState([]);
  const [retainedByList, setRetainedByList] = useState({
    clients: [],
    defendants: [],
    otherParties: [],
  });

  const witnessesRefs = useRef({});
  const containerRef = useRef(null);

  const fetchData = async () => {
    try {
      const [dummyStatusResponse, retainedByListResponse, witnessesResponse] = await Promise.all([
        axios.get(`${origin}/api/general/panel_page_block/?case_id=${currentCaseId}&entity=Witnesses`,{
          headers: {
            'Content-Type': 'application/json',  
            Authorization: accessToken, 
          }
        }),
        axios.get(`${origin}/api/experts_retained_by_list/${clientId}/${currentCaseId}/`,{
          headers: {
            'Content-Type': 'application/json',  
            Authorization: accessToken, 
          }
        }),
        axios.get(`${origin}/api/witnesses/${clientId}/${currentCaseId}/`,{
          headers: {
            'Content-Type': 'application/json',  
            Authorization: accessToken, 
          }
        })
      ]);

      setIsDummy(dummyStatusResponse?.data?.status);
      setRetainedByList({
        clients: retainedByListResponse.data.client,
        defendants: retainedByListResponse.data.defendants,
        otherParties: retainedByListResponse.data.other_parties,
      });
      setWitnessData(witnessesResponse.data);
      setHandleFetchWitnesses(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [origin, isClientDataUpdated, reducerValue]);

  useEffect(() => {
    if (isDummy && witnessData) {
      const blockedWitnesses = witnessData?.witnesses?.filter((witness) => witness?.is_blocked);
      const lastBlockedWitness = blockedWitnesses?.length ? blockedWitnesses[blockedWitnesses.length - 1] : null;
      setWitnessDataArr([lastBlockedWitness]);
    } else {
      setWitnessDataArr(witnessData?.witnesses);
    }

    dispatch(
      fetchCreateInsuranceModalData({
        client_id: clientId,
        case_id: currentCaseId,
      })
    );
    fetchShakespeareStatus(currentCaseId, clientId, "Witnesses", dispatch);
  }, [ witnessData, isDummy]);


  useEffect(()=>{
    if(searchRecordId !='')
    {
      setIsBlurred(true)
    }
  },[searchRecordId])

  useEffect(() => {
    if (searchRecordId && witnessesRefs.current[searchRecordId]) {
      const searchRecordElement = witnessesRefs.current[searchRecordId];
      const containerElement = containerRef.current;

      const searchRecordOffsetTop = searchRecordElement.offsetTop;
      const containerScrollTop = containerElement.scrollTop;
      const smallScrollAdjustment = 10;
      setIsBlurred(false)
      containerElement.scrollTo({
        top: searchRecordOffsetTop - containerScrollTop - smallScrollAdjustment,
        behavior: "smooth",
      });
      dispatch(setSearchRecordId(""));
      setIsBlurred(false)
    }
  }, [witnessDataArr, searchRecordId]);

  const blurStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(255, 255, 255, 0.6)", // Semi-transparent background
    backdropFilter: "blur(10px)", // Actual blur effect
    zIndex: 999999, // Makes sure it's on top of the content
  };
  return (
    <>
    <div className="page-wrapper">
       {isBlurred && (
        <div style={blurStyle} />
      )}
      <Sidebar pages={pages} />
      <div className="page-container">
        <NavBar client={client} currentCase={currentCase} flaggedPageName="Witnesses" />
        <WitnessesActionBar
          states={modalData?.states}
          retainedByList={retainedByList}
          isDummy={isDummy}
          setReducer={setReducer}
          reducerValue={reducerValue}
          handleFetchWitnesses={() => setHandleFetchWitnesses(true)}
        />
        <div className="experts-main-container invisible-scrollbar" ref={containerRef} style={{ overflowY: "auto", maxHeight: "100vh" }}>
          {witnessDataArr?.map((object, index) => (
            <div key={object?.id} ref={(el) => (witnessesRefs.current[object?.id] = el)}>
              <WitnessesMain
                setReducer={setReducer}
                reducerValue={reducerValue}
                object={object}
                witnesses={witnessData?.witnesses}
                handleFetchWitnesses={() => setHandleFetchWitnesses(true)}
                retainedByList={retainedByList}
                modalData={modalData}
              />
            </div>
          ))}
          <Suspense fallback={<div>Loading...</div>}>
            <NotesHeavy />
          </Suspense>
        </div>
      </div>
      
    </div>
    <Footer/>
    </>
  );
}

export default WitnessesPage2;
