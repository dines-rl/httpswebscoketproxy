const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
const port = process.env.port || 3000;

// Proxy configuration
const apiProxy = createProxyMiddleware({
  target:
    "https://t461i9k5lkzb-dc118956-dcbb-4fae-b4ef-0a8390fe1256.tunnel.runloop.ai",
  changeOrigin: true,
  ws: true, // Enable WebSocket proxying
  //   pathRewrite: {
  //     //"^/api/old-path": "/api/new-path", // Optional path rewrite
  //   },
  onError: (err, req, res) => {
    console.error("Proxy error:", err);
    res.status(500).send("Proxy error");
  },
});

// Apply middleware for the API path
app.use("/", apiProxy);

// This will handle HTTP GET requests to any path
app.get("*", (req, res) => {
  res.send("This is a proxy server. Does not serve content directly.");
});

// Start the server
app.listen(port, () => {
  console.log(`Proxy server listening on http://localhost:${port}`);
});
