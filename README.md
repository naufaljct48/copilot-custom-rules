# Copilot Custom Rules

**Auto-inject custom rules for GitHub Copilot with editable UI sidebar**

## Features

🚀 **Auto-Injection**: Automatically injects custom rules when VS Code starts  
📝 **Visual Editor**: Edit rules directly in the sidebar with a user-friendly interface  
🔄 **Smart Updates**: Updates existing instructions with your latest custom rules  
📁 **GitHub Integration**: Uses native `.github/instructions/` folder for better Copilot integration  
🙈 **Git Management**: Automatically manages `.gitignore` to exclude instructions files  

## How It Works

This extension automatically creates and manages GitHub Copilot instruction files in your workspace:

1. **Auto-Injection**: When you open VS Code, the extension automatically creates/updates `.github/instructions/copilot.instructions.md` with your custom rules
2. **Custom Rules**: You can edit your rules using the sidebar UI and they will be saved and injected automatically
3. **Git Integration**: The extension automatically adds `.github/instructions/` to your `.gitignore` to keep instructions local
4. **Seamless Experience**: Works with all GitHub Copilot features (Chat, Edits, Inline Chat)

## Usage

### Automatic Setup
- The extension activates automatically when you open a workspace
- Custom rules are injected immediately on startup
- `.gitignore` is updated to exclude instructions files

### Manual Controls
- **Open Rules Editor**: Click the sidebar panel or use Command Palette
- **Inject Rules Now**: Force injection of current rules
- **Reset to Default**: Restore the default AI agent rules

### Sidebar Editor
1. Open the Explorer panel in VS Code
2. Find the "Copilot Custom Rules" section
3. Click "Open Rules Editor" to edit your custom rules
4. Save your changes to automatically inject them

## Default Rules

The extension comes with comprehensive AI agent rules that include:

- **Language and Communication**: Adaptive language based on user input
- **Code Structure**: Best practices for clean architecture
- **Initialization**: Memory bank and todo management
- **Session Flow**: Consistent project continuity
- **File Handling**: Safe file operations

## Configuration

Access settings via VS Code Settings (`Ctrl+,`) and search for "Copilot Custom Rules":

- `copilot-custom-rules.autoInject`: Enable/disable automatic rule injection on startup (default: true)
- `copilot-custom-rules.updateGitignore`: Enable/disable automatic .gitignore updates (default: true)

## Commands

Available in Command Palette (`Ctrl+Shift+P`):

- `Copilot Custom Rules: Open Rules Editor`
- `Copilot Custom Rules: Inject Custom Rules`
- `Copilot Custom Rules: Reset to Default Rules`

## File Structure

```
your-project/
├── .github/
│   └── instructions/
│       └── copilot.instructions.md    # Auto-generated instructions
├── .vscode/
│   └── copilot-custom-rules.md        # Your custom rules storage
└── .gitignore                         # Auto-updated to exclude instructions
```

## Requirements

- VS Code 1.74.0 or higher
- GitHub Copilot extension (recommended)

## Installation

### From VS Code Marketplace
1. Open VS Code
2. Go to Extensions (`Ctrl+Shift+X`)
3. Search for "Copilot Custom Rules"
4. Click Install

### From VSIX File
1. Download the `.vsix` file from [GitHub Releases](https://github.com/naufaljct48/copilot-custom-rules/releases)
2. Open VS Code
3. Go to Extensions (`Ctrl+Shift+X`)
4. Click the "..." menu and select "Install from VSIX..."
5. Select the downloaded `.vsix` file

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have suggestions, please [open an issue](https://github.com/naufaljct48/copilot-custom-rules/issues) on GitHub.

---

**Enjoy coding with your custom AI agent rules! 🤖✨**
