function showModal(message) {
    let modalElement = document.getElementById("errorModal");
    let modalBody = modalElement.querySelector(".modal-body");
    modalBody.innerHTML = message;
    let bsModal = new bootstrap.Modal(modalElement);
    bsModal.show();
}
// the following function is used to convert the date from the iso format to the m/dd/yyyy format
/**
 * Converts a date from ISO 8601 format ('YYYY-MM-DDTHH:mm:ssZ') to 'M/DD/YYYY' format.
 *
 * @param {string} dateStr - The date and time in ISO 8601 format ('YYYY-MM-DDTHH:mm:ssZ').
 * @return {string} - The date in 'M/DD/YYYY' format.
 */
convertToMDDYYYY = (dateStr) => {
     if (!dateStr) {
        return '';
    }
    const datePart = dateStr.split('T')[0];
    const parts = datePart.split('-');
    if (parts.length !== 3) {
        return ""; // Invalid input
    }

    const [year, month, day] = parts;
    return `${parseInt(month, 10)}/${day}/${year}`;
};
function convertToISOFormat(dateStr) {
    if (!dateStr) {
        return "";
    }
    const parts = dateStr.split('/');
    if (parts.length !== 3 || parts[0].length > 2 || parts[1].length > 2 || parts[2].length !== 4) {
        return null; // Return null or throw an error for invalid format
    }

    const day = parts[0];
    const month = parts[1];
    const year = parts[2];

    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

async function getCostAction(cost_id) {
    try {
        const response = await fetch(`${window.location.origin}/30/get-cost-action/${cost_id}/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                return data.data;
            }
            throw new Error(data.message);

        }
    } catch (error) {
        throw new Error(error.message);
    }
}

async function editCostOrCancelCheckRequest(cost_id, action_url, clientId, caseId) {
    try {
        const actionObject = await getCostAction(cost_id);
        if (actionObject['edit']) {
            await editCost(cost_id, action_url);
        } else if (actionObject['cancel']) {
            let modal = document.getElementById("cancelCheckRequest");
            let modalBtn = modal.querySelector("#cancelCheckRequestButton");
            modalBtn.addEventListener("click", () => {
                checkRequestHelper("cancel", clientId, caseId, "costs", cost_id);
            })
            $('#cancelCheckRequest').modal('show');
        }
    } catch (error) {
        showModal(error.message);
        console.error(error);
    }
}

const editCost = async (cost_id, action_url) => {
    const costEntryDetails = await getCostEntryDetails(cost_id);
    const modal = document.getElementById("editCostModal");
    const deleteForm = modal.querySelector("#delete-cost-form");
    const modalForm = modal.querySelector("#editCostForm");
    modalForm.action = action_url;
    modalForm.querySelector('#date').value = convertToMDDYYYY(costEntryDetails.date);
    modalForm.querySelector('#payee').value = costEntryDetails.payee;
    modalForm.querySelector('#invoice_number').value = costEntryDetails.invoice_number;
    modalForm.querySelector('#amount').value = costEntryDetails.amount;
    deleteForm.querySelector('#record_id').value = cost_id;
    if (costEntryDetails.paid_by == "Credit Card") {
        modalForm.querySelector('#creditCard').checked = true;
    } else {
        modalForm.querySelector('#check').checked = true;
    }
    modalForm.querySelector('#memo').value = costEntryDetails.memo;
    prepareAndDisplayEditCostModal(modal);
}

const prepareAndDisplayEditCostModal = (modal) => {
    let bs = new bootstrap.Modal(modal);
    let crossBtn = modal.querySelector("#editModalCrossBtn");
    crossBtn.addEventListener("click", closeModalAndResetForm);
    let cancelBtn = modal.querySelector("#editModalCancelBtn");
    cancelBtn.addEventListener("click", closeModalAndResetForm);
    bs.show();
}

function closeModalAndResetForm() {
    try {
        const modal = document.getElementById("editCostModal");
        const modalForm = modal.querySelector("form");

        // Reset form fields
        modalForm.reset();

        // Close modal
        let bs = new bootstrap.Modal(modal);
        bs.hide();
    } catch (error) {
        console.error(error);
    }
}

async function checkRequestModal(cost_id, clientId, caseId) {
    event.stopPropagation();
    try {
        let modal = document.getElementById("confirmCheckRequest");
        let modalBtn = modal.querySelector("#confirmCheckRequestButton");
        let checkDetails = await getCheckDetails(cost_id, 'costs', clientId);
        if (checkDetails) {
            let modalBody = modal.querySelector(".modal-body");
            let payee = modalBody.querySelector("#payee");
            let amount = modalBody.querySelector("#amount");
            let memo = modalBody.querySelector("#memo");
            let invoice_number = modalBody.querySelector("#invoice_number");
            payee.innerText = checkDetails.payee;
            amount.innerText = checkDetails.amount;
            memo.innerText = checkDetails.memo;
            invoice_number.innerText = checkDetails.invoice_number;
        }
        modalBtn.addEventListener("click", async () => {
            await checkRequestHelper("create", clientId, caseId, "costs", cost_id);
        });
        $('#confirmCheckRequest').modal('show');
    } catch (error) {
        showModal(error.message);
        console.error(error);
    }
}

async function getCostEntryDetails(cost_id) {
    try {
        const response = await fetch(`${window.location.origin}/30/get-cost-entry-details/${cost_id}/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                return data.data;
            }
            throw new Error(data.message);

        }
    } catch (error) {
        throw new Error(error.message);
    }
}


let verifyImg = document.querySelector('img[data-toggle="modal"][data-target="#verifyModal"]')
let invoiceImg = document.querySelector('img[data-toggle="modal"][data-target="#invoiceModal"]')


if (invoiceImg) {
    invoiceImg.addEventListener('click', function (event) {
        let bsModal = new bootstrap.Modal(document.getElementById('invoiceModal'))
        bsModal.show()
        event.stopPropagation()
    })
}
if (verifyImg) {
    verifyImg.addEventListener('click', function (event) {
        let bsModal = new bootstrap.Modal(document.getElementById('verifyModal'))
        bsModal.show()
        event.stopPropagation()
    })
}


async function getCheckDetails(id, table, clientId) {
    try {
        let url = `${window.location.origin}/30/get-check-request-details/${id}/${clientId}/${table}/`;
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                return data.data;
            } else {
                console.error("Request completed, but server indicates failure:", data);
                showErrorModal(data.message);
            }
        } else {
            console.error("Failed to make request:", response.statusText);
        }
    } catch (error) {
        console.error("An error occurred:", error);
    }
}
