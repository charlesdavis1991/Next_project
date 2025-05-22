import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../Components/Sidebars/main";
import NavBar from "../Components/Navbars/main";
import ActionBarComponent from "../Components/common/ActionBarComponent";
import PhotoIcon from "../../public/BP_resources/images/icon/copilot-logo-icon.svg";
import SearchTab from "../Components/CoPilotPage/SearchTab"; // Correct import

import api from "../api/api";
import TabData from "../Components/CoPilotPage/TabData";
import Tabs from "../Components/CoPilotPage/Tabs";

import TableLoader from "../Components/Loaders/tableLoader";
import { getClientId, getCaseId, mediaRoute } from "../Utils/helper";

import CustomSelect from "../Components/CoPilotPage/CustomSelect";
import YourCopliotFirms from "../Components/CoPilotPage/YourCopliotFirms";

import { Button, Nav, Tab, Form, Row, Col, Dropdown } from "react-bootstrap";
import Footer from "../Components/common/footer";

function CoPilotPage() {
  const origin = process.env.REACT_APP_BACKEND_URL;
  const client = useSelector((state) => state.todos.client);
  const pages = useSelector((state) => state.todos.pages);
  const currentCase = useSelector((state) => state.todos.currentCase);  
  const currentCaseId = getCaseId();
  const currentClientId = getClientId();
  const [pageSlots, setPageSlots] = useState([]);
 
  const [activeTab, setActiveTab] = useState("documents");
  const [tabData, setTabData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refetchLoading, setrefetchLoading] = useState(false);

  const [allCount, setAllCount] = useState(0);
  const [unsortedCount, setUnsortedCount] = useState(0);
  const [query, setQuery] = useState(0);

  const [documentsData, setDocumentsData] = useState(""); // Default to 'Both'

  const [filterStates, setFilterStates] = useState([]); // State to hold case types
  const [filterPages, setFilterPages] = useState([]); 
  const [filterCaseTypes, setFilterCaseTypes] = useState([]); 


  const [filterPageId, setFilterPageId] = useState("");
  const [filterStateId, setFilterStateId] = useState(""); 
  const [filterCaseTypeId, setFilterCaseTypeId] = useState(""); 
  const [selectedOption, setSelectedOption] = useState({ value: '', label: 'All Pages' }); // Default to 'Both'


  const handleCaseTypeChange = (value) => {
    setFilterCaseTypeId(value);

  // Add any other logic needed when the jurisdiction changes
  };
  const handlePageChange = (value) => {
    setSelectedOption(value)
    setFilterPageId(value.value)
    };

  const handleStateChange = (value) => {
    setFilterStateId(value);
    };

  const fetchDocumentsData = async () => {
    setLoading(true)
    try {

      const params = {
        "client_id":currentClientId,
        "case_id":currentCaseId,
        "page_id":filterPageId,
        "case_type_id":filterCaseTypeId,
        "state_id":filterStateId
      }
  
      const response = await api.get(`${origin}/api/documents/get-all-dl-template/`, { params });

      if (response.status === 200) {
          setDocumentsData(response.data); // Assuming API response has an array of case types
      }
    } catch (error) {
      console.error("Error fetching case types:", error);
      setDocumentsData([]); // Assuming API response has an array of case types

    } finally{
      setLoading(false)

    }
  };

  const fetchStates = async () => {
    try {
      const response = await api.get(`${origin}/api/firmsetting-page/update-copilot-states/`);
  

      if (response.status === 200) {
        const sortedStates = response.data.states.sort((a, b) => {
          return a.name.localeCompare(b.name); // Sorting alphabetically by 'name'
        });
        setFilterStates(sortedStates);
      }
    } catch (error) {
      console.error("Error fetching case types:", error);
    }
  };


  const fetchCaseTypes = async () => {
    try {
      const response = await api.get(`${origin}/api/firmsetting-page/update-copilot-casetype/`);
      if (response.status === 200) {
        if (response.data.case_types.length > 0){
          setFilterCaseTypes(response.data.case_types); 

        } else {
          setFilterCaseTypes([])
        }
      }
    
    } catch (error) {
      console.error("Error fetching case types:", error);
    }
  };


  const fetchPages = async () => {
    try {
      const response = await api.get(`${origin}/api/firmsetting-page/pages-with-dropdowns/`);

      if (response.status === 200) {
        const filteredPagesAll = response.data.map((page) => ({
            value: page.id,
            label: (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img
                // src="https://simplefirm-bucket.s3.amazonaws.com/static/images/litigation-icon-color_0yq07fj.svg"
                  src={mediaRoute(page.page_icon)}
                  alt="icon"
                  style={{ width: '20px', marginRight: '8px' }}
                />
                {page.name}
              </div>
            ),
          }))
        const defaultOption = {
          value: '',
          label: 'All Pages',
        };
    
      // Add the default option to the beginning of the options array
      const filteredPages = [defaultOption, ...filteredPagesAll];
        if (filteredPages.length > 0) {
          setFilterPages(filteredPages); // Assuming API response has an array of case types
        }
        else{
          setFilterPages([]); 
        }
      }
    } catch (error) {
      console.error("Error fetching case types:", error);
    }
  };


  

  const fetchtabsData = async () => {
    try {
      const response = await api.get(
        `${origin}/api/doc-page/doc-page-api-viewset/`,
        {
          params: {
            case_type_id: currentCaseId ? currentCaseId : "",

          },
        }
      );
      if (response.status === 200) {
        setPageSlots(response.data.data);
        setUnsortedCount(response.data.unsorted_count)
        setAllCount(response.data.all_count)
        
        
      }
    } catch (error) {
      console.log(error);
    }
  };
  const fetchData = async () => {
    // if (!loading) setLoading(true);
    if (!refetchLoading) setrefetchLoading(true);
    // Set loading to true before making the API call

    try {
      const response = await api.get(
        `${origin}/api/doc-page/list-page-doc-optimized/`,
        {
          params: {
            page_id: activeTab === "all" ? "" : activeTab,
            case_id: currentCaseId ? currentCaseId : "",
            all_docs: activeTab === "all" ? "True" : false,
            client_id: currentClientId ? currentClientId : ""
          },
        }
      );
      if (response.status === 200) {
        setTabData(response.data);
        setLoading(false);
        setrefetchLoading(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
    }
  };
  useEffect(() => {
    fetchtabsData();
  }, []);


  useEffect(() => {
    fetchDocumentsData();
  }, [filterCaseTypeId,filterPageId,filterStateId]);


  useEffect(() => {
    // const fetchDataFirstTime = async () => {
    //   setLoading(true);
    //   try {
    //     const response = await api.get(
    //       `${origin}/api/doc-page/list-page-doc-optimized/`,
    //       {
    //         params: {
    //           page_id: activeTab === "all" ? "" : activeTab,
    //           case_id: currentCaseId ? currentCaseId : "",
    //           all_docs: activeTab === "all" ? "True" : false,
    //         },
    //       }
    //     );
    //     if (response.status === 200) {
    //       console.log(loading);

    //       setTabData(response.data);
    //       setLoading(false);
    //     }
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };

    // fetchDataFirstTime();
    fetchDocumentsData();
    fetchPages();
    fetchCaseTypes();
    fetchStates();
  }, [currentCaseId]);

  const handleSelect = async (selectedTab) => {
    console.log(selectedTab)
    setActiveTab(selectedTab);
    
  };

  const renderContent = () => {
    if (loading) {
      return <TableLoader />;
    } else {
      switch (activeTab) {
        case "documents":
          return (
            <TabData
              data={documentsData || []}
              loading={loading}
            />
          );
        case "yourcopilotfirms":
        return(<YourCopliotFirms />)
        default:
          return (
            null
          );
      }
    }
  };
  return (
    <>
    <div className="page-wrapper">
      <Sidebar pages={pages} />
      <div className="page-container">
        <NavBar
          client={client}
          currentCase={currentCase}
          flaggedPageName={"Docs"}
        />
      <div className="main-content" style={{paddingTop: "170px"}}>
        
        <ActionBarComponent
            src={PhotoIcon}
            page_name="Co Pilot"
          />
        <SearchTab setTabData={setTabData} activeTab={activeTab} setAllCount={setAllCount} setPageSlots={setPageSlots} setUnsortedCount={setUnsortedCount}  setLoading={setLoading} setQuery={setQuery} fetchDocumentsData={fetchDocumentsData}/>
        <Tabs onSelect={handleSelect} />
        

        <div className="reports-main-container-modified-custom-top0 z-index-0-custom-class">
          {activeTab=="documents"?(<div className="row m-t-5">
          <Col xs={2}>
          <Form.Control as="select"   className="custom-select-options" onChange={(e) => handleCaseTypeChange(e.target.value)} value={filterCaseTypeId}>
          <option key="" value="">
                All Case Types
              </option>
          {filterCaseTypes.map((item, index) => (
            // Check if any selectedCaseTypes are present in the page's case_types array
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
          ))}
          </Form.Control>
          </Col>

          <Col xs={2}>
          <Form.Control as="select"   className="custom-select-options" onChange={(e) => handleStateChange(e.target.value)} value={filterStateId}>
          <option key="" value="">
                All States
              </option>
          {filterStates.map((item, index) => (
            // Check if any selectedCaseTypes are present in the page's case_types array
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
          ))}
          </Form.Control>
          </Col>

          <CustomSelect options={filterPages} colSize={2} handlePageChange={handlePageChange} selectedOption={selectedOption} height={'38px'}/>
          </div>):(null)}
          <div className="table--no-card m-t-5">{renderContent()}</div>
        
         </div>
    </div>
      </div>
      </div>
      <Footer/>
    </>
  );
}

export default CoPilotPage;
