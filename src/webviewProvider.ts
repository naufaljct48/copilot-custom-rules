import * as vscode from "vscode";
import { FileManager } from "./fileManager";

export class RulesEditorProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "copilot-custom-rules-view";
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
          webviewView.webview.postMessage({
            type: "rulesLoaded",
            content: rules,
          });
          break;
        case "saveRules":
          try {
            await this.fileManager.saveCustomRules(data.content);
            await this.fileManager.injectRules();
            vscode.window.showInformationMessage(
              "Rules saved and injected successfully!"
            );
          } catch (error) {
            vscode.window.showErrorMessage(`Failed to save rules: ${error}`);
          }
          break;
        case "resetRules":
          try {
            await this.fileManager.resetToDefault();
            const defaultRules = await this.fileManager.getCustomRules();
            webviewView.webview.postMessage({
              type: "rulesLoaded",
              content: defaultRules,
            });
          } catch (error) {
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
        vscode.postMessage({ type: 'loadRules' });

        saveBtn.addEventListener('click', () => {
            const content = editor.value;
            vscode.postMessage({
                type: 'saveRules',
                content: content
            });
            status.textContent = 'Saving...';
        });

        resetBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to reset to default rules? This will overwrite your current custom rules.')) {
                vscode.postMessage({ type: 'resetRules' });
                status.textContent = 'Resetting...';
            }
        });

        // Listen for messages from the extension
        window.addEventListener('message', event => {
            const message = event.data;
            switch (message.type) {
                case 'rulesLoaded':
                    editor.value = message.content;
                    editor.placeholder = 'Enter your custom rules here...';
                    status.textContent = 'Rules loaded';
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
