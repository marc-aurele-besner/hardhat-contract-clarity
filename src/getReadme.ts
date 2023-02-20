import { Configuration, OpenAIApi } from 'openai'

import { loadFile, saveFile } from './utils'

const getReadme = async (env: any, output?: string, openAIKey?: string) => {
    if ((!openAIKey || openAIKey === '') && env.config.clarity.openAIKey) openAIKey = env.config.clarity.openAIKey
    if ((!output || output === '') && env.config.clarity.readme.output) output = env.config.clarity.readme.output
    if (!output) output = 'generatedReadme.md'
    console.log('\x1b[32m', `Readme is being generated...`)
    try {
        const PackageJSON = await loadFile('package.json')
        if (!PackageJSON) {
            return {
                success: false,
                message: 'Clarity failed, could not locate package.json',
                readme: null
            }
        } else {
            const configuration = new Configuration({
                apiKey: openAIKey || env.config.clarity.openAIKey
            })
            const openai = new OpenAIApi(configuration)
            const completion = await openai.createCompletion({
                model: env.config.clarity.readme.model || 'text-davinci-003',
                prompt: `${
                    env.config.clarity.readme.prompt ||
                    'With the following package.json, can you generate a descriptive readme in markdown?\n\n'
                }${PackageJSON}`,
                temperature: env.config.clarity.readme.temperature || 0.7,
                max_tokens: env.config.clarity.readme.max_tokens || 2000,
                top_p: env.config.clarity.readme.top_p || 1.0,
                frequency_penalty: env.config.clarity.readme.frequency_penalty || 0.0,
                presence_penalty: env.config.clarity.readme.presence_penalty || 0.0
            })
            const generatedReadme = completion.data.choices[0].text
            if (generatedReadme) {
                await saveFile(generatedReadme, output)
                console.log('\x1b[32m', `Readme: `, '\x1b[0m', generatedReadme)
                console.log('\x1b[32m', `Readme saved to `, '\x1b[0m', output)
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
