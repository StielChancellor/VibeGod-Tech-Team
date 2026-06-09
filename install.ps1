# VibeGod Tech Team — one-shot installer for Windows / Claude Desktop users.
#
#   Run in PowerShell (or paste into the Claude Desktop chat and say "run this"):
#     irm https://raw.githubusercontent.com/StielChancellor/VibeGod-Tech-Team/main/install.ps1 | iex
#
# What it does: finds your Claude Code CLI (installs it via npm if missing), adds the
# vibegod marketplace, installs vibegod-tech-team, and leaves it OFF by default (token-safe).
# Re-running it is safe (idempotent).

$ErrorActionPreference = 'Continue'
function Say($m, $c = 'White') { Write-Host $m -ForegroundColor $c }

Say "`n=== VibeGod Tech Team installer ===`n" 'Cyan'

# 1) Locate the Claude Code CLI: PATH -> bundled Desktop CLI -> npm.
function Find-Claude {
  $c = Get-Command claude -ErrorAction SilentlyContinue
  if ($c) { return $c.Source }
  $base = Join-Path $env:APPDATA 'Claude\claude-code'
  if (Test-Path $base) {
    $exe = Get-ChildItem $base -Recurse -Filter 'claude.exe' -ErrorAction SilentlyContinue |
           Sort-Object FullName -Descending | Select-Object -First 1
    if ($exe) { return $exe.FullName }
  }
  return $null
}

$claude = Find-Claude
if (-not $claude) {
  Say "Claude CLI not found — installing it via npm..." 'Yellow'
  if (Get-Command npm -ErrorAction SilentlyContinue) {
    npm install -g '@anthropic-ai/claude-code'
    $claude = Find-Claude
  }
}
if (-not $claude) {
  Say "ERROR: Could not find or install the Claude CLI." 'Red'
  Say "Install it once with:  npm install -g @anthropic-ai/claude-code" 'Red'
  return
}
Say "Using Claude CLI: $claude`n"

function Claude { & $claude @args }

# 2) Add the marketplace + install the plugin (tolerant if already present).
Say "Adding marketplace (StielChancellor/VibeGod-Tech-Team)..."
try { Claude plugin marketplace add 'StielChancellor/VibeGod-Tech-Team' } catch { Say "  (marketplace already added — ok)" 'DarkGray' }

Say "Installing plugin (vibegod-tech-team@vibegod)..."
try { Claude plugin install 'vibegod-tech-team@vibegod' } catch { Say "  (plugin already installed — ok)" 'DarkGray' }

# 3) Off by default — keeps non-dev projects at 0 extra tokens.
Say "Setting it OFF by default (token-safe)..."
try { Claude plugin disable 'vibegod-tech-team@vibegod' --scope user } catch {}

# 4) Show status.
Say "`nCurrent status:" 'Cyan'
Claude plugin list

Say "`n[OK] VibeGod Tech Team is installed and OFF by default (saves ~9.5k tokens/session where you don't need it)." 'Green'
Say "To use it on a project: cd into the project, run the line below, then restart Claude:" 'Green'
Say "    claude plugin enable vibegod-tech-team@vibegod --scope project" 'White'
Say "(If 'claude' isn't found in your terminal, install it once: npm install -g @anthropic-ai/claude-code)`n" 'DarkGray'
