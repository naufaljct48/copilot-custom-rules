import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

export class GitignoreManager {
  private workspaceRoot: string;
  private gitignorePath: string;

  constructor() {
    this.workspaceRoot =
      vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || "";
    this.gitignorePath = path.join(this.workspaceRoot, ".gitignore");
  }
  async updateGitignore(): Promise<void> {
    try {
      const instructionsPattern = ".github/instructions/";
      const taskmasterPattern = ".taskmaster/";
      let gitignoreContent = "";

      // Read existing .gitignore if it exists
      if (fs.existsSync(this.gitignorePath)) {
        gitignoreContent = await fs.promises.readFile(
          this.gitignorePath,
          "utf8"
        );
      }

      let hasChanges = false;
      let newContent = gitignoreContent;

      // Check and add instructions pattern
      if (!gitignoreContent.includes(instructionsPattern)) {
        newContent =
          newContent.trim() +
          (newContent.trim() ? "\n\n" : "") +
          "# Copilot Custom Rules - Instructions files\n" +
          instructionsPattern +
          "\n";
        hasChanges = true;
      }

      // Check and add taskmaster pattern
      if (!gitignoreContent.includes(taskmasterPattern)) {
        newContent =
          newContent.trim() +
          (newContent.includes("# Copilot Custom Rules") ? "\n" : "\n\n") +
          "# Task Master - Local task management files\n" +
          taskmasterPattern +
          "\n";
        hasChanges = true;
      }

      if (hasChanges) {
        await fs.promises.writeFile(this.gitignorePath, newContent, "utf8");
        console.log("Updated .gitignore with patterns");
      } else {
        console.log("Gitignore patterns already exist");
      }
    } catch (error) {
      console.error("Error updating .gitignore:", error);
      vscode.window.showWarningMessage(`Failed to update .gitignore: ${error}`);
    }
  }
  async removeFromGitignore(): Promise<void> {
    try {
      if (!fs.existsSync(this.gitignorePath)) {
        return;
      }

      let gitignoreContent = await fs.promises.readFile(
        this.gitignorePath,
        "utf8"
      );

      // Remove both patterns and comments
      const lines = gitignoreContent.split("\n");
      const filteredLines = lines.filter(
        (line) =>
          !line.includes(".github/instructions/") &&
          !line.includes(".taskmaster/") &&
          !line.includes("# Copilot Custom Rules - Instructions files") &&
          !line.includes("# Task Master - Local task management files")
      );

      const newContent = filteredLines.join("\n").replace(/\n{3,}/g, "\n\n");

      await fs.promises.writeFile(this.gitignorePath, newContent, "utf8");

      console.log("Removed patterns from .gitignore");
    } catch (error) {
      console.error("Error removing from .gitignore:", error);
    }
  }
}
