import axios from "axios";
import checkToken from "../../../utils/checkToken.js";
import { validateForm } from "../../../utils/validateInput.js";
import { populateSelect } from "../../../utils/populateSelect.js";
import { SELECT_CONFIG } from "../../../config/selectConfig.js";

export default async function Events() {
    const baseUrl = `http://${import.meta.env.VITE_SRC_HOST}:${import.meta.env.VITE_SRC_PORT}`
    const validToken = await checkToken(localStorage.getItem('token'));

    if (validToken) {
        window.app.pushRoute('/portal');
    }

    const logo = document.getElementById('logo');
    if (logo) {
        logo.addEventListener('dblclick', function() {
            window.app.pushRoute('/admin/login');
        })
    }

    const courseSelect = document.getElementById('course');
    const yearSelect = document.getElementById('yearlvl');

    // Populate courses
    if (courseSelect) {
        populateSelect(courseSelect, SELECT_CONFIG.course, "name");
    

        // When a course is selected, populate year levels
        courseSelect.addEventListener("change", () => {
            const selectedCourse = SELECT_CONFIG.course.find(c => c.name === courseSelect.value);
            if (!selectedCourse) return;

            // Find year levels for the type
            const yearConfig = SELECT_CONFIG.yearlvl.find(y => y.type === selectedCourse.type);
            if (!yearConfig) return;

            // Convert numbers to objects with `name` for populateSelect
            const levels = yearConfig.levels.map(l => ({ name: l }));
            populateSelect(yearSelect, levels, "name");
        });

        // Trigger change initially to set yearlevel for default course
        courseSelect.dispatchEvent(new Event("change"));

        const submitBtn = document.getElementById("submit-credential");
        const nameInput = document.getElementById('name');
        const consentCheckbox = document.getElementById('consent');
        
        // Initial validation to set button state
        validateForm(nameInput, consentCheckbox, submitBtn);
        
        // Add event listeners for validation
        nameInput.addEventListener('input', () => validateForm(nameInput, consentCheckbox, submitBtn));
        consentCheckbox.addEventListener('change', () => validateForm(nameInput, consentCheckbox, submitBtn));
    
    
        if (submitBtn) {
            submitBtn.addEventListener("click", async function() {
                const studentIdInput = document.getElementById('student-id');
                const nameInput = document.getElementById('name');
                const consentCheckbox = document.getElementById('consent');

                // Trimmed values
                const studentIdVal = studentIdInput.value.trim();
                const nameVal = nameInput.value.trim();
                const consentChecked = consentCheckbox.checked;

                // Simple input validation before sending
                if (!studentIdVal) {
                    alert("Student ID is required.");
                    studentIdInput.focus();
                    return;
                }

                if (!nameVal) {
                    alert("Name is required.");
                    nameInput.focus();
                    return;
                }

                if (!consentChecked) {
                    alert("You must agree to the consent.");
                    consentCheckbox.focus();
                    return;
                }

                // Optional: validate course/year
                if (!courseSelect.value) {
                    alert("Please select a course.");
                    courseSelect.focus();
                    return;
                }

                if (!yearSelect.value) {
                    alert("Please select a year level.");
                    yearSelect.focus();
                    return;
                }

                // All validations passed, proceed with Axios request
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
}