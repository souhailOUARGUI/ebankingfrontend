import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import cors from 'cors';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

// Enable CORS for all routes
app.use(cors({
  origin: ['http://localhost:4200', 'http://localhost:4000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON bodies
app.use(express.json());

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/**', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

// API proxy for the backend server
app.use('/api', async (req, res) => {
  const targetUrl = `http://localhost:8085${req.url}`;

  try {
    // Create headers object from the original request
    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (value && key !== 'host' && key !== 'connection') {
        headers.append(key, Array.isArray(value) ? value[0] : value.toString());
      }
    }

    // Ensure content-type is set for POST/PUT requests
    if (req.method === 'POST' || req.method === 'PUT') {
      headers.set('Content-Type', 'application/json');
    }

    // Create request options
    const fetchOptions = {
      method: req.method,
      headers: headers,
      body: ['POST', 'PUT', 'PATCH'].includes(req.method) ? JSON.stringify(req.body) : undefined
    };

    console.log(`Proxying ${req.method} request to: ${targetUrl}`);
    console.log('Request body:', req.body);

    const response = await fetch(targetUrl, fetchOptions);

    // Copy status and headers
    res.status(response.status);
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    // Send the response body
    const data = await response.text();
    console.log(`Response from backend (${response.status}):`, data.substring(0, 200) + (data.length > 200 ? '...' : ''));
    res.send(data);
  } catch (error) {
    console.error('API proxy error:', error);
    res.status(500).json({
      error: 'Failed to connect to backend server',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use('/**', (req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
