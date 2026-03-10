export function validateForm(nameInput, consentCheckbox, studentIdInput, submitBtn) {
    const isNameValid = nameInput.value.trim() !== '';
    const isStudentIDValid = studentIdInput.value.trim() !== '';
    const isConsentChecked = consentCheckbox.checked;
    submitBtn.disabled = !(isNameValid && isStudentIDValid && isConsentChecked);
}