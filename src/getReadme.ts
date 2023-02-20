import { Configuration, OpenAIApi } from 'openai'

import { loadFile, saveFile } from './utils'

const getReadme = async (env: any, output: string, openAIKey: string) => {
    console.log('\x1b[32m%s\x1b[0m', `Readme is being generated...`)
    try {
        const Readme = await loadFile('package.json')
        if (!Readme) {
            return {
                success: false,
                message: 'Clarity failed, could not locate package.json',
                readme: null
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
                max_tokens: 2000,
                top_p: 1.0,
                frequency_penalty: 0.0,
                presence_penalty: 0.0
            })
            const generatedReadme = completion.data.choices[0].text
            if (generatedReadme) {
                await saveFile(generatedReadme, output)
                console.log('\x1b[32m%s\x1b[0m', `Readme: `, '\x1b[0m', generatedReadme)
                console.log('\x1b[32m%s\x1b[0m', `Readme saved to `, '\x1b[0m', output)
                return {
                    success: true,
                    message: 'Readme available at ' + output,
                    readme: generatedReadme
                }
            } else {
                console.log('\x1b[33m%s\x1b[0m', `Error: Could not generate readme`)
                return {
                    success: false,
                    message: 'Could not generate readme',
                    readme: null
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
        message: 'Could not generate readme',
        readme: null
    }
}

export default getReadme
