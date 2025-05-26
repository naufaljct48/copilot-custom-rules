# Testing Copilot Custom Rules Extension v1.0.1

## Manual Testing Steps

### 1. Installation Test

1. Install the extension from VSIX file:
   - Open VS Code
   - Go to Extensions (Ctrl+Shift+X)
   - Click "..." menu and select "Install from VSIX..."
   - Select `copilot-custom-rules-1.0.1.vsix`

### 2. Auto-Injection Test

1. Open a new workspace/folder in VS Code
2. Check if `.github/instructions/copilot.instructions.md` is created automatically
3. Verify the content matches the default AI agent rules (Indonesian)
4. Check if `.gitignore` is updated with `.github/instructions/` pattern

### 3. Sidebar TreeView Test (NEW in v1.0.1)

1. Open Explorer panel
2. Look for "Copilot Custom Rules" section
3. Verify 4 action buttons appear:
   - 📝 Edit Custom Rules
   - 🚀 Inject Rules Now
   - 🔄 Reset to Default
   - ⚙️ Settings
4. Click "📝 Edit Custom Rules" - should open the rules file in VS Code editor
5. Test editing the file and saving
6. Click "🚀 Inject Rules Now" to manually inject rules

### 4. Commands Test

1. Open Command Palette (Ctrl+Shift+P)
2. Test these commands:
   - `Copilot Custom Rules: Open Rules Editor`
   - `Copilot Custom Rules: Inject Custom Rules`
   - `Copilot Custom Rules: Reset to Default Rules`
   - `Copilot Custom Rules: Edit Custom Rules` (NEW)
   - `Copilot Custom Rules: Open Settings` (NEW)

### 5. Configuration Test

1. Go to VS Code Settings (Ctrl+,)
2. Search for "Copilot Custom Rules"
3. Test toggling:
   - `copilot-custom-rules.autoInject`
   - `copilot-custom-rules.updateGitignore`
4. Or click "⚙️ Settings" from sidebar to open settings directly

### 6. File Structure Test

After running the extension, verify these files exist:

```
workspace/
├── .github/
│   └── instructions/
│       └── copilot.instructions.md
├── .vscode/
│   └── copilot-custom-rules.md
└── .gitignore (updated)
```

### 7. GitHub Copilot Integration Test

1. Open GitHub Copilot Chat
2. Verify that custom rules are being applied
3. Test with different types of requests to see if the AI follows the custom rules

## Expected Behavior

- ✅ Extension activates on startup
- ✅ Auto-creates instruction files
- ✅ Updates .gitignore safely
- ✅ Sidebar TreeView shows 4 action buttons
- ✅ "Edit Custom Rules" opens file in VS Code editor (not WebView)
- ✅ Commands execute without errors
- ✅ Settings are respected
- ✅ Custom rules are preserved between sessions
- ✅ GitHub Copilot uses the custom instructions

## Troubleshooting

### Common Issues

1. **Extension not activating**: Check VS Code version (requires 1.74.0+)
2. **Files not created**: Check workspace permissions
3. **Sidebar not showing**: Refresh Explorer panel or restart VS Code
4. **TreeView buttons not appearing**: Make sure you have a workspace/folder open
5. **Edit button not working**: Check if `.vscode` folder has write permissions

### Debug Steps

1. Open VS Code Developer Tools (Help > Toggle Developer Tools)
2. Check Console for error messages
3. Look for extension logs starting with "Copilot Custom Rules"
