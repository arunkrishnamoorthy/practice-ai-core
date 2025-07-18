import { OrchestrationClient,ChatCompletionTool, ToolChatMessage } from "@sap-ai-sdk/orchestration";
import { configDotenv } from "dotenv";

configDotenv();

const convertTemperatureTool: ChatCompletionTool = {
    type: "function",
    function: {
        name: "convert_temperature_to_farenheit",
        description: "Convert temperature from celcius to Farenheit",
        parameters: {
            type: "object",
            properties: {
                temperature: {
                    type: "number",
                    description: "Temperature value in celcius to convert"
                }
            },
            required: ['temperature']
        }
    }
}

const convert_temperature_to_farenheit = function(temperature: number): string {
    return `The temperature for farenheit is ${(temperature * 9) / 5 + 32} °F.`;
}

const callFunction = function(name:string, args: any) {
    switch(name) {
        case 'convert_temperature_to_farenheit': 
            return convert_temperature_to_farenheit(args.temperature);
        default:
            throw new Error(`Function {name} not found`);
    }
}

const client = new OrchestrationClient({
    llm: {
        model_name: 'gpt-4o'
    },
    templating: {
        tools: [convertTemperatureTool]
    }
})


const response = await client.chatCompletion({
    messages: [{
        role: "user",
        content: 'Convert 20 degree celcius to farenhiet'
    }]
})

const initialResponse = response.getAssistantMessage()

let toolMessage: ToolChatMessage;

if(initialResponse && initialResponse.tool_calls) {
    const toolCall = initialResponse.tool_calls[0];
    const name = toolCall.function.name;
    const args = toolCall.function.arguments;
    const toolResult = callFunction(name,args);

    toolMessage = {
        role: 'tool',
        content: toolResult,
        tool_call_id: toolCall.id
    }
    const finalResponse = await client.chatCompletion({
        messages: [toolMessage],
        messagesHistory: response.getAllMessages()
    })

    console.log(finalResponse.getContent())
}
