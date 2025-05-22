import React from 'react'



const ModalBody = (props) => {
    return (
        <>
            <div class="modal-header text-center height-35 p-0 bg-primary rounded-0 border-0 m-4">
                <h3 class="modal-title mx-auto text-white text-upper height-35">Upload Document to Slot</h3>
            </div>

            <div class="modal-body p-4">
                <div className='upload-doc-height-80'>
                <div class="row">
                    <div class="col-md-6 text-center mt-5">
                        <button class="btn btn-primary dropzoneUpload dz-clickable">Upload a Document</button>
                    </div>
                    <div class="col-md-6 DD-Scrollable">
                        <input class="uploaded_doc" id="uploaded_doc" type="hidden" value="3027" />
                        <table class="table table-borderless table-striped">
                            <thead>
                                <tr><th>Page</th>
                                    <th>Document Name</th>

                                </tr></thead>
                              <tbody>
                              <tr class="doc-row"><td>Treatment</td><td></td></tr>
                              <tr class="doc-row"><td>Treatment</td><td></td></tr>
                              <tr class="doc-row"><td>Treatment</td><td></td></tr>
                              <tr class="doc-row"><td>Treatment</td><td></td></tr>
                              <tr class="doc-row"><td>Treatment</td><td></td></tr>
                              <tr class="doc-row"><td>Treatment</td><td></td></tr>
                              <tr class="doc-row"><td>Treatment</td><td></td></tr>
                              <tr class="doc-row"><td>Treatment</td><td></td></tr>
                              <tr class="doc-row"><td>Treatment</td><td></td></tr>
                              <tr class="doc-row"><td>Treatment</td><td></td></tr>
                              <tr class="doc-row"><td>Treatment</td><td></td></tr>
                              <tr class="doc-row"><td>Treatment</td><td></td></tr>
                              <tr class="doc-row"><td>Treatment</td><td></td></tr>
                              <tr class="doc-row"><td>Treatment</td><td></td></tr>
                              <tr class="doc-row"><td>Treatment</td><td></td></tr>
                              <tr class="doc-row"><td>Treatment</td><td></td></tr>
                              <tr class="doc-row"><td>Treatment</td><td></td></tr>
                              <tr class="doc-row"><td>Treatment</td><td></td></tr>
                              </tbody>
                        </table>
                    </div>
                </div>
                </div>
            </div>
            <div class="modal-footer">
            <button type="button" class="btn btn-danger  notification-background-color-grey"
                    onClick={props.hideModal}>Cancle</button>
            <button  type="submit" class="btn btn-success" id="attach-doc-button">Attach Doc</button>
        </div>
        </>
    );
}

export default ModalBody;


