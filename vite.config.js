import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'

function apiDevServerPlugin() {
  const localUsers = [];

  return {
    name: 'api-dev-server',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/admin/login' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const { username, password } = JSON.parse(body || '{}');
              if ((username || '').toLowerCase() === 'admin' && password === 'SieloAdmin@2026') {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true, username: 'admin', token: 'dev_token_' + Date.now() }));
                return;
              }
            } catch {}
            res.statusCode = 401;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Invalid credentials' }));
          });
          return;
        }

        if (req.url === '/api/admin/users') {
          if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', () => {
              try {
                const user = JSON.parse(body || '{}');
                const idx = localUsers.findIndex(u => u.id === user.id || u.email === user.email);
                if (idx >= 0) {
                  localUsers[idx] = { ...localUsers[idx], ...user };
                } else {
                  localUsers.unshift(user);
                }
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true, user }));
              } catch {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
              }
            });
            return;
          }

          if (req.method === 'GET') {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, users: localUsers }));
            return;
          }
        }

        next();
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    apiDevServerPlugin()
  ],
})
