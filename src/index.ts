#!/usr/bin/env node

import { extendConfig, extendEnvironment, task } from 'hardhat/config'
import { lazyObject } from 'hardhat/plugins'
import { HardhatConfig, HardhatUserConfig } from 'hardhat/types'
import path from 'path'

import { Clarity } from './Clarity'
import serveTasks from './serveTasks'
import './type-extensions'

extendConfig(async (config: HardhatConfig, userConfig: HardhatUserConfig) => {
    const userPath = userConfig.paths?.clarity
    let clarity: string
    if (userPath === undefined) clarity = path.join(config.paths.root, 'clarity')
    else {
        if (path.isAbsolute(userPath)) clarity = userPath
        else clarity = path.normalize(path.join(config.paths.root, userPath))
    }
    config.paths.clarity = clarity
})

extendEnvironment(async (hre: any) => {
    hre.clarity = lazyObject(() => new Clarity(hre))
})

/**
 * retry task implementation
 * @param  {HardhatUserArgs} args
 * @param  {HardhatEnv} env
 */
task('clarity', 'Summarize a smart contract with ChatGPT')
    .addOptionalParam('contract', 'What contract you want to summarize?')
    .addOptionalParam('output', 'Where to save the summary')
    .addOptionalParam('openaiKey', 'What is your OpenAI API Key?', '')
    .addOptionalParam('flatten', 'Do you want to flatten the contract?', '')
    .setAction(async function (args: any, env: any) {
        // Call function
        await serveTasks('clarity', args, env)
    })
