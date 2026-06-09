// PreToolUse(Bash): hard-block dangerous shell commands. OWASP/ops hygiene.
// NOTE: these are best-effort heuristics, not a security boundary — regex command
// filtering is inherently bypassable (it widens common-case coverage and fails open).
import { readStdin, hardBlock, advise } from './_lib.mjs';

const inp = await readStdin();
const cmd = String(inp?.tool_input?.command ?? '');
if (!cmd.trim()) process.exit(0);

const findings = [];
const add = (r) => findings.push(r);

// --- POSIX rm -rf on a root/home/critical/glob target, or --no-preserve-root ---
const recursiveForce =
  /\brm\s+-[a-z]*r[a-z]*f[a-z]*\b/i.test(cmd) ||
  /\brm\s+-[a-z]*f[a-z]*r[a-z]*\b/i.test(cmd) ||
  (/\brm\b[^\n]*\s-[a-z]*r/i.test(cmd) && /\brm\b[^\n]*\s-[a-z]*f/i.test(cmd));
// Critical absolute paths (allowlist-of-danger — keeps project-relative deletes like
// `rm -rf node_modules`/`dist` allowed on purpose).
const CRITICAL = /(?:^|[\s"'(=])(?:\/(?:etc|usr|var|bin|sbin|lib|lib64|boot|opt|sys|proc|dev|root|home|Users|System|Library|Applications)(?:\/|\b))/;
const dangerTarget =
  /(?:^|\s)(?:\/(?:\s|$)|~(?:\/|\s|$)|\$HOME\b|\$\{HOME\}|\*(?:\s|$)|\/\*)/.test(cmd) ||  // bare /, ~, $HOME, *, /*
  /(?:^|\s)["']\/["']/.test(cmd) ||                                                       // quoted root "/" '/'
  CRITICAL.test(cmd);
// Ephemeral build/dependency dirs are safe to delete even under a home path (common false positive).
const BUILD_DIR = /\b(?:node_modules|dist|build|out|coverage|\.cache|\.next|\.nuxt|\.turbo|\.svelte-kit|\.parcel-cache|__pycache__|\.pytest_cache|\.gradle|\.venv|target)(?:[\/\\"'`\s]|$)/i;
// Targets that NEVER get the build-dir pass: bare/quoted root, ~/$HOME/glob, system dirs, a home-USER
// dir itself (not a deeper path under it — blocks `rm -rf /home/me` and the `... /home/me node_modules`
// bypass), or a Windows drive/system root.
const HARD_DANGER =
  /--no-preserve-root/.test(cmd) ||
  /(?:^|\s)(?:\/(?:\s|$)|~(?:\/|\s|$)|\$\{?HOME\}?\b|\*(?:\s|$)|\/\*)/.test(cmd) ||
  /(?:^|\s)["']\/["']/.test(cmd) ||
  /(?:^|[\s"'(=])\/(?:etc|usr|var|bin|sbin|lib|lib64|boot|opt|sys|proc|dev|root|System|Library|Applications)(?:\/|\b)/.test(cmd) ||
  /(?:^|\s)\/(?:home|Users)\/[^\/\s]+(?:\s|$)/.test(cmd) ||
  /(?:^|\s)[A-Za-z]:\\Users\\[^\\\s]+(?:\\?\s|\\?$)/i.test(cmd) ||
  /[A-Za-z]:\\(?:Windows|System32|Program Files)\b/i.test(cmd) ||
  /[A-Za-z]:\\(?:\*|\s|$|["'`])/.test(cmd);
const buildDirException = BUILD_DIR.test(cmd) && !HARD_DANGER;

if (/--no-preserve-root/.test(cmd) || (recursiveForce && dangerTarget && !buildDirException))
  add('Destructive recursive force-delete (rm -rf) on a root/home/critical/glob target');

// find-based mass delete on a root/critical path
if ((/\bfind\b[^\n]*\s-delete\b/.test(cmd) || /\bfind\b[^\n]*-exec\s+rm\b/i.test(cmd)) && dangerTarget && !buildDirException)
  add('Recursive find -delete / find -exec rm on a root/critical path');

// --- Windows / PowerShell destructive deletes (host may be win32) ---
const winTarget = /(?:[A-Za-z]:\\(?:\*|\s|$|["'`])|[A-Za-z]:\\(?:Windows|System32|Users|Program Files)\b|%SystemRoot%|%USERPROFILE%|%SystemDrive%|\$env:(?:SystemRoot|SystemDrive|USERPROFILE|HOMEPATH)|\$HOME\b|(?:^|\s)~(?:\\|\/|\s|$))/i;
const winRemove = /\b(?:Remove-Item|ri|rmdir|rd|del|erase)\b/i;
const winRecurse = /(?:-Recurse\b|\s-r\b|\/s\b)/i;
const winForce = /(?:-Force\b|\s-fo?\b|\/q\b|\/f\b)/i;
if (winRemove.test(cmd) && winRecurse.test(cmd) && winForce.test(cmd) && winTarget.test(cmd) && !buildDirException)
  add('Destructive recursive delete on a Windows drive root/home (Remove-Item -Recurse -Force / rd /s /q / del /f /s /q)');
if (/\bformat\b\s+[A-Za-z]:/i.test(cmd) || /\bFormat-Volume\b/i.test(cmd) || /\bClear-Disk\b/i.test(cmd) || /\bcipher\b[^\n]*\/w\b/i.test(cmd))
  add('Windows disk/volume format or secure-wipe (format / Format-Volume / Clear-Disk / cipher /w)');

// disk wipe / raw device write
if (/\bmkfs(?:\.\w+)?\b/.test(cmd) || /\bdd\b[^\n]*\bof=\/dev\/(?:sd|nvme|disk|hd|mmcblk)/.test(cmd))
  add('Direct disk format/overwrite (mkfs / dd of=/dev/...)');

// fork bomb
if (/:\s*\(\s*\)\s*\{\s*:\s*\|\s*:\s*&\s*\}\s*;?\s*:/.test(cmd) || /\(\)\s*\{\s*:\|:&\s*\}/.test(cmd))
  add('Fork bomb');

// remote code execution: pipe download to a shell / interpreter.
// `[^\n]*` (not `[^\n|]*`) tolerates intermediate stages, e.g. `curl x | cat | bash`.
if (/(?:curl|wget|fetch|aria2c)\b[^\n]*\|\s*(?:sudo\s+)?(?:ba|z|d|k|a|c|fi|tc)?sh\b/i.test(cmd))
  add('Piping a remote download into a shell (curl|bash)');
if (/\b(?:iwr|irm|curl|wget|invoke-webrequest|invoke-restmethod|start-bitstransfer)\b[^\n]*\|\s*(?:iex|invoke-expression)\b/i.test(cmd) ||
    /\b(?:iwr|irm|invoke-webrequest|invoke-restmethod)\b[^\n]*;\s*(?:iex|invoke-expression|&)\b/i.test(cmd))
  add('Downloading and executing via PowerShell (iwr|iex / Invoke-Expression)');
if (/\bbase64\s+(?:-d|--decode|-D)\b[^\n]*\|\s*(?:ba|z|d|k|a|c|fi|tc)?sh\b/i.test(cmd))
  add('Decoding base64 and piping into a shell');

// world-writable perms
if (/\bchmod\s+(?:-R\s+)?0?777\b/.test(cmd)) add('chmod 777 (world-writable permissions)');

// force-push to a protected branch
if (/\bgit\s+push\b[^\n]*(?:--force(?!-with-lease)\b|\s-f\b)[^\n]*\b(?:main|master|production|release)\b/.test(cmd) ||
    /\bgit\s+push\b[^\n]*\b(?:main|master|production|release)\b[^\n]*(?:--force(?!-with-lease)\b|\s-f\b)/.test(cmd))
  add('Force-push to a protected branch (main/master/production)');

// disabling TLS / certificate verification
if (/NODE_TLS_REJECT_UNAUTHORIZED\s*=\s*0/.test(cmd) ||
    /\bcurl\b[^\n]*\s(?:-k|--insecure)\b/.test(cmd) ||
    /git\s+-c\s+http\.sslVerify=false/.test(cmd) ||
    /\bGIT_SSL_NO_VERIFY\s*=/.test(cmd) ||
    /sslVerify\s*=\s*false/i.test(cmd))
  add('Disabling TLS/certificate verification');

// secret exfiltration: reads sensitive credential file AND has network egress
const sensitive = /(?:~\/\.ssh\/|\/\.ssh\/id_|\.aws\/credentials|(?:^|\s|\/)\.env\b|\.netrc\b|\bid_rsa\b|\.kube\/config|\.npmrc\b)/;
const egress = /\b(?:curl|wget|nc|ncat|netcat|scp|sftp|ftp|telnet|aria2c|fetch|Invoke-WebRequest|Invoke-RestMethod|Start-BitsTransfer|iwr|irm)\b/i;
if (sensitive.test(cmd) && egress.test(cmd))
  add('Possible secret exfiltration (reads credentials AND sends them over the network)');

if (findings.length)
  hardBlock('PreToolUse', `VibeGod Tech Team blocked a dangerous shell command:\n- ${findings.join('\n- ')}\n\nIf this is genuinely required, run it yourself, or set VIBEGOD_GUARDRAILS=advisory to downgrade blocks to warnings.`);

// Advisory (non-blocking): recursive force-delete whose target is a shell variable we can't
// resolve statically — could expand to / or $HOME. Too noisy to hard-block.
if (recursiveForce && /\brm\b[^\n]*\s["']?\$\{?\w+\}?/.test(cmd) && !/\$\{?HOME\}?\b/.test(cmd))
  advise('PreToolUse', '[VIBEGOD advisory] `rm -rf` targets a shell variable — confirm it cannot expand to `/`, `~`, or a critical path before running.');

process.exit(0);
