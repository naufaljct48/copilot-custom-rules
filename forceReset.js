/**
 * Force Reset Script untuk Copilot Custom Rules
 *
 * Script ini akan mereset rules ke default English version
 * dari defaultRules.ts.
 */

const fs = require("fs");
const path = require("path");

// Default rules yang akan digunakan untuk reset
const DEFAULT_RULES = `# AI Agent Rules

## Language and Communication

1.  Use the same language as the user input with clear and understandable communication.
2.  Provide direct answers without excessive explanation.
3.  Avoid technical terms without explanation.
4.  System used is Windows.

## Code Structure

1.  Use clear architecture (MVC, MVVM, Clean Architecture) as needed.
2.  Separate code based on function (components, services, models, utils).
3.  Apply DRY (Don't Repeat Yourself) principle.
4.  Implement modularization for easy maintenance.

## Task Master System

### Initialization and Setup
1.  **Check Directory**: Check if \`.taskmaster\` already exists in root project.
2.  **Auto-Initialize**: If not exists, create folder structure:
    \`\`\`
    .taskmaster/
    ├── config/settings.json
    ├── docs/prd.txt
    ├── tasks/task001.txt...task020.txt
    └── status/summary.md
    \`\`\`
3.  **Load Configuration**: Read settings.json to know project status.

### Task Breakdown Methodology
4.  **Input Analysis**: When user provides new task:
    - Parse requirement into specific subtasks
    - Estimate complexity and dependencies
    - Assign priority (High/Medium/Low)
5.  **Create Task Files**: Create files task001.txt to task020.txt with format:
    \`\`\`
    **Task ID**: 001
    **Title**: [Task Title]
    **Priority**: High/Medium/Low
    **Status**: pending/in-progress/completed/blocked/cancelled
    **Assigned**: AI Agent
    **Created**: YYYY-MM-DD
    **Updated**: YYYY-MM-DD
    
    ## Description
    [Detailed description]
    
    ## Acceptance Criteria
    - [ ] Criteria 1
    - [ ] Criteria 2
    
    ## Implementation Details
    [Technical details]
    
    ## Files Modified
    [List of files]
    
    ## Testing
    [Test cases]
    
    ## Notes
    [Additional notes]
    \`\`\`

### Execution Flow
6.  **Status Check**: Before starting, check all task status in \`.taskmaster/tasks/\`.
7.  **Work on Pending**: Select task with "pending" status based on priority.
8.  **Update Status**: Change status to "in-progress" when starting work.
9.  **Complete Tasks**: Mark as "completed" after finished.
10. **Track Progress**: Update summary.md with overall progress.

### File Management
11. **Consistent Format**: Use naming convention task001.txt, task002.txt, etc.
12. **Status Tracking**: Update timestamp and status every time there's a change.
13. **Dependencies**: Track task dependencies in implementation details.
14. **Documentation**: Update PRD if there are scope changes.
15. **Gitignore Management**: Ensure \`.taskmaster/\` is included in \`.gitignore\` to avoid committing local task files.

### Command Execution
16. **Full Control**: AI Agent has full access to run all commands.
17. **File Operations**: Create, read, update, delete files as needed.
18. **Tool Usage**: Use all available tools to complete tasks.
19. **Error Handling**: Handle errors with graceful degradation.`;

// Fungsi utama
async function resetToDefault() {
  try {
    // Tentukan path workspace (direktori saat ini)
    const workspaceRoot = process.cwd();
    console.log("Workspace root:", workspaceRoot);

    // Path ke file instructions
    const instructionsDir = path.join(workspaceRoot, ".github", "instructions");
    const instructionsFile = path.join(
      instructionsDir,
      "copilot.instructions.md"
    );
    console.log("Target file:", instructionsFile);

    // Pastikan direktori ada
    console.log("Creating directory if needed:", instructionsDir);
    if (!fs.existsSync(instructionsDir)) {
      fs.mkdirSync(instructionsDir, { recursive: true });
    }

    // Tulis default rules ke file
    console.log("Writing default rules...");
    console.log("Default rules length:", DEFAULT_RULES.length);
    console.log("Preview:", DEFAULT_RULES.substring(0, 100) + "...");

    fs.writeFileSync(instructionsFile, DEFAULT_RULES);
    console.log("File updated successfully!");

    // Verifikasi konten file setelah update
    if (fs.existsSync(instructionsFile)) {
      const content = fs.readFileSync(instructionsFile, "utf8");
      console.log("Verification - File content length:", content.length);
      console.log(
        "Verification - Content preview:",
        content.substring(0, 100) + "..."
      );
      console.log(
        "Verification - Content matches DEFAULT_RULES:",
        content === DEFAULT_RULES
      );

      if (content !== DEFAULT_RULES) {
        console.log(
          "WARNING: Content verification failed! Content does not match DEFAULT_RULES exactly."
        );
      } else {
        console.log(
          "SUCCESS: Content verification passed! File contains exact DEFAULT_RULES content."
        );
      }
    }

    console.log(
      "Reset completed successfully! Please restart VS Code to see changes."
    );
  } catch (error) {
    console.error("Error during reset:", error);
  }
}

// Jalankan fungsi reset
resetToDefault();
