import * as vscode from 'vscode';

async function focusTag(editor: vscode.TextEditor, tagName: string): Promise<void> { 
    const content = editor.document.getText();
    const tagRegex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'gi');
    const match = tagRegex.exec(content);
    if (match) {
        const startPosition = editor.document.positionAt(match.index);
        const endPosition = editor.document.positionAt(match.index + match[0].length);
        const range = new vscode.Range(startPosition, endPosition);
        editor.revealRange(range, vscode.TextEditorRevealType.AtTop);
        editor.selection = new vscode.Selection(startPosition, startPosition);
    }
}

async function focusHTML(editor: vscode.TextEditor): Promise<void> { 
    const content = editor.document.getText();
    const tagRegex = new RegExp(`<script[^>]*>([\\s\\S]*?)<\\/script>`, 'gi');
    const match = tagRegex.exec(content);
    if (match) {
        const position = editor.document.positionAt(match.index + match[0].length);
        const range = new vscode.Range(position, position);
        editor.revealRange(range, vscode.TextEditorRevealType.AtTop);
        editor.selection = new vscode.Selection(position, position);
    }
}

export function activate(context: vscode.ExtensionContext) {

    // Create a command to focus on the script tag
    let scriptCommand = vscode.commands.registerCommand('svelte-tag-focuser.focusOnScript', () => {
        const activeEditor = vscode.window.activeTextEditor;
        if (activeEditor) {
            focusTag(activeEditor, 'script');
        }
    });

    // Create a command to focus on the HTML
    let htmlCommand = vscode.commands.registerCommand('svelte-tag-focuser.focusOnHTML', () => {
        const activeEditor = vscode.window.activeTextEditor;
        if (activeEditor) {
            focusHTML(activeEditor);
        }
    });

    // Create a command to focus on the style tag
    let styleCommand = vscode.commands.registerCommand('svelte-tag-focuser.focusOnStyle', () => {
        const activeEditor = vscode.window.activeTextEditor;
        if (activeEditor) {
            focusTag(activeEditor, 'style');
        }
    });

    context.subscriptions.push(scriptCommand, htmlCommand, styleCommand);
}
