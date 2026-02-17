import axios from "axios";
import runSpawnSync from "./runSpawnSync.js";

export function checkInternet() {
    try {
        const result = runSpawnSync('ping', ['-c', '1', '8.8.8.8'], true);
        console.log("DEBUG", result)
        return result.status === 0;
    } catch (err) {
        console.error("[ERROR] checkInternet", err);
        return false;
    }
}

export async function checkModel() {
    if (!checkInternet()) return false;
    const result = await axios.get(
        `https://${process.env.MODEL_HOST}/${process.env.MODEL_VERSION}/model/`,
        {
            headers: {
                "Content-Type": "application/json",
                "api-key": process.env.MODEL_APIKEY
            }
        }
    )
    
    if (result.data) return true;
    return false;
}