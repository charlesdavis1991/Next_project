document.addEventListener('DOMContentLoaded', function () {
    addPikaday('add-offer-modal', 'mediation-date')
    addPikaday('add-offer-modal', 'settlement-conference-date')
    addPikaday('add-offer-modal', 'date-sent')
    addPikaday('add-offer-modal', 'expiration-date')
    addPikaday('add-offer-modal', 'date')

    addPikaday('edit-offer-modal', 'mediation-date')
    addPikaday('edit-offer-modal', 'settlement-conference-date')
    addPikaday('edit-offer-modal', 'date-sent')
    addPikaday('edit-offer-modal', 'expiration-date')
    addPikaday('edit-offer-modal', 'date')

    addPikaday('costs', 'date')

    addPikaday('loans', 'application-date')
    addPikaday('loans', 'date-verified')
});

function addPikaday(modalId, fieldId) {
    let modal = document.getElementById(modalId);
    if (!modal) {
        return;
    }
    let dateField = modal.querySelector(`#${fieldId}`);
    if (!dateField) {
        return;
    }
    if (dateField.tagName === 'INPUT') {
        dateField.placeholder = 'mm/dd/yyyy'
    }
    let picker = new Pikaday({
        field: dateField, format: 'M/DD/YYYY'
    });
    if (fieldId === 'expiration-date') {
        const currentDate = new Date();
        const expirationDate = new Date(currentDate);
        expirationDate.setDate(currentDate.getDate() + 30);
        picker.setDate(expirationDate, true);
    } else {
        picker.setDate(new Date(), true);
    }
}
