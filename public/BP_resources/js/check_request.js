function showModal(message) {
    let modalElement = document.getElementById("errorModal");
    let modalBody = modalElement.querySelector(".modal-body");
    modalBody.innerHTML = message;
    let bsModal = new bootstrap.Modal(modalElement);
    bsModal.show();
}

const convertActionToURL = (action, clientId, caseId, id) => {
    switch (action) {
        case "create":
            return `${window.location.origin}/30/checkRequest/${clientId}/${caseId}/${id}/`;
        case "cancel":
            return `${window.location.origin}/30/cancel-check-request/${clientId}/${caseId}/${id}/`;
        default:
            throw new Error(`Unknown action: ${action}`);
    }
    throw new Error(`Unknown action: ${action}`);
}
async function checkRequestHelper(action, clientId, caseId, table, id) {
    const url = convertActionToURL(action, clientId, caseId, id);
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                type: table,
            }),
        });

        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                window.location.reload();
            } else {
                console.error("Request completed, but server indicates failure:", data);
                showModal(data.message);
            }
        } else {
            console.error("Failed to make request:", response.statusText);
        }
    } catch (error) {
        console.error("An error occurred:", error);
    }
}
