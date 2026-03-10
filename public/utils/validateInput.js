export function validateForm(nameInput, consentCheckbox, studentIdInput, submitBtn) {
    const isNameValid = nameInput.value.trim() !== '';
    const isStudentIDValid = studentIdInput.value.trim() !== '';
    const studentIdPattern = /^\d{2}-\d{4}$/
    const isValidId = studentIdPattern.test(studentIdInput.value);
    const isConsentChecked = consentCheckbox.checked;
    submitBtn.disabled = !(isNameValid && isStudentIDValid && isValidId && isConsentChecked);
}