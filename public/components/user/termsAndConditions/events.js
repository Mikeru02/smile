export default async function Events() {
    // No specific events needed for terms and conditions page
    // The back button uses window.history.back() directly in the HTML
    document.getElementById("back-button").addEventListener("click", () => {
        window.app.pushRoute('/')
    });
}
