# Manual Reset Instructions

If the "Reset to Default" button is not working properly, follow these steps:

## Method 1: Use the Force Reset Command

1. Press `Ctrl+Shift+P` to open the Command Palette
2. Type "Copilot Custom Rules: Force Reset" and select the command
3. The rules will be forcefully reset to the default English version

## Method 2: Run the Fix Script

If Method 1 doesn't work, you can run the fixReset.js script:

1. Open a terminal in VS Code (Terminal > New Terminal)
2. Run this command:

```
node fixReset.js
```

3. The script will reset your rules to the default English version

## Method 3: Manual File Replacement

If all else fails, manually replace the file:

1. Navigate to `.github/instructions/` folder in your workspace
2. Delete or rename the existing `copilot.instructions.md` file
3. Create a new file with that name
4. Copy and paste the contents from `src/defaultRules.ts` (remove the JS code parts)

## Verifying the Reset

After resetting, your instructions should start with:

```
# AI Agent Rules

## Language and Communication

1.  Use the same language as the user input with clear and understandable communication.
...
```

If you still see the Indonesian version, it means the reset didn't work properly.
