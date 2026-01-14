import  BGIMG from '/icons/bgimg.svg';

export default async function Events() {
    document.body.style.backgroundImage = `url('${BGIMG}')`;

    const modal = document.getElementById('modal');
    const dropBtn = document.getElementById('start-drop');
    dropBtn.addEventListener('click', function() {
        modal.style.display = 'block';
    })
    
}