import React from 'react'
import ButtonLoader from '../Loaders/ButtonLoader'
import { useDropzone } from 'react-dropzone';

function DropZoneSlot({processedPageSlot, onDrop,draggedSlotNumber,handleUploadPopup}) {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: (acceptedFiles) => onDrop(acceptedFiles, slot.page_slot.id),
        noClick: true,
        noKeyboard: true,
        multiple: false,
        accept: "image/*,application/pdf",
      });
    
  return (
    <div
                    {...getRootProps()}
                    className="col-12 col-md-3 col-xl icon-text-box text-center dropzone-{processedPageSlot.page_slot.id}-{clientProvider.id}-{page2.id} height-25 btn-primary-lighter-2 font-weight-semibold btn-white-hover cursor-pointer"
                    id="no-vertical-border"
                    onClick={() =>
                      handleUploadPopup(
                        processedPageSlot.page_slot.id,
                        clientProvider.id,
                        2
                      )
                    }
                  >
                   {draggedSlotNumber == processedPageSlot.page_slot.id ? (isDragging ? ((
                        <span className="d-flex align-items-center">
                        <ButtonLoader/>
                        <span style={{marginLeft:"5px"}}>Uploading</span>
                        </span>
                      )): (
                    <>
                            <span className="icon-wrap">
                            <i className="ic ic-19 ic-custom-icon-cloud-2 cursor-pointer img-19px"></i>
                          </span>
                          {processedPageSlot.page_slot.slot_name ? (
                            <p className="name text-lg-grey">
                              {processedPageSlot.page_slot.slot_number}.{" "}
                              {processedPageSlot.page_slot.slot_name}
                            </p>
                          ) : (
                            <p className="name text-lg-grey">
                              {processedPageSlot.page_slot.slot_number}. Available
                            </p>
                          )}
                    </>
                   )):( <>
                            <span className="icon-wrap">
                            <i className="ic ic-19 ic-custom-icon-cloud-2 cursor-pointer img-19px"></i>
                          </span>
                          {processedPageSlot.page_slot.slot_name ? (
                            <p className="name text-lg-grey">
                              {processedPageSlot.page_slot.slot_number}.{" "}
                              {processedPageSlot.page_slot.slot_name}
                            </p>
                          ) : (
                            <p className="name text-lg-grey">
                              {processedPageSlot.page_slot.slot_number}. Available
                            </p>
                          )}
                    </>)}
                  </div>
  )
}

export default DropZoneSlot
