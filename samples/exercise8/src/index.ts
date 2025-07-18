// Example of Data Masking. 
// Mask Sensitive information in the prompt while providing necessary context to the model 
// We will be using the SAP Data Privacy Integration

import { configDotenv } from "dotenv"
import { OrchestrationClient, MaskingModuleConfig, MaskingProviderConfig, buildDpiMaskingProvider } from "@sap-ai-sdk/orchestration"


configDotenv()

const maskingProviders: MaskingProviderConfig[] = [
    {
        type: 'sap_data_privacy_integration',
        method: 'anonymization',
        allowlist: ['SAP'],
        entities: [
            {
                type: 'profile-email'
            },
            {
                type: 'profile-org'
            },
            {
                type: 'profile-person'
            }
        ]
    }
]

// using utility function
const maskingData = buildDpiMaskingProvider({
    method: 'anonymization',
    entities: ['profile-email', 'profile-person', 'profile-org'],
    allowlist: ['SAP']
})

const maskingConfig: MaskingModuleConfig = {
    masking_providers: [maskingData]
}


const client = new OrchestrationClient({
    llm: {
        model_name : "gpt-4o"
    },
    masking: maskingConfig
})

const response = await client.chatCompletion({
    messages: [
        {
            role: 'user',
            content: 'Please write an email to {{?user}} ({{?email}}) about the amazing capabilities of AI Core'
        }
    ],
    inputParams: {
        user: 'Arun Krishnamoorthy',
        email: 'arun.krishnamoorthy@aarini.com'
    }
})

console.log(response.getContent())