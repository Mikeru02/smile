// All events in the captive portal will be handled here.
import axios from "axios";
import checkToken from "../../../utils/checkToken.js";
import BGIMG from "/icons/bgimg.svg";

export default async function Events() {
    document.body.style.backgroundImage = `url('${BGIMG}')`;
    
    const token = localStorage.getItem('token');
    const isValid = await checkToken(token);

    if (isValid) {
        window.app.pushRoute("/portal");
    } else {
        window.app.pushRoute("/");
    }


    const submitBtn = document.getElementById("submit-credential");
    submitBtn.addEventListener("click", async function(){
        // TODO: Add the user to the drop clients to avoid duplication
        const response = await axios.post(`http://${import.meta.env.VITE_SRC_HOST}:${import.meta.env.VITE_SRC_PORT}/api/${import.meta.env.VITE_SRC_ROUTE_VERSION}/client/`, {
            name: document.getElementById('name').value,
            course: document.getElementById('course').value,
            yearlevel: document.getElementById('yearlvl').value
        }, {
            headers: {
                "Content-Type": "application/json",
                "apikey": import.meta.env.VITE_SRC_KEY
            }
        });
    
        // Set Token to the local storage
        localStorage.setItem('token', response.data.data.token);
        window.alert("Token: ", response.data.data.token);
        // TODO: Redirect the user to the page of receiving time/rewards
        window.app.pushRoute("/portal");
    })
}


