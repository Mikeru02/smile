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
    let baseUrl;
    if (!checkInternet()) return false;
    if (process.env.MODEL_TYPE === 'deployed') {
        baseUrl = `https://${process.env.MODEL_HOST}/${process.env.MODEL_VERSION}/model`;
    }
    else {
        baseUrl = `http://${process.env.MODEL_LOCALHOST}:${process.env.MODEL_PORT}/${process.env.MODEL_VERSION}/model`;
    }

    const axiosClient = axios.create({
        baseURL: baseUrl,
        headers: {
            "Content-Type": "application/json",
            "apikey": process.env.MODEL_APIKEY
        }
    })
    const result = await axiosClient.get(
        `/`
    );
    
    if (result.data) return true;
    return false;
}