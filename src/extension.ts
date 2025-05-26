import * as vscode from "vscode";
import { FileManager } from "./fileManager";
import { GitignoreManager } from "./gitignoreManager";
import { RulesEditorProvider } from "./webviewProvider";
import { CopilotRulesTreeDataProvider } from "./treeDataProvider";

let fileManager: FileManager;
let gitignoreManager: GitignoreManager;

export function activate(context: vscode.ExtensionContext) {
  console.log("Copilot Custom Rules extension is now active!");

  // Initialize managers
  fileManager = new FileManager();
  gitignoreManager = new GitignoreManager();

  // Register tree data provider
  const treeDataProvider = new CopilotRulesTreeDataProvider(fileManager);
  vscode.window.createTreeView("copilot-custom-rules-view", {
    treeDataProvider: treeDataProvider,
    showCollapseAll: false,
  });

  // Register webview provider
  const provider = new RulesEditorProvider(context.extensionUri, fileManager);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "copilot-custom-rules-editor",
      provider,
      {
        webviewOptions: {
          retainContextWhenHidden: true,
        },
      }
    )
  );

  // Register commands
  const openRulesEditor = vscode.commands.registerCommand(
    "copilot-custom-rules.openRulesEditor",
    async () => {
      // Create a webview panel for rules editing
      const panel = vscode.window.createWebviewPanel(
        "copilotRulesEditor",
        "Copilot Custom Rules Editor",
        vscode.ViewColumn.One,
        {
          enableScripts: true,
          retainContextWhenHidden: true,
        }
      );

      // Get current rules
      const currentRules = await fileManager.getCustomRules();

      panel.webview.html = getWebviewContent(currentRules);

      // Handle messages from the webview
      panel.webview.onDidReceiveMessage(
        async (message) => {
          switch (message.command) {
            case "save":
              try {
                await fileManager.saveCustomRules(message.content);
                await fileManager.injectRules();
                vscode.window.showInformationMessage(
                  "Rules saved and injected successfully!"
                );
              } catch (error) {
                vscode.window.showErrorMessage(
                  `Failed to save rules: ${error}`
                );
              }
              break;
            case "reset":
              try {
                await fileManager.resetToDefault();
                const defaultRules = await fileManager.getCustomRules();
                panel.webview.postMessage({
                  command: "loadRules",
                  content: defaultRules,
                });
                vscode.window.showInformationMessage(
                  "Rules reset to default successfully!"
                );
              } catch (error) {
                vscode.window.showErrorMessage(
                  `Failed to reset rules: ${error}`
                );
              }
              break;
          }
        },
        undefined,
        context.subscriptions
      );
    }
  );

  const injectRules = vscode.commands.registerCommand(
    "copilot-custom-rules.injectRules",
    async () => {
      await fileManager.injectRules();

      const config = vscode.workspace.getConfiguration("copilot-custom-rules");
      if (config.get("updateGitignore", true)) {
        await gitignoreManager.updateGitignore();
      }
    }
  );

  const resetToDefault = vscode.commands.registerCommand(
    "copilot-custom-rules.resetToDefault",
    async () => {
      const result = await vscode.window.showWarningMessage(
        "Are you sure you want to reset to default rules? This will overwrite your current custom rules.",
        "Yes",
        "No"
      );

      if (result === "Yes") {
        await fileManager.resetToDefault();
      }
    }
  );

  const editRules = vscode.commands.registerCommand(
    "copilot-custom-rules.edit",
    async () => {
      const customRulesPath = fileManager.getCustomRulesFilePath();

      // Ensure custom rules file exists
      try {
        await fileManager.getCustomRules();
      } catch (error) {
        // File doesn't exist, create it with default rules
        await fileManager.resetToDefault();
      }

      // Open the custom rules file
      const document = await vscode.workspace.openTextDocument(customRulesPath);
      await vscode.window.showTextDocument(document);
    }
  );

  const openSettings = vscode.commands.registerCommand(
    "copilot-custom-rules.settings",
    () => {
      vscode.commands.executeCommand(
        "workbench.action.openSettings",
        "copilot-custom-rules"
      );
    }
  );

  context.subscriptions.push(
    openRulesEditor,
    injectRules,
    resetToDefault,
    editRules,
    openSettings
  );

  // Auto-inject on startup if enabled
  const config = vscode.workspace.getConfiguration("copilot-custom-rules");
  if (config.get("autoInject", true)) {
    setTimeout(async () => {
      try {
        await fileManager.injectRules();

        if (config.get("updateGitignore", true)) {
          await gitignoreManager.updateGitignore();
        }

        console.log("Auto-injection completed successfully");
      } catch (error) {
        console.error("Auto-injection failed:", error);
      }
    }, 2000); // Wait 2 seconds after startup
  }

  // Show welcome message on first activation
  const hasShownWelcome = context.globalState.get("hasShownWelcome", false);
  if (!hasShownWelcome) {
    vscode.window
      .showInformationMessage(
        "Copilot Custom Rules is now active! Custom rules have been injected automatically.",
        "Open Rules Editor"
      )
      .then((selection) => {
        if (selection === "Open Rules Editor") {
          vscode.commands.executeCommand(
            "copilot-custom-rules.openRulesEditor"
          );
        }
      });
    context.globalState.update("hasShownWelcome", true);
  }
}

