# Testing Copilot Custom Rules Extension

## Manual Testing Steps

### 1. Installation Test
1. Install the extension from VSIX file:
   - Open VS Code
   - Go to Extensions (Ctrl+Shift+X)
   - Click "..." menu and select "Install from VSIX..."
   - Select `copilot-custom-rules-1.0.0.vsix`

### 2. Auto-Injection Test
1. Open a new workspace/folder in VS Code
2. Check if `.github/instructions/copilot.instructions.md` is created automatically
3. Verify the content matches the default AI agent rules
4. Check if `.gitignore` is updated with `.github/instructions/` pattern

### 3. Sidebar UI Test
1. Open Explorer panel
2. Look for "Copilot Custom Rules" section
3. Click "Open Rules Editor"
4. Verify the WebView loads with current rules
5. Test editing and saving rules
6. Check if changes are reflected in the instructions file

### 4. Commands Test
1. Open Command Palette (Ctrl+Shift+P)
2. Test these commands:
   - `Copilot Custom Rules: Open Rules Editor`
   - `Copilot Custom Rules: Inject Custom Rules`
   - `Copilot Custom Rules: Reset to Default Rules`

### 5. Configuration Test
1. Go to VS Code Settings (Ctrl+,)
2. Search for "Copilot Custom Rules"
3. Test toggling:
   - `copilot-custom-rules.autoInject`
   - `copilot-custom-rules.updateGitignore`

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
- ✅ Sidebar UI works properly
- ✅ Commands execute without errors
- ✅ Settings are respected
- ✅ Custom rules are preserved between sessions
- ✅ GitHub Copilot uses the custom instructions

## Troubleshooting

### Common Issues
1. **Extension not activating**: Check VS Code version (requires 1.74.0+)
2. **Files not created**: Check workspace permissions
3. **Sidebar not showing**: Refresh Explorer panel
4. **Rules not saving**: Check file write permissions

### Debug Steps
1. Open VS Code Developer Tools (Help > Toggle Developer Tools)
2. Check Console for error messages
3. Look for extension logs starting with "Copilot Custom Rules"
