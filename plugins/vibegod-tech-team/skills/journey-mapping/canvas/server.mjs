// VibeGod Tech Team — local journey canvas server. Dependency-free, localhost-only.
// Usage: node server.mjs [path-to-journey.json] [--port 4521]
// Lets the user drag/drop/connect/comment/insert journey steps; persists to JSON the agent reads.
import { createServer } from 'node:http';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const portArg = (() => { const i = args.indexOf('--port'); return i >= 0 ? parseInt(args[i + 1], 10) : null; })();
const PORT = portArg || parseInt(process.env.JOURNEY_CANVAS_PORT || '4521', 10);
const fileArg = args.find((a) => !a.startsWith('--') && a !== String(portArg));
const STATE_FILE = fileArg
  ? (isAbsolute(fileArg) ? fileArg : join(process.cwd(), fileArg))
  : join(process.env.CLAUDE_PROJECT_DIR || process.cwd(), '.journey-canvas-state.json');

const SAMPLE = {
  title: 'New Journey',
  nodes: [
    { id: 'n1', label: 'Landing', type: 'ui', x: 80, y: 120, comment: '' },
    { id: 'n2', label: 'Auth (API)', type: 'backend', x: 360, y: 120, comment: '' },
    { id: 'n3', label: 'Dashboard', type: 'ui', x: 640, y: 120, comment: '' },
  ],
  edges: [
    { from: 'n1', to: 'n2', label: 'sign in' },
    { from: 'n2', to: 'n3', label: 'token ok' },
  ],
};

function loadState() {
  try { if (existsSync(STATE_FILE)) return JSON.parse(readFileSync(STATE_FILE, 'utf8')); } catch {}
  return SAMPLE;
}
function saveState(obj) { writeFileSync(STATE_FILE, JSON.stringify(obj, null, 2), 'utf8'); }

const HTML = join(HERE, 'index.html');

// Reject any request that isn't same-origin localhost. The server binds to 127.0.0.1, but that
// alone doesn't stop DNS-rebinding or a cross-site POST to /save (the saved JSON is later read
// back into the agent's context, so a forged write is an indirect prompt-injection vector).
const LOCAL = /^(?:localhost|127\.0\.0\.1|\[::1\]|::1)(?::\d+)?$/i;
const LOCAL_ORIGIN = /^https?:\/\/(?:localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/i;
function isLocal(req) {
  if (!LOCAL.test(String(req.headers.host || ''))) return false;
  const origin = req.headers.origin;
  return !origin || LOCAL_ORIGIN.test(origin);
}

const server = createServer((req, res) => {
  if (!isLocal(req)) { res.writeHead(403, { 'Content-Type': 'text/plain' }); return res.end('forbidden'); }
  const url = (req.url || '/').split('?')[0];
  if (req.method === 'GET' && (url === '/' || url === '/index.html')) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end(readFileSync(HTML, 'utf8'));
  }
  if (req.method === 'GET' && url === '/journey') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(loadState()));
  }
  if (req.method === 'POST' && url === '/save') {
    let body = '';
    req.on('data', (c) => { body += c; if (body.length > 5_000_000) req.destroy(); });
    req.on('end', () => {
      try {
        const obj = JSON.parse(body);
        if (!obj || !Array.isArray(obj.nodes) || !Array.isArray(obj.edges)) throw new Error('bad shape');
        saveState(obj);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true, file: STATE_FILE }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, error: String(e.message || e) }));
      }
    });
    return;
  }
  if (url === '/health') { res.writeHead(200); return res.end('ok'); }
  res.writeHead(404); res.end('not found');
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`\nVibeGod journey canvas → http://localhost:${PORT}`);
  console.log(`Editing: ${STATE_FILE}`);
  console.log('The agent reads this JSON file after you save. Ctrl+C to stop.\n');
});
