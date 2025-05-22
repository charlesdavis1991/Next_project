import { useEffect, useState, useCallback, useMemo } from 'react';
import panelGetApi from '../api/panelGetApi';

const useGetMedicalBills = () => {
    const [medicalBillsLocks, setMedicalBillsLocks] = useState([]);
    const [medicalBills, setMedicalBills] = useState([]);
    const [medicalBillFinalAmount, setMedicalBillFinalAmount] = useState(0.0);
    const [medicalBillLockValues, setMedicalBillLockValues] = useState([]);
    const [showMedBillModal, setShowModal] = useState(false);
    const [currentMedicalBill, setCurrentMedicalBill] = useState({});
    const [showErrorModal, setShowErrorModal] = useState(false);

    // Memoized handlers to prevent re-creation
    const handleMedBillClose = useCallback(() => setShowModal(false), []);
    const handleMedBillShow = useCallback(() => setShowModal(true), []);
    const handleErrorClose = useCallback(() => setShowErrorModal(false), []);
    const handleErrorShow = useCallback(() => setShowErrorModal(true), []);

    // Fetch medical bills data with memoization
    const fetchMedicalBills = useCallback(async () => {
        try {
            const res = await panelGetApi("medical-bills");
            if (res) {
                setMedicalBillFinalAmount(res.total_medical_bills);
                setMedicalBillLockValues(res.providers_p);
                setMedicalBillsLocks(
                    res.data.map((obj) => ({
                        id: obj.id,
                        isDraftLocked: obj.draft1_checked,
                        isFinalLocked: obj.final_checked,
                        isFinalAmount:obj.final,
                        isDraftAmount:obj.draft1,
                        checkID: obj.checkID,
                    }))
                );
                setMedicalBills(res.data);
            }
        } catch (error) {
            console.error("Failed to fetch medical bills:", error);
        }
    }, []);

    // Fetch medical bills on component mount
    useEffect(() => {
        fetchMedicalBills();
    }, [fetchMedicalBills]);

    // Memoized function to update medical bills state
    const updateMedicalBillsState = useCallback(async () => {
        try {
            const res = await panelGetApi("medical-bills");
            if (res) {
                
                setMedicalBillFinalAmount(res.total_medical_bills);
                setMedicalBillLockValues(res.providers_p);
                setMedicalBillsLocks(
                    res.data.map((obj) => ({
                        id: obj.id,
                        isDraftLocked: obj.draft1_checked,
                        isFinalLocked: obj.final_checked,
                        isFinalAmount:obj.final,
                        isDraftAmount:obj.draft1,
                        checkID: obj.checkID,
                    }))
                );
                setMedicalBills(res.data);
            }
        } catch (error) {
            console.error("Failed to fetch medical bills:", error);
        }
    }, []);

    // Memoize return values to avoid unnecessary re-renders
    return useMemo(() => ({
        medicalBillsLocks, setMedicalBillsLocks,
        medicalBills, setMedicalBills,
        medicalBillFinalAmount,
        medicalBillLockValues, setMedicalBillLockValues,
        showMedBillModal, handleMedBillClose,
        handleMedBillShow,
        currentMedicalBill, setCurrentMedicalBill,
        showErrorModal,
        handleErrorClose,
        handleErrorShow,
        updateMedicalBillsState,
    }), [
        medicalBillsLocks, medicalBills, medicalBillFinalAmount, medicalBillLockValues,
        showMedBillModal, showErrorModal, currentMedicalBill, updateMedicalBillsState
    ]);
};

export default useGetMedicalBills;
