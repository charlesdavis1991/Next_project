const postInitializeFields = async (client_id, case_id, b_type, provider_id) => {
    const response = await fetch(`/30/settlementFieldInit/${client_id}/${case_id}/${b_type}/${provider_id}`);
    return await response.json();
};

const toggleInputState = (nextInput, locked) => {
    nextInput.classList.remove("positive-values", "negative-values");

    if (locked) {
        nextInput.disabled = false;
        nextInput.classList.remove("locked-input");
        nextInput.classList.add("unlock-input");

    } else {
        nextInput.classList.add("locked-input");
        nextInput.classList.remove("unlock-input");
        // const valueClass = inputNumber > 0 ? "positive-values" : inputNumber < 0 ? "negative-values" : "";
        // if (valueClass) {
        //     // nextInput.classList.add(valueClass);
        // }
        nextInput.disabled = true;
    }
};
const updateFinancials = (data, options) => {
    const financialFields = {
        balance_draft: 'balance_draft_input',
        balance_final: 'balance_final_input',
        offer_draft_sum: 'total_offer_draft',
        offer_final_sum: 'total_offer_final',
        fees_draft_sum: 'total_fees_draft',
        fees_final_sum: 'total_fees_final',
        loans_draft_sum: 'total_loan_draft',
        loans_final_sum: 'total_loan_final',
        clp_draft_sum: 'total_client_proceeds_draft',
        clp_final_sum: 'total_client_proceeds_final',
        medical_draft_sum: 'total_provider_draft',
        medical_final_sum: 'total_provider_final',
    };

    Object.entries(financialFields).forEach(([dataKey, fieldId]) => {
        const value = data[dataKey];
        if (value !== undefined) {
            const formattedCurrency = formatCurrencySettle(value, options);
            safeUpdate(`#${fieldId}`, formattedCurrency, true);
        }
    });
};

function findSiblingWithClass(element, className) {
    // Start with the next sibling element
    let sibling = element.nextElementSibling;

    // Loop through the next siblings
    while (sibling) {
        // Check if this sibling has the desired class
        if (sibling.classList.contains(className)) {
            return sibling;
        }

        // Move to the next sibling
        sibling = sibling.nextElementSibling;
    }

    // Return null if no sibling with the class is found
    return null;
}

const handleFinalField = (elem, field_type, locked, table, id) => {
    const parentElement = elem.closest('.s-final');
    const checkMixDiv = findSiblingWithClass(parentElement, 'check-mix')


    if (field_type === "final" && checkMixDiv) {
        checkMixDiv.innerHTML = ''
        if (!locked) {
            checkMixDiv.appendChild(createButton(table, id))
        }
    }
};

function formatCurrencySettle(value, options) {
    let formattedValue = Number(value).toLocaleString("en-US", options);
    formattedValue = formattedValue.replace("$", ""); // Remove existing dollar sign
    return "$ " + formattedValue; // Prepend standardized dollar sign and space
}

function safeUpdate(selector, value, isValue) {
    const element = document.querySelector(selector);
    if (element) {
        if (isValue) {
            element.value = value;
        } else {
            element.innerText = value;
        }
    } else {
        console.warn(`Element with selector "${selector}" not found.`);
    }
}

function removeCurrencyNotation(amount) {
    // Check if amount is not a string
    if (typeof amount !== 'string') {
        return 0.00;
    }

    // Remove common currency notations
    let cleanedAmount = amount.replace(/[$, ]/g, '');

    // Convert to number and check if it's a valid number
    let finalAmount = parseFloat(cleanedAmount);
    if (isNaN(finalAmount)) {
        return 0.00;
    }

    return finalAmount;
}

