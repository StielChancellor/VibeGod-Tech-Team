#!/usr/bin/env bash
# God-Mode SDE — one-shot installer for macOS / Linux (Claude Desktop & terminal users).
#
#   Run in a terminal (or paste into the Claude Desktop chat and say "run this"):
#     curl -fsSL https://raw.githubusercontent.com/StielChancellor/God-Mode-VibeSDE/main/install.sh | bash
#
# Finds your Claude Code CLI (installs it via npm if missing), adds the vibe-fde marketplace,
# installs god-mode-sde, and leaves it OFF by default (token-safe). Re-running is safe (idempotent).

set -u

info() { printf '\033[36m%s\033[0m\n' "$*"; }   # cyan
ok()   { printf '\033[32m%s\033[0m\n' "$*"; }   # green
warn() { printf '\033[33m%s\033[0m\n' "$*"; }   # yellow
oops() { printf '\033[31m%s\033[0m\n' "$*"; }   # red
say()  { printf '%s\n' "$*"; }

info ""
info "=== God-Mode SDE installer ==="
info ""

# Locate the Claude Code CLI: PATH -> bundled Desktop CLI -> npm.
find_claude() {
  if command -v claude >/dev/null 2>&1; then command -v claude; return 0; fi
  local base found
  for base in \
    "$HOME/Library/Application Support/Claude/claude-code" \
    "$HOME/.config/Claude/claude-code" \
    "$HOME/.claude/claude-code"; do
    if [ -d "$base" ]; then
      found="$(find "$base" -type f -name claude 2>/dev/null | sort -r | head -n1)"
      if [ -n "$found" ]; then printf '%s\n' "$found"; return 0; fi
    fi
  done
  return 1
}

CLAUDE="$(find_claude || true)"
if [ -z "${CLAUDE:-}" ]; then
  warn "Claude CLI not found — installing it via npm..."
  if command -v npm >/dev/null 2>&1; then
    npm install -g @anthropic-ai/claude-code || true
    CLAUDE="$(find_claude || true)"
  fi
fi
if [ -z "${CLAUDE:-}" ]; then
  oops "ERROR: Could not find or install the Claude CLI."
  oops "Install it once with:  npm install -g @anthropic-ai/claude-code"
  exit 1
fi
say "Using Claude CLI: $CLAUDE"
say ""

say "Adding marketplace (StielChancellor/God-Mode-VibeSDE)..."
"$CLAUDE" plugin marketplace add StielChancellor/God-Mode-VibeSDE || say "  (marketplace already added — ok)"

say "Installing plugin (god-mode-sde@vibe-fde)..."
"$CLAUDE" plugin install god-mode-sde@vibe-fde || say "  (plugin already installed — ok)"

say "Setting it OFF by default (token-safe)..."
"$CLAUDE" plugin disable god-mode-sde@vibe-fde --scope user || true

info ""
info "Current status:"
"$CLAUDE" plugin list || true

ok ""
ok "[OK] God-Mode SDE is installed and OFF by default (saves ~9.5k tokens/session where you don't need it)."
ok "To use it on a project: cd into the project, run the line below, then restart Claude:"
say "    claude plugin enable god-mode-sde@vibe-fde --scope project"
say "(If 'claude' isn't found in your terminal, install it once: npm install -g @anthropic-ai/claude-code)"
say ""
