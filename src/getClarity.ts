import { Configuration, OpenAIApi } from 'openai'

import { flattenContract, loadFile, saveFile } from './utils'

const getClarity = async (env: any, contract: string, output: string, openAIKey: string, flatten: boolean) => {
    console.log('\x1b[32m%s\x1b[0m', `Contract: ${contract} is being summarized...`)
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
                console.log('\x1b[32m%s\x1b[0m', `Summary: ${summary}`)
                console.log('\x1b[32m%s\x1b[0m', `Contract: ${contract} has been summarized and saved to ${output}`)
                return {
                    success: true,
                    message: 'Contract formatted available at ' + output
                }
            } else {
                console.log('\x1b[33m%s\x1b[0m', `Error: Could not summarize contract`)
                return {
                    success: false,
                    message: 'Could not summarize contract'
                }
            }
        }
    } catch (err) {
        console.log('\x1b[33m%s\x1b[0m', `Error: ${err}`)
    }
}

export default getClarity
