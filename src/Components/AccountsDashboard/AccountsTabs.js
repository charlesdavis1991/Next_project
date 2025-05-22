import React, { useEffect } from "react";
import CustomTab from "./CustomTab";
import AccountsTable from "./AccountsTable";
import { useCostManagement } from "./AccountsManagementContext";
import { useState } from "react";
import EditEnvelopeCostModal from "./EditEnvelopeCostModal";
import { useCallback } from "react";
import './envelope-cost.css';
import TrustLedgerTable from "./TrustLedgerTable";


const dummyData = [
  {
    key: 'all',
    label: 'All',
    content: [
      {
        id: 1,
        client: {
          name: 'Lakeasha Johnson',
          birthday: '1/15/1972',
          age: 53,
          acceptedDate: '11/21/2017',
          caseType: 'Car Accident'
        },
        category: '',
        requested: {
          by: 'Usama Nawaz',
          on: '12/18/2024'
        },
        account: 'IOLTA',
        payee: 'Test Payee',
        memo: 'Test Memo',
        amount: parseFloat(11.00),
        check: {
          sent: '22/1/2025',
          cleared: '22/1/2025',
        }
      },
      {
        id: 2,
        client: {
          name: 'Lakeasha Johnson',
          birthday: '1/15/1972',
          age: 53,
          acceptedDate: '11/21/2017',
          caseType: 'Car Accident'
        },
        category: '',
        requested: {
          by: 'Usama Nawaz',
          on: '12/18/2024'
        },
        account: 'Costs',
        payee: 'Test Payee',
        memo: 'Test Memo',
        amount: parseFloat(11.00),
        check: {
          sent: '22/1/2025',
          cleared: '22/1/2025',
        }
      },
      {
        id: 3,
        client: {
          name: 'Lakeasha Johnson',
          birthday: '1/15/1972',
          age: 53,
          acceptedDate: '11/21/2017',
          caseType: 'Car Accident'
        },
        category: '',
        requested: {
          by: 'Usama Nawaz',
          on: '12/18/2024'
        },
        account: 'IOLTA',
        payee: 'Test Payee',
        memo: 'Test Memo',
        amount: parseFloat(11.00),
        check: {
          sent: '22/1/2025',
          cleared: '22/1/2025',
        }
      },
      {
        id: 4,
        client: {
          name: 'Lakeasha Johnson',
          birthday: '1/15/1972',
          age: 53,
          acceptedDate: '11/21/2017',
          caseType: 'Car Accident'
        },
        category: '',
        requested: {
          by: 'Usama Nawaz',
          on: '12/18/2024'
        },
        account: 'Costs',
        payee: 'Test Payee',
        memo: 'Test Memo',
        amount: parseFloat(11.00),
        check: {
          sent: '22/1/2025',
          cleared: '22/1/2025',
        }
      },
      {
        id: 5,
        client: {
          name: 'Lakeasha Johnson',
          birthday: '1/15/1972',
          age: 53,
          acceptedDate: '11/21/2017',
          caseType: 'Car Accident'
        },
        category: '',
        requested: {
          by: 'Usama Nawaz',
          on: '12/18/2024'
        },
        account: 'Costs',
        payee: 'Test Payee',
        memo: 'Test Memo',
        amount: parseFloat(11.00),
        check: {
          sent: '22/1/2025',
          cleared: '22/1/2025',
        }
      },
      {
        id: 6,
        client: {
          name: 'Lakeasha Johnson',
          birthday: '1/15/1972',
          age: 53,
          acceptedDate: '11/21/2017',
          caseType: 'Car Accident'
        },
        category: '',
        requested: {
          by: 'Usama Nawaz',
          on: '12/18/2024'
        },
        account: 'Costs',
        payee: 'Test Payee',
        memo: 'Test Memo',
        amount: parseFloat(11.00),
        check: {
          sent: '22/1/2025',
          cleared: '22/1/2025',
        }
      },
      {
        id: 7,
        client: {
          name: 'Lakeasha Johnson',
          birthday: '1/15/1972',
          age: 53,
          acceptedDate: '11/21/2017',
          caseType: 'Car Accident'
        },
        category: '',
        requested: {
          by: 'Usama Nawaz',
          on: '12/18/2024'
        },
        account: 'General',
        payee: 'Test Payee',
        memo: 'Test Memo',
        amount: parseFloat(11.00),
        check: {
          sent: '22/1/2025',
          cleared: '22/1/2025',
        }
      },
      {
        id: 8,
        client: {
          name: 'Lakeasha Johnson',
          birthday: '1/15/1972',
          age: 53,
          acceptedDate: '11/21/2017',
          caseType: 'Car Accident'
        },
        category: '',
        requested: {
          by: 'Usama Nawaz',
          on: '12/18/2024'
        },
        account: 'Costs',
        payee: 'Test Payee',
        memo: 'Test Memo',
        amount: parseFloat(11.00),
        check: {
          sent: '22/1/2025',
          cleared: '22/1/2025',
        }
      },
      {
        id: 9,
        client: {
          name: 'Lakeasha Johnson',
          birthday: '1/15/1972',
          age: 53,
          acceptedDate: '11/21/2017',
          caseType: 'Car Accident'
        },
        category: '',
        requested: {
          by: 'Usama Nawaz',
          on: '12/18/2024'
        },
        account: 'Costs',
        payee: 'Test Payee',
        memo: 'Test Memo',
        amount: parseFloat(11.00),
        check: {
          sent: '22/1/2025',
          cleared: '22/1/2025',
        }
      },
    ]
  },
  {
    content: [
      {
        id: 1,
        client: 'Lakeasha Johnson',
        doi: '11/21/2017',
        caseType: 'Car Accident',
        caseStatus: 'Open',
        requested: {
          deposits: 67,
          fees: 0,
          reimbursements: 0,
          liens: 0,
          balance: 0,
        },
        issued: {
          deposits: 67,
          fees: 0,
          reimbursements: 0,
          liens: 0,
          balance: 0
        },
        cleared: {
          deposits: 67,
          fees: 0,
          reimbursements: 0,
          liens: 0,
          balance: 0
        },
      },
    ]
  },
  {
    content: [
      {
        id: 1,
        client: 'Lakeasha Johnson',
        doi: '11/21/2017',
        caseType: 'Car Accident',
        caseStatus: 'Closed',
        requested: {
          deposits: 67,
          fees: 0,
          reimbursements: 0,
          liens: 0,
          balance: 7,
        },
        issued: {
          deposits: 60,
          fees: 0,
          reimbursements: 0,
          liens: 0,
          balance: 0
        },
        cleared: {
          deposits: 60,
          fees: 0,
          reimbursements: 0,
          liens: 0,
          balance: 0
        },
      },
    ]
  },
  {
    content: [
      {
        id: 2,
        client: 'Lakeasha Johnson',
        doi: '11/21/2017',
        caseType: 'Car Accident',
        caseStatus: 'Closed',
        requested: {
          deposits: 67,
          fees: 0,
          reimbursements: 0,
          liens: 0,
          balance: 0,
        },
        issued: {
          deposits: 67,
          fees: 0,
          reimbursements: 0,
          liens: 0,
          balance: 0
        },
        cleared: {
          deposits: 67,
          fees: 0,
          reimbursements: 0,
          liens: 0,
          balance: 0
        },
      },
      {
        id: 3,
        client: 'Lakeasha Johnson',
        doi: '11/21/2017',
        caseType: 'Car Accident',
        caseStatus: 'Closed',
        requested: {
          deposits: 67,
          fees: 0,
          reimbursements: 0,
          liens: 0,
          balance: 0,
        },
        issued: {
          deposits: 67,
          fees: 0,
          reimbursements: 0,
          liens: 0,
          balance: 0
        },
        cleared: {
          deposits: 67,
          fees: 0,
          reimbursements: 0,
          liens: 0,
          balance: 0
        },
      },
      {
        id: 4,
        client: 'Lakeasha Johnson',
        doi: '11/21/2017',
        caseType: 'Car Accident',
        caseStatus: 'Closed',
        requested: {
          deposits: 67,
          fees: 0,
          reimbursements: 0,
          liens: 0,
          balance: 0,
        },
        issued: {
          deposits: 67,
          fees: 0,
          reimbursements: 0,
          liens: 0,
          balance: 0
        },
        cleared: {
          deposits: 67,
          fees: 0,
          reimbursements: 0,
          liens: 0,
          balance: 0
        },
      },
      {
        id: 5,
        client: 'Lakeasha Johnson',
        doi: '11/21/2017',
        caseType: 'Car Accident',
        caseStatus: 'Closed',
        requested: {
          deposits: 67,
          fees: 0,
          reimbursements: 0,
          liens: 0,
          balance: 0,
        },
        issued: {
          deposits: 67,
          fees: 0,
          reimbursements: 0,
          liens: 0,
          balance: 0
        },
        cleared: {
          deposits: 67,
          fees: 0,
          reimbursements: 0,
          liens: 0,
          balance: 0
        },
      },
      {
        id: 6,
        client: 'Lakeasha Johnson',
        doi: '11/21/2017',
        caseType: 'Car Accident',
        caseStatus: 'Closed',
        requested: {
          deposits: 67,
          fees: 0,
          reimbursements: 0,
          liens: 0,
          balance: 0,
        },
        issued: {
          deposits: 67,
          fees: 0,
          reimbursements: 0,
          liens: 0,
          balance: 0
        },
        cleared: {
          deposits: 67,
          fees: 0,
          reimbursements: 0,
          liens: 0,
          balance: 0
        },
      },
    ]
  }
]


