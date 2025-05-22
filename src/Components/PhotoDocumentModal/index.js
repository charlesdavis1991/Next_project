import React, { useEffect, useState, useRef } from "react";
// import { useDocumentModal } from "./DocumentModalContext";
import { Modal } from "react-bootstrap";
import "../common/CustomModal/CustomDocumentModal.css";
import { Document, Page, pdfjs } from "react-pdf";
// import PdfNavigation from "./PdfNavigation";
import { useDebounce } from "use-debounce";
import { usePdfTextSearch } from "./usePdfTextSearch";
import ClientSearch from "./ClientSearch";
import PdfThumbnail from "./PdfThumbnail";
import DocumentModalSideBar from "./DocumentSideBar/DocumentModalSideBar";
import { mediaRoute } from "../../Utils/helper";
import { useDocumentModal } from "../common/CustomModal/CustomModalContext";
import CustomClientSearch from "../common/CustomModal/CustomClientSearch";
import CustomPdfThumbnail from "../common/CustomModal/CustomPdfThumbnail";
import PdfNavigation from "../common/CustomModal/CustomPdfNavigation";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

// const pdfPageStyle = {
//   position: "relative",
//   marginBottom: "5px",
//   marginTop: "5px",
//   marginLeft: "auto",
//   marginRight: "auto",
//   boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.1), 0 6px 20px 0 rgba(0, 0, 0, 0.09)",
//   flexDirection: "column",
//   justifyContent: "center",
//   alignItems: "center",
//   display: "flex",
// };

const DocumentModal = () => {
  const [numPages, setNumPages] = useState(null);
  const {
    documentURL,
    isPhotoModal,
    documentURLfordownload,
    hideDocumentModal,
    documentData,
    photoListData,
    setPhotoListData,
    setDocumentURL,
  } = useDocumentModal();

  console.log(photoListData);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  // const [zoomLevel, setZoomLevel] = useState(1);
  // const [pageDimensions, setPageDimensions] = useState({ width: 0, height: 0 });
  const [containerRef, setContainerRef] = useState(null);
  const [searchString, setSearchString] = useState("");
  // const [debouncedSearchString] = useDebounce(searchString, 150);
  const observer = useRef();
  const imageRef = useRef();
  const [zoomLevel, setZoomLevel] = useState(1);
  const [pageDimensions, setPageDimensions] = useState({
    width: 100,
    height: 100,
  });

  const onZoomChange = (zoomType) => {
    const containerWidth = containerRef?.offsetWidth || 0;
    const containerHeight = containerRef?.offsetHeight || 0;

    switch (zoomType) {
      case "in":
        setZoomLevel((prevZoom) => Math.min(prevZoom + 0.1, 4));
        break;
      case "out":
        setZoomLevel((prevZoom) => Math.max(prevZoom - 0.1, 0.5));
        break;
      case "width":
        const widthScale = containerWidth / pageDimensions.width;
        setZoomLevel(widthScale);
        break;
      case "height":
        const heightScale = containerHeight / pageDimensions.height;
        setZoomLevel(heightScale);
        break;
      case "fit":
        const fitScale = Math.min(
          containerWidth / pageDimensions.width,
          containerHeight / pageDimensions.height
        );
        setZoomLevel(Math.max(fitScale - 0.05, 0.1));
        break;
      default:
        if (typeof zoomType === "number") {
          setZoomLevel(zoomType);
        }
        break;
    }
  };

  // async function onDocumentLoadSuccess(pdf) {
  //   setNumPages(pdf?.numPages || 0);
  //   setError("");
  // }

  function scrollPageToView(
    pageNumber,
    updatePageNumber = (pageNumber) => pageNumber,
    imageURL
  ) {
    const pageElementId = `pdf_page_${pageNumber}`;
    const pageElement = document.getElementById(pageElementId);
    console.log("page number ===>", pageNumber, pageElementId, pageElement);
    if (pageElement) {
      pageElement.scrollIntoView({ behavior: "smooth" });
      updatePageNumber(pageNumber);
      setDocumentURL(imageURL);
    }
  }

  // const onPageLoadSuccess = (page) => {
  //   const { width, height } = page.getViewport({ scale: 1 });
  //   setPageDimensions({
  //     width: width,
  //     height: height,
  //   });
  // };

  // const searchResult = usePdfTextSearch(documentURL, debouncedSearchString);

  // useEffect(() => {
  //   if (searchResult.length > 0) {
  //     const pageNumber = searchResult[0];
  //     scrollPageToView(pageNumber);
  //   }
  // }, [searchResult]);

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

  return (
    <Modal
      show={isPhotoModal}
      onHide={hideDocumentModal}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="universal-document-modal modal-fullscreen-xl custom-modal-width"
      style={{ padding: 0 }}
    >
      <Modal.Header
        className="document-modal-header"
        style={{ borderRadius: "0px" }}
      >
        <Modal.Title id="contained-modal-title-vcenter">
          Photo Control and Viewer
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="document-modal-body">
        <div className="main-pdf-view-area">
          <div className="search-and-error-area">
            {error && <div className="alert alert-danger">{error}</div>}
            <CustomClientSearch setError={setError} />
          </div>
          <div className="main-doc-area d-flex flex-column justify-content-between m-0">
            <div className="document-modal-flex-container custom-document-modal-flex-container">
              <CustomPdfThumbnail
                documentURL={documentURL}
                numPages={numPages}
                currentPage={page}
                onThumbnailClick={scrollPageToView}
                setPageNumber={setPage}
                photoListData={photoListData}
                isPdf={false}
              />
              <div
                className="doc-pop-background-color-white main-doc-area m-0"
                style={{
                  width: "100%",
                  overflowY: "scroll",
                }}
                ref={setContainerRef}
              >
                <div
                  className="pdfpage"
                  style={{
                    width: "100%",
                    height: "100%",
                    marginTop: "0",
                    marginBottom: "0",
                    // top: "50%",
                    // transform: "translateY(-50%)",
                  }}
                >
                  <div className="content-wrapper" style={{ width: "100%" }}>
                    <img
                      src={documentURL}
                      className="photo-url center"
                      alt=""
                      style={{
                        width: "100%",
                        maxWidth: "500px",
                        height: "auto",
                        objectFit: "cover",
                      }}
                      ref={imageRef}
                    />
                  </div>
                </div>
                {/* {photoListData?.length > 0 &&
                  photoListData.map((photoData) =>
                    photoData.page_docs.map(
                      (page_doc) =>
                        mediaRoute(page_doc.image) !== documentURL && (
                          <div
                            className="pdfpage"
                            style={{
                              width: "100%",
                            }}
                          >
                            <div className="content-wrapper" style={{ width: "100%" }}>
                              <img
                                src={mediaRoute(page_doc.image)}
                                className="photo-url center"
                                alt=""
                                style={{
                                  width: "100%",
                                  maxWidth: "500px",
                                  height: "auto",
                                  objectFit: "cover",
                                }}
                              />
                            </div>
                          </div>
                        )
                    )
                  )} */}
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
              scrollPageToView={scrollPageToView}
            />
          </div>
        </div>
        <DocumentModalSideBar
          documentData={documentData}
          documentURL={documentURL}
          photoListData={photoListData}
          imageRef={imageRef}
          hideDocumentModal={hideDocumentModal}
          documentURLfordownload={documentURLfordownload}
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
  );
};

export default DocumentModal;