const getThreeNextSibling = (elem) => {
    let next = elem.nextElementSibling;
    let next2 = next.nextElementSibling;
    let next3 = next2.nextElementSibling;
    return [next.getElementsByTagName("input")[0], next2.getElementsByTagName("input")[0], next3.getElementsByTagName("input")[0],];
};
const initializeFields = async (client_id, case_id, b_type, provider_id, elem) => {
    const data = await postInitializeFields(client_id, case_id, b_type, provider_id);

    if (!data.success) {
        return;
    }
    const inputElements = getThreeNextSibling(elem.parentNode);
    const {original, draft1, final} = data;
    inputElements[0].value = Number(original).toLocaleString("en-US", {
        style: "currency", currency: "USD",
    });

    inputElements[1].value = Number(draft1).toLocaleString("en-US", {
        style: "currency", currency: "USD",
    });

    inputElements[2].value = Number(final).toLocaleString("en-US", {
        style: "currency", currency: "USD",
    });
};

function addSpaceAfterDollarSign(element) {
    element.innerHTML = element.innerHTML.replace(/(\$)(?=\S)/g, "$1 ");
}

const body = document.body;
addSpaceAfterDollarSign(body);


const getNumberFromInput = (elem) => {
    let inputNumber = elem.value
        .replace("$", "")
        .replace(/,/g, "")
        .replace(" ", "");
    return Number(inputNumber);
};

const getLockUrl = (clientId, caseId, id) => {
    return (window.location.origin + "/30/lock-settle-value/" + clientId + "/" + caseId + "/" + id + "/");
};
const getUrl = (clientId, caseId, id) => {
    return (window.location.origin + "/30/addSettlementCosts/" + clientId + "/" + caseId + "/" + id + "/");
};

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        let cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let cookie = jQuery.trim(cookies[i]);
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const postData = async (url, table, fieldType, amount) => {
    const response = await fetch(url, {
        method: "POST", body: JSON.stringify({
            headers: {
                'Content-Type': 'application/json',
            }, type: table, bill_type: fieldType, amount: amount,
        }),
    });
    return await response.json();
};

const updateValue = (element, value, options) => {
    if (!value) return;

    value = Number(value).toLocaleString("en-US", options);
    value = value.replace("$", "");
    value = "$ " + value;
    if (element.tagName.toLowerCase() === "input") {
        element.value = value;
    } else if (element.tagName.toLowerCase() === "span") {
        element.innerText = value;
    }
};

const updateUI = async (data, options) => {
    const tableIds = ["offer", "fees", "costs", "provider", "loans", "client_proceeds",]
    const totalAmountIds = ['total_offer_draft', 'total_offer_final', 'total_fees_draft', 'total_fees_final', 'total_provider_draft', 'total_provider_final', 'total_loan_draft', 'total_loan_final', 'total_client_proceeds_draft', 'total_client_proceeds_final']
    tableIds.forEach((tableId) => {
        const tableElement = document.getElementById(`${tableId}-og-price-12`);
        const nextSibling = tableElement.nextElementSibling;
        const rowItems = data[`${tableId}_dict`];
        for (const key in rowItems) {
            if (rowItems.hasOwnProperty(key)) {

                const element = rowItems[key];
                let row;
                if (tableId === "costs") {
                    row = document.getElementById('cost-settle-row')
                } else {
                    row = nextSibling.querySelector(`tr[data-id='${key}']`);
                }
                if (!row) continue;

                const rowSpans = row.querySelectorAll("input[type='text']");
                if (!rowSpans) continue;

                rowSpans.forEach((rowSpan, index) => {
                    updateValue(rowSpan, element[index], options);
                });
            }
        }

        const containingElement = document.getElementById(`${tableId}-og-price-12`);
        if (tableId === "costs") {
            const inputs = containingElement.querySelectorAll("input");
            inputs.forEach((input, index) => {
                updateValue(input, data[`${tableId}_p`][index], options);
            });
        } else {
            const spans = containingElement.querySelectorAll("span");
            spans.forEach((span, index) => {
                updateValue(span, data[`${tableId}_p`][index], options);
            });
        }
        totalAmountIds.forEach(id => {
            let element = document.getElementById(id);
            if (element && element.tagName === 'INPUT') {
                updateValue(element, data[id], options)
            }
        });
        let offer_total_action_bar = document.getElementById('offer_total_action_bar')
        if (offer_total_action_bar) {
            updateValue(offer_total_action_bar, data['total_offer_final'], options)
            offer_total_action_bar.classList.remove('negative-values')
            offer_total_action_bar.classList.remove('positive-values')
        }
        let fees_total_action_bar = document.getElementById('fees_total_action_bar')
        if (fees_total_action_bar) {
            updateValue(fees_total_action_bar, data['total_fees_final'], options)
            fees_total_action_bar.classList.remove('negative-values')
            fees_total_action_bar.classList.remove('positive-values')
        }
        let client_proceeds_total_action_bar = document.getElementById('client_proceeds_total_action_bar')
        if (client_proceeds_total_action_bar) {
            updateValue(client_proceeds_total_action_bar, data['total_client_proceeds_final'], options)
            client_proceeds_total_action_bar.classList.remove('negative-values')
            client_proceeds_total_action_bar.classList.remove('positive-values')
        }
    });

    if (data.column_errors.some((val) => val)) {
        const errorModal = new bootstrap.Modal(document.getElementById("errorCalcModal"), {});
        errorModal.show();
        return false;
    }
    return true;
};

