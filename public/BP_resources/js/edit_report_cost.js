async function getReportDetails(id) {
    const response = await fetch(`${window.location.origin}/30/get-reporting-agency/${id}`);
    const data = await response.json();
    console.log(data)
    return data;
}


const addReportCostBtn = document.getElementById('add-report-cost')
console.log(addReportCostBtn)

addReportCostBtn.addEventListener('click', async function (event) {
    event.preventDefault();
    event.stopPropagation()
    try {
        const element = document.getElementById('add-report-cost');
        const reportId = element.getAttribute('data-report-id');
        const report = await getReportDetails(reportId);
        const addReportCostModal = document.getElementById('addReportCostModal');
        const modalBody = addReportCostModal.querySelector('.modal-body');
        const modalTitle = addReportCostModal.querySelector('.modal-title');
        const modalForm = addReportCostModal.querySelector('form');
        modalTitle.innerHTML = `Input Cost for ${report.reporting_agency} for ${report.for_client.first_name} ${report.for_client.last_name}'s ${report.for_case.case_type.name}`;

        modalForm.querySelector('#date').value = getTodayDate();
        modalForm.querySelector('#payee').value = report.reporting_agency;
        modalForm.querySelector('#invoice_number').value = report.id;
        modalForm.querySelector('#amount').value = report.cost;
        modalForm.querySelector('#memo').value = `${report.id} - ${report.for_client.last_name}`;

        let bsModal = new bootstrap.Modal(addReportCostModal);
        bsModal.show();
        console.log(report)
    } catch (error) {
        console.error(error)
    }
})


function getTodayDate() {
    let currentDate = new Date();
    let day = String(currentDate.getDate()).padStart(2, '0');  // Ensure day is 2 digits
    let month = String(currentDate.getMonth() + 1).padStart(2, '0');  // Ensure month is 2 digits; +1 because months are 0-indexed in JS
    let year = currentDate.getFullYear();

    let formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
}