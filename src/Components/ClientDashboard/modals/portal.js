import React, { useState } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';


const ModalBody = (props) => {
    const [selectedTab, setSelectedTab] = useState(0);

    const handleTabSelect = (index) => {
        setSelectedTab(index);
    };
    return (
        <>
            <div class="modal-header p-2 popup-heading-color d-flex justify-content-between">
                <h5 class="modal-title font-size-24 height-40 font-weight-semibold font-weight-500" id="avatarModalTitle">
                    Client Portal
                </h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close" onClick={props.hideModal}>
                    <span aria-hidden="true">×</span>
                </button>
            </div>

            <div class="modal-body">
                <Tabs onSelect={handleTabSelect} selectedIndex={selectedTab}>
                    <TabList className="tab-list-border-none-portal">
                        <Tab className={`custom-tabs ${selectedTab === 0 ? 'active' : 'custom-tabs'}`}>
                            Preview Client Portal
                        </Tab>
                        <Tab className={`custom-tabs ${selectedTab === 1 ? 'active' : 'custom-tabs'}`}>Client Details</Tab>
                    </TabList>

                    <TabPanel>
                        <p>hello one</p>
                    </TabPanel>
                    <TabPanel>
                        <div className='d-flex justify-content-end'>
                            <button type="button" class="btn btn-primary ml-auto" id="resendCredentialsBtn">Resend login credentials</button>
                        </div>
                        <div>
                        <div class="Max-Height-520px">
                                <table class="table table-striped">
                                    <thead>
                                        <tr>
                                            <th class="padding-75" scope="col">#</th>
                                            <th class="padding-75" scope="col">Client</th>
                                            <th class="padding-75" scope="col">Logged in at</th>
                                            <th class="padding-75" scope="col">IP Address</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <th class="padding-75" scope="row">1</th>
                                            <td class="padding-75">testportaluser</td>
                                            <td class="padding-75">Aug. 15, 2023, 5:15 p.m.</td>
                                            <td class="padding-75">39.57.243.85</td>
                                        </tr>
                                        
                                        <tr>
                                            <th class="padding-75" scope="row">2</th>
                                            <td class="padding-75">testportaluser</td>
                                            <td class="padding-75">Aug. 15, 2023, 5:15 p.m.</td>
                                            <td class="padding-75">39.57.243.85</td>
                                        </tr>
                                        
                                        <tr>
                                            <th class="padding-75" scope="row">3</th>
                                            <td class="padding-75">testportaluser</td>
                                            <td class="padding-75">Aug. 15, 2023, 5:21 p.m.</td>
                                            <td class="padding-75">39.57.243.85</td>
                                        </tr>
                                        
                                        <tr>
                                            <th class="padding-75" scope="row">4</th>
                                            <td class="padding-75">testportaluser</td>
                                            <td class="padding-75">Aug. 15, 2023, 5:21 p.m.</td>
                                            <td class="padding-75">39.57.243.85</td>
                                        </tr>
                                        
                                        <tr>
                                            <th class="padding-75" scope="row">5</th>
                                            <td class="padding-75">testportaluser</td>
                                            <td class="padding-75">Aug. 15, 2023, 5:23 p.m.</td>
                                            <td class="padding-75">39.57.243.85</td>
                                        </tr>
                                        
                                        <tr>
                                            <th class="padding-75" scope="row">6</th>
                                            <td class="padding-75">testportaluser</td>
                                            <td class="padding-75">Aug. 17, 2023, 9:46 a.m.</td>
                                            <td class="padding-75">39.57.243.85</td>
                                        </tr>
                                        
                                        <tr>
                                            <th class="padding-75" scope="row">7</th>
                                            <td class="padding-75">testportaluser</td>
                                            <td class="padding-75">Aug. 17, 2023, 10:09 p.m.</td>
                                            <td class="padding-75">39.57.243.85</td>
                                        </tr>
                                        
                                        <tr>
                                            <th class="padding-75" scope="row">8</th>
                                            <td class="padding-75">testportaluser</td>
                                            <td class="padding-75">Aug. 28, 2023, 6:26 p.m.</td>
                                            <td class="padding-75">39.51.57.186</td>
                                        </tr>
                                        
                                        <tr>
                                            <th class="padding-75" scope="row">9</th>
                                            <td class="padding-75">testportaluser</td>
                                            <td class="padding-75">Aug. 28, 2023, 6:30 p.m.</td>
                                            <td class="padding-75">39.51.57.186</td>
                                        </tr>
                                        
                                        <tr>
                                            <th class="padding-75" scope="row">10</th>
                                            <td class="padding-75">testportaluser</td>
                                            <td class="padding-75">Aug. 29, 2023, 5:21 p.m.</td>
                                            <td class="padding-75">39.51.125.76</td>
                                        </tr>
                                        
                                        <tr>
                                            <th class="padding-75" scope="row">11</th>
                                            <td class="padding-75">testportaluser</td>
                                            <td class="padding-75">Aug. 31, 2023, 7:40 a.m.</td>
                                            <td class="padding-75">39.51.115.68</td>
                                        </tr>
                                        
                                        <tr>
                                            <th class="padding-75" scope="row">12</th>
                                            <td class="padding-75">testportaluser</td>
                                            <td class="padding-75">Aug. 31, 2023, 9:34 a.m.</td>
                                            <td class="padding-75">39.51.115.68</td>
                                        </tr>
                                        
                                        <tr>
                                            <th class="padding-75" scope="row">13</th>
                                            <td class="padding-75">testportaluser</td>
                                            <td class="padding-75">Sept. 3, 2023, 9:14 a.m.</td>
                                            <td class="padding-75">39.51.115.136</td>
                                        </tr>
                                        
                                        <tr>
                                            <th class="padding-75" scope="row">14</th>
                                            <td class="padding-75">testportaluser</td>
                                            <td class="padding-75">Sept. 20, 2023, 7:51 p.m.</td>
                                            <td class="padding-75">39.51.50.189</td>
                                        </tr>
                                        
                                        <tr>
                                            <th class="padding-75" scope="row">15</th>
                                            <td class="padding-75">testportaluser</td>
                                            <td class="padding-75">Sept. 21, 2023, 5:53 p.m.</td>
                                            <td class="padding-75">39.51.50.189</td>
                                        </tr>
                                        
                                        <tr>
                                            <th class="padding-75" scope="row">16</th>
                                            <td class="padding-75">testportaluser</td>
                                            <td class="padding-75">Sept. 22, 2023, 12:44 a.m.</td>
                                            <td class="padding-75">39.51.50.189</td>
                                        </tr>
                                        
                                        <tr>
                                            <th class="padding-75" scope="row">17</th>
                                            <td class="padding-75">testportaluser</td>
                                            <td class="padding-75">Sept. 22, 2023, 12:46 a.m.</td>
                                            <td class="padding-75">39.51.50.189</td>
                                        </tr>
                                        
                                        <tr>
                                            <th class="padding-75" scope="row">18</th>
                                            <td class="padding-75">testportaluser</td>
                                            <td class="padding-75">Sept. 22, 2023, 8:03 a.m.</td>
                                            <td class="padding-75">39.51.50.189</td>
                                        </tr>
                                        
                                        <tr>
                                            <th class="padding-75" scope="row">19</th>
                                            <td class="padding-75">testportaluser</td>
                                            <td class="padding-75">Sept. 25, 2023, 8:50 a.m.</td>
                                            <td class="padding-75">39.57.188.167</td>
                                        </tr>
                                        
                                        <tr>
                                            <th class="padding-75" scope="row">20</th>
                                            <td class="padding-75">testportaluser</td>
                                            <td class="padding-75">Sept. 27, 2023, 5:48 p.m.</td>
                                            <td class="padding-75">101.53.228.182</td>
                                        </tr>
                                        
                                        <tr>
                                            <th class="padding-75" scope="row">21</th>
                                            <td class="padding-75">testportaluser</td>
                                            <td class="padding-75">Sept. 28, 2023, 6:25 p.m.</td>
                                            <td class="padding-75">39.51.52.90</td>
                                        </tr>
                                        
                                        <tr>
                                            <th class="padding-75" scope="row">22</th>
                                            <td class="padding-75">testportaluser</td>
                                            <td class="padding-75">Sept. 28, 2023, 6:41 p.m.</td>
                                            <td class="padding-75">39.51.52.90</td>
                                        </tr>
                                        
                                        <tr>
                                            <th class="padding-75" scope="row">23</th>
                                            <td class="padding-75">testportaluser</td>
                                            <td class="padding-75">Sept. 28, 2023, 6:44 p.m.</td>
                                            <td class="padding-75">39.51.52.90</td>
                                        </tr>
                                        
                                        <tr>
                                            <th class="padding-75" scope="row">24</th>
                                            <td class="padding-75">testportaluser</td>
                                            <td class="padding-75">Sept. 29, 2023, 7:42 p.m.</td>
                                            <td class="padding-75">75.54.194.158</td>
                                        </tr>
                                        
                                        <tr>
                                            <th class="padding-75" scope="row">25</th>
                                            <td class="padding-75">testportaluser</td>
                                            <td class="padding-75">Sept. 29, 2023, 7:46 p.m.</td>
                                            <td class="padding-75">75.54.194.158</td>
                                        </tr>
                                        
                                        <tr>
                                            <th class="padding-75" scope="row">26</th>
                                            <td class="padding-75">testportaluser</td>
                                            <td class="padding-75">Sept. 29, 2023, 7:53 p.m.</td>
                                            <td class="padding-75">101.53.228.182</td>
                                        </tr>
                                        
                                        <tr>
                                            <th class="padding-75" scope="row">27</th>
                                            <td class="padding-75">testportaluser</td>
                                            <td class="padding-75">Sept. 30, 2023, 12:41 p.m.</td>
                                            <td class="padding-75">39.51.52.169</td>
                                        </tr>
                                        
                                        <tr>
                                            <th class="padding-75" scope="row">28</th>
                                            <td class="padding-75">testportaluser</td>
                                            <td class="padding-75">Sept. 30, 2023, 1:59 p.m.</td>
                                            <td class="padding-75">39.51.52.169</td>
                                        </tr>
                                        
                                        <tr>
                                            <th class="padding-75" scope="row">29</th>
                                            <td class="padding-75">testportaluser</td>
                                            <td class="padding-75">Sept. 30, 2023, 3:52 p.m.</td>
                                            <td class="padding-75">39.51.52.90</td>
                                        </tr>
                                        
                                        <tr>
                                            <th class="padding-75" scope="row">30</th>
                                            <td class="padding-75">testportaluser</td>
                                            <td class="padding-75">Sept. 30, 2023, 3:54 p.m.</td>
                                            <td class="padding-75">39.51.52.90</td>
                                        </tr>
                                        
                                        <tr>
                                            <th class="padding-75" scope="row">31</th>
                                            <td class="padding-75">testportaluser</td>
                                            <td class="padding-75">Oct. 15, 2023, 7:48 p.m.</td>
                                            <td class="padding-75">39.51.59.166</td>
                                        </tr>
                                        
                                        <tr>
                                            <th class="padding-75" scope="row">32</th>
                                            <td class="padding-75">testportaluser</td>
                                            <td class="padding-75">Oct. 18, 2023, 3:04 p.m.</td>
                                            <td class="padding-75">39.57.178.57</td>
                                        </tr>
                                        
                                        <tr>
                                            <th class="padding-75" scope="row">33</th>
                                            <td class="padding-75">testportaluser</td>
                                            <td class="padding-75">Oct. 18, 2023, 3:04 p.m.</td>
                                            <td class="padding-75">39.57.178.57</td>
                                        </tr>
                                        
                                        <tr>
                                            <th class="padding-75" scope="row">34</th>
                                            <td class="padding-75">testportaluser</td>
                                            <td class="padding-75">Oct. 30, 2023, 6:19 p.m.</td>
                                            <td class="padding-75">101.53.228.182</td>
                                        </tr>
                                        
                                        <tr>
                                            <th class="padding-75" scope="row">35</th>
                                            <td class="padding-75">testportaluser</td>
                                            <td class="padding-75">Oct. 30, 2023, 6:20 p.m.</td>
                                            <td class="padding-75">39.51.119.199</td>
                                        </tr>
                                        
                                        <tr>
                                            <th class="padding-75" scope="row">36</th>
                                            <td class="padding-75">testportaluser</td>
                                            <td class="padding-75">Oct. 30, 2023, 6:30 p.m.</td>
                                            <td class="padding-75">101.53.228.182</td>
                                        </tr>
                                        
                                        <tr>
                                            <th class="padding-75" scope="row">37</th>
                                            <td class="padding-75">testportaluser</td>
                                            <td class="padding-75">Oct. 30, 2023, 6:32 p.m.</td>
                                            <td class="padding-75">101.53.228.182</td>
                                        </tr>
                                        
                                        <tr>
                                            <th class="padding-75" scope="row">38</th>
                                            <td class="padding-75">testportaluser</td>
                                            <td class="padding-75">Oct. 30, 2023, 6:40 p.m.</td>
                                            <td class="padding-75">101.53.228.182</td>
                                        </tr>
                                        
                                        <tr>
                                            <th class="padding-75" scope="row">39</th>
                                            <td class="padding-75">testportaluser</td>
                                            <td class="padding-75">Oct. 30, 2023, 6:41 p.m.</td>
                                            <td class="padding-75">101.53.228.182</td>
                                        </tr>
                                        
                                        <tr>
                                            <th class="padding-75" scope="row">40</th>
                                            <td class="padding-75">testportaluser</td>
                                            <td class="padding-75">Oct. 30, 2023, 6:48 p.m.</td>
                                            <td class="padding-75">101.53.228.182</td>
                                        </tr>
                                        
                                        <tr>
                                            <th class="padding-75" scope="row">41</th>
                                            <td class="padding-75">testportaluser</td>
                                            <td class="padding-75">Oct. 30, 2023, 6:50 p.m.</td>
                                            <td class="padding-75">101.53.228.182</td>
                                        </tr>
                                        
                                        <tr>
                                            <th class="padding-75" scope="row">42</th>
                                            <td class="padding-75">testportaluser</td>
                                            <td class="padding-75">Oct. 30, 2023, 6:50 p.m.</td>
                                            <td class="padding-75">101.53.228.182</td>
                                        </tr>
                                        
                                        <tr>
                                            <th class="padding-75" scope="row">43</th>
                                            <td class="padding-75">testportaluser</td>
                                            <td class="padding-75">Nov. 1, 2023, 5:12 p.m.</td>
                                            <td class="padding-75">39.51.119.199</td>
                                        </tr>
                                        
                                        <tr>
                                            <th class="padding-75" scope="row">44</th>
                                            <td class="padding-75">testportaluser</td>
                                            <td class="padding-75">Nov. 2, 2023, 3:47 a.m.</td>
                                            <td class="padding-75">39.51.119.199</td>
                                        </tr>
                                        
                                        <tr>
                                            <th class="padding-75" scope="row">45</th>
                                            <td class="padding-75">testportaluser</td>
                                            <td class="padding-75">Nov. 2, 2023, 8:02 a.m.</td>
                                            <td class="padding-75">39.51.119.199</td>
                                        </tr>
                                        
                                        <tr>
                                            <th class="padding-75" scope="row">46</th>
                                            <td class="padding-75">testportaluser</td>
                                            <td class="padding-75">Nov. 2, 2023, 9:45 a.m.</td>
                                            <td class="padding-75">39.51.119.199</td>
                                        </tr>
                                        
                                        <tr>
                                            <th class="padding-75" scope="row">47</th>
                                            <td class="padding-75">testportaluser</td>
                                            <td class="padding-75">Nov. 2, 2023, 9:46 a.m.</td>
                                            <td class="padding-75">39.51.119.199</td>
                                        </tr>
                                        
                                        <tr>
                                            <th class="padding-75" scope="row">48</th>
                                            <td class="padding-75">testportaluser</td>
                                            <td class="padding-75">Nov. 2, 2023, 9:46 a.m.</td>
                                            <td class="padding-75">39.51.119.199</td>
                                        </tr>
                                        
                                        <tr>
                                            <th class="padding-75" scope="row">49</th>
                                            <td class="padding-75">testportaluser</td>
                                            <td class="padding-75">Nov. 2, 2023, 10:13 a.m.</td>
                                            <td class="padding-75">39.51.119.199</td>
                                        </tr>
                                        
                                        <tr>
                                            <th class="padding-75" scope="row">50</th>
                                            <td class="padding-75">testportaluser</td>
                                            <td class="padding-75">Nov. 30, 2023, 3:15 p.m.</td>
                                            <td class="padding-75">101.53.228.182</td>
                                        </tr>
                                        
                                        <tr>
                                            <th class="padding-75" scope="row">51</th>
                                            <td class="padding-75">testportaluser</td>
                                            <td class="padding-75">Dec. 11, 2023, 4:10 p.m.</td>
                                            <td class="padding-75">223.123.87.107</td>
                                        </tr>
                                        
                                        <tr>
                                            <th class="padding-75" scope="row">52</th>
                                            <td class="padding-75">testportaluser</td>
                                            <td class="padding-75">Jan. 15, 2024, 6:47 p.m.</td>
                                            <td class="padding-75">39.51.54.183</td>
                                        </tr>
                                        
                                        <tr>
                                            <th class="padding-75" scope="row">53</th>
                                            <td class="padding-75">testportaluser</td>
                                            <td class="padding-75">Jan. 15, 2024, 6:55 p.m.</td>
                                            <td class="padding-75">39.51.54.183</td>
                                        </tr>
                                        
                                        <tr>
                                            <th class="padding-75" scope="row">54</th>
                                            <td class="padding-75">testportaluser</td>
                                            <td class="padding-75">Jan. 15, 2024, 7:13 p.m.</td>
                                            <td class="padding-75">39.51.54.183</td>
                                        </tr>
                                        
                                        <tr>
                                            <th class="padding-75" scope="row">55</th>
                                            <td class="padding-75">testportaluser</td>
                                            <td class="padding-75">Jan. 15, 2024, 7:13 p.m.</td>
                                            <td class="padding-75">92.72.54.211</td>
                                        </tr>
                                        
                                        <tr>
                                            <th class="padding-75" scope="row">56</th>
                                            <td class="padding-75">testportaluser</td>
                                            <td class="padding-75">Jan. 15, 2024, 7:35 p.m.</td>
                                            <td class="padding-75">92.72.54.211</td>
                                        </tr>
                                        
                                        <tr>
                                            <th class="padding-75" scope="row">57</th>
                                            <td class="padding-75">testportaluser</td>
                                            <td class="padding-75">Jan. 15, 2024, 8:17 p.m.</td>
                                            <td class="padding-75">92.72.54.211</td>
                                        </tr>
                                        
                                        <tr>
                                            <th class="padding-75" scope="row">58</th>
                                            <td class="padding-75">testportaluser</td>
                                            <td class="padding-75">Jan. 15, 2024, 8:39 p.m.</td>
                                            <td class="padding-75">92.72.54.211</td>
                                        </tr>
                                        
                                        <tr>
                                            <th class="padding-75" scope="row">59</th>
                                            <td class="padding-75">testportaluser</td>
                                            <td class="padding-75">Jan. 16, 2024, 5:39 p.m.</td>
                                            <td class="padding-75">92.72.54.211</td>
                                        </tr>
                                        
                                        <tr>
                                            <th class="padding-75" scope="row">60</th>
                                            <td class="padding-75">testportaluser</td>
                                            <td class="padding-75">Jan. 16, 2024, 5:51 p.m.</td>
                                            <td class="padding-75">92.72.54.211</td>
                                        </tr>
                                        
                                        
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </TabPanel>

                </Tabs>

            </div>


        </>
    );
}

export default ModalBody;