const AccountsTabs = ({
  slotDetails,
  envelopeCostState,
  onUpdate,
  onEditCost = () => { },
  loading,
  isTrustLedgerOpenState,
  selectedAccountState,
  accountsCountState,
  activeTab,
  setActiveTab,
  accountsData,
  fetchAccountsData
}) => {
  const [showEnvelopeModal, setShowEnvelopeModal] = useState(false);

  const [selectedAccount, setSelectedAccount] = selectedAccountState
  const [accountsCount, setAccountsCount] = accountsCountState
  const [isTrustLedgerOpen, setIsTrustLedgerOpen] = isTrustLedgerOpenState

  const handleEditEnvelope = () => {
    setShowEnvelopeModal(true);
  };
  const onHide = useCallback(() => setShowEnvelopeModal(false), []);
  const [envelopeCost, setEnvelopeCost] = useState(envelopeCostState);

  useEffect(() => {
    let accountsCount = { General: 0, IOLTA: 0, Costs: 0 };
    dummyData[0].content.forEach(data => {
      accountsCount[data.account] += 1
    })
    setAccountsCount(p => {
      const prev = { ...p };
      return { ...prev, ...accountsCount }
    })
  }, [])


  let _tabs = [
    {
      key: "all",
      label: "All",
      content: (
        <AccountsTable
          onEditCost={onEditCost}
          costs={dummyData[0].content}
          slotDetails={slotDetails}
        />
      ),
    },
    // {
    //   key: "open",
    //   label: "Open",
    //   content: (
    //     <AccountsTable
    //       onEditCost={onEditCost}
    //       costs={dummyData[0].content}
    //       slotDetails={slotDetails}
    //     />
    //   ),
    // },
    {
      key: "requested",
      label: "Check Requests",
      content: (
        <AccountsTable
          onEditCost={onEditCost}
          costs={dummyData[0].content}
          slotDetails={slotDetails}
        />
      ),
    },
    {
      key: "paid",
      label: "Paid",
      content: (
        <AccountsTable
          onEditCost={onEditCost}
          costs={dummyData[0].content}
          slotDetails={slotDetails}
        />
      ),
    },
    {
      key: "cleared",
      label: "Cleared",
      content: (
        <AccountsTable
          onEditCost={onEditCost}
          costs={[]}
          slotDetails={slotDetails}
        />
      ),
    },
  ];

  const [tabs, setTabs] = useState(_tabs)

  // useEffect(() => {
  //   if (selectedAccount === 'all') {
  //     // setTabsData(dummyData[0].content);
  //     const newTabs = _tabs.map(tab => ({
  //       ...tab,
  //       content: (
  //         <AccountsTable
  //           onEditCost={onEditCost}
  //           costs={dummyData[0].content}
  //           slotDetails={slotDetails}
  //         />
  //       )
  //     }))
  //     setTabs(newTabs)
  //   } else {
  //     const newData = dummyData[0].content.filter(data => data.account === selectedAccount)    
  //     const newTabs = _tabs.map(tab => ({
  //       ...tab,
  //       content: (
  //         <AccountsTable
  //           onEditCost={onEditCost}
  //           costs={newData}
  //           slotDetails={slotDetails}
  //         />
  //       )
  //     }))
  //     // setTabsData(newData)
  //     setTabs(newTabs)
  //   }
  // }, [selectedAccount])


  const ledgerTabs = [
    {
      key: "openWithBalance",
      label: "Open With Balance",
      content: (
        <TrustLedgerTable
          onEditCost={onEditCost}
          costs={dummyData[1].content}
          slotDetails={slotDetails}
        />
      ),
    },
    {
      key: "closedWithBalance",
      label: "Closed With Balance",
      content: (
        <TrustLedgerTable
          onEditCost={onEditCost}
          costs={dummyData[2].content}
          slotDetails={slotDetails}
        />
      ),
    },
    {
      key: "zeroBalance",
      label: "Zero Balance",
      content: (
        <TrustLedgerTable
          onEditCost={onEditCost}
          costs={dummyData[3].content}
          slotDetails={slotDetails}
        />
      ),
    },

  ]
  const { showModal } = useCostManagement();
  const buttons = [
    {
      label: "Checks",
      // icon: "+",
      background: "var(--primary-90)",
      className: "trapezoid-button add-cost-btn",
      dataToggle: "modal",
      dataTarget: "#addCostModal",
      onClick: () => setIsTrustLedgerOpen(false),
    },
    {
      label: "Trust Ledger",
      className: "trapezoid-button cost-envelope-btn",
      background: "var(--primary-80)",
      onClick: () => setIsTrustLedgerOpen(true),
    },
  ];
  return (
    <>
      <EditEnvelopeCostModal
        show={showEnvelopeModal}
        envelopeCost={envelopeCost}
        onHide={onHide}
        onUpdate={(updatedCost) => {
          setEnvelopeCost(updatedCost);
          if (onUpdate) {
            onUpdate(updatedCost);
          }
        }}
      />

      <div
        className="card row col-lg-12"
        style={{
          border: "none",
          padding: 0,
          margin: '0'
        }}
      >
        <CustomTab
          loading={loading}
          isTrustLedgerOpen={isTrustLedgerOpen}
          tabs={isTrustLedgerOpen ? ledgerTabs : tabs}
          buttons={buttons}
          envelopeCost={envelopeCost}
          accountsCount={accountsCount}
          selectedAccountState={selectedAccountState}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          accountsData={accountsData}
          fetchAccountsData={fetchAccountsData}
        />

      </div>
    </>
  );
};

export default React.memo(AccountsTabs);
