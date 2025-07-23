import { ChatOpenAI } from "@langchain/openai";
import { configDotenv } from "dotenv";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatPromptTemplate } from "@langchain/core/prompts";


configDotenv()

const model = new ChatOpenAI({
    model: 'gpt-4'
})

const messages = [
    new SystemMessage('Translate the following from English into Italian'),
    new HumanMessage('Hi How are you')
]

const response = await model.invoke(messages)
console.log(response)

await model.invoke("Hello")
await model.invoke([
    {
        role: 'user',
        content: 'This is a user message'
    }
])
await model.invoke([new HumanMessage('This is a message from API')])


const stream = await model.stream(messages)

for await ( const chunk of stream) {
    console.log(chunk.content)
}

const systemTemplate = "Translate the following from English into {language}";

const promptTemplate = ChatPromptTemplate.fromMessages([
    ["system", systemTemplate],
    ["user", "{text}"]
])

const promptValue = await promptTemplate.invoke({
    language: 'Italian',
    text : 'Hi'
})

console.log(promptValue)

const promptTemplateResponse = await model.invoke(promptValue.messages)
console.log(promptTemplateResponse.content)