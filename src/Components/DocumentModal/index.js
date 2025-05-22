import React, { useEffect, useState, useRef } from "react";
// import { useDocumentModal } from "./DocumentModalContext";
import { Modal, ModalDialog } from "react-bootstrap";
import "./DocumentModal.css";
import { Document, Page, pdfjs } from "react-pdf";
import PdfNavigation from "./PdfNavigation";
import { useDebounce } from "use-debounce";
import { usePdfTextSearch } from "./usePdfTextSearch";
import ClientSearch from "./ClientSearch";
import PdfThumbnail from "./PdfThumbnail";
import DocumentModalSideBar from "./DocumentSideBar/DocumentModalSideBar";
import { useDispatch, useSelector } from "react-redux";
import { getClientId, getCaseId, getToken } from "../../Utils/helper";
import api, { api_without_cancellation } from "../../api/api";
import { useDocumentModal } from "../common/CustomModal/CustomModalContext";
import { fetchAllPages } from "../../Redux/caseData/caseDataSlice";
import DeleteConfirmationModal from "./DocumentSideBar/DeleteConfimationModal";
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const pdfPageStyle = {
  position: "relative",
  marginBottom: "5px",
  marginTop: "5px",
  marginLeft: "auto",
  marginRight: "auto",
  boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.1), 0 6px 20px 0 rgba(0, 0, 0, 0.09)",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  display: "flex",
};

