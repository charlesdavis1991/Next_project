import React, {  useEffect } from "react";
import NavBar from "../Components/Navbars/main";
import Sidebar from "../Components/Sidebars/main";
import SearchDashboard from "../Components/SearchDashboard/main";
import "../../public/BP_resources/css/search-dashboard.css";
import { useDispatch, useSelector } from "react-redux";
import api from "../api/api";
import { setSearchText, setCurrentSearchStatus,setsearchAlphabet,searchGlobal,searchGlobalOnLogin, updateTabName, setCurrentTab, setLoginSearchText, SearchTabsApi, setSearchResult, setHasData, setTabsResultCount, setSearchResultGlobal, setSearchType } from "../Redux/search/searchSlice";
import axios from "axios";
import Footer from "../Components/common/footer";



const SearchPage = () => {
  // Redux
  const dispatch = useDispatch();
  const loginSearchText = useSelector((state) => state.searchS.loginSearchText);
  const searchText = useSelector((state) => state.searchS.searchText);
  const searchAlphabet = useSelector((state) => state.searchS.searchAlphabet);
  const currentTab = useSelector((state) => state.searchS.currentTab);
  const origin = process.env.REACT_APP_BACKEND_URL;
  const token1 = localStorage.getItem('token');
  

  const getLatestSearchOnLogin = async()=>{
    
    if(searchText?.trim()=='')
    {
      try {
        const response = await axios.get(`${origin}/api/search/latest_search/`, {
          headers: { Authorization: token1 },
        });
        const latest_search = response.data
        if(latest_search.tab_name=='tabs')
        {
          dispatch(setsearchAlphabet(false))
          dispatch(setLoginSearchText(response.data.query))
          dispatch(setSearchText(response.data.query))
        }else if (latest_search.tab_name=='alphabets')
        {
          dispatch(setsearchAlphabet(true))
          dispatch(setLoginSearchText(response.data.query))
          dispatch(setSearchText(response.data.query))
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }

      try {
        const response = await axios.get(`${origin}/api/search/latest_search_tab/`, {
          headers: { Authorization: token1 },
        });
        const latest_search_tab = response.data
        if(latest_search_tab.tab_name)
        {
          dispatch(setCurrentTab(latest_search_tab.tab_name))  
        }
      }catch(error){
        console.error('Error fetching currentTab:', error);
      }
    }else{
      // console.log("Yes there is search data")
      // // dispatch(SearchTabsApi({currentTab}))
      // const params = new URLSearchParams({ tab: currentTab, searchText: searchText });
      // try {
      //   const response = await axios.get(`${origin}/api/search/SearchTabsApi/?${params.toString()}`);
      //   dispatch(setSearchResult(response?.data?.data))
      // } catch (error) {
      //   console.error('Error fetching data:', error);
      // }
    }
  }  

  const handleBeforeUnload = ()=>{
    dispatch(setSearchText(''))
    dispatch(setCurrentTab(''))
    dispatch(setSearchResult(''))
    dispatch(setHasData(false))
    dispatch(setCurrentSearchStatus(''))
    dispatch(setTabsResultCount({
      "invoice":0,
      "incident":0,
      "incident-date":0,
      "check":0,
      "client-name": 0,
      "client-email": 0,
      "client-SSN": 0,
      "client-phone": 0,
      "client-birthday":0,
      defendant: 0,
      "defendant-phone": 0,
      witness: 0,
      claim: 0,
      "court-case": 0,
      otherparty: 0,
      address: 0,
      notes: 0,
      document: 0,
    }))
    dispatch(setSearchResultGlobal([]))
    dispatch(setSearchType(''))
    dispatch(setsearchAlphabet(false))
  }


   useEffect(()=>{
    getLatestSearchOnLogin()
    window.addEventListener("beforeunload", handleBeforeUnload);
    return ()=>{
      window.removeEventListener("beforeunload", handleBeforeUnload);
    }

   },[])

  //  Getting the search page on first time login
   useEffect(() => {
    if (loginSearchText != "") {
      console.log("Yes loginSearchText is not empty")
      if (searchAlphabet == false) {
        dispatch(searchGlobalOnLogin({ name: loginSearchText, tab_name: "tabs",token:token1 }));
      } else {
        dispatch(searchGlobalOnLogin({ name: loginSearchText, tab_name: "alphabets",token:token1 }));
      }
       
      dispatch(setLoginSearchText(''))
     
    }else{
      console.log("Yes loginSearchText is  empty")
    }
   
  }, [loginSearchText]);

  //  To set the current tab in the database if the tab changes
  useEffect(()=>{
    if(currentTab!='')
    {
      dispatch(updateTabName({tab_name:currentTab}))
    }
  },[currentTab]) 

  // 

  return (
    <>
    <div className="page-wrapper">
      <Sidebar />
      <div className="page-container " style={{overflowY:"hidden"}}>
        <NavBar flaggedPageName={'Case'} />
        <SearchDashboard />
      </div> 
    </div>
    <Footer/>
    </>
  );
};

export default SearchPage;