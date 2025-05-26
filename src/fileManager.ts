import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { DEFAULT_RULES } from './defaultRules';

export class FileManager {
    private workspaceRoot: string;
    private instructionsDir: string;
    private instructionsFile: string;
    private customRulesFile: string;

    constructor() {
        this.workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || '';
        this.instructionsDir = path.join(this.workspaceRoot, '.github', 'instructions');
        this.instructionsFile = path.join(this.instructionsDir, 'copilot.instructions.md');
        this.customRulesFile = path.join(this.workspaceRoot, '.vscode', 'copilot-custom-rules.md');
    }

    async ensureDirectoryExists(dirPath: string): Promise<void> {
        if (!fs.existsSync(dirPath)) {
            await fs.promises.mkdir(dirPath, { recursive: true });
        }
    }

    async getCustomRules(): Promise<string> {
        try {
            if (fs.existsSync(this.customRulesFile)) {
                return await fs.promises.readFile(this.customRulesFile, 'utf8');
            }
        } catch (error) {
            console.error('Error reading custom rules:', error);
        }
        return DEFAULT_RULES;
    }

    async saveCustomRules(content: string): Promise<void> {
        try {
            await this.ensureDirectoryExists(path.dirname(this.customRulesFile));
            await fs.promises.writeFile(this.customRulesFile, content, 'utf8');
        } catch (error) {
            console.error('Error saving custom rules:', error);
            throw error;
        }
    }

    async injectRules(): Promise<void> {
        try {
            const rules = await this.getCustomRules();
            
            // Ensure .github/instructions directory exists
            await this.ensureDirectoryExists(this.instructionsDir);
            
            // Write or update the instructions file
            await fs.promises.writeFile(this.instructionsFile, rules, 'utf8');
            
            vscode.window.showInformationMessage('Custom rules injected successfully!');
        } catch (error) {
            console.error('Error injecting rules:', error);
            vscode.window.showErrorMessage(`Failed to inject rules: ${error}`);
        }
    }

    async resetToDefault(): Promise<void> {
        try {
            await this.saveCustomRules(DEFAULT_RULES);
            await this.injectRules();
            vscode.window.showInformationMessage('Rules reset to default successfully!');
        } catch (error) {
            console.error('Error resetting rules:', error);
            vscode.window.showErrorMessage(`Failed to reset rules: ${error}`);
        }
    }

    getInstructionsFilePath(): string {
        return this.instructionsFile;
    }

    getCustomRulesFilePath(): string {
        return this.customRulesFile;
    }
}
