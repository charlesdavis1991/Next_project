import React, { useEffect, useState } from "react";
import NotesSectionDashboard from "../NotesSectionDashboard/main";
import api from "../../api/api";
import "./main.css";
import UploadPhotoModal from "../Modals/UploadPhotoModal";
import AllTab from "./AllTab";
import UnsortedTab from "./UnsortedTab";
import { saveAs } from "file-saver";
import { mediaRoute } from "../../Utils/helper";
import { photoData } from "./utils";
import { Tab, Tabs } from "react-bootstrap";
import axios from "axios";
import { useSelector } from "react-redux";

const Photo = ({ case_id, client_id }) => {
  const [photoTabsPage, setPhotoTabsPage] = useState([]);
  const [pages, setPages] = useState([]);
  const [unsortedPhotos, setUnsortedPhotos] = useState([]);
  // const [tabsPage, setTabsPage] = useState([]);
  const [photoListData, setPhotoListData] = useState([]);
  const [tabSelected, setTabSelected] = useState("all");
  const [uploadModalShow, setUploadModalShow] = useState(false);
  const [bulkSelectionMap, setBulkSelectionMap] = useState({});

  async function downloadBulkImages() {
    const downloadPromises = Object.values(bulkSelectionMap).map(
      async (photo) => {
        try {
          const response = await axios.get(`${mediaRoute(photo.image)}?timestamp=${new Date()}`, {
            responseType: "blob",
            withCredentials: false
          });
          const blob = response.data;
          const objectURL = URL.createObjectURL(blob);
          saveAs(objectURL, photo.title);
        } catch (error) {
          console.error(
            `Error fetching or processing the blob for ${photo.title}:`,
            error
          );
        }
      }
    );
    // Wait for all downloads to complete
    await Promise.all(downloadPromises);
  }

  async function deleteBulkImages() {
    await downloadBulkImages();
    let photoIds = Object.keys(bulkSelectionMap);
    try {
      await api
        .delete(
          `api/photo/${client_id}/${case_id}/?photo_ids=${photoIds.join(",")}`,
          { check: "Delete" }
        )
        .then((response) => {
          const resData = response.data;
          console.log("photo delete data", resData);
          photoData("", "", case_id).then((data) => {
            if (data) {
              setPhotoListData(data);
            }
          });
          api.get(`/api/photo/${client_id}/${case_id}/`).then((response) => {
            setUnsortedPhotos(response.data.unsorted_photos);
          });
          setBulkSelectionMap({}); // Reset the state after successful deletion
        });
    } catch (error) {
      console.error(
        "Failed to delete photo:",
        error.response?.data || error.message
      );
    }
  }
  async function refetchPhotosTabData() {
    try {
      photoData("", "", case_id).then((data) => {
        if (data) {
          setPhotoListData(data);
        }
      });
    } catch (error) {
      console.error("Failed to refetch photos tab data:", error.response?.data);
    }
  }

  useEffect(() => {
    const fetchPhotoData = async () => {
      try {
        await api
          .get(`/api/photo/${client_id}/${case_id}/`)
          .then((response) => {
            console.log("Photo response data: ", response.data);
            setPhotoTabsPage(response.data.photo_tabs_page);
            setPages(response?.data?.tabs_page);
            setUnsortedPhotos(response.data.unsorted_photos);
            // remove from api too if not used
            // setTabsPage(response.data.tabs_page);
          });
      } catch (error) {
        console.error("Error fetching photo data: ", error);
      }
    };
    fetchPhotoData();
  }, [client_id, case_id]);

  useEffect(() => {
    console.log("Photo list data: ", photoListData);
  }, [photoListData]);
  const handleSelect = async (selectedTab) => {
    if (selectedTab === "unsorted") {
      setTabSelected("unsorted");
    } else if (selectedTab === "all") {
      setTabSelected("all");
    } else {
      setTabSelected(`${selectedTab}`);
    }
  };
  const open = useSelector((state) => state?.open?.open);
  return (
    <>
      <UploadPhotoModal
        show={uploadModalShow}
        onHide={() => {
          setUploadModalShow(false);
          refetchPhotosTabData();
        }}
        pages={pages}
        client_id={client_id}
        case_id={case_id}
        setUnsortedPhotos={setUnsortedPhotos}
      />
      <div className="main-content ">
        <div
          className="action-bar client-BarAlign main-action-bar  d-flex m-b-5 m-t-5 margin-left-12"
          style={{ zIndex: open ? "0" : "" }}
        >
          <span className="page-icon">
            <img
              className="translate-note-icon"
              src="/BP_resources/images/icon/photo-icon-color.svg"
            />
          </span>
          <div className="text-wrapper text-white d-flex align-items-center p-l-5">
            <h2 className="text-white">Photos</h2>
          </div>

          {/* <div className="btn-wrapper" id="photos-nav-tabs">
            <div className="nav nav-tabs hello" id="nav-tab" role="tablist" >
              <a
                // onclick='photoData("","")'
                className="nav-item nav-link active btn btn-primary rounded-0"
                id="custom-nav-all-tab"
                data-toggle="tab"
                href="#all"
                role="tab"
                aria-controls="all"
                aria-selected="true"
                onClick={() => setTabSelected("all")}
              >
                All
              </a>

              <a
                className="nav-item nav-link btn btn-primary rounded-0"
                id="custom-nav-unsorted-tab"
                data-toggle="tab"
                href="#unsorted"
                role="tab"
                aria-controls="unsorted"
                aria-selected="false"
                onClick={() => setTabSelected("unsorted")}

              >
                Unsorted
              </a>

              {photoTabsPage.map((page) => {
                if (page.is_notes_category) {
                  return (
                    <a
                      className="nav-item nav-link btn btn-primary rounded-0"
                      id={`custom-nav-${page.id}-tab`}
                      data-toggle="tab"
                      href={`#${page.id}`}
                      role="tab"
                      aria-controls={page.id}
                      aria-selected={false}
                      key={page.id}
                      onClick={() => setTabSelected(`${page.id}`)}

                    >
                      {page.name}
                    </a>
                  );
                }
              })}
            </div>
          </div> */}

          <div className="btn-wrapper " id="photosPage">
            <div className="nav nav-tabs hello" id="nav-tab" role="tablist">
              <a
                onClick={() => handleSelect("all")}
                className="nav-item nav-link active btn btn-primary rounded-0 Doc-background-color-transparent"
                id="custom-nav-all-tab"
                data-toggle="tab"
                href="#all"
                role="tab"
                aria-controls="all"
                aria-selected="true"
                style={{ marginLeft: "10px" }}
              >
                All
              </a>
              <a
                onClick={() => handleSelect("unsorted")}
                className="nav-item nav-link btn btn-primary rounded-0"
                id="custom-nav-unsorted-tab"
                data-toggle="tab"
                href="#unsorted"
                role="tab"
                aria-controls="unsorted"
                aria-selected="false"
              >
                Unsorted
              </a>
              {photoTabsPage?.map((tab, index) => (
                <a
                  key={tab?.id}
                  onClick={() => handleSelect(tab?.id)}
                  className="nav-item nav-link btn btn-primary rounded-0"
                  id={`custom-nav-${tab?.id}-tab`}
                  data-toggle="tab"
                  href={`#${tab?.id}`}
                  role="tab"
                  aria-controls={tab?.id}
                  aria-selected="false"
                  style={{
                    marginRight:
                      index === photoTabsPage.length - 1 ? "10px" : "0",
                  }}
                >
                  {tab?.name}
                </a>
              ))}
            </div>
          </div>

          <div className="btn-wrapper ml-auto">
            {/* {% comment %}
                <button type="submit" className="btn btn-primary rounded-0" data-toggle="modal" data-target="#addparty"><span className="font-weight-bold pr-2">+</span>Add New Defendant</button>
              {% endcomment %} */}
            <button
              className="btn btn-primary rounded-0 m-l-5"
              onClick={() => setUploadModalShow(true)}
            >
              Upload Photos
            </button>
            <button
              className="btn btn-primary rounded-0 m-r-5"
              onClick={downloadBulkImages}
            >
              Download
            </button>
            <form action="{% url 'bp-delete_all_photos' %}" method="post">
              <input type="text" id="photo_ids" name="photo_ids" hidden />
              <button
                type="button"
                className="btn btn-primary rounded-0"
                onClick={deleteBulkImages}
              >
                Delete
              </button>
            </form>
          </div>
        </div>

        <div
          className=" overflow-hidden Photo-ML5P m-t-5"
          style={{ zIndex: "0" }}
        >
          <div className="" style={{ paddingRight: 0, zIndex: "0" }}>
            <div
              className="col-lg-12 p-l-0"
              style={{ paddingRight: "17px", zIndex: "0" }}
            >
              <div
                className="custom-tab"
                style={{ paddingRight: 0, zIndex: "0" }}
              >
                <div className="tab-content w-100" id="myTabContent">
                  {tabSelected === "all" && (
                    <div
                      className="tab-pane gallery-container"
                      id="all"
                      role="tabpanel"
                      aria-labelledby="all-tab"
                      style={{ overflow: "hidden" }}
                    >
                      <AllTab
                        photoListData={photoListData}
                        setPhotoListData={setPhotoListData}
                        setBulkSelectionMap={setBulkSelectionMap}
                        bulkSelectionMap={bulkSelectionMap}
                        client_id={client_id}
                        case_id={case_id}
                      />
                    </div>
                  )}
                  {tabSelected === "unsorted" && (
                    <UnsortedTab
                      unsortedPhotos={unsortedPhotos}
                      photoListData={photoListData}
                      setBulkSelectionMap={setBulkSelectionMap}
                      bulkSelectionMap={bulkSelectionMap}
                      setPhotoListData={setPhotoListData}
                      case_id={case_id}
                    />
                  )}
                  <div
                    className="tab-pane gallery-container"
                    id="all"
                    role="tabpanel"
                    aria-labelledby="all-tab"
                    style={{ overflow: "hidden" }}
                  >
                    {photoListData.map((photoData) => {
                      if (tabSelected == photoData.page.id) {
                        return (
                          <AllTab
                            key={photoData.page.id}
                            pageId={photoData.page.id}
                            photoListData={photoListData}
                            setPhotoListData={setPhotoListData}
                            setBulkSelectionMap={setBulkSelectionMap}
                            bulkSelectionMap={bulkSelectionMap}
                            client_id={client_id}
                            case_id={case_id}
                          />
                        );
                      }
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div style={{ paddingTop: "0px" }}>
            <NotesSectionDashboard />
          </div>
        </div>
      </div>
    </>
  );
};

export default Photo;
