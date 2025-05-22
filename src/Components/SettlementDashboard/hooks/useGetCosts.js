import { useEffect, useState, useCallback, useMemo } from "react";
import panelGetApi from "../api/panelGetApi";
import { getCaseId,getToken} from "../../../Utils/helper";
import axios from "axios";

const CostEnvelopeApi = async (baseStr) => {
    const accessToken = getToken();
    const caseId = getCaseId();
    const origin = process.env.REACT_APP_BACKEND_URL || "https://dev.simplefirm.com";
    const { data } = await axios.get(`${origin}/api/${baseStr}/${caseId}/`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: accessToken,
        },
    });
    return data;
};

const useGetCosts = () => {
    const [costEnvelope,setCostEnvelope] = useState({
        "id": 0,
        "amount": "0.00",
        "applied_automatically": false,
        "for_case": 115
    });
    const [costsLocks, setCostsLocks] = useState([]);
    const [costs, setCosts] = useState([]);
    const [costFinalAmount, setCostFinalAmount] = useState(0.0);
    const [costLockValues, setCostLockValues] = useState([]);
    const [currentCost, setCurrentCost] = useState({});
    const [showCostModal, setShowModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [itemizedCost, setItemizedCost] = useState({
        open: 0,
        open_count: 0,
        paid: 0,
        paid_count: 0,
        requested: 0,
        requested_count: 0,
        total_amount: 0,
        chv_settle: {},
    });

    // Memoized modal handlers
    const handleCostClose = useCallback(() => setShowModal(false), []);
    const handleCostShow = useCallback(() => setShowModal(true), []);
    const handleErrorClose = useCallback(() => setShowErrorModal(false), []);
    const handleErrorShow = useCallback(() => setShowErrorModal(true), []);

    // Fetch costs data with memoization
    const fetchCosts = useCallback(async () => {
        try {
            const [res, res1] = await Promise.all([
                panelGetApi("costs"),
                CostEnvelopeApi("cost-envelope"),
            ]);
            if (res) {
                
                setItemizedCost({
                    open: res.open,
                    open_count: res.open_count,
                    paid: res.paid,
                    paid_count: res.paid_count,
                    requested: res.requested,
                    requested_count: res.requested_count,
                    total_amount: res.total_amount,
                    chv_settle: res.chv_settle,
                });
                setCostFinalAmount(res.total_costs);
                setCostLockValues([res.chv_settle.draft1, res.chv_settle.final]);
                setCostsLocks(
                    res.costs_data.map((obj) => ({
                        id: obj.id,
                        isDraftLocked: obj.draft1_checked,
                        isFinalLocked: obj.final_checked,
                        checkID: obj.checkID,
                    }))
                );
                setCosts(res.costs_data);

            }
            if(res1){
                setCostEnvelope(res1)
                console.log("COST ENVELOPE AKA FIXED:",res1)
            }
        } catch (error) {
            console.error("Failed to fetch Costs:", error);
        }
    }, []);

    // Fetch costs on component mount
    useEffect(() => {
        fetchCosts();
    }, [fetchCosts]);

    // Memoized function to update costs state
    const updateCostsState = useCallback(async () => {
        try {
            const [res, res1] = await Promise.all([
                panelGetApi("costs"),
                CostEnvelopeApi("cost-envelope"),
            ]);
            if (res) {
                
                setItemizedCost({
                    open: res.open,
                    open_count: res.open_count,
                    paid: res.paid,
                    paid_count: res.paid_count,
                    requested: res.requested,
                    requested_count: res.requested_count,
                    total_amount: res.total_amount,
                    chv_settle: res.chv_settle,
                });
                setCostFinalAmount(res.total_costs);
                setCostLockValues([res.chv_settle.draft1, res.chv_settle.final]);
                setCostsLocks(
                    res.costs_data.map((obj) => ({
                        id: obj.id,
                        isDraftLocked: obj.draft1_checked,
                        isFinalLocked: obj.final_checked,
                        checkID: obj.checkID,
                    }))
                );
                setCosts(res.costs_data);

            }
            if(res1){
                setCostEnvelope(res1)
                console.log("COST ENVELOPE AKA FIXED:",res1)
            }
        } catch (error) {
            console.error("Failed to fetch Costs:", error);
        }
    }, []);

    // Memoize return values to prevent unnecessary re-renders
    return useMemo(() => ({
        costsLocks, setCostsLocks,
        costs, setCosts,
        costFinalAmount,
        costLockValues, setCostLockValues,
        showCostModal, handleCostClose,
        handleCostShow,
        currentCost, setCurrentCost,
        showErrorModal, handleErrorClose, handleErrorShow,
        itemizedCost, setItemizedCost,
        updateCostsState,
        costEnvelope, setCostEnvelope,
    }), [
        costsLocks, costs, costFinalAmount, costLockValues, showCostModal,
        showErrorModal, currentCost, itemizedCost, updateCostsState,costEnvelope, setCostEnvelope
    ]);
};

export default useGetCosts;
