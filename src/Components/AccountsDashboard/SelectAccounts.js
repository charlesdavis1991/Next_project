import React, {useEffect, useState} from "react";
import './envelope-cost.css';
import { AccountsInfoItem } from "./AccountsInfoItem";
import api, { api_without_cancellation } from "../../api/api";
import { getCaseId, getClientId,getLoggedInUserId,mediaRoute } from "../../Utils/helper";


const SelectAccountsComponent = ({ selectedAccountState, accountsCount,fetchAccountsData }) => {
  const origin = process.env.REACT_APP_BACKEND_URL;

  const [selectedAccount, setSelectedAccount] = useState({});
  const [accountsData, setAccountsData] = useState([]);
  const [countMap, setCountMap] = useState({});


  const fetchAccounts = async (key) => {
      try {
        // const response = await api_without_cancellation.get(
        //   origin +
        //   `/api/documents/get-courtforms/?client_id=${getClientId()}&case_id=${getCaseId()}`
        // );
        const response = await api_without_cancellation.get(
          origin +
          `/api/accounting-page/select-bank-accounts/?case_id=${getCaseId()}`
        );
        if (response.status == 200) {
          console.log("fetchAccountsData",response.data.data)
          setAccountsData(response.data.data)
          setSelectedAccount(response.data.selected_account)
          setCountMap(response.data.account_records_count_map)
        }
      } catch (error) {
        console.log("Failed to fetch Account Data:", error);
      } 
    };

    const updateAccount = async (account) => {
      try {

        setSelectedAccount(account)
        const payload = {
          "case_id":getCaseId(),
          "bank_account":account?.id
        }
        // const response = await api_without_cancellation.get(
        //   origin +
        //   `/api/documents/get-courtforms/?client_id=${getClientId()}&case_id=${getCaseId()}`
        // );
        const response = await api_without_cancellation.post(
          origin +
          `/api/accounting-page/select-bank-accounts/`,payload
        );
        if (response.status == 200) {
          fetchAccountsData()
          fetchAccounts()
        }
      } catch (error) {
        console.log("Failed to update Account Data:", error);
      } 
    };
    useEffect(() => {
      fetchAccounts()
        }, [])

  

  return (
    <React.Fragment>
      <div
        className='div-tilted-accounts'
        style={{
          height: "25px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transform: 'none',
          fontStyle: 'normal',
          color: 'white'
        }}
      >
        <div></div>
        {accountsData.length > 0 ? (
              <>
                {accountsData.map((account) => (
                  <label
                    key={account.id} // Adding a unique key for each element
                    style={{
                      margin: '0 50px 0 0',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <input
                      onClick={() => updateAccount(account)}
                      checked={selectedAccount.id === account.id}
                      style={{ cursor: 'default', marginRight: '4px' }}
                      type="radio"
                      name="account"
                    />
                    {account?.account_name} - *{account?.account_number?.slice(-4)} ({countMap[account?.id]})
                  </label>
                ))}
              
              </>
            ) : null}



        
        
      </div>
    </React.Fragment>
  );
};

export default SelectAccountsComponent;
