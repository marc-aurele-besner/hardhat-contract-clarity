import { extendEnvironment, task } from 'hardhat/config'

import getClarity from './getClarity'
import getHelp from './getHelp'
import getReadme from './getReadme'

export class Clarity {
    private readonly _env: any

    constructor(hre: any) {
        this._env = hre
    }

    public async clarity(contract?: string, output?: string, openAIKey?: string, flatten?: boolean) {
        await getClarity(this._env, contract, output, openAIKey, flatten)
    }

    public async readme(output?: string, openAIKey?: string) {
        await getReadme(this._env, output, openAIKey)
    }

    public async AIhelp(error?: string, openAIKey?: string) {
        await getHelp(this._env, error, openAIKey)
    }
}
