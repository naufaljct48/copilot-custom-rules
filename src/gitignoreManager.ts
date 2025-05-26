import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class GitignoreManager {
    private workspaceRoot: string;
    private gitignorePath: string;

    constructor() {
        this.workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || '';
        this.gitignorePath = path.join(this.workspaceRoot, '.gitignore');
    }

    async updateGitignore(): Promise<void> {
        try {
            const gitignorePattern = '.github/instructions/';
            let gitignoreContent = '';

            // Read existing .gitignore if it exists
            if (fs.existsSync(this.gitignorePath)) {
                gitignoreContent = await fs.promises.readFile(this.gitignorePath, 'utf8');
            }

            // Check if pattern already exists
            if (gitignoreContent.includes(gitignorePattern)) {
                console.log('Gitignore pattern already exists');
                return;
            }

            // Add pattern to .gitignore
            const newContent = gitignoreContent.trim() + 
                (gitignoreContent.trim() ? '\n\n' : '') + 
                '# Copilot Custom Rules - Instructions files\n' +
                gitignorePattern + '\n';

            await fs.promises.writeFile(this.gitignorePath, newContent, 'utf8');
            
            console.log('Updated .gitignore with instructions pattern');
        } catch (error) {
            console.error('Error updating .gitignore:', error);
            vscode.window.showWarningMessage(`Failed to update .gitignore: ${error}`);
        }
    }

    async removeFromGitignore(): Promise<void> {
        try {
            if (!fs.existsSync(this.gitignorePath)) {
                return;
            }

            let gitignoreContent = await fs.promises.readFile(this.gitignorePath, 'utf8');
            
            // Remove the pattern and comment
            const lines = gitignoreContent.split('\n');
            const filteredLines = lines.filter(line => 
                !line.includes('.github/instructions/') && 
                !line.includes('# Copilot Custom Rules - Instructions files')
            );

            const newContent = filteredLines.join('\n').replace(/\n{3,}/g, '\n\n');
            
            await fs.promises.writeFile(this.gitignorePath, newContent, 'utf8');
            
            console.log('Removed instructions pattern from .gitignore');
        } catch (error) {
            console.error('Error removing from .gitignore:', error);
        }
    }
}
