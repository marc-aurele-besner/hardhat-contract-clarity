import { Configuration, OpenAIApi } from 'openai'

import { flattenContract, loadFile, saveFile } from './utils'

const getClarity = async (env: any, contract?: string, output?: string, openAIKey?: string, flatten?: boolean) => {
    if ((!contract || contract === '') && env.config.clarity.summary.contract)
        contract = env.config.clarity.summary.contract
    if ((!openAIKey || openAIKey === '') && env.config.clarity.openAIKey) openAIKey = env.config.clarity.openAIKey
    if ((!output || output === '') && env.config.clarity.summary.output) output = env.config.clarity.summary.output
    if (!output) output = 'contractSummary.txt'
    if (!contract) throw new Error('No contract provided')
    console.log('\x1b[32m', `Contract: `, '\x1b[0m', contract, '\x1b[32m', `is being summarized...`, '\x1b[0m')
    try {
        if (flatten) {
            const contractFlat = await flattenContract(contract, output)
            if (!contractFlat) {
                return {
                    success: false,
                    message: 'Clarity failed, could not flatten contract',
                    summary: null
                }
            } else contract = contractFlat
        }
        const Contract = await loadFile(contract)
        if (!Contract) {
            return {
                success: false,
                message: 'Clarity failed, could not locate flatten contract',
                summary: null
            }
        } else {
            const configuration = new Configuration({
                apiKey: openAIKey
            })
            const openai = new OpenAIApi(configuration)
            const completion = await openai.createCompletion({
                model: env.config.clarity.summary.model || 'gpt-3.5-turbo',
                prompt: `${
                    env.config.clarity.summary.prompt || 'Summarize the following contract:\n\n'
                }${Contract}\n\nSummary:\n\n`,
                temperature: env.config.clarity.summary.temperature || 0.7,
                max_tokens: env.config.clarity.summary.max_tokens || 2000,
                top_p: env.config.clarity.summary.top_p || 1.0,
                frequency_penalty: env.config.clarity.summary.frequency_penalty || 0.0,
                presence_penalty: env.config.clarity.summary.presence_penalty || 0.0
            })
            const summary = completion.data.choices[0].text
            if (summary) {
                await saveFile(summary, output)
                console.log('\x1b[32m', `Summary: `, '\x1b[0m', summary)
                console.log('\x1b[32m', `Contract: ${contract} has been summarized and saved to ${output}`, '\x1b[0m')
                return {
                    success: true,
                    message: 'Contract formatted available at ' + output,
                    summary
                }
            } else {
                console.log('\x1b[33m%s\x1b[0m', `Error: Could not summarize contract`, '\x1b[0m')
                return {
                    success: false,
                    message: 'Could not summarize contract',
                    summary: null
                }
            }
        }
    } catch (err) {
        const error: string = String(err)
        if (error.startsWith('Error: Request failed with status code 401'))
            console.log('\x1b[33m%s\x1b[0m', `Error: (401) Invalid Authentication`, '\x1b[0m')
        else if (error.startsWith('Error: Request failed with status code 404')) {
            console.log('\x1b[33m%s\x1b[0m', `Error: (404) The requesting API key is not correct.`, '\x1b[0m', ' OR ')
            console.log('\x1b[33m%s\x1b[0m', `Error: (404) Your account is not part of an organization.`, '\x1b[0m')
        } else if (error.startsWith('Error: Request failed with status code 429')) {
            console.log('\x1b[33m%s\x1b[0m', `Error: (429) You have hit your assigned rate limit.`, '\x1b[0m', ' OR ')
            console.log(
                '\x1b[33m%s\x1b[0m',
                `Error: (429) You have hit your maximum monthly spend (hard limit).`,
                '\x1b[0m',
                ' OR '
            )
            console.log('\x1b[33m%s\x1b[0m', `Error: (429) Our servers are experiencing high traffic.`, '\x1b[0m')
        } else if (error.startsWith('Error: Request failed with status code 500'))
            console.log(
                '\x1b[33m%s\x1b[0m',
                `Error: (500) The server had an error while processing your request.`,
                '\x1b[0m'
            )
        else console.log('\x1b[33m%s\x1b[0m', err, '\x1b[0m')
    }
    return {
        success: false,
        message: 'Could not summarize contract',
        summary: null
    }
}

export default getClarity
