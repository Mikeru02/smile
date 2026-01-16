// All events in the captive portal will be handled here.
import axios from "axios";
import checkToken from "../../../utils/checkToken.js";
import BGIMG from "/icons/bgimg.svg";

export default async function Events() {
    document.body.style.backgroundImage = `url('${BGIMG}')`;
    
    window.app.pushRoute = checkToken(localStorage.getItem('token'));

    const submitBtn = document.getElementById("submit-credential");
    submitBtn.addEventListener("click", async function(){
        // TODO: Add the user to the drop clients to avoid duplication
        const response = await axios.post(`http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/${import.meta.env.VITE_API_ROUTE_VERSION}/client/`, {
            name: document.getElementById('name').value,
            course: document.getElementById('course').value,
            yearlevel: document.getElementById('yearlvl').value
        }, {
            headers: {
                "Content-Type": "application/json",
                "apikey": import.meta.env.VITE_API_KEY
            }
        });
    
        // Set Token to the local storage
        localStorage.setItem('token', response.data.data.token);

        // TODO: Redirect the user to the page of receiving time/rewards
        window.app.pushRoute("/portal");
    })
}


