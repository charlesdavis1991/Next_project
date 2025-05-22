import React from "react";

const Tabs = ({ onSelect}) => {

  return (
<>



    <div
    className="nav nav-tabs directory-tab-box h-25px"
    id="nav-tab"
    role="tablist"
    style={{ paddingRight: "16px" }}
  >   
 

  <a
  className="nav-item nav-link active PT9-LFD me-3"
  id="documents-nav-home-tab"
  data-toggle="tab"
  href="#documents-nav-home"
  role="tab"
  aria-controls="documents-nav-home"
  aria-selected="true"
  onClick={() => onSelect("documents")}
  style={{
    transition: "all -0.1s ease",
    // padding: "7px 10px",
    margin: "0",
    border: "none",
    boxSizing: "border-box",
  }}
  data-text="Documents"
> <div className="d-flex align-items-center">
    <span>
        Documents
    </span>
    {/* <span className="badge badge-primary ml-1">{allCount}</span> */}
  </div>

</a>
<a
    className="nav-item nav-link PT9-LFD"
    id="yourcopilotfirms-nav-tab"
    data-toggle="tab"
    href="#yourcopilotfirms-nav-home"
    role="tab"
    aria-controls="yourcopilotfirms-nav-home"
    aria-selected="false"
    onClick={() => onSelect("yourcopilotfirms")}

    style={{
      transition: "all -0.1s ease",
      // padding: "7px 10px",
      margin: "0",
      border: "none",
      boxSizing: "border-box",
    }}
    data-text="Your Co Pilot Firms "
  > <div className="d-flex align-items-center">
  <span>
      Your Co Pilot Firms 
  </span>
  {/* <span className="badge badge-primary ml-1">{unsortedCount}</span> */}
</div></a>

<a
    className="nav-item nav-link PT9-LFD"
    id="possiblecases-nav-tab"
    data-toggle="tab"
    href="#possiblecases-nav-home"
    role="tab"
    aria-controls="possiblecases-nav-home"
    aria-selected="false"
    onClick={() => onSelect("possiblecases")}

    style={{
      transition: "all -0.1s ease",
      // padding: "7px 10px",
      margin: "0",
      border: "none",
      boxSizing: "border-box",
    }}
    data-text="Possible Cases"
  > <div className="d-flex align-items-center">
  <span>
      Possible Cases
  </span>
  {/* <span className="badge badge-primary ml-1">{unsortedCount}</span> */}
</div></a>




</div>
</>
  );
};

export default Tabs;
