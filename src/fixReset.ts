// Function to manually reset rules to default - can be run from command palette
import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { DEFAULT_RULES } from "./defaultRules";

export function manualResetToDefault(): void {
  try {
    // Dapatkan path workspace root
    const workspaceRoot =
      vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || "";
    if (!workspaceRoot) {
      vscode.window.showErrorMessage("No workspace folder is open");
      return;
    }

    // Path ke file instruksi
    const instructionsDir = path.join(workspaceRoot, ".github", "instructions");
    const instructionsFile = path.join(
      instructionsDir,
      "copilot.instructions.md"
    );

    // Pastikan direktori ada
    if (!fs.existsSync(instructionsDir)) {
      fs.mkdirSync(instructionsDir, { recursive: true });
    }

    // Log informasi default rules
    console.log("Manual Reset: DEFAULT_RULES length:", DEFAULT_RULES.length);
    console.log(
      "Manual Reset: DEFAULT_RULES preview:",
      DEFAULT_RULES.substring(0, 100) + "..."
    );

    // Tulis default rules ke file
    fs.writeFileSync(instructionsFile, DEFAULT_RULES, "utf8");
    console.log("Manual Reset: File updated successfully");

    // Verifikasi konten file
    const content = fs.readFileSync(instructionsFile, "utf8");
    console.log(
      "Manual Reset: File content length after reset:",
      content.length
    );
    console.log(
      "Manual Reset: File content preview after reset:",
      content.substring(0, 100) + "..."
    );
    console.log(
      "Manual Reset: Content equals DEFAULT_RULES:",
      content === DEFAULT_RULES
    );

    // Tampilkan notifikasi
    vscode.window.showInformationMessage(
      "Manual reset to default rules completed successfully!"
    );

    // Reload semua editor yang terbuka
    vscode.commands.executeCommand("workbench.action.files.revert");
  } catch (error) {
    console.error("Manual Reset: Error:", error);
    vscode.window.showErrorMessage(`Manual reset failed: ${error}`);
  }
}
