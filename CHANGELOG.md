# Change Log

All notable changes to the "Copilot Custom Rules" extension will be documented in this file.

## [1.2.1] - 2025-06-10

### 🧹 Code Cleanup & Optimization

- **Removed Duplicate Files**: Cleaned up duplicate `webviewProvider_new.ts` file
- **File Structure Optimization**: Maintained only necessary files for cleaner project structure
- **Version Synchronization**: Ensured package.json version matches extension capabilities

### 🔧 Minor Improvements

- **Code Consistency**: Improved code consistency across all TypeScript files
- **Build Optimization**: Enhanced build process with cleaner file management

## [1.2.0] - 2025-06-10

### 🎯 Task Master System Integration

- **Complete Task Management**: Integrated comprehensive Task Master system for project management
- **Auto-Initialize Structure**: Automatic creation of `.taskmaster/` folder with organized structure
- **Task Breakdown Methodology**: Intelligent task breakdown into subtasks with priority and status tracking
- **Progress Tracking**: Real-time progress monitoring with summary reports

### 🔧 Enhanced File Persistence

- **Fixed Persistence Issues**: Resolved bug where custom rules would revert after VS Code restart
- **Enhanced File Operations**: Improved file read/write operations with comprehensive logging
- **Never Overwrite**: Auto-injection now preserves existing custom rules completely
- **File Integrity Validation**: Added validation methods to ensure file consistency

### 🌐 Internationalization Improvements

- **English Default Rules**: Converted default rules to English for broader accessibility
- **Adaptive Language**: Rules now adapt to user input language automatically
- **Better Documentation**: Enhanced documentation in both English and Indonesian

### 🛠️ Technical Enhancements

- **Enhanced Logging**: Comprehensive debug logging for troubleshooting
- **TypeScript Improvements**: Fixed TypeScript configuration with DOM library support
- **Gitignore Management**: Automatic management of `.taskmaster/` and `.github/instructions/` in gitignore
- **Error Handling**: Improved error handling with graceful degradation

### 📁 New File Structure

```
project/
├── .taskmaster/
│   ├── config/settings.json
│   ├── docs/prd.txt
│   ├── tasks/task001.txt...task020.txt
│   └── status/summary.md
└── .github/
    └── instructions/
        └── copilot.instructions.md
```

### 🐛 Bug Fixes

- Fixed custom rules not persisting after VS Code restart
- Fixed auto-injection overwriting user modifications
- Fixed TypeScript compilation errors
- Fixed webview persistence issues

## [1.1.2] - 2024-12-19

### 🔧 Simplified File Management

- **Single File System**: Removed unnecessary `.vscode/copilot-custom-rules.md` file
- **Direct GitHub Integration**: Now uses only `.github/instructions/copilot.instructions.md` as the single source of truth
- **Streamlined Workflow**: Edit rules directly in the GitHub Copilot instructions file
- **No Duplication**: Eliminates confusion between multiple rule files

### ✨ Improved User Experience

- **Direct Editing**: WebView editor now directly edits `.github/instructions/copilot.instructions.md`
- **Simplified Logic**: Removed unnecessary file copying and injection steps
- **Better Performance**: Faster operations with single file management
- **Cleaner Architecture**: More intuitive file structure

### 🎯 How It Works Now

1. **Default**: Extension creates `.github/instructions/copilot.instructions.md` with default rules
2. **Edit**: WebView editor directly modifies the GitHub Copilot instructions file
3. **Save**: Changes are saved directly to `.github/instructions/copilot.instructions.md`
4. **Reset**: Overwrites the file with default rules

### 📁 File Structure

```
project/
└── .github/
    └── instructions/
        └── copilot.instructions.md  # Single source of truth
```

## [1.1.1] - 2024-12-19

### Fixed

- 🔧 **WebView UI Implementation**: Completely reimplemented WebView editor as a dedicated panel
- 📝 **Rules Editor Display**: "Edit Custom Rules" now opens a beautiful, full-featured WebView panel
- 🎯 **Command Routing**: Fixed command to open WebView panel instead of sidebar view
- ⚙️ **ESLint Configuration**: Added proper ESLint configuration for GitHub Actions workflow

### Added

- 🎨 **Beautiful UI**: Professional-looking rules editor with VS Code theming
- 📋 **Instructions Panel**: Built-in instructions for using the editor
- 💾 **Save & Inject Button**: One-click save and inject functionality
- 🔄 **Reset Button**: Easy reset to default rules with confirmation
- 📊 **Status Indicator**: Real-time status updates (loading, saving, modified)
- 🎯 **Better UX**: Centered layout with clear instructions and visual feedback

### Improved

- 🖥️ **Full Panel Experience**: WebView opens in dedicated panel instead of cramped sidebar
- 📱 **Responsive Design**: Better layout that works well in different panel sizes
- 🔄 **Editor Integration**: WebView editor properly loads, saves, and resets custom rules
- 🎨 **Visual Polish**: Professional styling with proper VS Code theme integration

