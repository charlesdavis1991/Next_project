import { useEffect, useState, useCallback, useMemo } from 'react';
import panelGetApi from '../api/panelGetApi';


const useGetOffers = () => {
    const [offersLocks, setOffersLocks] = useState([]);
    const [offers, setOffers] = useState([]);
    const [groupedOffers, setGroupedOffers] = useState([]);
    const [offerFinalAmount, setOfferFinalAmount] = useState(0.0);
    const [offerLockValues, setOfferLockValues] = useState([]);
    const [showOfferModal, setShowModal] = useState(false);
    const [currentOffer, setCurrentOffer] = useState({});
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [offersCount, setOffersCount] = useState(0);

    // Memoized handlers to prevent re-creation
    const handleOfferClose = useCallback(() => setShowModal(false), []);
    const handleOfferShow = useCallback(() => setShowModal(true), []);
    const handleErrorClose = useCallback(() => setShowErrorModal(false), []);
    const handleErrorShow = useCallback(() => setShowErrorModal(true), []);

    // Fetch offers data with memoization
    const fetchOffers = useCallback(async () => {
        try {
            const res = await panelGetApi("recovery");
            if (res) {
                console.log(res.grouped_offers);
                setOffersCount(res.offer_count);
                setGroupedOffers(res.grouped_offers);
                setOfferFinalAmount(res.offer_amount_total);
                setOfferLockValues([res.offers_total_draft, res.offers_total_final]);
                setOffersLocks(
                    res.grouped_offers.flatMap((group) =>
                        group.offers_list.map((obj) => ({
                            id: obj.id,
                            isDraftLocked: obj.draft1_checked,
                            isFinalLocked: obj.final_checked,
                            isFinalAmount:obj.final,
                            isDraftAmount:obj.draft1,
                            checkID: obj.checkID,
                        }))
                    )
                );
                setOffers(res.offers);
            }
        } catch (error) {
            console.error("Failed to fetch Offers:", error);
        }
    }, []);

    // Fetch offers on component mount
    useEffect(() => {
        fetchOffers();
    }, [fetchOffers]);

    // Memoized function to update offers state
    const updateOffersState = useCallback(async () => {
        try {
            const res = await panelGetApi("recovery");
            if (res) {
                setOffersCount(res.offer_count);
                console.log(res.grouped_offers);
                setGroupedOffers(res.grouped_offers);
                setOfferFinalAmount(res.offer_amount_total);
                setOfferLockValues([res.offers_total_draft, res.offers_total_final]);
                setOffersLocks(
                    res.grouped_offers.flatMap((group) =>
                        group.offers_list.map((obj) => ({
                            id: obj.id,
                            isDraftLocked: obj.draft1_checked,
                            isFinalLocked: obj.final_checked,
                            isFinalAmount:obj.final,
                            isDraftAmount:obj.draft1,
                            checkID: obj.checkID,
                        }))
                    )
                );
                setOffers(res.offers);
            }
        } catch (error) {
            console.error("Error fetching grouped offers:", error);
        }
    }, []);

    // Memoize return values to avoid unnecessary re-renders
    return useMemo(() => ({
        offersLocks, setOffersLocks,
        offers, setOffers,
        groupedOffers, setGroupedOffers,
        offerFinalAmount,
        offerLockValues, setOfferLockValues,
        showOfferModal, handleOfferClose,
        handleOfferShow,
        currentOffer, setCurrentOffer,
        showErrorModal,
        handleErrorClose,
        handleErrorShow,
        updateOffersState,
        offersCount, setOffersCount
    }), [
        offersLocks, offers, groupedOffers, offerFinalAmount, offerLockValues,
        showOfferModal, showErrorModal, currentOffer, offersCount, updateOffersState
    ]);
};

export default useGetOffers;
