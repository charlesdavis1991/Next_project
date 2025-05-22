
import React, { useEffect, useState, useRef } from 'react';
import "../../../public/BP_resources/css/litigation.css";
import Button from '../ClientDashboard/shared/button';
import { useMediaQuery } from 'react-responsive'

export default function LitigationTimeline({ timelineEvents = [], caseDetails = [] }) {

    const calculateSolDate = (id, caseId, type) => {
        // Implement your date calculation logic here
    };

    const isAfterToday = (date) => {
        // Implement your date comparison logic here
    };

    const removeZeroFromDates = (date) => {
        // Implement your date formatting logic here
    };

    // Media queries
  const isSmallestCards = useMediaQuery({ minWidth: 2400 });
  const isSmallerCards = useMediaQuery({ minWidth: 2100, maxWidth: 2350 });
  const isSmallCards = useMediaQuery({ minWidth: 1850, maxWidth: 2100 });
  const isBigCards = useMediaQuery({ minWidth: 1650, maxWidth: 1850 });
  const isBiggerCards = useMediaQuery({ minWidth: 1450, maxWidth: 1650 });
  const isBiggestCards = useMediaQuery({ minWidth: 1050, maxWidth: 1450 });

    const emptyRows = (count) => {
        let rows = [];
        for (let i = 0; i < count; i++) {
            rows.push(
                <div className="d-flex justify-content-between task" key={`empty-${i}`}>
                    <div>
                        <strong>&nbsp;</strong>
                    </div>
                    <div>
                        <strong>&nbsp;</strong>
                    </div>
                </div>
            );
        }
        return rows;
    };
    return (
        <div className="calendar-borders position-relative border-0 h-100">
            <h4 className="client-contact-title text-center d-flex justify-content-center align-items-center">Litigation Timeline</h4>
            {timelineEvents?.length > 0 ? (
                timelineEvents.map((temp, index) => (
                <React.Fragment key={index}>
                    <div className="d-flex justify-content-between task">
                        <div>
                            <strong>{new Date(temp.date).toLocaleDateString('en-US', { weekday: 'long' })}</strong>
                        </div>
                        <div>
                            <strong>{new Date(temp.date).toLocaleDateString('en-US')}</strong>
                        </div>
                    </div>
                    <div className="task d-block">
                        {temp?.events?.map((x, index) => (
                            <div key={index}>
                                {x.type === 'Litigation' && (
                                    x?.event?.is_allday ? (
                                        <div className="d-flex justify-content-between">
                                            <span>all-day</span>
                                            <span className="text-right d-block"><i></i> {x?.event.event_id?.event_name}</span>
                                        </div>
                                    ) : (
                                        <div className="d-flex justify-content-between">
                                            <span>{new Date(temp.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                                            <span className="text-right d-block full-width"><i></i> {x?.event?.event_id?.event_name}</span>
                                        </div>
                                    )
                                )}
                                {x.type === 'DefendantDates' && (
                                    <div className="d-flex justify-content-between">
                                        <span>all-day</span>
                                        <span className="text-right d-block full-width"><i></i> Served Date</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </React.Fragment>
            ))
        ):(
            isBigCards || isBiggerCards || isBiggestCards ? emptyRows(11) : emptyRows(3)
        )
        }

            {caseDetails?.case_type?.statute_limitaions?.all?.length > 0 ? (
            caseDetails?.case_type?.statute_limitaions?.all.map((sol, index) => (
                <React.Fragment key={index}>
                    {caseDetails.incident_date && (
                        (caseDetails?.for_client?.birthday >= 18 && sol?.statute_type === 'After DOI') && (
                            (sol?.claim_form_filing_date ? sol?.additional_statute_triggered?.all : [sol]).map((addSol, index) => {
                                const calDate = calculateSolDate(addSol.id, caseDetails.id, 'doi');
                                return isAfterToday(calDate) && (
                                    <React.Fragment key={index}>
                                        <div className="d-flex justify-content-between task">
                                            <div>
                                                <strong>{new Date(calDate).toLocaleDateString('en-US', { weekday: 'long' })}</strong>
                                            </div>
                                            <div>
                                                <strong>{removeZeroFromDates(new Date(calDate))}</strong>
                                            </div>
                                        </div>
                                        <div className="task justify-content-between" style={{ color: 'red' }}>
                                            <span>all-day</span>
                                            <span className="text-right"><i></i> SOL Date</span>
                                        </div>
                                    </React.Fragment>
                                );
                            })
                        )
                    )}
                    {caseDetails?.for_client?.birthday < 18 && sol?.statute_type === 'After 18th birthday' && (
                        (sol?.claim_form_filing_date ? sol?.additional_statute_triggered?.all : [sol]).map((addSol, index) => {
                            const calDate = calculateSolDate(addSol.id, caseDetails.id, 'birthday');
                            return isAfterToday(calDate) && (
                                <React.Fragment key={index}>
                                    <div className="task day" style={{ color: 'red' }}>
                                        <span>
                                            <strong>{new Date(calDate).toLocaleDateString('en-US', { weekday: 'long' })}</strong>
                                        </span>
                                        <span>
                                            <strong>{removeZeroFromDates(new Date(calDate))}</strong>
                                        </span>
                                    </div>
                                    <div className="task justify-content-between" style={{ color: 'red' }}>
                                        <span>all-day</span>
                                        <span className="text-right"><i></i> SOL Date</span>
                                    </div>
                                </React.Fragment>
                            );
                        })
                    )}
                    {!sol?.statute_type && (
                        (sol?.claim_form_filing_date ? sol?.additional_statute_triggered?.all : [sol]).map((addSol, index) => {
                            const calDate = calculateSolDate(addSol.id, caseDetails.id, 'doi');
                            return isAfterToday(calDate) && (
                                <React.Fragment key={index}>
                                    <div className="task day" style={{ color: 'red' }}>
                                        <span>
                                            <strong>{new Date(calDate).toLocaleDateString('en-US', { weekday: 'long' })}</strong>
                                        </span>
                                        <span>
                                            <strong>{removeZeroFromDates(new Date(calDate))}</strong>
                                        </span>
                                    </div>
                                    <div className="task justify-content-between" style={{ color: 'red' }}>
                                        <span>all-day</span>
                                        <span className="text-right"><i></i> SOL Date</span>
                                    </div>
                                </React.Fragment>
                            );
                        })
                    )}
                </React.Fragment>
            ))
        ):(
            emptyRows(4) 
        )}
        </div>
    );
}