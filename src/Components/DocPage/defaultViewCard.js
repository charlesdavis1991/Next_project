import React from "react"
import ButtonLoader from "../Loaders/ButtonLoader"

export const DefaultViewCard = ({
    doc,
    slot,
    handleDocPreview,
}) => {
    return (
        <div
            className="col-12 col-md-3 col-xl icon-text-box text-center height-25 btn-primary-lighter-2 bg-primary-5-hover font-weight-semibold cursor-pointer"
            id="no-vertical-border"
            onClick={() => handleDocPreview(doc)}
            key={doc.id}
            style={{ background: 'var(--primary-10)' }}
        >
            <p className="date">
                {new Date(
                    doc.created
                ).toLocaleDateString()}
            </p>
            <span className="icon-wrap">
                <i className="ic ic-19 ic-file-colored cursor-pointer img-19px"></i>
            </span>
            <p className="name">
                {slot?.slot_number}.{" "}
                {doc.file_name || slot?.slot_name}
            </p>
        </div>
    )
}

export const DefaultViewCard2 = ({
    doc,
    slot,
    handleDocPreview,
}) => {
    return (
        <div
            className="d-flex icon-text-box-custom  m-b-5 text-center height-25 btn-primary-lighter-2 bg-primary-5-hover font-weight-semibold cursor-pointer"
            id="no-vertical-border"
            onClick={() => handleDocPreview(doc)}
            style={{ justifyContent: "center", marginRight: '5px', fontFamily: 'var(--bs-body-font-family)', background: 'var(--primary-10)' }}
        >
            <span className="icon-wrap">
                <i className="ic ic-19 ic-file-colored cursor-pointer img-19px"></i>
            </span>
            <p className="name" style={{overflow: 'hidden'}}>
                {doc?.file_name?.length > 20
                    ? `${doc.file_name.slice(0, 20)}...`
                    : doc.file_name}
            </p>
        </div>
    )
}

export const DefaultEmptyCard = ({
    slot,
    page,
    item,
    isDragging,
    refetchLoading,
    handleDrop,
    handleUploadPopup,
    isSlotUploading,
}) => {
    return (
        <div
            onDrop={(e) =>
                handleDrop(
                    e,
                    slot.id,
                    page?.page?.id,
                    item?.id
                )
            }
            className={`col-12 col-md-3 col-xl icon-text-box text-center dropzone-${slot.id}-${item?.id}-${page.page.id} height-25 btn-primary-lighter-2 bg-primary-5-hover font-weight-semibold cursor-pointer`}
            style={{ background: 'var(--primary-10)' }}
            id="no-vertical-border"
            onClick={() =>
                handleUploadPopup(
                    slot?.id,
                    item?.id,
                    page?.page?.id
                )
            }
        >
            {isSlotUploading(
                slot?.id,
                item?.id
            ) &&
                (isDragging || refetchLoading) ? ( // Corrected condition
                <div className="d-flex align-items-center justify-content-center">
                    <ButtonLoader />
                    <span
                        style={{ marginLeft: "5px" }}
                    >
                        Uploading
                    </span>
                </div>
            ) : (
                // Unchanged code
                <>
                    <span className="icon-wrap">
                        <i className="ic ic-19 ic-custom-icon-cloud-2 cursor-pointer img-19px"></i>
                    </span>
                    {slot.slot_name ? (
                        <p className="name text-lg-grey">
                            {slot?.slot_number}.{" "}
                            {slot?.slot_name}
                        </p>
                    ) : (
                        <p className="name text-lg-grey">
                            {slot?.slot_number}. Available
                        </p>
                    )}
                </>
            )}
        </div>
    )
}

