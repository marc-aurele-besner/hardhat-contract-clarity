import { extendEnvironment, task } from 'hardhat/config'

import getClarity from './getClarity'

export class Clarity {
    private readonly _env: any

    constructor(hre: any) {
        this._env = hre
    }

    public async clarity(contract: string, output: string, openAIKey?: string, flatten?: boolean) {
        await getClarity(this._env, contract, output, openAIKey, flatten)
    }
}
