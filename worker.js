/**
 * Xenohuru Cloudflare Worker
 *
 * Rewrites clean URL requests (e.g. /regions) to their .html asset
 * (e.g. src/regions.html) so the static site works without .html extensions.
 */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Already has a file extension or is root — serve directly
    if (path === '/' || path.match(/\.[a-zA-Z0-9]+$/)) {
      return env.ASSETS.fetch(request);
    }

    // Try the clean path as a .html file
    const htmlUrl = new URL(request.url);
    htmlUrl.pathname = path + '.html';
    const htmlResponse = await env.ASSETS.fetch(new Request(htmlUrl.toString(), request));

    // If found, serve it (200); otherwise fall back to 404.html via assets
    if (htmlResponse.status === 200) {
      return htmlResponse;
    }

    return env.ASSETS.fetch(request);
  },
};
