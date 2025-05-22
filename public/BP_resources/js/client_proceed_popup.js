function amountCheck(checkAmount) {
    // let clientProceedModal = document.getElementById("client-proceed-modal");
    // let amount = clientProceedModal.querySelector("#amount");
    // let submitButton = clientProceedModal.querySelector("#submit");
    // if (checkAmount < amount.value) {
    //     amount.classList.add("is-invalid");
    //     submitButton.disabled = true;e
    //     submitButton.classList.add("disabld");
    // } else {
    //     amount.classList.remove("is-invalid");
    //     submitButton.disabled = false;
    //     submitButton.classList.remove("disabled");
    //
    // }
}

function showErrorModal(message) {
    let modalElement = document.getElementById("errorModal");
    let modalBody = modalElement.querySelector(".modal-body");
    modalBody.innerHTML = message;
    let bsModal = new bootstrap.Modal(modalElement);
    bsModal.show();
}

(function () {

    let clientProceed = document.getElementById("client-proceed-modal");
    let amount = clientProceed.querySelector("#amount");
    amount.addEventListener("keyup", function (event) {
        console.log("amount changed")
        let check_amount = Number(event.target.getAttribute("data-check-amount").replace(/,/g, '').replace(/$/g, ''));
        if (isNaN(check_amount) || check_amount == null || check_amount == undefined) {
            check_amount = 0;
        }

        amountCheck(check_amount);
    });
}())


async function checkRequestModal(table, id, clientId, caseId) {
    event.stopPropagation();
    try {
        let modal = document.getElementById("CheckRequestModal");
        let checkDetails = await getCheckDetails(id, table, clientId);
        if (checkDetails) {
            let modalBody = modal.querySelector(".modal-body");
            let payee = modalBody.querySelector("#payee");
            let amount = modalBody.querySelector("#amount");
            let memo = modalBody.querySelector("#memo");
            let heading = modal.querySelector("#confirmCheckRequestLabel");
            let promptQuestion = modal.querySelector("#prompt-question");
            let confirmCheckRequestButton = modal.querySelector("#confirmCheckRequestButton");
            if (table.toLowerCase().trim()=="offer") {
                heading.innerText = "Accept Final Offer"
                promptQuestion.innerText = "Are you sure you want to mark the offer as accepted?"
                confirmCheckRequestButton.innerText = "Accept Offer"
            } else {
                heading.innerText = "Confirm Check Request"
                promptQuestion.innerText = "Do you want to confirm the check request?"
                confirmCheckRequestButton.innerText = "Request"
            }
            payee.innerText = checkDetails.payee;
            amount.innerText = checkDetails.amount;
            memo.innerText = checkDetails.memo;

            let modalBtn = modal.querySelector("#confirmCheckRequestButton");
            modalBtn.addEventListener("click", async () => {
                await checkRequestHelper("create", clientId, caseId, table, id);
            });
            $('#CheckRequestModal').modal('show');
        }
    } catch (error) {
        showErrorModal(error.message);
        console.error(error);
    }
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
