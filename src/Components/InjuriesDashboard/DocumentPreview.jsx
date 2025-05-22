import React, { useState, useEffect, useRef } from "react";
import { Modal, Button, Table, InputGroup, FormControl } from "react-bootstrap";
import { Document, Page, pdfjs } from "react-pdf";
import axios from "axios";
import { getCaseId, getClientId, getToken } from "../../Utils/helper";
import FirmUserModal from "./AddTaskDocModal.jsx";
import ChatDocLinkModal from "./ChatDocLinkModal.jsx";
import TodoModal from "./LinkDocToTask.jsx";

// Set workerSrc for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const DocumentPreviewModal = ({
  show,
  handleClose,
  docId,
  caseId,
  dropdown_events,
  dropdown_pages,
  page,
}) => {
  const [documentDetails, setDocumentDetails] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [zoom, setZoom] = useState(1.0);
  const [file, setFile] = useState(null);
  const [docData, setDocData] = useState(null);
  const [profileImg, setProfileImg] = useState(null);

  const [clientData, setClientData] = useState(null);
  const [attachedByProfile, setAttachedByProfile] = useState("");
  const [attachedBy, setAttachedBy] = useState("");
  const [date, setDate] = useState("");
  const [caseType, setCaseType] = useState("");
  const [clientImage, setClientImage] = useState("");
  const [pageInfo, setPageInfo] = useState("");
  const [panels, setPanels] = useState("");
  const [slpNum, setSlpNum] = useState("");
  const [slp, setSlp] = useState("");
  const [documentData, setDocumentData] = useState(null);
  const [discoverySlot, setDiscoverySlot] = useState("");

  // State for document rename
  const [newDocName, setNewDocName] = useState("");
  const [showRenameModal, setShowRenameModal] = useState(false);

  // State for toggling thumbnails visibility
  const [showThumbnails, setShowThumbnails] = useState(true);

  const [subMenus, setSubMenus] = useState({});
  const [TaskModalOpen, setTaskModalOpen] = useState(false);
  const [chatDocLinkModalOpen, setDocLinkModalOpen] = useState(false);
  const [toDoModalOpen, setToDoModalOpen] = useState(false);

  const origin = process.env.REACT_APP_BACKEND_URL;
  const clientId = getClientId();

  const pageRefs = useRef([]);
  const thumbnailRefs = useRef([]);
  const thumbnailsContainerRef = useRef(null);

  const scrollToPage = (pageIndex) => {
    if (pageRefs.current[pageIndex]) {
      pageRefs.current[pageIndex].scrollIntoView({ behavior: "smooth" });
    }
    setPageNumber(pageIndex + 1);
  };

  const scrollToThumbnail = (pageIndex) => {
    if (thumbnailRefs.current[pageIndex] && thumbnailsContainerRef.current) {
      const thumbnail = thumbnailRefs.current[pageIndex];
      const container = thumbnailsContainerRef.current;
      const thumbnailOffsetTop = thumbnail.offsetTop;
      const containerScrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;

      if (
        thumbnailOffsetTop < containerScrollTop ||
        thumbnailOffsetTop > containerScrollTop + containerHeight
      ) {
        container.scrollTo({
          top: thumbnailOffsetTop - containerHeight / 2,
          behavior: "smooth",
        });
      }
    }
  };

  useEffect(() => {
    scrollToThumbnail(pageNumber - 1);
  }, [pageNumber]);

  const handleTaskModalOpen = () => {
    setTaskModalOpen(true);
    handleClose();
  };

  const handleTaskModalClose = () => {
    setTaskModalOpen(false);
  };

  const handleDocLinkModalOpen = () => {
    setDocLinkModalOpen(true);
    handleClose();
  };

  const handleDocLinkModalClose = () => {
    setDocLinkModalOpen(false);
  };

  const handleToDoModalOpen = () => {
    setToDoModalOpen(true);
    handleClose();
  };

  const handleToDoModalClose = () => {
    setToDoModalOpen(false);
  };

  // Toggle thumbnails visibility
  const toggleThumbnails = () => {
    setShowThumbnails(!showThumbnails);
  };

  // Function to handle printing the document
  const handlePrint = async () => {
    if (file) {
      try {
        const response = await fetch(file);
        const fileData = await response.blob();
        
        const fileUrl = URL.createObjectURL(fileData);
  
        const iframe = document.createElement('iframe');
        iframe.style.position = 'absolute';
        iframe.style.width = '0px';
        iframe.style.height = '0px';
        iframe.style.border = 'none';
  
        iframe.src = fileUrl;
  
        iframe.onload = () => {
          iframe.contentWindow.focus();
          iframe.contentWindow.print();
        };
  
        document.body.appendChild(iframe);
      } catch (error) {
        console.error("Failed to fetch or print the file:", error);
      }
    } else {
      console.error("No file to print.");
    }
  };
  
  
  // Function to handle downloading the document
  const handleDownload = async (docId) => {
    try {
      const response = await axios.post(
        origin + "/api/delete-doc-api/",
        {
          doc_id: docId,
          check: "",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: getToken(),
          },
        }
      );
      const data = response.data.data;
      const bytes = new Uint8Array(
        atob(data)
          .split("")
          .map((char) => char.charCodeAt(0))
      );
      const file = new Blob([bytes], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);

      const link = document.createElement("a");
      link.href = fileURL;
      link.setAttribute("download", "file.pdf");
      document.body.appendChild(link);
      link.click();

      link.parentNode.removeChild(link);
    } catch (error) {
      console.log(error);
      if (error.response) {
        console.error("Response error:", error.response.data);
      } else if (error.request) {
        console.error("No response:", error.request);
      } else {
        console.error("Error", error.message);
      }
    }
  };

  const handleRemove = async (docId) => {
    try {
      const response = await axios.put(
        origin + "/api/remove-doc/",
        {
          doc_id: docId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: getToken(),
          },
        }
      );

      if (response.status === 200) {
        console.log("Document renamed successfully:", response.data);
        handleClose();
      } else {
        console.log("Failed to rename document due to server-side error.");
      }
    } catch (error) {
      console.log(error);
      console.log(
        error.response?.data?.message || "An unexpected error occurred"
      );
    }
  };

  const handleDelete = async (docId) => {
    try {
      const response = await axios.post(
        origin + "/api/delete-doc-api/",
        {
          doc_id: docId,
          check: "Delete",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: getToken(),
          },
        }
      );
      const data = response.data.data;
      const bytes = new Uint8Array(
        atob(data)
          .split("")
          .map((char) => char.charCodeAt(0))
      );
      const blob = new Blob([bytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      var iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = url;
      document.body.appendChild(iframe);
      iframe.onload = () => {
        iframe.contentWindow.print();
        document.body.removeChild(iframe);
      };
    } catch (error) {
      console.log(error);
      if (error.response) {
        console.error("Response error:", error.response.data);
      } else if (error.request) {
        console.error("No response:", error.request);
      } else {
        console.error("Error", error.message);
      }
    }
  };

  /* Doc rename */
  const handleRenameChange = (e) => {
    setNewDocName(e.target.value);
  };

  const getDocRename = (docId) => {
    setShowRenameModal(true);
    handleClose(true);
  };

  const handleRenameClose = () => {
    setShowRenameModal(false);
  };

  const docRename = async (docId, newDocName) => {
    try {
      const response = await axios.put(
        origin + `/api/rename-doc/`,
        {
          doc_id: docId,
          doc_rename: newDocName,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: getToken(),
          },
        }
      );
      if (response.data.result === "success") {
        console.log("Document renamed successfully");
        handleRenameClose();
      }
    } catch (error) {
      console.error(`Error renaming document: ${error}`);
    }
  };
  /** */

  const fetchDataDoc = async (pageId, caseId, pageN) => {
    try {
      const response = await axios.get(origin + "/30/ListPagePanels/", {
        params: {
          page_id: pageId,
          case_id: caseId.id,
          page_name: pageN,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching document data:", error);
      return null;
    }
  };

  const getDataDoc = async (pageId, pageName) => {
    const res = await fetchDataDoc(pageId, caseId, pageName);
    if (res) {
      const data = res.data;
      const doc_slots = res.document_slots;
      const docs = res.docs;
      const events = dropdown_events.map(
        (event) => event.litigation_event_type
      );
      console.log("events : ", events)

      const slotsHtml = doc_slots.filter((slot) => slot.slot_number !== 0).map((slot, index) => {
        const matchedDoc = docs.find(
          (doc) =>
            doc.document_slot &&
            doc.document_slot.slot_number === slot.slot_number
        );
        const slotName = matchedDoc
          ? matchedDoc.file_name
          : slot.slot_name || "Available";
        const textGrey = matchedDoc ? "" : "text-lg-grey";

        return (
          <li key={index}>
            <a
              onClick={(e) =>
                postDocPopUp(
                  caseId.id,
                  pageId,
                  matchedDoc?.id,
                  docId,
                  slot.id,
                  "True",
                  pageName,
                  matchedDoc?.panel_name
                )
              }
              className={`doc-pop-width-90P DD3-Align ${textGrey}`}
              href="#"
            >
              <i
                className={`ic ic-23 ic-file-${matchedDoc ? "colored" : "grey"} cursor-pointer ml-1 mr-1`}
              ></i>
              {slot.slot_number}. {slotName}
            </a>
          </li>
        );
      });

      const generalAttachHtml = (
        <li>
          <a
            onClick={(e) => postDocPopUp(caseId.id, pageId, null, docId, null, "True", pageName, null)}
            className="doc-pop-width-90P DD3-Align"
            href="#"
          >
            <img src={`${origin}${page.page_icon}`} className="mr-1 ml-1" />{" "}
            Attach to {pageName} page generally
          </a>
        </li>
      );

      if (events.includes(pageName)) {
        slotsHtml.push(
          <li key="new-item">
            <a
              href="#"
              onClick={(e) =>
                showDiscoveryPopUP(
                  caseId.id,
                  pageId,
                  docId,
                  "",
                  "",
                  "True",
                  pageName,
                  e
                )
              }
            >
              Create a New {pageName}
            </a>
          </li>
        );
      }


      setSubMenus((prevState) => ({
        ...prevState,
        [pageId]: (
          <ul key={pageId} className="dropdown-menu ul2-8 submenu s-drop translate-X-dropdown" style={{ left: 'auto' }}>
            {slotsHtml}
            {generalAttachHtml}
          </ul>
        ),
      }));
    }
  };
  

  const postDocPopUp = async (
    caseId,
    pageId,
    panelId,
    docId,
    slot,
    panels,
    pageName,
    panelName
  ) => {
    const events = dropdown_events.map((event) => event.litigation_event_type);

    try {
      await axios.post(
        `${origin}/api/attach_doc_to_page/`,
        {
          page_id: pageId,
          case_id: caseId,
          panel_id: panelId,
          doc_id: docId,
          slot: slot,
          panels: panels,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: getToken(),
          },
        }
      );
    } catch (error) {
      console.error(`Error ${error}`);
    }
  };

  const showDiscoveryPopUP = (caseId, docId, discoverySlot, pageName, e) => {
    console.log("CaseId", caseId, docId, discoverySlot, pageName);
  };

  useEffect(() => {
    if (docId) {
      axios
        .get(origin + `/30/ListDoc/?doc_id=${docId}`)
        .then((response) => {
          setDocumentDetails(response.data);
          const fullUrl = `${response.data.upload_url}`;
          const imgUrl = `${process.env.REACT_APP_BACKEND_URL}${response.data.attached_by_profile}`;
          setFile(fullUrl);
          setProfileImg(imgUrl);
          setDocData(response.data);

          const data = response.data.data;
          const docToDo = response.data.docToDo;
          const docUpload = response.data.upload_url;
          const pageData = response.data.page;

          setAttachedByProfile(imgUrl);
          setAttachedBy(
            `${data.attached_by.first_name} ${data.attached_by.last_name}`
          );
          setDate(data.docDate);
          setDocumentData(data);
          setClientData(data.for_client);
          setClientImage(data.for_client.profile_pic_29p);
          setCaseType(data.for_case.case_type.name);
          setPageInfo(
            pageData ? (
              <div>
                <img src={`${process.env.REACT_APP_BACKEND_URL}${pageData.page_icon}`} width="20" alt="" />
                <p className="ml-1">{data.page_name}</p>
              </div>
            ) : (
              ""
            )
          );

          setPanels(response.data.panel_name || "");

          if (data.document_slot) {
            setSlpNum(`${data.document_slot.slot_number}.`);
            setSlp(data.document_slot.slot_name || "Available");
          }
        })
        .catch((error) => {
          console.error(
            "There was an error fetching the document details!",
            error
          );
        });
    }
  }, [docId]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleZoomIn = () => {
    setZoom((prevZoom) => prevZoom + 0.25);
  };

  const handleZoomOut = () => {
    setZoom((prevZoom) => (prevZoom - 0.25 > 0.25 ? prevZoom - 0.25 : 0.25));
  };

  const handleSetZoom = (zoomLevel) => {
    if (zoomLevel === "width") {
      setZoom(1);
    } else if (zoomLevel === "fit") {
      setZoom(0.5);
    }
  };

  const handlePageChange = (newPageNumber) => {
    if (newPageNumber > 0 && newPageNumber <= numPages) {
      setPageNumber(newPageNumber);
    }
  };

  useEffect(() => {
    const adjustWidths = () => {
      const avatar = document.querySelector(".client-name .has-avatar-icon");
      const userName = document.querySelector(".client-name .user_name");

      if (avatar && userName) {
        const avatarWidth = avatar.getBoundingClientRect().width;
        const nameWidth = userName.getBoundingClientRect().width;
        const clientNameWidth = avatarWidth + nameWidth + 25; // 20 for padding, 5 for inner margin

        const rightSidebar = document.querySelector(".right-siderbar");
        rightSidebar.style.width = `${clientNameWidth}px`;
        rightSidebar.style.maxWidth = `${clientNameWidth}px`;

        const fixedWidth = rightSidebar.getBoundingClientRect().width;

        const pdfViewer = document.querySelector(".pdfviewer");
        const clientSearcher = document.querySelector(".client-search-wrapper");

        pdfViewer.style.width = `calc(100% - ${fixedWidth}px)`;
        clientSearcher.style.width = `calc(100% - ${fixedWidth}px)`;
      }
    };

    if (show) {
      adjustWidths();
      window.addEventListener("resize", adjustWidths);
    }

    return () => {
      window.removeEventListener("resize", adjustWidths);
    };
  }, [show]);

  const pageStyle = {
    padding: "10px",
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0);

  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 0) {
      const results = [];
      const loadingTask = pdfjs.getDocument(file);
      const pdfDocument = await loadingTask.promise;

      for (let i = 1; i <= pdfDocument.numPages; i++) {
        const page = await pdfDocument.getPage(i);
        const textContent = await page.getTextContent();
        const textItems = textContent.items.map((item) => item.str).join(" ");

        if (textItems.toLowerCase().includes(query.toLowerCase())) {
          results.push({ page: i, content: textItems });
        }
      }

      setSearchResults(results);
      if (results.length > 0) {
        setPageNumber(results[0].page);
        scrollToSearchResult(results[0].page);
      }
    } else {
      setSearchResults([]);
    }
  };

  const scrollToSearchResult = (page) => {
    const element = document.querySelector(`.pdf-page`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        size="xxl"
        className="modal-fullscreen-xl"
      >
        <Modal.Header className="text-center height-35 p-0 bg-primary rounded-0 border-0">
          <Modal.Title className="mx-auto text-white text-upper height-35">
            Document Viewing and Control
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0 modal-pointer-event" id="overflow-y-sc">
          <div className="client-search-wrapper">
            <div className="documents-row w-100">
              <div className="single-document">
                <div className="table-responsive table--no-card rounded-0 border-0 doc-pop-overflow-visible">
                  <div className="client-search">
                    <FormControl
                      type="text"
                      className="form-control"
                      id="search-doc"
                      placeholder="Search for Client.."
                    />
                  </div>
                  <Table className="table table-earning" id="table-doc">
                    <thead>
                      <tr id="client-search-tb-head">
                        <th></th>
                        <th className="text-center">Client Name</th>
                        <th className="text-center">Birthday</th>
                        <th className="text-center">Case / DOI</th>
                        <th className="text-center">Stage</th>
                        <th className="text-center doc-pop-padding-left-12px-padding-right-12px-width-109-39px"></th>
                      </tr>
                    </thead>
                    <tbody>{/* Render search results here */}</tbody>
                  </Table>
                </div>
              </div>
            </div>
          </div>

          <div className="pdfviewer">
            <div className="pdftoolbar p-l-5 p-r-5 align-items-center">
              <div className="col-md-3 col-lg-5 col-xl-6 col-xxl-7 p-0 d-flex align-items-center">
                <button className="pushed" onClick={toggleThumbnails}>
                  <i className="material-icons-outlined">view_sidebar</i>
                </button>
                <InputGroup className="d-flex-1 p-l-5">
                  <FormControl
                    type="text"
                    className="form-control height-35"
                    placeholder="Type Text to Search Within Document"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </InputGroup>
                <div className="center-controls d-flex align-items-center justify-content-center ml-auto">
                  <button onClick={() => handlePageChange(pageNumber - 1)}>
                    <i className="material-icons-outlined">arrow_upward</i>
                  </button>
                  <FormControl
                    id="pageno"
                    className="pageno"
                    type="number"
                    value={pageNumber}
                    min="1"
                    max={numPages}
                    onChange={(e) => handlePageChange(parseInt(e.target.value))}
                  />
                  <button onClick={() => handlePageChange(pageNumber + 1)}>
                    <i className="material-icons-outlined">arrow_downward</i>
                  </button>
                </div>
              </div>

              <div className="col-md-9 col-lg-7 col-xl-6 col-xxl-5 p-0 d-flex align-items-center justify-content-end">
                <div className="zoom-controls d-flex align-items-center justify-content-center">
                  <button onClick={handleZoomIn}>
                    <i className="material-icons-outlined">add</i>
                  </button>
                  <div className="v-sep"></div>
                  <button onClick={handleZoomOut}>
                    <i className="material-icons-outlined">remove</i>
                  </button>
                  <div className="dropdown">
                    <div className="dropdown-value" onClick={() => {}}>
                      <span className="zoomval">50%</span>
                      <i className="material-icons-outlined">
                        keyboard_arrow_down
                      </i>
                    </div>
                    <div className="dropdown-content">
                      <a href="#" onClick={() => setZoom(0.5)}>
                        50%
                      </a>
                      <a href="#" onClick={() => setZoom(0.75)}>
                        75%
                      </a>
                      <a href="#" onClick={() => setZoom(1)}>
                        100%
                      </a>
                      <a href="#" onClick={() => setZoom(1.25)}>
                        125%
                      </a>
                      <a href="#" onClick={() => setZoom(1.5)}>
                        150%
                      </a>
                      <a href="#" onClick={() => setZoom(2)}>
                        200%
                      </a>
                      <a href="#" onClick={() => setZoom(3)}>
                        300%
                      </a>
                      <a href="#" onClick={() => setZoom(4)}>
                        400%
                      </a>
                    </div>
                  </div>
                  <div class="ml-2">
                    <button
                      type="button"
                      class="pushed"
                      onClick={() => handleSetZoom("width")}
                    >
                      Page Width
                    </button>
                    <button
                      type="button"
                      class="pushed"
                      onClick={() => handleSetZoom("fit")}
                    >
                      Full Page
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="pdfviewer-container">
              {showThumbnails && (
                <div className="thumbnails pdfjs-viewer doc-pop-background-color-white" ref={thumbnailsContainerRef}>
                  {numPages &&
                Array.from(new Array(numPages), (el, index) => (
                  <Document file={file} key={index}>
                    <div
                      className={`thumbnail ${pageNumber === index + 1 ? "selected" : ""}`}
                      onClick={() => scrollToPage(index)}
                      ref={(el) => (thumbnailRefs.current[index] = el)}
                    >
                      <Page pageNumber={index + 1} scale={0.2} className="thumbnail-page" renderTextLayer={false} renderAnnotationLayer={false} />
                    </div>
                  </Document>
                ))}
                </div>
              )}
              <div
                className="maindoc pdfjs-viewer doc-pop-background-color-white"
                id="main-doc"
              >
                {file ? (
                <Document file={file} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
                  {Array.from(new Array(numPages), (el, index) => (
                    <div key={`page_${index + 1}`} ref={(el) => (pageRefs.current[index] = el)}>
                      <Page
                        pageNumber={index + 1}
                        scale={zoom}
                        className="pdf-page"
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                      />
                    </div>
                  ))}
                </Document>
              ) : (
                <p>Loading PDF....</p>
              )}
              </div>
            </div>

            <div className="pdftoolbar p-l-5 p-r-5 align-items-center">
              <div className="col-md-3 col-lg-5 col-xl-6 col-xxl-7 p-0 d-flex align-items-center">
                <button className="pushed" onClick={toggleThumbnails}>
                  <i className="material-icons-outlined">view_sidebar</i>
                </button>
                <InputGroup className="d-flex-1 p-l-5">
                  <FormControl
                    type="text"
                    className="form-control height-35"
                    placeholder="Type Text to Search Within Document"
                  />
                </InputGroup>
                <div className="center-controls d-flex align-items-center justify-content-center ml-auto">
                  <button onClick={() => handlePageChange(pageNumber - 1)}>
                    <i className="material-icons-outlined">arrow_upward</i>
                  </button>
                  <FormControl
                    id="pageno"
                    className="pageno"
                    type="number"
                    value={pageNumber}
                    min="1"
                    max={numPages}
                    onChange={(e) => handlePageChange(parseInt(e.target.value))}
                  />
                  <button onClick={() => handlePageChange(pageNumber + 1)}>
                    <i className="material-icons-outlined">arrow_downward</i>
                  </button>
                </div>
              </div>

              <div className="col-md-9 col-lg-7 col-xl-6 col-xxl-5 p-0 d-flex align-items-center justify-content-end">
                <div className="zoom-controls d-flex align-items-center justify-content-center">
                  <button onClick={handleZoomIn}>
                    <i className="material-icons-outlined">add</i>
                  </button>
                  <div className="v-sep"></div>
                  <button onClick={handleZoomOut}>
                    <i className="material-icons-outlined">remove</i>
                  </button>
                  <div className="dropdown">
                    <div className="dropdown-value" onClick={() => {}}>
                      <span className="zoomval">50%</span>
                      <i className="material-icons-outlined">
                        keyboard_arrow_down
                      </i>
                    </div>
                    <div className="dropdown-content">
                      <a href="#" onClick={() => setZoom(0.5)}>
                        50%
                      </a>
                      <a href="#" onClick={() => setZoom(0.75)}>
                        75%
                      </a>
                      <a href="#" onClick={() => setZoom(1)}>
                        100%
                      </a>
                      <a href="#" onClick={() => setZoom(1.25)}>
                        125%
                      </a>
                      <a href="#" onClick={() => setZoom(1.5)}>
                        150%
                      </a>
                      <a href="#" onClick={() => setZoom(2)}>
                        200%
                      </a>
                      <a href="#" onClick={() => setZoom(3)}>
                        300%
                      </a>
                      <a href="#" onClick={() => setZoom(4)}>
                        400%
                      </a>
                    </div>
                  </div>
                  <div class="ml-2">
                    <button
                      type="button"
                      class="pushed"
                      onClick={() => handleSetZoom("width")}
                    >
                      Page Width
                    </button>
                    <button
                      type="button"
                      class="pushed"
                      onClick={() => handleSetZoom("fit")}
                    >
                      Full Page
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="right-siderbar d-flex flex-column" id="docData">
            <div className="top-content">
              <div className="client-name d-flex align-items-center side-bar-padding">
                <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
                  {clientImage ? <img src={clientImage} alt="" /> : ""}
                </span>
                <span className="ml-2 text-black white-space-nowrap user_name">
                  <a className="clientTabFont d-block" href="#">
                    {clientData &&
                      `${clientData.last_name}, ${clientData.first_name}`}
                  </a>
                </span>
              </div>
              <div className="basic-info mb-2 p-r-5 p-l-5">
                <div className="tile-row w-100">
                  <span className="text-black font-weight-semibold d-block">
                    {caseType}
                  </span>
                  <p className="text-darker">
                    <span className="d-inline-block text-dark-grey mr-1">
                      DOI:
                    </span>
                    3/21/2023
                  </p>
                </div>
                <div className="tile-row mw-100">
                  <span className="text-black text-left text-break font-weight-semibold d-block">
                    {documentData && `${documentData.file_name}`}
                  </span>
                </div>
                <div className="tile-row d-flex flex-wrap w-100">
                  <div className="input-wrap d-flex-1 ">
                    <input
                      className="form-control height-21 p-l-5"
                      id="document_rename"
                      placeholder="Type New Document Name"
                      value={newDocName}
                      onChange={handleRenameChange}
                    />
                  </div>
                  <button
                    type="button"
                    variant="success"
                    onClick={() => getDocRename(docId)}
                    className="btn btn-secondary bg-success d-flex justify-content-center align-items-center doc-pop-visibility-visible doc-pop-height-21px m-l-5"
                  >
                    Save
                  </button>
                </div>
                <div className="tile-row d-flex flex-wrap w-100">
                  <span className="text-lightgray text-lg">Attached:</span>
                  <span className="text-black col-8 ml-auto font-weight-semibold text-right pr-0">
                    {date}
                  </span>
                </div>
                <div className="tile-row d-flex align-items-center flex-wrap w-100">
                  <span className="text-lightgray text-lg">By:</span>
                  <span className="text-black col-8 ml-auto font-weight-semibold text-right pr-0">
                    <a
                      href="#"
                      className="d-flex align-items-center justify-content-end"
                    >
                      <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
                        <img src={attachedByProfile} alt="" />
                      </span>
                      <span className="ml-2 text-black">{attachedBy}</span>
                    </a>
                  </span>
                </div>
                <div className="tile-row d-flex align-items-center flex-wrap w-100 mt-3">
                  {pageInfo}
                </div>
                <div className="tile-row d-flex flex-wrap w-100">
                  <p className="ml-4">{panels}</p>
                </div>
                <div className="tile-row d-flex flex-wrap w-100">
                  <p className="doc-pop-margin-left-2-5rem">
                    <span className="counter">{slpNum}</span>
                    {slp}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <div className="dropdown mb-2 has-sub-dropdown height-420">
                <p className="text-center color-main">
                  CLICK TO MOVE DOCUMENT:
                </p>
                <button
                  className={`btn letter-template-bckgrnd dropdown-toggle d-none w-100 form-select btn-${docId}-${caseId?.id}`}
                  onClick={(e) => showDrop(e, docId, caseId?.id)}
                  type="button"
                >
                  Move to New Page and Slot <span className="caret"></span>
                </button>
                <div className={`dropdown d-${docId}-${caseId?.id} show`}>
                  <ul className="dropdown-menu dropdown-menu-parent add-menu">
                    {dropdown_pages?.map((page) => (
                      <li className="dropdown-submenu" key={page.id}>
                        <a
                          onMouseOver={() => getDataDoc(page.id, page.name)}
                          className="test trigger hover-effect"
                          tabIndex="-1"
                          href="#"
                        >
                          <span className="has-no-after text-primary right-0 m-r-5">
                            <svg
                              width="15"
                              className="vertical-align-mid remove-hover-effect"
                              height="15"
                              viewBox="0 0 34 17"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M0.00683594 0H9.20684L17.0069 7.85384L24.807 0H34.007L17.0069 17L0.00683594 0Z"
                                fill="currentColor"
                              ></path>
                            </svg>
                          </span>
                          <img
                            src={`${origin}${page.page_icon}`}
                            className="doc-pop-width-15px-height-15px mr-1"
                          />
                          {page.name} <span className="caret"></span>
                        </a>
                        {subMenus[page.id]}
                      </li>
                    ))}
                    <li className="dropdown-submenu">
                      <a
                        onMouseOver={(e) =>
                          postDocPopUp(
                            caseId?.id,
                            "",
                            "",
                            docId,
                            "False",
                            caseId?.id,
                            "No Page",
                            ""
                          )
                        }
                        tabIndex="-1"
                        href="#"
                        className="link-case"
                      >
                        <i className="ic ic-15 ic-file-colored ml-21 mr-1"></i>
                        Unsorted on Case
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="center-content my-auto">
              <div className="tile-row w-100 p-r-5 p-l-5">
                <div className="dropdown mb-2 d-flex ">
                  <button
                    className="btn height-25 dropdown-toggle position-relative d-flex align-items-center justify-content-center w-100 form-select has-no-bg position-relative doc-rev-btn rotate-btn"
                    type="button"
                    id="doc_link"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                    onClick={handleDocLinkModalOpen}
                  >
                    <span className="has-no-after ic-arrow text-primary width-17 m-r-10 mega-hover-btn align-mid">
                      <svg
                        width="17"
                        height="23"
                        className=" "
                        viewBox="0 0 34 17"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M0.00683594 0H9.20684L17.0069 7.85384L24.807 0H34.007L17.0069 17L0.00683594 0Z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    </span>
                    Chat Document Link
                  </button>
                </div>
                <div className="dropdown mb-2 d-flex ">
                  <button
                    className="btn height-25 dropdown-toggle position-relative d-flex align-items-center justify-content-center w-100 form-select has-no-bg position-relative  doc-todo-btn rotate-btn"
                    type="button"
                    id="doc_link"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                    onClick={handleToDoModalOpen}
                  >
                    <span className="has-no-after ic-arrow text-primary width-17 m-r-10 mega-hover-btn align-mid">
                      <svg
                        width="17"
                        height="23"
                        className=""
                        viewBox="0 0 34 17"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M0.00683594 0H9.20684L17.0069 7.85384L24.807 0H34.007L17.0069 17L0.00683594 0Z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    </span>
                    Link Doc To Task
                  </button>
                </div>
                <div className="dropdown mb-2 d-flex ">
                  <button
                    className="btn height-25 dropdown-toggle position-relative d-flex align-items-center justify-content-center w-100 form-select has-no-bg position-relative doc-rev-btn rotate-btn"
                    type="button"
                    id="doc_link"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                    onClick={handleTaskModalOpen}
                  >
                    <span className="has-no-after ic-arrow text-primary width-17 m-r-10 mega-hover-btn align-mid">
                      <svg
                        width="17"
                        height="23"
                        className=""
                        viewBox="0 0 34 17"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M0.00683594 0H9.20684L17.0069 7.85384L24.807 0H34.007L17.0069 17L0.00683594 0Z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    </span>
                    Request Document Review
                  </button>
                </div>
              </div>
            </div>
            <div className="bottom-content p-r-5 m-b-5">
              <div className="m-b-5 six-buttons m-l-5 m-r-5">
                <a
                  href="#"
                  className="btn btn-primary col height-25 d-flex align-items-center justify-content-center"
                  onClick={handlePrint}
                >
                  Print
                </a>
                <a
                  href="#"
                  className="btn btn-primary download-btn col height-25 d-flex align-items-center justify-content-center"
                  onClick={() => handleDownload(docId)}
                >
                  Download
                </a>
                <a
                  href="#"
                  className="btn btn-primary col height-25 d-flex align-items-center justify-content-center"
                >
                  Email
                </a>
                <button
                  type="button"
                  className="btn btn-secondary col height-25 d-flex align-items-center justify-content-center"
                  onClick={() => handleRemove(docId)}
                >
                  Inbox
                </button>
                <a
                  href={`/esign/${docId}/${clientId}/${caseId?.id || ''}`}
                  className="btn btn-primary height-25 d-flex align-items-center justify-content-center flex-g"
                >
                  E-Sign
                </a>
                <button
                  type="button"
                  className="btn btn-secondary height-25 d-flex align-items-center justify-content-center flex-g"
                  onClick={() => handleDelete(docId)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={showRenameModal} onHide={() => handleRenameClose()}>
        <Modal.Header closeButton>
          <Modal.Title>Rename Document</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Do you want to rename this document to <b>{newDocName}</b>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => handleRenameClose()}>
            Close
          </Button>
          <Button
            variant="success"
            onClick={() => docRename(docId, newDocName)}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      {caseId && (
      <FirmUserModal
          show={TaskModalOpen}
          handleClose={handleTaskModalClose}
          doc_id={docId}
          caseId={caseId}
        />
      )}

      {caseId && (
      <ChatDocLinkModal
          show={chatDocLinkModalOpen}
          handleClose={handleDocLinkModalClose}
          doc_id={docId}
          caseId={caseId}
        />
      )}

      <TodoModal
          show={toDoModalOpen}
          handleClose={handleToDoModalClose}
          caseId={caseId}
          doc_id={docId}
        />
    </>
  );
};

export default DocumentPreviewModal;
