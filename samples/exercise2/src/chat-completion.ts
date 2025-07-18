import { LlmModuleConfig, OrchestrationClient, OrchestrationModuleConfig } from "@sap-ai-sdk/orchestration"
import { configDotenv } from "dotenv"

configDotenv()
const config : OrchestrationModuleConfig = {
    llm: {
        model_name: "gpt-4o",
        model_params: {
            max_tokens: 50
        }
    }
}

// Using LLM Config module to configure llm
const llm: LlmModuleConfig = {
    model_name: 'gpt-4o',
    model_version: '2024-08-06',
    model_params: {
        max_tokens: 50,
        temperature: 0.1
    }
}

// const orchestrationClient = new OrchestrationClient(config)
// const orchestrationClient = new OrchestrationClient({ llm })
const orchestrationClient = new OrchestrationClient({
    llm,
    templating: {
        template: [
            { role: 'user', content: 'What is the capital of  {{?country}}' }
        ]
    }
})

// const response = await orchestrationClient.chatCompletion({
//     messages: [
//         {
//             role: "user",
//             content: "Hello World! why is this phrase so famous?"
//         }
//     ]
// })

// const response = await orchestrationClient.chatCompletion({
//     inputParams: {
//         country: 'France'   
//     }
// })

const response = await orchestrationClient.chatCompletion({
    messages: [{
        role: 'user', content: 'What is the capital of {{?country}}'
    }],
    inputParams: {
        country: 'India'
    }
})


console.log(response.getContent())
console.log('Finish reason:', response.getFinishReason())
console.log('Tokens Usage', response.getTokenUsage())
console.log('Get All messages', response.getAllMessages())
console.log('Get Assistant Message',response.getAssistantMessage())
console.log('Get tool calls', response.getToolCalls())
console.log('Get refusal', response.getRefusal())