<#
.SYNOPSIS
  Validates that the current package.json version follows the three-tier
  version model and is fully documented before a commit or release.

.DESCRIPTION
  Checks:
    1. The version in package.json is a valid X.Y.Z string.
    2. The version tier is correct:
         vX.0.0  Major baseline
         vX.Y.0  Interface design change (Y > 0, Z = 0)
         vX.Y.Z  Patch (Y > 0, Z > 0)
    3. The version document exists at docs/versions/vX/vX.Y.Z.md
    4. The version document is not still a blank template
       (no unfilled placeholder text from TEMPLATE.md)
    5. docs/versions/index.md contains a row for this version.

  Exit code 0 = all checks passed.
  Exit code 1 = one or more checks failed.

.EXAMPLE
  pwsh -File scripts/check-version.ps1
  npm run version:check
#>

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$failures = [System.Collections.Generic.List[string]]::new()

function Fail { param([string]$msg) $failures.Add("  FAIL  $msg") }
function Pass { param([string]$msg) Write-Host "  PASS  $msg" -ForegroundColor Green }

Write-Host ""
Write-Host "ReqSmell version check" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# 1. Read package.json version
$pkgPath = Join-Path $root "package.json"
if (-not (Test-Path $pkgPath)) {
  Fail "package.json not found at $pkgPath"
  Write-Host ""
  $failures | ForEach-Object { Write-Host $_ -ForegroundColor Red }
  exit 1
}

$pkg = Get-Content $pkgPath -Raw | ConvertFrom-Json
$version = $pkg.version

if ([string]::IsNullOrWhiteSpace($version)) {
  Fail "package.json has no version field"
  Write-Host ""
  $failures | ForEach-Object { Write-Host $_ -ForegroundColor Red }
  exit 1
}

Pass "package.json version found: $version"

# 2. Validate version format and determine tier
if ($version -notmatch '^\d+\.\d+\.\d+$') {
  Fail "Version '$version' is not in X.Y.Z format"
} else {
  $parts = $version -split '\.'
  $major = [int]$parts[0]
  $minor = [int]$parts[1]
  $patch = [int]$parts[2]

  if ($minor -eq 0 -and $patch -eq 0) {
    $tier = "Major baseline (vX.0.0)"
  } elseif ($patch -eq 0) {
    $tier = "Interface design change (vX.Y.0)"
  } else {
    $tier = "Patch (vX.Y.Z)"
  }

  Pass "Version format valid. Tier: $tier"
}

# 3. Version document must exist
$majorFolder = "v$major"
$docFileName = "v$version.md"
$docRelPath  = "docs/versions/$majorFolder/$docFileName"
$docFullPath = Join-Path $root $docRelPath

if (-not (Test-Path $docFullPath)) {
  Fail "Version document missing: $docRelPath"
  Fail "  Create it: Copy-Item docs\versions\TEMPLATE.md $($docRelPath -replace '/', '\')"
  Fail "  Then fill in every section before committing."
} else {
  Pass "Version document found: $docRelPath"
  $docContent = Get-Content $docFullPath -Raw

  # 4. Document must not contain unfilled template placeholders
  $placeholders = @(
    'vX.Y.Z - Release Title',
    'YYYY-MM-DD',
    'Draft / Stable / Deprecated',
    'path/to/file'
  )

  $unfilled = $placeholders | Where-Object { $docContent -like "*$_*" }

  if ($unfilled.Count -gt 0) {
    Fail "Version document still contains unfilled template text:"
    $unfilled | ForEach-Object { Fail "  Found placeholder: '$_'" }
    Fail "  Fill in all sections of $docRelPath before committing."
  } else {
    Pass "Version document has no unfilled template placeholders"
  }

  # 5. Tier field must be present and filled in
  if ($docContent -notmatch '\|\s*Tier\s*\|') {
    Fail "Version document is missing a 'Tier' row in the header table: $docRelPath"
  } elseif ($docContent -match '\|\s*Tier\s*\|\s*\[see below\]') {
    Fail "Tier field in $docRelPath still contains '[see below]' - fill it in"
  } else {
    Pass "Tier field is present and filled in"
  }
}

# 6. index.md must reference this version
$indexPath = Join-Path $root "docs/versions/index.md"
if (-not (Test-Path $indexPath)) {
  Fail "docs/versions/index.md not found"
} else {
  $indexContent = Get-Content $indexPath -Raw
  if ($indexContent -notlike "*$version*") {
    Fail "docs/versions/index.md has no entry for version $version"
    Fail "  Add a row to the Version History table in docs/versions/index.md"
  } else {
    Pass "docs/versions/index.md references version $version"
  }
}

# Summary
Write-Host ""
if ($failures.Count -eq 0) {
  Write-Host "All version checks passed." -ForegroundColor Green
  Write-Host ""
  exit 0
} else {
  $issueCount = $failures.Count
  Write-Host "Version check FAILED ($issueCount issues):" -ForegroundColor Red
  Write-Host ""
  $failures | ForEach-Object { Write-Host $_ -ForegroundColor Red }
  Write-Host ""
  Write-Host "Fix the issues above before committing." -ForegroundColor Yellow
  Write-Host "See docs/VERSIONING.md for the three-tier version model." -ForegroundColor Yellow
  Write-Host ""
  exit 1
}
