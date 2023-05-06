import * as vscode from 'vscode';

const VIEW_COLUMN_MAPPING = {
  script: vscode.ViewColumn.One,
  style: vscode.ViewColumn.Two,
};

function getTagRegex(tagNames: string[]): RegExp {
  return new RegExp(`<(${tagNames.join('|')})[^>]*>([\\s\\S]*?)<\\/(${tagNames.join('|')})>`, 'gi');
}

async function foldTags(document: vscode.TextDocument, tagNames: string[]): Promise<void> {
  const editor = await vscode.window.showTextDocument(document, { viewColumn: vscode.ViewColumn.Beside, preserveFocus: false });
  const content = document.getText();
  const tagRegex = getTagRegex(tagNames);
  const matches = Array.from(content.matchAll(tagRegex));

  for (const match of matches) {
    const startPosition = document.positionAt(content.indexOf(match[0]));
    const endPosition = document.positionAt(content.indexOf(match[0]) + match[0].length);
    const range = new vscode.Range(startPosition, endPosition);
    const viewColumn = VIEW_COLUMN_MAPPING[match[1] as keyof typeof VIEW_COLUMN_MAPPING];

    if (viewColumn) {
      const selection = new vscode.Selection(range.start, range.end);
      editor.selection = selection;
      await vscode.commands.executeCommand('editor.fold');
      editor.selection = new vscode.Selection(range.start, range.start);
      await vscode.commands.executeCommand('workbench.action.moveEditorToPositionInActiveGroup', { to: viewColumn });
    }
  }
}

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('svelte-split-view.split', async () => {
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
      return;
    }

	const document = editor.document;

    if (document.languageId !== 'svelte') {
      vscode.window.showErrorMessage('This command can only be used with Svelte files.');
      return;
    }

    try {
      await foldTags(document, ['style']);
    } catch (error) {
      vscode.window.showErrorMessage('Error splitting Svelte file: ' + error.message);
    }
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
