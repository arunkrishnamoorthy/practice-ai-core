// Explains the usage of message history 
// Message history provide memory to model,on the previous executions. 
import { configDotenv } from "dotenv";
import { OrchestrationClient } from "@sap-ai-sdk/orchestration";

configDotenv()

const client = new OrchestrationClient({
    llm: {
        model_name : 'gpt-4o'
    }
})

const response = await client.chatCompletion({
    messages: [
        {
            role: 'user',
            content: 'What is my name?'
        }
    ],
    messagesHistory: [
        {
            role: 'system',
            content: 'You are a helpful assistant who remembers all details the user shares with you.'
        },
        {
            role: 'user',
            content: 'Hi! Im Bob'
        },
        {
            role: 'assistant',
            content: "Hi Bob, nice to meet you! I'm an AI assistant. I'll remember that your name is Bob as we continue our conversation."
        }
    ]
})

console.log(response.getContent())
