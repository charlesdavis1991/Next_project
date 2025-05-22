import React,{ useState, useEffect, useMemo, useCallback } from 'react';
import loanPanelsGetApi from '../common/loanPanelsGetApi';

const useGetLoansPanels = () => {
    const [loans, setLoans] = useState([]);

    const fetchCaseLoans = useCallback(async () => {
        try {
            const res = await loanPanelsGetApi("case-loans");

            if (res) {
                setLoans(res.data)
            }
        } catch (error) {
            console.error("Failed to fetch Case Loans panels:", error);
        }
    }, []);

    // Fetch Case Loans panels on component mount
    useEffect(() => {
        fetchCaseLoans();
    }, [fetchCaseLoans]);

    // Memoized function to update Case Loans panels state
    const updateCaseLoansPanels = useCallback(async () => {
        try {
            const res = await loanPanelsGetApi("case-loans");

            if (res) {
                setLoans(res.data)
            }
        } catch (error) {
            console.error("Failed to fetch Case Loans panels:", error);
        }
    }, []);

    // Memoize return values to prevent unnecessary re-renders
    return useMemo(() => ({
        loans,setLoans,
        updateCaseLoansPanels
    }), [
        loans, 
        updateCaseLoansPanels
    ]);
}

export default useGetLoansPanels