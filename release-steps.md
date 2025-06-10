# Release Steps for v1.2.5

Follow these steps to update the version, tag, and push to GitHub:

## 1. Verify changes have been made:

- ✅ Updated version in package.json from 1.2.4 to 1.2.5
- ✅ Updated CHANGELOG.md with new version and changes
- ✅ Fixed the "Reset to Default" button functionality
- ✅ Added enhanced error handling and verification steps

## 2. Build and test the extension:

```powershell
npm run compile
npm run test
```

## 3. Package the extension:

```powershell
vsce package
```

This will create a file named `copilot-custom-rules-1.2.5.vsix`

## 4. Git commands to commit, tag and push:

```powershell
# Add all changed files to the staging area
git add .

# Commit the changes
git commit -m "v1.2.5: Fix Reset to Default button functionality"

# Create a tag for the new version
git tag v1.2.5

# Push the commits to the main branch
git push origin main

# Push the tags
git push origin --tags
```

## 5. Publish to Visual Studio Marketplace (if applicable):

```powershell
vsce publish
```

## 6. Announce the release:

- Update the GitHub release page with release notes from CHANGELOG.md
- Consider posting an announcement to relevant forums or social media

## Verification checklist:

- [ ] Extension builds successfully
- [ ] Reset to Default button works correctly
- [ ] Default English rules display properly after reset
- [ ] Manual reset command works from command palette
- [ ] All file operations run without errors
- [ ] Version number is correctly updated
- [ ] Git tags pushed successfully
