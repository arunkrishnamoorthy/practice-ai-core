# AI Core Example

The example demonstrates the usage of the SAP AI SDK to create a instance of the model and provide a simple chat interaction. 

> This is a simple node js project, not a cap server

### Step 1: Initialize Project

Initialize a node js project by running a following command in the exercise folder. let's just go with the defaults. 

```bash 
npm init --y 
```

### Step 2: Install required packages

Install the required node js package `@sap-ai-sdk/orchestration` using the command 

```sh
npm install @sap-ai-sdk/orchestration
```

Install the `dotenv` package to load the necessary environment variables at runtime. 

```sh
npm install dotenv
```

### Step 3: Add the environment variables. 

Create a new file called `.env` in the root folder and add the environment variable with the name `AICORE_SERVICE_KEY`.

```sh
AICORE_SERVICE_KEY = '{
    .. paste the service key from the ai core service.
}'
```


### Step 4: Initialze and Create a chat message 

Import the orchestration client from the OrchestrationClient Package and initialize with a model and template. The template can contain dynamic parameter parsed in the syntax `{{?parameter}}` which can be passed later. After initializing the client parse the response message. 

```sh
import { OrchestrationClient } from "@sap-ai-sdk/orchestration";
import { configDotenv } from "dotenv";

// load the environment variable
configDotenv();

// initialize orchestration client
const orchestrationClient = new OrchestrationClient({
    llm: {
        model_name: 'gpt-4o' // model to be used
    },
    templating: { // prompt template
        template:[{ role: 'user', content: 'Answer the question:  {{?question}}'}]
    }
});

// Create a chat message
const response = await orchestrationClient.chatCompletion({
    inputParams: {
        question: 'Why is the Phrase "Hello World!" so famous?'
    }
});

// Read and log the content
console.log(response.getContent());
```


### Step 5: Run the index file

Run the index.js file using the node command. 

```sh
node index.js
``` 

You should see a similar response in your terminal 

```sh
[2025-07-15T20:58:34.494Z] INFO     (context): Found a service key in environment variable "AICORE_SERVICE_KEY". Using a service key is recommended for local testing only. Bind the AI Core service to the application for productive usage.
The phrase "Hello, World!" is famous primarily because it is traditionally used as the first program written by beginners learning a new programming language. Its origins can be traced back to the book "The C Programming Language" by Brian Kernighan and Dennis Ritchie, published in 1978, which featured a simple program that outputs "Hello, World!" to illustrate basic syntax and structure.

The phrase has become emblematic in computer science education because it represents a straightforward project that helps learners understand how to set up a programming environment, compile code, and run a simple program. The task of printing "Hello, World!" is a minimal yet effective way to demonstrate the basic features of a language, such as syntax, input/output, and execution, without overwhelming the learner.

Moreover, its widespread use has turned "Hello, World!" into a cultural icon within programming and tech communities, symbolizing the beginning of a coding journey or the exploration of a new programming language. It is now a universal programmer's rite of passage, extending beyond C to numerous other languages, each offering its own syntax for achieving the same simple output.
```





