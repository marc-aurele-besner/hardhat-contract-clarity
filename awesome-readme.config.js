module.exports = {
    figlet: `
db   db  .d8b.  d8888b. d8888b. db   db  .d8b.  d888888b         .o88b.  .d88b.  d8b   db d888888b d8888b.  .d8b.   .o88b. d888888b         .o88b. db       .d8b.  d8888b. d888888b d888888b db    db 
88   88 d8' \`8b 88  \`8D 88  \`8D 88   88 d8' \`8b \`~~88~~'        d8P  Y8 .8P  Y8. 888o  88 \`~~88~~' 88  \`8D d8' \`8b d8P  Y8 \`~~88~~'        d8P  Y8 88      d8' \`8b 88  \`8D   \`88'   \`~~88~~' \`8b  d8' 
88ooo88 88ooo88 88oobY' 88   88 88ooo88 88ooo88    88           8P      88    88 88V8o 88    88    88oobY' 88ooo88 8P         88           8P      88      88ooo88 88oobY'    88       88     \`8bd8'  
88~~~88 88~~~88 88\`8b   88   88 88~~~88 88~~~88    88    C8888D 8b      88    88 88 V8o88    88    88\`8b   88~~~88 8b         88    C8888D 8b      88      88~~~88 88\`8b      88       88       88    
88   88 88   88 88 \`88. 88  .8D 88   88 88   88    88           Y8b  d8 \`8b  d8' 88  V888    88    88 \`88. 88   88 Y8b  d8    88           Y8b  d8 88booo. 88   88 88 \`88.   .88.      88       88    
YP   YP YP   YP 88   YD Y8888D' YP   YP YP   YP    YP            \`Y88P'  \`Y88P'  VP   V8P    YP    88   YD YP   YP  \`Y88P'    YP            \`Y88P' Y88888P YP   YP 88   YD Y888888P    YP       YP    
`,
    root_license: `[![npm version](https://badge.fury.io/js/hardhat-contract-clarity.svg)](https://badge.fury.io/js/hardhat-contract-clarity)`,
    root_header: `
This Hardhat plugin add 1 task to the Hardhat summarize a smart contract in human readable format using OpenAI GPT-3.

## Install Hardhat-contract-clarity

To install the Hardhat Contract Clarity Plugin, run the following command:

### 1. Install this package

With NPM

\`\`\`shell
npm install hardhat-contract-clarity --save-dev
\`\`\`

Or with Yarn

\`\`\`shell
yarn add hardhat-contract-clarity --save-dev
\`\`\`

### 2. Import/Require this package in your hardhat.config.js/.ts

Inside inside hardhat.config.js

\`\`\`js
require("hardhat-contract-clarity");
\`\`\`

or inside hardhat.config.ts (Typescript)

\`\`\`ts
import 'hardhat-contract-clarity'
\`\`\`
`,
    root_body: `
    

## Tasks

The plugin adds one tasks to the Hardhat CLI:

\`\`\`shell
npx hardhat clarity
\`\`\`

### Task: clarity

This task is used to summarize a smart contract in human readable format using OpenAI GPT-3.

Usage: hardhat [GLOBAL OPTIONS] clarity --contract <STRING> [--openai-key <STRING>] --output <STRING>

OPTIONS:

  --contract    What contract you want to summarize? 
  --openai-key  What is your OpenAI API Key? (default: "")
  --output      Where to save the summary 

clarity: Summarize a smart contract with ChatGPT

## Functions

Function allow you to use the clarity tool in your code.

\`\`\`js
const { clarity } = require('hardhat');

clarity.getClarity(
    contract: string,
    output: string,
    openAIKey?: string
)
\`\`\`
`,
    root_footer: `## Don't hesitate to contribute to this project.`,
    ignore_gitFiles: true,
    ignore_gitIgnoreFiles: true,
    ignore_files: ['.prettierignore', '.vscode']
}
