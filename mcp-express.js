const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const port = 3001;

// Configure CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'apikey', 'Range'],
}));

// Add a health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Proxy all other requests to Supabase Studio
app.use('/', createProxyMiddleware({
  target: 'http://localhost:54323',
  changeOrigin: true,
  ws: true,
  pathRewrite: {
    '^/api': '/api',  // no rewrite
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`Proxying request to: ${req.method} ${req.url}`);
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).send('Proxy Error');
  }
}));

app.listen(port, () => {
  console.log(`Supabase MCP proxy listening on port ${port}`);
  console.log(`Proxying requests to http://localhost:54323`);
}); 