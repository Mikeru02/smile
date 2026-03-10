export function validateForm(nameInput, consentCheckbox, studentIdInput, courseSelect, yearSelect, submitBtn) {
    const isNameValid = nameInput.value.trim() !== '';
    const isConsentChecked = consentCheckbox.checked;

    let isStudentIDValid = true;
    let isValidId = true;
    let isCourseValid = true;
    let isYearValid = true;

    if (studentIdInput && studentIdInput.offsetParent !== null) {
        isStudentIDValid = studentIdInput.value.trim() !== '';
        isValidId = /^\d{2}-\d{4}$/.test(studentIdInput.value);
    }

    if (courseSelect && courseSelect.offsetParent !== null) isCourseValid = courseSelect.value !== '';
    if (yearSelect && yearSelect.offsetParent !== null) isYearValid = yearSelect.value !== '';

        console.log({
            name: isNameValid,
            consent: isConsentChecked,
            studentIdValid: isStudentIDValid,
            idPattern: isValidId,
            course: isCourseValid,
            year: isYearValid
        });
    submitBtn.disabled = !(isNameValid && isConsentChecked && isStudentIDValid && isValidId && isCourseValid && isYearValid);
};