function showModal(modalId) {
  let modal = new bootstrap.Modal(document.getElementById(modalId));
  modal.show();
}

function prepareAndShowModal(checkId, modalId) {
  let url = "";
  if (modalId === "upload-modal-check-cleared") {
    url = "/30/upload-check-cleared/" + checkId + "/";
  } else if (modalId === "upload-modal-check-sent") {
    url = "/30/upload-check-sent/" + checkId + "/";
  }
  let form = document.getElementById(modalId).querySelector("form");
  form.action = url;
  showModal(modalId);
}
function openPDFModal(url) {
  let pdfIFrame = document.getElementById("pdf-modal-iframe");
  pdfIFrame.src = url;
  let myModal = new bootstrap.Modal(document.getElementById("pdf-modal"), {});
  myModal.show();
}

function prepareAndShowCheckDetailsModal(checkId) {
    let url = "/30/check-details/" + checkId + "/";
    
    let form = document.getElementById("check-details-modal").querySelector("form");
    form.action = url;
    form.method = "POST";
    showModal("check-details-modal");

}
