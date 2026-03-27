export function validateLoginForm(usernameInput, passwordInput, submitBtn) {

    const isUsernameValid = usernameInput.value.trim() !== '';
    const isPasswordValid = passwordInput.value.trim() !== '';

    submitBtn.disabled = !(isUsernameValid && isPasswordValid);
};

export function validateSignupForm(usernameInput, passwordInput, confirmPasswordInput, consentInput, submitBtn) {
    const isUsernameValid = usernameInput.value.trim() !== '';
    const isPasswordValid = passwordInput.value.trim() !== '';
    const isConfirmPasswordValid = confirmPasswordInput.value.trim() !== '';
    const isConsentChecked = consentInput.checked;

    submitBtn.disabled = !(isUsernameValid && isPasswordValid && isConfirmPasswordValid && isConsentChecked);
}