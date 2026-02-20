import axios from "axios";
import fs from 'fs';
import path from "path";
import FormData from "form-data";

class Model {
    constructor(env) {
        this.env = env;
        this.timeMap = {
            "general waste": parseInt(1),
            "plastic bottle": parseInt(5),
            "paper": parseInt(2)
        }
        this.wasteCodeMap = {
            "general waste": "GWST",
            "plastic bottle": "PBTL",
            "paper": "PPRS"
        }
        this.baseUrl = `https://${this.env.MODEL_HOST}/${this.env.MODEL_VERSION}/model`;
        this.client = axios.create({
            baseURL: this.baseUrl,
        })
    }

    async checkModel() {
        const result = await this.client.get(
            "/",
            {
                headers: {
                    "api-key": this.env.MODEL_APIKEY 
                }
            }
        )
        return result.data;
    }

    async predict(){
        const filePath = path.join(process.cwd(), "src/captures/test_capture.jpg");
        const formData = new FormData();
        formData.append("file", fs.createReadStream(filePath));

        const result = await this.client.post(
            "/predict",
            formData,
            {
                headers: {
                    "api-key": this.env.MODEL_APIKEY,
                    ...formData.getHeaders()
                }
            }
        );
        return result.data.prediction;
    }

    async earnedTime() {
        const prediction = await this.predict();
        if (!prediction[0]) {
            return { category: "general waste", wasteCode: "GWST", earnedTime: 60}
        };

        const category = prediction[0].class_name?.toLowerCase();
        const timeEarned = this.timeMap[category] ?? 0;

        return { 
            category: category,
            wasteCode: this.wasteCodeMap[category],
            earnedTime: timeEarned * 60
        };
    }
}

export default Model;
