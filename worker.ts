import { ExecutionContext } from "@cloudflare/workers-types";

export default {
    async fetch(request: Request, env: unknown, ctx: ExecutionContext): Promise<Response> {
        // With assets binding, fetch requests for static assets are handled automatically so user worker code is only invoked when no asset is found.

        const url = new URL(request.url);
        
         // If request is for an asset that doesn't exist, we serve index.html for SPA routing
        if (url.pathname.startsWith("/api")) {
             // Handle API requests if any
             return new Response("Not Found", { status: 404 });
        }

       // Serve index.html for client-side routing
       // Since allow_assets_binding is enabled, we can assume index.html is served if not found?
       // Actually, with assets binding configured in wrangler.toml, unhandled requests fall through to assets
       // BUT explicit `assets` binding usage within worker requires `env.ASSETS.fetch(request)`
       // However, the modern "Workers Assets" (beta) integrates assets directly.
       // Let's stick to the binding approach for clarity if using `assets = { binding = "ASSETS" }`

       // If using `assets` binding:
       // return (env as any).ASSETS.fetch(request);
       
       // Correct approach for SPA with Assets binding:
       // Try to serve the asset. If it's a 404 and not an API call, serve index.html
       
       const ASSETS = (env as any).ASSETS;
       const response = await ASSETS.fetch(request);
       
       if (response.status === 404 && !url.pathname.startsWith("/api")) {
           return ASSETS.fetch(new Request(new URL("/index.html", request.url), request));
       }
       
       return response;
    },
};
