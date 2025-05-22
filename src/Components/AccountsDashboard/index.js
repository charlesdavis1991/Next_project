import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import AccountsManagementModal from "./AccountsManagementModal";
import AccountsTabs from "./AccountsTabs";
import { useUpdateTrigger } from "./TriggerUpdateContext";
import { useDispatch, useSelector } from "react-redux";
import { useDocumentModal } from "../DocumentModal/DocumentModalContext";
import NotesSectionDashboard from "../NotesSectionDashboard/main";
import {
  getCaseId,
  getClientId,
  fetchShakespeareStatus,
  getToken
} from "../../Utils/helper";
import api, { api_without_cancellation } from "../../api/api";

const fetchCostData = async (clientId, caseId) => {
  const accessToken = getToken();
  const origin = process.env.REACT_APP_BACKEND_URL || "https://dev.simplefirm.com";
  const { data } = await axios.get(`${origin}/api/costs/${clientId}/${caseId}/`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: accessToken,
    },
  });
  return data;
};

const AccountsDashboard = () => {
  const dispatch = useDispatch();
  const currentCase = useSelector((state) => state?.caseData?.current);
  const client = useSelector((state) => state?.client?.current);
  const { triggerUpdate } = useUpdateTrigger();
  const { toggleVar } = useDocumentModal();

  const [costTotalSummary, setCostTotalSummary] = useState({
    totalCreditCard: 0,
    paid: 0,
    openNotRequested: 0,
    requested: 0,
    totalAmount: 0,
  });

  const [costs, setCosts] = useState([]);
  const [envelopeCost, setEnvelopeCost] = useState({});
  const [selectedAccount, setSelectedAccount] = useState('all');
  const [accountsCount, setAccountsCount] = useState({
    General: 0,
    IOLTA: 0,
    Costs: 0
  });
  const [requestedCosts, setRequestedCosts] = useState([]);
  const [creditCardCosts, setCreditCardCosts] = useState([]);
  const [openCosts, setOpenCosts] = useState([]);
  const [paidCosts, setPaidCosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [slotDetails, setSlotDetails] = useState({});
  const [isTrustLedgerOpen, setIsTrustLedgerOpen] = useState(false);

  const [accountsData, setAccountsData] = useState([]);
  const origin = process.env.REACT_APP_BACKEND_URL;

  // Function to update total amount when envelope cost changes
  const updateTotalAmount = useCallback((updatedEnvelopeCost) => {
    setEnvelopeCost(updatedEnvelopeCost); // Update envelope cost state
    setCostTotalSummary((prevState) => ({
      ...prevState,
      totalAmount: (parseFloat(prevState.totalAmount) - parseFloat(envelopeCost.amount || 0)) + parseFloat(updatedEnvelopeCost.amount || 0),
    }));
  }, [envelopeCost]);


  const [activeTab, setActiveTab] = useState("all");
  

  const fetchAccountsData = async (key = activeTab) => {
    setIsLoading(true)
    try {
      // const response = await api_without_cancellation.get(
      //   origin +
      //   `/api/documents/get-courtforms/?client_id=${getClientId()}&case_id=${getCaseId()}`
      // );
      const response = await api_without_cancellation.get(
        origin +
        `/api/accounting-page/checks/?case_id=${getCaseId()}&query_type=${key}`
      );
      if (response.status == 200) {
        console.log("fetchAccountsData",response.data.data)
        setAccountsData(response.data.data)
        setIsLoading(false)
      }
    } catch (error) {
      console.log("Failed to fetch Litigation Data:", error);
    } 
  };


  useEffect(() => {
    fetchAccountsData()
  }, [])

  useEffect(() => {
    (async () => {
      // setIsLoading(true);
      try {
        const data = await fetchCostData(getClientId() ?? 0, getCaseId() ?? 0);
        if (data) {
        setCostTotalSummary((prevState) => ({
          ...prevState,
          totalCreditCard: data.total_credit_card ?? 0,
          paid: data.paid ?? 0,
          openNotRequested: data.open_not_requested ?? 0,
          requested: data.requested ?? 0,
          totalAmount: parseFloat(data.total_amount || 0) + parseFloat(data.envelope_cost.amount || 0), // Only set the base totalAmount here
        }));
        setEnvelopeCost(data.envelope_cost ?? {});
        setCosts(data.costs ?? []);
        setRequestedCosts(data.requested_costs ?? []);
        setCreditCardCosts(data.credit_card_costs ?? []);
        setOpenCosts(data.open_costs ?? []);
        setPaidCosts(data.paid_costs ?? []);
        setSlotDetails(data.slot_details ?? {});
        }
      } catch (error) {
        console.error("Failed to fetch costs:", error);
      } finally {
        setIsLoading(false);
      }
    })();

    fetchShakespeareStatus(getCaseId(), getClientId(), "Costs", dispatch);
  }, [triggerUpdate, currentCase, client, toggleVar]);

  return (
    <div style={{ paddingTop: '131px' }} className="main-content">
      <AccountsManagementModal />
      <AccountsTabs
        openCosts={openCosts}
        requestedCosts={requestedCosts}
        costs={costs}
        creditCardCosts={creditCardCosts}
        paidCosts={paidCosts}
        slotDetails={slotDetails}
        envelopeCostState={envelopeCost}
        onUpdate={updateTotalAmount}
        loading={isLoading || !currentCase || !client}
        isTrustLedgerOpenState={[isTrustLedgerOpen, setIsTrustLedgerOpen]}
        selectedAccountState={[selectedAccount, setSelectedAccount]}
        accountsCountState={[accountsCount, setAccountsCount]}
        
        activeTab = {activeTab}
        setActiveTab = {setActiveTab}
        accountsData = {accountsData}
        fetchAccountsData = {fetchAccountsData}

      />
      {!isTrustLedgerOpen && <NotesSectionDashboard />}
    </div>
  );
};

export default AccountsDashboard;
