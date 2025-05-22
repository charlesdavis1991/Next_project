import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useMediaQuery } from "react-responsive";
import { formatDate, formatDateForPanelDisplay, getCaseId, getClientId } from '../../Utils/helper';

const LitigationTimeLines = ({ 
    // timeline_events,
    //  sol_events 
}) => {
    const origin = process.env.REACT_APP_BACKEND_URL;
    const for_case = getCaseId();
    const for_client = getClientId();
    const token = localStorage.getItem("token");
    const [upcomingDates, setUpcomingDates] = useState([]);
    const [upcomingActs, setUpcomingActs] = useState([]);

    // Media queries
    const isScreen50 = useMediaQuery({ minWidth: 2400 });
    const isScreen57 = useMediaQuery({ minWidth: 2100, maxWidth: 2350 });
    const isScreen67 = useMediaQuery({ minWidth: 1850, maxWidth: 2100 });
    const isScreen75 = useMediaQuery({ minWidth: 1650, maxWidth: 1850 });
    const isScreen90 = useMediaQuery({ minWidth: 1450, maxWidth: 1650 });
    const isScreen100 = useMediaQuery({ minWidth: 1050, maxWidth: 1450 });

    const fetchUpcomingDates = async () => {
        try {
            const response = await axios.get(`${origin}/api/litigation-page/upcoming-dates/${for_client}/${for_case}/`,
                {
                    headers: {
                        Authorization: token,
                    }
                }
            );
            if (response.status === 200) {
                console.log("data is-----------> ",response);
                setUpcomingDates(response?.data?.upcoming_dates);
                setUpcomingActs(response?.data?.upcoming_acts);
            }    
        } catch (error) {
            console.log("upcoming dates error", error);
        }
    }

    useEffect(()=> {
        fetchUpcomingDates();
    }, [])

    const emptyRows = (count) => {
        let rows = [];
        for (let i = 0; i < count; i++) {
            rows.push(
                <div className="d-flex justify-content-between task" key={`empty-${i}`}>
                    <div>
                        <span>&nbsp;</span>
                    </div>
                    <div>
                        <span>&nbsp;</span>
                    </div>
                </div>
            );
        }
        return rows;
    };

    return (
      <div
        className="calendar-borders position-relative border-0"
        style={{
          height: isScreen50
            ? "16.5rem"
            : isScreen57
              ? "19rem"
              : isScreen67
                ? "15rem"
                : isScreen75
                  ? "55rem"
                  : isScreen90
                    ? "58rem"
                    : isScreen100
                      ? "65rem"
                      : "30rem",
          overflowY: "scroll",
          scrollbarWidth: "none",
        }}
      >
        <h4
          className="client-contact-title text-center d-flex justify-content-center align-items-center"
          style={{ height: "25px", backgroundColor: "var(--primary-15)" }}
        >
          Litigation Timeline
        </h4>
        {upcomingDates?.map((date, index) => (
          <>
            <div className="d-flex justify-content-between task" key={index}>
              <div>
                <span className='primary-color-80'>
                  {new Date(date?.calculated_date).toLocaleDateString("en-US", {
                    weekday: "long",
                  })}
                </span>
              </div>
              <div>
                <span className='primary-color-80'>
                  { formatDate(date?.calculated_date)} 
                  {/* {new Date(date?.calculated_date).toLocaleDateString("en-US", {
                    month: "2-digit",
                    day: "2-digit",
                    year: "numeric",
                  })} */}
                </span>
              </div>
            </div>
            <div className="d-flex justify-content-between task font-weight-semibold">
              <div className='font-weight-semibold'>{date?.event_name}</div>
              <div className="ml-2 font-weight-semibold">{date?.date_name} Date</div>
            </div>
            {/* <div className='d-flex'>
                            <div>{date?.event_name}</div>
                            <div className='ml-2'>{date?.date_name}</div>
                        </div>
                        <div className='ml-2'>{formatDateForPanelDisplay(date?.calculated_date)}</div> */}
          </>
        ))}
        {upcomingActs?.map((act, index)=> (
            <>
                <div className="d-flex justify-content-between task" key={index}>
              <div>
                <span className='primary-color-80'>
                  {new Date(act?.end_date).toLocaleDateString("en-US", {
                    weekday: "long",
                  })}
                </span>
              </div>
              <div>
                <span className='primary-color-80'>
                {formatDate(act?.end_date)}
                  {/* {new Date(act?.start_date).toLocaleDateString("en-US", {
                    month: "2-digit",
                    day: "2-digit",
                    year: "numeric",
                  })} */}
                </span>
              </div>
            </div>
            <div className="d-flex justify-content-center task">
              <span className='text-center font-weight-semibold'>{act?.event_name} Date</span>
            </div>
            </>
        ))}
      </div>
    );
}
export default LitigationTimeLines