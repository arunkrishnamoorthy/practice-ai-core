import { configDotenv } from "dotenv"
import { createInterface } from "readline"
import { ChatOpenAI } from "@langchain/openai"
import { Readline } from "readline/promises"


// load the environment variables 
configDotenv()

const rl = createInterface({
    input: process.stdin,
    output: process.stdout
})

const model = new ChatOpenAI({
    modelName: 'gpt-4o',
    temperature: 0.9
})

async function chatCompletion(input: string) {
    const response = await model.invoke(input)
    console.log(response.content)
}


async function getPrompt() {
    rl.question("Enter your prompt: ", async (input) => {
        if(input.toUpperCase() === 'EXIT') {
            rl.close()
        } else {
            await chatCompletion(input)
            getPrompt()
        }
    })
}

await getPrompt()
