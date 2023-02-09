import { spawn } from 'child_process'
import { readFileSync, writeFileSync } from 'fs'

const sleep = async (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

export const runCommand = async (command: string) => {
    try {
        let finishedRunning = false
        const runPush = await spawn(command, {
            stdio: 'inherit',
            shell: true
        })
        runPush.on('exit', () => {
            // exit()
            finishedRunning = true
        })
        // Keep waiting until the compiling is finished
        while (!finishedRunning) {
            await sleep(500)
        }
        return true
    } catch (err) {
        console.log('\x1b[33m%s\x1b[0m', `Error running command`, err)
        return false
    }
}

export const flattenContract = async (contract: string, output: string) => {
    try {
        await runCommand('npx hardhat flatten ' + contract + ' > ' + output)
        console.log('\x1b[32m%s\x1b[0m', `Contract: ${contract} has been flatten and saved to ${output}`)
        return output
    } catch (err) {
        console.log('\x1b[33m%s\x1b[0m', `Error flattening contract`, err)
        return undefined
    }
}

export const loadContract = async (flatContract: string) => {
    try {
        // Read the file
        const contract = readFileSync(flatContract).toString()
        return contract
    } catch (err) {
        console.log('\x1b[33m%s\x1b[0m', `Error loading flattened contract`, err)
        return undefined
    }
}

export const saveSummary = async (env: any, summary: string, outputFile: string) => {
    try {
        // Write the file
        writeFileSync(outputFile, summary)

        console.log('\x1b[32m%s\x1b[0m', 'Summary saved!')
    } catch (err) {
        console.log('\x1b[33m%s\x1b[0m', `Error saving summary`, err)
        return false
    }
}