const stoppingEventPropagationOnAllInputs = (event) => {
    event.stopPropagation();
};

const container = document.getElementById("settlement-card");
const inputs = container.querySelectorAll("input");

inputs.forEach((input) => {
    input.addEventListener("click", stoppingEventPropagationOnAllInputs);
});

const fetchOfferGroups = async (client_id, case_id, entity_id, insurance_id, entity_type) => {
    const baseUrl = `${window.location.origin}/30/get-offer-group-by-`;
    const entityTypeTrimmed = String(entity_type).trim().toLowerCase();
    let response;
    if (!insurance_id) {
        insurance_id = -999;
    }
    if (entityTypeTrimmed === 'defendant') {
        response = await fetch(`${baseUrl}defendant-and-insurance/${client_id}/${case_id}/${entity_id}/${insurance_id}/`);
    } else if (entityTypeTrimmed === 'client') {
        response = await fetch(`${baseUrl}client-and-insurance/${client_id}/${case_id}/${entity_id}/${insurance_id}/`);
    } else {
        // Handle unexpected entity type
        console.error('Unexpected entity type:', entityTypeTrimmed);
        return null;
    }
    return await response.json();
}

function displayOfferHistory(offers) {
    const offerHistoryTableBody = document.querySelector('#edit-offer-popup-offer-history-table-tbody');
    if (!offerHistoryTableBody) return;
    offerHistoryTableBody.innerHTML = "";
    offers.forEach((offer) => {
        offerHistoryTableBody.innerHTML += createOfferTableRow(offer);
    })
}


async function editOffer(ev) {
    const modalElement = getModalElement();
    if (!modalElement) return;
    resetFormElements("edit-offer-form")
    removeDeleteButtonFromModal('edit-offer-modal')
    insertDeleteButtonToModal(modalElement);
    populateFieldsFromRowData(ev.target, modalElement);
    const tr = ev.currentTarget.closest(".t-row");
    if (!tr) {
        console.error("Failed to find the closest .t-row");
        return;
    }
    let {offer_type_name, client_id, case_id, defendant, insurance, entity_client_id} = extractFieldsFromRow(tr);
    entity_id = defendant ? defendant : entity_client_id;
    entity_type = defendant ? "defendant" : "client";
    const {offer_data} = await fetchOfferGroups(client_id, case_id, entity_id, insurance, entity_type);
    if (offer_data) {
        displayOfferHistory(offer_data);
    }

    let modalTitle = document.querySelector("#edit-offer-modal-title");
    modalTitle.innerText = `Edit Settlement Record - ${offer_type_name}`;

    let form = modalElement.querySelector('#edit-offer-form');
    let allFields = form.querySelectorAll('input:not([name="offer_type"]), select, textarea');
    allFields.forEach((field) => {
        if (field.type === 'hidden') {
            field.disabled = false
            return;
        }
        field.disabled = true
    });

    let fieldsToEnable = getFieldIdsToEnable(offer_type_name);
    fieldsToEnable.forEach(fieldId => {
        let field = form.querySelector(`#${fieldId}`);
        if (field) {
            field.disabled = false;
        }
    });

    toggleSectionBasedOnRadioButtons(modalElement, offer_type_name)
    showBootstrapModal(modalElement);
}

