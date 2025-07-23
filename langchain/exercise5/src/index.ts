// Output Parsers 

import { configDotenv } from "dotenv"
import { ChatOpenAI } from "@langchain/openai"
import { ChatPromptTemplate } from "@langchain/core/prompts"
import { StringOutputParser, CommaSeparatedListOutputParser, StructuredOutputParser } from "@langchain/core/output_parsers"
import { z } from "zod"

configDotenv()

const model = new ChatOpenAI({
    modelName: 'gpt-4o',
    temperature: 0.9
})
const prompt = ChatPromptTemplate.fromTemplate('Tell me a joke about {word}')

async function stringOutputParser() {
    const outputParser = new StringOutputParser()
    const chain = prompt.pipe(model).pipe(outputParser)
    return await chain.invoke({
        word: 'Dog'
    })
}

async function listOutputParser() {
    const outputParser = new CommaSeparatedListOutputParser()
    const prompt = ChatPromptTemplate.fromMessages([
        ["system", "Provide 5 synonyms, seperated by commas, for a word that the user will provide."],
        ["human", "{word}"]
    ])
    const chain = prompt.pipe(model).pipe(outputParser)
    return await chain.invoke({
        word: 'Dog'
    })
}

async function callStructuredParser() {
    const prompt = ChatPromptTemplate.fromTemplate("Extract information from the following phrase. \n {format} \n {phrase} ")
    const outputParser = StructuredOutputParser.fromNamesAndDescriptions({
        name: 'name of the person',
        age: 'age of person'
    })
    const chain = prompt.pipe(model).pipe(outputParser)
    return await chain.invoke({
        phrase: 'Max age is 30',
        format: outputParser.getFormatInstructions()
    })
}


async function callZodStructuredParser() {
    const prompt = ChatPromptTemplate.fromTemplate("Extract information from the following phrase. \n {format} \n {phrase} ")
    const zodSchema = z.object({
        name: z.string().optional().describe('name of the person'),
        age: z.string().optional().describe('age of the person'),
        gender: z.string().optional().describe('gender of the person')
    })
    // @ts-ignore
    const outputParser = StructuredOutputParser.fromZodSchema(zodSchema)
    const chain = prompt.pipe(model).pipe(outputParser)
    return await chain.invoke({
        phrase: 'Max age is 30',
        format: outputParser.getFormatInstructions()
    })
}


// const response = await stringOutputParser()
// const response = await listOutputParser()
// const response = await callStructuredParser()
const response = await callZodStructuredParser()
console.log(response)