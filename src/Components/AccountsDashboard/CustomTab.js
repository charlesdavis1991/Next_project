import React, { useState } from "react";
import "./custom-tab.css";
import { shallowEqual, useSelector } from "react-redux";
import { useMemo } from "react";
import { currencyFormat, getToken } from "../../Utils/helper";
import { useEffect } from "react";
import axios from "axios";
import { RenderAdditionalRows } from "./AccountsTable";
import SelectAccountsComponent from "./SelectAccounts";

import AccountsTable from "./AccountsTable";

const fetchEnvelopeCost = async (caseId) => {
  const origin = process.env.REACT_APP_BACKEND_URL || "https://dev.simplefirm.com";


  const accessToken = getToken();
  if (!caseId) {
    return { error: "Invalid caseId provided" };
  }

  try {
    const response = await axios.get(`${origin}/api/cost-envelope/${caseId}/`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: accessToken,
      },
    });
    return { data: response.data };
  } catch (error) {
    console.error("Error fetching envelope cost", error);
    return { error: error.message || "Unknown error occurred" };
  }
};

const CustomTab = ({ tabs, buttons = [], envelopeCost, loading, isTrustLedgerOpen, activeTab, accountsCount, selectedAccountState,
  setActiveTab,
  accountsData,
  fetchAccountsData }) => {

  const changeTab = (key) => {
    setActiveTab(key)
    fetchAccountsData(key)
  }

  // const getTabContent = (key) => {
  //   fetchAccountsData(key)
  //   const activeTab = tabs.find((tab) => tab.key === key);
  //   return
  // };

  const currentCase = useSelector(
    (state) => state?.caseData?.current,
    shallowEqual
  );

  const formattedAmount = useMemo(() => {
    return currencyFormat(envelopeCost?.amount || 0);
  }, [envelopeCost?.amount]);


  const open = useSelector((state) => state?.open?.open);

  return (
    <>
      <div style={{ background: 'white', position: 'sticky', top: '0px' }}>
        <div className="accounts-nav-container">
          <span className="page-icon" style={{ width: '42px', marginTop: '-2px', zIndex: 1001 }}>
            <i style={{ height: '32px' }} className="ic ic-42 ic-accounting"></i>
          </span>
          <div className="accounts-nav">

            <div
              className='div-tilted-accounts'
              style={{
                display: 'flex',
                alignItems: 'center',
                paddingLeft: '25px',
                height: "35px",
                transform: 'none',
                fontStyle: 'normal',
                fontSize: '24px',
                fontWeight: 600,
                color: 'white'
              }}
            >{isTrustLedgerOpen ? 'ACCOUNTING TRUST LEDGER' : 'ACCOUNTING'}</div>

            <SelectAccountsComponent accountsCount={accountsCount} selectedAccountState={selectedAccountState} fetchAccountsData={fetchAccountsData} />

            <nav className="m-l-10 w-100 background-temp p-x-10">

              <div className="row" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div
                  className="nav nav-tabs"
                  id="nav-tab-costs"
                  role="tablist"
                  style={{ display: "flex", flexWrap: "wrap" }}
                >
                  {tabs.map((tab) => (
                    <div
                      key={tab.key}
                      className={`custom-tab-cost-page nav-item nav-link tab-item no-wrap ${activeTab === tab.key ? "active" : ""}`}
                      onClick={() => changeTab(tab.key)}
                      role="tab"
                      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                    >
                      <p style={{ fontSize: '14px', margin: '0 5px' }}>{tab.label}</p>
                    </div>
                  ))}
                </div>

                <div style={{ marginLeft: !isTrustLedgerOpen ? '130px' : 0 }}>        {buttons.map(button => <button
                  type="button"
                  className={`${button.className}`}
                  data-toggle={button?.dataToggle}
                  data-target={button?.dataTarget}
                  onClick={button.onClick}
                  style={{
                    background: button.background
                  }}
                >
                  {button.icon && <span className="font-weight-bold pr-2 text-gold">
                    {button.icon}
                  </span>}
                  {button.label}
                </button>)}
                </div>
                <p style={{ color: 'black', marginRight: '44px', textAlign: 'right', width: '170px', fontFamily: 'monospace' }}></p>
              </div>
            </nav>


          </div>
        </div>
      </div>
      <div
        className="tab-content invisible-scrollbar"
        id="nav-tabContent"
        style={{ zIndex: open ? "0" : "", height: '600px', maxHeight: '600px', overflowY: 'auto' }}
      >
        {loading ? <RenderAdditionalRows additionalRows={8} /> : <AccountsTable
          costs={accountsData} fetchAccountsData={fetchAccountsData}
        />}
      </div>
    </>
  );
};

export default React.memo(CustomTab);
