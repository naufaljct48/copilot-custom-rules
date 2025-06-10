import * as vscode from "vscode";
import { FileManager } from "./fileManager";

export class RulesEditorProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "copilot-custom-rules-editor";
  private _view?: vscode.WebviewView;
  private fileManager: FileManager;

  constructor(
    private readonly _extensionUri: vscode.Uri,
    fileManager: FileManager
  ) {
    this.fileManager = fileManager;
  }

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage(async (data) => {
      switch (data.type) {
        case "loadRules":
          const rules = await this.fileManager.getCustomRules();
          console.log(
            "WebView.loadRules: Loading rules, length:",
            rules.length
          );
          webviewView.webview.postMessage({
            type: "rulesLoaded",
            content: rules,
          });
          break;
        case "saveRules":
          try {
            console.log(
              "WebView.saveRules: Saving rules, length:",
              data.content.length
            );
            await this.fileManager.saveCustomRules(data.content);
            await this.fileManager.injectRules();
            console.log("WebView.saveRules: Save and inject completed");
            vscode.window.showInformationMessage(
              "Rules saved and injected successfully!"
            );
            webviewView.webview.postMessage({
              type: "saveCompleted",
              success: true,
            });
          } catch (error) {
            console.error("WebView.saveRules: Error:", error);
            vscode.window.showErrorMessage(`Failed to save rules: ${error}`);
            webviewView.webview.postMessage({
              type: "saveCompleted",
              success: false,
            });
          }
          break;
        case "resetRules":
          try {
            console.log("WebView.resetRules: Starting reset process");
            await this.fileManager.resetToDefault();
            // Get DEFAULT_RULES directly instead of reading from file
            const defaultRules = await this.fileManager.getDefaultRules();
            console.log(
              "WebView.resetRules: Loading default rules, length:",
              defaultRules.length
            );
            webviewView.webview.postMessage({
              type: "rulesLoaded",
              content: defaultRules,
            });
            console.log(
              "WebView.resetRules: Reset completed and webview updated"
            );
          } catch (error) {
            console.error("WebView.resetRules: Error:", error);
            vscode.window.showErrorMessage(`Failed to reset rules: ${error}`);
          }
          break;
      }
    });
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Copilot Custom Rules Editor</title>
    <style>
        body {
            font-family: var(--vscode-font-family);
            font-size: var(--vscode-font-size);
            color: var(--vscode-foreground);
            background-color: var(--vscode-editor-background);
            margin: 0;
            padding: 10px;
        }

        .container {
            display: flex;
            flex-direction: column;
            height: 100vh;
        }

        .header {
            margin-bottom: 10px;
        }

        .title {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 10px;
        }

        .buttons {
            display: flex;
            gap: 5px;
            margin-bottom: 10px;
        }

        button {
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            padding: 6px 12px;
            border-radius: 2px;
            cursor: pointer;
            font-size: 12px;
        }

        button:hover {
            background-color: var(--vscode-button-hoverBackground);
        }

        .secondary {
            background-color: var(--vscode-button-secondaryBackground);
            color: var(--vscode-button-secondaryForeground);
        }

        .secondary:hover {
            background-color: var(--vscode-button-secondaryHoverBackground);
        }

        textarea {
            flex: 1;
            width: 100%;
            background-color: var(--vscode-input-background);
            color: var(--vscode-input-foreground);
            border: 1px solid var(--vscode-input-border);
            font-family: var(--vscode-editor-font-family);
            font-size: var(--vscode-editor-font-size);
            padding: 8px;
            resize: none;
            outline: none;
        }

        textarea:focus {
            border-color: var(--vscode-focusBorder);
        }

        .status {
            margin-top: 10px;
            font-size: 12px;
            color: var(--vscode-descriptionForeground);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="title">Custom Rules Editor</div>
            <div class="buttons">
                <button id="saveBtn">Save & Inject</button>
                <button id="resetBtn" class="secondary">Reset to Default</button>
            </div>
        </div>
        <textarea id="rulesEditor" placeholder="Loading rules..."></textarea>
        <div class="status" id="status">Ready</div>
    </div>

    <script>
        const vscode = acquireVsCodeApi();
        const editor = document.getElementById('rulesEditor');
        const saveBtn = document.getElementById('saveBtn');
        const resetBtn = document.getElementById('resetBtn');
        const status = document.getElementById('status');

        // Load rules on startup
        vscode.postMessage({ type: 'loadRules' });        saveBtn.addEventListener('click', () => {
            const content = editor.value;
            vscode.postMessage({
                type: 'saveRules',
                content: content
            });
            status.textContent = 'Saving rules...';
            saveBtn.disabled = true; // Disable during save
        });        resetBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to reset to default rules? This will overwrite your current custom rules.')) {
                console.log('WebView: Reset button clicked, sending resetRules message');
                vscode.postMessage({ type: 'resetRules' });
                status.textContent = 'Resetting to default rules...';
                editor.disabled = true; // Disable editor during reset
                resetBtn.disabled = true; // Disable button during reset
                saveBtn.disabled = true; // Disable save button during reset
            }
        });

        // Listen for messages from the extension
        window.addEventListener('message', event => {
            const message = event.data;
            switch (message.type) {                case 'rulesLoaded':
                    console.log('WebView: Received rulesLoaded message, content length:', message.content?.length);
                    console.log('WebView: Content preview:', message.content?.substring(0, 100) + '...');
                    editor.value = message.content;
                    editor.placeholder = 'Enter your custom rules here...';
                    editor.disabled = false; // Re-enable editor
                    resetBtn.disabled = false; // Re-enable reset button
                    saveBtn.disabled = false; // Re-enable save button
                    status.textContent = 'Rules loaded';
                    console.log('WebView: Rules loaded successfully, editor updated');
                    break;
                case 'saveCompleted':
                    saveBtn.disabled = false; // Re-enable save button
                    if (message.success) {
                        status.textContent = 'Rules saved successfully';
                    } else {
                        status.textContent = 'Failed to save rules';
                    }
                    break;
            }
        });

        // Auto-save indicator
        editor.addEventListener('input', () => {
            status.textContent = 'Modified (unsaved)';
        });
    </script>
</body>
</html>`;
  }
}
