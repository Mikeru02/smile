// All events in the captive portal will be handled here.
import Logo from "/icons/bgimg.svg";

export default async function Events() {
    document.body.style.backgroundImage = `url('${Logo}')`
    const submitBtn = document.getElementById("submit-credential");
    submitBtn.addEventListener("click", function(){
        // TODO: Add the user to the drop clients to avoid duplication

        // TODO: Redirect the user to the page of receiving time/rewards
        window.app.pushRoute("/received");
    })
}


