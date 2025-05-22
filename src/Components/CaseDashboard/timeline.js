import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export const TimeLine = () => {

    const casePageData = useSelector((state) => state.case.caseData);

    return (

        <div
            className="calendar-borders position-relative"
            style={{ width: "250px", height:"100%" }}
        >
            <h4 className="client-contact-title text-center d-flex justify-content-center align-items-center">
                Case Timeline
            </h4>
            {
                new Array(20).fill(1).map((index,i)=>{

                    return(
                        <div key={i}>
                        <div
                        className={`d-flex justify-content-between task p-1`}
                        style={{
                            height:"25px",
                            backgroundColor:
                                i % 2 === 0 ? "#FAFBFC" : "#F6F7F9",
                            borderRadius: "1px",
                        }}
                    >
            </div>
                        </div>
                    )
                })
            }
            {casePageData && casePageData.timeline_events && casePageData.timeline_events.length>0 && casePageData.timeline_events.map((temp, index) => (
                <div key={index} style={{ marginBottom: "5px" }}>
                    <div
                        className={`d-flex justify-content-between task p-1`}
                        style={{
                            backgroundColor:
                                index % 2 === 0 ? "white" : "#E8E8E8",
                            borderRadius: "1px",
                        }}
                    >
                        <div style={{ marginBottom: "5px" }}>
                            <strong>
                                {new Date(temp.date).toLocaleDateString(
                                    "en-US",
                                    {
                                        weekday: "long",
                                    }
                                )}
                            </strong>
                        </div>
                        <div style={{ marginBottom: "5px" }}>
                            <strong>
                                {new Date(temp.date).toLocaleDateString(
                                    "en-US",
                                    {
                                        month: "numeric",
                                        day: "2-digit",
                                        year: "numeric",
                                    }
                                )}
                            </strong>
                        </div>
                    </div>
                    <div className="task d-block">
                        {temp && temp.events && temp.events.map((x, innerIndex) => (
                            <div
                                key={innerIndex}
                                className="d-flex justify-content-between p-1"
                                style={{
                                    marginBottom: "5px",
                                    backgroundColor:
                                        innerIndex % 2 === 0 ? "white" : "#E8E8E8",
                                }}
                            >
                                {x.type === "Litigation" ? (
                                    x.event_name ? (
                                        <>
                                            {x.is_allday ? (
                                                <span>all-day</span>
                                            ) : (
                                                <span>
                                                    {new Date(
                                                        temp.date
                                                    ).toLocaleTimeString("en-US", {
                                                        hour: "numeric",
                                                        minute: "numeric",
                                                        hour12: true,
                                                    })}
                                                </span>
                                            )}
                                            <span className="text-right d-block">
                                                <i></i> {x.event_name}
                                            </span>
                                        </>
                                    ) : (
                                        <></>
                                    )
                                ) : (
                                    <div
                                        className="d-flex justify-content-between w-100"
                                        style={{
                                            backgroundColor:
                                                innerIndex % 2 === 0
                                                    ? "white"
                                                    : "#E8E8E8",
                                        }}
                                    >
                                        <div
                                            className="d-flex align-items-center justify-content-center text-center text-white specialty-icon"
                                            style={{
                                                backgroundColor:
                                                    x.event?.for_provider?.specialty
                                                        ?.color,
                                            }}
                                        >
                                            {x.event?.for_provider?.specialty
                                                ?.name[0] || ""}
                                        </div>
                                        <div className="text-right flex-grow-1">
                                            {
                                                x.event?.for_provider?.provider
                                                    ?.providerprofile?.office_name
                                            }
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>

    )
}
