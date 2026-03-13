/**
 * Xenohuru Cloudflare Worker
 *
 * 1. Proxies /api/* requests to the DO backend (avoids mixed-content HTTPS→HTTP)
 * 2. Rewrites clean URL requests (e.g. /regions) to their .html asset internally
 */

const DO_API = 'http://159.65.119.182:8000';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Proxy all /api/* requests to the DO droplet (server-side — no mixed content)
    if (path.startsWith('/api/')) {
      const targetUrl = DO_API + path + url.search;
      const proxyRequest = new Request(targetUrl, {
        method: request.method,
        headers: request.headers,
        body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
        redirect: 'follow',
      });
      try {
        const response = await fetch(proxyRequest);
        const newHeaders = new Headers(response.headers);
        newHeaders.set('Access-Control-Allow-Origin', '*');
        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: newHeaders,
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: 'API unreachable', detail: String(err) }), {
          status: 502,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    // Handle CORS preflight for API routes
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    // Handle both clean URLs and legacy .html URLs
    if (path === '/' || path.match(/\.[a-zA-Z0-9]+$/) && !path.endsWith('.html')) {
      // Root or file with extension (but not .html) — serve directly
      return env.ASSETS.fetch(request);
    }

    // Legacy .html URL → redirect to clean URL
    if (path.endsWith('.html')) {
      const cleanPath = path.replace('.html', '') || '/';
      return Response.redirect(new URL(cleanPath, request.url).toString(), 301);
    }

    // Clean URL → try as .html file
    const htmlUrl = new URL(request.url);
    htmlUrl.pathname = path + '.html';
    const htmlResponse = await env.ASSETS.fetch(new Request(htmlUrl.toString(), request));

    if (htmlResponse.status === 200) {
      return htmlResponse;
    }

    return env.ASSETS.fetch(request);
  },
};
