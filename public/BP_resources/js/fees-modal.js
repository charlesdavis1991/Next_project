// JavaScript File: fees.js

document.addEventListener('DOMContentLoaded', function () {
    // Disable percentage radio buttons initially
    togglePercentageRadios(true);

    // Event delegation for percentage radio buttons
    document.querySelector('.common-percentage-values').addEventListener('click', handlePercentageClick);

    // Event listener for defendant dropdown change
    document.getElementById('offer-link-fees').addEventListener('change', onOfferChange);
});


function handlePercentageClick(event) {
    if (event.target.name === 'percentage') {
        const isCustom = event.target.value === 'custom';
        document.getElementById('custom_percentage').disabled = !isCustom;
        if (!isCustom) {
            document.getElementById('custom_percentage').value = '';
            document.getElementById('amount-calc').value = event.target.getAttribute('data-amount');
        }
    }
}

function togglePercentageRadios(disable) {
    document.querySelectorAll('input[type=radio][name=percentage]').forEach(radio => {
        radio.disabled = disable;
    });
}


document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('offer-link-fees').addEventListener('change', onOfferChange);
});

async function onOfferChange() {
    const dropdown = document.getElementById('offer-link-fees');
    const selectedValues = dropdown.value.split(',');
    if (selectedValues.length !== 3) {
        togglePercentageRadios(true);
        return;
    }
    togglePercentageRadios(false);
    const case_id = dropdown.getAttribute('data-case-id');
    const client_id = dropdown.getAttribute('data-client-id');
    // remove space from the selectedValues
    selectedValues.forEach((value, index) => {
        selectedValues[index] = value.trim();
        if (selectedValues[index] === '') {
            selectedValues[index] = -1;
        }
    });

    if (selectedValues.length === 3) {
        const [entityId, insuranceId, entityType] = selectedValues;

        // Construct the URL using window.location.origin and the path
        const apiUrl = `${window.location.origin}/30/getLatestOffer/${client_id}/${case_id}/${entityId}/${insuranceId}/${entityType}`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json(); // Assuming the API returns JSON

            if (data.success === false) {
                alert(data.message);
                return;
            }
            updatePercentageLabels(data.offer.amount);
            // updateAmountField(data.offer.amount);

        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        }
    }
}

function updatePercentageLabels(amount) {
    const percentageInputs = document.querySelectorAll('.common-percentage-values input[type="radio"][name="percentage"]');

    percentageInputs.forEach((input, index) => {
        // Calculate the amount based on the percentage value of the input
        //return if input is text
        if (input.id === 'custom') {
            const custom_input = document.getElementById('custom_percentage');
            custom_input.setAttribute('data-amount', amount);
            return;
        }

        const percent = parseInt(input.value);

        const calculatedAmount = (amount * (percent / 100)).toFixed(2);

        // Update the radio button value
        input.setAttribute('data-amount', calculatedAmount);

        // Update the text in the next sibling div (amount-value)
        const amountDiv = input.parentElement.nextElementSibling;
        if (amountDiv) {
            amountDiv.textContent = `$ ${calculatedAmount}`;
        }
    });
}


function updateAmountField(amount) {
    const amountField = document.getElementById('amount-calc');
    amountField.value = amount;
}


function changeAmount(event) {
    const value = parseFloat(event.value)
    document.getElementById('amount-calc').value = value / 100 * event.getAttribute('data-amount')
}
