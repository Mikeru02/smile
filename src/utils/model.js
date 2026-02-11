import axios from "axios";
import fs from 'fs';
import path from "path";
import FormData from "form-data";

class Model {
    constructor(env) {
        this.env = env;
        this.timeMap = {
            "general waste": parseInt(this.env.TIME_GENERAL_WASTE || 1),
            "plastic bottle": parseInt(this.env.TIME_PLASTIC_BOTTLE || 5),
            "paper": parseInt(this.env.TIME_PAPER || 2)
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
        
        return result.data.predictions[0];
    }

    async earnedTime() {
        const prediction = await this.predict();

        if (!prediction) return 0;

        const category = prediction.class_name.toLowerCase();
        const timeEarned = this.timeMap[category] ?? 0;

        return timeEarned;
    }
}

export default Model;