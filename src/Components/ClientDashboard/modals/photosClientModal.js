import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import api from '../../../api/api';

const ModalBodyPhotos= () => {
    const [files, setFiles] = useState([]);
    const currentCaseId = useSelector((state) => state?.caseData?.current?.id);
    const clientId = useSelector((state) => state?.client?.current?.id);
    const origin = process.env.REACT_APP_BACKEND_URL;

    const handleFileChange = async (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(selectedFiles);
        await handleUploadPhotos(selectedFiles);
    };

    const handleUploadPhotos = async (uploadFiles) => {
        const formData = new FormData();
        uploadFiles.forEach(file => {
            formData.append('files[]', file);
        });

        try {
            const response = await api.post(
                `${origin}/api/client/upload-photo/${clientId}/${currentCaseId}/`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (response.status === 200) {
                alert('Files uploaded successfully');
            }
        } catch (error) {
            alert('Error uploading files:', error);
        }
    };

    return (
        <div className='overflow-auto mt-2'>
            <div className='col-sm col-md col-lg p-0'>
                <div className='section__content section__content--p30'>
                    <div className="w-100 flex-container p-2" id="upload-doc" style={{ display: "flex", height: "32vh", justifyContent: "center", alignItems: "center", border: "2px dashed rgb(0, 0, 0, 0.2)", borderRadius: "15px", padding: "20px" }}>
                        <div className="drag-area" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "40px" }}>
                            <div className="icon" style={{ fontWeight: "500", fontSize: "30px", color: "rgb(3, 4, 94)" }}><i className="fas fa-cloud-upload-alt"></i></div>
                            <header style={{ margin: "10px 0", fontWeight: "500", fontSize: "30px", color: "rgb(3, 4, 94)" }}>Upload Images</header>
                            
                            <form id="uploadPhotoForm" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <div className="form-group">
                                    <input type="file" className="form-control-file" id="photoFileUpload" name="files[]" multiple required style={{ display: "none" }} onChange={handleFileChange} />
                                    <label htmlFor="photoFileUpload" className="btn btn-primary cp-display-ib-cursor">Choose And Upload Files</label>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModalBodyPhotos;
