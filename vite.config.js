import { defineConfig } from 'vite';
import { resolve } from 'path';
import { randomBytes } from 'crypto';

// Plugin to apply a nonce-based CSP during development
const cspNoncePlugin = () => {
  return {
    name: 'csp-nonce-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const nonce = randomBytes(16).toString('base64');
        // Make nonce available on res.locals and attach res to req for later access
        if (!res.locals) res.locals = {};
        res.locals.cspNonce = nonce;
        req.res = res;
        
        // Set CSP header for development
        res.setHeader(
          'Content-Security-Policy',
          `default-src 'self'; script-src 'self' 'nonce-${nonce}' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline'; img-src 'self' data:;`
        );
        next();
      });
    },
    transformIndexHtml(html, ctx) {
      const nonce = ctx.req?.res?.locals?.cspNonce;

      if (!nonce) {
        return html;
      }

      // Add nonce to all script tags.
      // Vite injects its own script tags, so we need to ensure they get the nonce.
      return html.replace(/<script/g, `<script nonce="${nonce}"`);
    }
  }
}


export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        void: resolve(__dirname, 'void/index.html'),
        clearLode: resolve(__dirname, 'clear-lode/index.html'),
        datascape: resolve(__dirname, 'datascape/index.html'),
        incarnation: resolve(__dirname, 'incarnation/index.html'),
        limbo: resolve(__dirname, 'limbo/index.html'),
      }
    }
  },
  server: {
    port: 8888
  },
  // Ensure audio worklets are copied to dist
  publicDir: 'public',
  // Enable CSP nonce plugin with development-friendly settings
  plugins: [cspNoncePlugin()]
});