export const DefaultUploadCard = ({
    page,
    item,
    isDragginguploadingbutton,
    uploadbuttonLoadingid,
    handleDropwithOutpanlesWithoutslots,
    handleUploadPopupwithoutSlots,
}) => {
    return (
        <div
            className="col-12 col-md-6 col-xl-3 icon-text-box text-center order-last height-25 btn-primary-lighter-2 bg-primary-5-hover font-weight-semibold cursor-pointer"
            style={{ background: 'var(--primary-10)' }}
            onDrop={(event) =>
                handleDropwithOutpanlesWithoutslots(
                    event,
                    true,
                    page?.page?.id,
                    item?.id
                )
            }
            onClick={() =>
                handleUploadPopupwithoutSlots(page?.page?.id)
            }
        >
            <div className="upload-icon border-0 rounded-0 bg-transparent">
                <div className="d-flex align-items-center width-inherit justify-content-center" style={{ fontFamily: 'var(--bs-body-font-family)' }}>
                    {isDragginguploadingbutton &&
                        item?.id === uploadbuttonLoadingid ? (
                        <>
                            <ButtonLoader />
                            <span style={{ marginLeft: "5px" }}>
                                Uploading..
                            </span>
                        </>
                    ) : (
                        <>
                            <span className="font-weight-bold text-gold h5 m-0 pr-2">
                                +
                            </span>
                            <span className="text-lg-grey name">
                                Upload Document to Page{" "}
                            </span>
                        </>
                    )}
                </div>
            </div>
        </div >
        // <div
        //     className="col-12 col-md-6 col-xl-3 icon-text-box text-center order-last font-weight-semibold cursor-pointer detailed-empty-card"
        //     onDrop={(event) =>
        //         handleDropwithOutpanlesWithoutslots(
        //             event,
        //             true,
        //             page?.page?.id,
        //             item?.id
        //         )
        //     }
        //     onClick={() =>
        //         handleUploadPopupwithoutSlots(page?.page?.id)
        //     }
        // >
        //     <div className="upload-icon border-0 rounded-0 bg-transparent">
        //         <div className="d-flex align-items-center width-inherit justify-content-center">
        //             {isDragginguploadingbutton &&
        //                 item?.id === uploadbuttonLoadingid ? (
        //                 <>
        //                     <ButtonLoader />
        //                     <span style={{ marginLeft: "5px" }}>
        //                         Uploading..
        //                     </span>
        //                 </>
        //             ) : (
        //                 <p className="detailed-empty-card-sub-head" style={{ fontWeight: 600, color: 'var(--fc-neutral-text-color)' }}>
        //                     Upload Document to Page{" "}
        //                 </p>
        //             )}
        //         </div>
        //     </div>
        // </div>
    )
}

export const DefaultUploadCardWithoutPanelsWithoutSlots = ({
    page,
    isDragginguploadingbutton,
    handleDropwithOutpanlesWithoutslots,
    handleUploadPopupwithoutSlots,
}) => {
    return (
        <div
            className="col-12 d-flex m-b-5 col-md-3 col-xl icon-text-box text-center order-last height-25 btn-primary-lighter-2 bg-primary-5-hover font-weight-semibold cursor-pointer"
            style={{ background: 'var(--primary-10)', marginRight: '5px' }}
            onDrop={(event) =>
                handleDropwithOutpanlesWithoutslots(event, false, page?.page?.id, 0)
            }
            onClick={() => handleUploadPopupwithoutSlots(page?.page?.id)}
        >
            <div className="upload-icon border-0 rounded-0 bg-transparent dropzone-{data.page.id}-{clientProvider.id}">
                <div className="d-flex align-items-center width-inherit justify-content-center" style={{ fontFamily: 'var(--bs-body-font-family)' }}>
                    {isDragginguploadingbutton ? (
                        <>
                            <ButtonLoader />
                            <span style={{ marginLeft: "5px" }}>Uploading...</span>
                        </>
                    ) : (
                        <>
                            <span className="font-weight-bold text-gold h5 m-0 pr-2">
                                +
                            </span>
                            <span className="text-lg-grey name">
                                Upload Document to Page{" "}
                            </span>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}


export const DefaultUploadCardNoLoader = ({
    page,
    item,
    handleDropwithOutpanlesWithoutslots,
    handleUploadPopupwithoutSlots,
}) => {
    return (
        <div
            className="col-12 col-md-6 col-xl-3 icon-text-box text-center order-last height-25 btn-primary-lighter-2 bg-primary-5-hover font-weight-semibold cursor-pointer"
            style={{ background: 'var(--primary-10)' }}
            onDrop={(event) =>
                handleDropwithOutpanlesWithoutslots(
                    event,
                    true,
                    page?.page?.id,
                    item?.id
                )
            }
            onClick={() =>
                handleUploadPopupwithoutSlots(page?.page?.id)
            }
        >
            <div className="upload-icon border-0 rounded-0 bg-transparent">
                <div className="d-flex align-items-center width-inherit justify-content-center" style={{ fontFamily: 'var(--bs-body-font-family)' }}>
                    {/* {isDragginguploadingbutton &&
                        item?.id === uploadbuttonLoadingid ? (
                        <>
                            <ButtonLoader />
                            <span style={{ marginLeft: "5px" }}>
                                Uploading..
                            </span>
                        </>
                    ) : ( */}
                    {/* <> */}
                    <span className="font-weight-bold text-gold h5 m-0 pr-2">
                        +
                    </span>
                    <span className="text-lg-grey name">
                        Upload Document to Page{" "}
                    </span>
                    {/* </>
                    )} */}
                </div>
            </div>
        </div>
    )
}