function getModalElement() {
    const modalElement = document.getElementById("edit-offer-modal");
    if (!modalElement) {
        console.error("Modal element not found");
        return null;
    }
    return modalElement;
}

function insertDeleteButtonToModal(modalElement, formId) {
    const modalFooter = modalElement.querySelector(".modal-footer");
    if (!modalFooter) {
        console.error("Modal footer not found");
        return;
    }

    let deleteButton = createDeleteButton(formId);
    modalFooter.insertBefore(deleteButton, modalFooter.firstChild);
}

function createDeleteButton(formId) {
    let deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "btn btn-danger mr-auto";
    deleteButton.textContent = "Delete";
    deleteButton.onclick = deleteRecord;
    deleteButton.form = formId;
    return deleteButton;
}

function populateFieldsFromRowData(target, modalElement) {
    const tr = target.closest(".t-row");
    if (!tr) {
        console.error("Failed to find the closest .t-row");
        return;
    }

    let fields = extractFieldsFromRow(tr);
    setModalFieldsFromData(fields, modalElement);
}

function extractFieldsFromRow(tr) {
    return {
        id: tr.dataset.id,
        client_id: tr.dataset.clientId,
        case_id: tr.dataset.caseId,
        record_id: tr.dataset.id,
        date: tr.dataset.date,
        note: tr.dataset.note,
        check_number: tr.dataset.check_number,
        amount: tr.dataset.amount,
        final_amount: tr.dataset.finalAmount,
        "expiration-date": tr.dataset.expirationDate,
        demand: tr.dataset.demand,
        defendant: tr.dataset.defendant,
        "firm-user": tr.dataset.firmUser,
        accepted: tr.dataset.accepted,
        "date-sent": tr.dataset.dateSent,
        'insurance': tr.dataset.insurance,
        "offer-type": tr.dataset.offerTypeName,
        offer_type: tr.dataset.offer_type,
        offer_type_name: tr.dataset.offerTypeName,
        defendant_name: tr.dataset.defendantName,
        'settlement-conference-date': tr.dataset.settlementConferenceDate,
        'mediation-date': tr.dataset.mediationDate,
        'entity_client_id': tr.dataset.entityClientId,
    };
}

function setModalFieldsFromData(fields, modalElement) {
    let offer_check = modalElement.querySelector("#offer_check");
    offer_check.value = fields.id;
    for (let fieldName in fields) {
        const field = modalElement.querySelector(`[name="${fieldName}"]`);
        if (!field) continue;

        if (field.type === "checkbox") {
            field.checked = fields[fieldName] === "True";
        } else if (field.type === "date") {
            field.value = safelyConvertToISOFormat(fields[fieldName]);
        } else if (field.type === "number") {
            field.value = removeCurrencyNotation(fields[fieldName]);
        } else if (field.type === "select-one") {
            setSelectFieldValue(field, fields[fieldName]);
        } else if (field.type === "radio") {
            setRadioFieldValue(modalElement, fieldName, fields[fieldName]);
        } else {
            field.value = fields[fieldName];
        }
    }
}

function safelyConvertToISOFormat(value) {
    try {
        return convertToISOFormat(value);
    } catch (e) {
        console.error("Error converting to ISO format:", e);
        return value;
    }
}

