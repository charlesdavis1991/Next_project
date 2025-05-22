import React from 'react'

const NoteModalBody = (props) => {
  return (
    <div className="modal-content">
        <div className="modal-header text-center">
            <h5 className="modal-title mx-auto" id="headpop">{props.content}</h5>
        </div>
        <div className="modal-footer border-0">
            <button type="button" className="btn btn-secondary testSearch-background-color-6c757d-color-white-margin-0-auto-0-auto"
                onClick={props.hideModal}
                data-dismiss="modal">Dismiss</button>
        </div>
    </div>
  );
}

export default NoteModalBody;


  