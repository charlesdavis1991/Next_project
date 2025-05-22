import React, { useState } from "react";
import "./custom-tab.css";
import { shallowEqual, useSelector } from "react-redux";
import { useMemo } from "react";
import { currencyFormat, getToken } from "../../Utils/helper";
import { useEffect } from "react";
import axios from "axios";
import { RenderAdditionalRows } from "./CostTable";
import EnvelopeCostComponent from "./EnvelopeCost";


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

const CustomTab = ({ tabs, buttons = [], envelopeCostState, loading, costTotalSummary }) => {
  const [activeTab, setActiveTab] = useState(tabs[0].key);
  const [envelopeCost, setEnvelopeCost] = envelopeCostState;

  const getTabContent = (key) => {
    const activeTab = tabs.find((tab) => tab.key === key);
    return activeTab ? activeTab.content : null;
  };

  const currentCase = useSelector(
    (state) => state?.caseData?.current,
    shallowEqual
  );

  const formattedAmount = useMemo(() => {
    return currencyFormat(envelopeCost?.amount || 0);
  }, [envelopeCost?.amount]);


  const open = useSelector((state) => state?.open?.open);

  // Fetch updated cost when the case ID changes
  useEffect(() => {
    if (!currentCase?.id) {
      console.error("Invalid case ID");
      return;
    }

    fetchEnvelopeCost(currentCase.id).then((result) => {
      if (result.error) {
        console.error("Error fetching envelope cost:", result.error);
      } else {
        setEnvelopeCost(result.data);
      }
    });
  }, [currentCase?.id]);

  return (
    <>
      <div className="cost-nav-container">
        <span className="page-icon" style={{ width: '42px', zIndex: 1001 }}>
          <img className="translate-note-icon" style={{ marginLeft: '-1px', height: '30px' }} src={'/BP_resources/images/icon/costs-icon-color.svg'} />
        </span>
        <div className="cost-nav">

          <EnvelopeCostComponent costTotalSummary={costTotalSummary} />

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
                    onClick={() => setActiveTab(tab.key)}
                    role="tab"
                    style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                  >
                    <p style={{ fontSize: '14px', margin: '0 5px' }}>{tab.label}</p>
                  </div>
                ))}
              </div>

              <div>        {buttons.map(button => <button
                type="button"
                className={`${button.className}`}
                data-toggle={button?.dataToggle}
                data-target={button?.dataTarget}
                onClick={button.onClick}
                style={{ background: button?.background }}
              >
                {button.icon && <span className="font-weight-bold pr-2 text-gold">
                  {button.icon}
                </span>}
                {button.label}
              </button>)}
              </div>
              <p style={{ color: 'black', marginRight: '44px', textAlign: 'right', width: '170px', fontFamily: 'monospace' }}>{currencyFormat(envelopeCost?.amount || 0)}</p>
            </div>
          </nav>
        </div>
      </div>
      <div
        className="tab-content"
        id="nav-tabContent"
        style={{ zIndex: open ? "0" : "" }}
      >
        {loading ? <RenderAdditionalRows additionalRows={8} /> : getTabContent(activeTab)}
      </div>
    </>
  );
};

export default React.memo(CustomTab);
