import inquirer from 'inquirer'

import getClarity from './getClarity'
import getHelp from './getHelp'
import getReadme from './getReadme'

const inquirerGeneralInput = [
    {
        type: 'input',
        name: 'output',
        message: 'Where to save the summary?',
        default: 'hardhat'
    },
    {
        type: 'input',
        name: 'openAIKey',
        message: 'What is your OpenAI API Key?'
    }
]

const inquirerClarityInput = [
    {
        type: 'input',
        name: 'contract',
        message: 'What contract you want to summarize?',
        default: 'hardhat'
    },
    ...inquirerGeneralInput,
    {
        type: 'boolean',
        name: 'flatten',
        message: 'Do you want to flatten the contract?'
    }
]

const inquirerAIhelpInput = [
    {
        type: 'input',
        name: 'error',
        message: 'Error message?',
        default: 'How to use hardhat'
    },
    {
        type: 'input',
        name: 'openAIKey',
        message: 'What is your OpenAI API Key?'
    }
]

const serveClarity = async (args: any, env: any) => {
    if (!args.contract || args.contract === '' || !args.output || args.output === '')
        await inquirer
            .prompt(inquirerClarityInput)
            .then(async (answers) =>
                getClarity(
                    env,
                    answers.contract,
                    answers.output,
                    answers.openAIKey,
                    answers.flatten === 'true' ? true : false
                )
            )
            .catch((err: any) => {
                console.log(err)
            })
            .finally(() => {
                process.exit(0)
            })
    else await getClarity(env, args.contract, args.output, args.openaiKey, args.flatten)
}
const serveReadme = async (args: any, env: any) => {
    if (!args.output || args.output === '')
        await inquirer
            .prompt(inquirerGeneralInput)
            .then(async (answers) => getReadme(env, answers.output, answers.openAIKey))
            .catch((err: any) => {
                console.log(err)
            })
            .finally(() => {
                process.exit(0)
            })
    else await getReadme(env, args.output, args.openAIKey)
}
const serveAIhelp = async (args: any, env: any) => {
    if (!args.error || args.error === '')
        await inquirer
            .prompt(inquirerAIhelpInput)
            .then(async (answers) => getHelp(env, answers.error, answers.openAIKey))
            .catch((err: any) => {
                console.log(err)
            })
            .finally(() => {
                process.exit(0)
            })
    else await getHelp(env, args.error, args.openAIKey)
}

const serveCLI = async (task: string) => {
    if (task === '')
        return (
            await inquirer.prompt([
                {
                    type: 'list',
                    name: 'action',
                    message: 'What do you want to do?',
                    choices: ['clarity', 'readme']
                }
            ])
        ).action
    else return task
}

const serveFunction = async (task: string, args: any, env: any) => {
    const action = await serveCLI(task)
    switch (action) {
        case 'clarity':
            await serveClarity(args, env)
            break
        case 'readme':
            await serveReadme(args, env)
            break
        case 'aihelp':
            await serveAIhelp(args, env)
            break
        default:
            break
    }
}

const serveTasks = async (task: string, args: any, env: any) => {
    console.log('Tool that summarizes smart contracts using OpenAI GPT3 and generate README.md files')
    return serveFunction(task, args, env)
}

export default serveTasks
