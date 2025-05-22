import { useEffect, useState, useCallback, useMemo } from "react";
import panelGetApi from "../api/panelGetApi";

const useGetLiens = () => {
    const [insuranceLiens, setInsuranceLiens] = useState([]);
    const [insuranceLiensLocks, setInsuranceLiensLocks] = useState([]);
    const [insuranceLiensLocksValues, setInsuranceLiensLocksValues] = useState([]);
    const [medPayLiens, setMedPayLiens] = useState({});
    const [insuranceLienFinalAmount, setInsuranceLienFinalAmount] = useState(0.0);

    const [healthInsuranceLiens, setHealthInsuranceLiens] = useState({});

    const [showErrorMedModal, setShowErrorModalMed] = useState(false);
    const [showErrorHealthModal, setShowErrorModalHealth] = useState(false);
    const [showErrorLeinModal, setShowErrorLienModal] = useState(false);

    // Memoized modal handlers
    const handleMedErrorClose = useCallback(() => setShowErrorModalMed(false), []);
    const handleMedErrorShow = useCallback(() => setShowErrorModalMed(true), []);
    const handleHealthErrorClose = useCallback(() => setShowErrorModalHealth(false), []);
    const handleHealthErrorShow = useCallback(() => setShowErrorModalHealth(true), []);

    const handleLienErrorClose = useCallback(() => setShowErrorLienModal(false), []);
    const handleLienErrorShow = useCallback(() => setShowErrorLienModal(true), []);


    const [showEditLien, setShowEditLien] = useState(false);

    // Memoized modal handlers
    const handleEditLienClose = useCallback(() => setShowEditLien(false), []);
    const handleEditLienShow = useCallback(() => setShowEditLien(true), []);

    // Memoized API call for Med Pay Liens
    const fetchMedPayLiens = useCallback(async () => {
        try {
            const res = await panelGetApi("medical-pay-lien");
            if (res) {
                setMedPayLiens(res.data);
            }
        } catch (error) {
            console.error("Failed to fetch Med Pay Liens:", error);
        }
    }, []);

    // Memoized API call for Health Insurance Liens
    const fetchHealthInsuranceLiens = useCallback(async () => {
        try {
            const res = await panelGetApi("health-insurance-lien");
            if (res) {
                setHealthInsuranceLiens(res.data);
            }
        } catch (error) {
            console.error("Failed to fetch Health Insurance Liens:", error);
        }
    }, []);

    // Memoized API call for Insurance Liens
    const fetchInsuranceLiens = useCallback(async () => {
        try {
            const res = await panelGetApi("insurance-liens");
            if (res) {
                setInsuranceLiens(res.data);
                setInsuranceLiensLocksValues(res.insurance_liens_p);
                setInsuranceLiensLocks(
                    res.data.map((obj) => ({
                        id: obj.id,
                        isDraftLocked: obj.draft1_checked,
                        isFinalLocked: obj.final_checked,
                        isFinalAmount:obj.final,
                        isDraftAmount:obj.draft1,
                        checkID: obj.checkID,
                    }))
                );
                setInsuranceLienFinalAmount(res.total_insurance_liens);
            }
        } catch (error) {
            console.error("Failed to fetch Insurance Liens:", error);
        }
    }, []);

    // Fetch liens data on component mount
    useEffect(() => {
        fetchInsuranceLiens();
        fetchMedPayLiens();
        fetchHealthInsuranceLiens();
    }, [fetchInsuranceLiens, fetchMedPayLiens, fetchHealthInsuranceLiens]);

    // Memoized function to update liens state
    const updateLiensStates = useCallback(async () => {
        try {
            const [res,res1, res2] = await Promise.all([
                panelGetApi("insurance-liens"),
                panelGetApi("medical-pay-lien"),
                panelGetApi("health-insurance-lien")
            ]);
            if (res){
                    setInsuranceLiens(res.data);
                    setInsuranceLiensLocksValues(res.insurance_liens_p);
                    setInsuranceLiensLocks(
                        res.data.map((obj) => ({
                            id: obj.id,
                            isDraftLocked: obj.draft1_checked,
                            isFinalLocked: obj.final_checked,
                            isFinalAmount:obj.final,
                            isDraftAmount:obj.draft1,
                            checkID: obj.checkID,
                        }))
                    );
                    setInsuranceLienFinalAmount(res.total_insurance_liens);
                };
            if (res1) setMedPayLiens(res1.data);
            if (res2) setHealthInsuranceLiens(res2.data);
        } catch (error) {
            console.error("Failed to fetch Liens:", error);
        }
    }, []);

    // Memoize return values to prevent unnecessary re-renders
    return useMemo(() => ({
        insuranceLienFinalAmount,
        setInsuranceLienFinalAmount,
        insuranceLiens,
        setInsuranceLiens,
        insuranceLiensLocks,setInsuranceLiensLocks,
        insuranceLiensLocksValues,
        setInsuranceLiensLocksValues,
        medPayLiens,
        setMedPayLiens,
        healthInsuranceLiens,
        setHealthInsuranceLiens,
        showErrorMedModal,
        handleMedErrorClose,
        handleMedErrorShow,
        showErrorHealthModal,
        handleHealthErrorClose,
        handleHealthErrorShow,
        showEditLien,
        handleEditLienClose,
        handleEditLienShow,
        showErrorLeinModal,
        handleLienErrorClose,
        handleLienErrorShow,
        updateLiensStates,
    }), [
        insuranceLienFinalAmount,
        insuranceLiens,
        insuranceLiensLocks,
        insuranceLiensLocksValues,
        medPayLiens,
        healthInsuranceLiens,
        showEditLien,
        showErrorMedModal,
        showErrorHealthModal,
        showErrorLeinModal,
        updateLiensStates,
    ]);
};

export default useGetLiens;
