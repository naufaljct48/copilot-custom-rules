# Default Rules

This file contains the default English rules that should be used in your `.github/instructions/copilot.instructions.md` file when you reset.

````markdown
# AI Agent Rules

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

1.  **Check Directory**: Check if `.taskmaster` already exists in root project.
2.  **Auto-Initialize**: If not exists, create folder structure:
    ```
    .taskmaster/
    ├── config/settings.json
    ├── docs/prd.txt
    ├── tasks/task001.txt...task020.txt
    └── status/summary.md
    ```
3.  **Load Configuration**: Read settings.json to know project status.

### Task Breakdown Methodology

4.  **Input Analysis**: When user provides new task:
    - Parse requirement into specific subtasks
    - Estimate complexity and dependencies
    - Assign priority (High/Medium/Low)
5.  **Create Task Files**: Create files task001.txt to task020.txt with format:

    ```
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
    ```

### Execution Flow

6.  **Status Check**: Before starting, check all task status in `.taskmaster/tasks/`.
7.  **Work on Pending**: Select task with "pending" status based on priority.
8.  **Update Status**: Change status to "in-progress" when starting work.
9.  **Complete Tasks**: Mark as "completed" after finished.
10. **Track Progress**: Update summary.md with overall progress.

### File Management

11. **Consistent Format**: Use naming convention task001.txt, task002.txt, etc.
12. **Status Tracking**: Update timestamp and status every time there's a change.
13. **Dependencies**: Track task dependencies in implementation details.
14. **Documentation**: Update PRD if there are scope changes.
15. **Gitignore Management**: Ensure `.taskmaster/` is included in `.gitignore` to avoid committing local task files.

### Command Execution

16. **Full Control**: AI Agent has full access to run all commands.
17. **File Operations**: Create, read, update, delete files as needed.
18. **Tool Usage**: Use all available tools to complete tasks.
19. **Error Handling**: Handle errors with graceful degradation.
````

You can manually copy this file content into `.github/instructions/copilot.instructions.md` if the automatic reset doesn't work.