function setSelectFieldValue(field, value) {
    const option = Array.from(field.options).find(opt => opt.value === value);
    if (option) option.selected = true;
}

function setRadioFieldValue(modalElement, fieldName, value) {
    const matchingRadio = modalElement.querySelector(`[name="${fieldName}"][value="${value}"]`);
    if (matchingRadio) matchingRadio.checked = true;
}

function showBootstrapModal(modalElement) {
    const bsModal = new bootstrap.Modal(modalElement);
    bsModal.show();
}

function handleCloseModal() {
    let modal = new bootstrap.Modal(document.getElementById('myModal'));
    modal.hide();
}

// Attach the click event to the close button
const closeButton = document.getElementById('offer-closeModalButton');
if (closeButton) {
    closeButton.addEventListener('click', handleCloseModal);
}

// Listen for key presses throughout the document
document.addEventListener('keydown', function (event) {
    // Check if 'Enter' key is pressed
    if (event.key === 'Enter') {
        // Ensure the close button is the currently focused element
        if (document.activeElement === closeButton) {
            handleCloseModal();
        }
    }
});


function resetFormElements(formId) {
    if (typeof formId !== "string" || formId.trim() === "") {
        console.error("Invalid formId provided.");
        return;
    }

    const form = document.getElementById(formId);
    // check if form is an instance of HTMLFormElement
    if (!(form instanceof HTMLFormElement)) {
        console.error(`Element with the ID '${formId}' is not a form.`);
        return;
    }
    if (!form) {
        console.error(`Form with the ID '${formId}' was not found.`);
        return;
    }

    Array.from(form.elements).forEach(element => {
        if (element?.type === "hidden") return;
        switch (element.type) {
            case "text":
            case "password":
            case "textarea":
            case "email":
            case "search":
            case "number":
            case "tel":
            case "url":
            case "date":
            case "datetime-local":
            case "month":
            case "time":
            case "week":
            case "color":
                element.value = "";
                break;
            case "checkbox":
                break;
            case "radio":
                element.checked = false;
                break;
            case "select-one":
            case "select-multiple":
                element.selectedIndex = 0;
                break;
            default:
                // This default case can handle any future or custom form input types that we may not have covered.
                console.warn(`Unhandled form input type: ${element.type}. You may need to extend the reset function for this.`);
        }
    });
}

function removeDeleteButtonFromModal(modalId) {
    // Select the modal by its ID
    let modal = document.getElementById(modalId);

    if (!modal) return;  // If the modal is not found, exit the function

    // Find buttons inside the modal with the content "delete"
    let deleteButtons = modal.querySelectorAll('button');

    for (let btn of deleteButtons) {
        if (btn.textContent.trim().toLowerCase() === "delete") {
            btn.remove();  // Remove the button from the DOM
        }
    }
}

let buttonElement = document.querySelector('button.btn.btn-primary[data-toggle="modal"][data-target="#add-offer-modal"]');
if (buttonElement) {
    buttonElement.addEventListener("click", (ev) => {
        ev.stopPropagation();
        let modalElement = document.getElementById("add-offer-modal");
        let bsModal = new bootstrap.Modal(modalElement);
        bsModal.show();
    })
}

async function getFeeDetail(id) {
    const response = await fetch(`${window.location.origin}/30/fee/${id}/`);
    return await response.json();
}

const displayNoCheckModal = (ev) => {
    ev.stopPropagation();
    $('#noCheckError').modal('show'); // Assuming you're using Bootstrap modal
}

let noCheckElements = document.querySelectorAll('[data-modal-target="#noCheckError"][data-toggle="modal"]');

noCheckElements.forEach(elem => elem.addEventListener('click', displayNoCheckModal));


let providerFields = document.querySelectorAll(".provider-field");
providerFields.forEach((field) => {
    field.addEventListener("click", (e) => {
        e.stopPropagation();
        let bsModal = new bootstrap.Modal(document.getElementById("comm-with-provider"), {});
        bsModal.show();
    });
})
