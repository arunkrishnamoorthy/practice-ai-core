import { configDotenv } from "dotenv";
import { OrchestrationClient, buildTranslationConfig } from "@sap-ai-sdk/orchestration";


configDotenv()
const translationConfig = buildTranslationConfig({
    sourceLanguage: 'en-US',
    targetLanguage: 'de-DE'
})

const client = new OrchestrationClient({
    llm: {
        model_name: 'gpt-4o'
    },
    inputTranslation: translationConfig,
    outputTranslation: translationConfig
})

const response = await client.chatCompletion({
    messages: [
        {
            role:'user',
            content: 'Write an abstract for thriller playing at SAP Headquaters'
        }
    ]
})

console.log(response.getContent())

// Returns the response in dutch - because i asked so.