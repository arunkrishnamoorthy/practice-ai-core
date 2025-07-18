// Content filtering 
// the module supports filtering by 
// Azure Content Safety
// Llama Guard 3

import { configDotenv } from "dotenv"
import { FilteringModuleConfig, OrchestrationClient,OrchestrationModuleConfig,InputFilteringConfig,OutputFilterConfig, buildAzureContentSafetyFilter } from "@sap-ai-sdk/orchestration"

configDotenv()


const filter:FilteringModuleConfig = {
    input: { // Type - InputFilteringConfig
        filters: [{
            type: "azure_content_safety",
            config: {
                Hate:0,
                Sexual: 6,
                PromptShield: true
            }
        }]
    },
    output: { // Type - OutputFilterConfig
        filters: [
            {
                type: 'llama_guard_3_8b',
                config: {
                    child_exploitation: true,
                    hate: true
                }
            }
        ]
    }
}

// We can also use Azure Safety content filter. 
const azureFilter = buildAzureContentSafetyFilter({
    Hate: 'ALLOW_ALL',
    Sexual: 'ALLOW_SAFE',
    SelfHarm: "ALLOW_SAFE",
    Violence: 'ALLOW_SAFE'
})
const azureFilterConfig:FilteringModuleConfig = {
    input: {
        filters: [azureFilter]
    }
}


const client = new OrchestrationClient({
    llm: {
        model_name: "gpt-4o"
    },
    filtering: filter
})

const response = await client.chatCompletion({
    messages: [ 
        {
            role: 'user',
            content: 'I hate you'
        }
    ]
})


console.log(response.getContent())

// in the first filter, the Hate check is enabled.
// Should get an error message, Prompt violation

// when do you allow on Hate in the azure filter, the prompt voilation check will be skipped and the request will be sent to the model 
// and model responds