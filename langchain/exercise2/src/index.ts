import { Document } from '@langchain/core/documents'
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf"
import path from 'node:path'
import { ChatOpenAI,OpenAIEmbeddings } from '@langchain/openai'
import { ChatPromptTemplate } from "@langchain/core/prompts"
import { configDotenv } from 'dotenv'
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents'
import { CheerioWebBaseLoader } from '@langchain/community/document_loaders/web/cheerio'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'
import { createRetrievalChain } from 'langchain/chains/retrieval'

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


const webLoader = new CheerioWebBaseLoader('https://js.langchain.com/docs/concepts/lcel/')
const webDocs = await webLoader.load()

const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200
})

const splitDocs = await splitter.splitDocuments(webDocs)
const nikeSplitDocs = await splitter.splitDocuments(docs)
console.log('Nike Documents', nikeSplitDocs.length)

const embeddings = new OpenAIEmbeddings()
const vectorStore = await MemoryVectorStore.fromDocuments(nikeSplitDocs, embeddings)

// retriever 
const retriever = vectorStore.asRetriever({
    k: 10
})

const retrievalChain = await createRetrievalChain({
    combineDocsChain: chain,
    retriever: retriever
})  


const input = 'Get me details on NIKE 2023 Annual meeting'
// const input = 'What is LCEL?'
const response = await retrievalChain.invoke({
    // context: 'LCEL stands for Langchain Expression language',
    context: splitDocs,
    input
})
console.log(response)
