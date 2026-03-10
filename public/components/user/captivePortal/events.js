import axios from "axios";
import checkToken from "../../../utils/checkToken.js";
import { populateSelect } from "../../../utils/populateSelect.js";
import { SELECT_CONFIG } from "../../../config/selectConfig.js";

export default async function Events() {
    const baseUrl = `http://${import.meta.env.VITE_SRC_HOST}:${import.meta.env.VITE_SRC_PORT}`;
    const validToken = await checkToken(localStorage.getItem('token'));

    if (validToken) {
        window.app.pushRoute('/portal');
    }

    const logo = document.getElementById('logo');
    if (logo) {
        logo.addEventListener('dblclick', function() {
            window.app.pushRoute('/admin/login');
        });
    }

    const courseSelect = document.getElementById('course');
    const yearSelect = document.getElementById('yearlvl');
    const studentIdInput = document.getElementById('student-id');
    const nameInput = document.getElementById('name');
    const consentCheckbox = document.getElementById('consent');
    const submitBtn = document.getElementById("submit-credential");

    // Populate courses
    if (courseSelect) {
        populateSelect(courseSelect, SELECT_CONFIG.course, "name");

        // When a course is selected, populate year levels
        courseSelect.addEventListener("change", () => {
            const selectedCourse = SELECT_CONFIG.course.find(c => c.name === courseSelect.value);
            if (!selectedCourse) return;

            const yearConfig = SELECT_CONFIG.yearlvl.find(y => y.type === selectedCourse.type);
            if (!yearConfig) return;

            const levels = yearConfig.levels.map(l => ({ name: l }));
            populateSelect(yearSelect, levels, "name");

            // Update button state whenever course/year changes
            updateSubmitButtonState();
        });

        // Trigger change initially to set year level for default course
        courseSelect.dispatchEvent(new Event("change"));
    }

    // Function to enable/disable submit button based on all inputs
    function updateSubmitButtonState() {
        const studentIdVal = studentIdInput.value.trim();
        const nameVal = nameInput.value.trim();
        const consentChecked = consentCheckbox.checked;
        const courseVal = courseSelect.value;
        const yearVal = yearSelect.value;

        submitBtn.disabled = !(studentIdVal && nameVal && consentChecked && courseVal && yearVal);
    }

    // Initial check
    updateSubmitButtonState();

    // Add input/change listeners for real-time validation
    studentIdInput.addEventListener('input', updateSubmitButtonState);
    nameInput.addEventListener('input', updateSubmitButtonState);
    consentCheckbox.addEventListener('change', updateSubmitButtonState);
    courseSelect.addEventListener('change', updateSubmitButtonState);
    yearSelect.addEventListener('change', updateSubmitButtonState);

    // Submit handler
    if (submitBtn) {
        submitBtn.addEventListener("click", async function() {
            // Final validation before sending
            if (submitBtn.disabled) return; // safeguard

            const studentIdVal = studentIdInput.value.trim();
            const nameVal = nameInput.value.trim();

            try {
                const response = await axios.post(
                    `${baseUrl}/api/v1/client/`,
                    {
                        student_id: studentIdVal,
                        name: nameVal,
                        course: courseSelect.value,
                        year_level: yearSelect.value
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "apikey": import.meta.env.VITE_SRC_KEY
                        }
                    }
                );
                localStorage.setItem('token', response.data.data.token);
                window.app.pushRoute("/portal");
            } catch (err) {
                if (err.response && err.response.data && err.response.data.message) {
                    alert(err.response.data.message);
                } else {
                    alert("An unexpected error occurred. Please try again.");
                    console.error(err);
                }
            }
        });
    }
}