## [1.1.0] - 2024-12-19

### Added

- 🚀 **GitHub Actions Automated Release**: Workflow otomatis untuk build dan release file VSIX
- 📦 **VSIX File in Releases**: File extension (.vsix) sekarang tersedia di GitHub releases
- 🔄 **Manual Release Trigger**: Kemampuan untuk trigger release manual dari GitHub UI
- 📝 **Enhanced Release Notes**: Format release notes yang lebih menarik dengan emoji dan instruksi instalasi
- 🛍️ **VS Code Marketplace Workflow**: Workflow terpisah untuk publish ke VS Code Marketplace
- 📋 **Release Documentation**: Panduan lengkap untuk melakukan release di RELEASE.md

### Improved

- ⚡ **Modern GitHub Actions**: Menggunakan actions versi terbaru (@v4) untuk performa lebih baik
- 🔧 **Better Build Process**: Menambahkan lint check dan npm caching untuk build yang lebih cepat
- 🎯 **Dynamic VSIX Detection**: Otomatis mencari dan upload file VSIX yang dibuat
- 🔐 **Enhanced Permissions**: Proper permissions setup untuk GitHub Actions

### Technical

- Updated GitHub Actions to use latest versions
- Added `contents: write` permission for release creation
- Implemented `softprops/action-gh-release@v1` for better release management
- Added npm caching for faster CI builds
- Enhanced error handling in build process

## [1.0.1] - 2024-12-19

### Fixed

- 🔧 Fixed WebView Editor not appearing in sidebar
- 📋 Replaced WebView with TreeView for better compatibility
- ✨ Added direct "Edit Custom Rules" command that opens rules file in editor
- ⚙️ Added "Open Settings" command for easy access to extension settings
- 🎯 Improved sidebar UI with clear action buttons

### Changed

- 📝 TreeView now shows 4 main actions: Edit Rules, Inject Rules, Reset to Default, Settings
- 🔄 "Edit Custom Rules" now opens the actual file in VS Code editor instead of WebView
- 📁 Better file handling for custom rules creation and editing

## [1.0.0] - 2024-12-19

### Added

- 🎉 Initial release of Copilot Custom Rules extension
- ⚡ Auto-injection of custom rules on VS Code startup using `onStartupFinished` activation event
- 📝 Visual rules editor in sidebar with WebView interface
- 🔄 Automatic creation/update of `.github/instructions/copilot.instructions.md` files
- 🙈 Smart `.gitignore` management to exclude instructions files from version control
- 🎯 Default AI agent rules with comprehensive guidelines for:
  - Language and communication patterns
  - Code structure best practices
  - Memory bank and todo management
  - Session flow continuity
  - File handling procedures
- ⚙️ Configuration options for auto-injection and gitignore management
- 🎨 Native VS Code theming support for the rules editor
- 📋 Command palette integration with three main commands:
  - Open Rules Editor
  - Inject Custom Rules
  - Reset to Default Rules
- 🔧 TypeScript implementation with proper error handling
- 📁 Organized file structure with separate managers for different functionalities
- 🚀 Welcome message for first-time users
- 💾 Persistent storage of custom rules in `.vscode/copilot-custom-rules.md`

### Features

- **Auto-Injection**: Automatically injects rules when opening any workspace
- **Visual Editor**: User-friendly textarea interface with save/reset functionality
- **Smart Updates**: Preserves custom edits and updates existing instruction files
- **GitHub Integration**: Uses native GitHub Copilot instructions format
- **Git Safety**: Automatically excludes instructions from version control
- **Bilingual Support**: Adaptive language rules based on user input
- **Memory Management**: Built-in todo and memory bank management guidelines
- **Session Continuity**: Rules for maintaining context across coding sessions

### Technical Details

- Built with TypeScript and VS Code Extension API
- Uses `onStartupFinished` activation event for optimal performance
- Implements WebView for rich UI experience
- Modular architecture with separate file and gitignore managers
- Comprehensive error handling and user feedback
- Follows VS Code extension best practices

### File Structure

```
├── src/
│   ├── extension.ts          # Main extension logic
│   ├── defaultRules.ts       # Default AI agent rules
│   ├── fileManager.ts        # File operations manager
│   ├── gitignoreManager.ts   # Gitignore management
│   └── webviewProvider.ts    # Sidebar UI provider
├── package.json              # Extension manifest
├── tsconfig.json            # TypeScript configuration
├── README.md                # Documentation
└── CHANGELOG.md             # This file
```

### Known Issues

- None reported in initial release

### Upcoming Features

- Export/import rules functionality
- Multiple rule templates
- Team sharing capabilities
- Advanced rule validation

---

**Note**: This extension is designed to work seamlessly with GitHub Copilot and enhances the AI coding experience with customizable rules and guidelines.
