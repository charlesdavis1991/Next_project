function getSectionClassesToDisplay(radioBtnName) {
    let classList = []
    if (typeof radioBtnName !== 'string') {
        return classList;
    }

    radioBtnName = radioBtnName.trim().toLowerCase();
    switch (radioBtnName) {
        case 'demand':
            classList = classList.concat(['offer-form-demand-section'])
            break;
        case 'offer':
            classList = classList.concat(['offer-form-offer-section'])
            break;
        case 'counter offer':
            classList = classList.concat(['offer-form-counter-offer-section'])
            break;
        case 'mediation':
            classList = classList.concat(['offer-form-mediation-section'])
            break;
        case 'settlement conference':
            classList = classList.concat(['offer-form-settlement-conference-section'])
            break;
        default:
            break;
    }
    return classList
}

function getFieldIdsToEnable(radioBtnName) {
    let ids = ['defendant-select', 'insurance-select', 'note', 'client-select', 'client-insurance-select'];
    if (typeof radioBtnName !== 'string') {
        return ids;
    }

    radioBtnName = radioBtnName.trim().toLowerCase();
    switch (radioBtnName) {
        case 'demand':
            ids = ids.concat(['date-sent', 'expiration-date', 'demand', 'demand-final-checkbox', 'demand-draft-checkbox'])
            break;
        case 'offer':
            ids = ids.concat(['amount', 'date', 'offer', 'offer-final-checkbox', 'offer-draft-checkbox', 'accepted'])
            break;
        case 'mediation':
            ids = ids.concat(['mediation-date', 'litigation_event_3'])
            break;
        case 'settlement conference':
            ids = ids.concat(['settlement-conference-date', 'litigation_event_4'])
            break;
        case 'counter offer':
            ids = ids.concat(['counter_offer_amount', 'counter-offer-final-checkbox', 'counter-offer-draft-checkbox', 'counter_offer_accepted', 'counter_offer_date'])
            break;

        default:
            break;
    }
    return ids
}

function toggleSectionBasedOnRadioButtons(parentElement, radioBtnName) {
    let classList = ['offer-form-offer-section', 'offer-form-demand-section', 'offer-form-mediation-section', 'offer-form-settlement-conference-section'];
    classList.forEach((val) => {
        let div = parentElement.querySelector(`.${val}`);
        if (div) {
            div.style.display = 'none';
        }
    })

    let enableClassList = getSectionClassesToDisplay(radioBtnName);
    enableClassList.forEach((val) => {
        let div = parentElement.querySelector(`.${val}`);
        if (div) {
            div.style.display = 'block';
        }
    });

}


$(document).ready(function () {
    $("#add-offer-modal").hide();
    $("#edit-offer-modal").hide();
});

function formatCurrencyUS(amount) {
    const number = Number(amount);
    if (isNaN(number)) {
        return '';
    }

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2
    });

    return formatter.format(number);
}

function formatIsoDateToCustom(isoDate) {
    try {
        const parsedDate = new Date(isoDate);

        if (isNaN(parsedDate.getTime())) {
            return "";
        }

        const month = parsedDate.getMonth() + 1;
        const day = parsedDate.getDate();
        const year = parsedDate.getFullYear();

        return `${month}/${day}/${year}`;
    } catch (e) {
        return "";
    }
}

function createOfferTableRow(offer) {
    if (!offer) {
        return '';
    }
    let date = '';
    if (offer.offer_type && offer.offer_type.name === 'Demand') {
        date = formatIsoDateToCustom(offer.demand_date_sent);
    } else if (offer.offer_type && offer.offer_type.name === 'Offer') {
        date = formatIsoDateToCustom(offer.date);
    }

    const expiration = formatIsoDateToCustom(offer.expiration_date);
    const by = offer.by_entity_client ? offer.by_entity_client.first_name + offer.by_entity_client.last_name : (offer.by_defendant ? offer.by_defendant.first_name + offer.by_defendant.last_name : '');
    const party = offer.entity_client ? offer.entity_client.first_name + offer.entity_client.last_name : (offer.defendant ? offer.defendant.first_name + offer.defendant.last_name : '');
    const insurance = offer.insurance ? offer.insurance.company_contact?.name : '';
    const offerType = offer.offer_type ? offer.offer_type.name : '';
    const note = offer.note || '';
    const demanded = offer.demand ? formatCurrencyUS(offer.demand) : '';
    const offered = offer.amount ? formatCurrencyUS(offer.amount) : '';

    return `
        <tr>
            <td class="s-offer-date height-33">${date}</td>
            <td class="s-offer-by height-33">${by}</td>
            <td class="td-autosize height-33">${party}</td>
            <td class="td-autosize height-33">${insurance}</td>
            <td class="td-autosize height-33">${offerType}</td>
            <td class="s-offer-date height-33">${expiration}</td>
            <td class="s-demand monospace-font height-33 text-right">${demanded}</td>
            <td class="s-demand monospace-font height-33 text-right">${offered}</td>
        </tr>`;
}


