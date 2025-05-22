function addSpaceAfterDollarSign(element) {
    element.childNodes.forEach(node => {
        if (node.nodeType === 3) { // text node
            node.nodeValue = node.nodeValue.replace(/(\$)(?=\S)/g, "$1 ");
        } else if (node.nodeType === 1) { // element node
            addSpaceAfterDollarSign(node); // recursive call for child elements
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    const body = document.body;
    addSpaceAfterDollarSign(body);
});

function showTrustLedgerModal(id) {
    let modal = document.getElementById(id);
    let bsModal = new bootstrap.Modal(modal);
    bsModal.show();
}
