import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { DEFAULT_RULES } from "./defaultRules";

export class FileManager {
  private workspaceRoot: string;
  private instructionsDir: string;
  private instructionsFile: string;

  constructor() {
    this.workspaceRoot =
      vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || "";
    this.instructionsDir = path.join(
      this.workspaceRoot,
      ".github",
      "instructions"
    );
    this.instructionsFile = path.join(
      this.instructionsDir,
      "copilot.instructions.md"
    );
  }

  async ensureDirectoryExists(dirPath: string): Promise<void> {
    if (!fs.existsSync(dirPath)) {
      await fs.promises.mkdir(dirPath, { recursive: true });
    }
  }

  async getCustomRules(): Promise<string> {
    try {
      if (fs.existsSync(this.instructionsFile)) {
        return await fs.promises.readFile(this.instructionsFile, "utf8");
      }
    } catch (error) {
      console.error("Error reading custom rules:", error);
    }
    return DEFAULT_RULES;
  }

  async saveCustomRules(content: string): Promise<void> {
    try {
      await this.ensureDirectoryExists(this.instructionsDir);
      await fs.promises.writeFile(this.instructionsFile, content, "utf8");
    } catch (error) {
      console.error("Error saving custom rules:", error);
      throw error;
    }
  }

  async injectRules(): Promise<void> {
    try {
      // Ensure .github/instructions directory exists
      await this.ensureDirectoryExists(this.instructionsDir);

      // If instructions file doesn't exist, create it with default rules
      if (!fs.existsSync(this.instructionsFile)) {
        await fs.promises.writeFile(
          this.instructionsFile,
          DEFAULT_RULES,
          "utf8"
        );
        vscode.window.showInformationMessage(
          "Custom rules file created successfully!"
        );
      } else {
        vscode.window.showInformationMessage(
          "Custom rules file already exists and is ready to use!"
        );
      }
    } catch (error) {
      console.error("Error ensuring rules file:", error);
      vscode.window.showErrorMessage(`Failed to ensure rules file: ${error}`);
    }
  }

  async resetToDefault(): Promise<void> {
    try {
      await this.saveCustomRules(DEFAULT_RULES);
      vscode.window.showInformationMessage(
        "Rules reset to default successfully!"
      );
    } catch (error) {
      console.error("Error resetting rules:", error);
      vscode.window.showErrorMessage(`Failed to reset rules: ${error}`);
    }
  }

  getInstructionsFilePath(): string {
    return this.instructionsFile;
  }

  getCustomRulesFilePath(): string {
    return this.instructionsFile;
  }
}
