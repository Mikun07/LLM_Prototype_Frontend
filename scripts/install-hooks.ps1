<#
.SYNOPSIS
  Installs Git hooks for this repository.

.DESCRIPTION
  Writes a pre-commit hook that runs the version check before every commit.
  Safe to run multiple times - it overwrites the hook if it already exists.

  Run once after cloning the repository:

    pwsh -File scripts/install-hooks.ps1

  Or via npm:

    npm run hooks:install
#>

$ErrorActionPreference = 'Stop'
$root     = Split-Path -Parent $PSScriptRoot
$hooksDir = Join-Path $root ".git\hooks"

if (-not (Test-Path $hooksDir)) {
  Write-Error "No .git/hooks directory found. Is this a Git repository?"
  exit 1
}

$hookPath = Join-Path $hooksDir "pre-commit"

# Build the hook content as plain lines to avoid here-string interpolation issues
$scriptPath = Join-Path $root "scripts\check-version.ps1"
$lines = @(
  "#!/bin/sh",
  "# ReqSmell pre-commit hook - version tier and documentation check",
  "# Installed by scripts/install-hooks.ps1",
  "",
  "powershell -NoProfile -NonInteractive -ExecutionPolicy Bypass -File `"$scriptPath`"",
  "if [ `$? -ne 0 ]; then",
  "  echo ''",
  "  echo 'Commit blocked by version check. See output above for details.'",
  "  exit 1",
  "fi"
)

$hookContent = $lines -join "`n"
[System.IO.File]::WriteAllText($hookPath, $hookContent, (New-Object System.Text.UTF8Encoding $false))

Write-Host ""
Write-Host "Git hook installed: .git/hooks/pre-commit" -ForegroundColor Green
Write-Host "The version check will run automatically before every commit." -ForegroundColor Green
Write-Host ""
Write-Host "To run the check manually at any time:" -ForegroundColor Cyan
Write-Host "  npm run version:check" -ForegroundColor Cyan
Write-Host ""