document.addEventListener('DOMContentLoaded', function () {
    const fetchOfferData = async (url) => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            return data?.offer_data ?? null;
        } catch (error) {
            console.error('Fetch error:', error);
            return null;
        }
    };

    async function getOfferData(event) {
        const inputField = event.target;
        const inputValue = inputField.value;
        const [entity_id, insurance_id, entity_type] = inputValue.split(',');
        const case_id = inputField.getAttribute('data-case-id');
        const client_id = inputField.getAttribute('data-client-id');
        if (!case_id || !client_id || !entity_id || !insurance_id || !entity_type) {
            return null;
        }
        const entityTypeTrimmed = String(entity_type).trim().toLowerCase();
        const baseUrl = `${window.location.origin}/30/get-offer-by-`;
        if (entityTypeTrimmed === 'defendant') {
            return fetchOfferData(`${baseUrl}defendant-and-insurance/${client_id}/${case_id}/${entity_id}/${insurance_id}/`);
        } else if (entityTypeTrimmed === 'client') {
            return fetchOfferData(`${baseUrl}client-and-insurance/${client_id}/${case_id}/${entity_id}/${insurance_id}/`);
        } else {
            // Handle unexpected entity type
            console.error('Unexpected entity type:', entityTypeTrimmed);
            return null;
        }
    }

    function getParentForm(event) {
        return event.target.closest('form');
    }

    async function handleOfferForm(event) {
        const offerData = await getOfferData(event);
        const initialOfferSection = document.querySelector('#initial-offer-section');
        const initialOfferTable = document.querySelector('#add-offer-popup-initial-offer-table');
        const initialOfferTableBody = document.querySelector('#add-offer-popup-initial-offer-table-tbody');

        if (!initialOfferTable || !initialOfferTableBody || !initialOfferSection) return;

        if (offerData) {
            initialOfferTableBody.innerHTML = createOfferTableRow(offerData);
            initialOfferTable.style.display = 'block';
            initialOfferSection.style.display = 'block';
        } else {
            initialOfferTable.style.display = 'none';
            initialOfferSection.style.display = 'none';
        }
    }

    async function handleSelection(event) {
        const parentForm = getParentForm(event);
        if (!parentForm) return;

        switch (parentForm.id) {
            case 'add-offer-offer-form':
                await handleOfferForm(event);
                break;
            case 'add-offer-demand-form':
                const offerData = await getOfferData(event);
                const parentForm = getParentForm(event);
                const parentModal = document.querySelector('#add-offer-modal');
                if (!parentForm) return;
                if (!offerData) {
                    const submitButton = parentModal.querySelector('input[type=submit]');
                    if (submitButton) {
                        submitButton.disabled = true;
                    }
                }
                const alert = parentForm.querySelector('#add-offer-demand-danger-alert');
                const addOfferModal = document.getElementById('add-offer-modal');
                const submitButton = addOfferModal.querySelector('button#save-button');

                if (!alert) return;
                if (offerData) {
                    alert.innerHTML = 'A demand already exists for this group.'
                    alert.style.display = 'block';
                    submitButton.disabled = true;
                } else {
                    submitButton.disabled = false;
                    alert.style.display = 'none';
                    submitButton.disabled = false;
                }
                break;
            default:
                break;
        }
    }

    const radioButtons = document.querySelectorAll('input[type=radio][name=entity]');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', handleSelection);
    });

});
