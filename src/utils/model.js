import axios from "axios";
import fs from 'fs';
import path from "path";
import FormData from "form-data";
import dotenv from 'dotenv';
dotenv.config(); 

export default async function getPrediction() {
    console.log(`https://${process.env.MODEL_HOST}/${process.env.MODEL_VERSION}/model/predict`)
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

getPrediction();