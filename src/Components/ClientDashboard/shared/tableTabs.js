import React, { useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Table from "./table";
import EventLogTable from './eventLogTable';


function MyTabs() {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabSelect = (index) => {
    setSelectedTab(index);
  };

  return (
    <div className='mt-2 mb-4'>
      <Tabs onSelect={handleTabSelect} selectedIndex={selectedTab}>
        <TabList className="tab-list-border-none">
          <Tab className={`custom-tab ${selectedTab === 0 ? 'active' : 'custom-tab'}`}>
            All
          </Tab>
          <Tab className={`custom-tab ${selectedTab === 1 ? 'active' : 'custom-tab'}`}>Client</Tab>
          <Tab className={`custom-tab ${selectedTab === 2 ? 'active' : 'custom-tab'}`}>Case</Tab>
          <Tab className={`custom-tab ${selectedTab === 3 ? 'active' : 'custom-tab'}`}>Accident</Tab>
          <Tab className={`custom-tab ${selectedTab === 4 ? 'active' : 'custom-tab'}`}>Reports</Tab>
          <Tab className={`custom-tab ${selectedTab === 5 ? 'active' : 'custom-tab'}`}>Defendants</Tab>
          <Tab className={`custom-tab ${selectedTab === 6 ? 'active' : 'custom-tab'}`}>Witnesses</Tab>
          <Tab className={`custom-tab ${selectedTab === 7 ? 'active' : 'custom-tab'}`}>Injury</Tab>
          <Tab className={`custom-tab ${selectedTab === 8 ? 'active' : 'custom-tab'}`}>Parties</Tab>
          <Tab className={`custom-tab ${selectedTab === 9 ? 'active' : 'custom-tab'}`}><span>ToDo</span></Tab>
          <Tab className={`custom-tab ${selectedTab === 10 ? 'active' : 'custom-tab'}`}>Insurance</Tab>
          <Tab className={`custom-tab ${selectedTab === 11 ? 'active' : 'custom-tab'}`}>Loans</Tab>
          <Tab className="custom-tab eventLog"><span>EventLog</span></Tab>
        </TabList>

        <TabPanel>
          <p><Table /></p>
        </TabPanel>
        <TabPanel>
          <p><Table /></p>
        </TabPanel>
        <TabPanel>
          <p><Table /></p>
        </TabPanel>
        <TabPanel>
          <p><Table /></p>
        </TabPanel>
        <TabPanel>
          <p><Table /></p>
        </TabPanel>
        <TabPanel>
          <p><Table /></p>
        </TabPanel>
        <TabPanel>
          <p><Table /></p>
        </TabPanel>
        <TabPanel>
          <p><Table /></p>
        </TabPanel>
        <TabPanel>
          <p><Table /></p>
        </TabPanel>
        <TabPanel>
          <p><Table /></p>
        </TabPanel>
        <TabPanel>
          <p><Table /></p>
        </TabPanel>
        <TabPanel>
          <p><Table /></p>
        </TabPanel>
        <TabPanel>
          <p><EventLogTable /></p>
        </TabPanel>
      </Tabs>
    </div>
  );
}

export default MyTabs;
