document.addEventListener('DOMContentLoaded', function () {
    addPikaday('addCostModal', 'date')
    addPikaday('editCostModal', 'date')
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
        field: dateField,
        format: 'M/DD/YYYY'
    });
}
