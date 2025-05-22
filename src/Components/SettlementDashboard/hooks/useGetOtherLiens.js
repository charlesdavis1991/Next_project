import { useEffect, useState, useCallback, useMemo } from "react";
import panelGetApi from "../api/panelGetApi";

const useGetOtherLiens = () => {
    const [otherLiens, setOtherLiens] = useState([]);
    
    const [otherLiensLocks, setOtherLiensLocks] = useState([]);
    const [otherLiensLocksValues, setOtherLiensLocksValues] = useState([]);
    const [medPayLiens, setMedPayLiens] = useState({});
    const [otherLienFinalAmount, setOtherLienFinalAmount] = useState(0.0);

    const [showErrorLeinModal, setShowErrorLienModal] = useState(false);
    const handleLienErrorClose = useCallback(() => setShowErrorLienModal(false), []);
    const handleLienErrorShow = useCallback(() => setShowErrorLienModal(true), []);
    
    // Memoized modal handlers
    const [showEditOtherLien, setShowEditLien] = useState(false);
    const handleEditOtherLienClose = useCallback(() => setShowEditLien(false), []);
    const handleEditOtherLienShow = useCallback(() => setShowEditLien(true), []);


    // Memoized API call for Insurance Liens
    const fetchOtherLiens = useCallback(async () => {
        try {
            const res = await panelGetApi("other-liens");
            if (res) {
                setOtherLiens(res.data);
                setOtherLiensLocksValues(res.other_liens_p);
                setOtherLiensLocks(
                    res.data.map((obj) => ({
                        id: obj.id,
                        isDraftLocked: obj.draft1_checked,
                        isFinalLocked: obj.final_checked,
                        isFinalAmount:obj.final,
                        isDraftAmount:obj.draft1,
                        checkID: obj.checkID,
                    }))
                );
                setOtherLienFinalAmount(res.total_other_liens);
            }
        } catch (error) {
            console.error("Failed to fetch Other Liens:", error);
        }
    }, []);

    // Fetch liens data on component mount
    useEffect(() => {
        fetchOtherLiens();
    }, [fetchOtherLiens]);

    // Memoized function to update liens state
    const updateOtherLiensStates = useCallback(async () => {
        try {
            const res = await panelGetApi("other-liens");
            if (res) {
                setOtherLiens(res.data);
                setOtherLiensLocksValues(res.other_liens_p);
                setOtherLiensLocks(
                    res.data.map((obj) => ({
                        id: obj.id,
                        isDraftLocked: obj.draft1_checked,
                        isFinalLocked: obj.final_checked,
                        isFinalAmount:obj.final,
                        isDraftAmount:obj.draft1,
                        checkID: obj.checkID,
                    }))
                );
                setOtherLienFinalAmount(res.total_other_liens);
            }
        } catch (error) {
            console.error("Failed to fetch Other Liens:", error);
        }
    }, []);

    // Memoize return values to prevent unnecessary re-renders
    return useMemo(() => ({
        otherLiens,
        setOtherLiens,
        otherLiensLocks,
        setOtherLiensLocks,
        otherLiensLocksValues,
        setOtherLiensLocksValues,
        otherLienFinalAmount,
        setOtherLienFinalAmount,
        showErrorLeinModal,
        handleLienErrorClose,
        handleLienErrorShow,
        showEditOtherLien,
        handleEditOtherLienClose,
        handleEditOtherLienShow,
        updateOtherLiensStates,
    }), [
        otherLiens,
        otherLiensLocks,
        otherLiensLocksValues,
        otherLienFinalAmount,
        showEditOtherLien,
        showErrorLeinModal,
        updateOtherLiensStates,
    ]);
}

export default useGetOtherLiens