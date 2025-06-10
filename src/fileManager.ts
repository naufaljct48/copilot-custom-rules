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

  async validateFileIntegrity(): Promise<boolean> {
    try {
      if (!fs.existsSync(this.instructionsFile)) {
        console.log("FileManager.validateFileIntegrity: File doesn't exist");
        return false;
      }

      const content = await fs.promises.readFile(this.instructionsFile, "utf8");
      const isValid = content.length > 0;
      console.log(
        "FileManager.validateFileIntegrity: File valid:",
        isValid,
        "Length:",
        content.length
      );
      return isValid;
    } catch (error) {
      console.error("FileManager.validateFileIntegrity: Error:", error);
      return false;
    }
  }
  async getCustomRules(): Promise<string> {
    try {
      if (fs.existsSync(this.instructionsFile)) {
        const content = await fs.promises.readFile(
          this.instructionsFile,
          "utf8"
        );
        const trimmedContent = content.trim();

        // Debug logging
        console.log(
          "FileManager.getCustomRules: File exists, content length:",
          trimmedContent.length
        );
        console.log(
          "FileManager.getCustomRules: Content preview:",
          trimmedContent.substring(0, 100) + "..."
        );

        // Return content even if it's different from DEFAULT_RULES
        // This preserves user's custom changes
        return trimmedContent || DEFAULT_RULES;
      } else {
        console.log(
          "FileManager.getCustomRules: File does not exist, returning DEFAULT_RULES"
        );
      }
    } catch (error) {
      console.error("Error reading custom rules:", error);
    }
    // Only return DEFAULT_RULES if file doesn't exist
    return DEFAULT_RULES;
  }
  async saveCustomRules(content: string): Promise<void> {
    try {
      console.log(
        "FileManager.saveCustomRules: Saving content, length:",
        content.length
      );
      console.log(
        "FileManager.saveCustomRules: Saving to file:",
        this.instructionsFile
      );
      await this.ensureDirectoryExists(this.instructionsDir);
      await fs.promises.writeFile(this.instructionsFile, content, "utf8");
      console.log("FileManager.saveCustomRules: Save completed successfully");
    } catch (error) {
      console.error("Error saving custom rules:", error);
      throw error;
    }
  }
  async injectRules(): Promise<void> {
    try {
      // Ensure .github/instructions directory exists
      await this.ensureDirectoryExists(this.instructionsDir);

      // Check if instructions file exists
      if (!fs.existsSync(this.instructionsFile)) {
        // Only create with default rules if file doesn't exist
        console.log(
          "FileManager.injectRules: File doesn't exist, creating with DEFAULT_RULES"
        );
        await fs.promises.writeFile(
          this.instructionsFile,
          DEFAULT_RULES,
          "utf8"
        );
        vscode.window.showInformationMessage(
          "Custom rules file created with default rules!"
        );
      } else {
        // File exists - preserve existing content, NEVER overwrite
        const existingContent = await fs.promises.readFile(
          this.instructionsFile,
          "utf8"
        );
        console.log(
          "FileManager.injectRules: File exists, preserving content. Length:",
          existingContent.length
        );
        console.log(
          "FileManager.injectRules: Content preview:",
          existingContent.substring(0, 100) + "..."
        );

        // Do NOT write anything - just ensure directory exists
        vscode.window.showInformationMessage(
          "Custom rules file ready! Your custom rules are preserved."
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
