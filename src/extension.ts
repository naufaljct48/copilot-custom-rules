import * as vscode from 'vscode';
import { FileManager } from './fileManager';
import { GitignoreManager } from './gitignoreManager';
import { RulesEditorProvider } from './webviewProvider';

let fileManager: FileManager;
let gitignoreManager: GitignoreManager;

export function activate(context: vscode.ExtensionContext) {
    console.log('Copilot Custom Rules extension is now active!');

    // Initialize managers
    fileManager = new FileManager();
    gitignoreManager = new GitignoreManager();

    // Register webview provider
    const provider = new RulesEditorProvider(context.extensionUri, fileManager);
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(RulesEditorProvider.viewType, provider)
    );

    // Register commands
    const openRulesEditor = vscode.commands.registerCommand('copilot-custom-rules.openRulesEditor', () => {
        vscode.commands.executeCommand('workbench.view.explorer');
        vscode.commands.executeCommand('copilot-custom-rules.focus');
    });

    const injectRules = vscode.commands.registerCommand('copilot-custom-rules.injectRules', async () => {
        await fileManager.injectRules();
        
        const config = vscode.workspace.getConfiguration('copilot-custom-rules');
        if (config.get('updateGitignore', true)) {
            await gitignoreManager.updateGitignore();
        }
    });

    const resetToDefault = vscode.commands.registerCommand('copilot-custom-rules.resetToDefault', async () => {
        const result = await vscode.window.showWarningMessage(
            'Are you sure you want to reset to default rules? This will overwrite your current custom rules.',
            'Yes', 'No'
        );
        
        if (result === 'Yes') {
            await fileManager.resetToDefault();
        }
    });

    context.subscriptions.push(openRulesEditor, injectRules, resetToDefault);

    // Auto-inject on startup if enabled
    const config = vscode.workspace.getConfiguration('copilot-custom-rules');
    if (config.get('autoInject', true)) {
        setTimeout(async () => {
            try {
                await fileManager.injectRules();
                
                if (config.get('updateGitignore', true)) {
                    await gitignoreManager.updateGitignore();
                }
                
                console.log('Auto-injection completed successfully');
            } catch (error) {
                console.error('Auto-injection failed:', error);
            }
        }, 2000); // Wait 2 seconds after startup
    }

    // Show welcome message on first activation
    const hasShownWelcome = context.globalState.get('hasShownWelcome', false);
    if (!hasShownWelcome) {
        vscode.window.showInformationMessage(
            'Copilot Custom Rules is now active! Custom rules have been injected automatically.',
            'Open Rules Editor'
        ).then(selection => {
            if (selection === 'Open Rules Editor') {
                vscode.commands.executeCommand('copilot-custom-rules.openRulesEditor');
            }
        });
        context.globalState.update('hasShownWelcome', true);
    }
}

export function deactivate() {
    console.log('Copilot Custom Rules extension is now deactivated');
}
