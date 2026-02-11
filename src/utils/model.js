import axios from "axios";
import fs from 'fs';
import path from "path";
import FormData from "form-data";

async function getPrediction(env) {
    console.log(`https://${env.MODEL_HOST}/${env.MODEL_VERSION}/model/predict`)
    const filePath = path.join(process.cwd(), "src/captures/test_capture.jpg");

    const formData = new FormData();

    formData.append("file", fs.createReadStream(filePath));

    const result = await axios.post(
        `https://${process.env.MODEL_HOST}/${process.env.MODEL_VERSION}/model/predict`,
        formData,
        {
            headers: {
                ...formData.getHeaders(),
                "api-key": process.env.MODEL_APIKEY

            }
        }
    )

    console.log(result.data);
}

class Model {
    constructor(env) {
        this.baseUrl = `https://${env.host}`;
        this.client = axios.create({
            baseURL: this.baseUrl,
            timeout: 10000,
        })
    }

    async checkModel() {
        const result = await this.client.get(
            "/",
            {
                headers: {
                    "api-key": env.MODEL_APIKEY 
                }
            }
        )
    }

    async predict(){

    }
}

export default Model;