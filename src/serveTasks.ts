import inquirer from 'inquirer'

import getClarity from './getClarity'

const inquirerTransactionHashInput = [
    {
        type: 'input',
        name: 'contract',
        message: 'What contract you want to summarize?',
        default: 'hardhat'
    },
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
    },
    {
        type: 'boolean',
        name: 'flatten',
        message: 'Do you want to flatten the contract?'
    }
]
const serveClarity = async (args: any, env: any) => {
    if (!args.contract || args.contract === '' || !args.output || args.output === '')
        await inquirer
            .prompt(inquirerTransactionHashInput)
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
    else await getClarity(env, args.contract, args.output, args.openAIKey, args.flatten)
}

const serveCLI = async (task: string) => {
    if (task === '')
        return (
            await inquirer.prompt([
                {
                    type: 'list',
                    name: 'action',
                    message: 'What do you want to do?',
                    choices: ['clarity']
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
        default:
            break
    }
}

const serveTasks = async (task: string, args: any, env: any) => {
    console.log('Tool that summarizes smart contracts for improved readability and understanding')
    return serveFunction(task, args, env)
}

export default serveTasks
