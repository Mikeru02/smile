import axios from "axios";
import checkToken from "../../../utils/checkToken.js";
import { validateForm } from "../../../utils/validateInput.js";
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
        logo.addEventListener('dblclick', () => window.app.pushRoute('/admin/login'));
    }

    const studentIdLabel = document.getElementById('studentIdLabel');
    const courseLabel = document.getElementById('course-label');
    const yearlevelLabel = document.getElementById('yearlevel-label');

    const studentIdInput = document.getElementById('student-id');
    const courseSelect = document.getElementById('course');
    const yearSelect = document.getElementById('yearlvl');
    const nameInput = document.getElementById('name');
    const consentCheckbox = document.getElementById('consent');
    const submitBtn = document.getElementById("submit-credential");

    // Populate courses
    if (courseSelect) {
        populateSelect(courseSelect, SELECT_CONFIG.course, "name");
        courseSelect.addEventListener("change", () => {
            const selectedCourse = SELECT_CONFIG.course.find(c => c.name === courseSelect.value);
            if (!selectedCourse) return;
            const yearConfig = SELECT_CONFIG.yearlvl.find(y => y.type === selectedCourse.type);
            if (!yearConfig) return;
            populateSelect(yearSelect, yearConfig.levels.map(l => ({ name: l })), "name");
        });
        courseSelect.dispatchEvent(new Event("change"));
    }

    // Handle radio buttons
    const radios = document.querySelectorAll('input[name="radio"]');
    radios.forEach(radio => {
        radio.addEventListener("change", (e) => {
            const isStudent = e.target.value === 'student';
            studentIdLabel.style.display = isStudent ? "block" : "none";
            studentIdInput.style.display = isStudent ? "block" : "none";
            courseLabel.style.display = isStudent ? "block" : "none";
            courseSelect.style.display = isStudent ? "block" : "none";
            yearlevelLabel.style.display = isStudent ? "block" : "none";
            yearSelect.style.display = isStudent ? "block" : "none";

            validateForm(nameInput, consentCheckbox, studentIdInput, courseSelect, yearSelect, submitBtn);
        });
    });

    // Add input/change listeners for validation
    [nameInput, consentCheckbox, studentIdInput, courseSelect, yearSelect].forEach(el => {
        if (el) el.addEventListener(el.tagName === "INPUT" && el.type === "checkbox" ? 'change' : 'input', () => {
            validateForm(nameInput, consentCheckbox, studentIdInput, courseSelect, yearSelect, submitBtn);
        });
    });

    // Initial validation
    validateForm(nameInput, consentCheckbox, studentIdInput, courseSelect, yearSelect, submitBtn);

    // Submit
    if (submitBtn) {
        submitBtn.addEventListener("click", async () => {
            try {
                const payload = { name: nameInput.value };
                if (studentIdInput.offsetParent !== null) payload.student_id = studentIdInput.value;
                if (courseSelect.offsetParent !== null) payload.course = courseSelect.value;
                if (yearSelect.offsetParent !== null) payload.year_level = yearSelect.value;

                const response = await axios.post(`${baseUrl}/api/v1/client/`, payload, {
                    headers: { "Content-Type": "application/json", "apikey": import.meta.env.VITE_SRC_KEY }
                });

                localStorage.setItem('token', response.data.data.token);
                window.app.pushRoute("/portal");
            } catch (err) {
                alert(err?.response?.data?.message || "An unexpected error occurred.");
                console.error(err);
            }
        });
    }
}