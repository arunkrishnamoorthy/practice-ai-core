import { AzureOpenAiChatClient,AzureOpenAiEmbeddingClient } from "@sap-ai-sdk/foundation-models";
import { configDotenv } from "dotenv";

configDotenv()

const client = new AzureOpenAiChatClient({
    deploymentId: 'd07c950f24f4b589'
})

const response = await client.run({
    messages: [
        {
            role: 'user',
            content: 'Where is the deepest place on earth located'
        }
    ]
})
console.log(response.getContent())

const embeddingClient = new AzureOpenAiEmbeddingClient({
    deploymentId: 'd0b11b39cbc4af5e'
})

const embeddingResponse = await embeddingClient.run({
    input: 'mars'
})
const catVector = embeddingResponse.getEmbeddings()[0]
console.log(embeddingResponse.getEmbeddings())

const embeddingResponse1 = await embeddingClient.run({
    input: 'politics'
})
const ratVector = embeddingResponse1.getEmbeddings()[0]
console.log(embeddingResponse1.getEmbeddings())

function cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) {
        throw new Error('Vectors must be of the same length');
    }

    const dotProduct = vecA.reduce((sum, a, idx) => sum + a * vecB[idx], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));

    if (magnitudeA === 0 || magnitudeB === 0) {
        throw new Error('Cannot compute cosine similarity for zero-vector');
    }

    return dotProduct / (magnitudeA * magnitudeB);
}

const similarity = cosineSimilarity(catVector, ratVector);
console.log("Cosine Similarity:", similarity.toFixed(4));
