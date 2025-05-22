import React,{useState,useEffect,useContext,useCallback} from 'react';
import { getClientId,getCaseId } from '../../Utils/helper';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { ClientDataContext } from '../ClientDashboard/shared/DataContext';
import {fetchStates} from '../../Redux/states/statesSlice';
import AddLitigationActPopup from './Modals/AddLitigationActPopup';

const LitigationPlaceholderPanel = ({panel_name}) => {
    const [showActPopup, setShowActPopup] = useState(false);
    const handleClosePopup = useCallback(() => {
        if (showActPopup === true) {
        setShowActPopup(false);
        }
    }, [showActPopup]);
    const origin = process.env.REACT_APP_BACKEND_URL;
    const node_env = process.env.NODE_ENV;
    const media_origin =
        node_env === "production" ? "" : process.env.REACT_APP_BACKEND_URL;
    const token = localStorage.getItem("token");
    // const dispatch = useDispatch();
    // const searchRecordId = useSelector((state) => state.searchS.searchRecordId);
    const currentCaseId = getCaseId();
    const clientId = getClientId();
    const [litigationData, setLitigationData] = useState({});
    const [defendantsData, setDefendantsData] = useState([]);
    const [DefendantProcessedPageSlots, setDefendantProcessedPageSlots] =
        useState([]);
    const { isLitigationDashboardDataUpdate, setLitigationDashboardDataUpdated } =
        useContext(ClientDataContext);
    const [CardsData, setCardsData] = useState(false);
    const [firstTimeLitigationtData, setFirstTimeLitigationData] = useState(true);
    const dispatch = useDispatch();
    dispatch(fetchStates());

    const fetchLitigationData = async () => {
        try {
        const litigation_data = await axios.get(
            `${origin}/api/litigation-page/litigations/${clientId}/${currentCaseId}/`,
            {
            headers: {
                Authorization: token,
            },
            }
        );
        if (litigation_data.status === 200) {
            if (firstTimeLitigationtData) {
            setLitigationData(litigation_data.data);
            setDefendantsData(litigation_data.data?.defendants);
            setDefendantProcessedPageSlots(
                litigation_data.data?.defendant_processed_page_slots
            );
            setFirstTimeLitigationData(false);
            }
            if (isLitigationDashboardDataUpdate) {
            setLitigationData(litigation_data.data);
            setDefendantsData(litigation_data.data?.defendants);
            setDefendantProcessedPageSlots(
                litigation_data.data?.defendant_processed_page_slots
            );
            setLitigationDashboardDataUpdated(false);
            }
        }
        } catch (error) {
        console.log("Failed to fetch Litigation Data:", error);
        }
    };

    //data for components
    function settingCardsData() {
        const CardsDataSetter = {
        CaseData: {
            litigation_id: litigationData?.litigation?.id,
            case_short_name: litigationData?.litigation?.case_short_name,
            case_full_name: litigationData?.litigation?.case_full_name,
            case_number: litigationData?.litigation?.case_number,
            case_name: litigationData?.litigation?.case_name,
            state: litigationData?.litigation?.state,
            county: litigationData?.litigation?.county,
            jurisdiction_obj: litigationData?.litigation?.jurisdiction_obj,
            jurisdiction_type: litigationData?.litigation?.jurisdiction_type,
            DirCourt: litigationData?.litigation?.DirCourt,
            DirDepartment: litigationData?.litigation?.DirDepartment,
            court_contact: litigationData?.litigation?.court_contact,
            department_contact: litigationData?.litigation?.clerk_contact,
            court_name: litigationData?.litigation?.court_name,
            court_title1: litigationData?.litigation?.court_title1,
            court_title2: litigationData?.litigation?.court_title2,
            department: litigationData?.litigation?.department,
            clerk_first_name: litigationData?.litigation?.clerk_first_name,
            clerk_last_name: litigationData?.litigation?.clerk_last_name,
            floor: litigationData?.litigation?.floor,
            room: litigationData?.litigation?.room,
            deps: litigationData?.litigation?.deps,
            filing_type: litigationData?.litigation?.filing_type,
        },
        CourtData: {
            litigation_id: litigationData?.litigation?.id,
            courtId: litigationData?.litigation?.DirCourt?.id,
            county: litigationData?.litigation?.county,
            state: litigationData?.litigation?.state,
            jurisdiction_type: litigationData?.litigation?.jurisdiction_type,
            jurisdiction_obj: litigationData?.litigation?.jurisdiction_obj,
            court_name: litigationData?.litigation?.court_name,
            court_title1: litigationData?.litigation?.court_title1,
            court_title2: litigationData?.litigation?.court_title2,
            court_contact: litigationData?.litigation?.court_contact,
        },
        JudgeData: {
            courtId: litigationData?.litigation?.DirCourt?.id,
            litigation_id: litigationData?.litigation?.id,
            departmentId: litigationData?.litigation?.DirDepartment?.id,
            judgeId: litigationData?.litigation?.DirJudge?.id,
            judge_contact: litigationData?.litigation?.judge_department_contact,
            clerk_contact: litigationData?.litigation?.clerk_contact,
            judge_first_name: litigationData?.litigation?.judge_first_name,
            judge_last_name: litigationData?.litigation?.judge_last_name,
            department: litigationData?.litigation?.department,
            clerk_first_name: litigationData?.litigation?.clerk_first_name,
            clerk_last_name: litigationData?.litigation?.clerk_last_name,
            floor: litigationData?.litigation?.floor,
            room: litigationData?.litigation?.room,
            deps: litigationData?.litigation?.deps,
        },
        BlocksData: {
            litigation_id: litigationData?.litigation?.id || null,
            PlaBlock: litigationData?.litigation?.PlaBlock,
            DefBlock: litigationData?.litigation?.DefBlock,
        },
        // ClerkData: {
        //   litigation_id: litigationData?.litigation?.id,
        //   data: litigationData?.litigation?.DirDepartment,
        // },
        };
        return CardsDataSetter;
    }


    useEffect(() => {
        fetchLitigationData();
        setCardsData(settingCardsData());
        if (isLitigationDashboardDataUpdate) {
        setLitigationDashboardDataUpdated(false);
        }
    }, [
        clientId,
        currentCaseId,
        isLitigationDashboardDataUpdate,
        litigationData,
    ]);
    return (
        <>
            <div class="placeholder-panel" onClick={()=>setShowActPopup(true)}>
                <span class="text-center text-uppercase font-weight-semibold">No {panel_name} Added the Case.</span>
                <span class="text-center text-uppercase font-weight-semibold">Click to Add.</span>
            </div>
            {showActPopup && (
            <AddLitigationActPopup
                showPopup={showActPopup}
                handleClose={handleClosePopup}
                litigationDetail={CardsData?.CaseData}
            />
            )}
        </>
    )
}

export default LitigationPlaceholderPanel