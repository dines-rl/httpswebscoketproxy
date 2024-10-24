const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
const port = process.env.port || 3000;

// Apply middleware for the API path
app.use("/:tunnelToken", (req, res, next) => {
  const { tunnelToken } = req.params;
  // Construct the target URL using the tunnelToken
  const targetUrl = `https://${tunnelToken}.tunnel.runloop.ai`;

  const apiProxy = createProxyMiddleware({
    target: targetUrl,
    changeOrigin: true,
    ws: true, // Enable WebSocket proxying
    onError: (err, req, res) => {
      console.error("Proxy error:", err);
      res.status(500).send("Proxy error");
    },
  });
  apiProxy(req, res, next); // Apply the proxy middleware
});

// This will handle HTTP GET requests to any path
app.get("*", (req, res) => {
  res.send("This is a proxy server. Does not serve content directly.");
});

// Start the server
app.listen(port, () => {
  console.log(`Proxy server listening on http://localhost:${port}`);
});
