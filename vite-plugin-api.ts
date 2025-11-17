import { Plugin } from 'vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function apiPlugin(): Plugin {
  return {
    name: 'vite-plugin-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url?.startsWith('/api/')) {
          try {
            // Extract the API route name
            const apiRoute = req.url.replace('/api/', '').split('?')[0];
            
            // Dynamically import the API handler using absolute path
            const handlerPath = path.join(__dirname, 'api', `${apiRoute}.ts`);
            console.log('[API Plugin] Loading handler:', handlerPath);
            
            const handler = await server.ssrLoadModule(handlerPath);
            
            // Create a Request object from the incoming request
            let body = '';
            if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
              await new Promise<void>((resolve) => {
                req.on('data', (chunk) => {
                  body += chunk.toString();
                });
                req.on('end', () => resolve());
              });
            }
            
            const protocol = req.headers['x-forwarded-proto'] || 'http';
            const url = `${protocol}://${req.headers.host}${req.url}`;
            
            const request = new Request(url, {
              method: req.method || 'GET',
              headers: req.headers as HeadersInit,
              body: body || undefined,
            });
            
            console.log('[API Plugin] Calling handler for:', req.method, req.url);
            
            // Call the handler
            const response = await handler.default(request);
            
            console.log('[API Plugin] Handler returned status:', response.status);
            
            // Send the response
            res.statusCode = response.status;
            response.headers.forEach((value, key) => {
              res.setHeader(key, value);
            });
            
            const responseBody = await response.text();
            res.end(responseBody);
          } catch (error) {
            console.error('[API Plugin] Error:', error);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ 
              error: 'Internal Server Error',
              message: error instanceof Error ? error.message : 'Unknown error'
            }));
          }
        } else {
          next();
        }
      });
    },
  };
}

