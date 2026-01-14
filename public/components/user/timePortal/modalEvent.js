export default function ModalEvent() {
    const modal = document.getElementById('modal');
    const exit = document.getElementById('exit');

    exit.addEventListener('click', function() {
        modal.style.display = 'none';
    })
}