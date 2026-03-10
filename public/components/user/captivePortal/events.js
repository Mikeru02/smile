import axios from "axios";
import styles from "./component.module.css";
import checkToken from "../../../utils/checkToken.js";
import { validateForm } from "../../../utils/validateInput.js";
import { populateSelect } from "../../../utils/populateSelect.js";
import { SELECT_CONFIG } from "../../../config/selectConfig.js";

export default async function Events() {

    const baseUrl = `http://${import.meta.env.VITE_SRC_HOST}:${import.meta.env.VITE_SRC_PORT}`;
    const validToken = await checkToken(localStorage.getItem('token'));

    if (validToken) {
        window.app.pushRoute('/portal');
        return;
    }

    /* ---------------- LOGO SECRET LOGIN ---------------- */

    const logo = document.getElementById('logo');
    if (logo) {
        logo.addEventListener('dblclick', () => {
            window.app.pushRoute('/admin/login');
        });
    }

    /* ---------------- FORM ELEMENTS ---------------- */

    const nameInput = document.getElementById('name');
    const consentCheckbox = document.getElementById('consent');
    const submitBtn = document.getElementById("submit-credential");

    const courseSelect = document.getElementById('course');
    const yearSelect = document.getElementById('yearlvl');

    const inputFields = nameInput.parentElement;

    /* ---------------- COURSE SELECT ---------------- */

    populateSelect(courseSelect, SELECT_CONFIG.course, "name");

    courseSelect.addEventListener("change", () => {

        const selectedCourse = SELECT_CONFIG.course.find(
            c => c.name === courseSelect.value
        );

        if (!selectedCourse) return;

        const yearConfig = SELECT_CONFIG.yearlvl.find(
            y => y.type === selectedCourse.type
        );

        if (!yearConfig) return;

        const levels = yearConfig.levels.map(level => ({ name: level }));

        populateSelect(yearSelect, levels, "name");

    });

    courseSelect.dispatchEvent(new Event("change"));

    /* ---------------- RADIO STUDENT / GUEST ---------------- */

    const radios = document.querySelectorAll('input[name="radio"]');

    radios.forEach(radio => {

        radio.addEventListener("change", (e) => {

            const existingStudentId = document.getElementById('student-id');

            if (e.target.value === "student") {

                if (!existingStudentId) {

                    const label = document.createElement("label");
                    label.setAttribute("for", "student-id");
                    label.textContent = "Student ID";

                    const input = document.createElement("input");
                    input.type = "text";
                    input.id = "student-id";
                    input.name = "student-id";
                    input.placeholder = "Enter Student ID";
                    input.autocomplete = "off";

                    inputFields.insertBefore(label, nameInput);
                    inputFields.insertBefore(input, nameInput);

                    input.addEventListener("input", () => {
                        validateForm(
                            nameInput,
                            consentCheckbox,
                            document.getElementById("student-id"),
                            submitBtn
                        );
                    });

                }

            }

            if (e.target.value === "guest") {

                if (existingStudentId) {

                    const label = existingStudentId.previousElementSibling;

                    if (label) label.remove();

                    existingStudentId.remove();

                }

            }

            validateForm(
                nameInput,
                consentCheckbox,
                document.getElementById("student-id"),
                submitBtn
            );

        });

    });

    /* ---------------- VALIDATION ---------------- */

    validateForm(
        nameInput,
        consentCheckbox,
        document.getElementById("student-id"),
        submitBtn
    );

    nameInput.addEventListener("input", () => {
        validateForm(
            nameInput,
            consentCheckbox,
            document.getElementById("student-id"),
            submitBtn
        );
    });

    consentCheckbox.addEventListener("change", () => {
        validateForm(
            nameInput,
            consentCheckbox,
            document.getElementById("student-id"),
            submitBtn
        );
    });

    /* ---------------- SUBMIT ---------------- */

    submitBtn.addEventListener("click", async () => {

        try {

            const response = await axios.post(

                `${baseUrl}/api/v1/client/`,

                {
                    student_id: document.getElementById("student-id")?.value || null,
                    name: nameInput.value,
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

            localStorage.setItem("token", response.data.data.token);

            window.app.pushRoute("/portal");

        } catch (err) {

            if (err.response?.data?.message) {

                alert(err.response.data.message);

            } else {

                alert("An unexpected error occurred. Please try again.");
                console.error(err);

            }

        }

    });

}