import axios from "axios";
import runSpawnSync from "./runSpawnSync.js";

let lastCheck = 0;
let lastStatus = false;
const checkInterval = 5000;

export function checkInternet() {
    const now = Date.now();

    if (now - lastCheck < checkInterval) {
        return lastStatus;
    }

    try {
        const result = runSpawnSync('ping', ['-c', '1', '-W', '2', '8.8.8.8'], true);
        console.log(result.status, result.stdout);
        console.log(result);
        lastStatus = result.status === 0;
        lastCheck = Date.now();
        return lastStatus;
    } catch (err) {
        console.error("[ERROR] checkInternet", err);
        lastCheck = Date.now();
        lastStatus = false;
        return lastStatus;
    }
}

export async function checkModel() {
    if (!checkInternet()) return false;
    const result = await axios.get(
        `http://${process.env.MODEL_LOCALHOST}:${process.env.MODEL_PORT}/${process.env.MODEL_VERSION}/model/`,
        {
            headers: {
                "Content-Type": "application/json",
                "apikey": process.env.MODEL_APIKEY
            }
        }
    )
    
    if (result.data) return true;
    return false;
}