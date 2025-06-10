# Release script for Copilot Custom Rules v1.2.5
# Run this script from the project root directory

param(
    [string]$Version = "1.2.5",
    [switch]$SkipGit,
    [switch]$SkipPublish,
    [switch]$Force
)

Write-Host "=================================" -ForegroundColor Cyan
Write-Host "  Copilot Custom Rules Release" -ForegroundColor Cyan
Write-Host "  Version: $Version" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

# Check if we're in the right directory
if (!(Test-Path "package.json")) {
    Write-Host "ERROR: package.json not found. Please run this script from the project root directory!" -ForegroundColor Red
    exit 1
}

# Verify package.json and CHANGELOG.md have been updated
Write-Host "`nVerifying version updates..." -ForegroundColor Yellow

try {
    $packageJson = Get-Content -Raw -Path "package.json" | ConvertFrom-Json
    if ($packageJson.version -ne $Version) {
        Write-Host "ERROR: package.json version is '$($packageJson.version)', expected '$Version'!" -ForegroundColor Red
        if (!$Force) { exit 1 }
        Write-Host "WARNING: Continuing due to -Force flag" -ForegroundColor Yellow
    }
} catch {
    Write-Host "ERROR: Failed to read package.json: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

if (Test-Path "CHANGELOG.md") {
    $changelog = Get-Content -Path "CHANGELOG.md" | Select-String -Pattern "## \[$Version\] -" -SimpleMatch
    if (!$changelog) {
        Write-Host "ERROR: CHANGELOG.md does not contain entry for version $Version!" -ForegroundColor Red
        if (!$Force) { exit 1 }
        Write-Host "WARNING: Continuing due to -Force flag" -ForegroundColor Yellow
    }
} else {
    Write-Host "WARNING: CHANGELOG.md not found" -ForegroundColor Yellow
}

Write-Host "✓ Version information verified" -ForegroundColor Green

# Check if npm is available
if (!(Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: npm is not installed or not in PATH!" -ForegroundColor Red
    exit 1
}

# Check if vsce is available
if (!(Get-Command vsce -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: vsce is not installed! Install it with: npm install -g vsce" -ForegroundColor Red
    exit 1
}

# Install dependencies if needed
if (!(Test-Path "node_modules")) {
    Write-Host "`nInstalling dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: npm install failed!" -ForegroundColor Red
        exit 1
    }
    Write-Host "✓ Dependencies installed" -ForegroundColor Green
}

# Compile the extension
Write-Host "`nCompiling extension..." -ForegroundColor Yellow
npm run compile
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Compilation failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Compilation successful" -ForegroundColor Green

# Run tests if test script exists
$packageContent = Get-Content -Raw -Path "package.json" | ConvertFrom-Json
if ($packageContent.scripts.test) {
    Write-Host "`nRunning tests..." -ForegroundColor Yellow
    npm test
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Tests failed!" -ForegroundColor Red
        if (!$Force) { exit 1 }
        Write-Host "WARNING: Continuing due to -Force flag" -ForegroundColor Yellow
    } else {
        Write-Host "✓ Tests passed" -ForegroundColor Green
    }
}

# Package the extension
Write-Host "`nPackaging extension..." -ForegroundColor Yellow
vsce package
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Packaging failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Extension packaged successfully" -ForegroundColor Green

# Git operations
if (!$SkipGit) {
    # Check if git is available
    if (!(Get-Command git -ErrorAction SilentlyContinue)) {
        Write-Host "ERROR: git is not installed or not in PATH!" -ForegroundColor Red
        exit 1
    }

    # Check if there are uncommitted changes
    $gitStatus = git status --porcelain
    if ($gitStatus) {
        Write-Host "`nUncommitted changes detected:" -ForegroundColor Yellow
        Write-Host $gitStatus
    }

    Write-Host "`nReady to perform Git operations:" -ForegroundColor Yellow
    Write-Host "1. git add ."
    Write-Host "2. git commit -m 'v$Version`: Fix Reset to Default button functionality'"
    Write-Host "3. git tag v$Version"
    Write-Host "4. git push origin main"
    Write-Host "5. git push origin --tags"

    $confirmation = Read-Host "`nDo you want to proceed with Git operations? (y/n)"
    if ($confirmation -eq "y" -or $confirmation -eq "Y") {
        Write-Host "`nPerforming Git operations..." -ForegroundColor Yellow
        
        git add .
        if ($LASTEXITCODE -ne 0) {
            Write-Host "ERROR: git add failed!" -ForegroundColor Red
            exit 1
        }
        Write-Host "✓ Files staged" -ForegroundColor Green
        
        git commit -m "v$Version`: Fix Reset to Default button functionality"
        if ($LASTEXITCODE -ne 0) {
            Write-Host "ERROR: git commit failed!" -ForegroundColor Red
            exit 1
        }
        Write-Host "✓ Changes committed" -ForegroundColor Green
        
        # Check if tag already exists
        $existingTag = git tag -l "v$Version"
        if ($existingTag) {
            Write-Host "WARNING: Tag v$Version already exists!" -ForegroundColor Yellow
            if (!$Force) {
                $overwriteTag = Read-Host "Do you want to overwrite it? (y/n)"
                if ($overwriteTag -eq "y" -or $overwriteTag -eq "Y") {
                    git tag -d "v$Version"
                    git tag "v$Version"
                } else {
                    Write-Host "Skipping tag creation" -ForegroundColor Yellow
                }
            } else {
                git tag -d "v$Version"
                git tag "v$Version"
                Write-Host "✓ Tag overwritten due to -Force flag" -ForegroundColor Green
            }
        } else {
            git tag "v$Version"
            Write-Host "✓ Tag created" -ForegroundColor Green
        }
        
        git push origin main
        if ($LASTEXITCODE -ne 0) {
            Write-Host "ERROR: git push failed!" -ForegroundColor Red
            exit 1
        }
        Write-Host "✓ Commits pushed" -ForegroundColor Green
        
        git push origin --tags
        if ($LASTEXITCODE -ne 0) {
            Write-Host "ERROR: git push tags failed!" -ForegroundColor Red
            exit 1
        }
        Write-Host "✓ Tags pushed" -ForegroundColor Green
        
        Write-Host "`n✓ All Git operations completed successfully!" -ForegroundColor Green
    } else {
        Write-Host "`nGit operations skipped. You can perform them manually later." -ForegroundColor Yellow
    }
} else {
    Write-Host "`nGit operations skipped due to -SkipGit flag" -ForegroundColor Yellow
}

# Publishing
if (!$SkipPublish) {
    $publish = Read-Host "`nDo you want to publish to VS Code Marketplace? (y/n)"
    if ($publish -eq "y" -or $publish -eq "Y") {
        Write-Host "`nPublishing to VS Code Marketplace..." -ForegroundColor Yellow
        vsce publish
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ Extension published successfully!" -ForegroundColor Green
        } else {
            Write-Host "ERROR: Publishing failed!" -ForegroundColor Red
            Write-Host "Make sure you're logged in with 'vsce login <publisher-name>'" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "`nPublishing skipped due to -SkipPublish flag" -ForegroundColor Yellow
}

Write-Host "`n=================================" -ForegroundColor Cyan
Write-Host "  Release process complete!" -ForegroundColor Green
Write-Host "  Don't forget to:" -ForegroundColor Yellow
Write-Host "  - Update the GitHub release page" -ForegroundColor Yellow
Write-Host "  - Announce the release if needed" -ForegroundColor Yellow
Write-Host "=================================" -ForegroundColor Cyan

# Display the generated .vsix file
$vsixFile = Get-ChildItem -Path "." -Filter "*.vsix" | Sort-Object LastWriteTime -Descending | Select-Object -First 1
if ($vsixFile) {
    Write-Host "`nGenerated package: $($vsixFile.Name)" -ForegroundColor Cyan
}