const DocumentModal = () => {
  const origin = process.env.REACT_APP_BACKEND_URL;
  const [numPages, setNumPages] = useState(null);
  const {
    documentURL,
    isVisible,
    hideDocumentModal,
    documentData,
    refetchDocumentData,
  } = useDocumentModal();
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [pageDimensions, setPageDimensions] = useState({ width: 0, height: 0 });
  const [containerRef, setContainerRef] = useState(null);
  const [searchString, setSearchString] = useState("");
  const [debouncedSearchString] = useDebounce(searchString, 150);
  const [showSideBar, setShowSideBar] = useState(true);
  const observer = useRef();
  // const pages = useSelector((state) => state.caseData?.pages);
  const currentCaseId = getCaseId();
  const [slotsData, setSlotsData] = useState([]);
  const [defaultZoom, setdefaultZoom] = useState("fit");
  const token = getToken();
  const [loading, setLoading] = useState(false);

  const [pages, setPages] = useState([]);

  const toggleSidebar = () => setShowSideBar((prev) => !prev);

  const onZoomChange = (zoomType) => {
    const containerWidth = containerRef?.offsetWidth || 0;
    const containerHeight = containerRef?.offsetHeight || 0;
    switch (zoomType) {
      case "in":
        setZoomLevel((prevZoom) => Math.min(prevZoom + 0.1, 4));
        setdefaultZoom("");
        break;
      case "out":
        setZoomLevel((prevZoom) => Math.max(prevZoom - 0.1, 0.5));
        setdefaultZoom("");
        break;
      case "width":
        const widthScale = containerWidth / pageDimensions.width;
        const roundedWidthScale = Math.floor(widthScale * 10) / 10 - 0.1;
        setZoomLevel(roundedWidthScale);
        setdefaultZoom("");
        break;
      case "height":
        const heightScale = containerHeight / pageDimensions.height;
        setZoomLevel(heightScale);
        setdefaultZoom("");
        break;
      case "fit":
        const fitScale = Math.min(
          containerWidth / pageDimensions.width,
          containerHeight / pageDimensions.height
        );
        setZoomLevel(Math.max(fitScale - 0.05, 0.1));
        setdefaultZoom("fit");
        break;
      default:
        if (typeof zoomType === "number") {
          setZoomLevel(zoomType);
          setdefaultZoom("");
        }
        break;
    }
  };

  async function onDocumentLoadSuccess(pdf) {
    setNumPages(pdf?.numPages || 0);
    setError("");
  }

  function scrollPageToView(
    pageNumber,
    updatePageNumber = (pageNumber) => pageNumber
  ) {
    const pageElementId = `pdf_page_${pageNumber}`;
    const pageElement = document.getElementById(pageElementId);
    if (pageElement) {
      pageElement.scrollIntoView({ behavior: "smooth" });
      updatePageNumber(pageNumber);
    }
  }
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef || !pageDimensions.width || !pageDimensions.height)
        return;

      if (pageDimensions.width && pageDimensions.height) {
        const containerWidth = containerRef.offsetWidth;
        if (defaultZoom === "fit") {
          handleZoomDefault(pageDimensions.width, pageDimensions.height);
        } else {
          const widthScale = containerWidth / pageDimensions.width;
          const roundedScale = Math.max(widthScale - 0.05, 0.1);
          setZoomLevel(roundedScale);
        }
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [pageDimensions, containerRef, defaultZoom]);

  const onPageLoadSuccess = (page) => {
    const { width, height } = page.getViewport({ scale: 1 });
    setPageDimensions({
      width: width,
      height: height,
    });
    if (defaultZoom === "fit") {
      handleZoomDefault(width, height);
    }
  };

  const handleZoomDefault = (width, height) => {
    if (containerRef) {
      const containerWidth = containerRef?.offsetWidth || 0;
      const containerHeight = containerRef?.offsetHeight || 0;

      const fitScale = Math.min(
        containerWidth / width,
        containerHeight / height
      );
      setZoomLevel(Math.max(fitScale - 0.05, 0.1));
    }
  };

  const searchResult = usePdfTextSearch(documentURL, debouncedSearchString);

  useEffect(() => {
    if (searchResult.length > 0) {
      const pageNumber = searchResult[0];
      scrollPageToView(pageNumber);
    }
  }, [searchResult]);

  useEffect(() => {
    if (!containerRef) return;

    const options = {
      root: containerRef,
      rootMargin: "0px",
      threshold: 0.5,
    };

    const callback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const pageNumber = parseInt(
            entry.target.getAttribute("data-page-number")
          );
          setPage(pageNumber);
        }
      });
    };

    observer.current = new IntersectionObserver(callback, options);

    const pages = document.querySelectorAll(".pdf-page");
    pages.forEach((page) => {
      observer.current.observe(page);
    });

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [containerRef, numPages]);
  useEffect(() => {
    const fetchDataFirstTime = async () => {
      try {
        setLoading(true);
        const response = await api.get(
          `api/doc-page/list-page-doc-optimized/`,
          {
            params: {
              page_id: "",
              case_id: Object.keys(documentData).length
                ? documentData?.for_case?.id
                : currentCaseId,
              all_docs: "True",
              client_id: Object.keys(documentData).length
                ? documentData?.for_client?.id
                : getClientId(),
            },
          }
        );
        if (response.status === 200) {
          setSlotsData(response.data.data);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    if (token) {
      fetchDataFirstTime();
    }
  }, [documentData?.for_case?.id, token]);

  const fetchPageDetails = async (caseId) => {
    try {
      const response = await api_without_cancellation.get(
        `/api/pages/${caseId}/`
      );

      setPages(response.data);
    } catch (error) {
      console.error("Error occurred while fetching pages", error);
    }
  };

  useEffect(() => {
    setPages([]);
    if (documentData?.for_case?.id) {
      fetchPageDetails(documentData?.for_case?.id);
    }
  }, [documentData]);

  const abortControllerRef = useRef(null);

  const refetchSlotsData = async () => {
    // Abort the previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create a new controller
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await api_without_cancellation.get(
        `api/doc-page/list-page-doc-optimized/`,
        {
          params: {
            page_id: "",
            case_id: documentData?.for_case?.id || "",
            all_docs: "True",
            client_id: documentData?.for_client?.id || "",
          },
          signal: controller.signal,
        }
      );

      if (response.status === 200) {
        setSlotsData(response.data.data);
      }
    } catch (error) {
      if (error.name === "CanceledError") {
        console.error("Previous API call aborted.");
      } else {
        console.error("API error:", error);
      }
    }
  };

  const [deleteConfirmModal, setDeleteConfirmModal] = useState(false);

  return (
    <>
      {!deleteConfirmModal && (
        <Modal
          show={isVisible}
          onHide={hideDocumentModal}
          size="xl"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          className="universal-document-modal modal-fullscreen-xl custom-modal-width"
          dialogClassName="document-modal-padding-setting"
        >
          <Modal.Header
            className="document-modal-header d-flex align-items-center justify-content-center height-25"
            style={{ borderRadius: "0px" }}
          >
            <Modal.Title
              id="contained-modal-title-vcenter"
              style={{
                fontSize: "14px",
                fontWeight: "600",
                textTransform: "uppercase",
              }}
              className="d-flex align-items-center justify-content-center height-25"
            >
              Document Viewing And Control
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="document-modal-body">
            <div
              className="d-flex flex-column justify-content-between m-0"
              style={{
                width: "calc(100% - 330px)",
              }}
            >
              <div
                className="d-flex"
                style={{
                  height: "calc(100% - 35px)",
                  width: "100%",
                }}
              >
                {showSideBar && (
                  <PdfThumbnail
                    documentURL={documentURL}
                    numPages={numPages}
                    currentPage={page}
                    onThumbnailClick={scrollPageToView}
                    setPageNumber={setPage}
                  />
                )}
                <div className="d-flex flex-column" style={{ flexGrow: "1" }}>
                  <div
                    className="search-and-error-area"
                    style={{
                      background: "var(--primary-20)",
                    }}
                  >
                    {error && <div className="alert alert-danger">{error}</div>}
                    <ClientSearch
                      setError={setError}
                      fetchPageDetails={fetchPageDetails}
                      setLoading={setLoading}
                    />
                  </div>

                  <div
                    className=" main-doc-area m-0"
                    style={{
                      width: "100%",
                      overflowY: "scroll",
                      backgroundColor: "var(--primary-20)",
                      scrollbarWidth: "none",
                    }}
                    ref={setContainerRef}
                  >
                    <Document
                      file={documentURL}
                      onLoadSuccess={onDocumentLoadSuccess}
                      onLoadError={(error) => {
                        console.error(error);
                        setError("Failed to load this file");
                      }}
                    >
                      {Array.from({ length: numPages }, (_, index) => (
                        <div
                          key={index}
                          id={`pdf_page_${index + 1}`}
                          data-page-number={index + 1}
                          className="pdf-page"
                          style={{
                            ...pdfPageStyle,
                            width: "min-content",
                          }}
                        >
                          <Page
                            scale={zoomLevel}
                            pageNumber={index + 1}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                            onLoadSuccess={onPageLoadSuccess}
                            className="pdf-page-content"
                            style={{
                              transition: "transform 0.2s ease",
                              transformOrigin: "center center",
                            }}
                          />
                        </div>
                      ))}
                    </Document>
                  </div>
                </div>
              </div>
              <PdfNavigation
                handleSearch={(e) => setSearchString(e.target.value)}
                totalPages={numPages}
                pageNumber={page}
                setPageNumber={setPage}
                pageWidth={pageDimensions.width}
                onZoomChange={onZoomChange}
                zoomScale={zoomLevel}
                toggleSidebar={toggleSidebar}
                scrollPageToView={scrollPageToView}
              />
            </div>
            {/* <div className="main-pdf-view-area">
              <div
                className="search-and-error-area"
                style={{
                  background: "var(--primary-20)",
                }}
              >
                {error && <div className="alert alert-danger">{error}</div>}
                <ClientSearch
                  setError={setError}
                  fetchPageDetails={fetchPageDetails}
                  setLoading={setLoading}
                />
              </div>
              <div className="main-doc-area d-flex flex-column justify-content-between m-0">
                <div className="document-modal-flex-container custom-document-modal-flex-container">
                  {showSideBar && (
                    <PdfThumbnail
                      documentURL={documentURL}
                      numPages={numPages}
                      currentPage={page}
                      onThumbnailClick={scrollPageToView}
                      setPageNumber={setPage}
                    />
                  )}
                  <div
                    className=" main-doc-area m-0"
                    style={{
                      width: "100%",
                      overflowY: "scroll",
                      backgroundColor: "var(--primary-20)",
                      scrollbarWidth: "none",
                    }}
                    ref={setContainerRef}
                  >
                    <Document
                      file={documentURL}
                      onLoadSuccess={onDocumentLoadSuccess}
                      onLoadError={(error) => {
                        console.error(error);
                        setError("Failed to load this file");
                      }}
                    >
                      {Array.from({ length: numPages }, (_, index) => (
                        <div
                          key={index}
                          id={`pdf_page_${index + 1}`}
                          data-page-number={index + 1}
                          className="pdf-page"
                          style={{
                            ...pdfPageStyle,
                            width: "min-content",
                          }}
                        >
                          <Page
                            scale={zoomLevel}
                            pageNumber={index + 1}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                            onLoadSuccess={onPageLoadSuccess}
                            className="pdf-page-content"
                            style={{
                              transition: "transform 0.2s ease",
                              transformOrigin: "center center",
                            }}
                          />
                        </div>
                      ))}
                    </Document>
                  </div>
                </div>
                <PdfNavigation
                  handleSearch={(e) => setSearchString(e.target.value)}
                  totalPages={numPages}
                  pageNumber={page}
                  setPageNumber={setPage}
                  pageWidth={pageDimensions.width}
                  onZoomChange={onZoomChange}
                  zoomScale={zoomLevel}
                  toggleSidebar={toggleSidebar}
                  scrollPageToView={scrollPageToView}
                />
              </div>
            </div> */}
            <DocumentModalSideBar
              documentData={documentData}
              pages={pages}
              slotsData={slotsData}
              onRefetchSlotsData={refetchSlotsData}
              loading={loading}
              setSlotsData={setSlotsData}
              setDeleteConfirmModal={setDeleteConfirmModal}
              refetchDocumentData={refetchDocumentData}
            />
          </Modal.Body>
          <Modal.Footer
            style={{
              margin: 0,
              padding: 0,
              border: 0,
            }}
          ></Modal.Footer>
        </Modal>
      )}

      {deleteConfirmModal && (
        <DeleteConfirmationModal
          show={deleteConfirmModal}
          handleClose={() => setDeleteConfirmModal(false)}
          // onComplete={handleDeleteComplete}
        />
      )}
    </>
  );
};

export default DocumentModal;
