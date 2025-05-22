import React, { useEffect, useState, useRef, useContext, useMemo } from 'react';
import axios from "axios";
import { CaseNavigatorModalContext } from './CaseNavigatorModalContext';
import { setEqualColumnWidths} from './../../Utils/helper.js';

export default function CaseInjuries({activeStage,activeStatus}) {  
  const origin = process.env.REACT_APP_BACKEND_URL;
  const token = localStorage.getItem('token');
  
  const [InjuriesData, setInjuriesData] = useState([]);
  const tableContainerRef = useRef(null);
  // API call for CASE AGE DATA
  // Memoize the fetching of injuries data based on activeStatus and activeStage
  useEffect(() => {
    // const controller = new AbortController(); // Create a new AbortController instance
    // const signal = controller.signal; // Get the signal from the controller

    const fetchInjuriesData = async () => {
      try {
        const response = await axios.post(
          origin + '/api/navigator/navigator_injuries_data/',
          { 'status_name': activeStatus, 'stage_name': activeStage },
          {
            headers: {
              Authorization: token,
            },
            // signal: signal, // Pass the signal to the request
          }
        );

        // if (!signal.aborted) {
          setInjuriesData(response.data.case_injuries_data);
        // }
      } catch (error) {
        // if (axios.isCancel(error)) {
        //   console.log('Previous request canceled', error.message);
        // } else {
          console.error('Error fetching injury data:', error);
        // }
      }
    };

    fetchInjuriesData();

    // Cleanup function to cancel the previous request
    // return () => {
    //   controller.abort();
    // };
  }, [activeStatus, activeStage, token, origin]);

  const { handleShowModal } = useContext(CaseNavigatorModalContext);

  const formatTabValue = (tabVal) => {
    if (tabVal.endsWith('_case')) {
      tabVal = tabVal.replace('_case', ''); // Remove '_case' suffix
    }
    return tabVal.replace(/_/g, ' '); // Replace underscores with spaces
  };
  const openModal = (caseType, tabValue,caseTypeId) => () => {
    const typeText = caseType === '' ? 'All Case Types' : caseType;
    const stageText = activeStage === 'all_stage' ? 'All Stages' : activeStage;
    const statusText = activeStatus === 'all_status' ? 'All Statuses' : activeStatus;
  
    const headerString = `${typeText} Cases sorted by ${stageText}, ${statusText} for ${formatTabValue(tabValue)}`;
    
    handleShowModal({
      caseType: caseType,
      Status: activeStatus,
      Stage: activeStage,
      tabName: 'Injury',
      tabValue: tabValue,
      headerString:headerString,
      caseTypeId:caseTypeId
    });
  };
  const [numRows, setNumRows] = useState(0);
  const [numColumns, setNumColumns] = useState(0);
  const tableRef = useRef(null);

  // Setting equal Width of each column
  useEffect(() => {    
    setEqualColumnWidths(tableRef);
    window.addEventListener('resize', () =>setEqualColumnWidths(tableRef));
    return () => {
      window.removeEventListener('resize', () => setEqualColumnWidths(tableRef));
    };
  }, [activeStage, activeStatus, InjuriesData]);

  useEffect(() => {
    const calculateRows = () => {
      if (!tableRef.current) return;
  
      const rowHeight = 25; // Height of each row in pixels
      const pageHeight = window.innerHeight;
      const tableTop = tableRef.current.getBoundingClientRect().top;
  
      // Get the height of existing rows
      const existingRows = tableRef.current.rows.length;
      const existingRowsWithData = Array.from(tableRef.current.rows).filter(row => {
        return Array.from(row.cells).some(cell => cell.textContent.trim() !== "");
      }).length;
      const existingRowsHeight = existingRowsWithData * rowHeight;
  
      // Calculate the remaining height excluding the existing rows
      const remainingHeight = pageHeight - tableTop - existingRowsHeight - 10; // Subtracting a small buffer
  
      // Calculate number of rows needed based on the remaining height
      const rows = Math.floor(remainingHeight / rowHeight);
      // Set the number of rows needed to fill the remaining space
      setNumRows(rows > 0 ? rows : 0);
    };
  
    const extractColumns = () => {
      if (tableRef.current && tableRef.current.rows.length > 0) {
        const columns = tableRef.current.rows[0].cells.length;
        setNumColumns(columns);
      }
    };
  
    // Initial calculations
    calculateRows();
    extractColumns();
  
    // Resize event listener
    const handleResize = () => {
      calculateRows();
      extractColumns();
    };
  
    window.addEventListener('resize', handleResize);
  
    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [activeStage, activeStatus, InjuriesData]);

  return (
    <div ref={tableContainerRef}>
      <table class="table res_tab table-responsive ml-0 equal-column-width-table navigator-standard-table-header" ref={tableRef}>													
        <tbody class="case-counter-table Index-width-webkit-fill-available-display-inline-table">
            <tr class="thead">
              <th title="Head">Head</th>
              <th title="Brain">Brain</th>
              <th title="Neck">Neck</th>
              <th title="Shoulder">Shoulder</th>
              <th title="Pectoral">Pectoral</th>
              <th title="Back">Back</th>
              <th title="Arm">Arm</th>
              <th title="Abs">Abs</th>
              <th title="Hand">Hand</th>
              <th title="Hip">Hip</th>
              <th title="Leg">Leg</th>
              <th title="Thigh">Thigh</th>
              <th title="Knee">Knee</th>
              <th title="Calf">Calf</th>
              <th title="Foot">Foot</th>
              <th title="Spinal Cord">Spinal Cord</th>
              <th title="Cervical">Cervical</th>
              <th title="Thoracic">Thoracic</th>
              <th title="Lumbar">Lumbar</th>
              <th title="Sacrum">Sacrum</th>
              <th title="Coccyx">Coccyx</th>
            </tr>
            {InjuriesData.filter(case_data => case_data.length > 0).map((case_data, index) => (
            <tr key={index} className='h-25px'>
              {case_data.map((individual_data, idx) => (
               individual_data.count > 0 ?( <td key={'td-'+idx} className='h-25px cursor-pointer text-center' onClick={openModal(individual_data.case_type, individual_data.injury_name, individual_data?.case_type_id||'')}>
                  <p
                    className={individual_data.count > 0 ? 'font-weight-bold' : 'text-grey'}
                    data-toggle="modal"
                    data-target="#case_age_all_cases-modal"
                    data-span-class={individual_data.injury_name}
                    data-status-class={activeStatus}
                    data-stage-class={activeStage}
                    data-casetype={individual_data.case_type ? individual_data.case_type.replace(/\s/g, '') : ''}
                    
                  >
                    {individual_data.count}
                  </p>
                </td>):( <td key={'td-'+idx} className='h-25px cursor-pointer text-center'>
                  <p
                    className={individual_data.count > 0 ? 'font-weight-bold' : 'text-grey'}
                    data-span-class={individual_data.injury_name}
                    data-status-class={activeStatus}
                    data-stage-class={activeStage}
                    data-casetype={individual_data.case_type ? individual_data.case_type.replace(/\s/g, '') : ''}
                    
                  >
                    {individual_data.count}
                  </p>
                </td>)
              ))}
            </tr>
          ))}
          {Array.from({ length: numRows }).map((_, rowIndex) => (
          <tr key={rowIndex}>
            {Array.from({ length: numColumns }).map((_, colIndex) => (
              <td key={colIndex} style={{height: '25px' }}></td>
            ))}
          </tr>
        ))}
        </tbody>
    </table>
    </div>
  )
}
