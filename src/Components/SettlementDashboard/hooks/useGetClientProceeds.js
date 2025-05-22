import { useEffect, useState, useCallback, useMemo } from "react";
import panelGetApi from "../api/panelGetApi";


const useGetClientProceeds = () => {
    const [checks, setChecks] = useState([]);
    const [checksLocks, setChecksLocks] = useState([]);
    const [checksLocksValues, setChecksLocksValues] = useState([]);
    const [clientProceed, setClientProceed] = useState({});
    const [clientProceedFinalAmount, setClientProceedFinalAmount] = useState();

    const [showErrorModal, setShowErrorModal] = useState(false);
    const handleErrorClose = useCallback(() => setShowErrorModal(false), []);
    const handleErrorShow = useCallback(() => setShowErrorModal(true), []);

    const [showClientProceedPopup, setShowClientProceedPopup] = useState(false);
    const handleShowPopup = useCallback(() => setShowClientProceedPopup(true), []);
    const handleClosePopup = useCallback(() => setShowClientProceedPopup(false), []);

    
    // Fetch client-proceeds data with memoization
    const fetchClientProceeds = useCallback(async () => {
        try {
            const res = await panelGetApi("clientproceeds");

            if (res) {
                setChecks(res.data);
                setClientProceed({
                    working:res.total_client_proceeds,
                    balance_record:res.balance_record
                });
                setChecksLocks(
                    res.data.map((obj) => ({
                        id: obj.id,
                        isDraftLocked: obj.draft1_checked,
                        isFinalLocked: obj.final_checked,
                        isFinalAmount:obj.final,
                        isDraftAmount:obj.draft1,
                        checkID: obj.checkID,
                    }))
                );
                setClientProceedFinalAmount(res.total_client_proceeds_amount);
                setChecksLocksValues(res.client_proceeds_p)
            }
        } catch (error) {
            console.error("Failed to fetch Client Proceeds:", error);
        }
    }, []);

    // Fetch Client Proceeds on component mount
    useEffect(() => {
        fetchClientProceeds();
    }, [fetchClientProceeds]);

    // Memoized function to update Client Proceeds state
    const updateClientProceedsState = useCallback(async () => {
        try {
            const res = await panelGetApi("clientproceeds");

            if (res) {
                setChecks(res.data);
                setClientProceed({
                    working:res.total_client_proceeds,
                    balance_record:res.balance_record
                });
                setChecksLocks(
                    res.data.map((obj) => ({
                        id: obj.id,
                        isDraftLocked: obj.draft1_checked,
                        isFinalLocked: obj.final_checked,
                        isFinalAmount:obj.final,
                        isDraftAmount:obj.draft1,
                        checkID: obj.checkID,
                    }))
                );
                setClientProceedFinalAmount(res.total_client_proceeds_amount);
                setChecksLocksValues(res.client_proceeds_p)
            }
        } catch (error) {
            console.error("Failed to fetch Client Proceeds:", error);
        }
    }, []);

    // Memoize return values to prevent unnecessary re-renders
    return useMemo(() => ({
        clientProceedFinalAmount,setClientProceedFinalAmount,
        checksLocks,setChecksLocks,
        checksLocksValues,setChecksLocksValues,
        showErrorModal,handleErrorClose,handleErrorShow,
        checks,setChecks,
        clientProceed,setClientProceed,
        showClientProceedPopup,handleClosePopup,handleShowPopup,
        updateClientProceedsState,
    }), [
        clientProceedFinalAmount, checks, checksLocks,checksLocksValues, showErrorModal, clientProceed, showClientProceedPopup, updateClientProceedsState
    ]);
};

export default useGetClientProceeds;
