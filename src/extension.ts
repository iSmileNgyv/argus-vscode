import * as vscode from 'vscode';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {

	// Register the 'Run Argus Test' command
	let disposable = vscode.commands.registerCommand('argus.runTest', (uri: vscode.Uri) => {

		// Use the selected file in explorer, or the currently active file in editor
		let fileUri = uri;
		if (!fileUri && vscode.window.activeTextEditor) {
			fileUri = vscode.window.activeTextEditor.document.uri;
		}

		if (!fileUri) {
			vscode.window.showErrorMessage('No file selected to run.');
			return;
		}

		// Validate file extension
		if (!fileUri.fsPath.endsWith('.yml') && !fileUri.fsPath.endsWith('.yaml')) {
			vscode.window.showWarningMessage('ArgusOmni only supports .yml or .yaml files.');
			return;
		}

		const filePath = fileUri.fsPath;
		const fileName = path.basename(filePath);

		// Create or reuse terminal
		const terminal = vscode.window.createTerminal(`Argus: ${fileName}`);
		terminal.show();

		// Execute the CLI command with verbose flag
		// Ensure paths with spaces are quoted
		terminal.sendText(`argus run "${filePath}" --verbose`);
	});

	context.subscriptions.push(disposable);
}

export function deactivate() { }