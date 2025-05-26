import * as vscode from 'vscode';
import { FileManager } from './fileManager';

export class CopilotRulesTreeDataProvider implements vscode.TreeDataProvider<RuleItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<RuleItem | undefined | null | void> = new vscode.EventEmitter<RuleItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<RuleItem | undefined | null | void> = this._onDidChangeTreeData.event;

    constructor(private fileManager: FileManager) {}

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: RuleItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: RuleItem): Thenable<RuleItem[]> {
        if (!element) {
            return Promise.resolve([
                new RuleItem('📝 Edit Custom Rules', 'Edit your custom AI agent rules', vscode.TreeItemCollapsibleState.None, 'edit'),
                new RuleItem('🚀 Inject Rules Now', 'Inject custom rules to .github/instructions/', vscode.TreeItemCollapsibleState.None, 'inject'),
                new RuleItem('🔄 Reset to Default', 'Reset rules to default AI agent rules', vscode.TreeItemCollapsibleState.None, 'reset'),
                new RuleItem('⚙️ Settings', 'Open extension settings', vscode.TreeItemCollapsibleState.None, 'settings')
            ]);
        }
        return Promise.resolve([]);
    }
}

export class RuleItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly tooltip: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly action: string
    ) {
        super(label, collapsibleState);
        this.tooltip = tooltip;
        this.command = {
            command: `copilot-custom-rules.${action}`,
            title: label,
            arguments: [this]
        };
    }
}
