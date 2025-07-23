import { configDotenv } from "dotenv"
import { ChatOpenAI } from "@langchain/openai"
import { PromptTemplate,ChatPromptTemplate } from "@langchain/core/prompts"

configDotenv()

const model = new ChatOpenAI({
    modelName: 'gpt-4o'
})

// const prompt = PromptTemplate.fromTemplate('Tell me a joke about {word}')
const prompt = ChatPromptTemplate.fromMessages([
    ['system', 'tell me a joke about animal provided by human'],
    ['human', '{word}']
])

const chain = prompt.pipe(model)

const response = await chain.invoke({
    word: 'Dog'
})

console.log(response)



