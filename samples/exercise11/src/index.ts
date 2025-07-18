import { configDotenv } from "dotenv"
import { OrchestrationClient } from "@sap-ai-sdk/orchestration"

configDotenv()

const client = new OrchestrationClient({
    llm: {
        model_name : 'gpt-4o'
    }
})

const response = await client.stream({
    messages: [
        {
            role: 'user',
            content: 'What is the captial of {{?country}}, write an long essay about it'
        }
    ],
    inputParams: {
        country: 'France'
    }
})


// for await( const chunk of response.stream) {
//     console.log(JSON.stringify(chunk))
// }


for await(const chunk of response.stream.toContentStream()) { // stream at chunk level
    console.log(chunk)
}
console.log('Finish Reason', response.getFinishReason())
console.log('Token Usage', response.getTokenUsage())

