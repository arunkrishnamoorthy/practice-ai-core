import { Document } from '@langchain/core/documents'
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import path from 'node:path'

const documents = [
    new Document({
        pageContent: "Dogs are great companions, known for their loyalty and friendliness.",
        metadata: { source: "mammal-pets-doc" }
    }),
    new Document({
        pageContent: "Cats are independent pets that often enjoy their own space.",
        metadata: { source: "mammal-pets-doc" },
    })
]

const cwd = process.cwd();
const filePath = path.join(cwd, 'src/data', 'nke-10k-2023.pdf')
const loader = new PDFLoader(filePath);
const docs = await loader.load();
console.log(docs.length);
console.log(docs[0])