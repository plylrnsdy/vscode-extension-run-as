import * as fs from "fs"
import * as path from 'path'
import * as vscode from 'vscode'
import Message from './common/Message'
import i18nConstructor from "./util/i18n"
import initConfig from './Config'
import * as workspace from './common/workspace'
import initCommand from './Command'
import Terminal from './common/Terminal'

let message = new Message('Run As')
let i18n = new i18nConstructor('en', vscode.env.language, path.join(__dirname, '../../locale/lang.%s.json'))
let config = new (initConfig(message, i18n))(process.platform)
let Command = initCommand(workspace, message, i18n)
let terminal = new Terminal('Run As ...')

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(config.reloadOnConfigChange())
    context.subscriptions.push(terminal.initOnClose())
    context.subscriptions.push(vscode.commands.registerCommand('extension.runAs', e => {
        if (e.fsPath) {
            let commandExpression = config.getCommandMapByFile(e.fsPath),
                command = new Command(commandExpression, e.fsPath, config.newWindowConfig as { name: string, enable: boolean, command: string })
            terminal.exec(command.toString())
        }
    }))
}

export function deactivate() { }