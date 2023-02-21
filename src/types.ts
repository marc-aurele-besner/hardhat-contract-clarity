export interface ClarityConfig {
    openAIKey: string | undefined
    summary: {
        contract?: string | undefined
        output?: string | undefined
        model?: string | undefined
        prompt?: string | undefined
        temperature?: number | undefined
        max_tokens?: number | undefined
        top_p?: number | undefined
        frequency_penalty?: number | undefined
        presence_penalty?: number | undefined
    }
    readme: {
        output?: string | undefined
        model?: string | undefined
        prompt?: string | undefined
        temperature?: number | undefined
        max_tokens?: number | undefined
        top_p?: number | undefined
        frequency_penalty?: number | undefined
        presence_penalty?: number | undefined
    }
    AIhelp: {
        error?: string | undefined
        model?: string | undefined
        prompt?: string | undefined
        promptEnd?: string | undefined
        temperature?: number | undefined
        max_tokens?: number | undefined
        top_p?: number | undefined
        frequency_penalty?: number | undefined
        presence_penalty?: number | undefined
    }
}
