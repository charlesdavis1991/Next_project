function submitSelectBankForm(checkbox, account_id) {
    document.getElementsByName('bank_account')[0].value = account_id
    checkbox.form.submit()
}