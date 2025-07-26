import { configDotenv } from "dotenv"
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai"
import { ChatPromptTemplate } from "@langchain/core/prompts"
import { JSONLoader } from "langchain/document_loaders/fs/json"
import { Document } from "@langchain/core/documents"
import path from 'node:path'
import fs from 'fs'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'
import { createRetrievalChain } from 'langchain/chains/retrieval'
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents'
import { Readline } from "readline/promises"
import { createInterface } from "readline"
import debug from 'debug'

configDotenv()

const log = debug('app')

// The brain
const model = new ChatOpenAI({
    modelName: 'gpt-4o'
})

// Conversation
// Your responsibility is to analyze and summarize the findings of the ATC checks.
// Analyze the findings 
// based on the {input} and provide your summary
const prompt = ChatPromptTemplate.fromTemplate(`
    You are a senior ABAP developer specialized in ABAP Clean Core Compilance.  
    The details of ATC checks are as follows. \n {context} \n. . 
    Analyse and provide answer for the question {input}
    `
)

// The Knowledge
// Source: JSON 
// the json loader is useless. it flattens the object and takes the summary of last content 
// does not serve the purpose to make queries on the object. like get me all objects from particular package 
// or get me all findings of an particular object. 
// const loader = new JSONLoader(filePath)
// const docs = await loader.load()
// Get the raw content of the json and create documents from it and load it
// to the model. 

const cwd = process.cwd()
const filePath = path.join(cwd, 'src/data', 'singlerow.json')
const fileContent = fs.readFileSync(filePath, 'utf-8')
const jsonData = JSON.parse(fileContent)
const findingsResult = jsonData?.d?.results ?? []

function flattenObject(obj: any, prefix = "") {
  let str = "";
  for (const key in obj) {
    if (typeof obj[key] === "object" && obj[key] !== null && !Array.isArray(obj[key])) {
      str += flattenObject(obj[key], `${prefix}${key}.`);
    } else {
      str += `${prefix}${key}: ${JSON.stringify(obj[key])}\n`;
    }
  }
  return str;
}

// adding each row as a document 
// const documents = findingsResult.map((item: any) => {
//   const textContent = flattenObject(item);
//   return new Document({
//     pageContent: textContent,
//     metadata: { id: item.ID || item.item_id || undefined }, // optional metadata
//   });
// });

const combinedText = findingsResult
  .map((item: any, index: any) => `--- Entry ${index + 1} ---\n${flattenObject(item)}\n`)
  .join("\n");

const findingDocument = new Document({
                            pageContent: combinedText,
                            metadata: { source: "combined_json" }, // TODO: Summarize the Package names and add to metadata 
                        })                                         // for relevancy search


// chunk documents to smaller units                      
const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 5000,
    chunkOverlap: 200
})
const splitDocs = await splitter.splitDocuments([findingDocument])
log(splitDocs.length)
log(splitDocs[0].pageContent)

// Vectorise the data
const embeddings = new OpenAIEmbeddings()
const vectorStore = await MemoryVectorStore.fromDocuments(splitDocs, embeddings)


// retreiver 
const chain = await createStuffDocumentsChain({
    llm: model, 
    prompt
})
const retriever = vectorStore.asRetriever({
    k: 1000
})
const retrievalChain = await createRetrievalChain({
    combineDocsChain: chain,
    retriever: retriever
})  

const rl = createInterface({
    input: process.stdin,
    output: process.stdout
})

async function chatCompletion(input: string) {
    const response = await retrievalChain.invoke({
        context: splitDocs,
        input
    })
    console.log(response.answer)
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