export function deactivate() {
  console.log("Copilot Custom Rules extension is now deactivated");
}

function getWebviewContent(currentRules: string): string {
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
            padding: 20px;
        }

        .container {
            display: flex;
            flex-direction: column;
            height: 100vh;
            max-width: 1200px;
            margin: 0 auto;
        }

        .header {
            margin-bottom: 20px;
            text-align: center;
        }

        .title {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
            color: var(--vscode-titleBar-activeForeground);
        }

        .subtitle {
            font-size: 14px;
            color: var(--vscode-descriptionForeground);
            margin-bottom: 20px;
        }

        .buttons {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
            justify-content: center;
        }

        button {
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            min-width: 120px;
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
            padding: 15px;
            resize: none;
            outline: none;
            border-radius: 4px;
            line-height: 1.5;
        }

        textarea:focus {
            border-color: var(--vscode-focusBorder);
        }

        .status {
            margin-top: 15px;
            font-size: 12px;
            color: var(--vscode-descriptionForeground);
            text-align: center;
            padding: 10px;
            background-color: var(--vscode-badge-background);
            border-radius: 4px;
        }

        .instructions {
            background-color: var(--vscode-textBlockQuote-background);
            border-left: 4px solid var(--vscode-textBlockQuote-border);
            padding: 15px;
            margin-bottom: 20px;
            border-radius: 4px;
        }

        .instructions h3 {
            margin-top: 0;
            color: var(--vscode-titleBar-activeForeground);
        }

        .instructions ul {
            margin: 10px 0;
            padding-left: 20px;
        }

        .instructions li {
            margin: 5px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="title">🤖 Copilot Custom Rules Editor</div>
            <div class="subtitle">Edit your custom AI agent rules and instructions</div>
        </div>

        <div class="instructions">
            <h3>📋 Instructions:</h3>
            <ul>
                <li><strong>Edit Rules:</strong> Modify the rules in the textarea below</li>
                <li><strong>Save & Inject:</strong> Click to save rules and inject them to .github/instructions/</li>
                <li><strong>Reset to Default:</strong> Restore the original AI agent rules</li>
                <li><strong>Auto-Injection:</strong> Rules are automatically injected on VS Code startup</li>
            </ul>
        </div>

        <div class="buttons">
            <button id="saveBtn">💾 Save & Inject</button>
            <button id="resetBtn" class="secondary">🔄 Reset to Default</button>
        </div>

        <textarea id="rulesEditor" placeholder="Loading rules...">${currentRules}</textarea>

        <div class="status" id="status">Ready to edit rules</div>
    </div>

    <script>
        const vscode = acquireVsCodeApi();
        const editor = document.getElementById('rulesEditor');
        const saveBtn = document.getElementById('saveBtn');
        const resetBtn = document.getElementById('resetBtn');
        const status = document.getElementById('status');

        saveBtn.addEventListener('click', () => {
            const content = editor.value;
            vscode.postMessage({
                command: 'save',
                content: content
            });
            status.textContent = 'Saving and injecting rules...';
        });

        resetBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to reset to default rules? This will overwrite your current custom rules.')) {
                vscode.postMessage({ command: 'reset' });
                status.textContent = 'Resetting to default rules...';
            }
        });

        // Listen for messages from the extension
        window.addEventListener('message', event => {
            const message = event.data;
            switch (message.command) {
                case 'loadRules':
                    editor.value = message.content;
                    status.textContent = 'Rules loaded successfully';
                    break;
            }
        });

        // Auto-save indicator
        editor.addEventListener('input', () => {
            status.textContent = 'Modified (unsaved changes)';
        });

        // Set initial status
        status.textContent = 'Rules loaded - Ready to edit';
    </script>
</body>
</html>`;
}
