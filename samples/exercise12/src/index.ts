import { configDotenv } from "dotenv"
import { OrchestrationClient } from "@sap-ai-sdk/orchestration"


configDotenv()

const client = new OrchestrationClient({
    llm: {
        model_name: "gpt-4o"
    }
})

const controller = new AbortController();
const response = await client.stream({
    messages: [
        {
            role: 'user',
            content: 'Give a long history of {{?country}}'
        }
    ],
    inputParams: {
        country: 'India'
    },
}, controller, { // also control the chunk settings
    llm: { 
        include_usage: false
    },
    global: { chunk_size : 10 },
    outputFiltering : { overlap : 200 }
})

setTimeout(() => {
    controller.abort()
},1000)

for await ( const chunk of response.stream.toContentStream()) {
    console.log(chunk)
}

console.log('Finish Reason', response.getFinishReason())
console.log('Token Usage', response.getFinishReason())