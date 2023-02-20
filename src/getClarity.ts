import { Configuration, OpenAIApi } from 'openai'

import { flattenContract, loadFile, saveFile } from './utils'

const getClarity = async (env: any, contract: string, output: string, openAIKey: string, flatten: boolean) => {
    console.log('\x1b[32m%s\x1b[0m', `Contract: ${contract} is being summarized...`, '\x1b[0m')
    try {
        if (flatten) {
            const contractFlat = await flattenContract(contract, output)
            if (!contractFlat) {
                return {
                    success: false,
                    message: 'Clarity failed, could not flatten contract'
                }
            } else contract = contractFlat
        }
        const Contract = await loadFile(contract)
        if (!Contract) {
            return {
                success: false,
                message: 'Clarity failed, could not locate flatten contract'
            }
        } else {
            const configuration = new Configuration({
                apiKey: openAIKey
            })
            const openai = new OpenAIApi(configuration)
            const completion = await openai.createCompletion({
                model: 'text-davinci-003',
                prompt: 'Summarize the following contract:\n\n' + Contract + '\n\nSummary:\n\n',
                temperature: 0.7,
                max_tokens: 64,
                top_p: 1.0,
                frequency_penalty: 0.0,
                presence_penalty: 0.0
            })
            const summary = completion.data.choices[0].text
            if (summary) {
                await saveFile(summary, output)
                console.log('\x1b[32m%s\x1b[0m', `Summary: ${summary}`, '\x1b[0m')
                console.log(
                    '\x1b[32m%s\x1b[0m',
                    `Contract: ${contract} has been summarized and saved to ${output}`,
                    '\x1b[0m'
                )
                return {
                    success: true,
                    message: 'Contract formatted available at ' + output
                }
            } else {
                console.log('\x1b[33m%s\x1b[0m', `Error: Could not summarize contract`, '\x1b[0m')
                return {
                    success: false,
                    message: 'Could not summarize contract'
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
}

export default getClarity
