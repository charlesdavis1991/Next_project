import { useEffect, useState, useCallback, useMemo } from "react";
import panelGetApi from "../api/panelGetApi";

const useGetFees = () => {
    const [feesLocks, setFeesLocks] = useState([]);
    const [fees, setFees] = useState([]);
    const [feesFinalAmount, setFeesFinalAmount] = useState(0.0);
    const [feesLockValues, setFeesLockValues] = useState([]);
    const [feesPercentages, setFeePercentages] = useState([]);
    const [feesCombinationList, setFeesCombinationList] = useState([]);
    const [currentCombination, setCurrentCombination] = useState([]);
    const [currentFee, setCurrentFee] = useState({});
    const [offersCount, setOffersCount] = useState(0);
    const [showFeeModal, setShowModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);

    // Memoized modal handlers
    const handleFeeClose = useCallback(() => setShowModal(false), []);
    const handleFeeShow = useCallback(() => setShowModal(true), []);
    const handleErrorClose = useCallback(() => setShowErrorModal(false), []);
    const handleErrorShow = useCallback(() => setShowErrorModal(true), []);

    // Fetch fees data with memoization
    const fetchFees = useCallback(async () => {
        try {
            const res = await panelGetApi("fees");
            if (res) {
                setOffersCount(res.offer_total_count);
                setFeePercentages(res.offer_percentages);
                setFeesFinalAmount(res.total_fees);
                setFeesLockValues(res.fees_p);
                setFeesLocks(
                    res.fees.map((obj) => ({
                        id: obj.id,
                        isDraftLocked: obj.draft1_checked,
                        isFinalLocked: obj.final_checked,
                        isFinalAmount:obj.final,
                        isDraftAmount:obj.draft1,
                        checkID: obj.checkID,
                    }))
                );
                setFees(res.fees);
                setFeesCombinationList(res.fees_combination_list);
            }
        } catch (error) {
            console.error("Failed to fetch Fees:", error);
        }
    }, []);

    // Fetch fees on component mount
    useEffect(() => {
        fetchFees();
    }, [fetchFees]);

    // Memoized function to update fees state
    const updateFeesState = useCallback(async () => {
        try {
            const res = await panelGetApi("fees");
            if (res) {
                setOffersCount(res.offer_total_count);
                setFeePercentages(res.offer_percentages);
                setFeesFinalAmount(res.total_fees);
                setFeesLockValues(res.fees_p);
                setFeesLocks(
                    res.fees.map((obj) => ({
                        id: obj.id,
                        isDraftLocked: obj.draft1_checked,
                        isFinalLocked: obj.final_checked,
                        isFinalAmount:obj.final,
                        isDraftAmount:obj.draft1,
                        checkID: obj.checkID,
                    }))
                );
                setFees(res.fees);
                setFeesCombinationList(res.fees_combination_list);
            }
        } catch (error) {
            console.error("Failed to fetch Fees:", error);
        }
    }, []);

    // Memoize return values to prevent unnecessary re-renders
    return useMemo(() => ({
        feesLocks, setFeesLocks,
        fees, feesPercentages, setFees,
        feesFinalAmount,
        feesLockValues, setFeesLockValues,
        showFeeModal, handleFeeClose, handleFeeShow,
        currentFee, setCurrentFee,
        feesCombinationList, setFeesCombinationList,
        currentCombination, setCurrentCombination,
        showErrorModal, handleErrorClose, handleErrorShow,
        updateFeesState,
        setFeesFinalAmount,
        offersCount
    }), [
        feesLocks, fees, feesPercentages, feesFinalAmount, feesLockValues,
        showFeeModal, showErrorModal, currentFee, feesCombinationList,
        currentCombination, offersCount,setFeesFinalAmount, updateFeesState
    ]);
};

export default useGetFees;
