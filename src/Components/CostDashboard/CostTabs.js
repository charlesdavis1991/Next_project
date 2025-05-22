import React from "react";
import CustomTab from "./CustomTab";
import CostTable from "./CostTable";
import { useCostManagement } from "./CostManagementContext";
import { useState } from "react";
import EditEnvelopeCostModal from "./EditEnvelopeCostModal";
import { useCallback } from "react";


const CostTabs = ({
  costs,
  openCosts,
  requestedCosts,
  paidCosts,
  creditCardCosts,
  slotDetails,
  envelopeCostState,
  onUpdate,
  onEditCost = () => { },
  loading,
  costTotalSummary
}) => {
  const [showEnvelopeModal, setShowEnvelopeModal] = useState(false);


  const handleEditEnvelope = () => {
    setShowEnvelopeModal(true);
  };
  const onHide = useCallback(() => setShowEnvelopeModal(false), []);
  const [envelopeCost, setEnvelopeCost] = envelopeCostState;

  const tabs = [
    {
      key: "all",
      label: "All",
      content: (
        <CostTable
          onEditCost={onEditCost}
          costs={costs}
          slotDetails={slotDetails}
        />
      ),
    },
    {
      key: "open",
      label: "Open",
      content: (
        <CostTable
          onEditCost={onEditCost}
          costs={openCosts}
          slotDetails={slotDetails}
        />
      ),
    },
    {
      key: "requested",
      label: "Requested",
      content: (
        <CostTable
          onEditCost={onEditCost}
          costs={requestedCosts}
          slotDetails={slotDetails}
        />
      ),
    },
    {
      key: "paid",
      label: "Paid",
      content: (
        <CostTable
          onEditCost={onEditCost}
          costs={paidCosts}
          slotDetails={slotDetails}
        />
      ),
    },
    {
      key: "creditCard",
      label: "Credit Card",
      content: (
        <CostTable
          onEditCost={onEditCost}
          costs={creditCardCosts}
          slotDetails={slotDetails}
        />
      ),
    },
  ];
  const { showModal } = useCostManagement();
  const buttons = [
    {
      label: "Add Cost",
      icon: "+",
      className: "trapezoid-button add-cost-btn",
      background: 'var(--primary-90)',
      dataToggle: "modal",
      dataTarget: "#addCostModal",
      onClick: () => showModal({}, false),
    },
    {
      label: "Edit Cost Envelope",
      className: "trapezoid-button cost-envelope-btn",
      background: 'var(--primary-80)',
      onClick: () => handleEditEnvelope(),
    },
  ];
  return (
    <>
      {envelopeCost?.amount && <EditEnvelopeCostModal
        show={showEnvelopeModal}
        envelopeCost={envelopeCost}
        onHide={onHide}
        onUpdate={(updatedCost) => {
          setEnvelopeCost(updatedCost);
          if (onUpdate) {
            onUpdate(updatedCost);
          }
        }}
      />}

      <div
        className="card row col-lg-12"
        style={{
          border: "none",
          padding: 0,
          margin: 0
        }}
      >
        <CustomTab costTotalSummary={costTotalSummary} tabs={tabs} buttons={buttons} envelopeCostState={envelopeCostState} loading={loading} />

      </div>
    </>
  );
};

export default React.memo(CostTabs);
