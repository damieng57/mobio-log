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
		const textHighLight = editor.document.getText(wordRange);
		const selectionText = editor.document.getText(editor.selection);
		const text = selectionText.length > textHighLight.length ? selectionText : textHighLight;
		const textCurrentLine = (text.split("\n")[cursorPosition.line]);
		if (!isCanConsole()) { return; }
		if (!wordRange) {
			textCurrentLine.trim() && await vscode.commands.executeCommand("editor.action.insertLineAfter");
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

export function isCanConsole(): boolean {
	const activeEditor = vscode.window.activeTextEditor;
	const languageId = activeEditor?.document.languageId;
	if (!languageId) { return false; }
	if (languageId === 'javascript' || languageId === 'typescript' || languageId === 'javascriptreact') { return true; }
	vscode.window.showInformationMessage('Language not type of Javascript !!!');
	return false;
}

export function deactivate() { }
