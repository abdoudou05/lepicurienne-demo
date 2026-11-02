/**
 * Worker entry for lepicuriennebywaycha.ca. The site itself is the Vite build
 * (dist/public) served by Workers static assets; wrangler.json routes only
 * /api/* through this code (run_worker_first), so pages keep the headers
 * from client/public/_headers and the SPA fallback.
 */
import { handleContact, type ContactEnv } from './contact';

interface Env extends ContactEnv {
  ASSETS: { fetch(request: Request): Promise<Response> };
}

const worker = {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);
    if (pathname === '/api/contact') return handleContact(request, env);
    return env.ASSETS.fetch(request);
  },
};

export default worker;
