import { Configuration, OpenAIApi } from 'openai'

import { loadFile, saveFile } from './utils'

const getReadme = async (env: any, output: string, openAIKey: string) => {
    console.log('\x1b[32m%s\x1b[0m', `Readme is being generated...`)
    try {
        const Readme = await loadFile('package.json')
        if (!Readme) {
            return {
                success: false,
                message: 'Clarity failed, could not locate package.json'
            }
        } else {
            const configuration = new Configuration({
                apiKey: openAIKey
            })
            const openai = new OpenAIApi(configuration)
            const completion = await openai.createCompletion({
                model: 'text-davinci-003',
                prompt:
                    'With the following package.json, can you generate a descriptive readme in markdown?\n\n' + Readme,
                temperature: 0.7,
                max_tokens: 64,
                top_p: 1.0,
                frequency_penalty: 0.0,
                presence_penalty: 0.0
            })
            const generatedReadme = completion.data.choices[0].text
            if (generatedReadme) {
                await saveFile(generatedReadme, output)
                console.log('\x1b[32m%s\x1b[0m', `Readme: ${generatedReadme}`)
                console.log('\x1b[32m%s\x1b[0m', `Readme saved to ${output}`)
                return {
                    success: true,
                    message: 'Readme available at ' + output
                }
            } else {
                console.log('\x1b[33m%s\x1b[0m', `Error: Could not generate readme`)
                return {
                    success: false,
                    message: 'Could not generate readme'
                }
            }
        }
    } catch (err) {
        console.log('\x1b[33m%s\x1b[0m', `Error: ${err}`)
    }
}

export default getReadme
