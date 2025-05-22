function showErrorModal(message) {
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
async function getCheckInfo(checkId) {
    try {
        const response = await fetch(`${window.location.origin}/30/get-check-details/${checkId}/`, {
            method: "GET", headers: {
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

/**
 * Safely sets the value or innerText of an element found within a parent element.
 *
 * @param {Element} parentElem - The parent DOM element to search within.
 * @param {string} selector - The CSS selector to locate the child element.
 * @param {string|number} value - The value to assign to the element.
 * @param {string|number} [defaultVal=''] - Default value to use if the provided value is falsy.
 */
function safeSetValueWithin(parentElem, selector, value, defaultVal = '') {
    if (!parentElem || !(parentElem instanceof Element)) {
        console.warn('safeSetValueWithin: Provided parentElem is not a valid DOM Element.');
        return;
    }

    const childElem = parentElem.querySelector(selector);
    if (!childElem) {
        console.warn(`safeSetValueWithin: Element not found for selector "${selector}".`);
        return;
    }

    const finalValue = value || defaultVal;

    if ('value' in childElem) {
        childElem.value = finalValue;
    } else {
        childElem.innerText = finalValue;
    }
}

async function editAccountCheck(checkId) {
    try {
        const checkDetails = await getCheckInfo(checkId);
        if (!checkDetails) {
            console.error("Cannot fetch check details");
            return;
        }
        populateModalForm(checkDetails, checkId);
        const bsModal = new bootstrap.Modal(document.getElementById("editAccountCheckModal"));
        bsModal.show();

    } catch (error) {
        showErrorModal(error.message);
        console.error(error);
    }
}

function populateModalForm(checkDetails, checkId) {
    const modal = document.getElementById("editAccountCheckModal");
    const modalEditForm = modal.querySelector("#editAccountCheckForm");
    const modalDeleteForm = modal.querySelector("#deleteAccountCheckForm");
    modalDeleteForm.action = `${window.location.origin}/30/delete-check/${checkId}/`;
    modalEditForm.action = `${window.location.origin}/30/edit-account-check/${checkId}/`;

    // Setting values safely using the helper function
    safeSetValueWithin(modalEditForm, "#due_date", convertToMDDYYYY(checkDetails.due_date));
    safeSetValueWithin(modalEditForm, "#date_requested", convertToMDDYYYY(checkDetails.date_requested));
    safeSetValueWithin(modalEditForm, "#payee", checkDetails.payee);
    safeSetValueWithin(modalEditForm, "#amount", checkDetails.amount, '0.00');
    safeSetValueWithin(modalEditForm, "#memo", checkDetails.memo);
    safeSetValueWithin(modalEditForm, "#cheque_date", convertToMDDYYYY(checkDetails.cheque_date));
    safeSetValueWithin(modalEditForm, "#cheque_number", checkDetails.cheque_number);
    safeSetValueWithin(modalEditForm, "#date_cleared", convertToMDDYYYY(checkDetails.cleared_date));
    safeSetValueWithin(modalEditForm, "#category", checkDetails.cheque_type);
    safeSetValueWithin(modalEditForm, "#username", `${checkDetails.created_by.user.first_name} ${checkDetails.created_by.user.last_name}`, 'N/A');
}

function formatDateToISO(dateString) {
    if (!dateString) {
        return "";
    }

    if (!dateString.includes("/")) {
        return dateString;
    }

    let parts = dateString.split("/");
    if (parts.length !== 3) {
        return "";
    }

    let day = parseInt(parts[0], 10);
    let month = parseInt(parts[1], 10);
    let year = parseInt(parts[2], 10);

    // Ensure all parts are numbers
    if (isNaN(day) || isNaN(month) || isNaN(year)) {
        return "";
    }

    // Ensure year has 4 digits
    if (year < 1000 || year > 9999) {
        return "";
    }

    // Basic checks for day and month values
    if (month < 1 || month > 12 || day < 1 || day > 31) {
        return "";
    }

    // Add zero padding if necessary
    let dayStr = (day < 10 ? '0' : '') + day;
    let monthStr = (month < 10 ? '0' : '') + month;

    return `${year}-${monthStr}-${dayStr}`;
}
