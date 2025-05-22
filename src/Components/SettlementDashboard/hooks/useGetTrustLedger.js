import { useEffect, useState, useCallback, useMemo } from 'react';
import panelGetApi from '../api/panelGetApi';
import { getCaseId, getClientId, getToken } from '../../../Utils/helper';
import axios from 'axios';

const sortApi = async (baseStr,sorting) => {
    let sortBy = sorting.column;
    if(sorting.order=="desc")
        sortBy = `-${sortBy}`;
    const accessToken = getToken();
    const caseId = getCaseId();
    const clientId = getClientId();
    const origin = process.env.REACT_APP_BACKEND_URL || "https://dev.simplefirm.com";
    const { data } = await axios.get(`${origin}/api/settlement-page/${baseStr}/?case_id=${caseId}&client_id=${clientId}&sort_by=${sortBy}`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: accessToken,
        },
    });
    return data;
};

const useGetTrustLedger = () => {
    const [otherChecks, setOtherChecks] = useState([]);
    const [offerChecks, setOfferChecks] = useState([]);
    const [verifySlot, setVerifySlot] = useState({});
    const [checkSentSlot, setCheckSentSlot] = useState({});
    const [checkClearedSlot, setCheckClearedSlot] = useState({});


    // Fetch Trust Ledger data with memoization
    const fetchTrustLedger = useCallback(async () => {
        try {
            const res = await panelGetApi("trust-ledger");
            if (res) {
                setOfferChecks(res.data.offer_checks)
                setOtherChecks(res.data.other_checks)
                setVerifySlot(res.data.verify_slot)
                setCheckSentSlot(res.data.check_as_sent_slot)
                setCheckClearedSlot(res.data.check_cleared_slot)
            }
        } catch (error) {
            console.error("Failed to fetch Trust Ledger:", error);
        }
    }, []);

    // Fetch Trust Ledger on component mount
    useEffect(() => {
        fetchTrustLedger();
    }, [fetchTrustLedger]);

    // Memoized function to update Trust Ledger state
    const sortedTrustLedger = useCallback(async (sectionName,sortBy) => {
        try {
            const res = await sortApi("trust-ledger",sortBy);
            if (res) {
                if(sectionName==="offer_checks"){
                    setOfferChecks(res.data.offer_checks)
                }
                else{
                    setOtherChecks(res.data.other_checks)
                }
                setVerifySlot(res.data.verify_slot)
                setCheckSentSlot(res.data.check_as_sent_slot)
                setCheckClearedSlot(res.data.check_cleared_slot)

            }
        } catch (error) {
            console.error("Failed to fetch Trust Ledger:", error);
        }
    }, []);

    // Memoized function to update Trust Ledger state
    const updateTrustLedger = useCallback(async () => {
        try {
            const res = await panelGetApi("trust-ledger");
            if (res) {
                setOfferChecks(res.data.offer_checks)
                setOtherChecks(res.data.other_checks)
                setVerifySlot(res.data.verify_slot)
                setCheckSentSlot(res.data.check_as_sent_slot)
                setCheckClearedSlot(res.data.check_cleared_slot)
            }
        } catch (error) {
            console.error("Failed to fetch Trust Ledger:", error);
        }
    }, []);

    // Memoize return values to avoid unnecessary re-renders
    return useMemo(() => ({
        otherChecks, setOtherChecks,
        offerChecks,setOfferChecks,
        verifySlot, setVerifySlot,
        checkSentSlot, setCheckSentSlot,
        checkClearedSlot, setCheckClearedSlot,
        updateTrustLedger,sortedTrustLedger
    }), [
        otherChecks, verifySlot, checkSentSlot, checkClearedSlot, updateTrustLedger,sortedTrustLedger
    ]);
}

export default useGetTrustLedger