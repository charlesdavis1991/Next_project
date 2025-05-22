import React from "react";
import TabPanel from "./TabPanel";
import TabNav from "./TabNav";

export default function Tabs() {

  return (
    <div className="custom-tab mt-3">
      <TabNav />
      <TabPanel />
    </div>
  );
}
