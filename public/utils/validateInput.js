export function validateForm(nameInput, consentCheckbox, submitBtn) {
    const isNameValid = nameInput.value.trim() !== '';
    const isConsentChecked = consentCheckbox.checked;
    submitBtn.disabled = !(isNameValid && isConsentChecked);
}