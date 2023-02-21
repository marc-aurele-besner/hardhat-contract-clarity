#!/usr/bin/env node

import { extendConfig, extendEnvironment, task } from 'hardhat/config'
import { lazyObject } from 'hardhat/plugins'
import { HardhatConfig, HardhatUserConfig } from 'hardhat/types'
import path from 'path'

import { Clarity } from './Clarity'
import serveTasks from './serveTasks'
import './type-extensions'
import { ClarityConfig } from './types'

extendConfig(async (config: HardhatConfig, userConfig: HardhatUserConfig) => {
    const userPath = userConfig.clarity
    let clarity: ClarityConfig
    if (userPath === undefined) clarity = config.clarity
    else {
        if (userPath) clarity = userPath
        else clarity = config.clarity
    }
    config.clarity = clarity
})

extendEnvironment(async (hre: any) => {
    hre.clarity = lazyObject(() => new Clarity(hre))
})

/**
 * clarity implementation
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

task('readme', 'Generate a README.md for your project')
    .addOptionalParam('output', 'Where to save the readme?')
    .addOptionalParam('openaiKey', 'What is your OpenAI API Key?', '')
    .setAction(async function (args: any, env: any) {
        // Call function
        await serveTasks('readme', args, env)
    })

task('aihelp', 'Provide a error message and get help from ChatGPT')
    .addOptionalParam('error', 'What is your error message')
    .addOptionalParam('openaiKey', 'What is your OpenAI API Key?', '')
    .setAction(async function (args: any, env: any) {
        // Call function
        await serveTasks('aihelp', args, env)
    })
