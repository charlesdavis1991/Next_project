import { useEffect, useState, useCallback, useMemo } from "react";
import panelGetApi from "../api/panelGetApi";

const useGetCostsReimbursements = () => {
        const [costsReimbursementsLocks, setCostsReimbursementsLocks] = useState([]);
        const [costsReimbursements, setCostsReimbursements] = useState([]);
        const [costReimbursementsFinalAmount, setCostReimbursementsFinalAmount] = useState(0.0);
        const [costReimbursementsLockValues, setCostReimbursementsLockValues] = useState([]);
        const [showCostModal, setShowModal] = useState(false);
        const [showErrorModal, setShowErrorModal] = useState(false);
    
        // Memoized modal handlers
        const handleCostClose = useCallback(() => setShowModal(false), []);
        const handleCostShow = useCallback(() => setShowModal(true), []);
        const handleErrorClose = useCallback(() => setShowErrorModal(false), []);
        const handleErrorShow = useCallback(() => setShowErrorModal(true), []);

            // Fetch costs data with memoization
    const fetchCostsReimbursements = useCallback(async () => {
        try {
            const  res = await panelGetApi("cost-reimbursement");
            if (res) {
                setCostReimbursementsFinalAmount(res?.total_cost_reimburse);
                setCostReimbursementsLockValues(res?.cost_reimburse_p);
                setCostsReimbursementsLocks(
                    res?.data.map((obj) => ({
                        id: obj.id,
                        isDraftLocked: obj.draft1_checked,
                        isFinalLocked: obj.final_checked,
                        isDraftAmount: obj.draft1,
                        isFinalAmount: obj.final,
                        checkID: obj.checkID,
                    }))
                );
                setCostsReimbursements(res?.data);

            }
        } catch (error) {
            console.error("Failed to fetch Costs Reimbursements:", error);
        }
    }, []);

    // Fetch costs on component mount
    useEffect(() => {
        fetchCostsReimbursements();
    }, [fetchCostsReimbursements]);

    // Memoized function to update costs state
    const updateCostsReimbursementsState = useCallback(async () => {
        try {
            const  res = await panelGetApi("cost-reimbursement");
            if (res) {
                setCostReimbursementsFinalAmount(res?.total_cost_reimburse);
                setCostReimbursementsLockValues(res?.cost_reimburse_p);
                setCostsReimbursementsLocks(
                    res?.data.map((obj) => ({
                        id: obj.id,
                        isDraftLocked: obj.draft1_checked,
                        isFinalLocked: obj.final_checked,
                        isDraftAmount: obj.draft1,
                        isFinalAmount: obj.final,
                        checkID: obj.checkID,
                    }))
                );
                setCostsReimbursements(res?.data);

            }
        } catch (error) {
            console.error("Failed to fetch Costs Reimbursements:", error);
        }
    }, []);

    // Memoize return values to prevent unnecessary re-renders
    return useMemo(() => ({
        costsReimbursementsLocks, setCostsReimbursementsLocks,
        costsReimbursements, setCostsReimbursements,
        costReimbursementsFinalAmount,
        costReimbursementsLockValues, setCostReimbursementsLockValues,
        showCostModal, handleCostClose, handleCostShow,
        showErrorModal, handleErrorClose, handleErrorShow,
        updateCostsReimbursementsState,
    }), [
        costsReimbursementsLocks, costsReimbursements, costReimbursementsFinalAmount, costReimbursementsLockValues,
        showCostModal, showErrorModal, 
        updateCostsReimbursementsState
    ]);
}

export default useGetCostsReimbursements