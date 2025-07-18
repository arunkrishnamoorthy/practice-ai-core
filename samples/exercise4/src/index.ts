// Example using response format with Zod Schema 
// When not calling a tool, to return a response in a structured format we can use response_format option to structure the
// response. The json schema in which we wanted the response to be structured can be specified using zod. 

import { configDotenv  } from "dotenv";
import { OrchestrationClient, ResponseFormatText,ResponseFormatJsonSchema,TemplatingModuleConfig,  } from "@sap-ai-sdk/orchestration";
import * as z from 'zod/v4'

configDotenv()

const client = new OrchestrationClient({
    llm: {
        model_name: 'gpt-4o'
    }
})

const response = await client.chatCompletion({
    messages: [
        {
            role: 'user',
            content: 'What is the capital of India?'
        }
    ]
})

console.log(response.getContent())
// The response you will get here is a string format as below
// The capital of India is New Delhi.

// Part 2: Structuring the response 
// Let us structure the response content
// {"country_name":"India","capital":"New Delhi"}
const responseFormat: TemplatingModuleConfig = {
    response_format: {
        type: 'json_schema',
        json_schema: {
            name: 'captial_response',
            schema: {
                type: 'object',
                properties: {
                    country_name: {
                        type: 'string',
                        description: 'The name of the country provided by the user'
                    },
                    capital: {
                        type: 'string', 
                        description: 'The capital city of the country'
                    }
                },
                required: ['country_name','capital']
            }
        }
    }
}

const clientWithResponseFormat = new OrchestrationClient({
    llm: {
        model_name: 'gpt-4o'
    },
    templating: responseFormat
})

const formattedResponse = await clientWithResponseFormat.chatCompletion({
    messages: [
        {
            role: 'user',
            content: 'What is the captial city of India?'
        }
    ]
})

console.log(formattedResponse.getContent())


// Part 3: Response formatting with Zod 
const countryCapitalSchema = z.object({
    country_name: z.string(),
    capital: z.string()
}).strict()

const zodResponseFormat:ResponseFormatJsonSchema = {
    type: 'json_schema',
    json_schema: {
        name: 'capital_response',
        strict: true,
        schema: z.toJSONSchema(countryCapitalSchema)
    }
}
const clientWithZod = new OrchestrationClient({
    llm: {
        model_name: 'gpt-4o'
    },
    templating: responseFormat
})

const formattedZodResponse = await clientWithZod.chatCompletion({
    messages: [
        {
            role: 'user',
            content: 'What is the captial city of India?'
        }
    ]
})

console.log(formattedZodResponse.getContent())


