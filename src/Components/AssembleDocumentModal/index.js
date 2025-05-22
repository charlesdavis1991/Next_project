import React, { useEffect, useState, useRef,useReducer } from "react";
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
import { useSelector } from "react-redux";
import { getClientId, getCaseId, getToken, mediaRoute } from "../../Utils/helper";
import api, { api_without_cancellation } from "../../api/api";
import { useDocumentModal } from "../common/CustomModal/CustomModalContext";
import { jsPDF } from "jspdf";
import { PDFDocument } from "pdf-lib";

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

const AssembleDocumentModal = () => {
  const origin = process.env.REACT_APP_BACKEND_URL;
  const [numPages, setNumPages] = useState(null);
  const { documentURL, isAssembleModal, setIsAssembleModal, hideDocumentModal, documentData, assembleDocuments, setDocumentURL, setDocumentData } =
    useDocumentModal();
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [pageDimensions, setPageDimensions] = useState({ width: 0, height: 0 });
  const [containerRef, setContainerRef] = useState(null);
  const [searchString, setSearchString] = useState("");
  const [debouncedSearchString] = useDebounce(searchString, 150);
  const [showSideBar, setShowSideBar] = useState(true);
  const observer = useRef();
  const pages = useSelector((state) => state.caseData?.pages);
  const currentCaseId = getCaseId();
  const [slotsData, setSlotsData] = useState([]);
  const [defaultZoom, setdefaultZoom] = useState("fit");
  const token = getToken()
  const [selectedPages, setSelectedPages] = useState([1]); // State to track selected thumbnails
  const [docId, setDocId] = useState(""); // State to track selected thumbnails

  const [docIds, setDocIds] = useState([]); // State to track selected thumbnails

  const [pageAdded, setPageAdded] = useState(false); // State to track selected thumbnails

  const toggleSidebar = () => setShowSideBar((prev) => !prev);


  const [documents, setDocuments] = useState([]);

  const [fileName, setFileName] = useState("example_file_name.pdf"); // Assume the file name is set here
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [pageOrders, setPageOrders] = useState({});

  const [docName, setDocName] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);


  const [fullPreview, setFullPreview] = useState(false);


  const [imagePdf,setImagePdf] = useState(null)

  const [loadingDocument,setLoadingDocument] = useState(false)


  const initialState = {
    textbox1: "",
    textbox2: "",
    checked: false,
    fontsize:12,
    align:"center",

  };

  function reducer(state, action) {
    switch (action.type) {
      case "SET_TEXTBOX1":
        return { ...state, textbox1: action.payload };
      case "SET_TEXTBOX2":
          return { ...state, textbox2: action.payload };
      case "SET_CHECKED":
        return { ...state, checked: action.payload };
      case "SET_FONTSIZE":
          return { ...state, fontsize: action.payload };
      case "SET_ALIGN":
            return { ...state, align: action.payload };
 
      default:
        return state;
    }
  }
  const [state, dispatch] = useReducer(reducer, initialState);

  const [numImagePages, setNumImagePages] = useState(null);

  const handleDragStart = (event, idx) => {
    setDraggedIndex(idx); // Track the index of the dragged document
  };

  const handleDrop = (event, targetIndex) => {
    event.preventDefault();

    if (draggedIndex !== null && draggedIndex !== targetIndex) {
      // Reorder the documents array
      const updatedDocuments = [...documents];
      const draggedDoc = updatedDocuments[draggedIndex];

      updatedDocuments.splice(draggedIndex, 1);
      updatedDocuments.splice(targetIndex, 0, draggedDoc);

      // Update the documents state
      setDocuments(updatedDocuments);

      // Update the pageOrders dictionary

      // Reset dragged index
      setDraggedIndex(null);
    }
  };



  const initializePageOrder = (docId, numPages) => {
    setPageOrders((prev) => ({
      ...prev,
      [docId]: Array.from({ length: numPages }, (_, index) => index + 1), // Default order: [1, 2, ..., numPages]
    }));
  };

  const reorderPageOrdersToMatchDocuments = (pageOrders, documents) => {
    const reorderedPageOrders = [];
  
    // Iterate over the documents array in order
    documents.forEach((doc) => {
      reorderedPageOrders.push(
        {
          "doc_id":doc.id,
          "pages":pageOrders[doc.id]

        }
      )
    });
  
    return reorderedPageOrders;
  };

  const pageOrder = pageOrders[docId] || []; // Get the order for the current document


  useEffect(() => {
    if (documents.length > 0) {
      documents.forEach((doc) => {
        if (!pageOrders[doc.id]) {
          initializePageOrder(doc.id, doc.page_count);
        }
      });
    }
  }, [documents]);



  useEffect(() => {
    if(!isAssembleModal){
      setFullPreview(false)
    }
   }, [isAssembleModal]);

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
    setLoadingDocument()
  }

  function scrollPageToView(
    pageNumberStr,
    updatePageNumber = (pageNumber) => pageNumber
  ) {

    const pageNumberStrSplit = pageNumberStr.split("_");  // Split by underscore
    const pageNumber = parseInt(pageNumberStrSplit[pageNumberStrSplit.length - 1], 10);

    if(!pageNumberStr.includes("image_pdf_page_")){
      setSelectedPages((prevSelected) =>
        prevSelected.includes(pageNumber)
          ? prevSelected.filter((page) => page !== pageNumber) // Deselect if already selected
          : [...prevSelected, pageNumber] // Select if not already selected
      );
    }
    



    const pageElementId = pageNumberStr;
    const pageElement = document.getElementById(pageElementId);
    if (pageElement) {
      pageElement.scrollIntoView({ behavior: "smooth" });
      updatePageNumber(pageNumber);
    }
  }

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
  const fetchDataFirstTime = async () => {
    try {

      const response = await api.get(
        `api/doc-page/list-page-doc-optimized/`,
        {
          params: {
            page_id: "",
            case_id: documentData ? documentData?.for_case?.id : "",
            client_id: documentData ? documentData?.for_client?.id : "",
            all_docs: "True"
          },
        }
      );
      if (response.status === 200) {
        setSlotsData(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDocuments = async () => {
    if (assembleDocuments) {
      try {
        const formData = new FormData();
        formData.append("doc_ids", assembleDocuments);
        const response = await api_without_cancellation.post(
          `api/doc-page/get-doc-by-ids/`,
          formData
        );
        if (response.status === 200) {
          setDocuments(response.data.data)
          const firstData = response.data.data[0]
          setDocumentURL(firstData.upload)
          setDocumentData(firstData)
          setDocId(firstData.id)
          setFileName(firstData.file_name)


          response.data.data.forEach((item) => {
            if (item.id) {
              docIds.push(item.id);  // Append the doc_id to docIds array
            }
          });


        }
      } catch (error) {
        console.error(error);
      }
    }

  };

  const fetchDocumentsAgain = async () => {
    if (assembleDocuments) {
      try {
        const formData = new FormData();
        formData.append("doc_ids", assembleDocuments);
        const response = await api_without_cancellation.post(
          `api/doc-page/get-doc-by-ids/`,
          formData
        );
        if (response.status === 200) {
          // Loop through the documents returned in the response
          const updatedDocuments = response.data.data;
  
          // Update the 'upload' field for the matching documents in the existing documents state
          setDocuments((prevDocuments) => {
            return prevDocuments.map((doc) => {
              // Find the document that matches by id and update the 'upload' field
              const updatedDoc = updatedDocuments.find((item) => item.id === doc.id);
              if (updatedDoc) {
                return {
                  ...doc, // Keep the existing document fields
                  upload: updatedDoc.upload, // Update only the 'upload' field
                };
              }
              return doc; // Return the unmodified document if no match is found
            });
          });
        }
      } catch (error) {
        console.error(error);
      }
    }
  };



  const fetchPhotos = async () => {
      try {
     
        const response = await api_without_cancellation.get(
          `api/doc-page/generate-photo-pdf/`,
          {
            params: {
              case_id: getCaseId(),
              client_id: getClientId(),
            }}
        );
        if (response.status === 200) {
           let data = response.data.data
           setImagePdf(data)

        
        }
      } catch (error) {
        console.error(error);
      }
    
  };
  



  const deletePages = async () => {
    if (selectedPages.length > 0) {
      setSelectedPages([])
      try {
        const formData = new FormData();
        formData.append("pages", JSON.stringify(selectedPages));
        formData.append("doc_id", docId);
        formData.append("page_order", JSON.stringify(pageOrder));


        const response = await api_without_cancellation.post(
          `api/doc-page/delete-pdf-pages/`,
          formData
        );

        if (response.status === 200) {
          var data = response.data.data
          setDocumentURL(data.upload)
          setDocumentData(data)
          initializePageOrder(data.id, data.page_count)
          setFileName(data.file_name)
          fetchDocumentsAgain()
        }
      } catch (error) {
        console.error(error);
      }
    }



  };





  const addPageNumbers = async () => {
      setSelectedPages([])
      try {
        const formData = new FormData();
        formData.append("align", state.align);
        formData.append("doc_ids", JSON.stringify(docIds));
        formData.append("page_order", JSON.stringify(pageOrder));


        const response = await api_without_cancellation.post(
          `api/doc-page/add-page-numbers/`,
          formData
        );

        if (response.status === 200) {
          var data = response.data.data
          setDocumentURL(data.upload_with_pn)

          initializePageOrder(`fp_${data.id}`, data.page_count)
          setPageAdded(data.page_numbers)
        }
      } catch (error) {
        console.error(error);
      }
    





  }


  const removePageNumbers = async () => {
      setSelectedPages([])
      try {
        const formData = new FormData();
        formData.append("doc_ids", JSON.stringify(docIds));
        formData.append("page_order", JSON.stringify(pageOrder));


        const response = await api_without_cancellation.post(
          `api/doc-page/remove-page-numbers/`,
          formData
        );

        if (response.status === 200) {
          var data = response.data.data
          setDocumentURL(data.upload)
          initializePageOrder(`fp_${data.id}`, data.page_count)

          setPageAdded(data.page_numbers)
        }
      } catch (error) {
        console.error(error);
      }
    
  }


  const addPdfPage = async (mergedPdf) => {
    try {
      const formData = new FormData();
      formData.append("doc_ids", JSON.stringify(docIds));
      formData.append("file", mergedPdf);


      const response = await api_without_cancellation.post(
        `api/doc-page/add-photo-pdf/`,
        formData,
        {
          headers: {
              'Content-Type': 'multipart/form-data'
          }
      }
      );

      if (response.status === 200) {
        var data = response.data.data

        initializePageOrder(`fp_${data.id}`, data.page_count)

        
      }
    } catch (error) {
      console.error(error);
    }
  
}




  const createFullPreview = async () => {
      
      try {
        const updatedPageOrders = reorderPageOrdersToMatchDocuments(pageOrders, documents);
        const updatedDocIds = [...new Set(docIds)];


        const formData = new FormData();
        formData.append("doc_ids", JSON.stringify(updatedDocIds));
        formData.append("data", JSON.stringify(updatedPageOrders));


        const response = await api_without_cancellation.post(
          `api/doc-page/create-full-preview/`,
          formData
        );
        setFullPreview(true)

        if (response.status === 200) {
          var data = response.data.data
          setDocumentURL(data.upload)
          
          initializePageOrder(`fp_${data.id}`, data.page_count)
          setDocId(`fp_${data.id}`)
          setSelectedPages([1])
          fetchPhotos()

        }
      } catch (error) {
        console.error(error);
      }
    

    



  }


  const onImagePdfLoadSuccess = ({ numPages }) => {
    setNumImagePages(numPages);
  };
  

  const resetInput = ()=>{
    dispatch({ type:"SET_TEXTBOX1",payload: "" })
    dispatch({ type:"SET_TEXTBOX2",payload: "" })
      dispatch({ type:"SET_CHECKED",payload: false})
        dispatch({ type:"SET_FONTSIZE",payload: 12 })
  }

  const addPageBreak = async (resultText) => {

    try {
      const formData = new FormData();
      formData.append("page_number", selectedPages[selectedPages.length - 1]);
      formData.append("doc_id", docId);
      formData.append("text", resultText);
      formData.append("font_size", state.fontsize);
      formData.append("page_order", JSON.stringify(pageOrder));

      const response = await api_without_cancellation.post(
        `api/doc-page/add-page-break/`,
        formData
      );

      if (response.status === 200) {
        var data = response.data.data
        setDocumentURL(data.upload)
        setDocumentData(data)
        initializePageOrder(data.id, data.page_count)

        setFileName(data.file_name)
        fetchDocumentsAgain()
        resetInput()


      }
    } catch (error) {
      console.error(error);
    }


  };

  const saveDocument = async () => {



    if (docName) {
      setSaveLoading(true)

      try {
        const updatedPageOrders = reorderPageOrdersToMatchDocuments(pageOrders, documents);

        const formData = new FormData();
       

        formData.append("data", JSON.stringify(updatedPageOrders));
        formData.append("file_name", docName);
        formData.append("case_id", getCaseId());
        formData.append("client_id", getClientId());
        formData.append("doc_ids", JSON.stringify(docIds));
        formData.append("page_order", JSON.stringify(pageOrder));
  

        const response = await api.post(
          `${origin}/api/doc-page/create-assemble-document/`,
          formData,

        );
        if (response.status == 200) {
          const { data, filename } = response.data;
          const pdfBlob = new Blob(
            [Uint8Array.from(atob(data), (c) => c.charCodeAt(0))],
            { type: "application/pdf" }
          );
          const url = URL.createObjectURL(pdfBlob);
          const a = document.createElement("a");
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);


        }
      } catch (error) {
        console.error("Error printing document:", error);
      }
      finally {
        setSaveLoading(false)
        setIsAssembleModal(false)
        setPageOrders({})
        resetInput()
        setDocName("")
      }


    }

  };


  const deleteFPPages = async () => {
    let upPageOrder = pageOrder.map(num => num - 1); // Adjust pageOrder to zero-indexed
    let upSelectedPages = selectedPages.map(num => num - 1);

    try {
      // First PDF: URL of the first PDF
      const firstPdfBytes = await fetch(documentURL).then((res) => res.arrayBuffer());
  
      // Load the first PDF using pdf-lib
      const firstPdf = await PDFDocument.load(firstPdfBytes);
  
      // Create a new PDF document to add the remaining pages
      const pdfDoc = await PDFDocument.create();
  
      // Copy all pages from the first PDF
      const firstPdfPages = await pdfDoc.copyPages(firstPdf, firstPdf.getPageIndices());
  
  
      // Adjust pageOrder to reflect only the remaining pages after deletion
      const filteredPageOrder = upPageOrder.filter((index) => !upSelectedPages.includes(index));

      // Insert the pages from the first PDF maintaining the order (after deletion)
      for (let i = 0; i < filteredPageOrder.length; i++) {
        pdfDoc.addPage(firstPdfPages[filteredPageOrder[i]]);
      }
  
      // Save the merged PDF
      const mergedPdfBytes = await pdfDoc.save();
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

    
      setDocumentURL(url)
      initializePageOrder(`fp_${docId}`, pageCount)
      addPdfPage(blob)  
   
    } catch (error) {
      console.error('Error processing the PDF:', error);
      alert('Error processing the PDF');
    }
  };
  


  const mergePDFs = async (draggedIndex, targetIndex, pageOrder) => {
    // Adjust pageOrder to be zero-indexed
    pageOrder = pageOrder.map(num => num - 1);
  
    try {
      // First PDF: URL of the first PDF
      const firstPdfBytes = await fetch(documentURL).then((res) => res.arrayBuffer());
  
      // Second PDF: pdfBlob from the state
      const secondPdfBytes = await fetch(imagePdf).then((res) => res.arrayBuffer());
  
      // Load the PDFs using pdf-lib
      const firstPdf = await PDFDocument.load(firstPdfBytes);
      const secondPdf = await PDFDocument.load(secondPdfBytes);
  
      // Create a new PDF document to merge the pages
      const pdfDoc = await PDFDocument.create();
  
      // Copy all pages from the first PDF
      const firstPdfPages = await pdfDoc.copyPages(firstPdf, firstPdf.getPageIndices());
  
      // If targetIndex is -1, we add the pages from the first PDF as is, and add the dragged page at the end
      if (targetIndex === -1) {
        // Add all pages from the first PDF
        for (let i = 0; i < firstPdfPages.length; i++) {
          pdfDoc.addPage(firstPdfPages[pageOrder[i]]);
        }
  
        // Copy the dragged page from the second PDF and add it at the end
        const secondPdfPage = await pdfDoc.copyPages(secondPdf, [draggedIndex]); // Copy the dragged page from second PDF
        pdfDoc.addPage(secondPdfPage[0]); // Add it to the merged document
      } else {
        // Insert the pages from the first PDF up to the target index
        for (let i = 0; i < targetIndex; i++) {
          pdfDoc.addPage(firstPdfPages[pageOrder[i]]);
        }
  
        // Copy the page from the second PDF (based on draggedIndex)
        const secondPdfPage = await pdfDoc.copyPages(secondPdf, [draggedIndex]); // Copy the dragged page from second PDF
        pdfDoc.addPage(secondPdfPage[0]); // Add it to the merged document
  
        // Insert the remaining pages from the first PDF after the target index
        for (let i = targetIndex; i < firstPdfPages.length; i++) {
          pdfDoc.addPage(firstPdfPages[pageOrder[i]]);
        }
      }
  
      // Save the merged PDF
      const mergedPdfBytes = await pdfDoc.save();
      const pageCount = pdfDoc.getPageCount();

  
      // Create a download link for the merged PDF
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

    
      setDocumentURL(url)
      initializePageOrder(`fp_${docId}`, pageCount)


      addPdfPage(blob)   
      // const link = document.createElement('a');
      // link.href = url;
      // link.download = 'merged.pdf';
      // link.click();
    } catch (error) {
      console.error('Error merging PDFs:', error);
      alert('Error merging PDFs');
    }
  };
  

  const openDoc = (doc) => {

    setSelectedPages([1])
    setDocumentURL(doc.upload)
    setDocumentData(doc)
    setDocId(doc.id)
    setFileName(doc.file_name)
    resetInput()


  }
  useEffect(() => {
    if (isAssembleModal == true) {
      fetchDocuments();

    }
    if (token) {

      fetchDataFirstTime();
    }
  }, [currentCaseId, token, assembleDocuments, isAssembleModal]);

  const refetchSlotsData = async () => {
    try {
      const response = await api.get(`api/doc-page/list-page-doc-optimized/`, {
        params: {
          page_id: "",
          case_id: documentData ? documentData?.for_case?.id : "",
          client_id: documentData ? documentData?.for_client?.id : "",
          all_docs: "True"
        },
      });
      if (response.status === 200) {
        setSlotsData(response.data.data);
      }
    } catch (error) {
      console.error("Failed to refetch slots data:", error);
    }
  };

  return (
    <Modal
      show={isAssembleModal}
      onHide={hideDocumentModal}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="universal-document-modal modal-fullscreen-xl custom-modal-width"
    >
      <Modal.Header
        className="document-modal-header"
        style={{ borderRadius: "0px" }}
      >
        <Modal.Title id="contained-modal-title-vcenter">
          Document Viewing And Control
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="document-modal-body">
        {
          !fullPreview ? (
            <div style={{ width: "17%" }}>
              <div>
                <h1 class="text-center">Documents</h1>
                {documents &&
                  documents.map((doc, idx) => {
                    const isSelected = selectedIndex === idx;

                    return (
                      <div
                        key={idx}
                        className={`col icon-text-box-custom text-center font-weight-semibold btn-white-hover cursor-pointer d-block m-2 ${isSelected ? "assemble-doc-select" : "btn-primary-lighter-2"
                          }`}
                        id="no-vertical-border"
                        draggable
                        onDragStart={(event) => handleDragStart(event, idx)}
                        onDragOver={(event) => event.preventDefault()} // Allow dropping
                        onDrop={(event) => handleDrop(event, idx)}
                        onClick={() => {
                          // Set the selected index to the current index (deselecting others)
                          setSelectedIndex(idx);
                          openDoc(doc); // Open the document
                        }}
                      >
                        <div className="d-flex align-items-center">
                          <span className="d-flex" style={{ "width": "40px" }}>
                            <i className={`ic ic-19 cursor-pointer img-19px ic-file-colored`}></i>
                          </span>
                          <span className="ml-2" style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                            {doc?.file_name}
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

          ):(null)
        }
        
        <div className="main-pdf-view-area">
          <div className="search-and-error-area">
            {error && <div className="alert alert-danger">{error}</div>}
          </div>
          <div className="main-doc-area d-flex flex-column justify-content-between m-0">
            {/* <PdfNavigation
              handleSearch={(e) => setSearchString(e.target.value)}
              totalPages={numPages}
              pageNumber={page}
              setPageNumber={setPage}
              onZoomChange={onZoomChange}
              zoomScale={zoomLevel}
              toggleSidebar={toggleSidebar}
              scrollPageToView={scrollPageToView}
            /> */}
            <div className="document-modal-flex-container custom-document-modal-flex-container">
              {showSideBar && (
                <PdfThumbnail
                  documentURL={documentURL}
                  numPages={numPages}
                  currentPage={page}
                  onThumbnailClick={scrollPageToView}
                  setPageNumber={setPage}
                  selectedPages={selectedPages}
                  pageOrders={pageOrders}
                  setPageOrders={setPageOrders}
                  docId={docId}
                  imagePdf = {imagePdf}
                  fullPreview = {fullPreview}
                  mergePDFs = {mergePDFs}
                />
              )}
              <div
                className="doc-pop-background-color-white main-doc-area m-0"
                style={{
                  width: "100%",
                  overflowY: "scroll",
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
                  {


                    pageOrder?.map((pageNumber, index) => (
                      <div
                        key={index}
                        id={`pdf_page_${pageNumber}`}
                        data-page-number={index + 1}
                        className="pdf-page"
                        style={{
                          ...pdfPageStyle,
                          width: "min-content",
                        }}
                      >
                        <Page
                          scale={zoomLevel}
                          pageNumber={pageNumber}
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

                    {
                       imagePdf && fullPreview &&  ( 
                       
                       
                       <Document
                        file={imagePdf}
                        onLoadSuccess={onImagePdfLoadSuccess}
                        loading = {""}
                       
                      >
                            {Array.from({ length: numImagePages }, (_, index) => (

                            <div
                              key={index}
                              id={`image_pdf_page_${index}`}
                              data-page-number={index + 1}
                              className="pdf-page"
                              style={{
                                ...pdfPageStyle,
                                width: "min-content",
                              }}
                            >
                              <Page
                                pageNumber={index+1}  // Show the current page number
                                scale={1.0}               // Show the full page (without scaling down)
                                renderTextLayer={false}   // Optional: Hide text layer for just images
                                renderAnnotationLayer={false}  // Optional: Hide annotations
                              />
                            </div>
                          ))}
                      </Document>)
                    }

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
        </div>
        <DocumentModalSideBar
          documentData={documentData}
          pages={pages}
          slotsData={slotsData}
          onRefetchSlotsData={refetchSlotsData}
          deletePages={deletePages}
          addPageBreak={addPageBreak}
          fileName={fileName}
          setDocName={setDocName}
          docName={docName}
          saveDocument={saveDocument}
          saveLoading={saveLoading}
          state = {state}
          dispatch = {dispatch}
          selectedPages={selectedPages}
          addPageNumbers={addPageNumbers}
          setFullPreview={setFullPreview}
          fullPreview={fullPreview}
          createFullPreview={createFullPreview}
          pageAdded = {pageAdded}
          removePageNumbers = {removePageNumbers}
          deleteFPPages = {deleteFPPages}
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

export default AssembleDocumentModal;