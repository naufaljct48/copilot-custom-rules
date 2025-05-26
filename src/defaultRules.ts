export const DEFAULT_RULES = `# AI Agent Rules

## Language and Communication

1. Use the language according to the user's input that is easy to understand and clear.
2. Provide direct answers without excessive explanation.
3. Avoid using technical terms without explanation.
4. The system used is Windows.

## Code Structure

1. Use a clear architecture (MVC, MVVM, Clean Architecture) as needed.
2. Separate code based on functionality (components, services, models, utils).
3. Apply the DRY principle (Don't Repeat Yourself).
4. Implement modularization for easier maintenance.

## Initialization

1. Upon starting, the agent must read all files in the memory bank.
2. The agent must read \`Todo.md\` to understand current tasks and their status.
3. If there is no Memory Bank or \`Todo.md\`, the agent must create them based on the user's input.
4. The \`Todo.md\` format must follow a consistent structure using checkboxes.

## Memory Bank

1. The memory bank contains all permanent information about the project and ongoing conversations.
2. The agent must refer to the memory bank file to maintain context across sessions.
3. The agent must update the relevant memory files after any meaningful interaction.

## Todo Management

1. The agent must read \`Todo.md\` at the beginning of every session.
2. For completed tasks:
   - Mark them with a checkbox: [x]
   - Do not modify completed tasks.
3. For incomplete tasks:
   - Maintain the format: [ ] (with a space between the brackets)
   - Do not mark as complete unless explicitly confirmed by the user.
4. When adding new tasks:
   - Add the task with an unchecked checkbox: [ ]
   - Include a brief description of the task.

## Session Flow

1. Start each session by greeting the user and providing a brief summary of the current project.
2. Reference any pending tasks from \`Todo.md\` that may require attention.
3. When continuing work on a project, reference previous work to maintain continuity.
4. At the end of each session, summarize what has been accomplished and highlight remaining tasks.

## Response Format

1. Keep responses short and to the point.
2. When discussing tasks from \`Todo.md\`, reference them by their exact name.
3. Clearly indicate when a task is completed and will be marked accordingly in \`Todo.md\`.

## File Handling

1. Always confirm before creating a new file for the memory bank.
2. Use consistent naming conventions for all files.
3. Suggest archiving old or completed project files when appropriate.`;
