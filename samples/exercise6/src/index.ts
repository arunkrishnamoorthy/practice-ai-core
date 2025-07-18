import { configDotenv } from "dotenv";
import { OrchestrationClient } from "@sap-ai-sdk/orchestration";
import fs from 'fs';
import path from "path";
import { dirname } from "path";

configDotenv()

const client = new OrchestrationClient({
    llm: {
        model_name : 'gpt-4o'
    }
})

// image recoginition using computer vision. 
// image can be an public url / base64 string 

const IMAGE_PUBLIC_URL = 'https://miro.medium.com/v2/resize:fit:720/format:webp/1*V8CHfxxu5sKt4abDiGY1-g.jpeg'
const IMAGE_LOCAL_URL = '/assets/ai-image.jpg' // does not accept local. the valid path has to be http or https

// So we need to convert the local assests to Base 64 and then pass the image content to the model
const imagePath = path.resolve(process.cwd(), 'src/assets', 'ai-image.jpg');
const imageBuffer = fs.readFileSync(imagePath);
const base64Image = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;

const response = await client.chatCompletion({
    messages: [
        {
            role: 'user',
            content: [
                {
                    type: 'text',
                    text: 'What is the content of this image'
                },
                {
                    type: 'image_url',                    
                    image_url: {
                        url: base64Image
                    }
                }
            ]
        }
    ]
})

console.log(response.getContent())