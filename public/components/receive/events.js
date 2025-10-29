// All events in the captive portal will be handled here.
import Logo from "/icons/bgimg.svg";

export default async function Events() {
    document.body.style.backgroundImage = `url('${Logo}')`
    const dropBTN = document.getElementById("start-drop");

    let startedDrop = false;

    async function checkTime() {
        const res = await fetch('/v1/splash/earned');
        const data = await res.json();

        if (data.minutes > 0) {
            document.getElementById("earned").innerText = `✅ You've earned ${data.minutes} minutes.`;
            document.getElementById("auth-btn").disabled = false;
        } else {
            if (!startedDrop) {
                document.getElementById("earned").innerText = "🕒 Press the button below and drop a bottle/plastic.";
            } else {
                document.getElementById("earned").innerText = "🕒 Waiting for drop input from Arduino...";
            }
            document.getElementById("auth-btn").disabled = true;
        }
    }

    async function startDrop() {
        startedDrop = true;
        await fetch('/v1/splash/start_drop', { method: 'POST' });
        document.getElementById("earned").innerText = "🕒 Waiting for drop input from Arduino...";
    }

    setInterval(checkTime, 2000);
    window.onload = checkTime;

    dropBTN.addEventListener("click", function(){
        startDrop();
    })
}