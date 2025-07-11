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

  async isModifiedFromDefault(): Promise<boolean> {
    try {
      if (!fs.existsSync(this.instructionsFile)) {
        return false; // No file means not modified
      }

      const content = await fs.promises.readFile(this.instructionsFile, "utf8");
      const trimmedContent = content.trim();
      const trimmedDefault = DEFAULT_RULES.trim();

      const isModified = trimmedContent !== trimmedDefault;
      console.log(
        "FileManager.isModifiedFromDefault: Content modified from default:",
        isModified
      );

      return isModified;
    } catch (error) {
      console.error("FileManager.isModifiedFromDefault: Error:", error);
      return false;
    }
  }

  async shouldOverrideWithDefault(): Promise<boolean> {
    try {
      // Check if file exists
      if (!fs.existsSync(this.instructionsFile)) {
        return true; // Should create with default
      }

      // Check if content is empty
      const content = await fs.promises.readFile(this.instructionsFile, "utf8");
      const trimmedContent = content.trim();

      if (!trimmedContent) {
        console.log(
          "FileManager.shouldOverrideWithDefault: Empty file, should override"
        );
        return true;
      }

      // If content exists and is different from default, don't override
      // This preserves user modifications
      const isModified = await this.isModifiedFromDefault();
      const shouldOverride = !isModified;

      console.log(
        "FileManager.shouldOverrideWithDefault: Should override:",
        shouldOverride,
        "Is modified:",
        isModified
      );

      return shouldOverride;
    } catch (error) {
      console.error("FileManager.shouldOverrideWithDefault: Error:", error);
      return true; // Default to override on error
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

        // Check if content is empty or just whitespace
        if (!trimmedContent) {
          console.log(
            "FileManager.getCustomRules: Empty file, using DEFAULT_RULES"
          );
          await this.saveCustomRules(DEFAULT_RULES);
          return DEFAULT_RULES;
        }

        // Return existing content (preserves user modifications)
        return trimmedContent;
      } else {
        console.log(
          "FileManager.getCustomRules: File does not exist, creating with DEFAULT_RULES"
        );
        await this.ensureDirectoryExists(this.instructionsDir);
        await this.saveCustomRules(DEFAULT_RULES);
        return DEFAULT_RULES;
      }
    } catch (error) {
      console.error("Error reading custom rules:", error);
      return DEFAULT_RULES;
    }
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

      // Check if should override with default rules
      const shouldOverride = await this.shouldOverrideWithDefault();

      if (shouldOverride) {
        console.log("FileManager.injectRules: Overriding with DEFAULT_RULES");
        await fs.promises.writeFile(
          this.instructionsFile,
          DEFAULT_RULES,
          "utf8"
        );
        vscode.window.showInformationMessage(
          "Instructions file updated with default rules!"
        );
      } else {
        // File exists and has custom content - preserve it
        const existingContent = await fs.promises.readFile(
          this.instructionsFile,
          "utf8"
        );
        console.log(
          "FileManager.injectRules: Preserving custom content. Length:",
          existingContent.length
        );

        vscode.window.showInformationMessage(
          "Custom instructions preserved - no changes made."
        );
      }
    } catch (error) {
      console.error("Error injecting rules:", error);
      vscode.window.showErrorMessage(`Failed to inject rules: ${error}`);
    }
  }
  async resetToDefault(): Promise<void> {
    try {
      console.log("FileManager.resetToDefault: Starting reset process");

      // Get fresh DEFAULT_RULES directly from the module
      const { DEFAULT_RULES: originalRules } = require("./defaultRules");

      console.log(
        "FileManager.resetToDefault: DEFAULT_RULES length:",
        DEFAULT_RULES.length
      );
      console.log(
        "FileManager.resetToDefault: DEFAULT_RULES preview:",
        DEFAULT_RULES.substring(0, 100) + "..."
      );
      console.log(
        "FileManager.resetToDefault: originalRules length:",
        originalRules.length
      );
      console.log(
        "FileManager.resetToDefault: originalRules preview:",
        originalRules.substring(0, 100) + "..."
      );

      // Ensure directory exists
      await this.ensureDirectoryExists(this.instructionsDir);

      // Use the direct import to ensure we get the English version
      const rulesContent = originalRules;

      console.log(
        "FileManager.resetToDefault: Writing to file with length:",
        rulesContent.length
      );
      console.log(
        "FileManager.resetToDefault: Writing preview:",
        rulesContent.substring(0, 100) + "..."
      );

      // Write to file
      await fs.promises.writeFile(this.instructionsFile, rulesContent, "utf8");

      console.log("FileManager.resetToDefault: Reset completed successfully");
      console.log("FileManager.resetToDefault: Verifying file content...");

      // Verify file content was updated correctly
      if (fs.existsSync(this.instructionsFile)) {
        const content = await fs.promises.readFile(
          this.instructionsFile,
          "utf8"
        );
        console.log(
          "FileManager.resetToDefault: File content length after reset:",
          content.length
        );
        console.log(
          "FileManager.resetToDefault: Content preview after reset:",
          content.substring(0, 100) + "..."
        );

        // Double check if content equals rulesContent
        const isEqual = content.trim() === rulesContent.trim();
        console.log(
          "FileManager.resetToDefault: Content equals rulesContent:",
          isEqual
        );

        if (!isEqual) {
          console.error(
            "FileManager.resetToDefault: Content mismatch after reset!"
          );
          // Try once more with synchronous approach
          console.log(
            "FileManager.resetToDefault: Trying direct synchronous write..."
          );
          fs.writeFileSync(this.instructionsFile, rulesContent, "utf8");

          // Verify again
          const contentAfterSync = fs.readFileSync(
            this.instructionsFile,
            "utf8"
          );
          console.log(
            "FileManager.resetToDefault: Content after sync write matches:",
            contentAfterSync.trim() === rulesContent.trim()
          );
        }
      }

      vscode.window.showInformationMessage(
        "Rules reset to default successfully!"
      );

      return Promise.resolve(); // Ensure we always return a resolved promise
    } catch (error) {
      console.error("Error resetting rules:", error);
      vscode.window.showErrorMessage(`Failed to reset rules: ${error}`);
      throw error; // Re-throw to let webview handle the error
    }
  }
  async getDefaultRules(): Promise<string> {
    console.log(
      "FileManager.getDefaultRules: Returning DEFAULT_RULES directly"
    );
    console.log(
      "FileManager.getDefaultRules: DEFAULT_RULES length:",
      DEFAULT_RULES.length
    );
    console.log(
      "FileManager.getDefaultRules: DEFAULT_RULES preview:",
      DEFAULT_RULES.substring(0, 100) + "..."
    );

    // Make sure we return the original value from the DEFAULT_RULES constant without manipulation
    // Directly import it from the module to ensure we get the English version
    const { DEFAULT_RULES: originalRules } = require("./defaultRules");

    console.log(
      "FileManager.getDefaultRules: originalRules length:",
      originalRules.length
    );
    console.log(
      "FileManager.getDefaultRules: originalRules preview:",
      originalRules.substring(0, 100) + "..."
    );

    // Compare with the imported DEFAULT_RULES to ensure they match
    const areEqual = originalRules === DEFAULT_RULES;
    console.log(
      "FileManager.getDefaultRules: originalRules === DEFAULT_RULES:",
      areEqual
    );

    if (!areEqual) {
      console.warn(
        "FileManager.getDefaultRules: Rules mismatch detected, using original import"
      );
      return originalRules;
    }

    return DEFAULT_RULES;
  }

  getInstructionsFilePath(): string {
    return this.instructionsFile;
  }

  getCustomRulesFilePath(): string {
    return this.instructionsFile;
  }
}
