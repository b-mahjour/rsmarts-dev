// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
let webviewPanel = null;


function runPythonScript(code, context) {
    const scriptPath = path.join(context.extensionPath, 'renderer.py');
    exec(`python3 ${scriptPath} '${code}'`, (error, stdout, stderr) => {
      if (error) {
        // console.error(`exec error: ${error}`);
        return;
      }
    //   console.log(`stdout: ${stdout}`);
    //   console.error(`stderr: ${stderr}`);
  
      // If you want to send the output back to React
    //   console.log(1, stdout)
      if (stdout === "invalid smarts"){
        return;
      }
      let jsonObject = JSON.parse(stdout);
    //   console.log(2, jsonObject)
      webviewPanel.webview.postMessage({
        command: 'pythonOutput',
        output: jsonObject
      });
    });
  }
  

let timeoutId;
function activate(context) {
    vscode.window.onDidChangeTextEditorSelection(event => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            const editor = event.textEditor;
            const selection = editor.selection;
            const code = editor.document.getText(selection);

            // Check if a valid selection exists (non-empty)
            if (selection.isEmpty || !code.trim()) return;

            if (!webviewPanel) {
                webviewPanel = vscode.window.createWebviewPanel(
                    'renderJsResult',
                    'Render JS Result',
                    vscode.ViewColumn.One,
                    { enableScripts: true }
                );

                const pathToReactApp = vscode.Uri.file(
                    path.join(context.extensionPath, 'rsmarts', 'build', 'index.html')
                );

                const reactAppUri = webviewPanel.webview.asWebviewUri(pathToReactApp);
                let htmlContent = fs.readFileSync(reactAppUri.fsPath, 'utf8');
                const assetPath = path.join(context.extensionPath, 'rsmarts', 'build', 'static');
                htmlContent = htmlContent.replace(/\.\/static/g, webviewPanel.webview.asWebviewUri(vscode.Uri.file(assetPath)).toString());

                webviewPanel.webview.html = htmlContent;

                webviewPanel.onDidDispose(() => {
                    webviewPanel = null;
                });
            }


            runPythonScript(code, context);
        }, 500);
    });
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}

