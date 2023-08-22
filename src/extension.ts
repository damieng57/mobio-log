import * as vscode from 'vscode';
import { IConfig, ISettingsConfig, TYPE_QUOTES } from './interfaces/settings-config.interface';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('mobio-log.log', async () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) { return; }
		/* Get Config */
		const { quotes, prefix, line, file } = getSettingConfig(editor);
		/*  Get Word */
		const cursorPosition = editor.selection.start;
		const wordRange = editor.document.getWordRangeAtPosition(cursorPosition);
		const text = editor.document.getText(wordRange);
		if (!wordRange) {
			editor.edit((editBuilder) => {
				editBuilder.insert(editor.selection.active, `console.log(${quotes}${prefix}${quotes});`);
			});
			return;
		}

		await vscode.commands.executeCommand("editor.action.insertLineAfter");
		editor.edit((editBuilder) => {
			editBuilder.insert(editor.selection.active, `console.log(${quotes}${prefix}${file}${line}${text}: ${quotes}, ${text});`);
		});
	});

	context.subscriptions.push(disposable);
}

export function getSettingConfig(editor: vscode.TextEditor): ISettingsConfig {
	const vsCodeGet = (config: IConfig) => vscode.workspace.getConfiguration("mobio-log").get(config);
	return {
		quotes: vsCodeGet('quotes') as TYPE_QUOTES || TYPE_QUOTES.DOUBLE,
		prefix: vsCodeGet('prefix') ? `${vsCodeGet('prefix')} ` : '',
		line: vsCodeGet('line') ? `LINE: ${editor.selection.active.line + 2} - ` : '',
		file: vsCodeGet('file') ? `FILE: ${editor.document.fileName.split('/').pop()} - ` : ''
	};
}

export function deactivate() { }
