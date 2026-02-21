export default function Events() {
    const backbtn = document.getElementById('back-button');
    if (backbtn) {
        backbtn.addEventListener('click', function() {
            window.app.pushRoute('/')
        })
    }
}