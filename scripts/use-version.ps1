[CmdletBinding(SupportsShouldProcess = $true)]
param(
  [string]$Version,
  [switch]$Latest,
  [string]$Branch,
  [switch]$Fetch,
  [switch]$CleanIgnored,
  [switch]$Install
)

$ErrorActionPreference = 'Stop'

function Stop-WithMessage {
  param([string]$Message)
  Write-Error $Message
  exit 1
}

if ([string]::IsNullOrWhiteSpace($Version) -and -not $Latest) {
  Stop-WithMessage 'Provide -Version vX.Y.Z or -Latest.'
}

if (-not [string]::IsNullOrWhiteSpace($Version) -and $Latest) {
  Stop-WithMessage 'Use either -Version or -Latest, not both.'
}

$root = git rev-parse --show-toplevel
Set-Location $root

$dirty = git status --porcelain
if ($dirty) {
  Stop-WithMessage 'Working tree has uncommitted tracked or untracked changes. Commit, stash, or remove them before switching versions.'
}

if ($Fetch) {
  git fetch origin --tags --prune
}

if ($Latest) {
  if ($PSCmdlet.ShouldProcess('main', 'switch to latest branch')) {
    git switch main
  }
} else {
  git rev-parse --verify "refs/tags/$Version" *> $null

  if ([string]::IsNullOrWhiteSpace($Branch)) {
    if ($PSCmdlet.ShouldProcess($Version, 'switch to version tag in detached HEAD')) {
      git switch --detach $Version
    }
  } else {
    if ($PSCmdlet.ShouldProcess($Branch, "create branch from $Version")) {
      git switch -c $Branch $Version
    }
  }
}

if ($CleanIgnored) {
  if ($PSCmdlet.ShouldProcess('ignored generated files', 'remove with git clean -fdX')) {
    git clean -fdX
  }
}

if ($Install) {
  if ($PSCmdlet.ShouldProcess('dependencies', 'install with npm ci')) {
    npm ci
  }
}

git describe --tags --always --dirty

