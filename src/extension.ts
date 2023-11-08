import * as vscode from 'vscode';
import { IConfig, ISettingsConfig, TYPE_QUOTES } from './interfaces/settings-config.interface';
import { TYPE_COLORS, IMobioOptions, TYPE_OS } from './interfaces/extension.interface';

export function activate(context: vscode.ExtensionContext) {
	vscode.commands.registerCommand('mobio-log-before.log', async () => {
		vscode.commands.executeCommand('mobio-log.log', { before: true });
	});

	vscode.commands.registerCommand('mobio-log-after.log', async () => {
		vscode.commands.executeCommand('mobio-log.log', { after: true });
	});

	vscode.commands.registerCommand('mobio-log.log', async (args: IMobioOptions) => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) { return; }
		/* Get Config */
		const { quotes, prefix, line, file, position, color, colorEnable, semicolon } = getSettingConfig(editor);
		/* Get Word */
		const cursorPosition = editor.selection.start;
		const wordRange = editor.document.getWordRangeAtPosition(cursorPosition);
		const textHighLight = editor.document.getText(wordRange);
		const selectionText = editor.document.getText(editor.selection);
		const cursorInText = cursorPosition.character > 0 && cursorPosition.character < editor.document.lineAt(cursorPosition.line).text.length;
		const text = selectionText.length === 0 ? textHighLight : selectionText;
		const textCurrentLine = (text.split("\n")[cursorPosition.line]);
		const style = colorEnable ? `${color}%s%s${TYPE_COLORS.reset}` : '';
		if (!isCanConsole()) { return; }
		/* Get action */
		let action = "editor.action.insertLineAfter";
		if ((!position && args && !args.after) || (args && args.before) || (!position && !args)) {
			action = "editor.action.insertLineBefore";
		}

		if (!cursorInText && !selectionText) {
			textCurrentLine.trim() && await vscode.commands.executeCommand(action);
			editor.edit((editBuilder) => {
				editBuilder.insert(editor.selection.active, `console.log(${quotes}${style}${quotes}, ${quotes}${prefix}${quotes}, ${quotes}${quotes})${semicolon}`);
			});
			return;
		}
		await vscode.commands.executeCommand(action);
		editor.edit((editBuilder) => {
			editBuilder.insert(editor.selection.active, `console.log(${quotes}${style}${quotes}, ${quotes}${prefix}${file}${line}${text}: ${quotes} , ${text})${semicolon}`);
		});
	});
}

export function getSettingConfig(editor: vscode.TextEditor): ISettingsConfig {
	const vsCodeGet = (config: IConfig) => vscode.workspace.getConfiguration("mobio-log").get(config);
	const platform = process.platform;
	const separator = platform === TYPE_OS.WINDOWS ? '\\' : '/';
	return {
		// @ts-ignore
		color: TYPE_COLORS[vsCodeGet('color')],
		colorEnable: vsCodeGet('colorEnable') as boolean,
		semicolon: vsCodeGet('semicolon') ? ";" : "",
		position: vsCodeGet('position') as boolean,
		quotes: vsCodeGet('quotes') as TYPE_QUOTES || TYPE_QUOTES.DOUBLE,
		prefix: vsCodeGet('prefix') ? `${vsCodeGet('prefix')} ` : '',
		line: vsCodeGet('line') ? `LINE: ${editor.selection.active.line + 2} - ` : '',
		file: vsCodeGet('file') ? `FILE: ${editor.document.fileName.split(separator).pop()} - ` : ''
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
