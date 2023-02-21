import { Configuration, OpenAIApi } from 'openai'

const getHelp = async (env: any, errorMsg?: string, openAIKey?: string) => {
    if ((!openAIKey || openAIKey === '') && env.config.clarity.openAIKey) openAIKey = env.config.clarity.openAIKey
    if ((!errorMsg || errorMsg === '') && env.config.clarity.AIhelp.error) errorMsg = env.config.clarity.AIhelp.error
    if (!errorMsg) throw new Error('No error message provided')
    console.log('\x1b[32m', `Asking help with: `, '\x1b[0m', errorMsg, '\x1b[32m', '\x1b[0m')
    try {
        const configuration = new Configuration({
            apiKey: openAIKey
        })
        const openai = new OpenAIApi(configuration)
        const completion = await openai.createCompletion({
            model: env.config.clarity.AIhelp.model || 'text-davinci-003',
            prompt: `${
                env.config.clarity.AIhelp.prompt || 'Using hardhat, I have this error message:\n\n'
            }${errorMsg}\n\n${
                env.config.clarity.AIhelp.promptEnd || 'Can you explain why and how I can fix the error:\n\n'
            }`,
            temperature: env.config.clarity.AIhelp.temperature || 0.7,
            max_tokens: env.config.clarity.AIhelp.max_tokens || 2000,
            top_p: env.config.clarity.AIhelp.top_p || 1.0,
            frequency_penalty: env.config.clarity.AIhelp.frequency_penalty || 0.0,
            presence_penalty: env.config.clarity.AIhelp.presence_penalty || 0.0
        })
        const helpResult = completion.data.choices[0].text
        if (helpResult) {
            console.log('\x1b[32m', `OpenAI Response: `, '\x1b[0m', helpResult)
            return {
                success: true,
                result: helpResult
            }
        } else {
            console.log('\x1b[33m%s\x1b[0m', `Error: Could not get help`, '\x1b[0m')
            return {
                success: false,
                summary: null
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
        summary: null
    }
}

export default getHelp
