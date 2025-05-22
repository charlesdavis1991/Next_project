import { useEffect, useState, useCallback, useMemo } from "react";
import panelGetApi from "../api/panelGetApi";

const useGetLoans = () => {
    const [loansLocks, setLoansLocks] = useState([]);
    const [loans, setLoans] = useState([]);
    const [loansFinalAmount, setLoansFinalAmount] = useState(0.0);
    const [loansLockValues, setLoansLockValues] = useState([]);
    const [showLoanModal, setShowModal] = useState(false);
    const [currentLoan, setCurrentLoan] = useState({});
    const [showErrorLoanModal, setShowErrorModal] = useState(false);

    // Memoized modal handlers to prevent unnecessary re-creations
    const handleLoanClose = useCallback(() => setShowModal(false), []);
    const handleLoanShow = useCallback(() => setShowModal(true), []);
    const handleLoanErrorClose = useCallback(() => setShowErrorModal(false), []);
    const handleLoanErrorShow = useCallback(() => setShowErrorModal(true), []);

    // Fetch loans data with memoization
    const fetchLoans = useCallback(async () => {
        try {
            const res = await panelGetApi("case-loans");
            if (res) {
                setLoansFinalAmount(res.total_loans);
                setLoansLockValues(res.loans_p);
                setLoansLocks(
                    res.data.map((obj) => ({
                        id: obj.id,
                        isDraftLocked: obj.draft1_checked,
                        isFinalLocked: obj.final_checked,
                        isFinalAmount:obj.final,
                        isDraftAmount:obj.draft1,
                        checkID: obj.checkID,
                    }))
                );
                setLoans(res.data);
            }
        } catch (error) {
            console.error("Failed to fetch Loans and advances:", error);
        }
    }, []);

    // Fetch loans on component mount
    useEffect(() => {
        fetchLoans();
    }, [fetchLoans]);

    // Memoized function to update loans state
    const updateLoansState = useCallback(async () => {
        try {
            const res = await panelGetApi("case-loans");
            if (res) {
                setLoansFinalAmount(res.total_loans);
                setLoansLockValues(res.loans_p);
                setLoansLocks(
                    res.data.map((obj) => ({
                        id: obj.id,
                        isDraftLocked: obj.draft1_checked,
                        isFinalLocked: obj.final_checked,
                        isFinalAmount:obj.final,
                        isDraftAmount:obj.draft1,
                        checkID: obj.checkID,
                    }))
                );
                setLoans(res.data);
            }
        } catch (error) {
            console.error("Failed to fetch Loans and advances:", error);
        }
    }, []);

    // Memoize return values to prevent unnecessary re-renders
    return useMemo(() => ({
        loansLocks,
        setLoansLocks,
        loans,
        loansFinalAmount,
        loansLockValues,
        setLoansLockValues,
        showLoanModal,
        handleLoanClose,
        handleLoanShow,
        currentLoan,
        setCurrentLoan,
        showErrorLoanModal,
        handleLoanErrorClose,
        handleLoanErrorShow,
        updateLoansState,
    }), [
        loansLocks, loans, loansFinalAmount, loansLockValues,
        showLoanModal, showErrorLoanModal, currentLoan, updateLoansState
    ]);
};

export default useGetLoans;
