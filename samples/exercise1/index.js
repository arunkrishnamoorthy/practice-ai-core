import { OrchestrationClient } from "@sap-ai-sdk/orchestration";
import { configDotenv } from "dotenv";

// load the environment variable
configDotenv();

// initialize orchestration client
const orchestrationClient = new OrchestrationClient({
    llm: {
        model_name: 'gpt-4o' // model to be used
    },
    templating: { // prompt template
        template:[{ role: 'user', content: 'Answer the question:  {{?question}}'}]
    }
});

// Create a chat message
const response = await orchestrationClient.chatCompletion({
    inputParams: {
        question: 'Why is the Phrase "Hello World!" so famous?'
    }
});

// Read and log the content
console.log(response.getContent());

