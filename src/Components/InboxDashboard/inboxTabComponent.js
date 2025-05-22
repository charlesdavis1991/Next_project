import React from "react";


const InboxTabComponent = ({ id, label, inboxTab, tabKey, count, onClick }) => {

  return ( 
        <a
            style={{
                background:
                    inboxTab === tabKey
                        ? "var(--primary) !important"
                        : "var(--primary-70) !important",
            }}
            onClick={() => onClick(tabKey)}
            id={id}
            className={`nav-item text-capitalize nav-link inbox-tab btn btn-primary rounded-0 ${
                inboxTab === tabKey ? "active" : ""
            }`}
            data-toggle="tab"
            href={`#inbox-tab-${id}`}
            role="tab"
            aria-controls="all"
            aria-selected="true"
        >
            {label}
            {count > 0 && (
                <span className="fw-bold m-l-5 text-gold">{count}</span>
            )}
        </a>
  );
}

export default InboxTabComponent