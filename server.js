const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
const port = process.env.PORT || 3000;

// Create a single instance of createProxyMiddleware
const apiProxy = createProxyMiddleware({
  changeOrigin: true,
  pathRewrite: {
    // Rewrite the path to remove '/:tunnelToken/proxy/' and keep everything after
    "^/[^/]+/proxy/(.*)$": "/$1",
  },
  ws: true, // Enable WebSocket proxying
  onError: (err, req, res) => {
    console.error("Proxy error:", err);
    res.status(500).send("Proxy error");
  },
  router: (req) => {
    const { tunnelToken } = req.params;
    // Construct the target URL using the tunnelToken
    return `https://${tunnelToken}.tunnel.runloop.ai`;
  },
});

// Apply middleware for the API path
app.use("/:tunnelToken/proxy/*", apiProxy);
app.use("/:tunnelToken/proxy", apiProxy);

// This will handle HTTP GET requests to any path
app.get("/", (req, res) => {
  res.send("This is a proxy server. Does not serve content directly.");
});

// This will handle HTTP GET requests to any path
app.get("/health", (req, res) => {
  res.send("Super healthy");
});

// Start the server
app.listen(port, () => {
  console.log(`Proxy server listening on http://localhost:${port}`);
});
