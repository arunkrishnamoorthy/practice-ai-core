// Grounding 
import { configDotenv } from "dotenv"
import { OrchestrationClient, GroundingModuleConfig } from "@sap-ai-sdk/orchestration"

configDotenv()

const groundingConfig:GroundingModuleConfig = {
    type: 'document_grounding_service',
    config: {
        input_params: ['groundingRequest'],
        output_param: 'groundingOutput',
        filters: [
            {
                id: 'FILTER_ID',
                data_repository_type: 'help.sap.com',
                data_repositories: ['REPOSITORY_ID']
            }
        ]
    }
}

const client = new OrchestrationClient({
    llm: {
        model_name: 'gpt-4o'
    },
    grounding: groundingConfig
})

const response = await client.chatCompletion({
    messages: [
        {
            role: 'user',
            content: 'User Question: {{?groundingRequest}} Context: {{?groundingOutput}}'
        }
    ],
    inputParams: {
        groundingRequest: 'Give me a short introduction of SAP AI Core'
    }
})

console.log(response.getContent())



