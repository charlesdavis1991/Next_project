import React, { useEffect, useMemo, useRef, useState } from "react";
import Dropzone from "react-dropzone";
import api from "../../api/api";
import { mediaRoute } from "../../Utils/helper";
import { photoData } from "./utils";
// import { useDocumentModal } from "../PhotoDocumentModal/DocumentModalContext";
import _ from "lodash";
import DocumentUploadModal from "../Modals/documentUploadModal";
import { useDocumentModal } from "../common/CustomModal/CustomModalContext";

const AllTab = ({
  pageId,
  photoListData,
  setPhotoListData,
  setBulkSelectionMap,
  bulkSelectionMap,
  client_id,
  case_id,
}) => {
  const [uploadedSlots, setUploadedSlots] = useState({});
  const { showDocumentModal } = useDocumentModal();
  const [isUploaded, setIsUploaded] = useState(false);
  const [mapPlusUpload, setMapPlusUpload] = useState([]);
  const [mapSlotUpload, setMapSlotUpload] = useState([]);
  // State for handling modal and upload progress
  const [fileUploadModal, setFileUploadModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadFile, setUploadFile] = useState("");
  const [showloading, setshowloading] = useState(false);
  const fetchPhotoListData = async () => {
    photoData("", "", case_id).then((data) => {
      if (data) {
        setPhotoListData(data);
        setMapPlusUpload([]); // Clear uploaded map
        setUploadedSlots({}); // Clear uploaded slots
        setMapSlotUpload([]); // Clear slot upload map
        setIsUploaded(false); // Reset upload state
        setshowloading(false);
        // Close the modal only after the entire process is done
        setFileUploadModal(false);
      }
    });
  };
  const fetchPhotoListDataFirstTime = async () => {
    setshowloading(true);
    photoData("", "", case_id, true).then((data) => {
      if (data) {
        setPhotoListData(data);
        setMapPlusUpload([]); // Clear uploaded map
        setUploadedSlots({}); // Clear uploaded slots
        setMapSlotUpload([]); // Clear slot upload map
        setIsUploaded(false); // Reset upload state

        // Close the modal only after the entire process is done
        setFileUploadModal(false);
      }
    });
  };
  const handleCheckboxChange = (event, page_doc) => {
    const checked = event.target.checked;
    const element = document.getElementById(`customCheck${page_doc.id}`);
    if (element) {
      element.checked = checked; // Directly manipulating DOM for instant feedback
    }
    setBulkSelectionMap((prevData) => {
      const newData = { ...prevData };
      if (!checked) {
        delete newData[page_doc.id];
      } else {
        newData[page_doc.id] = page_doc;
      }
      return newData;
    });
  };

  const handleDocPreview = (doc) => {
    console.log("photo doc", doc);
    console.log("photo doc", mediaRoute(doc.image));
    showDocumentModal(
      "photo",
      doc.image,
      doc,
      photoListData,
      fetchPhotoListData,
      doc.case_thumbnail
    );
  };

  const simulateProgress = (totalFiles) => {
    let progress = 0;
    const increment = 100 / totalFiles; // Divide progress by total number of files

    const intervalId = setInterval(() => {
      progress += increment; // Increment based on the total number of files
      setUploadProgress(progress);

      // Stop once we reach or exceed 100%
      if (progress >= 100) {
        clearInterval(intervalId);
      }
    }, 300); // 300ms delay between increments
  };

  const handleAcceptedFiles = async (
    acceptedFiles,
    slot_id,
    page_id,
    panel_id
  ) => {
    console.log("acceptedFiles", acceptedFiles.length);

    // Set files and trigger the modal
    setUploadFile(acceptedFiles.map((file) => file.name));
    setFileUploadModal(true);

    simulateProgress(acceptedFiles.length); // Simulate gradual progress

    const delay = (ms) => new Promise((res) => setTimeout(res, ms));

    for (let i = 0; i < acceptedFiles.length; i++) {
      const file = acceptedFiles[i];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("slot_id", slot_id);
      formData.append("page_id", page_id);
      if (panel_id !== undefined) {
        formData.append("panel_id", panel_id);
      }

      try {
        const response = await api.post(
          `/api/upload_photo/${client_id}/${case_id}/`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.data.response === "success") {
          console.log("Photo uploaded successfully");
          // await fetchPhotoListData();

          setPhotoListData((prev) => {
            return prev.map((item) => {
              if (item.page.id === parseInt(response?.data?.data?.page_id)) {
                if (!item.page.panels) {
                  item.page_docs = [...item.page_docs, response?.data?.doc];
                } else {
                  item.panels.map((panel) => {
                    if (panel.id === panel_id) {
                      panel.photos = [...panel.photos, response?.data?.doc];
                      item.page_docs = [...item.page_docs, response?.data?.doc];
                    }
                  });
                }
              }
              return item;
            });
          });
          if (i === acceptedFiles.length - 1) {
            setFileUploadModal(false);
            setMapPlusUpload([]); // Clear uploaded map
            setUploadedSlots({}); // Clear uploaded slots
            setMapSlotUpload([]); // Clear slot upload map

            const timer = setTimeout(() => {
              setshowloading(false);
              setUploadProgress(0);
            }, 3000);
            clearTimeout(timer);
          }
        } else {
          console.log("Photo upload failed");
        }

        await delay(10); // Delay for 1 second between requests
      } catch (error) {
        console.error("Error uploading photo:", error);
      }
    }
  };

  async function handleAcceptedFileswithoutPanels(
    acceptedFiles,
    slot_id,
    page_id
  ) {
    console.log("acceptedFiles", acceptedFiles.length);

    // Set files and trigger the modal
    setUploadFile(acceptedFiles.map((file) => file.name));
    setFileUploadModal(true);

    simulateProgress(acceptedFiles.length); // Simulate gradual progress

    const delay = (ms) => new Promise((res) => setTimeout(res, ms));

    for (let i = 0; i < acceptedFiles.length; i++) {
      const formData = new FormData();
      const file = acceptedFiles[i];
      formData.append("file", file);
      formData.append("slot_id", slot_id);
      formData.append("page_id", page_id);

      try {
        const response = await api.post(
          `/api/upload_photo/${client_id}/${case_id}/`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.data.response === "success") {
          console.log("Photo uploaded successfully");
          setPhotoListData((prev) => {
            return prev.map((item) => {
              if (item.page.id === parseInt(response?.data?.data?.page_id)) {
                item.page_docs = [...item.page_docs, response?.data?.doc];
              }
              return item;
            });
          });

          if (i === acceptedFiles.length - 1) {
            setFileUploadModal(false);
            setMapPlusUpload([]); // Clear uploaded map
            setUploadedSlots({}); // Clear uploaded slots
            setMapSlotUpload([]); // Clear slot upload map
            setshowloading(false);
            const timer = setTimeout(() => {
              setUploadProgress(0);
            }, 3000);
            clearTimeout(timer);
          }
        } else {
          console.log("Photo upload failed");
        }

        await delay(10); // Delay for 1 second between requests
      } catch (error) {
        console.error("Error uploading photo:", error);
      }
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      // Check if it's the first time fetching data
      if (photoListData.length === 0) {
        await fetchPhotoListDataFirstTime();
        await fetchPhotoListData();
      } else {
        await fetchPhotoListData();
      }
    };
    fetchData();
  }, [isUploaded]);

  useEffect(() => {
    setBulkSelectionMap({});
  }, []);

  function hasSubArray(master, sub) {
    for (const row of master) {
      if (JSON.stringify(row) === JSON.stringify(sub)) {
        return true;
      }
    }
    return false;
  }
  const checkIsPanels = (photoData) => {
    if (
      photoData?.page?.panels === true &&
      (photoData?.panels !== null || photoData?.panels?.length > 0)
    ) {
      if (photoData?.page_slots == null || photoData?.page_slots?.length > 0) {
        return true;
      }
      return false;
    } else {
      return false;
    }
  };
  function CheckforZeroSlotorpanels(photoData) {
    if (photoData?.page_slots === null || photoData?.page_slots.length === 0) {
      return true;
    } else if (
      (photoData?.page_slots !== null || photoData?.page_slots.length > 0) &&
      photoData?.page?.panels === true &&
      (photoData?.panels === null || photoData?.panels.length === 0)
    ) {
      return true;
    } else {
      return false;
    }
  }
  const divRef = useRef(null);
  const [dimensions, setDimensions] = useState({});

  const checkImageDimensions = async (imageUrl) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = imageUrl;
      img.onload = () => resolve({ width: img.width, height: img.height });
      img.onerror = reject;
    });
  };
  return (
    <>
      {photoListData.map((photoData, i) => {
        if (photoData.page_slots && (!pageId || pageId === photoData.page.id)) {
          return (
            <React.Fragment key={i}>
              {checkIsPanels(photoData) ? (

                photoData?.panels?.map((panel, index) => (
                  <React.Fragment key={index}>
                    {photoData.page_slots?.length > 0 &&
                      photoData.page_slots.map((page_slot, j) => (
                        <Dropzone
                          key={j}
                          onDrop={(acceptedFiles) =>
                            handleAcceptedFiles(
                              acceptedFiles,
                              page_slot.id,
                              photoData.page.id,
                              panel.id
                            )
                          }
                          onDropAccepted={() => {
                            setMapSlotUpload((prevData) => [
                              ...prevData,
                              [i, j],
                            ]);
                          }}
                          disabled={panel?.photos.some(
                            (page_doc) =>
                              page_doc.photo_slot?.slot_number ===
                              page_slot.slot_number
                          )}
                        >
                          {({ getRootProps, getInputProps }) => (
                            <div
                              // onclick="toggleDocPreview(this, event)"
                              className="photo-item gallery-box column has-alternative-child-bg dropzone-82--1 dz-clickable"
                              id="no-vertical-border"
                              {...getRootProps()}
                              style={{ maxWidth: "315px" }}
                            >
                              <input {...getInputProps()} />
                              {j === 0 && (
                                <div className="gallery-header bg-primary-10 height-25 d-flex align-items-center p-l-5 p-r-5">
                                  <h4
                                    className="text-lg text-center d-flex align-items-center h-100"
                                    style={{ fontWeight: "700" }}
                                  >
                                    {" "}
                                    <i
                                      className={`ic ic-16 m-r-5 ic-${photoData.page.name?.toLowerCase() === "to do" ? "to-do" : photoData.page.name?.toLowerCase()}`}
                                    ></i>{" "}
                                    {photoData.page.name}
                                  </h4>
                                </div>
                              )}
                              <div className="gallery-content-wrap position-relative">
                                <div className="gallery-media d-flex flex-column align-items-center justify-content-center overflow-hidden position-relative  p-b-5">
                                  {panel?.photos?.map((page_doc, k) => (
                                    <>
                                      {page_doc?.photo_slot?.slot_number ===
                                        page_slot.slot_number ? (
                                        <img
                                          ref={divRef}
                                          className="resized-photo"
                                          src={mediaRoute(page_doc?.image)}
                                          alt="John Doe"
                                          onLoad={async () => {
                                            const dimensions =
                                              await checkImageDimensions(
                                                mediaRoute(page_doc?.image)
                                              );
                                            console.log(
                                              "Image dimensions:",
                                              dimensions
                                            );
                                            setDimensions((prev) => ({
                                              ...prev,
                                              [page_doc.id]: dimensions, // Store dimensions by image ID
                                            }));
                                          }}
                                          onClick={async () => {
                                            handleDocPreview(page_doc);
                                          }}
                                          style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit:
                                              dimensions[page_doc.id]?.width >
                                                dimensions[page_doc.id]?.height
                                                ? "contain"
                                                : "contain", // Use individual dimensions // Use individual dimensions
                                            objectPosition: "center",
                                            maxWidth: "100%",
                                            maxHeight: "100%",
                                            paddingTop: "25px",
                                          }}
                                        />
                                      ) : (
                                        <>
                                          {k === 0 && (
                                            <>
                                              <i className="ic ic-60 ic-placeholder-grey cursor-pointer m-t-10"></i>
                                              <p className="text-lg-grey m-t-5">
                                                Click or Drag to Upload
                                              </p>
                                            </>
                                          )}
                                        </>
                                      )}
                                    </>
                                  ))}
                                  {(panel?.photos == null ||
                                    panel?.photos.length === 0) && (
                                      <>
                                        <i className="ic ic-60 ic-placeholder-grey cursor-pointer m-t-10"></i>
                                        <p className="text-lg-grey m-t-5">
                                          Click or Drag to Upload
                                        </p>
                                      </>
                                    )}
                                </div>
                                <div className="gallery-content d-flex align-items-center p-t-2 p-r-5 p-b-2 p-l-5 justify-content-center flex-column">
                                  <div className="gallery-content d-flex align-items-center p-t-2 p-r-5 p-b-2 p-l-5 justify-content-center flex-column">
                                    {panel?.photos.map((page_doc, k) => (
                                      <>
                                        {page_doc.photo_slot?.slot_number ===
                                          page_slot.slot_number && (
                                            <>
                                              <p className="name text-truncate  top-25p">
                                                {page_doc.photo_slot?.slot_number}
                                                . {page_doc.title}
                                              </p>
                                              {hasSubArray(mapSlotUpload, [
                                                i,
                                                j,
                                              ]) && (
                                                  <p className="name text-lg-grey  top-25p">
                                                    Uploaded 100%
                                                  </p>
                                                )}
                                              <div class="custom-control custom-checkbox position-absolute top-0 right-0 z-index-1">
                                                <input
                                                  type="checkbox"
                                                  checked={
                                                    !!bulkSelectionMap[
                                                    page_doc.id
                                                    ]
                                                  }
                                                  onChange={(event) =>
                                                    handleCheckboxChange(
                                                      event,
                                                      page_doc
                                                    )
                                                  }
                                                  // onClick={() => {
                                                  //   setBulkSelectionMap(prevData => {
                                                  //     const newData = { ...prevData };
                                                  //     if (newData[page_doc.id]) {
                                                  //       delete newData[page_doc.id];
                                                  //     } else {
                                                  //       newData[page_doc.id] = page_doc;
                                                  //     }
                                                  //     return newData;
                                                  //   });
                                                  // }}
                                                  class="custom-control-input"
                                                  id={`customCheck${page_doc.id}`}
                                                />
                                                <label
                                                  class="custom-control-label m-l-5 text-indent"
                                                  for={`customCheck${page_doc.id}`}
                                                >
                                                  Select
                                                </label>
                                              </div>
                                            </>
                                          )}
                                      </>
                                    ))}
                                    {(panel?.photos?.length === 0 ||
                                      !panel?.photos.some(
                                        (page_doc) =>
                                          page_doc.photo_slot?.slot_number ===
                                          page_slot.slot_number
                                      )) && (
                                        <>
                                          <p className="name text-lg-grey  top-25p">
                                            {page_slot.slot_number}.{" "}
                                            {page_slot.slot_name || "Available"}
                                          </p>
                                          {uploadedSlots[
                                            `${photoData.page.id}-${panel.id}-${page_slot.id}`
                                          ] && (
                                              <p className="name text-lg-grey  top-25p">
                                                Uploaded 100%
                                              </p>
                                            )}
                                        </>
                                      )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </Dropzone>
                      ))}
                    {/* general Document Row   */}
                    {index === photoData?.panels?.length - 1 && (
                      <>
                        {photoData?.page_docs
                          ?.filter(
                            (page_doc) =>
                              page_doc.photo_slot?.slot_number === 0 ||
                              page_doc.photo_slot?.slot_number === null
                          )
                          .map((page_doc, k) => (
                            <div
                              key={k}
                              className="photo-item gallery-box column has-alternative-child-bg dropzone-82--1 dz-clickable"
                              style={{ maxWidth: "315px" }}
                            >
                              <div className="gallery-content-wrap position-relative">
                                <div className="gallery-media d-flex align-items-center justify-content-center overflow-hidden position-relative p-b-5">
                                  <img
                                    ref={divRef}
                                    className="resized-photo"
                                    src={mediaRoute(page_doc?.image)}
                                    alt="John Doe"
                                    onLoad={async () => {
                                      const dimensions =
                                        await checkImageDimensions(
                                          mediaRoute(page_doc?.image)
                                        );
                                      console.log(
                                        "Image dimensions:",
                                        dimensions
                                      );
                                      setDimensions((prev) => ({
                                        ...prev,
                                        [page_doc.id]: dimensions, // Store dimensions by image ID
                                      }));
                                    }}
                                    onClick={async () => {
                                      handleDocPreview(page_doc);
                                    }}
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      objectFit:
                                        dimensions[page_doc.id]?.width >
                                          dimensions[page_doc.id]?.height
                                          ? "contain"
                                          : "contain", // Use individual dimensions // Use individual dimensions
                                      objectPosition: "center",
                                      maxWidth: "100%",
                                      maxHeight: "100%",
                                      paddingTop: "25px",
                                    }}
                                  />
                                </div>
                                <div class="custom-control custom-checkbox position-absolute top-0 right-0 z-index-1">
                                  <input
                                    type="checkbox"
                                    checked={!!bulkSelectionMap[page_doc.id]}
                                    onChange={(event) =>
                                      handleCheckboxChange(event, page_doc)
                                    }
                                    // onClick={() => {
                                    //   setBulkSelectionMap(prevData => {
                                    //     const newData = { ...prevData };
                                    //     if (newData[page_doc.id]) {
                                    //       delete newData[page_doc.id];
                                    //     } else {
                                    //       newData[page_doc.id] = page_doc;
                                    //     }
                                    //     return newData;
                                    //   });
                                    // }}
                                    class="custom-control-input"
                                    id={`customCheck${page_doc.id}`}
                                  />
                                  <label
                                    class="custom-control-label m-l-5 text-indent"
                                    for={`customCheck${page_doc.id}`}
                                  >
                                    Select
                                  </label>
                                </div>
                                <div className="gallery-content d-flex align-items-center p-t-2 p-r-5 p-b-2 p-l-5 justify-content-center flex-column">
                                  <p className="name text-lg-grey top-25p text-capitalize">
                                    {page_doc.title.length > 18
                                      ? `${page_doc.title.slice(0, 18)}...`
                                      : page_doc.title}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                      </>
                    )}

                    {(photoData.page_slots?.length > 0 ||
                      photoData.panels?.length > 0) && (
                        <Dropzone
                          key={i}
                          onDrop={(acceptedFiles) =>
                            handleAcceptedFiles(
                              acceptedFiles,
                              0,
                              photoData.page.id,
                              panel.id
                            )
                          }
                          onDropAccepted={() => {
                            setMapPlusUpload((prevData) => [...prevData, index]);
                          }}
                        >
                          {({ getRootProps, getInputProps }) => (
                            <div
                              className="photo-item gallery-box column has-alternative-child-bg upload-photo-card"
                              {...getRootProps()}
                              style={{ maxWidth: "315px" }}
                            >
                              <input {...getInputProps()} />
                              {photoData.page_slots?.length === 0 &&
                                photoData.panels && (
                                  <div className="gallery-header bg-primary-10 height-25 d-flex align-items-center p-l-5 p-r-5">
                                    <h4
                                      className="text-lg text-center d-flex align-items-center h-100"
                                      style={{ fontWeight: "700" }}
                                    >
                                      {" "}
                                      <i
                                        className={`ic ic-16 m-r-5 ic-${photoData.page.name?.toLowerCase() === "to do" ? "to-do" : photoData.page.name?.toLowerCase()}`}
                                      ></i>{" "}
                                      {photoData.page.name}
                                    </h4>
                                  </div>
                                )}
                              <div className="gallery-content-wrap position-relative">
                                <div className="gallery-media d-flex align-items-center justify-content-center overflow-hidden position-relative p-t-5 p-b-5">
                                  <button
                                    role="button"
                                    className="plus-icon text-gold h1 dropzone---1-1 d-flex align-items-center justify-content-center w-100 h-100 cursor-pointer dz-clickable"
                                  >
                                    +
                                  </button>
                                </div>
                                <div className="gallery-content d-flex align-items-center p-t-2 p-r-5 p-b-2 p-l-5 justify-content-center flex-column">
                                  <p className="name text-lg-grey top-25p text-capitalize">
                                    {mapPlusUpload.includes(index)
                                      ? "Uploaded 100%"
                                      : `upload photo to ${photoData.page.name}`}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </Dropzone>
                      )}
                  </React.Fragment>
                ))
              )
                : (
                  <>
                    {photoData.page_slots?.length > 0 &&
                      photoData?.page?.panels === false &&
                      photoData.page_slots.map((page_slot, j) => (
                        <Dropzone
                          key={j}
                          onDrop={(acceptedFiles) =>
                            handleAcceptedFileswithoutPanels(
                              acceptedFiles,
                              page_slot.id,
                              photoData.page.id
                            )
                          }
                          onDropAccepted={() => {
                            setMapSlotUpload((prevData) => [...prevData, [i, j]]);
                          }}
                          disabled={photoData.page_docs.some(
                            (page_doc) =>
                              page_doc.photo_slot?.slot_number ===
                              page_slot.slot_number
                          )}
                        >
                          {({ getRootProps, getInputProps }) => (
                            <div
                              // onclick="toggleDocPreview(this, event)"
                              className="photo-item gallery-box column has-alternative-child-bg dropzone-82--1 dz-clickable"
                              id="no-vertical-border"
                              {...getRootProps()}
                              style={{ maxWidth: "315px" }}
                            >
                              <input {...getInputProps()} />
                              {j === 0 && (
                                <div className="gallery-header bg-primary-10 height-25 d-flex align-items-center p-l-5 p-r-5">
                                  <h4
                                    className="text-lg text-center d-flex align-items-center h-100"
                                    style={{ fontWeight: "700" }}
                                  >
                                    {" "}
                                    <i
                                      className={`ic ic-16 m-r-5 ic-${photoData.page.name?.toLowerCase() === "to do" ? "to-do" : photoData.page.name?.toLowerCase()}`}
                                    ></i>{" "}
                                    {photoData.page.name}
                                  </h4>
                                </div>
                              )}
                              <div className="gallery-content-wrap position-relative">
                                <div className="gallery-media d-flex flex-column align-items-center justify-content-center overflow-hidden position-relative p-b-5">
                                  {photoData.page_docs.map((page_doc, k) => (
                                    <>
                                      {page_doc.photo_slot?.slot_number ===
                                        page_slot.slot_number ? (
                                        <img
                                          ref={divRef}
                                          className="resized-photo"
                                          src={mediaRoute(page_doc?.image)}
                                          alt="John Doe"
                                          onLoad={async () => {
                                            const dimensions =
                                              await checkImageDimensions(
                                                mediaRoute(page_doc?.image)
                                              );
                                            console.log(
                                              "Image dimensions:",
                                              dimensions
                                            );
                                            setDimensions((prev) => ({
                                              ...prev,
                                              [page_doc.id]: dimensions, // Store dimensions by image ID
                                            }));
                                          }}
                                          onClick={async () => {
                                            handleDocPreview(page_doc);
                                          }}
                                          style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit:
                                              dimensions[page_doc.id]?.width >
                                                dimensions[page_doc.id]?.height
                                                ? "contain"
                                                : "contain", // Use individual dimensions // Use individual dimensions
                                            objectPosition: "center",
                                            maxWidth: "100%",
                                            maxHeight: "100%",
                                            paddingTop: "25px",
                                          }}
                                        />
                                      ) : (
                                        <>
                                          {k === 0 && (
                                            <>
                                              <i className="ic ic-60 ic-placeholder-grey cursor-pointer m-t-10"></i>
                                              <p className="text-lg-grey m-t-5">
                                                Click or Drag to Upload
                                              </p>
                                            </>
                                          )}
                                        </>
                                      )}
                                    </>
                                  ))}
                                  {photoData.page_docs?.length === 0 && (
                                    <>
                                      <i className="ic ic-60 ic-placeholder-grey cursor-pointer m-t-10"></i>
                                      <p className="text-lg-grey m-t-5">
                                        Click or Drag to Upload
                                      </p>
                                    </>
                                  )}
                                </div>

                                <div className="gallery-content d-flex align-items-center p-t-2 p-r-5 p-b-2 p-l-5 justify-content-center flex-column">
                                  <div className="gallery-content d-flex align-items-center p-t-2 p-r-5 p-b-2 p-l-5 justify-content-center flex-column">
                                    {photoData.page_docs.map((page_doc, k) => (
                                      <>
                                        {page_doc.photo_slot?.slot_number ===
                                          page_slot.slot_number && (
                                            <>
                                              <p className="name text-truncate  top-25p">
                                                {page_doc.photo_slot?.slot_number}.{" "}
                                                {page_doc.title}
                                              </p>
                                              {hasSubArray(mapSlotUpload, [
                                                i,
                                                j,
                                              ]) && (
                                                  <p className="name text-lg-grey  top-25p">
                                                    Uploaded 100%
                                                  </p>
                                                )}
                                              <div class="custom-control custom-checkbox position-absolute top-0 right-0 z-index-1">
                                                <input
                                                  type="checkbox"
                                                  checked={
                                                    !!bulkSelectionMap[page_doc.id]
                                                  }
                                                  onChange={(event) =>
                                                    handleCheckboxChange(
                                                      event,
                                                      page_doc
                                                    )
                                                  }
                                                  // onClick={() => {
                                                  //   setBulkSelectionMap(prevData => {
                                                  //     const newData = { ...prevData };
                                                  //     if (newData[page_doc.id]) {
                                                  //       delete newData[page_doc.id];
                                                  //     } else {
                                                  //       newData[page_doc.id] = page_doc;
                                                  //     }
                                                  //     return newData;
                                                  //   });
                                                  // }}
                                                  class="custom-control-input"
                                                  id={`customCheck${page_doc.id}`}
                                                />
                                                <label
                                                  class="custom-control-label m-l-5 text-indent"
                                                  for={`customCheck${page_doc.id}`}
                                                >
                                                  Select
                                                </label>
                                              </div>
                                            </>
                                          )}
                                      </>
                                    ))}

                                    {(photoData.page_docs?.length === 0 ||
                                      !photoData.page_docs.some(
                                        (page_doc) =>
                                          page_doc.photo_slot?.slot_number ===
                                          page_slot.slot_number
                                      )) && (
                                        <>
                                          <p className="name text-lg-grey  top-25p">
                                            {page_slot.slot_number}.{" "}
                                            {page_slot.slot_name || "Available"}
                                          </p>
                                          {hasSubArray(mapSlotUpload, [i, j]) && (
                                            <p className="name text-lg-grey  top-25p">
                                              Uploaded 100%
                                            </p>
                                          )}
                                        </>
                                      )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </Dropzone>
                      ))}

                    {(photoData.page_slots?.length > 0 ||
                      photoData.panels?.length > 0) && (
                        <>
                          {photoData?.page_docs
                            ?.filter(
                              (page_doc) =>
                                page_doc.photo_slot?.slot_number === 0 ||
                                page_doc.photo_slot?.slot_number === null
                            )
                            .map((page_doc, k) => (
                              <div
                                key={k}
                                className="photo-item gallery-box column has-alternative-child-bg dropzone-82--1 dz-clickable"
                                style={{ maxWidth: "315px" }}
                              >
                                <div className="gallery-content-wrap position-relative">
                                  <div className="gallery-media d-flex align-items-center justify-content-center overflow-hidden position-relative p-b-5">
                                    <img
                                      ref={divRef}
                                      className="resized-photo"
                                      src={mediaRoute(page_doc?.image)}
                                      alt="John Doe"
                                      onLoad={async () => {
                                        const dimensions =
                                          await checkImageDimensions(
                                            mediaRoute(page_doc?.image)
                                          );
                                        console.log(
                                          "Image dimensions:",
                                          dimensions
                                        );
                                        setDimensions((prev) => ({
                                          ...prev,
                                          [page_doc.id]: dimensions, // Store dimensions by image ID
                                        }));
                                      }}
                                      onClick={async () => {
                                        handleDocPreview(page_doc);
                                      }}
                                      style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit:
                                          dimensions[page_doc.id]?.width >
                                            dimensions[page_doc.id]?.height
                                            ? "contain"
                                            : "contain", // Use individual dimensions // Use individual dimensions
                                        objectPosition: "center",
                                        maxWidth: "100%",
                                        maxHeight: "100%",
                                        paddingTop: "25px",
                                      }}
                                    />
                                  </div>
                                  <div class="custom-control custom-checkbox position-absolute top-0 right-0 z-index-1">
                                    <input
                                      type="checkbox"
                                      checked={!!bulkSelectionMap[page_doc.id]}
                                      onChange={(event) =>
                                        handleCheckboxChange(event, page_doc)
                                      }
                                      // onClick={() => {
                                      //   setBulkSelectionMap(prevData => {
                                      //     const newData = { ...prevData };
                                      //     if (newData[page_doc.id]) {
                                      //       delete newData[page_doc.id];
                                      //     } else {
                                      //       newData[page_doc.id] = page_doc;
                                      //     }
                                      //     return newData;
                                      //   });
                                      // }}
                                      class="custom-control-input"
                                      id={`customCheck${page_doc.id}`}
                                    />
                                    <label
                                      class="custom-control-label m-l-5 text-indent"
                                      for={`customCheck${page_doc.id}`}
                                    >
                                      Select
                                    </label>
                                  </div>
                                  <div className="gallery-content d-flex align-items-center p-t-2 p-r-5 p-b-2 p-l-5 justify-content-center flex-column">
                                    <p className="name text-lg-grey top-25p text-capitalize">
                                      {page_doc.title.length > 18
                                        ? `${page_doc.title.slice(0, 18)}...`
                                        : page_doc.title}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          <Dropzone
                            key={i}
                            onDrop={(acceptedFiles) =>
                              handleAcceptedFiles(
                                acceptedFiles,
                                0,
                                photoData.page.id
                              )
                            }
                            onDropAccepted={() => {
                              setMapPlusUpload((prevData) => [...prevData, i]);
                            }}
                          >
                            {({ getRootProps, getInputProps }) => (
                              <div
                                className="photo-item gallery-box column has-alternative-child-bg upload-photo-card"
                                {...getRootProps()}
                                style={{ maxWidth: "315px" }}
                              >
                                <input {...getInputProps()} />
                                {photoData.page_slots?.length === 0 &&
                                  photoData.panels && (
                                    <div className="gallery-header bg-primary-10 height-25 d-flex align-items-center p-l-5 p-r-5">
                                      <h4
                                        className="text-lg text-center d-flex align-items-center h-100"
                                        style={{ fontWeight: "700" }}
                                      >
                                        {" "}
                                        <i
                                          className={`ic ic-16 m-r-5 ic-${photoData.page.name?.toLowerCase() === "to do" ? "to-do" : photoData.page.name?.toLowerCase()}`}
                                        ></i>{" "}
                                        {photoData.page.name}
                                      </h4>
                                    </div>
                                  )}

                                <div className="gallery-content-wrap position-relative">
                                  <div className="gallery-media d-flex align-items-center justify-content-center overflow-hidden position-relative p-t-5 p-b-5">
                                    <button
                                      role="button"
                                      className="plus-icon text-gold h1 dropzone---1-1 d-flex align-items-center justify-content-center w-100 h-100 cursor-pointer dz-clickable"
                                    >
                                      +
                                    </button>
                                  </div>
                                  <div className="gallery-content d-flex align-items-center p-t-2 p-r-5 p-b-2 p-l-5 justify-content-center flex-column">
                                    <p className="name text-lg-grey top-25p text-capitalize">
                                      {mapPlusUpload.includes(i)
                                        ? "Uploaded 100%"
                                        : `upload photo to ${photoData.page.name}`}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Dropzone>
                        </>
                      )}
                  </>
                )}
              {CheckforZeroSlotorpanels(photoData) && (
                <>
                  {photoData?.page_docs
                    ?.filter(
                      (page_doc) =>
                        page_doc.photo_slot?.slot_number === 0 ||
                        page_doc.photo_slot?.slot_number === null
                    )
                    .map((page_doc, k) => (
                      <>
                        {photoData?.page_docs?.filter(
                          (page_doc) =>
                            page_doc.photo_slot?.slot_number === 0 ||
                            page_doc.photo_slot?.slot_number === null
                        ).length > 0 && (
                            <div
                              className="photo-item gallery-box column has-alternative-child-bg upload-photo-card"
                              style={{ maxWidth: "315px" }}
                            >
                              {k === 0 && (
                                <div className="gallery-header bg-primary-10 height-25 d-flex align-items-center p-l-5 p-r-5">
                                  <h4
                                    className="text-lg text-center d-flex align-items-center h-100"
                                    style={{ fontWeight: "700" }}
                                  >
                                    {" "}
                                    <i
                                      className={`ic ic-16 m-r-5 ic-${photoData.page.name?.toLowerCase() === "to do" ? "to-do" : photoData.page.name?.toLowerCase()}`}
                                    ></i>{" "}
                                    {photoData.page.name}
                                  </h4>
                                </div>
                              )}
                              <div className="  gallery-content-wrap position-relative">
                                <div
                                  className="gallery-media d-flex align-items-center justify-content-center overflow-hidden position-relative p-b-5 "
                                  style={{ marginRight: "5px" }}
                                >
                                  <img
                                    ref={divRef}
                                    className="resized-photo"
                                    src={mediaRoute(page_doc?.image)}
                                    alt="John Doe"
                                    onLoad={async () => {
                                      const dimensions =
                                        await checkImageDimensions(
                                          mediaRoute(page_doc?.image)
                                        );
                                      console.log(
                                        "Image dimensions:",
                                        dimensions
                                      );
                                      setDimensions((prev) => ({
                                        ...prev,
                                        [page_doc.id]: dimensions, // Store dimensions by image ID
                                      }));
                                    }}
                                    onClick={async () => {
                                      handleDocPreview(page_doc);
                                    }}
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      objectFit:
                                        dimensions[page_doc.id]?.width >
                                          dimensions[page_doc.id]?.height
                                          ? "contain"
                                          : "contain", // Use individual dimensions // Use individual dimensions
                                      objectPosition: "center",
                                      maxWidth: "100%",
                                      maxHeight: "100%",
                                      paddingTop: "25px",
                                    }}
                                  />
                                </div>
                                <div class="custom-control custom-checkbox position-absolute top-0 right-0 z-index-1">
                                  <input
                                    type="checkbox"
                                    checked={!!bulkSelectionMap[page_doc.id]}
                                    onChange={(event) =>
                                      handleCheckboxChange(event, page_doc)
                                    }
                                    // onClick={() => {
                                    //   setBulkSelectionMap(prevData => {
                                    //     const newData = { ...prevData };
                                    //     if (newData[page_doc.id]) {
                                    //       delete newData[page_doc.id];
                                    //     } else {
                                    //       newData[page_doc.id] = page_doc;
                                    //     }
                                    //     return newData;
                                    //   });
                                    // }}
                                    class="custom-control-input"
                                    id={`customCheck${page_doc.id}`}
                                  />
                                  <label
                                    class="custom-control-label m-l-5 text-indent"
                                    for={`customCheck${page_doc.id}`}
                                  >
                                    Select
                                  </label>
                                </div>
                                <div className="gallery-content d-flex align-items-center p-t-2 p-r-5 p-b-2 p-l-5 justify-content-center flex-column">
                                  <p className="name text-lg-grey top-25p text-capitalize">
                                    {page_doc.title.length > 18
                                      ? `${page_doc.title.slice(0, 18)}...`
                                      : page_doc.title}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                      </>
                    ))}
                  {/* {photoData?.page_docs.length === 0 && (
                    <div className="gallery-header bg-primary-10 height-25 d-flex align-items-center p-l-5 p-r-5" style={{marginLeft:"5px"}}>
                      <h4
                        className="text-lg text-center d-flex align-items-center h-100"
                        style={{ fontWeight: "700" }}
                      >
                        {" "}
                        <i
                          className={`ic ic-16 m-r-5 ic-${photoData.page.name?.toLowerCase() === "to do" ? "to-do" : photoData.page.name?.toLowerCase()}`}
                        ></i>{" "}
                        {photoData.page.name}
                      </h4>
                    </div>
                  )} */}

                  <Dropzone
                    key={i}
                    onDrop={(acceptedFiles) =>
                      handleAcceptedFiles(
                        acceptedFiles,
                        0,
                        photoData.page.id,
                        undefined,
                        i
                      )
                    }
                    onDropAccepted={() => {
                      setMapPlusUpload((prevData) => [...prevData, i]);
                    }}
                  >
                    {({ getRootProps, getInputProps }) => (
                      <div
                        className="photo-item gallery-box column has-alternative-child-bg upload-photo-card"
                        {...getRootProps()}
                        style={{ maxWidth: "315px" }}
                      >
                        <input {...getInputProps()} />
                        {photoData?.page_docs?.filter(
                          (page_doc) =>
                            page_doc.photo_slot?.slot_number === 0 ||
                            page_doc.photo_slot?.slot_number === null
                        ).length === 0 && (
                            <div className="gallery-header bg-primary-10 height-25 d-flex align-items-center p-l-5 p-r-5">
                              <h4
                                className="text-lg text-center d-flex align-items-center h-100"
                                style={{ fontWeight: "700" }}
                              >
                                {" "}
                                <i
                                  className={`ic ic-16 m-r-5 ic-${photoData.page.name?.toLowerCase() === "to do" ? "to-do" : photoData.page.name?.toLowerCase()}`}
                                ></i>{" "}
                                {photoData.page.name}
                              </h4>
                            </div>
                          )}

                        <div className="gallery-content-wrap position-relative">
                          <div className="gallery-media d-flex align-items-center justify-content-center overflow-hidden position-relative p-t-5 p-b-5">
                            <button
                              role="button"
                              className="plus-icon text-gold h1 dropzone---1-1 d-flex align-items-center justify-content-center w-100 h-100 cursor-pointer dz-clickable"
                            >
                              +
                            </button>
                          </div>
                          <div className="gallery-content d-flex align-items-center p-t-2 p-r-5 p-b-2 p-l-5 justify-content-center flex-column">
                            <p className="name text-lg-grey top-25p text-capitalize">
                              {mapPlusUpload.includes(i)
                                ? "Uploaded 100%"
                                : `upload photo to ${photoData.page.name}`}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </Dropzone>
                </>
              )}
            </React.Fragment>
          );
        }
      })}
      {/* Document Upload Modal */}

      <DocumentUploadModal
        uploadFile={uploadFile}
        uploadProgress={uploadProgress}
        show={fileUploadModal}
        onHide={() => setFileUploadModal(false)}
      />
      {showloading && (
        <table className="table table-borderless table-striped table-earning theme-colored fake-rows-2">
          <tr
            style={{
              height: "140px",
              // display: searchResults.length % 2 === 0 ? "" : "none",
            }}
            className="search-row fake-row-2 p-5"
          >
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr style={{ height: "140px" }} className="search-row fake-row-2 p-5">
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr style={{ height: "140px" }} className="search-row fake-row-2 p-5">
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr style={{ height: "140px" }} className="search-row fake-row-2 p-5">
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr style={{ height: "140px" }} className="search-row fake-row-2 p-5">
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr style={{ height: "140px" }} className="search-row fake-row-2 p-5">
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr style={{ height: "140px" }} className="search-row fake-row-2 p-5">
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr style={{ height: "140px" }} className="search-row fake-row-2 p-5">
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </table>
      )}
    </>
  );
};

export default AllTab;
