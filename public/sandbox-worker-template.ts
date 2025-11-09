/**
 * Cloudflare Sandbox Worker Template
 *
 * This worker provides endpoints for executing code in a Cloudflare Sandbox.
 * Use this to replace the default worker code in your Cloudflare project.
 *
 * Setup:
 * 1. npm create cloudflare@latest my-sandbox
 * 2. Copy this file to src/index.ts
 * 3. Add sandbox configuration to wrangler.jsonc (see below)
 * 4. npm run dev
 *
 * Required wrangler.jsonc configuration:
 * {
 *   "name": "my-sandbox",
 *   "main": "src/index.ts",
 *   "compatibility_date": "2025-01-09",
 *   "durable_objects": {
 *     "bindings": [
 *       {
 *         "name": "Sandbox",
 *         "class_name": "Sandbox",
 *         "script_name": "my-sandbox"
 *       }
 *     ]
 *   },
 *   "migrations": [
 *     {
 *       "tag": "v1",
 *       "new_sqlite_classes": ["Sandbox"]
 *     }
 *   ]
 * }
 */

import { getSandbox } from '@cloudflare/sandbox';

// Export the Sandbox class (required for Durable Objects)
export { Sandbox } from '@cloudflare/sandbox';

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);

		// Get or create a sandbox instance
		const sandbox = getSandbox(env.Sandbox, 'my-sandbox');

		// CORS headers for browser requests
		const corsHeaders = {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type',
		};

		// Handle CORS preflight
		if (request.method === 'OPTIONS') {
			return new Response(null, { headers: corsHeaders });
		}

		try {
			// Endpoint 1: Execute Python code (accepts GET or POST)
			if (url.pathname === '/run') {
				let code = 'print(2 + 2)'; // default demo code

				// Accept code from POST body (for longer code) or query parameter (for demos)
				if (request.method === 'POST') {
					const body = await request.json();
					code = body.code || code;
				} else {
					code = url.searchParams.get('code') || code;
				}

				// Write code to temp file and execute (handles multi-line code)
				await sandbox.writeFile('/tmp/script.py', code);
				const result = await sandbox.exec('python3 /tmp/script.py');
				return Response.json(
					{
						stdout: result.stdout,
						stderr: result.stderr,
						exitCode: result.exitCode,
					},
					{ headers: corsHeaders }
				);
			}

			// Endpoint 2: File operations (demo)
			if (url.pathname === '/file') {
				await sandbox.writeFile('/workspace/hello.txt', 'Hello, Sandbox!');
				const file = await sandbox.readFile('/workspace/hello.txt');
				return Response.json(
					{
						content: file.content,
					},
					{ headers: corsHeaders }
				);
			}

			// Endpoint 3: Execute custom code (for blog integration)
			if (url.pathname === '/sandbox' && request.method === 'POST') {
				const body = await request.json();
				const { language, code } = body;

				// Convert to command format
				let command: string;
				if (language === 'python') {
					command = `python3 -c ${JSON.stringify(code)}`;
				} else if (language === 'javascript' || language === 'js') {
					command = `node -e ${JSON.stringify(code)}`;
				} else {
					return Response.json(
						{ error: 'Unsupported language' },
						{ status: 400, headers: corsHeaders }
					);
				}

				const result = await sandbox.exec(command);
				return Response.json(
					{
						stdout: result.stdout,
						stderr: result.stderr,
						exitCode: result.exitCode,
					},
					{ headers: corsHeaders }
				);
			}

			// Default: Show available endpoints
			return new Response(
				`Cloudflare Sandbox Worker

Available endpoints:
- GET  /run               - Execute Python code (optional ?code= parameter)
- POST /run               - Execute Python code (JSON body with "code" field)
- GET  /file              - File operations demo
- POST /sandbox           - Execute custom code (for blog integration)

Examples:
  curl http://localhost:8787/run
  curl "http://localhost:8787/run?code=print('Hello')"
  curl -X POST http://localhost:8787/run -H "Content-Type: application/json" -d '{"code":"print(1+1)"}'
  curl -X POST http://localhost:8787/sandbox -H "Content-Type: application/json" -d '{"language":"python","code":"print(1+1)"}'

To use with the blog:
1. Make sure this worker is running (npm run dev)
2. In the blog, click "Using deployed sandbox"
3. Enter: http://localhost:8787
4. Click "Use Local Sandbox"
`,
				{
					headers: {
						'Content-Type': 'text/plain',
						...corsHeaders,
					},
				}
			);
		} catch (error) {
			return Response.json(
				{
					error: error instanceof Error ? error.message : 'An error occurred',
				},
				{ status: 500, headers: corsHeaders }
			);
		}
	},
} satisfies ExportedHandler<Env>;
