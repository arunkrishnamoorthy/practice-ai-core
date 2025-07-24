import { Document } from '@langchain/core/documents'
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf"
import path from 'node:path'
import { ChatOpenAI } from '@langchain/openai'
import { ChatPromptTemplate } from "@langchain/core/prompts"
import { configDotenv } from 'dotenv'
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents'

configDotenv()

const documents = [
    new Document({
        pageContent: "Dogs are great companions, known for their loyalty and friendliness.",
        metadata: { source: "mammal-pets-doc" }
    }),
    new Document({
        pageContent: "Cats are independent pets that often enjoy their own space.",
        metadata: { source: "mammal-pets-doc" },
    }),
    new Document({
        pageContent: `The LangChain Expression Language (LCEL) takes a declarative approach to building new Runnables from existing Runnables.
        This means that you describe what you want to happen, rather than how you want it to happen, allowing LangChain to optimize the run-time execution of the chains.`,
        metadata: { source: 'langchain-documents' }
    })
]

const cwd = process.cwd();
const filePath = path.join(cwd, 'src/data', 'nke-10k-2023.pdf')
const loader = new PDFLoader(filePath)
const docs = await loader.load()
// console.log(docs.length)
// console.log(docs[0])

const model = new ChatOpenAI({
    modelName: 'gpt-4o'
})

const prompt = ChatPromptTemplate.fromTemplate(`Answer the users question.
    context: {context}
    {input}`)

// const chain = prompt.pipe(model)
const chain = await createStuffDocumentsChain({
    llm: model, 
    prompt
})

// const input = 'Give me a summary of nike annual report in 2023'
const input = 'What is LCEL?'
const response = await chain.invoke({
    // context: 'LCEL stands for Langchain Expression language',
    context: documents,
    input
})
console.log(response)
